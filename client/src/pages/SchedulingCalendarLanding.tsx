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
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  HardHat,
  Building2,
  Users,
  Calendar,
  CalendarDays,
  Clock,
  AlertTriangle,
  Shield,
  UserCog,
  MousePointerClick,
  Eye,
  Layers,
  CheckCircle2,
  ChevronsUpDown,
  CalendarCheck,
  CalendarX,
  TimerOff,
  ClipboardList,
  FileText,
  DollarSign
} from "lucide-react";

const PROBLEM_ACCORDION_ITEMS = [
  "owner-1", "owner-2", "owner-3",
  "ops-1",
  "tech-1",
  "bm-1"
];

export default function SchedulingCalendarLanding() {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [faqOpenItems, setFaqOpenItems] = useState<string[]>([]);
  const { openLogin } = useAuthPortal();
  const [showRegistration, setShowRegistration] = useState(false);
  
  const allExpanded = openItems.length === PROBLEM_ACCORDION_ITEMS.length;
  
  const toggleAll = () => {
    setOpenItems(allExpanded ? [] : [...PROBLEM_ACCORDION_ITEMS]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="modules" />
      
      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              {t('modules.scheduling.hero.badge', 'Scheduling & Calendar Module')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('modules.scheduling.hero.titleLine1', 'Stop Booking Dave in')}<br />
              {t('modules.scheduling.hero.titleLine2', 'Two Places on Monday.')}<br />
              <span className="text-blue-100">{t('modules.scheduling.hero.titleLine3', 'Zero 6am emergency calls.')}</span>
            </h1>
            
            <div className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed space-y-4">
              <p>
                {t('modules.scheduling.hero.description', 'Automatic conflict detection prevents double-booking before it happens. Dual calendar views show every project and every technician at a glance. Time-off blocks scheduling automatically.')}
              </p>
              <p>
                <strong>{t('modules.scheduling.hero.tagline', 'One system. Zero surprises.')}</strong>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-hero-trial">
                {t('modules.scheduling.hero.ctaTrial', 'Start Your Free 60-Day Trial')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={openLogin} data-testid="button-hero-signin">
                Sign In
              </Button>
            </div>
            
            <SoftwareReplaces 
              software={MODULE_SOFTWARE_MAPPING["scheduling-calendar"]} 
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
                <div className="text-center" data-testid="stat-time-saved">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">{t('modules.scheduling.stats.timeSavedValue', '8+ hrs')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.scheduling.stats.timeSavedLabel', 'Saved monthly on scheduling')}</div>
                </div>
                <div className="text-center" data-testid="stat-conflict-types">
                  <div className="text-3xl md:text-4xl font-bold text-rose-600">{t('modules.scheduling.stats.conflictTypesValue', '3')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.scheduling.stats.conflictTypesLabel', 'Conflict types prevented')}</div>
                </div>
                <div className="text-center" data-testid="stat-leave-types">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">{t('modules.scheduling.stats.leaveTypesValue', '10')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.scheduling.stats.leaveTypesLabel', 'Leave types supported')}</div>
                </div>
                <div className="text-center" data-testid="stat-calendar-views">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">{t('modules.scheduling.stats.calendarViewsValue', '2')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.scheduling.stats.calendarViewsLabel', 'Calendar views included')}</div>
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
            {t('modules.scheduling.problem.title', 'The Monday Morning Disaster Nobody Planned')}
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                {t('modules.scheduling.problem.intro', "Friday afternoon. Golf tournament in an hour. You're throwing names right, left, and center to fill the spots for next week. Monday morning at 6am, your phone rings.")}
              </p>
              <p className="text-base">
                {t('modules.scheduling.problem.scenario', "Jack needs you to pull someone from one building, grab rope from the shop because it's not long enough for another building, and get a different tech to a third site with his gear. Your whole week is ruined before breakfast.")}
              </p>
              <p className="text-base">
                {t('modules.scheduling.problem.cause', "This happens because your project lives in one place, your calendar lives in another, and crew assignments live in a text thread. You create the window washing project. Then you open Float and recreate it. Name the project. Block the dates. Assign employees. Tag a color. Project gets pushed five days? Update both systems. Or forget to update one. And then watch the dominoes fall.")}
              </p>
              <p className="text-base font-medium text-foreground">
                {t('modules.scheduling.problem.solution', 'OnRopePro connects your projects directly to your schedule. Create a project with dates and assigned crew. The calendar populates automatically. Change the project dates and the schedule updates. Try to assign someone who\'s already booked elsewhere and the system warns you before you create the conflict. No more "Oh shit, I forgot to schedule that" emergencies.')}
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
            {t('modules.scheduling.features.title', 'What This Module Does')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.scheduling.features.subtitle', 'Visual scheduling with automatic conflict prevention, connected directly to your projects.')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card data-testid="card-conflict-detection">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.scheduling.features.conflictDetection.title', 'Automatic Conflict Detection')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  {t('modules.scheduling.features.conflictDetection.description', 'The system checks three conditions before allowing any assignment: existing project assignments, approved time-off requests, and date overlaps. If any condition fails, you see a warning with full details before you can proceed.')}
                </p>
                <div className="space-y-2 text-base text-muted-foreground">
                  <p className="font-medium text-foreground">{t('modules.scheduling.features.conflictDetection.listTitle', 'What gets prevented:')}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>{t('modules.scheduling.features.conflictDetection.item1', 'Double-booking technicians on overlapping projects')}</li>
                    <li>{t('modules.scheduling.features.conflictDetection.item2', 'Scheduling during approved vacation')}</li>
                    <li>{t('modules.scheduling.features.conflictDetection.item3', 'Assigning crew to conflicting date ranges')}</li>
                    <li>{t('modules.scheduling.features.conflictDetection.item4', 'Friday afternoon mistakes becoming Monday disasters')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="card-dual-calendar">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.scheduling.features.dualCalendar.title', 'Dual Calendar Views')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  {t('modules.scheduling.features.dualCalendar.description', "Two views working together give you complete visibility. Project Calendar shows all jobs on a timeline with color-coded blocks. Resource Timeline shows employee workloads by row so you can see who's available and who's overloaded at a glance.")}
                </p>
                <div className="space-y-2 text-base text-muted-foreground">
                  <p className="font-medium text-foreground">{t('modules.scheduling.features.dualCalendar.listTitle', 'What you see:')}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>{t('modules.scheduling.features.dualCalendar.item1', 'All upcoming projects (even unassigned ones)')}</li>
                    <li>{t('modules.scheduling.features.dualCalendar.item2', "Each employee's schedule on a single row")}</li>
                    <li>{t('modules.scheduling.features.dualCalendar.item3', 'Availability gaps between assignments')}</li>
                    <li>{t('modules.scheduling.features.dualCalendar.item4', 'Time-off displayed inline with work')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="card-project-integrated">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.scheduling.features.projectIntegrated.title', 'Project-Integrated Scheduling')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  {t('modules.scheduling.features.projectIntegrated.description', 'Create a project with date range and assigned employees. The schedule populates automatically. Change the project and the schedule updates. No duplicate data entry. No systems falling out of sync.')}
                </p>
                <div className="space-y-2 text-base text-muted-foreground">
                  <p className="font-medium text-foreground">{t('modules.scheduling.features.projectIntegrated.listTitle', 'What stays connected:')}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>{t('modules.scheduling.features.projectIntegrated.item1', 'Project dates flow to calendar entries')}</li>
                    <li>{t('modules.scheduling.features.projectIntegrated.item2', 'Employee assignments appear in both views')}</li>
                    <li>{t('modules.scheduling.features.projectIntegrated.item3', 'Changes propagate automatically')}</li>
                    <li>{t('modules.scheduling.features.projectIntegrated.item4', 'One source of truth for project and schedule')}</li>
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
            {t('modules.scheduling.stakeholders.title', 'Who Benefits From This Module')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.scheduling.stakeholders.subtitle', 'Every stakeholder gets the scheduling visibility and conflict prevention they need.')}
          </p>
          
          <div className="space-y-8">
            {/* For Company Owners */}
            <Card className="overflow-hidden" data-testid="card-stakeholder-owners">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.scheduling.stakeholders.owners.title', 'For Company Owners')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.scheduling.stakeholders.owners.benefit1Title', 'Monday mornings without disaster calls.')}</h4>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.owners.benefit1Desc', 'The system catches Friday afternoon mistakes before they become Monday morning emergencies. Automatic conflict detection prevents the double-booking that triggers phone calls at 6am.')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.scheduling.stakeholders.owners.benefit2Title', 'Protect your contract renewals.')}</h4>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.owners.benefit2Desc1', 'First-day no-shows kill contract renewals. Visual scheduling ensures your most important days are properly staffed.')}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.owners.benefit2Desc2', 'The $30,000 annual contract you protect pays for the software many times over.')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.scheduling.stakeholders.owners.benefit3Title', 'End the culture of disorganization.')}</h4>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.owners.benefit3Desc', 'When scheduling works, everything else works better. Professional culture. Calm mornings. Reduced stress throughout the organization.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Operations Managers */}
            <Card className="overflow-hidden" data-testid="card-stakeholder-ops">
              <CardHeader className="bg-sky-50 dark:bg-sky-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <UserCog className="w-5 h-5 text-sky-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.scheduling.stakeholders.ops.title', 'For Operations Managers and Supervisors')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.scheduling.stakeholders.ops.benefit1Title', 'See your entire crew at a glance.')}</h4>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.ops.benefit1Desc1', 'Resource Timeline shows each employee on a single row. Spot availability gaps before they become coverage emergencies.')}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.ops.benefit1Desc2', 'Balance workloads to prevent burnout.')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.scheduling.stakeholders.ops.benefit2Title', 'Stop the detective work.')}</h4>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.ops.benefit2Desc1', 'When a building manager asks "Can you take this new project next week?" you answer with confidence.')}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.ops.benefit2Desc2', 'You see exactly who\'s available without 20 minutes of checking spreadsheets and text threads.')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.scheduling.stakeholders.ops.benefit3Title', 'Drag and drop with protection.')}</h4>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.ops.benefit3Desc1', 'Select employee, drag to project, confirm dates. The system highlights valid drop zones and warns on conflicts.')}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.ops.benefit3Desc2', 'Fast scheduling with automatic safeguards.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Technicians */}
            <Card className="overflow-hidden" data-testid="card-stakeholder-technicians">
              <CardHeader className="bg-amber-50 dark:bg-amber-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.scheduling.stakeholders.technicians.title', 'For Technicians')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.scheduling.stakeholders.technicians.benefit1Title', 'Know where you\'re going before Monday.')}</h4>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.technicians.benefit1Desc1', 'Permission-based schedule visibility lets you see your upcoming assignments through the app.')}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.technicians.benefit1Desc2', 'No more waiting until Monday morning to find out your location.')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.scheduling.stakeholders.technicians.benefit2Title', 'Schedule changes reach you.')}</h4>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.technicians.benefit2Desc1', 'When your assignment changes, the updated schedule is visible immediately.')}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.technicians.benefit2Desc2', 'Fewer wasted trips to the wrong building.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Building Managers */}
            <Card className="overflow-hidden" data-testid="card-stakeholder-building-mgrs">
              <CardHeader className="bg-violet-50 dark:bg-violet-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.scheduling.stakeholders.buildingMgrs.title', 'For Building Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.scheduling.stakeholders.buildingMgrs.benefit1Title', 'Your crews show up when scheduled.')}</h4>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.buildingMgrs.benefit1Desc1', 'Conflict prevention and visual scheduling help rope access companies ensure first days are properly staffed.')}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.buildingMgrs.benefit1Desc2', 'Fewer no-shows mean fewer embarrassing calls to residents.')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.scheduling.stakeholders.buildingMgrs.benefit2Title', 'Instant answers to schedule questions.')}</h4>
                    <p className="text-base text-muted-foreground">
                      {t('modules.scheduling.stakeholders.buildingMgrs.benefit2Desc', '"Is your crew on-site today?" The company owner can answer immediately because they see exactly which buildings have crews scheduled.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Property Managers */}
            <Card className="overflow-hidden" data-testid="card-stakeholder-property-mgrs">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.scheduling.stakeholders.propertyMgrs.title', 'For Property Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">{t('modules.scheduling.stakeholders.propertyMgrs.benefitTitle', 'Reliable contractor coordination.')}</h4>
                  <p className="text-base text-muted-foreground">
                    {t('modules.scheduling.stakeholders.propertyMgrs.benefitDesc', 'When the rope access company confirms a start date, you can trust that their crew scheduling actually supports it. Professional operations use professional systems.')}
                  </p>
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
            {t('modules.scheduling.keyFeatures.title', 'Key Features')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.scheduling.keyFeatures.subtitle', 'Everything you need to schedule crews confidently and prevent conflicts before they happen.')}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.scheduling.keyFeatures.conflictEngine.title', 'Conflict Detection Engine')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.scheduling.keyFeatures.conflictEngine.desc1', 'Before any assignment is created, the system checks for existing assignments, approved time-off, and date overlaps.')}
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      {t('modules.scheduling.keyFeatures.conflictEngine.desc2', 'Conflicts display detailed warnings. You can override if necessary, but you cannot accidentally create scheduling disasters.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.scheduling.keyFeatures.projectCalendar.title', 'Project Calendar (Job Calendar)')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.scheduling.keyFeatures.projectCalendar.desc1', 'View all projects on a timeline with color-coded blocks. See multi-day spans at a glance. Identify gaps in scheduling.')}
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      {t('modules.scheduling.keyFeatures.projectCalendar.desc2', 'View projects even if no one is assigned yet. Month, week, and day views available.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.scheduling.keyFeatures.resourceTimeline.title', 'Resource Timeline (Employee Calendar)')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.scheduling.keyFeatures.resourceTimeline.desc1', 'Each row represents one employee. Horizontal bars show where they are assigned. Gaps are visually obvious.')}
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      {t('modules.scheduling.keyFeatures.resourceTimeline.desc2', 'Time-off displayed inline. See workload distribution across your entire crew instantly.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <MousePointerClick className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.scheduling.keyFeatures.dragDrop.title', 'Drag-and-Drop Assignment')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.scheduling.keyFeatures.dragDrop.desc1', 'Select an employee from the panel. Drag onto the project calendar at the desired date. System highlights valid drop zones.')}
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      {t('modules.scheduling.keyFeatures.dragDrop.desc2', 'Confirm the date range in the popup. Assignment created with conflict checking automatic.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <CalendarX className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.scheduling.keyFeatures.timeOff.title', 'Time-Off Management')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.scheduling.keyFeatures.timeOff.desc1', '10 leave types including vacation, sick leave, personal, bereavement, and medical. Employees submit requests. Managers approve or deny with reason.')}
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      {t('modules.scheduling.keyFeatures.timeOff.desc2', 'Approved time-off automatically blocks scheduling for those dates.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.scheduling.keyFeatures.permissions.title', 'Permission-Based Visibility')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.scheduling.keyFeatures.permissions.desc1', 'Company owners control who sees what. Enable schedule visibility for technicians. Give managers access to full schedule or just their crews.')}
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      {t('modules.scheduling.keyFeatures.permissions.desc2', 'Granular permissions for viewing, editing, and approving.')}
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
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">{t('modules.scheduling.problemsSolved.title', 'Problems Solved')}</h2>
            <Button onClick={toggleAll} variant="outline" data-testid="button-toggle-all-accordions">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allExpanded ? t('modules.scheduling.problemsSolved.collapseAll', 'Collapse All') : t('modules.scheduling.problemsSolved.expandAll', 'Expand All')}
            </Button>
          </div>

          {/* For Company Owners */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl md:text-2xl font-semibold">{t('modules.scheduling.problemsSolved.forOwners', 'For Company Owners')}</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="owner-1" className="border rounded-lg px-4" data-testid="accordion-owner-1">
                <AccordionTrigger className="text-left font-medium">
                  {t('modules.scheduling.problemsSolved.owner1.trigger', '"Next thing you know, Dave is booked at two places to start two new projects on Monday."')}
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.painLabel', 'The Pain:')}</span> {t('modules.scheduling.problemsSolved.owner1.pain', "Friday afternoon rushing to fill spots for next week. Golf tournament in an hour. You're throwing names right, left, center. Dave gets booked on two jobs starting the same day. You don't catch it until Sunday night when you're reviewing the schedule.")}
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.exampleLabel', 'Real Example:')}</span> {t('modules.scheduling.problemsSolved.owner1.example', 'Now you have to call your ops manager during his family barbecue to change everything. The stress cascades through the organization.')}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.solutionLabel', 'Solution:')}</span> {t('modules.scheduling.problemsSolved.owner1.solution', 'Automatic conflict detection prevents the double-booking in the first place. The moment you try to assign Dave to a second project on the same day, the system displays a warning with details about his existing assignment.')}
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.benefitLabel', 'Benefit:')}</span> {t('modules.scheduling.problemsSolved.owner1.benefit', 'The conflict cannot be created accidentally. Zero Sunday night surprises. Zero Monday morning scrambles.')}
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className="border rounded-lg px-4" data-testid="accordion-owner-2">
                <AccordionTrigger className="text-left font-medium">
                  {t('modules.scheduling.problemsSolved.owner2.trigger', '"You don\'t show up on the first day, especially on a new contract. It\'s just bad news all around."')}
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.painLabel', 'The Pain:')}</span> {t('modules.scheduling.problemsSolved.owner2.pain', 'The property manager is waiting. Building manager has keys ready. Residents got notices in the elevator two weeks ago. Everyone expects you on December 15th.')}
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.exampleLabel', 'Real Example:')}</span> {t('modules.scheduling.problemsSolved.owner2.example', "Double-booking means pulling people from other buildings to cover. Now you're behind everywhere. Techs working alone (safety violation). And the client who was waiting? They remember.")}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.solutionLabel', 'Solution:')}</span> {t('modules.scheduling.problemsSolved.owner2.solution', 'Visual calendar shows all project start dates with assigned technicians. Resource Timeline reveals if critical first days are understaffed. You can see at a glance whether your most important days are properly covered.')}
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.benefitLabel', 'Benefit:')}</span> {t('modules.scheduling.problemsSolved.owner2.benefit', 'The contract renewal you protect pays for the software. One saved $30,000 annual contract covers years of subscription fees.')}
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className="border rounded-lg px-4" data-testid="accordion-owner-3">
                <AccordionTrigger className="text-left font-medium">
                  {t('modules.scheduling.problemsSolved.owner3.trigger', '"A guy would book two weeks vacation and then Jeff would just forget and book him at a building."')}
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.painLabel', 'The Pain:')}</span> {t('modules.scheduling.problemsSolved.owner3.pain', 'Approved vacation sitting in an email or a text. Then forgotten when scheduling next week. Monday morning: "Where\'s Dave?" "He\'s in Mexico."')}
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.exampleLabel', 'Real Example:')}</span> {t('modules.scheduling.problemsSolved.owner3.example', 'Pull people from other buildings. Again. The vacation that was approved two months ago creates chaos because nobody remembered to check before scheduling.')}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.solutionLabel', 'Solution:')}</span> {t('modules.scheduling.problemsSolved.owner3.solution', 'Approved time-off automatically blocks scheduling for those dates. When you try to assign someone on approved vacation, the system displays a conflict warning. The employee appears as unavailable in the drag-and-drop panel.')}
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.benefitLabel', 'Benefit:')}</span> {t('modules.scheduling.problemsSolved.owner3.benefit', 'The vacation you approved two months ago still protects that employee from being scheduled. Zero "he\'s in Mexico" surprises.')}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Operations Managers */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-3 pb-2 border-b">
              <UserCog className="w-5 h-5 text-sky-500" />
              <h3 className="text-xl md:text-2xl font-semibold">{t('modules.scheduling.problemsSolved.forOps', 'For Operations Managers')}</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="ops-1" className="border rounded-lg px-4" data-testid="accordion-ops-1">
                <AccordionTrigger className="text-left font-medium">
                  {t('modules.scheduling.problemsSolved.ops1.trigger', '"I had to go from project to project and look at the guys on the rope and take notes of where they\'re at compared to yesterday."')}
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.painLabel', 'The Pain:')}</span> {t('modules.scheduling.problemsSolved.ops1.pain', "No single view of crew workload. Some techs overworked, others sitting idle. You don't know until you're physically visiting each site.")}
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.exampleLabel', 'Real Example:')}</span> {t('modules.scheduling.problemsSolved.ops1.example', "Imbalanced assignments burn out your best people while newer techs don't get enough experience. Driving between sites just to understand who's where.")}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.solutionLabel', 'Solution:')}</span> {t('modules.scheduling.problemsSolved.ops1.solution', "Resource Timeline shows each employee's schedule on a single row. See who's booked solid versus who has gaps. Visual representation of workload across your entire crew.")}
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.benefitLabel', 'Benefit:')}</span> {t('modules.scheduling.problemsSolved.ops1.benefit', 'Make proactive decisions about workload distribution before anyone gets burned out. Balance assignments from your desk instead of driving between sites.')}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Technicians */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-3 pb-2 border-b">
              <HardHat className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl md:text-2xl font-semibold">{t('modules.scheduling.problemsSolved.forTechs', 'For Technicians')}</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="tech-1" className="border rounded-lg px-4" data-testid="accordion-tech-1">
                <AccordionTrigger className="text-left font-medium">
                  {t('modules.scheduling.problemsSolved.tech1.trigger', '"They would be told on Monday, go to this address. You go to this address."')}
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.painLabel', 'The Pain:')}</span> {t('modules.scheduling.problemsSolved.tech1.pain', "No visibility into your own schedule. You find out Monday morning where you're supposed to be. Hard to plan your week. Hard to plan your life.")}
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.exampleLabel', 'Real Example:')}</span> {t('modules.scheduling.problemsSolved.tech1.example', 'Show up expecting to work at one building, then get redirected mid-morning. Wasted driving time. Confusion about what gear to bring.')}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.solutionLabel', 'Solution:')}</span> {t('modules.scheduling.problemsSolved.tech1.solution', "Permission-based schedule visibility. If the employer enables it, you see your upcoming assignments through the app. You know where you're going before Monday.")}
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.benefitLabel', 'Benefit:')}</span> {t('modules.scheduling.problemsSolved.tech1.benefit', 'Changes are visible immediately. Plan your commute. Pack the right gear. Fewer wasted trips to the wrong building.')}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Building Managers */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Building2 className="w-5 h-5 text-violet-500" />
              <h3 className="text-xl md:text-2xl font-semibold">{t('modules.scheduling.problemsSolved.forBM', 'For Building Managers')}</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="bm-1" className="border rounded-lg px-4" data-testid="accordion-bm-1">
                <AccordionTrigger className="text-left font-medium">
                  {t('modules.scheduling.problemsSolved.bm1.trigger', '"You don\'t show up on the first day where everybody\'s waiting for you. It\'s just bad news all around."')}
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.painLabel', 'The Pain:')}</span> {t('modules.scheduling.problemsSolved.bm1.pain', "You prepared for the rope access crew. Notices went to residents. Keys are ready. Access arranged. They don't show up.")}
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.exampleLabel', 'Real Example:')}</span> {t('modules.scheduling.problemsSolved.bm1.example', "Your phone starts ringing. Angry residents. You look incompetent to your board. The contractor's scheduling failure becomes your reputation problem.")}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.solutionLabel', 'Solution:')}</span> {t('modules.scheduling.problemsSolved.bm1.solution', "OnRopePro's conflict prevention helps rope access companies ensure first days are properly staffed. Professional systems create reliable contractors.")}
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
                    <span className="font-medium text-foreground">{t('modules.scheduling.problemsSolved.benefitLabel', 'Benefit:')}</span> {t('modules.scheduling.problemsSolved.bm1.benefit', 'Your reputation protected. Work with companies that operate like professionals and show up when they say they will.')}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Connected Modules Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.scheduling.connectedModules.title', 'Connected Modules')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.scheduling.connectedModules.subtitle', 'The Scheduling module connects seamlessly with other OnRopePro modules. Data flows automatically, eliminating duplicate entry.')}
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-base font-medium">{t('modules.scheduling.connectedModules.projectMgmt.title', 'Project Management')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground">{t('modules.scheduling.connectedModules.projectMgmt.item1', 'Calendar entries generate from project dates')}</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground">{t('modules.scheduling.connectedModules.projectMgmt.item2', 'Schedule updates when project dates change')}</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground">{t('modules.scheduling.connectedModules.projectMgmt.item3', 'No separate systems to maintain')}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-base font-medium">{t('modules.scheduling.connectedModules.employeeMgmt.title', 'Employee Management')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground">{t('modules.scheduling.connectedModules.employeeMgmt.item1', 'Active employees appear in scheduling panel')}</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground">{t('modules.scheduling.connectedModules.employeeMgmt.item2', 'Deactivated employees removed from options')}</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground">{t('modules.scheduling.connectedModules.employeeMgmt.item3', 'Permissions controlled through Employee settings')}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-base font-medium">{t('modules.scheduling.connectedModules.timeTracking.title', 'Time Tracking')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground">{t('modules.scheduling.connectedModules.timeTracking.item1', 'Work sessions link to scheduled projects')}</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground">{t('modules.scheduling.connectedModules.timeTracking.item2', 'Compare scheduled vs actual hours worked')}</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground">{t('modules.scheduling.connectedModules.timeTracking.item3', 'Identify projects running over or under')}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-base font-medium">{t('modules.scheduling.connectedModules.payroll.title', 'Payroll')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground">{t('modules.scheduling.connectedModules.payroll.item1', 'Scheduled projects feed payroll calculations')}</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground">{t('modules.scheduling.connectedModules.payroll.item2', 'Technician assignments connect to job costing')}</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground">{t('modules.scheduling.connectedModules.payroll.item3', 'Hours categorized automatically for processing')}</span>
                </div>
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
            {t('modules.scheduling.results.title', 'Measurable Results')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.scheduling.results.subtitle', 'Real improvements you can expect when scheduling actually works.')}
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <TimerOff className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{t('modules.scheduling.results.timeSaved.value', '8+ hours')}</div>
                    <div className="text-base text-muted-foreground mt-1">
                      {t('modules.scheduling.results.timeSaved.description', 'Saved monthly on duplicate data entry. 30-45 minutes per project saved. For 20 projects per month: 8+ hours reclaimed.')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-rose-200 dark:border-rose-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-rose-600">{t('modules.scheduling.results.zeroEmergencies.value', 'Zero')}</div>
                    <div className="text-base text-muted-foreground mt-1">
                      {t('modules.scheduling.results.zeroEmergencies.description', 'Monday morning emergencies from double-booking. Zero 6am phone calls. Zero Sunday barbecue interruptions.')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <CalendarCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-600">{t('modules.scheduling.results.contractsProtected.value', '$30K+')}</div>
                    <div className="text-base text-muted-foreground mt-1">
                      {t('modules.scheduling.results.contractsProtected.description', 'Contract renewals protected. First-day no-shows kill renewals. One saved annual contract pays for the software for years.')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-amber-200 dark:border-amber-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-600">{t('modules.scheduling.results.morale.value', 'Improved')}</div>
                    <div className="text-base text-muted-foreground mt-1">
                      {t('modules.scheduling.results.morale.description', 'Team morale. Calm Monday mornings. Reduced stress. Technicians know their schedule in advance. Managers plan instead of react.')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* FAQ Section */}
      <section id="faqs" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.scheduling.faqs.title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.scheduling.faqs.subtitle', 'Common questions about scheduling and calendar functionality.')}
          </p>
          
          <Accordion type="multiple" value={faqOpenItems} onValueChange={setFaqOpenItems} className="space-y-3">
            <AccordionItem value="faq-1" className="border rounded-lg px-4" data-testid="accordion-faq-1">
              <AccordionTrigger className="text-left font-medium">
                {t('modules.scheduling.faqs.q1.question', 'Can technicians see their own schedule?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.scheduling.faqs.q1.answer', 'Yes, if you enable the permission. Company owners control whether technicians can view their own upcoming assignments. You can also enable viewing the full team schedule for supervisors and managers.')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-2" className="border rounded-lg px-4" data-testid="accordion-faq-2">
              <AccordionTrigger className="text-left font-medium">
                {t('modules.scheduling.faqs.q2.question', "What happens if I try to assign someone who's on vacation?")}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.scheduling.faqs.q2.answer', 'The system displays a conflict warning showing the approved time-off dates. You see the warning before the assignment is created. You can override if necessary, but you cannot accidentally schedule someone during approved vacation.')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-3" className="border rounded-lg px-4" data-testid="accordion-faq-3">
              <AccordionTrigger className="text-left font-medium">
                {t('modules.scheduling.faqs.q3.question', "Can I still make scheduling decisions if there's a conflict?")}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.scheduling.faqs.q3.answer', 'Yes. Conflict warnings display details and give you the option to proceed or cancel. The system prevents accidents, not decisions. You remain in control.')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-4" className="border rounded-lg px-4" data-testid="accordion-faq-4">
              <AccordionTrigger className="text-left font-medium">
                {t('modules.scheduling.faqs.q4.question', 'How does the calendar connect to projects?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.scheduling.faqs.q4.answer', 'When you create a project with date range and assigned employees, calendar entries generate automatically. Change the project dates and the calendar updates. One system, one truth.')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-5" className="border rounded-lg px-4" data-testid="accordion-faq-5">
              <AccordionTrigger className="text-left font-medium">
                {t('modules.scheduling.faqs.q5.question', 'What time-off types are supported?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.scheduling.faqs.q5.answer', '10 leave types: vacation, sick leave, personal leave, bereavement, jury duty, medical leave, family emergency, unpaid leave, training/development, and military leave. Each displays distinctly on the calendar.')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-6" className="border rounded-lg px-4" data-testid="accordion-faq-6">
              <AccordionTrigger className="text-left font-medium">
                {t('modules.scheduling.faqs.q6.question', 'Can I see both projects and employees in one view?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.scheduling.faqs.q6.answer', 'The dual calendar system provides two complementary views. Project Calendar shows all jobs on a timeline. Resource Timeline shows employee workloads by row. Use both together for complete visibility.')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-7" className="border rounded-lg px-4" data-testid="accordion-faq-7">
              <AccordionTrigger className="text-left font-medium">
                {t('modules.scheduling.faqs.q7.question', 'How does drag-and-drop work?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.scheduling.faqs.q7.answer', 'Select an employee from the panel. Drag onto the project calendar at the desired date. System highlights valid drop zones. Confirm date range in the popup. Assignment created with automatic conflict checking.')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-8" className="border rounded-lg px-4" data-testid="accordion-faq-8">
              <AccordionTrigger className="text-left font-medium">
                {t('modules.scheduling.faqs.q8.question', 'What if someone calls in sick last minute?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.scheduling.faqs.q8.answer', "You can update their status to sick leave for the current day. The Resource Timeline immediately shows them as unavailable. You can then see who's available to cover based on their current assignments.")}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-9" className="border rounded-lg px-4" data-testid="accordion-faq-9">
              <AccordionTrigger className="text-left font-medium">
                {t('modules.scheduling.faqs.q9.question', 'Who can approve time-off requests?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.scheduling.faqs.q9.answer', 'Managers with the appropriate permission can approve or deny time-off requests. Approvals automatically add the time-off to the calendar and block scheduling. Denials notify the employee with reason.')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('modules.scheduling.finalCta.title', 'Stop Fighting Fires. Start Running a Business.')}
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            {t('modules.scheduling.finalCta.description', "Monday mornings become boring. The phone doesn't ring at 6am. Your ops manager enjoys his Sunday barbecue. Your crews show up where they're supposed to. That's what it looks like when scheduling just works.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#0B64A3] hover:bg-[#0369A1] text-white" onClick={() => setShowRegistration(true)} data-testid="button-final-cta">
              {t('modules.scheduling.finalCta.ctaTrial', 'Start Your Free 60-Day Trial')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-contact">
              <Link href="/contact">
                {t('modules.scheduling.finalCta.ctaContact', 'Talk to Our Team')}
              </Link>
            </Button>
          </div>
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
