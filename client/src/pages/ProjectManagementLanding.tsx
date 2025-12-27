import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { PublicHeader } from "@/components/PublicHeader";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { EmployerRegistration } from "@/components/EmployerRegistration";
import { SoftwareReplaces, MODULE_SOFTWARE_MAPPING } from "@/components/SoftwareReplaces";
import ropeAccessSoftwareImg from "@assets/rope-access-software_1765481835892.jpg";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import {
  Briefcase,
  CheckCircle2,
  Calendar,
  BarChart3,
  Users,
  ArrowRight,
  AlertTriangle,
  Building2,
  MapPin,
  Clock,
  Target,
  TrendingUp,
  Shield,
  Lock,
  Globe,
  ChevronsUpDown,
  Crown,
  Home as HomeIcon,
  Wrench,
  Sparkles,
  Compass,
  Eye,
  DollarSign,
  Search,
  Camera,
  GitBranch,
  BookOpen
} from "lucide-react";

const ALL_ACCORDION_ITEMS = [
  "owner-1", "owner-2", "owner-3", "owner-4", "owner-5", "owner-6", "owner-7",
  "manager-1", "manager-2",
  "resident-1",
  "tech-1", "tech-2", "tech-3"
];

export default function ProjectManagementLanding() {
  const { t } = useTranslation();
  const [expandedProblems, setExpandedProblems] = useState<string[]>([]);
  const { openLogin } = useAuthPortal();
  const [showRegistration, setShowRegistration] = useState(false);
  const [, setLocation] = useLocation();
  const allExpanded = expandedProblems.length === ALL_ACCORDION_ITEMS.length;

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedProblems([]);
    } else {
      setExpandedProblems([...ALL_ACCORDION_ITEMS]);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="modules" />

      {/* Hero Section - Following Module Hero Template from design_guidelines.md */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              {t('modules.projects.hero.badge', 'Project Management Module')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('modules.projects.hero.title', 'Stop Managing Projects')}<br />
              <span className="text-blue-100">{t('modules.projects.hero.titleHighlight', 'In Your Head')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('modules.projects.hero.description', 'Track every building, every elevation, every technician from one screen.')}<br />
              <strong>{t('modules.projects.hero.descriptionStrong', "Know exactly where every job stands without driving site to site or relying on yesterday's phone call.")}</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-cta-trial">
                {t('modules.projects.hero.ctaTrial', 'Start Your Free 60-Day Trial')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={openLogin} data-testid="button-cta-signin">
                {t('login.header.signIn', 'Sign In')}
              </Button>
            </div>
            
            <SoftwareReplaces 
              software={MODULE_SOFTWARE_MAPPING["project-management"]} 
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

      {/* Stats Panel - Following Module Hero Template from design_guidelines.md */}
      <section className="relative bg-white dark:bg-slate-950 -mt-px overflow-visible">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
          <Card className="shadow-xl border-0 relative z-20 -mt-20">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-sky-600">4</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.projects.stats.elevations', 'Elevations tracked independently')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">87-93%</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.projects.stats.payrollErrors', 'Payroll errors eliminated')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">60-70%</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.projects.stats.statusCalls', 'Fewer status calls from clients')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">75%</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.projects.stats.quotePrep', 'Faster quote preparation')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Pain Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950 rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl text-amber-900 dark:text-amber-100">{t('modules.projects.problem.title', 'The Reality')}</CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <p>{t('modules.projects.problem.juggling', "You're juggling window washing at Tower A, caulking at Building B, anchor inspections at Complex C. A client calls asking for a status update.")}</p>
              <p className="font-medium">{t('modules.projects.problem.guessing', "You're guessing.")}</p>
              <p>{t('modules.projects.problem.maybe', "You think Tommy's finishing the north elevation today. Maybe. Sarah might have capacity next week. Probably. That 15-story quote you just sent? You pulled the timeline from memory because you couldn't find your notes from the similar job six months ago.")}</p>
              <p>{t('modules.projects.problem.siteVisits', "Many times you've had to go from project to project and look at the guys on the rope and take notes of where they're at compared to where they were yesterday. Ten to fifteen hours a week just figuring out what's happening.")}</p>
              <p>{t('modules.projects.problem.performance', "Then there's the performance problem nobody talks about. One guy on the cell phone half the day, does one drop. The other guy working his ass off. They were there the same amount of time. You know something's wrong. Without hard data, you can't have the conversation.")}</p>
              <p className="font-medium">{t('modules.projects.problem.exhausted', 'Your brain is your business. And it\'s exhausted.')}</p>
            </CardContent>
          </Card>
          
          <Card className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 rounded-2xl shadow-md">
            <CardContent className="pt-6 text-emerald-900 dark:text-emerald-100 space-y-4">
              <p>{t('modules.projects.solution.changes', 'OnRopePro changes the equation. Every project visible from one screen. Progress updates automatically as work sessions get logged. Per-employee performance tracked with objective data. The information is at your fingertips instead of scattered across your memory, your whiteboard, and six different text threads.')}</p>
              <p>{t('modules.projects.solution.linked', 'Everything is linked with everything. Create a project and it fills the schedule. Employees log work and it fills payroll. If you do one thing, it does something else for you somewhere else.')}</p>
              <p className="font-medium">{t('modules.projects.solution.cognitive', 'The system carries the cognitive load. Your mental bandwidth opens up for actually running the business.')}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* What This Module Does Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">{t('modules.projects.features.title', 'What This Module Does')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('modules.projects.features.subtitle', 'The operational hub connecting scheduling, safety, and payroll')}
          </p>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            {t('modules.projects.features.description', 'Projects track individual building maintenance jobs with progress measured the way rope access actually works.')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Progress Tracking by Job Type */}
          <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-lg">{t('modules.projects.features.progressTracking.title', 'Progress Tracking by Job Type')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base text-muted-foreground">
              <p>{t('modules.projects.features.progressTracking.adapts', 'The system adapts to your work, not the other way around.')}</p>
              <p>{t('modules.projects.features.progressTracking.description', 'Drop-based tracking for window cleaning and building wash counts vertical passes per elevation. North, East, South, West tracked independently. Hours-based tracking for inspections and repairs captures time with manual completion percentage. Unit-based tracking for parkade cleaning and in-suite services counts individual stalls or suites completed.')}</p>
              <p>{t('modules.projects.features.progressTracking.form', "The form technicians see when ending a work session changes based on what they're working on. No forcing your operations into someone else's template.")}</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="font-medium text-foreground mb-2">{t('modules.projects.features.progressTracking.tracked', 'What gets tracked:')}</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{t('modules.projects.features.progressTracking.item1', 'N/E/S/W elevations independently')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{t('modules.projects.features.progressTracking.item2', 'Drops completed per session per direction')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{t('modules.projects.features.progressTracking.item3', 'Hours worked with completion estimates')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{t('modules.projects.features.progressTracking.item4', 'Units or stalls finished')}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Automatic Calendar Population */}
          <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <CardTitle className="text-lg">{t('modules.projects.features.calendar.title', 'Automatic Calendar Population')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base text-muted-foreground">
              <p>{t('modules.projects.features.calendar.once', 'Create a project once. The schedule fills itself.')}</p>
              <p>{t('modules.projects.features.calendar.description', 'When you enter a date range and assign employees, calendar entries appear automatically. No more creating a project, then opening Google Calendar, then texting your supervisor, then updating the whiteboard. Same information, one entry, everywhere it needs to go.')}</p>
              <p>{t('modules.projects.features.calendar.sync', 'Building gets pushed by a week? Click the project, change the date. It syncs everywhere. Conflict detection flags when someone is double-booked before it becomes an emergency.')}</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="font-medium text-foreground mb-2">{t('modules.projects.features.calendar.automated', 'What gets automated:')}</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />{t('modules.projects.features.calendar.item1', 'Multi-day project bars on company calendar')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />{t('modules.projects.features.calendar.item2', 'Employee assignments visible on their schedules')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />{t('modules.projects.features.calendar.item3', 'Color coding by job type')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />{t('modules.projects.features.calendar.item4', 'Conflict detection for double-booking')}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Linked Documentation */}
          <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-[#0B64A3]/10 dark:bg-[#0B64A3]/20 flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-[#0B64A3]" />
              </div>
              <CardTitle className="text-lg">{t('modules.projects.features.documentation.title', 'Linked Documentation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base text-muted-foreground">
              <p>{t('modules.projects.features.documentation.live', 'Safety docs live with their projects. Not in email. Not in Google Drive. Not in a folder in the truck.')}</p>
              <p>{t('modules.projects.features.documentation.description', 'Each project connects to its Rope Access Plan, Toolbox Meeting records, and Anchor Inspection Certificates. Property managers access compliance documents through their portal without emailing you. Auditors find everything in one place.')}</p>
              <p>{t('modules.projects.features.documentation.insurance', "When the insurance company asks for proof of your safety program, you're not digging. You're clicking.")}</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="font-medium text-foreground mb-2">{t('modules.projects.features.documentation.linked', 'What gets linked:')}</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#0B64A3] shrink-0" />{t('modules.projects.features.documentation.item1', 'Rope Access Plans (RAP)')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#0B64A3] shrink-0" />{t('modules.projects.features.documentation.item2', 'Toolbox Meeting records')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#0B64A3] shrink-0" />{t('modules.projects.features.documentation.item3', 'Anchor Inspection Certificates')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#0B64A3] shrink-0" />{t('modules.projects.features.documentation.item4', 'Project photos')}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* What Changes Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('modules.projects.whatChanges.title1', 'Every Project. Every Elevation. Every Technician. One Screen.')}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('modules.projects.whatChanges.description1', "OnRopePro's Project Management module tracks progress the way rope access actually works. Drop-based tracking for window cleaning and building wash. Hours-based for inspections and repairs. Unit-based for parkade cleaning and in-suite services.")}
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            {t('modules.projects.whatChanges.description2', 'Create a project with a date range and assigned crew, and the calendar populates automatically. Log work sessions from the field, and progress updates in real time. No duplicate data entry. No forgotten schedule conflicts. No 3 AM panic attacks.')}
          </p>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('modules.projects.whatChanges.title2', 'Buildings Have Four Sides. Your Tracking Should Too.')}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('modules.projects.whatChanges.description3', "High-rise window cleaning doesn't happen all at once. The north elevation might be 80% done while the south hasn't started. OnRopePro tracks North, East, South, and West independently. See exactly which directions are complete, in progress, or waiting. Your supervisor knows where to send the crew. Your client sees real progress instead of vague percentages.")}
          </p>
        </div>
      </section>

      {/* Software in Action Image */}
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <img 
              src={ropeAccessSoftwareImg} 
              alt="OnRopePro project management software shown on tablet with rope access technician working on high-rise building" 
              className="w-full h-auto object-cover"
              data-testid="img-software-showcase"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 md:p-8">
              <p className="text-white text-lg md:text-xl font-medium">
                {t('modules.projects.showcase.caption', 'Real-time elevation tracking. From any device. At any height.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Stakeholder Benefits Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.projects.benefits.title', 'Who Benefits From This Module')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.projects.benefits.subtitle', 'Every stakeholder gets exactly the visibility they need')}
          </p>

          <div className="space-y-8">
            {/* For Employers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.projects.benefits.employers.title', 'For Employers (Company Owners)')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.projects.benefits.employers.item1Title', 'See all your projects without leaving your desk.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.projects.benefits.employers.item1Desc', 'The dashboard shows every active job with completion percentage, days remaining, and assigned crew. Updates automatically as work sessions get logged.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.projects.benefits.employers.item2Title', "Know who's performing and who's coasting.")}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.projects.benefits.employers.item2Desc', "Per-employee performance tracking shows drops completed per session and target achievement rates. Now you have the data for conversations you couldn't have before.")}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.projects.benefits.employers.item3Title', 'Quote future jobs with confidence.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.projects.benefits.employers.item3Desc', 'Historical project data shows how long similar buildings actually took. Stop guessing and overbidding by 50%.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.projects.benefits.employers.item4Title', 'Reduce your psychological load.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.projects.benefits.employers.item4Desc', "Everything is linked with everything. The system remembers so you don't have to. That mental bandwidth gets freed up.")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Technicians */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-amber-50 dark:bg-amber-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.projects.benefits.technicians.title', 'For Technicians')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.projects.benefits.technicians.item1Title', 'Know your target before you start.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.projects.benefits.technicians.item1Desc', 'Your mobile app shows assigned projects with clear daily expectations. No more finding out after the fact that the boss expected something different.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.projects.benefits.technicians.item2Title', "See where you're working tomorrow.")}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.projects.benefits.technicians.item2Desc', 'Your upcoming assignments appear on your phone tonight. Plan your commute the night before instead of waiting for a 6 AM text.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.projects.benefits.technicians.item3Title', 'Track your own improvement.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.projects.benefits.technicians.item3Desc', "Your performance dashboard shows drops per day average, target achievement rate, and trends over time. You're improving, and now you can prove it.")}</p>
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
                  <CardTitle className="text-xl">{t('modules.projects.benefits.buildingManagers.title', 'For Building Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.projects.benefits.buildingManagers.item1Title', 'Stop playing telephone.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.projects.benefits.buildingManagers.item1Desc', 'Log in and see the exact same progress the rope access company sees. Real-time completion percentages by elevation. When the building owner asks "How\'s it going?", answer immediately.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.projects.benefits.buildingManagers.item2Title', 'Verify contractor performance objectively.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.projects.benefits.buildingManagers.item2Desc', 'The dashboard shows whether work is progressing on schedule. No more relying on verbal updates that might be optimistic. Data you can trust.')}</p>
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
                  <CardTitle className="text-xl">{t('modules.projects.benefits.propertyManagers.title', 'For Property Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.projects.benefits.propertyManagers.item1Title', 'Reduce your communication overhead.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.projects.benefits.propertyManagers.item1Desc', 'Residents check progress themselves through their portal. Status calls drop 60-70%. Your phone stops ringing with "when will they be done?" questions.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.projects.benefits.propertyManagers.item2Title', 'Demonstrate professional vendor management.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.projects.benefits.propertyManagers.item2Desc', 'When building owners ask about contractor oversight, show them the portal. Real-time progress tracking. Documented safety compliance. Photo verification.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Residents */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-rose-50 dark:bg-rose-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <HomeIcon className="w-5 h-5 text-rose-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.projects.benefits.residents.title', 'For Residents')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.projects.benefits.residents.item1Title', 'Know when work will reach your window.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.projects.benefits.residents.item1Desc', 'The resident portal shows progress specific to your elevation. Plan your life around the work instead of wondering.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.projects.benefits.residents.item2Title', 'Birthday party on Sunday?')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.projects.benefits.residents.item2Desc', 'Check the schedule. No need to call the property manager and wait two days for an answer while you worry about strangers outside your window.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Key Features */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#0B64A3]" />
            {t('modules.projects.keyFeatures.title', 'Key Features')}
          </h2>
          <p className="text-muted-foreground mb-6">{t('modules.projects.keyFeatures.subtitle', 'Built for how rope access operations actually work. Not retrofitted from generic project management software.')}</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.projects.keyFeatures.directional.title', 'Directional Drop Tracking')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.projects.keyFeatures.directional.desc1', 'Track progress on each building elevation independently. North, East, South, and West each show their own drop count, completion percentage, and assigned crew.')}
                    </p>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.projects.keyFeatures.directional.desc2', 'High-rise window cleaning rarely finishes all sides at once. The system matches your reality.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.projects.keyFeatures.dashboard.title', 'Real-Time Progress Dashboard')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.projects.keyFeatures.dashboard.desc1', "See every active project's completion percentage, days remaining, and crew assignment from one screen. Updates automatically as work sessions get logged.")}
                    </p>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.projects.keyFeatures.dashboard.desc2', 'Filter by status, building, job type, or technician. Visual progress bars flag when projects fall behind target.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0B64A3]/10 dark:bg-[#0B64A3]/20 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-[#0B64A3]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.projects.keyFeatures.flexible.title', 'Flexible Tracking Methods')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.projects.keyFeatures.flexible.desc1', "Drop-based, hours-based, or unit-based tracking depending on the job type. The form technicians see when ending a work session changes based on what they're working on.")}
                    </p>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.projects.keyFeatures.flexible.desc2', 'Drop-based jobs ask for N/E/S/W counts. Hours-based jobs ask for completion percentage. The system adapts.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.projects.keyFeatures.calendarIntegration.title', 'Automatic Calendar Integration')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.projects.keyFeatures.calendarIntegration.desc1', 'Creating a project with a date range and assigned employees automatically populates calendar entries. Multi-day project bars. Color coding by job type. Conflict detection when employees are double-booked.')}
                    </p>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.projects.keyFeatures.calendarIntegration.desc2', 'No more "Oh shit, I forgot to schedule that" emergencies.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Wrench className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.projects.keyFeatures.customJobTypes.title', 'Custom Job Types')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.projects.keyFeatures.customJobTypes.desc1', "Create company-specific job types for specialized work. Define the name and tracking method. Choose whether it's elevation-based, time-based, or unit-based.")}
                    </p>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.projects.keyFeatures.customJobTypes.desc2', 'Your weird niche service that no generic software understands? Define it once, use it forever.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.projects.keyFeatures.pieceWork.title', 'Piece Work Mode')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.projects.keyFeatures.pieceWork.desc1', 'For drop-based projects, enable piece work compensation instead of hourly. Set rate per drop. System calculates pay automatically. 20 drops at $8 per drop equals $160 for that session.')}
                    </p>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.projects.keyFeatures.pieceWork.desc2', 'No spreadsheets. No manual calculations. No disputes about how pay was calculated.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Module Integration Points */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('modules.projects.integrations.title', 'Talks To Everything Else')}</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {t('modules.projects.integrations.subtitle', 'Projects are the operational hub connecting multiple OnRopePro modules. When data enters one place, it flows everywhere it needs to go.')}
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">{t('modules.projects.integrations.employee.title', 'Employee Management')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whatConnects', 'What Connects:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.employee.connects', 'Crew assignments pull directly from your employee directory. System filters by qualification level (IRATA Level 2+). Performance metrics from work sessions feed back into employee records.')}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whyMatters', 'Why It Matters:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.employee.matters', 'Ensure qualified crew assigned every time. Performance reviews backed by objective data. Career progression tracked through project complexity.')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">{t('modules.projects.integrations.workSessions.title', 'Work Sessions & Time Tracking')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whatConnects', 'What Connects:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.workSessions.connects', 'When technicians log work sessions on a project, data automatically populates payroll timesheets. Drop counts, hours, or units convert directly to wages. No transcription required.')}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whyMatters', 'Why It Matters:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.workSessions.matters', '87-93% reduction in payroll errors. 15-25 hours per week saved. Zero disputes because system timestamps everything.')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">{t('modules.projects.integrations.payroll.title', 'Payroll')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whatConnects', 'What Connects:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.payroll.connects', 'Project-specific tracking feeds payroll calculations. Drop-based projects calculate piece work pay. Hours-based projects calculate hourly wages. Payroll module pulls all session data without manual entry.')}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whyMatters', 'Why It Matters:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.payroll.matters', 'Payroll runs in 30 minutes instead of 4-8 hours. Employees see exactly how their pay was calculated. Disputes drop to near zero.')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">{t('modules.projects.integrations.safety.title', 'Safety & Compliance')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whatConnects', 'What Connects:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.safety.connects', 'Each project links to required safety documentation: Rope Access Plans, Job Safety Analyses, Toolbox Meetings, Anchor Inspections. Attach directly to the relevant project.')}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whyMatters', 'Why It Matters:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.safety.matters', 'Building managers download compliance docs instantly. Complete audit trail for insurance. 10-20% insurance premium discount with documented safety program.')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">{t('modules.projects.integrations.calendar.title', 'Job Schedule & Calendar')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whatConnects', 'What Connects:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.calendar.connects', 'Creating a project with date range and assigned employees automatically generates calendar entries. Drag-and-drop rescheduling syncs back to project assignments. Conflict detection flags double-bookings.')}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whyMatters', 'Why It Matters:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.calendar.matters', 'Zero redundant data entry. Impossible to forget calendar entries. 5-10 hours per week saved. Prevent $2,000-$5,000 double-booking disasters.')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">{t('modules.projects.integrations.buildings.title', 'Buildings Database')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whatConnects', 'What Connects:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.buildings.connects', 'Projects link to building records containing address, contact info, access instructions, and historical maintenance data. System pulls existing building data automatically for repeat clients.')}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whyMatters', 'Why It Matters:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.buildings.matters', "No re-entering building details. Complete history of all work at each location. Property managers see building's maintenance timeline in one place.")}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">{t('modules.projects.integrations.residentPortal.title', 'Resident Portal')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whatConnects', 'What Connects:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.residentPortal.connects', 'Residents register with building-specific codes. They see progress on projects affecting their building, filtered to show only their elevation. Feedback submissions link directly to the relevant project.')}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whyMatters', 'Why It Matters:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.residentPortal.matters', 'Residents self-serve instead of calling. Complaints route directly to you with project context. Status calls drop 60-70%.')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">{t('modules.projects.integrations.documents.title', 'Documents Repository')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whatConnects', 'What Connects:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.documents.connects', 'Project-specific documents store in centralized repository with project tags. Safety docs, contracts, photos, reports all link back to their project. Search by project name, date, or type.')}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whyMatters', 'Why It Matters:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.documents.matters', 'Everything in one place. Insurance audits take minutes instead of hours. No more digging through email or truck compartments.')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">{t('modules.projects.integrations.clients.title', 'Client & Property Manager Records')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whatConnects', 'What Connects:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.clients.connects', 'Projects associate with client records containing contact preferences, billing details, and communication history. Building manager portal access grants visibility into all projects at their properties.')}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whyMatters', 'Why It Matters:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.clients.matters', 'Know which building manager prefers email versus phone. Track communication history when disputes arise. Building managers feel informed without requiring your time.')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">{t('modules.projects.integrations.complaints.title', 'Complaints & Feedback Management')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whatConnects', 'What Connects:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.complaints.connects', 'When residents or building managers submit feedback, it attaches to the specific project. You respond within the system. The full conversation history stays linked to the project record.')}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whyMatters', 'Why It Matters:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.complaints.matters', 'No digging through email threads to find complaint context. All stakeholders see the same conversation. Professional response tracking for client retention.')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">{t('modules.projects.integrations.invoicing.title', 'Invoicing')} <Badge variant="secondary" className="text-xs">{t('modules.projects.integrations.comingSoon', 'Coming Soon')}</Badge></CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whatConnects', 'What Connects:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.invoicing.connects', 'Project completion will trigger invoice generation. Labor hours and materials will auto-populate billing. Client portal will show project details matching invoice line items.')}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whyMatters', 'Why It Matters:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.invoicing.matters', 'Same-day invoicing instead of 1-2 week delays. Reduced billing disputes because backup documentation is transparent. Faster payment cycles improve cash flow.')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">{t('modules.projects.integrations.quoting.title', 'Quoting')} <Badge variant="secondary" className="text-xs">{t('modules.projects.integrations.comingSoon', 'Coming Soon')}</Badge></CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whatConnects', 'What Connects:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.quoting.connects', 'Historical project data will feed quote generation. System will suggest pricing based on similar past projects. Accepted quotes will convert directly to projects with one click.')}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{t('modules.projects.integrations.whyMatters', 'Why It Matters:')}</p>
                  <p className="text-muted-foreground mt-1">{t('modules.projects.integrations.quoting.matters', 'Accurate quotes based on real historical data. 25% improvement in quote accuracy. No more underbidding or leaving money on the table.')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Archive & Analytics */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('modules.projects.historical.title', 'Historical Data Makes Future Quotes Accurate')}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('modules.projects.historical.desc1', 'Completed projects are archived, not deleted. Search by building name, job type, date range, assigned employees, or completion status. Pull up analytics showing average drops per day, labor hours per building type, project duration trends.')}
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            {t('modules.projects.historical.desc2', '"Last time we did a 20-story window wash, it took 14 days with 2 techs averaging 8 drops per day." No more guessing. No more underbidding by 50%. No more overbidding by 30% and leaving money on the table.')}
          </p>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Problems Solved */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">{t('modules.projects.problems.title', 'Problems Solved')}</h2>
            <p className="text-muted-foreground mt-2">{t('modules.projects.problems.subtitle', 'Real problems. Real solutions that teams actually use.')}</p>
          </div>
          <Button onClick={toggleAll} variant="outline" data-testid="button-toggle-all-accordions">
            <ChevronsUpDown className="w-4 h-4 mr-2" />
            {allExpanded ? t('modules.projects.problems.collapseAll', 'Collapse All') : t('modules.projects.problems.expandAll', 'Expand All')}
          </Button>
        </div>

        <Accordion type="multiple" value={expandedProblems} onValueChange={setExpandedProblems} className="space-y-4">
          {/* Company Owners */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-600" />
              {t('modules.projects.problems.owners.title', 'For Rope Access Company Owners')}
            </h3>
            
            <AccordionItem value="owner-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I have no idea where my 6 active projects actually stand."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You drive site-to-site taking notes, wasting 10-15 hours per week just figuring out what's happening. You bid new work but aren't sure if your crew will finish current jobs on time.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Real-time dashboard showing every project's progress percentage, days remaining, assigned crew, and completion forecast. Filter by status, building, or technician.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Instant oversight without site visits. Confidently quote new work based on real crew availability. Make data-driven prioritization decisions in seconds, not hours.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-2" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"One tech is crushing it while another coasts, and I can't prove it."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> Two techs work the same 8-hour shift at the same building. You pay both full wages, but you're only getting one tech's worth of productivity. The underperformer coasts undetected.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Per-employee performance tracking showing drops or units completed per shift, target achievement rates, and historical trends with outlier detection.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Objective performance data for coaching conversations. High performers feel recognized. Clients see 20-30% faster project completion.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-3" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I create a project, then manually re-enter everything into my calendar."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> Same information lives in four different places, wasting 30-45 minutes per project. You forget to add a project to the calendar and the client calls on the scheduled start date asking where your crew is.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Creating a project with date range and assigned employees automatically populates calendar entries. Color-coded project bars show scheduling conflicts instantly.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Zero redundant data entry. Impossible to forget calendar entries. 5-10 hours per week saved. No more emergency scrambles.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-4" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I'm guessing which techs are available next week."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You need to quote a new project starting Monday but aren't sure who's available. You double-book Tommy on two simultaneous jobs 40 km apart and have to scramble for emergency coverage at premium rates.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Calendar view with employee availability filters, color-coded project bars, and automatic conflict detection that flags double-bookings.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Confidently commit to new work based on real availability. Prevent double-booking disasters that cost $2,000-$5,000 in emergency coverage.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-5" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I have no idea how long this type of job should take."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> A client asks you to quote a 15-story window wash. You can't find your notes from the similar job six months ago. You guess and either overbid and lose the contract, or underbid and lose money.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Searchable project archive with filters for date range, building type, job type. Analytics dashboard showing average drops per day by job type and project duration trends.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Data-driven quoting with 15-20% more accurate pricing. Prevent 3-5 underbids per year, saving $6,000-$10,000.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-6" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"My brain is my business, and it's exhausted."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You're mentally tracking which projects are behind schedule, who's assigned where, which clients owe invoices, when inspections are due. This cognitive overload leads to burnout and inability to take vacation.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Unified system externalizes your mental database. Projects, schedules, payroll, safety docs, and client communications live in one place with automated reminders.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Psychological load reduced by 60-70%. Mental bandwidth freed for strategic thinking. Ability to take actual vacations without midnight panic attacks.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-7" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"Building managers call me constantly asking 'How's it going?'"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> Your building manager client calls or texts 5-10 times per week asking for updates. You spend 3-4 hours per week on status calls instead of productive work and still sound vague.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Building manager portal with identical visibility to your internal dashboard. They see real-time progress by elevation, photo galleries, schedules, and safety documentation.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Status call volume drops 80%. Building managers perceive you as tech-savvy and professional. 15-25% higher contract renewal rates.
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>

          {/* Building Managers */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2 pt-8">
              <Building2 className="w-5 h-5 text-violet-600" />
              {t('modules.projects.problems.managers.title', 'For Building Managers & Property Managers')}
            </h3>
            
            <AccordionItem value="manager-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"Residents bombard me with status questions."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You receive 15-30 status calls per week. Unit 402 calls 8 PM Friday demanding no work Sunday. You scramble to contact the contractor and adjust their crew schedule. Two hours of chaos that could have been avoided.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Resident-facing portal showing real-time progress with 4-elevation visual system, upcoming work schedules, and expected completion dates.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Your time saved, 20+ hours per month. Resident complaints drop 60-70%. The contractor looks professional and transparent. Contract renewals increase 15-25%.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="manager-2" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I have no direct visibility into contractor progress."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You've hired a rope access company but have no way to verify they're working efficiently without site visits or constant calls. When residents ask for updates, you're reliant on the contractor's word.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Self-service portal access showing the exact same dashboard the rope access company sees. Real-time progress, crew assignments, safety documentation, all at your fingertips.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Answer questions instantly without contractor contact. Verify contractor performance objectively. Demonstrate professional property management through technology adoption.
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>

          {/* Residents */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2 pt-8">
              <HomeIcon className="w-5 h-5 text-rose-600" />
              {t('modules.projects.problems.residents.title', 'For Building Residents')}
            </h3>
            
            <AccordionItem value="resident-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I have no idea when they'll finish MY elevation."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You're planning a family gathering this weekend but don't know if there will be strangers outside your windows. You have a birthday party Sunday and want to make sure the crew won't be working that day. It takes 2 days to get an answer.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Resident portal showing progress specific to your elevation. "South Elevation: 45% complete. Expected to reach your floor (8th) on Thursday Dec 12. Entire elevation complete by Dec 15."
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Peace of mind through transparency. Plan your life around construction schedules. No need to bother your property manager for basic status updates.
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>

          {/* Technicians */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2 pt-8">
              <Wrench className="w-5 h-5 text-amber-600" />
              {t('modules.projects.problems.technicians.title', 'For Rope Access Technicians')}
            </h3>
            
            <AccordionItem value="tech-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I don't know what my daily target is."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You show up to the job site and start working, but you're not sure if you're working fast enough. You complete 3 drops in a day. Later you find out the target was 5 drops per day. Nobody told you.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Mobile app shows your assigned projects with clear daily targets. "Marina Towers - Window Cleaning. Your target: 5 drops/day. Yesterday you completed: 4 drops."
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Clear expectations. Self-manage your pace. Know if you're on track before supervisor feedback. Feel confident you're meeting standards.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tech-2" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I have no visibility into my own performance."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You're working hard, but you have no idea how you compare to other technicians or to your own past performance. Annual review time, your supervisor says "inconsistent performance" but gives no concrete data.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Performance dashboard showing your drops per day average, target achievement rate, and historical trends. "This month: 4.8 drops/day, 86% target achievement. Last month: 4.1 drops/day, 72%. You're improving."
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Objective self-assessment. Recognition for improvement. Clear areas for growth. Fair performance reviews based on data, not perception.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tech-3" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I don't know where I'm working tomorrow."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You finish work today and ask your supervisor "Where am I working tomorrow?" They say "I'll text you tonight." 9 PM rolls around, no text. You go to bed not knowing where to show up. 6 AM you get a text: "Marina Towers, be there by 7:30."
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Mobile app shows your upcoming assignments. "Tomorrow: Marina Towers - Window Cleaning, 8:00 AM - 4:00 PM. Thursday: Ocean View Apartments - Caulking, 8:00 AM - 4:00 PM."
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Plan your commute the night before. Know what equipment to bring. No confusion or miscommunication. Professional clarity about your schedule.
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>
        </Accordion>
      </section>

      <Separator className="my-8" />

      {/* Measurable Results Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">{t('modules.projects.results.title', 'Measurable Results')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('modules.projects.results.subtitle', 'Real numbers from real rope access operations')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-[#0B64A3]/10 dark:bg-[#0B64A3]/20 flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-[#0B64A3]" />
              </div>
              <CardTitle className="text-lg">{t('modules.projects.results.timeSavings.title', 'Time Savings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-base text-muted-foreground">
              <p>{t('modules.projects.results.timeSavings.desc1', 'Manual calendar management takes 30-45 minutes per project. Creating the project, blocking calendar dates, texting crew assignments, updating the whiteboard, checking for conflicts.')}</p>
              <p>{t('modules.projects.results.timeSavings.desc2', "With automatic calendar population, project creation takes 5 minutes. For 20 projects per month, that's 8+ hours saved monthly.")}</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-foreground">{t('modules.projects.results.timeSavings.highlight', 'Annual time savings worth $7,500 at owner rates.')}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-lg">{t('modules.projects.results.payrollAccuracy.title', 'Payroll Accuracy')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-base text-muted-foreground">
              <p>{t('modules.projects.results.payrollAccuracy.desc1', 'Work sessions logged in the field automatically feed payroll calculations. Drop counts, hours, and units convert directly to wages.')}</p>
              <p>{t('modules.projects.results.payrollAccuracy.desc2', 'No transcription from paper timesheets or text messages.')}</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-foreground">{t('modules.projects.results.payrollAccuracy.highlight', '87-93% reduction in payroll errors. Zero disputes because the system timestamps everything.')}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <CardTitle className="text-lg">{t('modules.projects.results.communication.title', 'Communication Efficiency')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-base text-muted-foreground">
              <p>{t('modules.projects.results.communication.desc1', 'Residents and building managers check progress themselves instead of calling. Property manager status calls drop 60-70% per active project.')}</p>
              <p>{t('modules.projects.results.communication.desc2', "For building managers handling 15-30 status calls per week during projects, that's 20+ hours per month reclaimed.")}</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-foreground">{t('modules.projects.results.communication.highlight', 'Your reputation improves because you look organized and transparent.')}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-lg">{t('modules.projects.results.quoteAccuracy.title', 'Quote Accuracy')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-base text-muted-foreground">
              <p>{t('modules.projects.results.quoteAccuracy.desc1', 'Historical project data shows how long similar buildings actually took. Average drops per day by job type. Labor hours per elevation. Project duration trends.')}</p>
              <p>{t('modules.projects.results.quoteAccuracy.desc2', 'Quote preparation drops from 45 minutes to 10 minutes.')}</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-foreground">{t('modules.projects.results.quoteAccuracy.highlight', 'Pricing accuracy improves 15-20%. Fewer lost contracts from overbidding. Fewer losses from underbidding.')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* FAQs Section */}
      <section id="knowledgebase" className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">{t('modules.projects.faq.title', 'Frequently Asked Questions')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('modules.projects.faq.subtitle', 'Common questions about the Project Management module')}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          <AccordionItem value="faq-1" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-left font-medium">{t('modules.projects.faq.q1', 'How does drop-based tracking work?')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              {t('modules.projects.faq.a1', 'Technicians log drops completed per elevation at the end of each work session. The system asks for North, East, South, and West counts separately. Progress calculates automatically based on target drops per direction. Visual progress bars show completion by elevation.')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-left font-medium">{t('modules.projects.faq.q2', 'Can building managers see everything we see?')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              {t('modules.projects.faq.a2', "Building managers see project progress, schedules, photo galleries, and safety documentation. They don't see internal performance metrics, piece work rates, or employee-specific data you'd rather keep private.")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-left font-medium">{t('modules.projects.faq.q3', 'What happens if we work on all four elevations simultaneously?')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              {t('modules.projects.faq.a3', 'Each technician logs drops for whichever elevation they worked. If Tommy worked North and Sarah worked East, their sessions record to their respective elevations. Total project progress combines all four automatically.')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-4" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-left font-medium">{t('modules.projects.faq.q4', 'Can we use our own job types?')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              {t('modules.projects.faq.a4', 'Yes. Create custom job types with your own names and tracking methods. Choose drop-based, hours-based, or unit-based tracking. Custom types save permanently and become available for all future projects.')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-5" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-left font-medium">{t('modules.projects.faq.q5', 'How does piece work pay calculate?')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              {t('modules.projects.faq.a5', 'Enable piece work mode on drop-based projects. Set the rate per drop. When a technician logs 20 drops at $8 per drop, the system calculates $160 for that session. The payroll module pulls this automatically. Technicians see exactly how their pay was calculated.')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-6" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-left font-medium">{t('modules.projects.faq.q6', 'What if a project gets delayed by weather?')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              {t('modules.projects.faq.a6', 'Put the project on hold with one click. Calendar entries update automatically. When weather clears, reactivate the project and adjust dates. Building manager portal shows the updated schedule. No need to send multiple update emails.')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-7" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-left font-medium">{t('modules.projects.faq.q7', 'Can technicians see their performance compared to others?')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              {t('modules.projects.faq.a7', "Technicians see their own performance metrics and trends. They don't see other technicians' data. Owners and supervisors see company-wide performance comparisons to identify coaching opportunities.")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-8" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-left font-medium">{t('modules.projects.faq.q8', 'How do I know if a project is falling behind?')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              {t('modules.projects.faq.a8', 'The dashboard shows expected completion versus current pace. If a project is behind target, visual indicators flag it before clients notice. You can adjust crew assignments or extend timelines proactively.')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-9" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-left font-medium">{t('modules.projects.faq.q9', 'What happens to completed projects?')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              {t('modules.projects.faq.a9', 'Completed projects archive automatically but remain searchable. Historical data powers accurate future quoting. Building managers can still access project records for compliance verification. Nothing gets deleted unless you explicitly choose to.')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-10" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-left font-medium">{t('modules.projects.faq.q10', 'Does the calendar sync with Google Calendar or Outlook?')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              {t('modules.projects.faq.a10', "The OnRopePro calendar is the source of truth. We're evaluating external calendar sync for future development. For now, the system ensures all internal stakeholders see the same schedule without needing external tools.")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA Section - Stop Juggling. Start Managing. */}
      <section className="py-16 md:py-20 px-4 text-white" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('modules.projects.cta.title', 'Stop Juggling. Start Managing.')}
          </h2>
          <div className="text-lg text-blue-100 space-y-4 max-w-2xl mx-auto">
            <p>{t('modules.projects.cta.desc1', "Right now you're spending 10-15 hours per week just figuring out what's happening. Driving site to site. Taking notes. Comparing where crews are today versus yesterday. Waking up at 3 AM wondering if you forgot to schedule tomorrow's job.")}</p>
            <p>{t('modules.projects.cta.desc2', 'The dashboard shows you everything without leaving your desk. Real-time progress. Per-employee performance. Calendar automatically populated. Conflicts flagged before they become emergencies. Building managers checking progress themselves instead of calling you.')}</p>
            <p className="font-medium text-white">{t('modules.projects.cta.desc3', 'Your brain stops being the database. The system carries the cognitive load. Your mental bandwidth goes to growing the business instead of tracking the business.')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-cta-trial-bottom">
              {t('modules.projects.cta.trialButton', 'Start Your Free 60-Day Trial')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-cta-modules">
              <Link href="/modules">
                {t('modules.projects.cta.modulesButton', 'Explore All Modules')}
                <ArrowRight className="ml-2 w-5 h-5" />
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
            <span className="text-sm text-muted-foreground">{t('modules.projects.footer.tagline', 'Management Software for Rope Access')}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground transition-colors">{t('modules.projects.footer.pricing', 'Pricing')}</Link>
            <Link href="/changelog" className="hover:text-foreground transition-colors">{t('modules.projects.footer.changelog', 'Changelog')}</Link>
            <Link href="/" className="hover:text-foreground transition-colors">{t('modules.projects.footer.signIn', 'Sign In')}</Link>
          </div>
        </div>
      </footer>

      <EmployerRegistration open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
}
