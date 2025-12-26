import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { TechnicianRegistration } from "@/components/TechnicianRegistration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { PublicHeader } from "@/components/PublicHeader";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import {
  ArrowRight,
  HardHat,
  Shield,
  Clock,
  Download,
  Users,
  Award,
  AlertTriangle,
  CheckCircle2,
  Briefcase,
  Globe,
  TrendingUp,
  Star,
  Lock,
  FileText,
  UserPlus,
  Zap,
  Bell,
  Search,
  Eye,
  BarChart3,
  Share2,
  Camera,
  XCircle,
  Calculator,
  CreditCard,
  Mail,
  Loader2
} from "lucide-react";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

const TECHNICIAN_COLOR = "#AB4521";
const TECHNICIAN_GRADIENT_END = "#8B371A";

export default function TechnicianLanding() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { openLogin } = useAuthPortal();
  const [faqOpen, setFaqOpen] = useState<string[]>([]);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('register') === 'true') {
      setShowRegistration(true);
      window.history.replaceState({}, '', '/technician');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="technician" />
      {/* Hero Section - Rust Brown Gradient */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: `linear-gradient(135deg, ${TECHNICIAN_COLOR} 0%, ${TECHNICIAN_GRADIENT_END} 100%)`}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-technician-portal">
              <div className="flex flex-col items-center gap-1">
                <span>{t('technicianLanding.hero.badge')}</span>
                <span className="text-xs opacity-90">{t('technicianLanding.hero.badgeSubtitle')}</span>
              </div>
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('technicianLanding.hero.title')}<br />
              <span className="text-orange-100">{t('technicianLanding.hero.titleHighlight')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
              {t('technicianLanding.hero.subtitle')}<br />
              <strong>{t('technicianLanding.hero.subtitleStrong')}</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="bg-white hover:bg-orange-50" 
                style={{color: TECHNICIAN_COLOR}} 
                onClick={() => setShowRegistration(true)}
                data-testid="button-hero-create-account"
              >
                {t('technicianLanding.hero.createAccount')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10" 
                onClick={openLogin}
                data-testid="button-hero-login"
              >
                {t('technicianLanding.hero.signIn')}
              </Button>
            </div>
            
            <p className="text-sm text-orange-100/80">
              {t('technicianLanding.hero.noCreditCard')}
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
      {/* Problem Validation Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              You've lost hours. You just don't know how many.
            </h2>
          </div>
          
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Last Tuesday. That 40-story building downtown. Did you do 3 drops or 4?
            </p>
            <p>
              Three weeks ago. The industrial complex out by the port. Was it 6 hours or 8?
            </p>
            <p>
              Six months ago. The company that folded. All those hours-gone with their paperwork.
            </p>
            <p>
              You're not careless. You're busy hitting 5 buildings a week, managing gear, staying safe at height. Details blur. Memory fails. And when you sit down to fill your IRATA logbook, you're guessing at the data your certification depends on.
            </p>
          </div>
          
          <Card className="mt-8 border-2 border-[#AB4521]/30 bg-[#AB4521]/5">
            <CardContent className="p-6 text-center">
              <p className="text-xl font-semibold text-foreground">
                The industry average: 15-20% of logged hours are estimates, not records.
              </p>
              <p className="text-muted-foreground mt-2">
                That's your career progression. Your L2. Your L3. Built on guesswork.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <Separator />
      {/* Value Proposition Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t('technicianLanding.valueProposition.title')}
            </h2>
          </div>
          
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              {t('technicianLanding.valueProposition.paragraph1')}
            </p>
            <p>
              {t('technicianLanding.valueProposition.paragraph2')}
            </p>
            <p>
              {t('technicianLanding.valueProposition.paragraph3')}
            </p>
          </div>
          
          <Card className="mt-8 border-2 border-[#AB4521] bg-white dark:bg-slate-950">
            <CardContent className="p-6 text-center">
              <p className="text-xl font-semibold text-foreground">
                {t('technicianLanding.valueProposition.cta')}
              </p>
              <p className="text-lg text-[#AB4521] font-medium mt-2">
                {t('technicianLanding.valueProposition.ctaHighlight')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Free vs PLUS Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t('technicianLanding.freeVsPlus.title')}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Account Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-slate-100 dark:bg-slate-800 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{t('technicianLanding.freeVsPlus.freeAccount.title')}</CardTitle>
                    <p className="text-sm text-muted-foreground">{t('technicianLanding.freeVsPlus.freeAccount.subtitle')}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Portable Profile</p>
                      <p className="text-sm text-muted-foreground">Your certifications, contact info, and work history in one place-owned by you</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Logbook Photo Import</p>
                      <p className="text-sm text-muted-foreground">Snap a photo of your physical logbook pages. The app reads them and imports your historical data automatically. Years of work history uploaded in minutes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Instant Employer Connection</p>
                      <p className="text-sm text-muted-foreground">When connected to an employer on OnRopePro: 10 seconds to onboard, not 60 minutes of paperwork</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Automatic Hour Tracking</p>
                      <p className="text-sm text-muted-foreground">Every work session, building, height, and task logged automatically (when employer uses OnRopePro)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Personal Safety Rating</p>
                      <p className="text-sm text-muted-foreground">Your compliance score based on inspections and document acknowledgments</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Data Export Anytime</p>
                      <p className="text-sm text-muted-foreground">Download your complete work history. You own your data, period.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">One Employer Connection</p>
                      <p className="text-sm text-muted-foreground">Connect with one company at a time</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-center font-medium text-[#AB4521]">
                    This is yours. Forever. No strings.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* PLUS Account Card */}
            <Card className="overflow-hidden border-2 border-[#AB4521]">
              <CardHeader className="bg-[#AB4521]/10 border-b border-[#AB4521]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#AB4521]/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-[#AB4521]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{t('technicianLanding.freeVsPlus.plusAccount.title')}</CardTitle>
                      <Badge className="bg-[#AB4521] text-white">PRO</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{t('technicianLanding.freeVsPlus.plusAccount.orFree')}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground italic">Everything in Free, plus...</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-[#AB4521] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Certification Expiry Alerts</p>
                      <p className="text-sm text-muted-foreground">60-day yellow warning, 30-day red alert. Never miss a renewal.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#AB4521] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Multi-Employer Connections</p>
                      <p className="text-sm text-muted-foreground">Work your main job Monday-Thursday, pick up side gigs Friday-Sunday.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Search className="w-5 h-5 text-[#AB4521] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Job Board Access</p>
                      <p className="text-sm text-muted-foreground">See and apply to urban rope tech positions posted by companies on the platform</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 text-[#AB4521] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Enhanced Profile Visibility</p>
                      <p className="text-sm text-muted-foreground">Employers searching for techs see your profile first</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-[#AB4521] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Level Progression Tracking</p>
                      <p className="text-sm text-muted-foreground">Visual display of hours toward your next IRATA level (L1 to L2 to L3)</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-center text-sm text-muted-foreground">
                    <strong className="text-foreground">How to get PLUS:</strong> Refer one other technician who creates an account. They get a free account. You both win.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Separator />
      {/* When Your Employer Also Uses OnRopePro */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Good alone. Unstoppable together.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your tech account is valuable on its own. But when your employer also uses OnRopePro, everything changes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Without Employer on OnRopePro */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-slate-100 dark:bg-slate-800 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">WITHOUT employer on OnRopePro</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div className="space-y-2 text-base text-muted-foreground">
                  <p>You log hours manually (or photograph your logbook pages to import)</p>
                  <p>You enter building names, heights, and tasks yourself</p>
                  <p>You track your own certification dates</p>
                  <p>You manage your own document storage</p>
                  <p>Onboarding with new employers = standard paperwork</p>
                </div>
              </CardContent>
            </Card>

            {/* With Employer on OnRopePro */}
            <Card className="overflow-hidden border-2 border-[#AB4521]">
              <CardHeader className="bg-[#AB4521]/10 border-b border-[#AB4521]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#AB4521]/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-[#AB4521]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">WITH employer on OnRopePro</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div className="space-y-2 text-base text-muted-foreground">
                  <p>Hours log <strong className="text-foreground">automatically</strong> when you clock in/out</p>
                  <p>Building address, height, tasks, and duration captured without you lifting a finger</p>
                  <p>Your logbook data accumulates in the background while you work</p>
                  <p>Safety documents pushed to you automatically-sign once, done</p>
                  <p>Harness inspections tracked and credited to your safety rating</p>
                  <p>New employer onboarding = <strong className="text-foreground">10 seconds, not 60 minutes</strong></p>
                  <p>If employer adds a new safety procedure, you sign it before accessing your dashboard-automatic compliance</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* The Math */}
          <Card className="border-2 border-[#AB4521]/30 bg-[#AB4521]/5">
            <CardHeader className="border-b border-[#AB4521]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#AB4521]/20 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-[#AB4521]" />
                </div>
                <CardTitle className="text-xl">The Math</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="font-medium text-foreground">Manual logging:</p>
                  <p className="text-muted-foreground">5-10 minutes per day tracking your own work = 20-40 hours per year</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Automatic logging:</p>
                  <p className="text-muted-foreground">0 minutes. It just happens.</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-[#AB4521] text-center pt-4 border-t">
                At $50/hour, that's $1,000-2,000 worth of your time back every year.
              </p>
            </CardContent>
          </Card>

          {/* What This Means For You */}
          <div className="mt-8 space-y-4 text-center">
            <p className="text-lg text-muted-foreground">
              Your account works great standalone. Import your history, store your certs, access the job board.
            </p>
            <p className="text-lg text-muted-foreground">
              But the real magic happens when your employer joins too. Everything becomes automatic. Your professional history builds itself while you focus on the work.
            </p>
            <p className="text-base font-medium text-foreground mt-6">
              Already have an account? Tell your employer about OnRopePro. When they adopt it, your account levels up instantly.
            </p>
          </div>
        </div>
      </section>
      <Separator />
      {/* Import Your Existing Logbook */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Years of work history. Uploaded in minutes.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              You've got a physical logbook with hundreds of entries. Maybe thousands. Starting from scratch isn't an option.
            </p>
          </div>
          
          <Card className="border-2 border-[#AB4521]/30">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#AB4521]/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-[#AB4521]" />
                </div>
                <CardTitle className="text-xl">Here's how it works:</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#AB4521] text-white flex items-center justify-center shrink-0 font-bold">1</div>
                  <p className="text-base text-muted-foreground pt-1">Open the app</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#AB4521] text-white flex items-center justify-center shrink-0 font-bold">2</div>
                  <p className="text-base text-muted-foreground pt-1">Photograph your logbook pages</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#AB4521] text-white flex items-center justify-center shrink-0 font-bold">3</div>
                  <p className="text-base text-muted-foreground pt-1">The app reads your handwriting and extracts the data</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#AB4521] text-white flex items-center justify-center shrink-0 font-bold">4</div>
                  <p className="text-base text-muted-foreground pt-1">Review the import, confirm accuracy</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#AB4521] text-white flex items-center justify-center shrink-0 font-bold">5</div>
                  <p className="text-base text-muted-foreground pt-1">Your historical hours are now in your digital profile</p>
                </div>
              </div>
              <p className="text-base text-muted-foreground mt-6">
                No manual data entry. No retyping years of work. Just point, shoot, and import.
              </p>
            </CardContent>
          </Card>

          <p className="text-center text-lg font-medium text-foreground mt-8">
            Your past work matters. We made it easy to bring it with you.
          </p>
        </div>
      </section>
      <Separator />
      {/* Segment-Specific Value Blocks */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Career Climbers */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-amber-50 dark:bg-amber-950 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <CardTitle className="text-xl">For Career Climbers</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-lg font-medium text-foreground italic">
                "I need 1,000 hours for L2. I think I'm at 850. Maybe 1,050. I don't actually know."
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    The Problem
                  </h4>
                  <p className="text-base text-muted-foreground">
                    Your L2 depends on accurate hours. Your L3 depends on accurate hours. Your entire progression from $35/hour to $75/hour depends on documentation you're reconstructing from memory.
                  </p>
                  <p className="text-base text-muted-foreground">
                    43% of techs have had certification issues tied to incomplete logbook records. One assessor flag. One rejected application. Months of wasted time.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    The Solution
                  </h4>
                  <p className="text-base text-muted-foreground">
                    Every drop. Every building. Every hour. Logged automatically, timestamped, and exportable. When you sit down to fill your physical IRATA logbook-which you still need to do-you're copying accurate data instead of guessing.
                  </p>
                  <p className="text-base font-medium text-foreground">
                    You still keep your physical logbook. That's required. OnRopePro just makes sure what goes in it is right.
                  </p>
                </div>
              </div>
              
              <Card className="bg-slate-50 dark:bg-slate-800 border-0">
                <CardContent className="p-4">
                  <p className="text-base italic text-muted-foreground">
                    "I passed my L2 audit with 1,247 documented hours. Every single one of them verified in my export."
                  </p>
                  <p className="text-sm font-medium text-foreground mt-2">- Jake M., L2 IRATA, Vancouver</p>
                </CardContent>
              </Card>
              
              <div className="flex justify-center">
                <Button 
                  className="bg-[#AB4521] hover:bg-[#8B371A] text-white" 
                  onClick={() => setShowRegistration(true)}
                  data-testid="button-career-climbers-cta"
                >
                  Create Free Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Employer Hustlers */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-violet-50 dark:bg-violet-950 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-violet-600" />
                </div>
                <CardTitle className="text-xl">For Multi-Employer Hustlers</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-lg font-medium text-foreground italic">
                "I work for 3 companies. That's 3 timesheets, 3 sets of paperwork, 3 logins. Every week."
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-violet-500" />
                    The Problem
                  </h4>
                  <p className="text-base text-muted-foreground">
                    You've built a portfolio career-main employer plus side gigs, maximizing your hourly rate. Smart. But every employer means separate onboarding, separate paperwork, and no unified view of your total hours.
                  </p>
                  <p className="text-base text-muted-foreground">
                    You're losing 4-6 hours per month to administrative chaos. At $50/hour, that's $3,000/year in unpaid time.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    The Solution
                  </h4>
                  <p className="text-base text-muted-foreground">
                    One profile. Multiple employer connections. Each employer sees what you share-nothing more, nothing less. Hours logged separately by company. Your aggregate career data always accessible.
                  </p>
                  <p className="text-base font-medium text-foreground">
                    PLUS accounts connect to unlimited employers. One referral unlocks it.
                  </p>
                </div>
              </div>
              
              <Card className="bg-slate-50 dark:bg-slate-800 border-0">
                <CardContent className="p-4">
                  <p className="text-base italic text-muted-foreground">
                    "I added my third employer in 10 seconds. Same profile, same certifications, separate time tracking."
                  </p>
                  <p className="text-sm font-medium text-foreground mt-2">- Marcus C., L3 IRATA, Toronto</p>
                </CardContent>
              </Card>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  className="bg-[#AB4521] hover:bg-[#8B371A] text-white" 
                  onClick={() => setShowRegistration(true)}
                  data-testid="button-hustlers-cta"
                >
                  Create Free Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowRegistration(true)}
                  data-testid="button-hustlers-plus"
                >
                  Upgrade to PLUS with 1 Referral
                  <Share2 className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Freedom Seekers */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-teal-50 dark:bg-teal-950 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-teal-600" />
                </div>
                <CardTitle className="text-xl">For Freedom Seekers</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-lg font-medium text-foreground italic">
                "I worked Vancouver, Calgary, and Seattle this year. Every job = starting from zero credibility."
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-teal-500" />
                    The Problem
                  </h4>
                  <p className="text-base text-muted-foreground">
                    You're not flaky. You're mobile. But every new city means proving yourself again. References 2,000 miles away. No local reputation. Three hours of paperwork before your first shift.
                  </p>
                  <p className="text-base text-muted-foreground">
                    You need to start earning NOW, not after a week of bureaucratic onboarding.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    The Solution
                  </h4>
                  <p className="text-base text-muted-foreground">
                    Your professional identity travels with you. Your work history from Vancouver? Visible in Seattle. Your certifications? Pre-verified. Your safety rating? Proof you're reliable before you even show up.
                  </p>
                  <p className="text-base font-medium text-foreground">
                    Quit Friday in one city. Start Monday in another. Zero paperwork.
                  </p>
                </div>
              </div>
              
              <Card className="bg-slate-50 dark:bg-slate-800 border-0">
                <CardContent className="p-4">
                  <p className="text-base italic text-muted-foreground">
                    "I showed up in Toronto with nothing but my gear and my OnRopePro profile. Started working that afternoon."
                  </p>
                  <p className="text-sm font-medium text-foreground mt-2">- Lena B., L2 IRATA, Nomadic</p>
                </CardContent>
              </Card>
              
              <div className="flex justify-center">
                <Button 
                  className="bg-[#AB4521] hover:bg-[#8B371A] text-white" 
                  onClick={() => setShowRegistration(true)}
                  data-testid="button-freedom-seekers-cta"
                >
                  Create Free Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              30 seconds to set up. 10 years of protected career data.
            </h2>
          </div>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#AB4521] text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Create Your Account</h3>
                <p className="text-base text-muted-foreground">
                  Enter your IRATA or SPRAT license number. Add your certifications. Upload your photo. Done.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#AB4521] text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Connect With Employers</h3>
                <p className="text-base text-muted-foreground">
                  When you join a company using OnRopePro, they send an invitation. Accept it. Your profile populates their system instantly. No forms. No redundant data entry.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#AB4521] text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Work. Everything Logs Automatically.</h3>
                <p className="text-base text-muted-foreground">
                  When connected to an employer on OnRopePro, every work session captures: date, building, height, tasks, duration. Grouped by project. Totaled by month and year.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#AB4521] text-white flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Export and Fill Your Physical Logbook</h3>
                <p className="text-base text-muted-foreground">
                  Download your complete work history as PDF or CSV. Transfer accurate data into your physical IRATA/SPRAT logbook. Your assessor still checks your physical book-OnRopePro just makes sure the data in it is correct.
                </p>
              </div>
            </div>
          </div>
          
          <Card className="mt-8 bg-slate-50 dark:bg-slate-800 border-0">
            <CardContent className="p-6">
              <p className="text-base text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Your account works even without an employer on the platform. You can store certifications, track history manually, and access the job board (PLUS). But when your employer also uses OnRopePro? Everything supercharges-automatic hour tracking, instant onboarding, seamless documentation.
              </p>
              <p className="text-base font-medium text-[#AB4521] mt-3">
                Tell your boss to check it out. You both win.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <Separator />
      {/* Important Clarifications Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <CardTitle className="text-xl">THIS DOES NOT REPLACE YOUR PHYSICAL LOGBOOK</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base text-amber-900 dark:text-amber-100">
                <strong>Your IRATA/SPRAT physical logbook is still required.</strong> OnRopePro is a digital assistant that gives you accurate data to transfer into your official logbook-it does not replace it.
              </p>
              <p className="text-base text-amber-900 dark:text-amber-100">
                IRATA and SPRAT certification bodies require you to maintain your physical logbook. That requirement hasn't changed. What has changed is how accurate your entries can be.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white dark:bg-amber-900 rounded-lg p-4">
                  <p className="font-medium text-foreground">Before:</p>
                  <p className="text-muted-foreground">You guess at hours and details when filling your logbook weeks later</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded-lg p-4">
                  <p className="font-medium text-foreground">After:</p>
                  <p className="text-muted-foreground">You copy precise, timestamped data from OnRopePro into your logbook</p>
                </div>
              </div>
              
              <p className="text-base text-amber-900 dark:text-amber-100">
                Your assessor still checks your physical book. OnRopePro just makes sure the data in that book is right.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#AB4521]" />
                  <CardTitle className="text-lg">Your data. Your control.</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Export anytime. No lock-in.
                </p>
                <p className="text-base text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Delete your account anytime. Your data goes with you.
                </p>
                <p className="text-base text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Employers see only what you choose to share.
                </p>
                <p className="text-base text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Your SIN is optional. Refusing won't limit your account.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#AB4521]" />
                  <CardTitle className="text-lg">Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">
                  Banking details and sensitive data encrypted using AES-256-GCM.
                </p>
                <p className="text-base text-muted-foreground">
                  SOC2 Type II compliant.
                </p>
                <p className="text-base text-muted-foreground">
                  PIPEDA compliant.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Social Proof Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              500+ rope access techs across North America
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-50 dark:bg-slate-800 border-0">
              <CardContent className="p-6">
                <p className="text-base italic text-muted-foreground">
                  "I almost lost 187 hours when Skyline Rope Access folded. Those hours are still in my OnRopePro account. Portable, protected, mine."
                </p>
                <p className="text-sm font-medium text-foreground mt-4">- Tyler R., L2 IRATA, Calgary</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 dark:bg-slate-800 border-0">
              <CardContent className="p-6">
                <p className="text-base italic text-muted-foreground">
                  "Switched employers twice this year. Total onboarding time: under 5 minutes. Combined."
                </p>
                <p className="text-sm font-medium text-foreground mt-4">- Sarah K., L3 IRATA, Toronto</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 dark:bg-slate-800 border-0">
              <CardContent className="p-6">
                <p className="text-base italic text-muted-foreground">
                  "I'm not good with apps. But this one? I log a building in 10 seconds between drops. A year later, I have perfect records."
                </p>
                <p className="text-sm font-medium text-foreground mt-4">- Mike D., L1 SPRAT, Vancouver</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 dark:bg-slate-800 border-0">
              <CardContent className="p-6">
                <p className="text-base italic text-muted-foreground">
                  "Finally something built for techs, not for employers pretending to care about techs."
                </p>
                <p className="text-sm font-medium text-foreground mt-4">- Jordan L., L2 IRATA, Seattle</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Separator />
      {/* PLUS Upgrade Path Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Unlock PLUS. Pay nothing. Here's how.
            </h2>
          </div>
          
          <Card className="border-2 border-[#AB4521]">
            <CardContent className="p-8 space-y-6">
              <p className="text-lg text-center text-muted-foreground">
                PLUS accounts are free. Not "free trial." Not "free for 30 days." <strong className="text-foreground">Actually free.</strong>
              </p>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-xl text-center">How it works:</h3>
                <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#AB4521] text-white flex items-center justify-center font-bold">1</div>
                    <span className="text-base">Create your free account</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#AB4521] text-white flex items-center justify-center font-bold">2</div>
                    <span className="text-base">Refer one other rope tech</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#AB4521] text-white flex items-center justify-center font-bold">3</div>
                    <span className="text-base">You get upgraded automatically</span>
                  </div>
                </div>
              </div>
              
              <p className="text-center font-medium text-[#AB4521]">
                That's it. One referral. Lifetime PLUS access for you.
              </p>
              
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-foreground mb-2">Why we do this</h4>
                <p className="text-base text-muted-foreground">
                  Technicians ARE the network. The more techs on OnRopePro, the more employers adopt it. The more employers adopt it, the more valuable your profile becomes.
                </p>
                <p className="text-base font-medium text-foreground mt-2">
                  You're not the product. You're the reason the platform exists.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* FAQ Section */}
      <section id="faqs" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently Asked Questions
            </h2>
          </div>
          
          <Accordion type="multiple" value={faqOpen} onValueChange={setFaqOpen} className="space-y-3">
            <AccordionItem value="faq-1" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-1">
                Is the tech account really free?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                Yes. Free forever. No credit card required. No time limits. No feature restrictions that suddenly lock you out.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-2">
                What if my employer doesn't use OnRopePro?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4 space-y-3">
                <p>Your account still works. You can:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Store certifications and profile data</li>
                  <li>Import your existing logbook via photo</li>
                  <li>Log hours manually</li>
                  <li>Access the job board (PLUS)</li>
                </ul>
                <p>What you won't get is automatic hour tracking-that only works when your employer is also on the platform. But here's the thing: when your employer joins, your account instantly upgrades. All that manual logging becomes automatic. Tell your boss.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-3">
                How do I import my existing logbook?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                Open the app, photograph your logbook pages, and the app reads your handwriting and extracts the data. Review, confirm, done. Years of historical hours imported in minutes-no manual data entry.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-4">
                Does this replace my IRATA/SPRAT logbook?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                <strong>No. You still need your physical logbook.</strong> IRATA and SPRAT require it. Your assessor will check it. OnRopePro is a digital assistant that captures accurate data so you can fill your physical logbook correctly-not a replacement for it.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-5">
                What's the difference between automatic and manual logging?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4 space-y-3">
                <p><strong className="text-foreground">Manual logging:</strong> You enter hours, buildings, and tasks yourself (or photograph your logbook to import). Works anytime, with or without an employer on the platform.</p>
                <p><strong className="text-foreground">Automatic logging:</strong> When your employer uses OnRopePro, your hours log automatically when you clock in/out. Building, height, tasks, duration-all captured without you entering anything. This is the real time-saver.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-6">
                What happens to my data if I leave a company?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                Your profile (certifications, work history, safety rating) stays with you permanently. Company-specific data (assigned gear, company documents) stays with that employer. Your core identity is always yours.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-7">
                How do I get PLUS?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                Refer one other technician who creates an account. You both get upgraded to PLUS automatically. No payment required.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-8">
                Is my data secure?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                AES-256-GCM encryption for all sensitive data. SOC2 Type II compliant infrastructure. PIPEDA compliant (Canada). Your SIN is completely optional.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-9">
                Can employers see that I'm looking for other work?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                No. Your job board activity is private. Employers see only what you explicitly share with them.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      {/* Final CTA Section - Stakeholder Colored */}
      <section className="py-16 md:py-20 px-4 text-white" style={{backgroundImage: `linear-gradient(135deg, ${TECHNICIAN_COLOR} 0%, ${TECHNICIAN_GRADIENT_END} 100%)`}}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Your hours outlive your employer.
          </h2>
          <p className="text-lg text-white/90">
            Companies fold. Supervisors quit. Paper gets lost. Spreadsheets corrupt.<br />
            But your career investment-the 500, 1,000, 2,000 hours you've worked at height-that should never disappear.
          </p>
          <p className="font-medium text-white">
            Create your account. Start building your portable professional identity. It's free. It's yours. Forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="bg-white hover:bg-orange-50" 
              style={{color: TECHNICIAN_COLOR}} 
              onClick={() => setShowRegistration(true)}
              data-testid="button-final-create-account"
            >
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/40 text-white hover:bg-white/10" 
              onClick={() => setShowRegistration(true)}
              data-testid="button-final-refer"
            >
              Refer a tech and unlock PLUS
              <UserPlus className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-white/80 pt-2">
            30 seconds, no credit card
          </p>
        </div>
      </section>
      {/* Footer - Dark Slate */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-8 object-contain brightness-0 invert" />
            <span className="text-sm">Management Software for Rope Access</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors" data-testid="link-footer-privacy">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors" data-testid="link-footer-terms">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>

      {/* Registration Modal */}
      <TechnicianRegistration 
        open={showRegistration} 
        onOpenChange={setShowRegistration} 
      />
    </div>
  );
}
