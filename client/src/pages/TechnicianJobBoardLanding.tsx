import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { PublicHeader } from "@/components/PublicHeader";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import {
  Briefcase,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Building2,
  Search,
  FileText,
  Eye,
  EyeOff,
  Clock,
  Shield,
  DollarSign,
  BarChart3,
  Send,
  Target,
  Lock,
  Zap,
  Users,
  ClipboardList,
  ChevronsUpDown,
  Wrench,
  Globe,
  HardHat,
  ChevronRight,
  Star,
  TrendingUp
} from "lucide-react";

const ALL_ACCORDION_ITEMS = [
  "tech-1", "tech-2", "tech-3", "tech-4", "employed-1", "employed-2"
];

const FAQ_ITEMS = [
  "faq-1", "faq-2", "faq-3", "faq-4", "faq-5", "faq-6", "faq-7", "faq-8"
];

export default function TechnicianJobBoardLanding() {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [faqOpenItems, setFaqOpenItems] = useState<string[]>([]);
  const [applicationTime, setApplicationTime] = useState(0);
  const [relevantPercent, setRelevantPercent] = useState(0);

  const allExpanded = openItems.length === ALL_ACCORDION_ITEMS.length;

  const toggleAll = () => {
    setOpenItems(allExpanded ? [] : [...ALL_ACCORDION_ITEMS]);
  };

  useEffect(() => {
    let appTime = 0;
    let relevant = 0;
    
    const interval = setInterval(() => {
      if (appTime < 30) { appTime++; setApplicationTime(appTime); }
      if (relevant < 100) { relevant += 2; setRelevantPercent(Math.min(relevant, 100)); }
      
      if (appTime >= 30 && relevant >= 100) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="technician" />
      
      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              {t('modules.technicianJobBoard.hero.badge', 'Job Board Ecosystem')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('modules.technicianJobBoard.hero.title', 'Every Job Here Is Rope Access.')}<br />
              <span className="text-blue-100">{t('modules.technicianJobBoard.hero.subtitle', 'Every Company Is Real.')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('modules.technicianJobBoard.hero.description', "OnRopePro's Job Board is exclusively for rope access building maintenance. Browse real jobs from verified companies. Apply in 30 seconds.")}<br />
              <strong>{t('modules.technicianJobBoard.hero.descriptionBold', 'Control who sees your profile.')}</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" asChild data-testid="button-hero-browse">
                <Link href="/technician-login">
                  {t('modules.technicianJobBoard.hero.ctaPrimary', 'Browse Jobs Free')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-hero-answers">
                <Link href="#faqs">
                  {t('modules.technicianJobBoard.hero.ctaSecondary', 'Find Answers')}
                  <BookOpen className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
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
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">{applicationTime}s</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.technicianJobBoard.stats.applicationTime', 'Application Time')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">{relevantPercent}%</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.technicianJobBoard.stats.relevantListings', 'Relevant Listings')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">{t('modules.technicianJobBoard.stats.immediateValue', 'Immediate')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.technicianJobBoard.stats.searchTime', 'Search Time')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">{t('modules.technicianJobBoard.stats.upfrontValue', 'Upfront')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.technicianJobBoard.stats.interviewAlignment', 'Interview Alignment')}</div>
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
            {t('modules.technicianJobBoard.problem.title', 'Indeed Thinks You Want to Be a Pipe Fitter')}
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                {t('modules.technicianJobBoard.problem.intro', 'You search "rope access" on Indeed. What do you get?')}
              </p>
              <p>
                {t('modules.technicianJobBoard.problem.paragraph1', 'Offshore oil platforms in the Maritimes. Industrial access jobs at Alberta refineries. Pipe fitter positions that mention "rope" once in the safety section. General construction gigs that require "working at heights."')}
              </p>
              <p>
                {t('modules.technicianJobBoard.problem.paragraph2', 'You scroll for 20 minutes to find 3 jobs that might actually be rope access building maintenance. Maybe.')}
              </p>
              <p>
                {t('modules.technicianJobBoard.problem.paragraph3', "Then you apply. Upload your resume. Fill out the same form for the 50th time. Manually type your IRATA number because there's no field for it. Wonder if the company even checked your certification.")}
              </p>
              <Separator className="my-6" />
              <p className="font-medium text-foreground text-lg">
                {t('modules.technicianJobBoard.problem.solutionTitle', "OnRopePro's Job Board works differently.")}
              </p>
              <p>
                {t('modules.technicianJobBoard.problem.solutionParagraph1', 'Every job posted here is rope access building maintenance. Window washing. Caulking. Pressure washing. Gutter cleaning. Painting and coating. Visual inspection. No offshore. No oil rigs. No pipe fitting.')}
              </p>
              <p>
                {t('modules.technicianJobBoard.problem.solutionParagraph2', 'Every company posting is verified. Real rope access operators who do real building maintenance. When you apply, your certifications, experience, and safety rating go with your application automatically.')}
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
            {t('modules.technicianJobBoard.features.title', 'Your Rope Access Career Hub')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.technicianJobBoard.features.subtitle', 'Where every job matches your skills and every employer understands your work')}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Job Browser */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.technicianJobBoard.features.jobBrowser.title', 'Job Browser')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.technicianJobBoard.features.jobBrowser.headline', 'See only rope access building maintenance jobs.')}</p>
                <p>{t('modules.technicianJobBoard.features.jobBrowser.description', 'Filter by location, job type, and certification requirements. Each listing shows company details, pay range (when provided), start dates, and project scope. Every company is verified. Every job is relevant.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.technicianJobBoard.features.jobBrowser.filterLabel', 'What you can filter by:')}</p>
                <ul className="space-y-1 ml-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Location (city, region)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Job type (window washing, caulking, etc.)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Employment type (full-time, contract)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Required certification level</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pay range</li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 2: One-Click Applications */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <Send className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.technicianJobBoard.features.oneClickApplications.title', 'One-Click Applications')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.technicianJobBoard.features.oneClickApplications.headline', 'Your profile data travels with your application.')}</p>
                <p>{t('modules.technicianJobBoard.features.oneClickApplications.description', 'Resume, certifications, IRATA/SPRAT numbers, years of experience, safety rating. All attached automatically. Apply to a job in 30 seconds instead of re-entering the same information for the 100th time.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.technicianJobBoard.features.oneClickApplications.sentLabel', 'What gets sent automatically:')}</p>
                <ul className="space-y-1 ml-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resume/CV (if uploaded)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> IRATA/SPRAT certification details</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Years of experience</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Safety rating score</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Your expected pay rate</li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3: Profile Visibility Toggle */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                  <Eye className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.technicianJobBoard.features.profileVisibility.title', 'Profile Visibility Toggle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.technicianJobBoard.features.profileVisibility.headline', 'Control who finds you.')}</p>
                <p>{t('modules.technicianJobBoard.features.profileVisibility.description', "Toggle visibility ON: employers can search for you in the Talent Browser, see your credentials, and send you direct job offers. Toggle it OFF: you're invisible to searches but can still browse and apply to jobs normally.")}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.technicianJobBoard.features.profileVisibility.visibleLabel', "What employers see when you're visible:")}</p>
                <ul className="space-y-1 ml-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Name and photo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Certification levels and numbers</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Years of experience</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Safety rating</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Expected pay rate</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Who Benefits Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Who Benefits From This Module
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            A closed ecosystem where every participant gets exactly what they need
          </p>

          <div className="space-y-8">
            {/* For Technicians */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-amber-50 dark:bg-amber-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">For Technicians</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Every job is rope access building maintenance</h4>
                    <p className="text-base text-muted-foreground">No more scrolling past offshore rigs, pipe fitting positions, and "working at heights" construction gigs. Every posting here is from a verified rope access company doing building maintenance.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Apply once, your credentials follow everywhere</h4>
                    <p className="text-base text-muted-foreground">Upload your resume, enter your IRATA number, set your expected pay rate. Every application you send includes this information automatically. No more typing the same details into 50 different forms.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">You control who sees you</h4>
                    <p className="text-base text-muted-foreground">Toggle profile visibility on when you're actively looking. Toggle it off when you're not. If you're employed but casually browsing, keep it off. Employers can't find you unless you want them to.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Know what they're paying before you apply</h4>
                    <p className="text-base text-muted-foreground">Many employers list pay ranges on job postings. For those who don't, you can set your expected rate and let them decide if it matches their budget before they reach out.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Employers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">For Employers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Find technicians who match your requirements</h4>
                    <p className="text-base text-muted-foreground">Search the Talent Browser by certification level, location, experience, and expected pay rate. See safety ratings before reaching out. Send offers directly to candidates who fit.</p>
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
                  <CardTitle className="text-xl">For Building Managers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Verify contractor hiring standards</h4>
                    <p className="text-base text-muted-foreground">When contractors use OnRopePro, their technicians have documented credentials and safety ratings. You're not trusting their word. You're seeing verified data.</p>
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
                  <CardTitle className="text-xl">For Property Managers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Confidence in service provider quality</h4>
                    <p className="text-base text-muted-foreground">The technicians doing work on your properties are part of a verified ecosystem. IRATA/SPRAT certifications are confirmed. Safety ratings are earned through real activity.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Key Features Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Key Features
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            The Job Board puts you in control of your career
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Closed Ecosystem</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                <p>Only rope access building maintenance companies post here. No general contractors. No staffing agencies. No offshore platforms.</p>
                <p className="mt-2">When you apply, you know the company does what you do.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <CardTitle className="text-lg">Instant Applications</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                <p>Your profile data, resume, certifications, and safety rating attach to every application.</p>
                <p className="mt-2">One click to apply. No forms to fill. 30 seconds from browsing to applied.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-2">
                  <Send className="w-5 h-5 text-amber-600" />
                </div>
                <CardTitle className="text-lg">Direct Job Offers</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                <p>When your profile visibility is on, employers can send you offers directly from the Talent Browser.</p>
                <p className="mt-2">Accept or decline with one tap. No email chains. No phone tag.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-2">
                  <DollarSign className="w-5 h-5 text-violet-600" />
                </div>
                <CardTitle className="text-lg">Expected Pay Rate</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                <p>Set what you want to earn. Employers see this in the Talent Browser.</p>
                <p className="mt-2">If someone can't meet your rate, they won't waste your time with an interview. Salary mismatches get filtered before they happen.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-rose-600" />
                </div>
                <CardTitle className="text-lg">Safety Rating Display</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                <p>Your Individual Safety Rating (0-100) shows employers you take the work seriously.</p>
                <p className="mt-2">Built from harness inspections, toolbox talks, safety quizzes. A high score is a competitive advantage.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center mb-2">
                  <BarChart3 className="w-5 h-5 text-cyan-600" />
                </div>
                <CardTitle className="text-lg">Application Status Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                <p>See where each application stands. Under review. Shortlisted. Offer extended. Declined.</p>
                <p className="mt-2">No more "did they even see my resume?" uncertainty.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Problems Solved Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">Problems Solved</h2>
            <Button onClick={toggleAll} variant="outline" data-testid="button-toggle-all-accordions">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          {/* For Technicians */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b">
              <HardHat className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Technicians</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="tech-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium" data-testid="accordion-tech-1">
                  "I search 'rope access' on Indeed and get pipe fitter and offshore oil jobs."
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> You want rope access building maintenance work. You search Indeed. Results: industrial access at refineries, offshore platforms, general construction that mentions "heights."</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> You scroll for 30 minutes to find 2-3 maybe-relevant postings. Most are offshore rigs or industrial sites, not buildings.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> OnRopePro's Job Board is exclusively for rope access building maintenance. Every job is window washing, caulking, pressure washing, gutter cleaning, painting, or visual inspection on buildings.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> 100% relevant listings. Zero scrolling through irrelevant postings. Find what you're looking for immediately.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium" data-testid="accordion-tech-2">
                  "I apply to jobs and manually enter my IRATA number every single time."
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> Indeed doesn't have a field for IRATA certification. Neither does LinkedIn. You upload your resume, then manually type your cert number into a notes field.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> Sometimes you forget. Sometimes they don't even read it. You've typed your IRATA number into 50+ job applications this year.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> On OnRopePro, your IRATA/SPRAT certification is part of your profile. It attaches to every application automatically.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Employers see your cert level, your number, your expiration date. No manual entry. No forgotten information. Apply in 30 seconds instead of 15-20 minutes.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-3" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium" data-testid="accordion-tech-3">
                  "I don't want my current employer to know I'm looking for work."
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> You're employed. It's fine. But you wouldn't mind seeing what else is out there. Problem: if you make yourself visible on a job board, your boss might find out.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> You set your LinkedIn to "Open to Work" and your supervisor asks about it the next day. Awkward conversation ahead.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Profile visibility is opt-in. Keep it toggled off: you can browse jobs, apply to postings, and stay invisible to the Talent Browser.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Your current employer can't stumble across your profile. Toggle it on only when you're ready to be found.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-4" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium" data-testid="accordion-tech-4">
                  "I spent an hour interviewing for a job that pays $15/hour less than I need."
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> The listing didn't show pay. You applied, interviewed, got along great with the owner. Then they offered $45/hour. You need $60 to make the numbers work.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> An hour of your time wasted. An hour of their time wasted. You're back to scrolling Indeed.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Set your expected pay rate in your profile. Employers see it in the Talent Browser. If they can't meet your number, they won't reach out.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Compensation mismatches get filtered before the interview, not during. No more wasted interviews on jobs that can't meet your rate.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* For Currently Employed Technicians */}
            <div className="flex items-center gap-3 pb-2 border-b mt-12">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Currently Employed Technicians</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="employed-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium" data-testid="accordion-employed-1">
                  "I want to know what's out there without broadcasting that I'm looking."
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> You're not unhappy at your current job. But opportunities come and go. You'd like to see what companies are hiring without announcing to the industry that you're on the market.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> You check LinkedIn's job section but worry that your activity is visible. Rope access is a small industry. Word gets around.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Keep profile visibility off. Browse job postings anonymously. Apply selectively to positions that genuinely interest you.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> No one knows you're looking unless you tell them. Stay informed about the market without risking your current position.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="employed-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium" data-testid="accordion-employed-2">
                  "I have no way to build a reputation that follows me between employers."
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> You've worked safely for five years. Never had an incident. Your current employer knows it. But when you apply to a new company, you start from zero.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> No documented track record. Just your word. The new employer has no way to verify your safety history.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Your Individual Safety Rating travels with you. Built from harness inspections, toolbox talks, near-miss reports, safety quizzes.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> When you apply to a new job, employers see your score. Five years of safe work becomes a competitive advantage, not just a claim on your resume.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Connected Modules Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Connected Modules
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            The Job Board connects to your professional profile across the platform
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-lg">Document Vault</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                <p>Your certifications, resume, banking info, and emergency contacts are stored securely.</p>
                <p className="mt-2">When you accept a job offer, share them with your new employer in one click. No hunting for void cheques.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-sky-600" />
                  </div>
                  <CardTitle className="text-lg">Safety & Compliance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                <p>Your Individual Safety Rating builds from real activity: daily harness inspections, toolbox talk participation, safety quizzes.</p>
                <p className="mt-2">Employers see a number you earned, not a number you claimed.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-cyan-600" />
                  </div>
                  <CardTitle className="text-lg">Logbook</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                <p>Your work history, hours logged, buildings completed, and tasks performed.</p>
                <p className="mt-2">Accepting a new job? Your track record travels with you.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Employee Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                <p>When you accept an offer, your profile data flows to your new employer's system.</p>
                <p className="mt-2">IRATA number, certifications, contact details. Day-one ready without the paperwork.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* FAQs Section */}
      <section id="faqs" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <Accordion type="multiple" value={faqOpenItems} onValueChange={setFaqOpenItems} className="space-y-3">
            <AccordionItem value="faq-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium" data-testid="accordion-faq-1">
                Do I need to pay to access the job board?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Free tier accounts can browse job postings. Plus accounts get full job board access including profile visibility options and the ability to receive direct offers from employers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium" data-testid="accordion-faq-2">
                Can my current employer see that I'm looking for work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Only if you toggle profile visibility on. Keep it off and you're invisible to the Talent Browser. You can still browse and apply to jobs without anyone knowing.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium" data-testid="accordion-faq-3">
                What if I'm not employed right now?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                You can still create an account, upload your certifications, and apply to jobs. Your safety rating will build once you're connected to an employer on the platform.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium" data-testid="accordion-faq-4">
                How does the expected pay rate work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                You set what you want to earn per hour. Employers see this when they browse the Talent Browser. If your rate is $55/hour and they're offering $40, they can choose not to reach out. Saves everyone time.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium" data-testid="accordion-faq-5">
                What happens when I accept a job offer?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                If the employer uses OnRopePro, onboarding is nearly instant. Your profile data flows to their system. They enter your pay rate and permissions. You're ready to work on day one without re-entering your information.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium" data-testid="accordion-faq-6">
                What certifications do I need to use the job board?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                The job board is for rope access building maintenance professionals. Most employers will require IRATA or SPRAT certification. You can list your certification level and number in your profile.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium" data-testid="accordion-faq-7">
                Can I apply to multiple jobs at the same time?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Yes. Apply to as many jobs as interest you. Track each application's status from your dashboard.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium" data-testid="accordion-faq-8">
                What if an employer sends me an offer but I'm not interested?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Decline it with one tap. The employer gets notified. No awkward phone calls required.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Access Requirements Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Access Requirements
          </h2>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold">Free Tier</th>
                      <th className="text-center p-4 font-semibold">
                        <span className="flex items-center justify-center gap-2">
                          <Star className="w-4 h-4 text-amber-500" />
                          Plus Account
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">Browse Job Postings</td>
                      <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                      <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Apply to Jobs</td>
                      <td className="p-4 text-center text-muted-foreground">Limited</td>
                      <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Profile Visibility Toggle</td>
                      <td className="p-4 text-center text-muted-foreground">-</td>
                      <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Receive Direct Offers</td>
                      <td className="p-4 text-center text-muted-foreground">-</td>
                      <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Set Expected Pay Rate</td>
                      <td className="p-4 text-center text-muted-foreground">-</td>
                      <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="p-4">Safety Rating Display</td>
                      <td className="p-4 text-center text-sm text-muted-foreground">Requires employer</td>
                      <td className="p-4 text-center text-sm text-muted-foreground">Requires employer</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Final CTA Section */}
      <section className="py-20 md:py-28 px-4" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Every Job Here Is Rope Access.<br />
            <span className="text-blue-100">No Exceptions.</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Stop scrolling through pipe fitter listings and offshore rigs. OnRopePro's Job Board is built for techs who do rope access building maintenance. Browse jobs, apply in seconds, control who finds you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" asChild data-testid="button-cta-browse">
              <Link href="/technician-login">
                Browse Jobs Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-cta-plus">
              <Link href="/technician-login">
                Upgrade to Plus for Full Access
                <Star className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-900 text-slate-400">
        <div className="max-w-6xl mx-auto text-center">
          <img src={onRopeProLogo} alt="OnRopePro" className="h-8 mx-auto mb-4 opacity-60" />
          <p className="text-sm">The platform built for rope access building maintenance.</p>
        </div>
      </footer>
    </div>
  );
}
