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
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import {
  Shield,
  CheckCircle2,
  Lock,
  Users,
  ArrowRight,
  Eye,
  Building2,
  UserCheck,
  Key,
  FileText,
  Layers,
  BookOpen,
  Briefcase,
  Home,
  HardHat,
  ClipboardList,
  BarChart3,
  Calendar,
  DollarSign,
  Database,
  ShieldCheck,
  Sparkles,
  UserCog,
  History,
  MessageSquare,
  Clock,
  Search,
  UserPlus,
  TrendingUp,
  Zap,
  ChevronRight
} from "lucide-react";

export default function UserAccessLanding() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [controlPercentage, setControlPercentage] = useState(0);
  const { openLogin } = useAuthPortal();
  const [showRegistration, setShowRegistration] = useState(false);

  // Initialize countdown numbers and count-up percentage
  useEffect(() => {
    const start1 = Math.floor(Math.random() * 80) + 40;
    const start2 = Math.floor(Math.random() * 60) + 30;
    const start3 = Math.floor(Math.random() * 70) + 35;

    let current1 = start1, current2 = start2, current3 = start3;
    let currentPercentage = 0;
    setCount1(current1);
    setCount2(current2);
    setCount3(current3);
    setControlPercentage(currentPercentage);
    
    const interval = setInterval(() => {
      if (current1 > 0) { current1--; setCount1(current1); }
      if (current2 > 0) { current2--; setCount2(current2); }
      if (current3 > 0) { current3--; setCount3(current3); }
      if (currentPercentage < 100) { currentPercentage++; setControlPercentage(currentPercentage); }
      
      if (current1 === 0 && current2 === 0 && current3 === 0 && currentPercentage === 100) {
        clearInterval(interval);
      }
    }, 150);

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
              {t('modules.userAccess.hero.badge', 'User Access & Authentication Module')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('modules.userAccess.hero.titleLine1', 'Built for the moment you realize')}<br />
              {t('modules.userAccess.hero.titleLine2', 'your new hire')}<br />
              <span className="text-blue-100">{t('modules.userAccess.hero.titleLine3', "can see everyone's rates.")}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('modules.userAccess.hero.description', 'Assign project creation, scheduling, and safety compliance to the people who need it. Keep hourly rates, labor costs, and profit margins visible only to you.')}<br />
              <strong>{t('modules.userAccess.hero.tagline', 'One system. Clear boundaries. Zero compromises.')}</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-hero-trial">
                {t('modules.userAccess.hero.ctaTrial', 'Start Your Free 60-Day Trial')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={openLogin} data-testid="button-hero-signin">
                Sign In
              </Button>
            </div>
            
            <SoftwareReplaces 
              software={MODULE_SOFTWARE_MAPPING["user-access-authentication"]} 
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
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">{count1}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.userAccess.stats.exposedPayRates', 'Exposed pay rates')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-rose-600">{count2}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.userAccess.stats.unauthorizedEdits', 'Unauthorized edits')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">{count3}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.userAccess.stats.accessConflicts', 'Access conflicts')}</div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-3xl md:text-4xl font-bold text-emerald-600 transition-opacity duration-300"
                    style={{ display: 'inline-block' }}
                  >
                    {controlPercentage}%
                  </div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.userAccess.stats.controlMaintained', 'Control maintained')}</div>
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
            {t('modules.userAccess.problem.title', 'The Access Problem Nobody Talks About')}
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                {t('modules.userAccess.problem.intro', "Construction software wasn't built for rope access.")}
              </p>
              <p>
                {t('modules.userAccess.problem.supervisorAccess', 'You add your supervisor to the system. Now they see everything. Pay rates. Profit margins. Which jobs lose money. Which technicians cost the most.')}
              </p>
              <p>
                {t('modules.userAccess.problem.trust', "It's not about trust. Some information belongs at the owner level.")}
              </p>
              <p>
                {t('modules.userAccess.problem.choice', "Most systems force a choice: do everything yourself and become the bottleneck, or give access and hope nobody looks where they shouldn't.")}
              </p>
              <p>
                {t('modules.userAccess.problem.meanwhile', 'Meanwhile, building managers drown in resident calls. Technicians text complaints to personal phones. Property managers piece together vendor performance from scattered emails.')}
              </p>
              <p className="font-medium text-foreground">
                {t('modules.userAccess.problem.frustrated', "Everyone's frustrated. Nobody has the full picture.")}
              </p>
              <Separator className="my-6" />
              <p className="font-medium text-foreground text-lg">
                {t('modules.userAccess.problem.solution', 'OnRopePro separates what people can do from what they can see. Five stakeholder types. One unified system. Every person sees exactly what they need. Nothing more.')}
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
            {t('modules.userAccess.features.title', 'Complete Access Control That Creates Itself Through Daily Use')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.userAccess.features.subtitle', 'Every login, every permission, every piece of feedback flows through a single system designed for how rope access actually works.')}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Role-Based Permission Architecture */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Layers className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.userAccess.features.roleBasedPermissions.title', 'Role-Based Permission Architecture')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.userAccess.features.roleBasedPermissions.intro', 'Before any employee accesses the system, you define exactly what they see.')}</p>
                <p>{t('modules.userAccess.features.roleBasedPermissions.description', '44+ individual permissions across financial, operational, safety, and inventory categories. Your ops manager creates projects without seeing payroll. Your ground crew logs hours without accessing bids.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.userAccess.features.roleBasedPermissions.controlledLabel', 'What gets controlled:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.userAccess.features.roleBasedPermissions.financial', 'Financial data visibility (rates, costs, margins)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.userAccess.features.roleBasedPermissions.projects', 'Project creation and modification rights')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.userAccess.features.roleBasedPermissions.employees', 'Employee management capabilities')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.userAccess.features.roleBasedPermissions.safety', 'Safety documentation access')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.userAccess.features.roleBasedPermissions.inventory', 'Inventory and equipment permissions')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 2: External Stakeholder Portals */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <Building2 className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.userAccess.features.externalPortals.title', 'External Stakeholder Portals')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.userAccess.features.externalPortals.intro', 'Three separate portals for three different needs.')}</p>
                <p>{t('modules.userAccess.features.externalPortals.description', "Residents see their building's progress and submit feedback. Building managers see project details and response metrics. Property managers see portfolio-wide performance. No cross-contamination. No unauthorized access.")}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.userAccess.features.externalPortals.portalsLabel', 'What each portal provides:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Home className="w-4 h-4 mt-0.5 text-violet-600 shrink-0" />
                    <span><strong>{t('modules.userAccess.features.externalPortals.resident', 'Resident')}:</strong> {t('modules.userAccess.features.externalPortals.residentDesc', 'Progress visibility, feedback submission, photo documentation')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 mt-0.5 text-sky-600 shrink-0" />
                    <span><strong>{t('modules.userAccess.features.externalPortals.buildingManager', 'Building Manager')}:</strong> {t('modules.userAccess.features.externalPortals.buildingManagerDesc', 'Full project details, feedback management, work history')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                    <span><strong>{t('modules.userAccess.features.externalPortals.propertyManager', 'Property Manager')}:</strong> {t('modules.userAccess.features.externalPortals.propertyManagerDesc', 'Multi-building oversight, vendor performance metrics, exportable reports')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3: Centralized Feedback System */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                  <MessageSquare className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.userAccess.features.feedbackSystem.title', 'Centralized Feedback System')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.userAccess.features.feedbackSystem.intro', 'Every resident complaint, compliment, and question flows into one dashboard.')}</p>
                <p>{t('modules.userAccess.features.feedbackSystem.description', 'No more texts to personal phones. No more emails lost in inboxes. No more sticky notes in the lobby. Timestamped. Photographed. Tracked from open to resolved.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.userAccess.features.feedbackSystem.trackedLabel', 'What gets tracked:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.userAccess.features.feedbackSystem.submission', 'Submission timestamp')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.userAccess.features.feedbackSystem.acknowledgment', 'Acknowledgment timestamp')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.userAccess.features.feedbackSystem.resolution', 'Resolution timestamp')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.userAccess.features.feedbackSystem.photos', 'Photo documentation')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.userAccess.features.feedbackSystem.responseTime', 'Response time metrics')}</span>
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
            {t('modules.userAccess.stakeholderBenefits.title', 'Benefits by Stakeholder')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.userAccess.stakeholderBenefits.subtitle', 'Five stakeholder types. Five different views. One unified system.')}
          </p>

          <div className="space-y-8">
            {/* For Employers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.userAccess.stakeholderBenefits.employers.title', 'For Employers (Company Owners)')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.userAccess.stakeholderBenefits.employers.benefit1.title', 'Delegate without exposure.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.userAccess.stakeholderBenefits.employers.benefit1.description', 'Your supervisor handles North Shore operations. Creates projects. Assigns crews. Manages schedules. Never sees what anyone earns. You focus on growth instead of gatekeeping.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.userAccess.stakeholderBenefits.employers.benefit2.title', 'Protect your margins.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.userAccess.stakeholderBenefits.employers.benefit2.description', 'Client billing rates, internal costs, project profitability stay visible only to you. Your bookkeeper sees aggregate numbers. Your admin processes invoices. Nobody pieces together your competitive advantage.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.userAccess.stakeholderBenefits.employers.benefit3.title', 'Onboard in minutes.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.userAccess.stakeholderBenefits.employers.benefit3.description', 'Create an account, assign permissions, done. No IT tickets. No back-and-forth emails. Employee sets their own password on first login.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Technicians */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.userAccess.stakeholderBenefits.technicians.title', 'For Technicians')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.userAccess.stakeholderBenefits.technicians.benefit1.title', "See your work, not everyone else's.")}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.userAccess.stakeholderBenefits.technicians.benefit1.description', "Your assigned projects. Your logged hours. Your safety inspections. Clean interface showing exactly what you need for today's job.")}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.userAccess.stakeholderBenefits.technicians.benefit2.title', 'Submit feedback from the field.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.userAccess.stakeholderBenefits.technicians.benefit2.description', "Resident flags an issue while you're on rope? Log it in 30 seconds. Photos attached. Building manager notified. No more remembering to tell someone when you get back to the truck.")}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.userAccess.stakeholderBenefits.technicians.benefit3.title', 'Your certifications travel with you.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.userAccess.stakeholderBenefits.technicians.benefit3.description', 'IRATA level tracked in your profile. When you move companies, your professional identity stays intact.')}</p>
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
                  <CardTitle className="text-xl">{t('modules.userAccess.stakeholderBenefits.buildingManagers.title', 'For Building Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.userAccess.stakeholderBenefits.buildingManagers.benefit1.title', 'Stop being the middleman.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.userAccess.stakeholderBenefits.buildingManagers.benefit1.description', 'Residents submit directly to the vendor. You see everything without handling every back-and-forth. When the strata council asks about responsiveness, you pull the report.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.userAccess.stakeholderBenefits.buildingManagers.benefit2.title', 'Access survives turnover.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.userAccess.stakeholderBenefits.buildingManagers.benefit2.description', 'Building accounts, not personal accounts. When you take over from the previous manager, change the password. Instant access. No vendor coordination.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.userAccess.stakeholderBenefits.buildingManagers.benefit3.title', 'Prove vendor performance.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.userAccess.stakeholderBenefits.buildingManagers.benefit3.description', 'Response times tracked automatically. Resolution rates calculated. Export professional reports for council presentations in two minutes.')}</p>
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
                  <CardTitle className="text-xl">{t('modules.userAccess.stakeholderBenefits.propertyManagers.title', 'For Property Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.userAccess.stakeholderBenefits.propertyManagers.benefit1.title', 'Portfolio-wide visibility.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.userAccess.stakeholderBenefits.propertyManagers.benefit1.description', 'Every building. Every vendor. Every open issue. One dashboard. Know which properties need attention without calling anyone.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.userAccess.stakeholderBenefits.propertyManagers.benefit2.title', 'Manager turnover handled.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.userAccess.stakeholderBenefits.propertyManagers.benefit2.description', 'Your building managers change every 6-12 months. Building accounts mean zero access gaps. Zero former employees with lingering credentials. Zero vendor coordination.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.userAccess.stakeholderBenefits.propertyManagers.benefit3.title', 'Compliance documentation ready.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.userAccess.stakeholderBenefits.propertyManagers.benefit3.description', 'When insurance asks about vendor safety programs, you have answers. Digital records. Timestamped inspections. Exportable proof.')}</p>
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
                  <CardTitle className="text-xl">{t('modules.userAccess.stakeholderBenefits.residents.title', 'For Residents')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.userAccess.stakeholderBenefits.residents.benefit1.title', "Know what's happening without calling.")}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.userAccess.stakeholderBenefits.residents.benefit1.description', 'West elevation 80% complete. East starts Wednesday. Move your balcony plants Tuesday night. No phone tag with the building manager.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.userAccess.stakeholderBenefits.residents.benefit2.title', 'Submit issues with photos.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.userAccess.stakeholderBenefits.residents.benefit2.description', 'Streaky windows? Snap a photo. Submit through the portal. Watch status change from Open to Acknowledged to Resolved. Know someone saw it.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.userAccess.stakeholderBenefits.residents.benefit3.title', 'Get answers faster.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.userAccess.stakeholderBenefits.residents.benefit3.description', 'Direct to vendor means 24-hour resolution instead of 3-5 days of phone tag through the building manager.')}</p>
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
            {t('modules.userAccess.keyFeatures.title', 'Key Features')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.userAccess.keyFeatures.subtitle', 'Every feature built for the specific challenges of multi-stakeholder rope access operations.')}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.userAccess.keyFeatures.granularPermissions.title', 'Granular Permission Controls')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.userAccess.keyFeatures.granularPermissions.description', '44+ individual permissions across financial, operational, safety, and inventory categories. Assign exactly what each person needs. Change permissions anytime as responsibilities shift.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.userAccess.keyFeatures.dataIsolation.title', 'Multi-Tenant Data Isolation')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.userAccess.keyFeatures.dataIsolation.description', "Your company's data exists in a completely separate partition. Every query, every report, every API call filters to your company only. Bank-level protection without an IT department.")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.userAccess.keyFeatures.buildingAccounts.title', 'Building-Level Accounts')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.userAccess.keyFeatures.buildingAccounts.description', "Buildings have accounts. Building managers don't. When managers change, the new person changes the password. Access transfers in 30 seconds. No vendor coordination required.")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.userAccess.keyFeatures.selfServiceOnboarding.title', 'Self-Service Onboarding')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.userAccess.keyFeatures.selfServiceOnboarding.description', 'Building codes on elevator notices. Residents scan, register, access. Technicians share codes on-site. Zero admin overhead for external user setup.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.userAccess.keyFeatures.responseTimeTracking.title', 'Response Time Tracking')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.userAccess.keyFeatures.responseTimeTracking.description', 'Every feedback submission timestamped automatically. Open to acknowledged. Acknowledged to resolved. Average response time calculated. Exportable for strata councils.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <History className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.userAccess.keyFeatures.auditTrail.title', 'Complete Audit Trail')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.userAccess.keyFeatures.auditTrail.description', 'Every permission change logged. Every sensitive action recorded. Timestamps, user IDs, IP addresses. When questions arise, answers exist.')}
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
            {t('modules.userAccess.problemsSolved.title', 'Problems Solved')}
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            {t('modules.userAccess.problemsSolved.subtitle', 'Real problems. Real solutions. Organized by who you are.')}
          </p>

          <Accordion type="multiple" className="space-y-4">
            {/* For Employers */}
            <AccordionItem value="employers" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-lg font-semibold">{t('modules.userAccess.problemsSolved.employers.title', 'For Employers')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.userAccess.problemsSolved.employers.problem1.quote', '"My supervisor saw everyone\'s pay rates on day one."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.userAccess.problemsSolved.employers.problem1.description', 'You need your ops manager to create projects and check budgets. The moment you grant access, they see what every technician earns. Your Level 1 finds out your Level 3 lead makes $18 more per hour.')}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('common.solution', 'Solution')}:</strong> {t('modules.userAccess.problemsSolved.employers.problem1.solution', 'OnRopePro separates operational access from financial visibility. 44 individual permissions. Grant project creation without exposing compensation data.')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.userAccess.problemsSolved.employers.problem2.quote', '"A technician changed his own hourly rate from $32 to $42."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.userAccess.problemsSolved.employers.problem2.description', "He also adjusted last week's drop counts. You discovered it during payroll when the numbers didn't add up.")}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('common.solution', 'Solution')}:</strong> {t('modules.userAccess.problemsSolved.employers.problem2.solution', 'Permission controls restrict who can edit what. Technicians log work for assigned projects. Rates stay locked to designated managers.')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.userAccess.problemsSolved.employers.problem3.quote', '"I spend hours setting up accounts and chasing passwords."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.userAccess.problemsSolved.employers.problem3.description', 'Create the account. Set permissions. Done. Employee sets their own password. External users register themselves with building codes. Your admin time approaches zero.')}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Technicians */}
            <AccordionItem value="technicians" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-lg font-semibold">{t('modules.userAccess.problemsSolved.technicians.title', 'For Technicians')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.userAccess.problemsSolved.technicians.problem1.quote', '"I have to remember 10 different complaints and tell Jeff later."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.userAccess.problemsSolved.technicians.problem1.description', 'Resident flags an issue on the ground. You\'re heading back up the rope. By end of day, you\'ve forgotten half of them. Two weeks later: "Did you go back to 1037?"')}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('common.solution', 'Solution')}:</strong> {t('modules.userAccess.problemsSolved.technicians.problem1.solution', 'Log feedback from your phone in 30 seconds. Photos attached. Automatically routed. Nothing forgotten.')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.userAccess.problemsSolved.technicians.problem2.quote', '"I can see way more than I need to and it\'s overwhelming."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.userAccess.problemsSolved.technicians.problem2.description', "Your dashboard shows your projects. Your hours. Your inspections. Not the entire company's financials. Clean interface for the work that matters.")}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Building Managers */}
            <AccordionItem value="building-managers" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-sky-600" />
                  </div>
                  <span className="text-lg font-semibold">{t('modules.userAccess.problemsSolved.buildingManagers.title', 'For Building Managers')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.userAccess.problemsSolved.buildingManagers.problem1.quote', '"I\'m forwarding emails between residents and vendors all day."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.userAccess.problemsSolved.buildingManagers.problem1.description', "Mrs. Chen emails you photos of streaky windows. You forward to the rope access company. Three days pass. Mrs. Chen emails again. You call the vendor. Leave a voicemail. Meanwhile, she's filing strata complaints about your responsiveness.")}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('common.solution', 'Solution')}:</strong> {t('modules.userAccess.problemsSolved.buildingManagers.problem1.solution', 'Direct resident-to-vendor feedback. You see everything without being in the middle. Average resolution drops from 3-5 days to 24 hours.')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.userAccess.problemsSolved.buildingManagers.problem2.quote', '"The previous manager left and I can\'t access anything."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.userAccess.problemsSolved.buildingManagers.problem2.description', "You emailed 12 vendors requesting account changes. Three weeks later, Sarah still has access and you can't log in.")}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('common.solution', 'Solution')}:</strong> {t('modules.userAccess.problemsSolved.buildingManagers.problem2.solution', "Change the building password. Instant access. Sarah's locked out. No vendor coordination.")}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Property Managers */}
            <AccordionItem value="property-managers" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-violet-600" />
                  </div>
                  <span className="text-lg font-semibold">{t('modules.userAccess.problemsSolved.propertyManagers.title', 'For Property Managers')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.userAccess.problemsSolved.propertyManagers.problem1.quote', '"I manage 40 buildings and building managers turn over constantly."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.userAccess.problemsSolved.propertyManagers.problem1.description', 'Every 6-12 months, someone leaves. You send emails to every vendor. Chase down account changes. Former managers retain access for weeks.')}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('common.solution', 'Solution')}:</strong> {t('modules.userAccess.problemsSolved.propertyManagers.problem1.solution', 'Building-level accounts eliminate the problem. Password change transfers access instantly.')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.userAccess.problemsSolved.propertyManagers.problem2.quote', '"The strata council asks if our vendors are responsive. I have no data."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.userAccess.problemsSolved.propertyManagers.problem2.description', 'You remember several complaints were resolved quickly. But you\'re scrolling through texts from March trying to prove it.')}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('common.solution', 'Solution')}:</strong> {t('modules.userAccess.problemsSolved.propertyManagers.problem2.solution', 'Pull the report. Average response time: 4.2 hours. Resolution rate: 94%. Data instead of vague assurances.')}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Residents */}
            <AccordionItem value="residents" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <Home className="w-5 h-5 text-rose-600" />
                  </div>
                  <span className="text-lg font-semibold">{t('modules.userAccess.problemsSolved.residentsProblems.title', 'For Residents')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.userAccess.problemsSolved.residentsProblems.problem1.quote', '"I see equipment on the roof. Nobody tells me what\'s happening."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.userAccess.problemsSolved.residentsProblems.problem1.description', "Technicians on the west side Monday. Are they coming to your side? You need to move balcony plants. You call the building manager. They don't know. They call the vendor.")}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('common.solution', 'Solution')}:</strong> {t('modules.userAccess.problemsSolved.residentsProblems.problem1.solution', 'Check the portal. West 100% complete. East starts Wednesday. Move your plants Tuesday night. No calls.')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.userAccess.problemsSolved.residentsProblems.problem2.quote', '"I reported streaky windows three weeks ago. No idea if anyone saw it."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.userAccess.problemsSolved.residentsProblems.problem2.description', "Email to building manager. Forward to vendor. Lost in someone's inbox.")}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('common.solution', 'Solution')}:</strong> {t('modules.userAccess.problemsSolved.residentsProblems.problem2.solution', 'Submit through the portal. Status changes from Open to Acknowledged to Resolved. Photos of corrected work attached. Know exactly where your issue stands.')}
                    </p>
                  </div>
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
            {t('modules.userAccess.measurableResults.title', 'Measurable Results')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.userAccess.measurableResults.subtitle', "Concrete improvements you'll see from day one.")}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.userAccess.measurableResults.delegationWithoutExposure.title', 'Delegation Without Exposure')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.userAccess.measurableResults.delegationWithoutExposure.description', 'Grant project creation, scheduling, and client communication without exposing compensation data. Your supervisors handle operations. Your financials stay private.')}
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
                    <h3 className="font-semibold text-lg mb-2">{t('modules.userAccess.measurableResults.feedbackResolution.title', 'Feedback Resolution: Days to Hours')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.userAccess.measurableResults.feedbackResolution.description', 'Direct resident-to-vendor communication eliminates the building manager middleman. Average resolution time drops from 3-5 days to 24 hours.')}
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
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.userAccess.measurableResults.managerTurnover.title', 'Manager Turnover: Weeks to Seconds')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.userAccess.measurableResults.managerTurnover.description', 'Building-level accounts eliminate vendor coordination when managers change. Password change transfers access instantly. Zero access gaps.')}
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
                    <Search className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.userAccess.measurableResults.auditPreparation.title', 'Audit Preparation: Scramble to Search')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.userAccess.measurableResults.auditPreparation.description', 'When insurance asks about vendor performance or strata councils question responsiveness, you search and export. Complete records. Professional PDFs.')}
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
            {t('modules.userAccess.moduleIntegration.title', 'Other Modules This Module Communicates With')}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            {t('modules.userAccess.moduleIntegration.subtitle', "User access controls aren't standalone. They're the foundation every other module builds on. When you grant someone permission, the entire system respects that decision.")}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.userAccess.moduleIntegration.employeeManagement.title', 'Employee Management')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.userAccess.moduleIntegration.employeeManagement.description', 'Permission controls determine who can create employees, assign roles, and modify profiles. Only owners add team members. No unauthorized hiring.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.userAccess.moduleIntegration.payroll.title', 'Payroll & Time Tracking')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.userAccess.moduleIntegration.payroll.description', 'Financial permissions filter what appears in payroll dashboards. Supervisors see hours worked. Technicians see their own time. Owners see full cost visibility.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.userAccess.moduleIntegration.projectManagement.title', 'Project Management')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.userAccess.moduleIntegration.projectManagement.description', 'Project permissions control who creates, edits, assigns, and views projects. Owners create and assign. Supervisors manage their projects. Technicians see their work.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.userAccess.moduleIntegration.safetyCompliance.title', 'Safety & Compliance')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.userAccess.moduleIntegration.safetyCompliance.description', 'Safety permissions determine who submits, reviews, and approves documentation. Clear responsibility chain from technician to safety officer to owner.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.userAccess.moduleIntegration.feedbackManagement.title', 'Feedback Management')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.userAccess.moduleIntegration.feedbackManagement.description', 'Access controls route feedback appropriately. Residents submit. Building managers track. Your team resolves. Everyone stays in their lane.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.userAccess.moduleIntegration.analyticsReporting.title', 'Analytics & Reporting')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.userAccess.moduleIntegration.analyticsReporting.description', "Every report filters to the user's permission level. Dashboards show only authorized data. No accidental exposure.")}
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
            {t('modules.userAccess.businessImpact.title', 'Stop Managing Access. Start Managing Growth.')}
          </h2>
          
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p>
                {t('modules.userAccess.businessImpact.paragraph1', "Every hour you spend gatekeeping information is an hour you're not spending on growth.")}
              </p>
              <p>
                {t('modules.userAccess.businessImpact.paragraph2', "Your supervisor calls because he can't create a project. You stop what you're doing to log in for him. Your building manager forwards another resident email. You relay the response. Your technician texts a complaint from the field. You copy it into a spreadsheet.")}
              </p>
              <p className="font-medium text-foreground">
                {t('modules.userAccess.businessImpact.paragraph3', 'None of this is your job. All of it consumes your day.')}
              </p>
              <Separator className="my-6" />
              <p>
                {t('modules.userAccess.businessImpact.paragraph4', 'OnRopePro eliminates the gatekeeping. Your supervisor creates projects without seeing payroll. Your building manager tracks feedback without being the middleman. Your technician logs issues without remembering to tell you later.')}
              </p>
              <p>
                {t('modules.userAccess.businessImpact.paragraph5', 'You get visibility without bottlenecks. Control without micromanagement. Protection without paranoia.')}
              </p>
              <p className="font-medium text-foreground text-lg">
                {t('modules.userAccess.businessImpact.paragraph6', "The information you need to see finds you. The information others need stays with them. And the time you used to spend managing access? That's yours again.")}
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
            {t('modules.userAccess.faqs.title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            {t('modules.userAccess.faqs.subtitle', 'Common questions about user access and authentication.')}
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="faq-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.userAccess.faqs.faq1.question', "Can I change someone's permissions after I've set them up?")}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.userAccess.faqs.faq1.answer', 'Yes. Permissions can be modified anytime from the employee management dashboard. Changes take effect immediately on their next login.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.userAccess.faqs.faq2.question', 'What happens when a building manager leaves?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.userAccess.faqs.faq2.answer', 'Buildings have accounts, not building managers. The new manager changes the building password. Access transfers instantly. The former manager is locked out. No vendor coordination required.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.userAccess.faqs.faq3.question', "Can technicians see each other's pay rates?")}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.userAccess.faqs.faq3.answer', 'Only if you grant financial permissions, which you control individually per employee. By default, technicians see only their own work records and assigned projects.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.userAccess.faqs.faq4.question', 'How do residents get access to the portal?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.userAccess.faqs.faq4.answer', "Building codes. The code appears on elevator notices, gets shared by technicians on-site, or sent by property managers. Resident enters the code, creates an account, instant access to their building's portal.")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.userAccess.faqs.faq5.question', 'What if a resident accidentally registers for the wrong unit?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.userAccess.faqs.faq5.answer', 'The system prompts: "There\'s already an account for this unit. Are you a new resident?" If they confirm, access transfers. If they realize the mistake, they go back and enter the correct unit.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.userAccess.faqs.faq6.question', 'Can building managers see financial information?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.userAccess.faqs.faq6.answer', 'No. Building manager accounts have read-only access to project progress, feedback status, and work history. They cannot see rates, costs, or internal financial data.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.userAccess.faqs.faq7.question', 'How does feedback tracking work?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.userAccess.faqs.faq7.answer', 'Every submission timestamps automatically: when it was opened, when it was acknowledged, when it was resolved. The system calculates average response time and generates exportable reports for strata councils or property managers.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.userAccess.faqs.faq8.question', "Is my company's data separated from other OnRopePro customers?")}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.userAccess.faqs.faq8.answer', 'Completely. Multi-tenant architecture means your data exists in a separate partition. Every query, every API call filters to your company only. A security issue with another account cannot expose your information.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.userAccess.faqs.faq9.question', 'What permissions are available?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.userAccess.faqs.faq9.answer', '44+ individual permissions across categories: financial (rates, costs, margins), operational (projects, scheduling), safety (inspections, documentation), inventory (equipment, consumables), and employee management (hiring, roles).')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-10" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.userAccess.faqs.faq10.question', 'Can I create custom roles?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.userAccess.faqs.faq10.answer', 'Yes. While the system includes standard roles (Operations Manager, Supervisor, Technician, etc.), you can create custom positions for unique needs like Inventory Manager or Safety Officer, then assign whatever permissions that role requires.')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 text-white" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('modules.userAccess.cta.title', 'Ready to Take Control?')}
          </h2>
          <p className="text-lg text-blue-100">
            {t('modules.userAccess.cta.subtitle', 'Set up your first employee with custom permissions in under 5 minutes.')}<br />
            {t('modules.userAccess.cta.subtitleLine2', 'Full access. No credit card. Real data stays private from day one.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-cta-trial">
              {t('modules.userAccess.cta.ctaTrial', 'Start Your Free 60-Day Trial')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-cta-guide">
              <Link href="#faqs">
                {t('modules.userAccess.cta.ctaFaqs', 'Find Answers')}
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
            <span className="text-sm text-muted-foreground">{t('modules.userAccess.footer.tagline', 'Management Software for Rope Access')}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-footer-privacy">
              {t('modules.userAccess.footer.privacyPolicy', 'Privacy Policy')}
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="link-footer-terms">
              {t('modules.userAccess.footer.termsOfService', 'Terms of Service')}
            </Link>
          </div>
        </div>
      </footer>

      <EmployerRegistration open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
}
