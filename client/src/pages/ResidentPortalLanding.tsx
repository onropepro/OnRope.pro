import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { PublicHeader } from "@/components/PublicHeader";
import { FreeTrialButton } from "@/components/FreeTrialButton";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { EmployerRegistration } from "@/components/EmployerRegistration";
import { SoftwareReplaces, MODULE_SOFTWARE_MAPPING } from "@/components/SoftwareReplaces";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import {
  MessageSquare,
  ArrowRight,
  BookOpen,
  Briefcase,
  Home,
  HardHat,
  Users,
  ClipboardList,
  Building2,
  Camera,
  Eye,
  Clock,
  MessageCircle,
  Globe,
  BarChart3,
  TrendingUp,
  Shield,
  Palette,
  Sparkles,
  DollarSign,
  Phone,
  Award,
  Zap
} from "lucide-react";

export default function ResidentPortalLanding() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [returnVisits, setReturnVisits] = useState(0);
  const [phoneSaved, setPhoneSaved] = useState(0);
  const [resolution, setResolution] = useState(0);
  const [controlPercentage, setControlPercentage] = useState(0);
  const { openLogin } = useAuthPortal();
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    let currentReturnVisits = 0;
    let currentPhoneSaved = 0;
    let currentResolution = 0;
    let currentControl = 0;
    
    const interval = setInterval(() => {
      if (currentReturnVisits < 5) { currentReturnVisits++; setReturnVisits(currentReturnVisits); }
      if (currentPhoneSaved < 25) { currentPhoneSaved++; setPhoneSaved(currentPhoneSaved); }
      if (currentResolution < 24) { currentResolution++; setResolution(currentResolution); }
      if (currentControl < 100) { currentControl++; setControlPercentage(currentControl); }
      
      if (currentReturnVisits === 5 && currentPhoneSaved === 25 && currentResolution === 24 && currentControl === 100) {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="modules" />
      
      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              {t('modules.residentPortal.hero.badge', 'Resident Portal Module')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('modules.residentPortal.hero.title', 'Complaints handled while your crews')}<br />
              <span className="text-blue-100">{t('modules.residentPortal.hero.titleHighlight', 'are still on the ropes.')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('modules.residentPortal.hero.description', 'Residents submit feedback with photos. Your team sees it in real-time. Issues get resolved before the van leaves the parking lot.')}<br />
              <strong>{t('modules.residentPortal.hero.descriptionBold', 'No more phone tag. No more return visits. No more notebooks.')}</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <FreeTrialButton 
                className="bg-white text-[#0B64A3] hover:bg-blue-50" 
                onClick={() => setShowRegistration(true)} 
                testId="button-hero-trial"
              />
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={openLogin} data-testid="button-hero-signin">
                Sign In
              </Button>
            </div>
            
            <SoftwareReplaces 
              software={MODULE_SOFTWARE_MAPPING["resident-portal"]} 
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
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">{returnVisits}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.residentPortal.stats.returnVisits', 'Return visits prevented/mo')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">{phoneSaved}h</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.residentPortal.stats.phoneSaved', 'Phone time saved/mo')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">{resolution}h</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.residentPortal.stats.resolution', 'Avg resolution time')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-rose-600">{controlPercentage}%</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.residentPortal.stats.visibility', 'Visibility maintained')}</div>
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
            {t('modules.residentPortal.problem.title', 'The Complaint Problem Nobody Budgets For')}
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                {t('modules.residentPortal.problem.scenario', 'A resident in unit 1247 emails about streaks on her window. A week later, she calls the building manager. The building manager calls you. You check your notebook. Maybe the email got lost. Maybe it didn\'t.')}
              </p>
              <p>
                {t('modules.residentPortal.problem.waste', 'Now three people are spending time on something that might have been resolved in 10 minutes if anyone had known about it while the crew was still in the building.')}
              </p>
              <p className="font-medium text-foreground">
                {t('modules.residentPortal.problem.cost', 'That 10-minute fix? It becomes a half-day labor cost.')}
              </p>
              <p>
                {t('modules.residentPortal.problem.returnVisit', 'Packing equipment, loading the van, driving across town, rigging ropes for one window, cleaning it, derigging, driving back. You\'ve done the math. You know what those return visits cost.')}
              </p>
              <Separator className="my-6" />
              <p>
                {t('modules.residentPortal.problem.multiply', 'And that\'s just one complaint. During busy season, multiply it by buildings, by units, by the residents who give up entirely and complain on social media instead.')}
              </p>
              <p className="font-medium text-foreground text-lg">
                {t('modules.residentPortal.problem.solution', 'OnRopePro\'s Resident Portal puts feedback in front of your team while crews are still on-site. Residents submit issues with photos. Your supervisor sees a notification. The technician already rigged on that elevation flips their rope and checks the window. Problem solved in minutes, not days.')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* What This Module Does Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.residentPortal.features.title', 'What This Module Does')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.residentPortal.features.subtitle', 'Direct communication between residents and your company. Complete visibility for property managers. Zero phone tag.')}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.residentPortal.features.feedback.title', 'Resident Feedback System')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  {t('modules.residentPortal.features.feedback.description', 'Residents submit feedback once with their description and optional photo. Name, unit number, and phone auto-fill from their account. Your team sees it immediately in the project dashboard with a notification badge.')}
                </p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{t('modules.residentPortal.features.feedback.capturedLabel', 'What gets captured:')}</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('modules.residentPortal.features.feedback.captured1', 'Description of issue with optional photo evidence')}</li>
                    <li>{t('modules.residentPortal.features.feedback.captured2', 'Unit number and resident contact info (auto-filled)')}</li>
                    <li>{t('modules.residentPortal.features.feedback.captured3', 'Timestamp of submission')}</li>
                    <li>{t('modules.residentPortal.features.feedback.captured4', 'Timestamp of when your team first viewed it')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.residentPortal.features.communication.title', 'Two-Way Communication')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  {t('modules.residentPortal.features.communication.description', 'Your staff respond through internal notes (private) or visible replies (resident sees). Residents can reply to visible messages. The complete conversation history stays attached to that feedback item forever.')}
                </p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{t('modules.residentPortal.features.communication.trackedLabel', 'What gets tracked:')}</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('modules.residentPortal.features.communication.tracked1', 'All messages between staff and resident')}</li>
                    <li>{t('modules.residentPortal.features.communication.tracked2', 'Which messages are internal vs. visible')}</li>
                    <li>{t('modules.residentPortal.features.communication.tracked3', 'Status changes (New, Viewed, Closed)')}</li>
                    <li>{t('modules.residentPortal.features.communication.tracked4', 'Resolution timestamps for performance metrics')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.residentPortal.features.progress.title', 'Project Progress Visibility')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  {t('modules.residentPortal.features.progress.description', 'Residents view real-time project progress showing which elevation or side of the building is being worked on. They check status before calling to ask "when will you do my window?"')}
                </p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{t('modules.residentPortal.features.progress.seeLabel', 'What residents see:')}</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('modules.residentPortal.features.progress.see1', 'Current elevation being worked (North, South, East, West)')}</li>
                    <li>{t('modules.residentPortal.features.progress.see2', 'Overall completion percentage')}</li>
                    <li>{t('modules.residentPortal.features.progress.see3', 'Scheduled project dates')}</li>
                    <li>{t('modules.residentPortal.features.progress.see4', 'Active status indicators')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Who Benefits From This Module Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.residentPortal.benefits.title', 'Who Benefits From This Module')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.residentPortal.benefits.subtitle', 'Five stakeholder types. Five different problems solved. One unified system.')}
          </p>

          <div className="space-y-8">
            {/* For Employers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.residentPortal.benefits.employers.title', 'For Employers (Company Owners)')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.residentPortal.benefits.employers.benefit1Title', 'Eliminate return visits that cost half a day.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.residentPortal.benefits.employers.benefit1Desc', 'When complaints come in a week after the job, you\'re sending someone back. Real-time feedback means issues get addressed while crews are still on-site. One prevented return visit per month pays for the entire system.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.residentPortal.benefits.employers.benefit2Title', 'Win contracts by demonstrating operational excellence.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.residentPortal.benefits.employers.benefit2Desc', 'When a property manager compares your bid against a competitor, show them your resolution time metrics. You handle feedback systematically. They rely on phone calls and emails. The choice becomes obvious.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.residentPortal.benefits.employers.benefit3Title', 'Stop drowning in complaint phone calls.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.residentPortal.benefits.employers.benefit3Desc', 'Every complaint phone call interrupts work, requires documentation, and needs follow-up. The mental load of tracking dozens of open issues across multiple buildings disappears when the system organizes everything automatically.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Operations Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-sky-50 dark:bg-sky-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-sky-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.residentPortal.benefits.operations.title', 'For Operations Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.residentPortal.benefits.operations.benefit1Title', 'See all open issues per building in one view.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.residentPortal.benefits.operations.benefit1Desc', 'Five complaints come in for Building A on Monday, three more on Wednesday. Batch your deficiency visits efficiently because you can see what\'s open and where without reconstructing it from emails and voicemails.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.residentPortal.benefits.operations.benefit2Title', 'Prove you did the work.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.residentPortal.benefits.operations.benefit2Desc', 'A resident claims their window was never cleaned. Without documentation, you redo the work. With photo evidence, timestamps, and internal notes documenting investigation findings, you resolve disputes definitively.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.residentPortal.benefits.operations.benefit3Title', 'Coordinate without exposing sensitive discussions.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.residentPortal.benefits.operations.benefit3Desc', 'Internal notes let you write "check if this is from the previous contractor" or "dirt is on the inside, document for liability" without the resident seeing it. Clear toggle prevents accidental visibility.')}</p>
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
                  <CardTitle className="text-xl">{t('modules.residentPortal.benefits.technicians.title', 'For Technicians')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.residentPortal.benefits.technicians.benefit1Title', 'Get feedback while you\'re still on the building.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.residentPortal.benefits.technicians.benefit1Desc', 'You finish the west elevation on Tuesday. On Friday, a complaint comes in. Without the portal, you\'re context-switching back to a building you thought was complete. With real-time feedback, you address issues same-day while the work is fresh and equipment is deployed.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.residentPortal.benefits.technicians.benefit2Title', 'Stop getting blamed for things outside your control.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.residentPortal.benefits.technicians.benefit2Desc', 'The resident on the floor above watered their plants and dripped onto the window. Without documentation, you look incompetent. Internal notes let you document what actually happened, protecting your professional reputation.')}</p>
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
                  <CardTitle className="text-xl">{t('modules.residentPortal.benefits.propertyManagers.title', 'For Property Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.residentPortal.benefits.propertyManagers.benefit1Title', 'Get out of the middle.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.residentPortal.benefits.propertyManagers.benefit1Desc', 'When residents have issues, they call you. You call the vendor. You wait. You call the resident back. The resident portal removes you from the communication loop while maintaining complete visibility into every conversation.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.residentPortal.benefits.propertyManagers.benefit2Title', 'Evaluate vendor responsiveness with actual data.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.residentPortal.benefits.propertyManagers.benefit2Desc', 'When contract renewal comes, you have objective metrics. Average response time. Resolution time. You make data-driven decisions instead of relying on gut feel and scattered complaints.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.residentPortal.benefits.propertyManagers.benefit3Title', 'See the full context when escalations happen.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.residentPortal.benefits.propertyManagers.benefit3Desc', 'A resident insists their window wasn\'t cleaned. The vendor insists it was. When the resident escalates to you, view the complete feedback history including all messages, timestamps, and status changes.')}</p>
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
                  <CardTitle className="text-xl">{t('modules.residentPortal.benefits.residents.title', 'For Building Residents')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.residentPortal.benefits.residents.benefit1Title', 'Know your complaint was received and when it was seen.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.residentPortal.benefits.residents.benefit1Desc', 'Every submission is logged with a timestamp. You see the exact date and time when the company first opened your feedback. No more wondering if your email got lost.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.residentPortal.benefits.residents.benefit2Title', 'Submit once, with photos, and you\'re done.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.residentPortal.benefits.residents.benefit2Desc', 'Describe your issue, attach a photo, submit. Your name, unit number, and phone auto-fill. No repeating yourself to the property manager, then the vendor, then the technician.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.residentPortal.benefits.residents.benefit3Title', 'Check project progress before asking "are you done yet?"')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.residentPortal.benefits.residents.benefit3Desc', 'See which side of the building crews are working on. If they haven\'t reached the north side yet, you\'ll know before calling to complain about your north-facing window.')}</p>
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            {t('modules.residentPortal.keyFeatures.title', 'Key Features')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.residentPortal.keyFeatures.subtitle', 'Every feature exists because Tommy tracked complaints in a notebook, sometimes on his hand while driving.')}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.residentPortal.keyFeatures.viewedTimestamp.title', 'Viewed Timestamp Visibility')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.residentPortal.keyFeatures.viewedTimestamp.description', 'Residents see exactly when their feedback was first opened by your company. No more "I didn\'t see it" excuses. If someone on your team opened it, there\'s a timestamp proving it.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.residentPortal.keyFeatures.photoEvidence.title', 'Photo Evidence Upload')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.residentPortal.keyFeatures.photoEvidence.description', 'Residents attach photos directly to their feedback. No more email threads asking for documentation. When a resident reports a water stain, you have the photo immediately.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.residentPortal.keyFeatures.internalNotes.title', 'Internal Notes System')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.residentPortal.keyFeatures.internalNotes.description', 'Staff coordinate privately without exposing sensitive discussions to residents. The yellow/red checkbox toggle makes it explicit when a reply will be visible to the resident.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.residentPortal.keyFeatures.portableAccounts.title', 'Portable Resident Accounts')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.residentPortal.keyFeatures.portableAccounts.description', 'When a resident moves from Toronto to Chicago, they keep their OnRopePro account. They update their Strata/LMS number and enter the new vendor\'s code. If their new building\'s vendor doesn\'t use OnRopePro, they notice.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.residentPortal.keyFeatures.resolutionMetrics.title', 'Resolution Time Metrics')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.residentPortal.keyFeatures.resolutionMetrics.description', 'The system calculates average response and resolution times automatically. Property managers see this data when evaluating vendors. Your resolution time becomes part of your competitive advantage.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.residentPortal.keyFeatures.progressTracking.title', 'Real-Time Progress Tracking')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.residentPortal.keyFeatures.progressTracking.description', 'Residents view which elevation is being worked on and overall completion percentage. They self-serve status information instead of calling to ask "when will you do my window?"')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Measurable Results Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.residentPortal.results.title', 'Measurable Results')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.residentPortal.results.subtitle', 'Concrete savings you\'ll see from day one.')}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.residentPortal.results.returnVisits.title', 'Eliminated Return Visits')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.residentPortal.results.returnVisits.description', 'Average cost of a deficiency return visit: $200-400 (half-day labor + travel). Real-time feedback prevents 2-5 return visits per month.')}{' '}<strong className="text-foreground">{t('modules.residentPortal.results.returnVisits.savings', 'Annual savings: $4,800-24,000.')}</strong>
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
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.residentPortal.results.phoneTime.title', 'Reduced Phone Time')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.residentPortal.results.phoneTime.description', 'Average time per complaint phone call: 10-15 minutes. Average complaints per busy month: 50-100.')}{' '}<strong className="text-foreground">{t('modules.residentPortal.results.phoneTime.savings', 'Monthly savings: $400-1,250 in recovered operations manager time.')}</strong>
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
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.residentPortal.results.retention.title', 'Contract Retention')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.residentPortal.results.retention.description', 'Property managers choose vendors who reduce their workload. The Resident Portal demonstrably removes property managers from the complaint loop. Renewal conversations become easier when you\'ve made their job simpler all year.')}
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
                    <Zap className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.residentPortal.results.differentiation.title', 'Competitive Differentiation')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.residentPortal.results.differentiation.description', 'During bid presentations, demonstrating the resident portal and resolution time metrics separates your company from competitors managing complaints via phone and email. You show a system. They describe a process. Systems win.')}
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
            {t('modules.residentPortal.integration.title', 'Other Modules This Module Communicates With')}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            {t('modules.residentPortal.integration.subtitle', 'The Resident Portal connects to other OnRopePro modules to create a unified operations system.')}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.residentPortal.integration.projectManagement.title', 'Project Management Module')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.residentPortal.integration.projectManagement.description', 'Feedback ties to specific projects. Residents see project progress including which elevation is being worked and completion percentage. When a project completes, residents have 5 business days to submit feedback.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.residentPortal.integration.csr.title', 'Company Safety Rating (CSR) Module')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.residentPortal.integration.csr.description', 'Resolution time metrics factor into your overall rating alongside safety data. Property managers see CSR and feedback metrics together when evaluating vendors. Responsive complaint handling improves your competitive positioning.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Palette className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.residentPortal.integration.whiteLabel.title', 'White-Label Branding Module')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.residentPortal.integration.whiteLabel.description', 'The resident portal displays your company branding when the white-label module is active. Notices and communications show your company identity. Professional appearance for every resident interaction.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.residentPortal.integration.employeeManagement.title', 'Employee Management Module')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.residentPortal.integration.employeeManagement.description', 'Staff are assigned permissions to respond to feedback. As the system evolves, performance could be tracked by response quality, creating accountability at the individual level.')}
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
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t('modules.residentPortal.impact.title', 'Stop Managing Complaints. Start Managing Growth.')}
          </h2>
          
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p>
                {t('modules.residentPortal.impact.paragraph1', 'Right now, complaint management looks like this: A phone call interrupts your day. You grab whatever\'s handy to write it down. You promise to follow up. You add it to the mental list of things that need attention. Multiply that by 50 buildings during busy season and you\'re drowning in administrative work that produces nothing.')}
              </p>
              <p>
                {t('modules.residentPortal.impact.paragraph2', 'The notebook Tommy used to track complaints still has pages with chicken scratch from phone calls taken while driving. The Google Form helped but created a new problem: sorting 30 submissions from 5 different buildings, then calling each resident individually. The complaint management "system" was whatever got written down that day.')}
              </p>
              <Separator className="my-6" />
              <p className="font-medium text-foreground">
                {t('modules.residentPortal.impact.paragraph3', 'With the Resident Portal, feedback organizes itself.')}
              </p>
              <p>
                {t('modules.residentPortal.impact.paragraph4', 'By building. By project. With photos attached. With timestamps proving when it was seen. With resolution metrics calculating automatically. The chaos becomes a dashboard. The half-day return visits become same-day fixes. The phone calls become notifications you handle on your schedule.')}
              </p>
              <p className="font-medium text-foreground text-lg">
                {t('modules.residentPortal.impact.paragraph5', 'What do you do with the hours you get back? Train your crews. Bid on new contracts. Take the call that actually grows your business. The complaint management that used to consume your operations manager\'s week becomes a check-the-dashboard morning routine.')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* FAQs Section */}
      <section id="faqs" className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.residentPortal.faqs.title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            {t('modules.residentPortal.faqs.subtitle', 'Common questions about the Resident Portal.')}
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="faq-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.residentPortal.faqs.q1.question', 'Can residents see other residents\' complaints?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.residentPortal.faqs.q1.answer', 'No. Residents can only view and interact with their own feedback submissions. Privacy is protected by design.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.residentPortal.faqs.q2.question', 'What happens when a resident moves to a different building?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.residentPortal.faqs.q2.answer', 'They update their Strata/LMS number in their profile and enter the new vendor\'s code. Their account is fully portable. If the new building\'s vendor uses OnRopePro, they see that vendor\'s projects. If not, they notice the gap.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.residentPortal.faqs.q3.question', 'Can residents reopen closed feedback?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.residentPortal.faqs.q3.answer', 'No. Only company staff can reopen closed feedback. If a resident believes the issue persists, they contact their property manager or building manager directly. This prevents endless back-and-forth on resolved issues.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.residentPortal.faqs.q4.question', 'Can property managers respond to resident feedback?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.residentPortal.faqs.q4.answer', 'No. Property managers can view all feedback and communication history but cannot respond. Only company staff communicate with residents through the system. This keeps property managers informed without requiring their involvement.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.residentPortal.faqs.q5.question', 'What\'s the difference between internal notes and visible replies?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.residentPortal.faqs.q5.answer', 'Internal notes are private (staff only) for coordination, investigation findings, and sensitive discussions. Visible replies are seen by the resident for acknowledgment, status updates, and resolution communication. Staff must explicitly toggle a yellow/red checkbox to make a reply visible, preventing accidental exposure.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.residentPortal.faqs.q6.question', 'How do residents get the vendor code?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.residentPortal.faqs.q6.answer', 'The code is posted on notices in the elevator during projects, provided by the building manager, or included in project communications. One code per company, used for all buildings that company services.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.residentPortal.faqs.q7.question', 'Is there one code per building or one code per company?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.residentPortal.faqs.q7.answer', 'One code per company. All residents across all buildings serviced by that company use the same vendor code. The Strata/LMS number differentiates which building\'s projects they see.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.residentPortal.faqs.q8.question', 'How long do residents have to submit feedback after a project completes?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.residentPortal.faqs.q8.answer', '5 business days. This allows time for residents to notice issues while limiting the complaint window to a reasonable period.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.residentPortal.faqs.q9.question', 'What happens if feedback sits unread?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.residentPortal.faqs.q9.answer', 'Notification badges show pending items in your dashboard. The "Viewed" timestamp is visible to the resident, so they know if no one has opened their feedback. This creates natural accountability.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-10" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.residentPortal.faqs.q10.question', 'Do residents see when we add internal notes?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.residentPortal.faqs.q10.answer', 'No. Internal notes are completely invisible to residents. They only see visible replies and status changes.')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 text-white" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('modules.residentPortal.cta.title', 'Ready to Eliminate Return Visits?')}
          </h2>
          <p className="text-lg text-blue-100">
            {t('modules.residentPortal.cta.description', 'Set up your resident portal in under 10 minutes.')}<br />
            {t('modules.residentPortal.cta.descriptionLine2', 'Full access. No credit card. One prevented return visit pays for months of the system.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <FreeTrialButton 
              className="bg-white text-[#0B64A3] hover:bg-blue-50" 
              onClick={() => setShowRegistration(true)} 
              testId="button-cta-trial"
            />
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-cta-guide">
              <Link href="/changelog/resident-portal">
                {t('modules.residentPortal.cta.ctaGuide', 'Read the Guide')}
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
            <span className="text-sm text-muted-foreground">{t('modules.residentPortal.footer.tagline', 'Management Software for Rope Access')}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-footer-privacy">
              {t('modules.residentPortal.footer.privacy', 'Privacy Policy')}
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="link-footer-terms">
              {t('modules.residentPortal.footer.terms', 'Terms of Service')}
            </Link>
          </div>
        </div>
      </footer>

      <EmployerRegistration open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
}
