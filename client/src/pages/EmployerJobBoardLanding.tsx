import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { PublicHeader } from "@/components/PublicHeader";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { EmployerRegistration } from "@/components/EmployerRegistration";
import { SoftwareReplaces, MODULE_SOFTWARE_MAPPING } from "@/components/SoftwareReplaces";
import {
  Briefcase,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Building2,
  Search,
  FileText,
  Users,
  Clock,
  Shield,
  DollarSign,
  BarChart3,
  Send,
  Target,
  Lock,
  Zap,
  ClipboardList,
  ChevronsUpDown,
  Globe,
  HardHat,
  ChevronRight,
  Calendar,
  UserPlus,
  Eye,
  TrendingUp,
  Star
} from "lucide-react";

const ALL_ACCORDION_ITEMS = [
  "employer-1", "employer-2", "employer-3", "ops-1", "bm-1"
];

export default function EmployerJobBoardLanding() {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const { openLogin } = useAuthPortal();
  const [showRegistration, setShowRegistration] = useState(false);

  const allExpanded = openItems.length === ALL_ACCORDION_ITEMS.length;

  const toggleAll = () => {
    setOpenItems(allExpanded ? [] : [...ALL_ACCORDION_ITEMS]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="employer" />
      
      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              {t('modules.employerJobBoard.hero.badge', 'Job Board Ecosystem')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('modules.employerJobBoard.hero.title', 'Stop Paying $22 Per Application')}<br />
              <span className="text-blue-100">{t('modules.employerJobBoard.hero.subtitle', "From People Who've Never Touched a Rope.")}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('modules.employerJobBoard.hero.description', "OnRopePro's Job Board is a closed ecosystem. Every employer verified. Every technician relevant. Post unlimited jobs.")}<br />
              <strong>{t('modules.employerJobBoard.hero.descriptionBold', 'Zero per-application fees.')}</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-hero-start">
                {t('modules.employerJobBoard.hero.ctaPrimary', 'Start Your Free 60-Day Trial')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={openLogin} data-testid="button-hero-signin">
                Sign In
              </Button>
            </div>
            
            <SoftwareReplaces 
              software={MODULE_SOFTWARE_MAPPING["employer-job-board"]} 
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
          <Card className="shadow-xl border-0 relative z-20 -mt-20" data-testid="card-stats-panel">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">{t('modules.employerJobBoard.stats.filteringTime.value', '0 hours')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.employerJobBoard.stats.filteringTime.label', 'Filtering Time')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">{t('modules.employerJobBoard.stats.platformFees.value', '$0')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.employerJobBoard.stats.platformFees.label', 'Platform Fees')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">{t('modules.employerJobBoard.stats.timeToHire.value', '1-3 Days')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.employerJobBoard.stats.timeToHire.label', 'Time to Hire')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">{t('modules.employerJobBoard.stats.interviews.value', '2-3')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.employerJobBoard.stats.interviews.label', 'Interviews Needed')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Problem Statement: The Indeed Tax */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-rose-500" />
              {t('modules.employerJobBoard.problemStatement.title', 'The Indeed Tax')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('modules.employerJobBoard.problemStatement.paragraph1', 'You post on Indeed. LinkedIn. Craigslist. Facebook. You get 50 applications. You open each one, hoping for a Level 2 with caulking experience.')}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('modules.employerJobBoard.problemStatement.paragraph2', 'What you find: shop laborers, pipe fitters, offshore oil rig candidates, and 23 people who "have always been interested in learning." Two hours of filtering. Two actual rope techs.')}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('modules.employerJobBoard.problemStatement.paragraph3', 'Then Indeed hits you with the bill. $22 per application if you don\'t respond within 48 hours. A single posting costs you $300 before you\'ve even scheduled an interview. Someone on your team has to log in every day just to click "decline" on resumes from car mechanics.')}
            </p>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-base font-medium text-foreground">
                {t('modules.employerJobBoard.problemStatement.solutionTitle', "OnRopePro's Job Board works differently.")}
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-2">
                {t('modules.employerJobBoard.problemStatement.solutionText', 'Every company here does rope access building maintenance. Every technician here is in the industry. When you post a job, 100% of applicants are relevant. No noise. No filtering. No $22 surprise fees.')}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* What This Module Does */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('modules.employerJobBoard.features.title', 'Your Closed Garden Ecosystem')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('modules.employerJobBoard.features.subtitle', 'Where every applicant is a rope tech and every employer is verified')}
          </p>
        </div>

        <p className="text-base text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          {t('modules.employerJobBoard.features.description', 'The Job Board connects you with qualified rope access technicians across the platform. Post jobs, browse talent, and send direct offers to candidates who match your requirements.')}
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Talent Browser */}
          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">{t('modules.employerJobBoard.features.talentBrowser.title', 'Talent Browser')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.features.talentBrowser.description1', 'Search the technician pool before you even post a job. Filter by location, certification level, experience, and expected pay rate.')}
              </p>
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.features.talentBrowser.description2', "See who's available, what they're looking for, and whether your budget matches their expectations before you spend time interviewing.")}
              </p>
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-foreground mb-2">{t('modules.employerJobBoard.features.talentBrowser.filterLabel', 'What you can filter by:')}</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 text-base text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {t('modules.employerJobBoard.features.talentBrowser.filter1', 'Location (city, region)')}
                  </li>
                  <li className="flex items-center gap-2 text-base text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {t('modules.employerJobBoard.features.talentBrowser.filter2', 'IRATA/SPRAT certification level')}
                  </li>
                  <li className="flex items-center gap-2 text-base text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {t('modules.employerJobBoard.features.talentBrowser.filter3', 'Years of experience')}
                  </li>
                  <li className="flex items-center gap-2 text-base text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {t('modules.employerJobBoard.features.talentBrowser.filter4', 'Expected pay rate')}
                  </li>
                  <li className="flex items-center gap-2 text-base text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {t('modules.employerJobBoard.features.talentBrowser.filter5', 'Safety rating score')}
                  </li>
                  <li className="flex items-center gap-2 text-base text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {t('modules.employerJobBoard.features.talentBrowser.filter6', 'Specialties (caulking, window washing, etc.)')}
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Unlimited Job Postings */}
          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">{t('modules.employerJobBoard.features.unlimitedPostings.title', 'Unlimited Job Postings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.features.unlimitedPostings.description1', 'Post as many jobs as your operation requires. Full-time, part-time, contract, seasonal.')}
              </p>
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.features.unlimitedPostings.description2', 'Six job types supported: window washing, caulking, pressure washing, gutter cleaning, painting and coating, visual inspection. No per-post fees. No per-application charges. No surprise invoices.')}
              </p>
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-foreground mb-2">{t('modules.employerJobBoard.features.unlimitedPostings.controlLabel', 'What you control:')}</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 text-base text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {t('modules.employerJobBoard.features.unlimitedPostings.control1', 'Job type and service scope')}
                  </li>
                  <li className="flex items-center gap-2 text-base text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {t('modules.employerJobBoard.features.unlimitedPostings.control2', 'Location and site details')}
                  </li>
                  <li className="flex items-center gap-2 text-base text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {t('modules.employerJobBoard.features.unlimitedPostings.control3', 'Required certifications')}
                  </li>
                  <li className="flex items-center gap-2 text-base text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {t('modules.employerJobBoard.features.unlimitedPostings.control4', 'Pay range (optional but recommended)')}
                  </li>
                  <li className="flex items-center gap-2 text-base text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {t('modules.employerJobBoard.features.unlimitedPostings.control5', 'Start date and duration')}
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Direct Job Offers */}
          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-violet-500 to-violet-600"></div>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-3">
                <Send className="w-6 h-6 text-violet-600" />
              </div>
              <CardTitle className="text-xl">{t('modules.employerJobBoard.features.directOffers.title', 'Direct Job Offers')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.features.directOffers.description1', 'Found a perfect candidate in the Talent Browser? Send them an offer directly. Link it to one of your active job postings.')}
              </p>
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.features.directOffers.description2', 'They get notified in their portal. Accept or decline with one tap. No email chains. No phone tag.')}
              </p>
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-foreground mb-2">{t('modules.employerJobBoard.features.directOffers.stepsLabel', 'How it works:')}</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 text-base text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-violet-600">1</span>
                    </div>
                    {t('modules.employerJobBoard.features.directOffers.step1', 'Select candidate from search results')}
                  </li>
                  <li className="flex items-center gap-2 text-base text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-violet-600">2</span>
                    </div>
                    {t('modules.employerJobBoard.features.directOffers.step2', 'Choose which job posting to link')}
                  </li>
                  <li className="flex items-center gap-2 text-base text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-violet-600">3</span>
                    </div>
                    {t('modules.employerJobBoard.features.directOffers.step3', 'Technician receives in-portal notification')}
                  </li>
                  <li className="flex items-center gap-2 text-base text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-violet-600">4</span>
                    </div>
                    {t('modules.employerJobBoard.features.directOffers.step4', 'Response comes back to your dashboard')}
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Who Benefits Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.employerJobBoard.whoBenefits.title', 'Who Benefits From This Module')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.employerJobBoard.whoBenefits.subtitle', 'Every stakeholder in the hiring process gains visibility and efficiency')}
          </p>

          <div className="space-y-8">
            {/* Employers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.employerJobBoard.whoBenefits.employers.title', 'For Employers (Company Owners)')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employerJobBoard.whoBenefits.employers.benefit1.title', 'Zero filtering. Every applicant is a rope tech.')}</h4>
                    <p className="text-base text-muted-foreground">
                      {t('modules.employerJobBoard.whoBenefits.employers.benefit1.description', 'You post a job. You receive applications from people who actually work in rope access building maintenance. Not pipe fitters. Not offshore workers. Not "interested in learning." Your applicant-to-interview ratio improves immediately.')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employerJobBoard.whoBenefits.employers.benefit2.title', 'Know salary expectations before you reach out.')}</h4>
                    <p className="text-base text-muted-foreground">
                      {t('modules.employerJobBoard.whoBenefits.employers.benefit2.description', "Technicians set their expected pay rate in their profile. When you browse talent, you see their number before sending an offer. If someone won't work under $60/hour and your budget is $45, you know before wasting an hour on an interview.")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employerJobBoard.whoBenefits.employers.benefit3.title', 'Included in your subscription.')}</h4>
                    <p className="text-base text-muted-foreground">
                      {t('modules.employerJobBoard.whoBenefits.employers.benefit3.description', "Post unlimited jobs. Receive unlimited applications. Indeed charges $22 per application if you don't respond in 48 hours. OnRopePro charges $0. Your job board access is part of what you already pay for.")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operations Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.employerJobBoard.whoBenefits.operationsManagers.title', 'For Operations Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employerJobBoard.whoBenefits.operationsManagers.benefit1.title', 'Browse talent before you post.')}</h4>
                    <p className="text-base text-muted-foreground">
                      {t('modules.employerJobBoard.whoBenefits.operationsManagers.benefit1.description', "Need a Level 2 with caulking experience in the Lower Mainland? Search the Talent Browser. See who's available, check their safety ratings, review their expected rates. Find candidates first, then create the job posting to match what's available.")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employerJobBoard.whoBenefits.operationsManagers.benefit2.title', 'Direct offers streamline hiring.')}</h4>
                    <p className="text-base text-muted-foreground">
                      {t('modules.employerJobBoard.whoBenefits.operationsManagers.benefit2.description', 'Find a strong candidate? Send them an offer linked to your job posting. No more "I\'ll send you an email with the details." The offer, the job specs, and the accept/decline button are all in one place.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Building Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-violet-50 dark:bg-violet-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.employerJobBoard.whoBenefits.buildingManagers.title', 'For Building Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">{t('modules.employerJobBoard.whoBenefits.buildingManagers.benefit1.title', 'Verify contractor hiring practices.')}</h4>
                  <p className="text-base text-muted-foreground">
                    {t('modules.employerJobBoard.whoBenefits.buildingManagers.benefit1.description', "When your rope access contractor uses OnRopePro, their technicians have documented IRATA/SPRAT certifications and visible safety ratings. You're not just trusting their word. You're seeing verified credentials tied to real work history.")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Property Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.employerJobBoard.whoBenefits.propertyManagers.title', 'For Property Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">{t('modules.employerJobBoard.whoBenefits.propertyManagers.benefit1.title', 'Confidence in contractor quality.')}</h4>
                  <p className="text-base text-muted-foreground">
                    {t('modules.employerJobBoard.whoBenefits.propertyManagers.benefit1.description', 'The contractors bidding on your portfolio use a system where every technician is verified. When they tell you "our team is certified and safety-focused," you can see the data backing that claim.')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Technicians */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-amber-50 dark:bg-amber-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.employerJobBoard.whoBenefits.technicians.title', 'For Technicians')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">{t('modules.employerJobBoard.whoBenefits.technicians.benefit1.title', 'Get found by employers who matter.')}</h4>
                  <p className="text-base text-muted-foreground">
                    {t('modules.employerJobBoard.whoBenefits.technicians.benefit1.description', 'When you turn on profile visibility, only verified rope access companies can see you. No random recruiters. No spam. Companies actively hiring in your specialty can search for you directly and send offers to your portal.')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Key Features */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('modules.employerJobBoard.keyFeatures.title', 'Key Features')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('modules.employerJobBoard.keyFeatures.subtitle', 'The Job Board ecosystem combines posting, searching, and hiring into one integrated system')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Feature 1 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{t('modules.employerJobBoard.keyFeatures.verifiedEcosystem.title', 'Verified Employer Ecosystem')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.keyFeatures.verifiedEcosystem.description1', 'Only rope access building maintenance companies post here. Every employer is verified when they create an account. No bakeries, no car washes, no unrelated industries.')}
              </p>
              <p className="text-base text-muted-foreground mt-2">
                {t('modules.employerJobBoard.keyFeatures.verifiedEcosystem.description2', "When you browse competitors' postings, you're seeing your actual market.")}
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <CardTitle className="text-lg">{t('modules.employerJobBoard.keyFeatures.oneClickApplications.title', 'One-Click Applications Inbound')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.keyFeatures.oneClickApplications.description1', 'When technicians apply, their profile data, resume, and certifications auto-attach. You see everything you need to evaluate them in one view.')}
              </p>
              <p className="text-base text-muted-foreground mt-2">
                {t('modules.employerJobBoard.keyFeatures.oneClickApplications.description2', 'No "please resend your resume" emails. No "can you confirm your IRATA number" phone calls.')}
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                </div>
                <CardTitle className="text-lg">{t('modules.employerJobBoard.keyFeatures.payRateVisibility.title', 'Expected Pay Rate Visibility')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.keyFeatures.payRateVisibility.description1', 'See what candidates want before you engage. If your budget is $45/hour and they want $60, you know immediately.')}
              </p>
              <p className="text-base text-muted-foreground mt-2">
                {t('modules.employerJobBoard.keyFeatures.payRateVisibility.description2', 'Stop wasting interview time on compensation mismatches.')}
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-violet-600" />
                </div>
                <CardTitle className="text-lg">{t('modules.employerJobBoard.keyFeatures.safetyRating.title', 'Safety Rating Integration')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.keyFeatures.safetyRating.description1', 'Every technician has an Individual Safety Rating (0-100) built from daily harness inspections, toolbox talk participation, and safety quiz completions.')}
              </p>
              <p className="text-base text-muted-foreground mt-2">
                {t('modules.employerJobBoard.keyFeatures.safetyRating.description2', 'See it in their profile. Factor it into your hiring decisions.')}
              </p>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-rose-600" />
                </div>
                <CardTitle className="text-lg">{t('modules.employerJobBoard.keyFeatures.statusDashboard.title', 'Application Status Dashboard')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.keyFeatures.statusDashboard.description1', "Track every applicant across every posting. See who's under review, who you've contacted, who's been offered, who's accepted.")}
              </p>
              <p className="text-base text-muted-foreground mt-2">
                {t('modules.employerJobBoard.keyFeatures.statusDashboard.description2', 'No spreadsheets. No losing candidates between the cracks.')}
              </p>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{t('modules.employerJobBoard.keyFeatures.instantOnboarding.title', 'Instant Onboarding Connection')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.keyFeatures.instantOnboarding.description1', 'When a technician accepts your offer, their profile data flows into your employee management system. IRATA number, certifications, banking details (if shared), emergency contacts.')}
              </p>
              <p className="text-base text-muted-foreground mt-2">
                {t('modules.employerJobBoard.keyFeatures.instantOnboarding.description2', 'Day-one ready without the paperwork marathon.')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Problems Solved */}
      <section id="problems-solved" className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">{t('modules.employerJobBoard.problemsSolved.title', 'Problems Solved')}</h2>
          <Button onClick={toggleAll} variant="outline" data-testid="button-toggle-all-accordions">
            <ChevronsUpDown className="w-4 h-4 mr-2" />
            {allExpanded ? t('modules.employerJobBoard.problemsSolved.collapseAll', 'Collapse All') : t('modules.employerJobBoard.problemsSolved.expandAll', 'Expand All')}
          </Button>
        </div>

        {/* For Employers */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b">
            <Briefcase className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl md:text-2xl font-semibold">{t('modules.employerJobBoard.problemsSolved.forEmployers', 'For Employers')}</h3>
          </div>

          <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
            <AccordionItem value="employer-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium" data-testid="accordion-employer-1">
                {t('modules.employerJobBoard.problemsSolved.employer1.question', '"I post on Indeed and get 50 applicants. Only 2 are actual rope techs."')}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.painLabel', 'The Pain:')}</span> {t('modules.employerJobBoard.problemsSolved.employer1.pain', "You post everywhere: Indeed, LinkedIn, Craigslist, Facebook. Applications flood in from people who've never touched a rope system.")}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.exampleLabel', 'Real Example:')}</span> {t('modules.employerJobBoard.problemsSolved.employer1.example', 'Shop laborers, general construction workers, offshore candidates. Two hours filtering to find two relevant resumes out of fifty applications.')}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.solutionLabel', 'Solution:')}</span> {t('modules.employerJobBoard.problemsSolved.employer1.solution', "OnRopePro's Job Board is a closed ecosystem. Every technician on the platform is in rope access building maintenance.")}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.benefitLabel', 'Benefit:')}</span> {t('modules.employerJobBoard.problemsSolved.employer1.benefit', 'When you post a job, 100% of applicants are relevant. No filtering required. Two hours of wasted time becomes zero.')}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="employer-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium" data-testid="accordion-employer-2">
                {t('modules.employerJobBoard.problemsSolved.employer2.question', '"Indeed charges me $22 per application if I don\'t respond in 48 hours."')}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.painLabel', 'The Pain:')}</span> {t('modules.employerJobBoard.problemsSolved.employer2.pain', 'Someone has to log in daily, open every application, decline or respond. Miss a few days and the charges pile up.')}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.exampleLabel', 'Real Example:')}</span> {t('modules.employerJobBoard.problemsSolved.employer2.example', "That's $22 times every unopened application. A single job posting can cost $300 in \"engagement fees\" before you've hired anyone.")}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.solutionLabel', 'Solution:')}</span> {t('modules.employerJobBoard.problemsSolved.employer2.solution', 'OnRopePro includes unlimited postings and applications in your subscription. No per-application fees. No surprise charges.')}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.benefitLabel', 'Benefit:')}</span> {t('modules.employerJobBoard.problemsSolved.employer2.benefit', 'No daily login obligation just to avoid billing. Post freely, review on your schedule, pay nothing extra.')}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="employer-3" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium" data-testid="accordion-employer-3">
                {t('modules.employerJobBoard.problemsSolved.employer3.question', '"I spent an hour interviewing someone who wants $20/hour more than my budget."')}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.painLabel', 'The Pain:')}</span> {t('modules.employerJobBoard.problemsSolved.employer3.pain', "The interview went well. References checked out. You're ready to make an offer. Then you ask about compensation.")}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.exampleLabel', 'Real Example:')}</span> {t('modules.employerJobBoard.problemsSolved.employer3.example', 'They want $60/hour. Your budget is $45. An hour wasted for both parties because expectations were never aligned.')}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.solutionLabel', 'Solution:')}</span> {t('modules.employerJobBoard.problemsSolved.employer3.solution', 'Technicians set expected pay rate in their profile. You see it in the Talent Browser before reaching out.')}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.benefitLabel', 'Benefit:')}</span> {t('modules.employerJobBoard.problemsSolved.employer3.benefit', 'Compensation mismatches get filtered before the interview, not during. Only interview candidates within your budget.')}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* For Operations Managers */}
          <div className="flex items-center gap-3 pb-2 border-b mt-8">
            <ClipboardList className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl md:text-2xl font-semibold">{t('modules.employerJobBoard.problemsSolved.forOperationsManagers', 'For Operations Managers')}</h3>
          </div>

          <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
            <AccordionItem value="ops-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium" data-testid="accordion-ops-1">
                {t('modules.employerJobBoard.problemsSolved.ops1.question', '"I don\'t know if we have capacity to take this new contract."')}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.painLabel', 'The Pain:')}</span> {t('modules.employerJobBoard.problemsSolved.ops1.pain', "A client calls with urgent work. You think Tommy finishes Tower A on Friday, but you're not certain. Is Sarah on vacation?")}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.exampleLabel', 'Real Example:')}</span> {t('modules.employerJobBoard.problemsSolved.ops1.example', 'You either decline the work (lost revenue) or commit and hope (risk of overcommitting and failing to deliver).')}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.solutionLabel', 'Solution:')}</span> {t('modules.employerJobBoard.problemsSolved.ops1.solution', 'The Job Board connects to your scheduling and employee management systems. When you post a job and receive applications, you can cross-reference against crew availability.')}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.benefitLabel', 'Benefit:')}</span> {t('modules.employerJobBoard.problemsSolved.ops1.benefit', 'Know if you have capacity before you commit. Make informed decisions about new contracts based on real data.')}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* For Building Managers */}
          <div className="flex items-center gap-3 pb-2 border-b mt-8">
            <Building2 className="w-5 h-5 text-violet-500" />
            <h3 className="text-xl md:text-2xl font-semibold">{t('modules.employerJobBoard.problemsSolved.forBuildingManagers', 'For Building Managers')}</h3>
          </div>

          <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
            <AccordionItem value="bm-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium" data-testid="accordion-bm-1">
                {t('modules.employerJobBoard.problemsSolved.bm1.question', '"How do I know this contractor hires qualified workers?"')}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.painLabel', 'The Pain:')}</span> {t('modules.employerJobBoard.problemsSolved.bm1.pain', 'You hire a rope access company but have no visibility into who they\'re actually sending to your building.')}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.exampleLabel', 'Real Example:')}</span> {t('modules.employerJobBoard.problemsSolved.bm1.example', "Are these people certified? Do they have safety records? You're trusting the contractor's word with no way to verify.")}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.solutionLabel', 'Solution:')}</span> {t('modules.employerJobBoard.problemsSolved.bm1.solution', 'When contractors use OnRopePro, their technicians have verified IRATA/SPRAT certifications and visible safety ratings.')}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('modules.employerJobBoard.problemsSolved.benefitLabel', 'Benefit:')}</span> {t('modules.employerJobBoard.problemsSolved.bm1.benefit', 'You can ask for documentation. The data exists in their system. Trust is backed by verifiable records.')}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Connected Modules */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('modules.employerJobBoard.connectedModules.title', 'Connected Modules')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('modules.employerJobBoard.connectedModules.subtitle', "The Job Board doesn't exist in isolation. It connects to the systems you already use.")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover-elevate">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.employerJobBoard.connectedModules.employeeManagement.title', 'Employee Management')}</CardTitle>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.connectedModules.employeeManagement.description', 'When a technician accepts your offer, their profile data flows into your employee roster. IRATA number, certifications, contact information. Start onboarding immediately.')}
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.employerJobBoard.connectedModules.safetyCompliance.title', 'Safety & Compliance')}</CardTitle>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.connectedModules.safetyCompliance.description', 'Candidate safety ratings come from real data: harness inspections, toolbox talks, safety quizzes. The score you see is earned, not self-reported.')}
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.employerJobBoard.connectedModules.projectManagement.title', 'Project Management')}</CardTitle>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.connectedModules.projectManagement.description', 'Hiring for a specific project? See which positions you need to fill by checking your active projects. Staff appropriately based on real workload.')}
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.employerJobBoard.connectedModules.schedulingCalendar.title', 'Scheduling & Calendar')}</CardTitle>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">
                {t('modules.employerJobBoard.connectedModules.schedulingCalendar.description', "Cross-reference new hires against crew availability. Know when you have capacity to bring someone on and which projects they'll join.")}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('modules.employerJobBoard.cta.title', 'Your Hiring Time Goes to Zero.')}<br />
            <span className="text-blue-600">{t('modules.employerJobBoard.cta.titleHighlight', 'Your Talent Pool Goes to Everyone.')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('modules.employerJobBoard.cta.description1', 'Right now, hiring eats your week. You post on Indeed. You wait for applications. You filter through irrelevant resumes. You interview people who want double your budget. You pay $22 per application from pipe fitters.')}
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('modules.employerJobBoard.cta.description2', "With OnRopePro's Job Board, your next hire is already in the system. Search the Talent Browser. Find Level 2 techs with caulking experience in your region. See their safety rating, their expected rate, their certifications. Send an offer directly.")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#0B64A3] text-white hover:bg-[#0369A1]" onClick={() => setShowRegistration(true)} data-testid="button-cta-start">
              {t('modules.employerJobBoard.cta.ctaPrimary', 'Start Your Free 60-Day Trial')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-cta-learn">
              <Link href="/changelog/job-board">
                {t('modules.employerJobBoard.cta.ctaSecondary', 'Learn More')}
                <BookOpen className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t('modules.employerJobBoard.footer.text', 'Part of the OnRopePro platform for rope access building maintenance companies.')}
          </p>
        </div>
      </footer>

      <EmployerRegistration open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
}
