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
import {
  DollarSign,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Briefcase,
  Building2,
  HardHat,
  Clock,
  MapPin,
  Calculator,
  FileText,
  Settings,
  TrendingUp,
  Users,
  Calendar,
  Shield,
  BarChart3,
  Zap,
  FileSpreadsheet,
  Timer,
  Target,
  PiggyBank
} from "lucide-react";

export default function PayrollFinancialLanding() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [timeReduction, setTimeReduction] = useState(0);
  const [annualValue, setAnnualValue] = useState(0);
  const [hoursSaved, setHoursSaved] = useState(0);
  const [problemsSolved, setProblemsSolved] = useState(0);
  const { openLogin } = useAuthPortal();
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    let currentTimeReduction = 0;
    let currentAnnualValue = 0;
    let currentHoursSaved = 0;
    let currentProblemsSolved = 0;

    const interval = setInterval(() => {
      if (currentTimeReduction < 90) { currentTimeReduction += 2; setTimeReduction(Math.min(currentTimeReduction, 90)); }
      if (currentAnnualValue < 19500) { currentAnnualValue += 400; setAnnualValue(Math.min(currentAnnualValue, 19500)); }
      if (currentHoursSaved < 260) { currentHoursSaved += 6; setHoursSaved(Math.min(currentHoursSaved, 260)); }
      if (currentProblemsSolved < 12) { currentProblemsSolved += 1; setProblemsSolved(Math.min(currentProblemsSolved, 12)); }

      if (currentTimeReduction >= 90 && currentAnnualValue >= 19500 && currentHoursSaved >= 260 && currentProblemsSolved >= 12) {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="modules" />

      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}} data-testid="section-hero">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>

        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              {t('modules.payroll.hero.badge', 'Payroll & Financial Module')}
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('modules.payroll.hero.titleLine1', 'Stop Circling Numbers')}<br />
              <span className="text-blue-100">{t('modules.payroll.hero.titleLine2', 'With a Pen')}</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('modules.payroll.hero.description', 'Work sessions flow directly into payroll-ready timesheets. No paper. No calculator. No circling.')}<br />
              <strong>{t('modules.payroll.hero.descriptionBold', 'Export to QuickBooks, ADP, or Gusto in minutes.')}</strong>
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
              software={MODULE_SOFTWARE_MAPPING["payroll-financial"]} 
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
      <section className="relative bg-white dark:bg-slate-950 -mt-px overflow-visible" data-testid="section-stats">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
          <Card className="shadow-xl border-0 relative z-20 -mt-20" data-testid="card-stats-panel">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600" data-testid="stat-time-reduction">{timeReduction}%</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.payroll.stats.timeEliminated', 'Payroll time eliminated')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600" data-testid="stat-annual-value">${annualValue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.payroll.stats.annualValue', 'Annual time value')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600" data-testid="stat-hours-saved">{hoursSaved}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.payroll.stats.hoursSaved', 'Hours saved yearly')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600" data-testid="stat-problems-solved">{problemsSolved}+</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.payroll.stats.problemsSolved', 'Problems solved')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Problem Statement Section */}
      <section className="py-16 md:py-20 px-4" data-testid="section-problem-statement">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t('modules.payroll.problem.title', 'The Payroll Problem Nobody Admits')}
          </h2>

          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                {t('modules.payroll.problem.line1', "You print timesheets. One employee's data spreads across four pages.")}
              </p>
              <p className="text-base">
                {t('modules.payroll.problem.line2', 'Twelve employees means 48 pages minimum. You lay them across your desk, circle hours with a pen, and grab a calculator.')}
              </p>
              <p className="text-base">
                {t('modules.payroll.problem.line3', "Three hours later, you're still not done. And you've probably made a mistake you won't catch until the employee calls asking why they're short $130.")}
              </p>
              <p className="text-base">
                {t('modules.payroll.problem.line4', "So you send a quick e-transfer. Problem solved for them. Problem created for your books. Your bookkeeper asks what that random payment was. Now you're explaining instead of running your company.")}
              </p>
              <p className="text-base">
                {t('modules.payroll.problem.line5', "This chaos doesn't stay contained. When payroll is painful, you put it off. When you're consistently late, your team notices. A culture forms where deadlines are optional. That mindset bleeds into everything.")}
              </p>
              <Separator className="my-6" />
              <p className="font-medium text-foreground text-lg">
                {t('modules.payroll.problem.solution', 'OnRopePro eliminates manual entry between field work and payroll. Every clock-in becomes payroll data automatically. GPS-verified. Project-attributed. Overtime-calculated. Ready to export.')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-0" />

      {/* What This Module Does Section */}
      <section id="features" className="pt-8 md:pt-12 pb-16 md:pb-20 px-4 bg-slate-50 dark:bg-slate-900" data-testid="section-what-module-does">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.payroll.features.title', 'From Clock-In to Payroll Export')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.payroll.features.subtitle', 'The Payroll & Financial module transforms scattered work session data into organized, exportable timesheets without manual intervention.')}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Automatic Aggregation */}
            <Card className="relative overflow-hidden" data-testid="card-automatic-aggregation">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.payroll.features.card1.title', 'Automatic Aggregation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.payroll.features.card1.headline', 'Every GPS-verified clock-in flows directly into timesheets.')}</p>
                <p>{t('modules.payroll.features.card1.description', 'The system calculates hours, applies overtime rules, and groups everything by pay period.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.payroll.features.card1.listTitle', 'What gets automated:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.payroll.features.card1.item1', 'Regular hour totals by employee')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.payroll.features.card1.item2', 'Overtime calculation (daily and weekly triggers)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.payroll.features.card1.item3', 'Pay period grouping (weekly, bi-weekly, semi-monthly, monthly)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.payroll.features.card1.item4', 'Project attribution per work session')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 2: Job Costing Visibility */}
            <Card className="relative overflow-hidden" data-testid="card-job-costing">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.payroll.features.card2.title', 'Job Costing Visibility')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.payroll.features.card2.headline', 'Know exactly how many hours went to each building.')}</p>
                <p>{t('modules.payroll.features.card2.description', 'Stop underbidding jobs because you can finally see where time actually goes.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.payroll.features.card2.listTitle', 'What gets tracked:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.payroll.features.card2.item1', 'Hours per project per employee')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.payroll.features.card2.item2', 'Billable vs non-billable breakdown')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.payroll.features.card2.item3', 'Project labor cost totals')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.payroll.features.card2.item4', 'Historical comparison across pay periods')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3: Export-Ready Output */}
            <Card className="relative overflow-hidden" data-testid="card-export-ready">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                  <FileSpreadsheet className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.payroll.features.card3.title', 'Export-Ready Output')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.payroll.features.card3.headline', 'Generate CSV files for QuickBooks, ADP, Gusto, or any payroll software.')}</p>
                <p>{t('modules.payroll.features.card3.description', 'PDF reports for records. No re-keying data.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.payroll.features.card3.listTitle', 'What gets exported:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.payroll.features.card3.item1', 'Employee-by-employee timesheets')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.payroll.features.card3.item2', 'Project cost breakdowns')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.payroll.features.card3.item3', 'Overtime summaries')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.payroll.features.card3.item4', 'Complete audit trails')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Who Benefits Section */}
      <section className="py-16 md:py-20 px-4" data-testid="section-who-benefits">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.payroll.benefits.title', 'Who Benefits From This Module')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.payroll.benefits.subtitle', 'Payroll clarity for everyone in your operation.')}
          </p>

          <div className="space-y-8">
            {/* For Employers */}
            <Card className="overflow-hidden" data-testid="card-benefits-employers">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.payroll.benefits.employers.title', 'For Employers (Company Owners)')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.payroll.benefits.employers.benefit1.title', 'Reclaim 5+ hours every pay period.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.payroll.benefits.employers.benefit1.description', 'The calculator and pen method costs you 6-10 hours per payroll run. OnRopePro aggregates everything automatically. Select the pay period. Review the totals. Export. Done in 30-45 minutes.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.payroll.benefits.employers.benefit2.title', 'Stop the random e-transfer scramble.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.payroll.benefits.employers.benefit2.description', 'When timesheets are wrong, you fix it with quick payments that confuse your books. Accurate data from the start means no corrections. Your bookkeeper gets clean exports every time.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.payroll.benefits.employers.benefit3.title', 'Quote jobs with confidence.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.payroll.benefits.employers.benefit3.description', "You underbid that building by 60 hours because you couldn't see where time went. Project attribution shows exactly how long each job takes. Your next quote includes the hours you actually need.")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Operations Managers */}
            <Card className="overflow-hidden" data-testid="card-benefits-operations">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.payroll.benefits.operations.title', 'For Operations Managers & Supervisors')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.payroll.benefits.operations.benefit1.title', 'Review without the paper shuffle.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.payroll.benefits.operations.benefit1.description', 'Your employees across multiple projects, multiple buildings, multiple shifts. The payroll view shows every work session organized by employee and pay period. Review and approve from one screen.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.payroll.benefits.operations.benefit2.title', 'Catch discrepancies before payday.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.payroll.benefits.operations.benefit2.description', 'GPS verification and project attribution make anomalies obvious. A technician logged 8 hours at Building A but was scheduled for Building B? You see it immediately.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.payroll.benefits.operations.benefit3.title', 'Historical access for audits.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.payroll.benefits.operations.benefit3.description', 'Previous pay periods stay accessible. When someone questions hours from three months ago, you pull the data in seconds.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Technicians */}
            <Card className="overflow-hidden" data-testid="card-benefits-technicians">
              <CardHeader className="bg-amber-50 dark:bg-amber-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.payroll.benefits.technicians.title', 'For Rope Access Technicians')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.payroll.benefits.technicians.benefit1.title', 'Your hours are accurate.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.payroll.benefits.technicians.benefit1.description', 'GPS verification captures your actual time on site. No more discrepancies between what you logged and what the owner calculated.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.payroll.benefits.technicians.benefit2.title', 'See where your time goes.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.payroll.benefits.technicians.benefit2.description', 'Every work session shows which project you were assigned to. Your 8-hour day might split across three buildings. The breakdown is clear.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.payroll.benefits.technicians.benefit3.title', 'Overtime calculated correctly.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.payroll.benefits.technicians.benefit3.description', "The system applies your company's overtime rules automatically. Daily trigger at 8 hours, weekly trigger at 40, whatever the configuration. No manual math required.")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Building Managers */}
            <Card className="overflow-hidden" data-testid="card-benefits-building-managers">
              <CardHeader className="bg-violet-50 dark:bg-violet-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.payroll.benefits.buildingManagers.title', 'For Building Managers / Property Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.payroll.benefits.buildingManagers.benefit1.title', 'Labor documentation on demand.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.payroll.benefits.buildingManagers.benefit1.description', 'Need to verify how many technician hours were spent on your building last quarter? The data exists and exports cleanly.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.payroll.benefits.buildingManagers.benefit2.title', 'Budget validation simplified.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.payroll.benefits.buildingManagers.benefit2.description', 'You contracted for 200 hours of annual maintenance. The project attribution shows exactly how many hours have been logged against your building.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.payroll.benefits.buildingManagers.benefit3.title', 'Audit-ready records.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.payroll.benefits.buildingManagers.benefit3.description', 'Insurance, compliance, or internal review requirements? Work session data with GPS verification provides the documentation trail.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Key Features Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900" data-testid="section-key-features">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.payroll.keyFeatures.title', 'Key Features')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.payroll.keyFeatures.subtitle', 'Every feature exists to eliminate the gap between field work and payroll processing.')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card data-testid="card-feature-pay-period">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.payroll.keyFeatures.feature1.title', 'Pay Period Configuration')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.payroll.keyFeatures.feature1.description', 'Choose weekly, bi-weekly, semi-monthly, or monthly pay periods. The system auto-generates period boundaries. Work sessions group into the correct pay period automatically.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-gps">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.payroll.keyFeatures.feature2.title', 'GPS-Verified Time Data')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.payroll.keyFeatures.feature2.description', 'Hours come from verified work sessions, not self-reported notebooks. Clock-in location confirms the technician was actually at the job site. Eliminates disputes.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-overtime">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Calculator className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.payroll.keyFeatures.feature3.title', 'Configurable Overtime Rules')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.payroll.keyFeatures.feature3.description', 'Set daily triggers (default 8 hours), weekly triggers (default 40 hours), or custom thresholds. Multipliers adjust from 1.5x to 3x. Disable overtime entirely if needed.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-attribution">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.payroll.keyFeatures.feature4.title', 'Project Attribution')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.payroll.keyFeatures.feature4.description', 'Every work session links to a specific project. Your payroll view shows which building, which job type, how many hours. Essential for job costing and future bid accuracy.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-billable">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.payroll.keyFeatures.feature5.title', 'Billable vs Non-Billable Tracking')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.payroll.keyFeatures.feature5.description', 'Distinguish revenue-generating client hours from operational costs. Travel, equipment maintenance, training, weather delays. Know your true labor cost.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-export">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.payroll.keyFeatures.feature6.title', 'Export Capabilities')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.payroll.keyFeatures.feature6.description', 'CSV export for payroll software integration (QuickBooks, ADP, Gusto). PDF timesheet reports for records. Employee-level detail and project cost breakdowns available.')}
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
      <section className="py-16 md:py-20 px-4" data-testid="section-measurable-results">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.payroll.results.title', 'Measurable Results')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.payroll.results.subtitle', "Concrete improvements you'll see from day one.")}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden" data-testid="card-result-time-savings">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Timer className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.payroll.results.result1.title', 'Time Savings')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.payroll.results.result1.description', "The manual pen-and-calculator method consumes 6-10 hours per payroll run. OnRopePro reduces this to 30-45 minutes. For bi-weekly payroll, that's approximately 260 hours saved annually. Time that goes back into running your business.")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden" data-testid="card-result-error-reduction">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.payroll.results.result2.title', 'Error Reduction')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.payroll.results.result2.description', 'Conflicting systems (notebooks, time clocks, spreadsheets) create discrepancies. Single-source-of-truth data eliminates reconciliation disputes. Corrections drop dramatically when the data is accurate from the start.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden" data-testid="card-result-job-costing">
              <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.payroll.results.result3.title', 'Job Costing Accuracy')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.payroll.results.result3.description', "Without project attribution, you don't know why jobs run over budget. With it, you see exactly where hours went. Operators report quoting accuracy improves because they're working from actual historical data instead of estimates.")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden" data-testid="card-result-accounting">
              <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <PiggyBank className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.payroll.results.result4.title', 'Accounting Cleanliness')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.payroll.results.result4.description', 'Random correction payments create unexplained transactions. Clean exports mean every dollar is documented before it leaves the system. Bookkeeper reconciliation time drops.')}
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
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900" data-testid="section-module-integration">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.payroll.integration.title', 'Module Integration Points')}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            {t('modules.payroll.integration.subtitle', 'The Payroll & Financial module connects with other OnRopePro modules to create a complete data pipeline from field work to payroll export.')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card data-testid="card-integration-work-sessions">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.payroll.integration.module1.title', 'Work Sessions & Time Tracking')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.payroll.integration.module1.description', 'Primary data source. Every clock-in and clock-out creates work session data that flows directly into payroll aggregation.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-employee">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.payroll.integration.module2.title', 'Employee Management')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.payroll.integration.module2.description', 'Rate and role lookup. Hourly rate pulls from the employee profile at the time of the work session. Mid-project rate changes are handled correctly.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-project">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.payroll.integration.module3.title', 'Project Management')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.payroll.integration.module3.description', 'Project attribution source. Work sessions link to projects, enabling labor cost tracking per building and per job type.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-scheduling">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.payroll.integration.module4.title', 'Scheduling & Calendar')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.payroll.integration.module4.description', 'Shift assignment context. Scheduled shifts provide expected hours for comparison with actual hours worked. Discrepancies become visible.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-safety">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.payroll.integration.module5.title', 'Safety Compliance')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.payroll.integration.module5.description', 'Work eligibility verification. Harness inspection and certification requirements verify before clock-in is allowed. Failed inspections block work sessions.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-analytics">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.payroll.integration.module6.title', 'Analytics & Reporting')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.payroll.integration.module6.description', 'Payroll data feeds into company-wide analytics. Labor costs, productivity metrics, and budget tracking all derive from the same source of truth.')}
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
      <section className="py-16 md:py-20 px-4" data-testid="section-business-impact">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t('modules.payroll.impact.title', 'Stop Dreading Payday')}
          </h2>

          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-base">
                {t('modules.payroll.impact.paragraph1', "Payday shouldn't consume your afternoon. It shouldn't involve a calculator, a pen, and 48 pages of printouts spread across your desk. It definitely shouldn't result in random e-transfers that confuse your bookkeeper and corrections that take longer than the original processing.")}
              </p>
              <p className="text-base">
                {t('modules.payroll.impact.paragraph2', 'Right now, payroll is probably the most hated task on your calendar. You put it off. You run late. Your employees start budgeting around "getting paid late." That culture of lateness bleeds into everything else.')}
              </p>
              <Separator className="my-6" />
              <p className="text-base">
                {t('modules.payroll.impact.paragraph3', 'When payroll takes 30 minutes instead of 6 hours, you stop avoiding it. You run on time. Your team notices. The professional standards you set for payroll extend to project timelines, client communications, and safety documentation.')}
              </p>
              <p className="font-medium text-foreground text-lg">
                {t('modules.payroll.impact.paragraph4', "You get back 260+ hours per year. That's six full work weeks. Time currently spent circling numbers that could go toward bidding new contracts, managing client relationships, or simply being present for the work you actually want to do.")}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* FAQs Section */}
      <section id="faqs" className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900" data-testid="section-faqs">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.payroll.faqs.title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            {t('modules.payroll.faqs.subtitle', 'Common questions about the Payroll & Financial module.')}
          </p>

          <Accordion type="single" collapsible className="space-y-4" data-testid="accordion-faqs">
            <AccordionItem value="faq-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-1">
                {t('modules.payroll.faqs.faq1.question', 'Does OnRopePro calculate my taxes and deductions?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.payroll.faqs.faq1.answer', 'No. OnRopePro prepares payroll-ready timesheet data for export. Actual payroll calculations (CPP, EI, tax withholding, Social Security, Medicare) happen in your payroll processing software (QuickBooks, ADP, Gusto, etc.). OnRopePro handles time aggregation and export, not tax compliance.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-2">
                {t('modules.payroll.faqs.faq2.question', 'What pay period options are available?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.payroll.faqs.faq2.answer', 'Weekly, bi-weekly, semi-monthly, and monthly. The system generates period boundaries automatically based on your selection.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-3">
                {t('modules.payroll.faqs.faq3.question', 'How does overtime calculation work?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.payroll.faqs.faq3.answer', "You configure the rules: daily trigger (default 8 hours), weekly trigger (default 40 hours), and multiplier (1.5x, 2x, etc.). The system applies these rules automatically to every work session. You can disable overtime entirely if your pay structure doesn't include it.")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-4">
                {t('modules.payroll.faqs.faq4.question', 'What format does the export use?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.payroll.faqs.faq4.answer', 'CSV for payroll software import. PDF for printable timesheet records. Both include employee-level detail and project attribution.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-5">
                {t('modules.payroll.faqs.faq5.question', 'Who can see payroll data?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.payroll.faqs.faq5.answer', "Users with the canAccessFinancials permission. This is granted through the role-based permission system. Technicians see their own hours but not compensation rates or other employees' data.")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-6">
                {t('modules.payroll.faqs.faq6.question', 'What happens if a work session is missing or incorrect?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.payroll.faqs.faq6.answer', 'Supervisors with appropriate permissions can review and adjust work sessions before timesheet approval. All adjustments are logged with reasons for audit purposes.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-7">
                {t('modules.payroll.faqs.faq7.question', 'Can I see historical pay periods?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.payroll.faqs.faq7.answer', 'Yes. Previous pay periods remain accessible. Filter by date range to pull data from any past period.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-8">
                {t('modules.payroll.faqs.faq8.question', 'Does project attribution work if a technician works at multiple buildings in one day?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.payroll.faqs.faq8.answer', 'Yes. Each work session links to a specific project. If a technician clocks into Building A for 4 hours, then Building B for 4 hours, both sessions show separately with their respective project attribution.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-9">
                {t('modules.payroll.faqs.faq9.question', 'What about non-billable time like travel between sites?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.payroll.faqs.faq9.answer', 'Non-billable work sessions track hours that cannot be charged to clients (travel, training, equipment maintenance, weather delays). The payroll view shows both billable and non-billable hours so you know your true labor cost.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-10" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left" data-testid="faq-trigger-10">
                {t('modules.payroll.faqs.faq10.question', 'Is there an approval workflow before export?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.payroll.faqs.faq10.answer', "Yes. Timesheets can be reviewed and approved before export. Approved timesheets generate clean export files. The workflow prevents exporting data that hasn't been verified.")}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 px-4" data-testid="section-final-cta">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('modules.payroll.cta.title', 'Ready to Reclaim Your Time?')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('modules.payroll.cta.subtitle', "Join rope access companies who've eliminated the payroll headache. Start your free 60-day trial today.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FreeTrialButton 
              className="bg-[#0B64A3] hover:bg-[#0369A1] text-white" 
              onClick={() => setShowRegistration(true)} 
              testId="button-cta-trial"
            />
            <Button size="lg" variant="outline" asChild data-testid="button-cta-changelog">
              <Link href="/changelog/payroll">
                {t('modules.payroll.cta.docsButton', 'View Technical Documentation')}
                <FileText className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <EmployerRegistration open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
}
