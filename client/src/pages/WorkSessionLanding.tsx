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
  Clock,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Briefcase,
  HardHat,
  Building2,
  Users,
  Globe,
  MapPin,
  Target,
  Calculator,
  FileSpreadsheet,
  Edit3,
  Shield,
  Award,
  Layers,
  BarChart3,
  Wrench,
  ClipboardCheck,
  Activity,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Timer,
  Smartphone
} from "lucide-react";

export default function WorkSessionLanding() {
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
              {t('modules.workSessions.hero.badge', 'Work Sessions & Time Tracking Module')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('modules.workSessions.hero.titleLine1', 'You were there all week.')}<br />
              {t('modules.workSessions.hero.titleLine2', 'The building is only 20% done.')}<br />
              <span className="text-blue-100">{t('modules.workSessions.hero.titleLine3', 'What happened?')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('modules.workSessions.hero.description1', "Monday was windy. Tuesday he left early. Wednesday there was a crane on the roof. Thursday Damien felt sick. By Friday, you're 20 hours over budget and you have no idea why.")}
            </p>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('modules.workSessions.hero.description2', "OnRopePro's Work Session module captures everything. Clock in, clock out, drops completed, shortfall reasons documented.")} <strong>{t('modules.workSessions.hero.description2Bold', 'Real answers instead of scattered excuses.')}</strong>
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
              software={MODULE_SOFTWARE_MAPPING["work-session-time-tracking"]} 
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
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">{t('modules.workSessions.stats.payrollValue', '87-93%')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.workSessions.stats.payrollLabel', 'Payroll time saved')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">{t('modules.workSessions.stats.errorsValue', '$3,600+')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.workSessions.stats.errorsLabel', 'Annual errors eliminated')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">{t('modules.workSessions.stats.timeValue', '30 min')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.workSessions.stats.timeLabel', 'Instead of 7 hours')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">{t('modules.workSessions.stats.elevationsValue', '4')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.workSessions.stats.elevationsLabel', 'Elevations tracked')}</div>
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
            {t('modules.workSessions.problem.title', 'The Conversation You Know Too Well')}
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground italic">
                {t('modules.workSessions.problem.quote1', '"I see you logged 45 hours. Last year one guy finished the same building in that time. You\'re not even halfway done. What happened?"')}
              </p>
              <p className="italic">
                {t('modules.workSessions.problem.quote2', '"Monday, I think it was windy. And then I had to pull my rope, I think. Or was that Tuesday? Oh yeah, no, Tuesday because Monday I had to leave early because I had dinner with my mom and I told you, remember? Oh yeah, I remember you told me that. Then Tuesday was windy and then Wednesday there was another crane on the roof, so I had to move my rope a bunch of times. And what about Damien? He was there with you. Oh yeah, but he felt sick. He didn\'t work so much and he only did one drop on Thursday or Friday. I\'m not sure. I was not really paying attention to what he was doing. I was too busy with my stuff."')}
              </p>
              <p>
                {t('modules.workSessions.problem.paragraph1', "No clue what's going on. At the end of the building, you're just pissed off because you went 20 hours over budget and you don't really know why. You know it was weather. You know the guy wasn't feeling well some days. You don't really know. Move on. Next building.")}
              </p>
              <p className="font-medium text-foreground">
                {t('modules.workSessions.problem.paragraph2', "This is the system you're using. Memory. Excuses. Spreadsheets that don't connect to anything.")}
              </p>
              <Separator className="my-6" />
              <p className="font-medium text-foreground text-lg">
                {t('modules.workSessions.problem.solution', "OnRopePro replaces the guesswork with data. Every clock-in timestamped. Every clock-out GPS-verified. Every drop logged by elevation. Every shortfall documented with a reason. Next year when you quote that building, you're not guessing. You're calculating.")}
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
            {t('modules.workSessions.features.title', 'What This Module Does')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.workSessions.features.subtitle', 'Three capabilities. Zero chaos. Work sessions are the core time tracking mechanism that captures everything as it happens.')}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Precision Time Capture */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.workSessions.features.timeCapture.title', 'Precision Time Capture')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.workSessions.features.timeCapture.description1', 'Technicians clock in from their phone. The system captures the exact timestamp and GPS location.')}</p>
                <p>{t('modules.workSessions.features.timeCapture.description2', 'No more "I swear I was there by 8." The data speaks for itself.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.workSessions.features.timeCapture.listTitle', 'What gets tracked:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.workSessions.features.timeCapture.item1', 'Start time (to the second)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.workSessions.features.timeCapture.item2', 'GPS coordinates at clock-in')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.workSessions.features.timeCapture.item3', 'Project association')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.workSessions.features.timeCapture.item4', 'Harness inspection verification')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 2: Work Output Documentation */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <ClipboardCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.workSessions.features.workOutput.title', 'Work Output Documentation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.workSessions.features.workOutput.description1', 'At end of day, technicians log drops completed by elevation. North, East, South, West.')}</p>
                <p>{t('modules.workSessions.features.workOutput.description2', 'Miss your daily target? The system prompts for a reason. Weather. Equipment. Crew issues. Documented, not forgotten.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.workSessions.features.workOutput.listTitle', 'What gets captured:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.workSessions.features.workOutput.item1', 'Drops completed per elevation')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.workSessions.features.workOutput.item2', 'Percentage complete (for hours-based jobs)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.workSessions.features.workOutput.item3', 'Shortfall reasons (mandatory when below target)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.workSessions.features.workOutput.item4', 'Session photos and notes')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3: Automatic Payroll Aggregation */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                  <Calculator className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.workSessions.features.payroll.title', 'Automatic Payroll Aggregation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.workSessions.features.payroll.description1', 'Hours flow directly into payroll calculations. Regular time, overtime, piece-work. All calculated.')}</p>
                <p>{t('modules.workSessions.features.payroll.description2', 'Billable versus non-billable separated automatically. Export to QuickBooks, ADP, Paychex, Gusto.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.workSessions.features.payroll.listTitle', 'What gets calculated:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.workSessions.features.payroll.item1', 'Total hours by employee')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.workSessions.features.payroll.item2', 'Hours by project')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.workSessions.features.payroll.item3', 'Billable vs non-billable breakdown')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.workSessions.features.payroll.item4', 'Piece-work compensation (if enabled)')}</span>
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
            {t('modules.workSessions.stakeholders.title', 'Who Benefits From This Module')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.workSessions.stakeholders.subtitle', 'Five stakeholder types. Five different needs. One unified time tracking system.')}
          </p>

          <div className="space-y-8">
            {/* For Employers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.workSessions.stakeholders.employers.title', 'For Employers (Company Owners)')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.stakeholders.employers.benefit1Title', 'Know exactly where your labor dollars go.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.stakeholders.employers.benefit1Desc', 'Every work session links to a project. Every hour links to a technician. When a building goes over budget, you see exactly why. Weather delays on Tuesday. Equipment issues Wednesday. Crew shortage Friday.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.stakeholders.employers.benefit2Title', 'Eliminate payroll disputes permanently.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.stakeholders.employers.benefit2Desc', "Both you and your technician see the same timestamps. Same GPS locations. Same drop counts. When the data matches, disputes don't happen. When someone claims hours they didn't work, you have proof.")}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.stakeholders.employers.benefit3Title', 'Quote future projects from actual data.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.stakeholders.employers.benefit3Desc', "Pull up last year's work sessions for that building. See exactly how many hours, which technicians, what productivity rates. Your next quote is based on history, not hope.")}</p>
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
                  <CardTitle className="text-xl">{t('modules.workSessions.stakeholders.technicians.title', 'For Technicians')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.stakeholders.technicians.benefit1Title', 'Clock in, clock out, done.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.stakeholders.technicians.benefit1Desc', 'No timesheets to fill out. No texts to send. No forms to lose. Tap Start Day when you arrive. Tap End Day when you leave. Your hours submit themselves.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.stakeholders.technicians.benefit2Title', 'Your work history follows you.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.stakeholders.technicians.benefit2Desc', 'Every project, every building, every task logged and stored. When you apply for a new job or upgrade your IRATA level, you have detailed records. "178 rope transfers. 3,500 deviations. 2,000 drops." Documented facts.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.stakeholders.technicians.benefit3Title', 'Fair performance reviews based on data.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.stakeholders.technicians.benefit3Desc', "Your dashboard shows drops per day, target achievement rate, trends over time. When performance conversations happen, you're discussing facts, not opinions.")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Operations Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-cyan-50 dark:bg-cyan-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-cyan-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.workSessions.stakeholders.opsManagers.title', 'For Operations Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.stakeholders.opsManagers.benefit1Title', "See who's working where right now.")}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.stakeholders.opsManagers.benefit1Desc', 'Real-time dashboard shows every clocked-in technician. Which project. How long. Last activity. When a client calls asking if your crew is on site, you know the answer without making phone calls.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.stakeholders.opsManagers.benefit2Title', 'Catch budget problems on Day 3, not Day 30.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.stakeholders.opsManagers.benefit2Desc', 'Labor costs calculate in real-time against project budgets. When a project starts trending over, you see it immediately. Reassign resources. Adjust timelines. Prevent surprises.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.stakeholders.opsManagers.benefit3Title', 'Document every deviation.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.stakeholders.opsManagers.benefit3Desc', 'Target missed? Reason captured. Weather delay? Logged. Equipment failure? Recorded. When you review project performance, you have context for every variance.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Building Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-violet-50 dark:bg-violet-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.workSessions.stakeholders.buildingManagers.title', 'For Building Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.stakeholders.buildingManagers.benefit1Title', 'Verify contractor attendance.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.stakeholders.buildingManagers.benefit1Desc', "Access your building's work session summaries through the portal. See when crews arrived, when they left, what they accomplished. No more competing stories about who was where.")}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.stakeholders.buildingManagers.benefit2Title', 'Access compliance documentation instantly.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.stakeholders.buildingManagers.benefit2Desc', 'Work sessions link to safety records. Harness inspections verified at clock-in. Toolbox meeting attendance tracked. Your audit folder stays current automatically.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Property Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.workSessions.stakeholders.propertyManagers.title', 'For Property Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.stakeholders.propertyManagers.benefit1Title', 'Track vendor performance across your portfolio.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.stakeholders.propertyManagers.benefit1Desc', 'Every building, every contractor, every project. Work session data feeds into Compliance & Safety Ratings visible in your portal. Make renewal decisions based on documented performance.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.stakeholders.propertyManagers.benefit2Title', 'Resolve disputes with verified data.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.stakeholders.propertyManagers.benefit2Desc', 'Contractor says they were on site Tuesday through Friday. Your records show work sessions for Tuesday, Wednesday, and Friday only. Facts end arguments.')}</p>
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
            {t('modules.workSessions.keyFeatures.title', 'Key Features')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.workSessions.keyFeatures.subtitle', 'Everything you need to track field operations and process accurate payroll.')}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.keyFeatures.clockInOut.title', 'One-Tap Clock In/Out')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.keyFeatures.clockInOut.desc', 'Technicians start and end work sessions from their smartphone. Exact timestamps captured automatically. GPS location recorded. No timesheets, no texts, no paperwork.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.keyFeatures.dropTracking.title', '4-Elevation Drop Tracking')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.keyFeatures.dropTracking.desc', 'Log drops completed by building side: North, East, South, West. Visual progress bars show exactly where work stands on each facade. Project completion percentage updates in real-time.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.keyFeatures.gpsVerification.title', 'GPS Location Verification')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.keyFeatures.gpsVerification.desc', 'Location captured at clock-in and clock-out. Verifiable proof for client disputes, billing verification, and audit documentation. See the map coordinates for every session.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.keyFeatures.targetEnforcement.title', 'Daily Target Enforcement')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.keyFeatures.targetEnforcement.desc', 'Set drop targets per project. System tracks whether technicians meet, exceed, or fall short. Miss the target? A reason is required. Weather, equipment, crew issues. Documented every time.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center shrink-0">
                    <Calculator className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.keyFeatures.hourAggregation.title', 'Automatic Hour Aggregation')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.keyFeatures.hourAggregation.desc', 'Hours total themselves by employee, by project, by payroll period. No spreadsheet formulas. No manual calculations. No transcription errors. Ready for export in 30 seconds.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.keyFeatures.billableSeparation.title', 'Billable vs Non-Billable Separation')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.keyFeatures.billableSeparation.desc', 'Project work tracked separately from travel, errands, training, and admin. Finally see your true billable ratio. Identify where non-productive hours are hiding.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 7 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.keyFeatures.pieceWork.title', 'Piece-Work Calculation')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.keyFeatures.pieceWork.desc', 'Pay per drop? Toggle piece-work mode per project. System calculates compensation based on drops completed. Works for hourly shops and commission shops alike.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 8 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
                    <Edit3 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.keyFeatures.managerOverride.title', 'Manager Override with Audit Trail')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.keyFeatures.managerOverride.desc', 'Authorized managers can edit completed sessions. Forgot to clock out? Clocked out at the wrong time? Corrections are logged with timestamp and reason. Full accountability.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 9 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.keyFeatures.harnessInspection.title', 'Harness Inspection Integration')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.keyFeatures.harnessInspection.desc', 'When technicians click Start Day, they confirm harness inspection status. "Yes" without a matching inspection record creates a CSR penalty. Honest employees build trust. Dishonest answers are passively tracked.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 10 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.workSessions.keyFeatures.irataLogging.title', 'IRATA/SPRAT Hours Logging')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.keyFeatures.irataLogging.desc', 'End-of-session prompt captures rope access activities: rigging, rope transfers, deviations, rescue practice. Technicians build detailed work history for certification logbook updates.')}</p>
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
            {t('modules.workSessions.problemsSolved.title', 'Problems Solved')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.workSessions.problemsSolved.subtitle', "Real problems from real rope access operations. Here's how OnRopePro eliminates them.")}
          </p>

          <Accordion type="multiple" className="space-y-3">
            {/* For Employers */}
            <AccordionItem value="problems-employers" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4" data-testid="accordion-problems-employers">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-semibold">{t('modules.workSessions.problemsSolved.employers.title', 'For Employers')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.workSessions.problemsSolved.employers.problem1Title', '"I spend 4 to 8 hours on payroll every two weeks."')}</h4>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.employers.problem1Desc1', 'You\'re reconciling spreadsheets at 10 PM. Text messages from last Tuesday. A voicemail you half-remember. The scribbled note on your desk that might say "8" or might say "3." By midnight you\'ve reconstructed something that\'s probably close.')}</p>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.employers.problem1Desc2', 'OnRopePro captures timestamps automatically. Hours aggregate by employee and project. Export your payroll data in 30 seconds. The 7 hours you used to spend? Gone.')}</p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.workSessions.problemsSolved.employers.problem2Title', '"My check is $140 short and I want to know why."')}</h4>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.employers.problem2Desc1', "That phone call from your technician. Your stomach drops. You know he's probably right. You spend an hour digging through records, discover you miscounted his overtime, cut a makeup check, and watch another piece of trust evaporate.")}</p>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.employers.problem2Desc2', "Both you and your technician see the same data. Same timestamps. Same totals. When the numbers match, disputes don't happen. When someone's wrong, the proof is immediate.")}</p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.workSessions.problemsSolved.employers.problem3Title', '"I don\'t know which projects are profitable until the job is done."')}</h4>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.employers.problem3Desc1', "You finish a building and realize you're $2,000 over budget. Was it weather? Slow technicians? Equipment problems? By the time you piece it together, you've already underbid three similar projects.")}</p>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.employers.problem3Desc2', 'Labor costs calculate in real-time against your budget. You see cost per drop. Hours per elevation. Performance against daily targets. When a project starts going sideways, you know it on Day 3.')}</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Technicians */}
            <AccordionItem value="problems-technicians" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4" data-testid="accordion-problems-technicians">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <HardHat className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="font-semibold">{t('modules.workSessions.problemsSolved.technicians.title', 'For Technicians')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.workSessions.problemsSolved.technicians.problem1Title', '"I fill out the same time info three different ways."')}</h4>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.technicians.problem1Desc1', 'Text your hours to the office. Write them in your IRATA logbook. Fill out the company spreadsheet. Three systems that never sync. Three chances for errors. Three things to remember at the end of an exhausting day on rope.')}</p>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.technicians.problem1Desc2', 'One tap to clock in. One tap to clock out. That single entry feeds payroll and stores the details you need for your logbook. Done.')}</p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.workSessions.problemsSolved.technicians.problem2Title', '"I can never remember what I did three weeks ago for my logbook."')}</h4>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.technicians.problem2Desc1', "Your IRATA logbook is supposed to be accurate. But when you're filling it out at the end of the month, you're guessing. Was it rope transfers on Tuesday or Wednesday? How many drops did you complete at the parkade?")}</p>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.technicians.problem2Desc2', "Every work session logs the details: building, tasks performed, hours, drops by elevation. When you update your physical logbook, you're copying verified data, not reconstructing memories.")}</p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.workSessions.problemsSolved.technicians.problem3Title', '"My supervisor says my performance is inconsistent but has no data to show me."')}</h4>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.technicians.problem3Desc1', "You felt like you worked hard. There's nothing to reference. The review becomes about perception, not performance.")}</p>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.technicians.problem3Desc2', 'Your dashboard shows drops per day, target achievement rate, trends over time. "This month: 4.8 drops/day average, 86% target achievement. Last month: 4.1 drops/day, 72% achievement. You\'re improving."')}</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Operations Managers */}
            <AccordionItem value="problems-ops-managers" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4" data-testid="accordion-problems-ops-managers">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-cyan-600" />
                  </div>
                  <span className="font-semibold">{t('modules.workSessions.problemsSolved.opsManagers.title', 'For Operations Managers')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.workSessions.problemsSolved.opsManagers.problem1Title', '"I don\'t know where my crew is or what they\'re doing."')}</h4>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.opsManagers.problem1Desc1', 'You call Tommy. No answer. You call again. Nothing. Is he on rope? On break? Having an emergency? You have 12 technicians across 4 sites and zero visibility.')}</p>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.opsManagers.problem1Desc2', 'Real-time dashboard shows every clocked-in technician. Which project. How long. Last activity. Answer client calls without making phone calls.')}</p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.workSessions.problemsSolved.opsManagers.problem2Title', '"The project went 20 hours over budget and I don\'t know why."')}</h4>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.opsManagers.problem2Desc1', "End of project. You're way over. You know it was weather, a sick technician, some equipment issues. But you can't quantify any of it.")}</p>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.opsManagers.problem2Desc2', 'Shortfall reasons are captured when technicians miss daily targets. Every deviation documented. When you review project performance, you see exactly what happened and why.')}</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Building Managers */}
            <AccordionItem value="problems-building-managers" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4" data-testid="accordion-problems-building-managers">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-violet-600" />
                  </div>
                  <span className="font-semibold">{t('modules.workSessions.problemsSolved.buildingManagers.title', 'For Building Managers')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.workSessions.problemsSolved.buildingManagers.problem1Title', '"I can\'t verify if the rope access crew was actually on site."')}</h4>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.buildingManagers.problem1Desc1', "You're paying for services. The contractor says their crew was there all week. Your residents say they only saw workers Tuesday and Thursday.")}</p>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.buildingManagers.problem1Desc2', 'GPS-verified clock-in and clock-out times visible in your portal. See when crews arrived, when they left, what they accomplished.')}</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Property Managers */}
            <AccordionItem value="problems-property-managers" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4" data-testid="accordion-problems-property-managers">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="font-semibold">{t('modules.workSessions.problemsSolved.propertyManagers.title', 'For Property Managers')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.workSessions.problemsSolved.propertyManagers.problem1Title', '"I need proof of attendance for contractor invoices."')}</h4>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.propertyManagers.problem1Desc1', 'Contractor submits an invoice for 40 hours. Were they actually there? Your records are whatever the contractor told you.')}</p>
                  <p className="text-muted-foreground">{t('modules.workSessions.problemsSolved.propertyManagers.problem1Desc2', 'Work session summaries for your buildings available in your portal. Timestamps, locations, work completed. Verify invoices against documented attendance.')}</p>
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
            {t('modules.workSessions.results.title', 'Measurable Results')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.workSessions.results.subtitle', 'Real numbers from real rope access operations.')}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Result 1 */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Timer className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{t('modules.workSessions.results.payrollReduction.title', '87-93% Payroll Time Reduction')}</h3>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.results.payrollReduction.desc', "From 4-8 hours per payroll cycle to 30 minutes. That's 7+ hours recovered every two weeks. 182+ hours per year. The equivalent of an extra month of workdays.")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Result 2 */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{t('modules.workSessions.results.zeroDisputes.title', 'Zero Payroll Disputes')}</h3>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.results.zeroDisputes.desc', 'Precise timestamps and GPS verification eliminate "he said/she said" conversations. When both parties see the same data, disputes don\'t happen.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Result 3 */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{t('modules.workSessions.results.budgetVisibility.title', 'Real-Time Budget Visibility')}</h3>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.results.budgetVisibility.desc', 'Labor costs accumulate as work happens, not after the job is done. Catch budget overruns on Day 3, not Day 30. Prevent the surprises that kill profitability.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Result 4 */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600"></div>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{t('modules.workSessions.results.accountability.title', 'Complete Accountability Trail')}</h3>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.results.accountability.desc', 'Every clock-in, clock-out, and edit logged with timestamp. When the labor department asks questions or a client disputes an invoice, you have verifiable records.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* How Will This Improve Your Business Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.workSessions.improve.title', 'Stop Reconstructing. Start Operating.')}
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-base text-muted-foreground">
              <p>
                {t('modules.workSessions.improve.paragraph1', "Right now, you're spending hours every payroll cycle piecing together what happened across your projects. Text messages. Memory. Spreadsheets that don't talk to each other. You're making educated guesses and hoping nobody catches the errors.")}
              </p>
              <p>
                {t('modules.workSessions.improve.paragraph2', 'Your technicians are logging hours in three different places. Texting the office. Writing in their logbooks. Filling out your forms. Same information, multiple systems, zero connection.')}
              </p>
              <p>
                {t('modules.workSessions.improve.paragraph3', 'Your operations managers are calling around to find out where people are. Your clients are asking if the crew showed up. Your projects are going over budget and you only find out when the job is done.')}
              </p>
              <Separator className="my-6" />
              <p className="font-medium text-foreground text-lg">
                {t('modules.workSessions.improve.solution1', 'With OnRopePro, your technicians clock in once. That single action captures their timestamp, verifies their location, confirms their harness inspection, and links their session to the right project. When they clock out, they log their output, document any shortfalls, and the data flows directly into payroll, performance analytics, and project progress.')}
              </p>
              <p className="font-medium text-foreground text-lg">
                {t('modules.workSessions.improve.solution2', 'You stop reconstructing the past. You start managing in real-time.')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Module Integration Points Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.workSessions.integrations.title', 'Module Integration Points')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.workSessions.integrations.subtitle', 'Work session data flows into everything else. This is the heartbeat of OnRopePro.')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Integration 1 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">{t('modules.workSessions.integrations.projects.title', 'Projects')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.integrations.projects.desc', 'Work sessions automatically link to assigned projects. Hours and drops flow into project progress tracking. Budget monitoring updates in real-time as sessions close.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integration 2 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">{t('modules.workSessions.integrations.payroll.title', 'Payroll')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.integrations.payroll.desc', 'Work session data aggregates by payroll period. Employee hours, rates, and gross pay calculated automatically. Export-ready in seconds.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integration 3 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">{t('modules.workSessions.integrations.analytics.title', 'Performance Analytics')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.integrations.analytics.desc', 'Work session performance feeds productivity dashboards. Target achievement, drops per day, trends over time. Objective data for performance conversations.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integration 4 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">{t('modules.workSessions.integrations.safety.title', 'Safety & Compliance')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.integrations.safety.desc', 'Harness inspection verification triggers at session start. Work sessions link to toolbox meeting coverage. Attendance data factors into Company Safety Rating calculations.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integration 5 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center shrink-0">
                    <Wrench className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">{t('modules.workSessions.integrations.inventory.title', 'Inventory & Inspections')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.integrations.inventory.desc', 'Daily harness checks prompt at clock-in. Session data verifies equipment was inspected before use. Inspection records link to the work performed.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integration 6 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">{t('modules.workSessions.integrations.dashboard.title', 'Active Workers Dashboard')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.workSessions.integrations.dashboard.desc', "Real-time display of clocked-in technicians across all projects. Status updates as sessions start and end. Know who's where without phone calls.")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* FAQs Section */}
      <section id="knowledgebase" className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.workSessions.faq.title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12">
            {t('modules.workSessions.faq.subtitle', 'Common questions about work session tracking and time management.')}
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="faq-1" className="bg-white dark:bg-slate-800 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-1">
                {t('modules.workSessions.faq.q1', 'How do technicians clock in and out?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.workSessions.faq.a1', 'They use the OnRopePro mobile app. Tap "Start Day" when arriving at site, select the project, confirm harness inspection status. Tap "End Day" when leaving, log drops by elevation, add notes if needed. Takes under 30 seconds.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="bg-white dark:bg-slate-800 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-2">
                {t('modules.workSessions.faq.q2', 'What if someone forgets to clock out?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.workSessions.faq.a2', 'Authorized managers can edit completed sessions. Adjust the end time, and the system recalculates hours and pay automatically. All edits are logged with timestamp and reason for accountability.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="bg-white dark:bg-slate-800 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-3">
                {t('modules.workSessions.faq.q3', 'Can technicians work on multiple projects in one day?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.workSessions.faq.a3', 'Yes. End the session at the first project, start a new session at the next. Each project gets accurate hour attribution for billing and cost tracking.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="bg-white dark:bg-slate-800 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-4">
                {t('modules.workSessions.faq.q4', 'What happens if GPS is disabled?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.workSessions.faq.a4', 'Clock-in still works, but without location verification. The system records that GPS was unavailable. For companies requiring location proof, this creates a visible gap in attendance records.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="bg-white dark:bg-slate-800 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-5">
                {t('modules.workSessions.faq.q5', 'How does the harness inspection prompt work?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.workSessions.faq.a5', 'When technicians click Start Day, they see three options: Yes (confirms inspection complete), No (redirects to inspection form), or Not Applicable (for ground tasks). Selecting "Yes" without a matching inspection record creates a CSR penalty visible to property managers.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="bg-white dark:bg-slate-800 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-6">
                {t('modules.workSessions.faq.q6', 'Who can see work session data?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.workSessions.faq.a6', 'Access is permission-based. Company owners and operations managers see all sessions. Supervisors see sessions for their assigned projects. Technicians see their own work history. Property managers see session summaries for their buildings.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="bg-white dark:bg-slate-800 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-7">
                {t('modules.workSessions.faq.q7', 'Does this replace the IRATA logbook?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.workSessions.faq.a7', "Not yet. OnRopePro tracks detailed work session information that serves as professional memory. When updating your physical logbook, you reference stored data instead of guessing. We're pursuing IRATA and SPRAT recognition to eventually become an approved logging method.")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="bg-white dark:bg-slate-800 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-8">
                {t('modules.workSessions.faq.q8', 'Can I export time data for my accountant?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.workSessions.faq.a8', 'Yes. Hours aggregate by payroll period with CSV export. Works with QuickBooks, ADP, Paychex, Gusto, and any system that accepts standard time data.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="bg-white dark:bg-slate-800 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-9">
                {t('modules.workSessions.faq.q9', 'How does piece-work compensation work?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.workSessions.faq.a9', 'When creating a project, toggle piece-work mode and enter the rate per drop. When technicians end their session and log drops completed, the system calculates their compensation automatically and marks it as piece-work in payroll.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-10" className="bg-white dark:bg-slate-800 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-10">
                {t('modules.workSessions.faq.q10', "What's the difference between billable and non-billable sessions?")}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.workSessions.faq.a10', 'Billable sessions are linked to client projects. Non-billable sessions cover travel, errands, equipment maintenance, training, and admin. The system tracks both separately so you can see your true billable ratio and identify where non-productive hours are accumulating.')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="relative py-16 md:py-24 px-4 text-white" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('modules.workSessions.footerCta.title', 'Stop Guessing. Start Knowing.')}
          </h2>
          <p className="text-lg text-blue-100 mb-6 max-w-3xl mx-auto leading-relaxed">
            {t('modules.workSessions.footerCta.paragraph1', "Every payroll cycle, you're reconstructing the past from memory and messages. Every project review, you're piecing together what happened from scattered records. Every client call, you're hoping your crew is actually where they're supposed to be.")}
          </p>
          <p className="text-lg text-blue-100 mb-6 max-w-3xl mx-auto leading-relaxed">
            {t('modules.workSessions.footerCta.paragraph2', 'OnRopePro captures the data as it happens. Timestamps. Locations. Output. Shortfall reasons. All of it. Automatically.')}
          </p>
          <p className="text-lg font-medium text-white mb-8 max-w-3xl mx-auto">
            {t('modules.workSessions.footerCta.paragraph3', 'No more 10 PM spreadsheet sessions. No more "my check is short" phone calls. No more budget surprises at project end.')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FreeTrialButton 
              className="bg-white text-[#0B64A3]" 
              onClick={() => setShowRegistration(true)} 
              testId="button-footer-trial"
            />
            <Button size="lg" variant="outline" className="border-white/40 text-white" asChild data-testid="button-footer-faq">
              <Link href="#knowledgebase">
                {t('modules.workSessions.footerCta.faqButton', 'Find Answers')}
                <BookOpen className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-blue-200 mt-6">
            {t('modules.workSessions.footerCta.trialNote', 'Free 60-day trial for Founding Members. No credit card required.')}
          </p>
        </div>
      </section>

      <EmployerRegistration open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
}
