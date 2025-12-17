import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import {
  Palette,
  CheckCircle2,
  ArrowRight,
  Building2,
  BookOpen,
  Briefcase,
  Home,
  HardHat,
  Globe,
  Clock,
  TrendingUp,
  Shield,
  Upload,
  Bell,
  Settings,
  FileText,
  Users,
  Calendar,
  Package,
  Smartphone,
  Zap,
  RefreshCw,
  DollarSign,
  Award,
  Target,
  ChevronsUpDown
} from "lucide-react";

export default function WhiteLabelBrandingLanding() {
  const [, setLocation] = useLocation();
  const [brandedTouchpoints, setBrandedTouchpoints] = useState(0);
  const [contractWinRate, setContractWinRate] = useState(0);
  const [adoptionRate, setAdoptionRate] = useState(0);
  const [setupMinutes, setSetupMinutes] = useState(0);
  
  const [expandedProblems, setExpandedProblems] = useState<string[]>([]);
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);

  const allProblemIds = ["employer-1", "employer-2", "employer-3", "employer-4", "employer-5", "ops-1", "ops-2", "tech-1", "tech-2", "bm-1", "bm-2", "resident-1"];
  const allFaqIds = ["faq-1", "faq-2", "faq-3", "faq-4", "faq-5", "faq-6", "faq-7", "faq-8", "faq-9", "faq-10", "faq-11", "faq-12"];

  const toggleAllProblems = () => {
    setExpandedProblems(expandedProblems.length === allProblemIds.length ? [] : [...allProblemIds]);
  };

  const toggleAllFaqs = () => {
    setExpandedFaqs(expandedFaqs.length === allFaqIds.length ? [] : [...allFaqIds]);
  };

  useEffect(() => {
    let currentTouchpoints = 0;
    let currentWinRate = 0;
    let currentAdoption = 0;
    let currentSetup = 15;
    
    const interval = setInterval(() => {
      if (currentTouchpoints < 100) { currentTouchpoints += 2; setBrandedTouchpoints(currentTouchpoints); }
      if (currentWinRate < 25) { currentWinRate += 1; setContractWinRate(currentWinRate); }
      if (currentAdoption < 85) { currentAdoption += 2; setAdoptionRate(currentAdoption); }
      if (currentSetup > 10) { currentSetup -= 1; setSetupMinutes(currentSetup); }
      
      if (currentTouchpoints >= 100 && currentWinRate >= 25 && currentAdoption >= 85 && currentSetup <= 10) {
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
              White-Label Branding Module
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Stop Reminding Clients<br />
              They Could Replace You<br />
              <span className="text-blue-100">Tomorrow.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Transform OnRopePro into your company's proprietary platform. Custom branding that turns "just another vendor" into "established partner with sophisticated systems."<br />
              <strong>Your brand. Your system. Their trust.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" asChild data-testid="button-hero-trial">
                <Link href="/register">
                  Start Your Free 60-Day Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-hero-faqs">
                <Link href="#faqs">
                  Find Answers
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
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">{brandedTouchpoints}%</div>
                  <div className="text-base text-muted-foreground mt-1">Client touchpoints branded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">+{contractWinRate}%</div>
                  <div className="text-base text-muted-foreground mt-1">Contract win rate increase</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">{adoptionRate}%</div>
                  <div className="text-base text-muted-foreground mt-1">Employee adoption rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">&lt;{setupMinutes}min</div>
                  <div className="text-base text-muted-foreground mt-1">Complete setup time</div>
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
            The Professional Credibility Gap
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                Every time a property manager logs into your portal and sees OnRopePro's logo, you've told them something you didn't mean to say.
              </p>
              <p className="text-base">
                You've told them you're using the same software as every other contractor bidding their buildings. You've told them they could switch providers without changing systems. You've told them you're interchangeable.
              </p>
              <p className="text-base">
                Landmark Properties manages 47 buildings across downtown Vancouver. They use five different rope access contractors for window cleaning and building maintenance. All five contractors use OnRopePro. All five portals look identical. When Landmark's operations manager pulls up work orders, she can't tell which contractor she's reviewing until she reads the project details.
              </p>
              <p className="text-base">
                Your competitors aren't just bidding against your price anymore. They're bidding against your entire operational appearance. The building maintenance company that lost the $180,000 Bentall Centre contract learned this the hard way. The property manager cited "more professional systems" as the deciding factor. The winning contractor used white-labeled software that looked like custom-built internal infrastructure.
              </p>
              <Separator className="my-6" />
              <p className="font-medium text-foreground text-lg">
                OnRopePro's White Label Branding eliminates the generic software problem entirely. Your logo. Your colors. Your professional image, reinforced at every single touchpoint where clients, employees, and building managers interact with your systems.
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
            Complete Brand Control Across Every Client Touchpoint
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            White Label Branding transforms OnRopePro from third-party software into what appears to be your proprietary management platform, creating professional credibility that wins contracts and justifies premium pricing.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Custom Visual Identity */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-3">
                  <Palette className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Custom Visual Identity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">Upload your company logo and select two brand colors.</p>
                <p>The system applies your branding instantly across the entire platform: navigation headers, buttons, progress bars, charts, notifications, and every client-facing element.</p>
                <p>Property managers and building managers see your brand identity in every interaction, not OnRopePro's.</p>
                <p className="font-medium text-foreground mt-4">What gets branded:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Platform headers and navigation throughout authenticated pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>All exported safety documents and compliance reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Email notifications sent to clients and employees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Mobile device icons when users add OnRopePro to home screens</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 2: Subscription-Protected Branding */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">Subscription-Protected Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">White label branding activates immediately when you subscribe.</p>
                <p>The system automatically reverts to default OnRopePro branding if your subscription expires.</p>
                <p>You receive 30-day, 7-day, and 1-day warning notifications before expiration to prevent surprise changes.</p>
                <p>Reactivate your subscription to restore your branded experience instantly.</p>
                <p className="font-medium text-foreground mt-4">What gets controlled:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Instant activation upon subscription payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Automatic warning notifications at 30, 7, and 1 day before expiration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Graceful reversion to default branding upon expiration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Instant restoration when subscription reactivates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3: Self-Service Brand Management */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <Settings className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Self-Service Brand Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">Access the dedicated Branding tab in your Profile settings.</p>
                <p>Upload new logos, adjust brand colors, and preview changes before applying them.</p>
                <p>Zero technical assistance required. Zero developer dependency.</p>
                <p>Upload PNG or JPG logos, select two brand colors from your brand guide, and watch your branding propagate instantly across the entire platform.</p>
                <p className="font-medium text-foreground mt-4">What gets simplified:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Logo uploads through simple file selector (PNG/JPG formats)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Two-color brand palette selection with hex code support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Instant preview before applying changes platform-wide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Immediate global propagation via CSS variable architecture</span>
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
            Who Benefits From This Module
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Five stakeholder types. Five different value propositions. One unified brand identity.
          </p>

          <div className="space-y-8">
            {/* For Employers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">For Employers (Company Owners)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Win contracts you're currently losing.</h4>
                    <p className="text-base text-muted-foreground">Building managers associate branded systems with operational sophistication.</p>
                    <p className="text-base text-muted-foreground">When you present branded project documentation, safety reports, and client portals while competitors show up with generic software, you've already established premium positioning before discussing price.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Protect client relationships.</h4>
                    <p className="text-base text-muted-foreground">When property managers access maintenance history through your branded portal for 12-18 months, they build muscle memory around your system.</p>
                    <p className="text-base text-muted-foreground">Switching to a competitor means learning new software interfaces, accessing unfamiliar portals, and losing workflow efficiency they've developed with your platform.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Justify premium pricing.</h4>
                    <p className="text-base text-muted-foreground">Companies using white-labeled OnRopePro report 15-25% higher contract win rates with commercial clients compared to competitors using obviously generic software.</p>
                    <p className="text-base text-muted-foreground">Your entire operation appears larger and more established than it actually is, supporting rates that reflect that positioning.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Operations Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">For Operations Managers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Reduce employee questions.</h4>
                    <p className="text-base text-muted-foreground">When your technicians and project supervisors log into work session tracking and safety documentation tools that display your company logo and colors, they immediately recognize this as your internal infrastructure.</p>
                    <p className="text-base text-muted-foreground">They stop asking whether this is a third-party platform or questioning why they're logging into someone else's software.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Present professional documentation.</h4>
                    <p className="text-base text-muted-foreground">Every safety report, incident documentation, and compliance certificate you export carries your company logo in the header.</p>
                    <p className="text-base text-muted-foreground">Building managers see professionally branded documents that reinforce your operational credibility rather than generic third-party forms that require explanation about which contractor completed the work.</p>
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
                  <CardTitle className="text-xl">For Technicians</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Know you're working for a professional operation.</h4>
                    <p className="text-base text-muted-foreground">When you receive your OnRopePro credentials and log in for the first time, the platform displays your employer's logo and brand colors throughout the interface.</p>
                    <p className="text-base text-muted-foreground">This isn't generic software shared across the industry. This is your company's system, reflecting the professionalism you expect from an established operator.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Add a professional app icon to your phone.</h4>
                    <p className="text-base text-muted-foreground">When you save OnRopePro to your mobile home screen, the icon displays your company's branded logo.</p>
                    <p className="text-base text-muted-foreground">Your device shows your employer's professional identity, not a generic third-party app icon. Small details like this reinforce that you're working for a company that invests in professional infrastructure.</p>
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
                    <h4 className="text-lg font-semibold text-foreground">Verify contractor identity instantly.</h4>
                    <p className="text-base text-muted-foreground">When your rope access contractor submits harness inspection reports, incident documentation, or compliance certificates, their company logo appears in the document header.</p>
                    <p className="text-base text-muted-foreground">You immediately confirm which contractor completed the work without cross-referencing project numbers or reading fine print to identify the service provider.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Trust contractors with professional systems.</h4>
                    <p className="text-base text-muted-foreground">Contractors using branded management platforms signal operational maturity and client focus.</p>
                    <p className="text-base text-muted-foreground">When maintenance documentation arrives with professional branding consistent across all submissions, you're seeing evidence of systematic operations rather than ad-hoc processes that suggest less reliable service delivery.</p>
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
                    <h4 className="text-lg font-semibold text-foreground">Evaluate contractor sophistication.</h4>
                    <p className="text-base text-muted-foreground">When contractors provide portal access for maintenance tracking, compliance monitoring, or resident communication, branded platforms indicate operational investment and professional infrastructure.</p>
                    <p className="text-base text-muted-foreground">Contractors presenting generic third-party software interfaces raise questions about their establishment level and long-term viability as service partners.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Reduce vendor management complexity.</h4>
                    <p className="text-base text-muted-foreground">After working with a contractor through their branded portal for 6-12 months, you develop workflow familiarity and visual recognition of their system.</p>
                    <p className="text-base text-muted-foreground">This brand equity creates friction against switching providers, protecting your relationship with reliable contractors and reducing the operational disruption of vendor transitions.</p>
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
            <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Key Features
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Six capabilities that transform how every stakeholder perceives your company's professionalism and operational maturity.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
                    <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Global Logo Propagation</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Your company logo displays automatically across all authenticated pages, navigation headers, and exported documents.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      Upload once, apply everywhere. Property managers see your brand in every portal login. Building managers see your logo on every safety report.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Two-Color Brand System</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Select your primary and secondary brand colors to propagate globally via CSS variables.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      Your brand colors replace OnRopePro's default blue/green scheme across 100% of the interface. This is your complete visual identity applied system-wide.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Branded PDF Exports</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Every safety document, compliance report, incident form, and inspection record exports with your company name and logo in the document header.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      External stakeholders receive professionally branded documentation that reinforces your identity with every submission.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Device-Level Brand Icons</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      When employees or clients add OnRopePro to their mobile home screens, the icon displays your company logo.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      Your brand appears at the device level, reinforcing professional identity every time users access the platform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Subscription-Protected Branding</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Branding activates instantly when you subscribe and automatically reverts to OnRopePro default if your subscription expires.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      Three warning notifications (30, 7, 1 day) before expiration. Reactivate to restore branded experience immediately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Instant Global Updates</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      When you update your logo or adjust brand colors, changes propagate instantly across the entire platform through CSS variable architecture.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      No page reloads required. No manual updates. Upload a new logo at 2pm and every user sees updated branding immediately.
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
            <h2 className="text-3xl md:text-4xl font-bold">
              Problems Solved
            </h2>
            <Button onClick={toggleAllProblems} variant="outline" data-testid="button-toggle-all-problems">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {expandedProblems.length === allProblemIds.length ? "Collapse All" : "Expand All"}
            </Button>
          </div>
          <p className="text-muted-foreground mb-12">
            Real problems. Real solutions. Organized by who you are.
          </p>

          <Accordion type="multiple" value={expandedProblems} onValueChange={setExpandedProblems} className="space-y-4">
            {/* For Employers */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <h3 className="text-xl md:text-2xl font-semibold">For Employers (Company Owners)</h3>
              </div>
              
              <AccordionItem value="employer-1" className="border rounded-lg px-4" data-testid="accordion-employer-1">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-base font-medium text-left">"We lost a $180,000 contract because they said our systems looked less professional."</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-base text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> Your professional capabilities match or exceed competitors, but property managers perceive you as less established based on software appearance.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> The property manager at Bentall Centre reviewed proposals from three contractors. All three had equivalent pricing and safety records. The winning contractor presented a branded client portal demonstrating "sophisticated internal systems." You presented OnRopePro with default branding.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> White Label Branding eliminates the professional credibility gap. Your client portals, project documentation, and safety reports display your brand identity throughout every touchpoint.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Property managers see proprietary systems that signal operational maturity, not generic software that suggests you're a smaller operation using shared platforms.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="employer-2" className="border rounded-lg px-4" data-testid="accordion-employer-2">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-base font-medium text-left">"Our employees keep asking why we're logging into someone else's software."</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-base text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> You've invested $250,000 building your company over five years. Your technicians see OnRopePro branding when they clock in, log safety inspections, and submit reports.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> Technicians question whether you're established enough to have internal systems. They wonder if this third-party platform will disappear next year, taking their logged certifications and work history with it.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> White Label Branding transforms employee perception from "external platform" to "company infrastructure." Your logo appears throughout the interface. Your brand colors replace default styling.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Employees log into your system, reinforcing that they work for an established operation. This perception shift affects recruitment credibility and employee confidence in long-term job stability.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="employer-3" className="border rounded-lg px-4" data-testid="accordion-employer-3">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-base font-medium text-left">"Building managers can't tell which contractor completed which work."</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-base text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> You service 23 buildings across downtown Calgary. Four of those buildings also use your two main competitors for supplementary maintenance work.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> When building managers file safety documentation, they have five different contractors' harness inspection reports. All five contractors use OnRopePro. All five sets of documents look identical except for project details buried in the body text.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> White Label Branding solves the identity confusion problem. Your company logo appears in the header of every exported safety document.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Building managers see your branded reports and immediately identify the contractor without reading project numbers. This brand recognition builds equity over repeated submissions.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="employer-4" className="border rounded-lg px-4" data-testid="accordion-employer-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-base font-medium text-left">"We're trying to sell our business but the valuation came in 30% lower than expected."</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-base text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> Your business broker brought three potential buyers to evaluate your rope access company. The buyers noted OnRopePro as "third-party software dependency."</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> They reduced valuation offers by 25-30% because you don't own any proprietary operational systems.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> White-labeled OnRopePro becomes a documented asset in your operational infrastructure. Buyers see branded systems that appear to be custom-built internal platforms.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> The business broker can position your "proprietary management software" as infrastructure that transitions with the sale. This perception shift changes how buyers value your operational maturity during acquisition negotiations.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="employer-5" className="border rounded-lg px-4" data-testid="accordion-employer-5">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-base font-medium text-left">"Our proposal lost to a competitor who had a 'more professional online portal.'"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-base text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> You submitted a competitive bid for annual window cleaning across a 12-building portfolio. Your pricing was 8% lower. Your safety record was superior.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> QuadReal Property Group selected your competitor because their "online client portal demonstrated more mature operational systems." You showed them OnRopePro with default branding. They showed them white-labeled software.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> White Label Branding levels the professional presentation playing field. Your client portal displays your company logo and brand colors throughout the interface.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Property managers comparing proposals see that you've invested in sophisticated operational infrastructure, not that you're using the same generic platform as smaller competitors.</p>
                </AccordionContent>
              </AccordionItem>
            </div>

            {/* For Operations Managers */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 pb-2 border-b">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <h3 className="text-xl md:text-2xl font-semibold">For Operations Managers</h3>
              </div>
              
              <AccordionItem value="ops-1" className="border rounded-lg px-4" data-testid="accordion-ops-1">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-base font-medium text-left">"I spend 20 minutes per week explaining that yes, we own our operational systems."</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-base text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> Every time you onboard a new technician, they ask why the time tracking system shows someone else's branding.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> Your project supervisors question whether work session logs and safety documentation will transfer if you switch platforms. You're repeatedly explaining that this is "your system" even though the visual evidence contradicts that claim.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> White Label Branding eliminates the explanation burden. New technicians see your company logo when they log their first work session. Your brand colors appear throughout project management interfaces.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Nobody questions whether this is your system because the visual evidence confirms ownership at every touchpoint. You reclaim 20 minutes per week currently spent on software ownership explanations.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ops-2" className="border rounded-lg px-4" data-testid="accordion-ops-2">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-base font-medium text-left">"Building managers call me to verify which contractor submitted safety reports."</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-base text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> You service buildings where three different rope access contractors submit harness inspection reports to the same building manager.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> All three contractors use OnRopePro. The building manager can't visually distinguish between contractors without reading project details. She calls you twice per month to verify "which contractor was working on the north facade last Tuesday."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> White Label Branding solves the documentation identity problem. Your company logo appears in the header of every exported safety document.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Building managers visually identify your reports without reading project numbers or calling for verification. This brand recognition reduces your incoming identity verification calls.</p>
                </AccordionContent>
              </AccordionItem>
            </div>

            {/* For Technicians */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 pb-2 border-b">
                <HardHat className="w-5 h-5 text-amber-500" />
                <h3 className="text-xl md:text-2xl font-semibold">For Technicians</h3>
              </div>
              
              <AccordionItem value="tech-1" className="border rounded-lg px-4" data-testid="accordion-tech-1">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-base font-medium text-left">"I'm not sure how long I'll work here. The company uses someone else's software."</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-base text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> You're evaluating long-term career prospects with your current employer. You've noticed they use third-party software for time tracking, project management, and safety documentation.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> The platforms display external company branding throughout every interface. This makes your employer appear to be a smaller operation without internal systems. You're questioning whether they're established enough to provide stable long-term employment.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> White Label Branding changes your perception of employer stability. When you log into work session tracking and safety tools that display your employer's logo and brand colors, you see evidence of operational investment.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> You're working for a company with sophisticated systems, not a small operation renting generic software. This perception shift affects your assessment of long-term career viability.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className="border rounded-lg px-4" data-testid="accordion-tech-2">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-base font-medium text-left">"When I show building managers my certifications, they ask if I work for OnRopePro."</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-base text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> Building managers request verification of your IRATA certifications before allowing you to work on their buildings. You log into OnRopePro on your phone to display your certification records.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> The building manager sees OnRopePro branding throughout the interface and asks "do you work for OnRopePro?" You have to explain that no, you work for Apex Window Systems, but your employer uses OnRopePro for certification tracking.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> White Label Branding eliminates the employer identity confusion. When you display your certifications to building managers, they see your employer's logo throughout the interface.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> The building manager immediately understands you work for Apex Window Systems and these are your employer's certification records. No explanation required. No confusion about which company employs you.</p>
                </AccordionContent>
              </AccordionItem>
            </div>

            {/* For Building Managers */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 pb-2 border-b">
                <Building2 className="w-5 h-5 text-violet-500" />
                <h3 className="text-xl md:text-2xl font-semibold">For Building Managers</h3>
              </div>
              
              <AccordionItem value="bm-1" className="border rounded-lg px-4" data-testid="accordion-bm-1">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-base font-medium text-left">"I receive safety reports from five different contractors and they all look identical."</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-base text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> Your building receives window cleaning and building maintenance services from multiple rope access contractors throughout the year.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> All contractors submit harness inspection reports using the same generic template format. When you file these documents or need to reference past work, you must read through project details to identify which contractor submitted which report.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> White Label Branding solves your documentation identification problem. Each contractor's safety reports display their company logo in the document header.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> You visually identify the service provider instantly without reading project details. When you need to pull last month's window cleaning incident report, you immediately recognize the contractor through their branded documentation.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="bm-2" className="border rounded-lg px-4" data-testid="accordion-bm-2">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-base font-medium text-left">"Generic software makes contractors appear less reliable."</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-base text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> Your property management firm requires building managers to evaluate contractor operational sophistication before approving them for major projects.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> When prospective contractors demonstrate their operational systems during evaluation meetings, you assess whether they have professional infrastructure. Contractors showing generic third-party software with external branding suggest less established operations.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> White Label Branding changes your contractor evaluation calculus. When contractors demonstrate their operational systems using white-labeled platforms, you see evidence of professional infrastructure and operational investment.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> The branded systems signal that this contractor has mature internal processes worthy of managing critical building maintenance. You're more comfortable approving them for major projects.</p>
                </AccordionContent>
              </AccordionItem>
            </div>

            {/* For Residents */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 pb-2 border-b">
                <Home className="w-5 h-5 text-rose-500" />
                <h3 className="text-xl md:text-2xl font-semibold">For Residents</h3>
              </div>
              
              <AccordionItem value="resident-1" className="border rounded-lg px-4" data-testid="accordion-resident-1">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-base font-medium text-left">"I don't know which company is accessing our building."</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-base text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> You receive automated notifications when maintenance contractors access your building for window cleaning or pressure washing work.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> The notifications display generic third-party software branding that doesn't help you identify which contractor is on-site. You're unsure whether this is your building's regular maintenance provider or a different contractor completing supplementary work.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> White Label Branding solves your contractor identification problem. Notifications display the contractor's company logo and brand colors.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> You immediately recognize whether this is your building's regular maintenance provider or a different service contractor. The branded notifications build familiarity over repeated interactions.</p>
                </AccordionContent>
              </AccordionItem>
            </div>
          </Accordion>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Measurable Results Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Measurable Results
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Concrete improvements you'll see from day one.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Time Savings: Identity Verification</h3>
                    <p className="text-base text-muted-foreground">
                      Building managers and property managers eliminate 2-4 hours per month previously spent on contractor identity verification, documentation review, and system explanation calls.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      For operations managers, this reclaims 20 minutes per week previously spent explaining software ownership to employees.
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
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Revenue Protection: Contract Win Rates</h3>
                    <p className="text-base text-muted-foreground">
                      Companies using white-labeled OnRopePro report 15-25% higher contract win rates with commercial clients compared to competitors using obviously generic software.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      White-label branding can be the deciding factor in contracts ranging from $30,000 annual agreements to $180,000 multi-building portfolios.
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
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Adoption Improvement: Employee Confidence</h3>
                    <p className="text-base text-muted-foreground">
                      Rope access companies report 40% to 85% employee adoption rates after implementing white-label branding, compared to 40% before branding activation.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      Technicians and project supervisors perceive branded systems as company infrastructure, increasing their willingness to invest time learning the system.
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
                    <Target className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Cost Reduction: Support Burden</h3>
                    <p className="text-base text-muted-foreground">
                      Operations managers eliminate repetitive software ownership explanation conversations that consume 20 minutes per week (17 hours per year).
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      Building manager verification calls decrease by 2-4 hours per month when branded documentation clearly identifies contractors.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Module Integrations Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Module Integration Points
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            White Label Branding integrates with eight OnRopePro modules to ensure your brand identity appears consistently across operational workflows, client interactions, and compliance documentation.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-base font-medium">Project Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">Project dashboards, work order interfaces, and client-facing portals display your company logo and brand colors.</p>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-muted-foreground">Your brand reinforces professional operations throughout the project lifecycle</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-base font-medium">Work Session & Time Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">Technician clock-in interfaces, work session logs, and time tracking dashboards apply your brand colors and logo placement.</p>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-muted-foreground">Employees see your branded interface confirming this is your internal system</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-sky-600" />
                  </div>
                  <CardTitle className="text-base font-medium">Safety & Compliance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">All exported safety documents inherit your white-label branding. Harness inspection reports, incident documentation, and certification records display your company name and logo.</p>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-muted-foreground">Building managers receive professionally branded safety documentation</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-base font-medium">Employee Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">Employee onboarding portals, certification tracking interfaces, and performance dashboards display your brand colors and logo placement.</p>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-muted-foreground">New technicians see your branded interface immediately establishing company ownership</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-base font-medium">Document Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">Document libraries, file sharing interfaces, and client-accessible document portals apply your brand identity.</p>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-muted-foreground">Building managers navigate your branded document management system</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <CardTitle className="text-base font-medium">Scheduling & Calendar</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">Calendar interfaces, shift scheduling views, and appointment management dashboards display your brand colors throughout interactive elements.</p>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-muted-foreground">Operations managers interact with your branded scheduling system</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <Home className="w-5 h-5 text-rose-600" />
                  </div>
                  <CardTitle className="text-base font-medium">Resident Portal</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">Resident-facing maintenance request forms, work notification interfaces, and communication portals apply your white-label branding.</p>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-muted-foreground">Building residents see your professional brand identity when submitting requests</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <Award className="w-5 h-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-base font-medium">Company Safety Rating (CSR)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">Safety performance dashboards, compliance tracking interfaces, and CSR calculation displays apply your brand colors.</p>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-muted-foreground">Prospective clients see your branded safety performance interface</span>
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
            Stop Competing on Price. Start Competing on Perception.
          </h2>
          
          <Card className="bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-base">
                Right now you're spending 4-6 hours per week managing the professional perception problems created by generic software branding. Your operations manager explains to technicians why "your system" displays someone else's logo. Your sales team apologizes to property managers for the "third-party platform" appearance during client portal demonstrations. Your building managers call to verify which contractor submitted which safety report.
              </p>
              <p className="text-base">
                Every generic OnRopePro logo a client sees is a reminder that you're using the same software as your competitors. Every default blue button is a signal that you haven't invested in professional systems. Every unbranded PDF export is a missed opportunity to build recognition equity with building managers who file hundreds of contractor documents per year.
              </p>
              <Separator className="my-6" />
              <p className="text-lg font-medium text-foreground">
                White Label Branding eliminates every single one of these perception problems instantly. Upload your logo. Select your brand colors. Your entire operational presentation transforms from "small contractor using shared software" to "established company with sophisticated internal systems."
              </p>
              <p className="text-base">
                You reclaim the 4-6 hours per week currently spent managing perception problems. You win the $30,000 to $180,000 contracts currently going to competitors with more professional presentation. You protect existing client relationships through increased switching costs created by branded workflow familiarity. You build recognition equity that influences contractor selection decisions across hundreds of building manager interactions per year.
              </p>
              <p className="text-lg font-medium text-foreground">
                Your brand becomes your competitive moat instead of your liability.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* FAQs Section */}
      <section id="faqs" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently Asked Questions
            </h2>
            <Button onClick={toggleAllFaqs} variant="outline" data-testid="button-toggle-all-faqs">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {expandedFaqs.length === allFaqIds.length ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          <Accordion type="multiple" value={expandedFaqs} onValueChange={setExpandedFaqs} className="space-y-3">
            <AccordionItem value="faq-1" className="border rounded-lg px-4" data-testid="accordion-faq-1">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-base font-medium text-left">Does white-label branding affect any module functionality?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                No. Branding changes only visual elements (logos, colors, PDF headers). All OnRopePro capabilities, workflows, and integrations function identically regardless of branding status. Your team's operational processes remain unchanged.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4" data-testid="accordion-faq-2">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-base font-medium text-left">Can I preview branding changes before applying them to the live platform?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Not currently. Logo uploads and color selections apply immediately platform-wide. Best practice: Update branding during off-peak hours (evenings, weekends) when fewer employees and clients actively use the system. Most companies finalize branding within 2-3 adjustment attempts.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4" data-testid="accordion-faq-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-base font-medium text-left">What happens to our branding if our subscription expires?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                The system automatically reverts to OnRopePro default branding immediately upon subscription expiration. You receive three warning notifications (30 days, 7 days, 1 day before expiration) to prevent surprise changes. Reactivate your subscription to restore branded experience instantly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4" data-testid="accordion-faq-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-base font-medium text-left">Will clients know we're using OnRopePro?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Client-facing elements display only your branding. OnRopePro attribution appears only in footer copyright notices (industry standard for white-label platforms). Building managers, property managers, and residents interact exclusively with your branded experience throughout portals, notifications, and documentation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4" data-testid="accordion-faq-5">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-base font-medium text-left">Can we use custom domain names like portal.ourcompany.com?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Not currently. Custom domain mapping is not included in current White Label Branding. All access remains through onropepro.com URLs regardless of branding status. This may be added in future versions based on customer demand.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4" data-testid="accordion-faq-6">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-base font-medium text-left">How long does it take to set up white-label branding?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Complete setup requires under 10 minutes: subscribe to Professional plan or higher (2 minutes), upload company logo (1 minute), select two brand colors (2 minutes), verify appearance across sample interfaces (5 minutes). Branding activates instantly after configuration.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4" data-testid="accordion-faq-7">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-base font-medium text-left">What file formats do you support for logo uploads?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                PNG and JPG formats only. Recommended dimensions: 300x100 pixels minimum for clear display across headers and mobile interfaces. Maximum file size: 2MB. The system rejects uploads that don't meet format or size requirements.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4" data-testid="accordion-faq-8">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-base font-medium text-left">Can we change our branding after it's set up?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Yes. Access the Branding tab in Profile settings anytime to upload new logos or adjust brand colors. Changes propagate instantly platform-wide with no waiting period or approval required. Update frequency is unlimited for active subscribers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4" data-testid="accordion-faq-9">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-base font-medium text-left">Does white-label branding work on mobile devices?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Yes. Logo and brand colors display across all device types: desktop browsers, tablets, and smartphones. When users add OnRopePro to their mobile home screens, the app icon displays your company logo instead of generic OnRopePro branding. Full branded experience across every device.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-10" className="border rounded-lg px-4" data-testid="accordion-faq-10">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-base font-medium text-left">What if our company rebrands with new colors or logo?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Update your branding through the Profile, Branding tab. Upload your new logo and select updated brand colors. Changes apply instantly across the entire platform, all employee accounts, and all client-facing portals. No technical support needed. No downtime. No additional fees.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-11" className="border rounded-lg px-4" data-testid="accordion-faq-11">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-base font-medium text-left">Can multiple people in our company manage branding settings?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Only users with Owner or Admin permissions can access branding settings. This permission restriction prevents unauthorized branding changes by project supervisors or technicians. Grant Admin permissions to your operations manager or marketing team member if you want them to manage branding independently.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-12" className="border rounded-lg px-4" data-testid="accordion-faq-12">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-base font-medium text-left">Is there a limit to how many times we can change our branding?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                No limits. Update logos and colors as frequently as needed at no additional cost. Most companies update branding once during initial setup and rarely change it afterward unless they rebrand the company. Seasonal color adjustments (holiday themes, awareness campaigns) are supported if desired.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-r from-[#0B64A3] to-[#0369A1] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Professional Presence?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the rope access companies who have already elevated their brand presence. Start your 60-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" asChild data-testid="button-final-cta">
              <Link href="/register">
                Start Your Free 60-Day Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-final-changelog">
              <Link href="/changelog/branding">
                View Documentation
                <BookOpen className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
