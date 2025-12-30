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
  ChevronRight,
  Upload,
  AlertTriangle
} from "lucide-react";

export default function PropertyManagerInterfaceLanding() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [timeSaved, setTimeSaved] = useState(0);
  const [dataPoints, setDataPoints] = useState(0);
  const [reportReduction, setReportReduction] = useState(0);
  const [dueDiligence, setDueDiligence] = useState(0);
  const { openLogin } = useAuthPortal();
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    let current1 = 0, current2 = 0, current3 = 0, current4 = 0;
    const target1 = 98;
    const target2 = 3;
    const target3 = 100;
    const target4 = 100;
    
    const interval = setInterval(() => {
      if (current1 < target1) { current1 += 2; setTimeSaved(Math.min(current1, target1)); }
      if (current2 < target2) { current2++; setDataPoints(Math.min(current2, target2)); }
      if (current3 < target3) { current3 += 2; setReportReduction(Math.min(current3, target3)); }
      if (current4 < target4) { current4 += 2; setDueDiligence(Math.min(current4, target4)); }
      
      if (current1 >= target1 && current2 >= target2 && current3 >= target3 && current4 >= target4) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="modules" />
      
      {/* Hero Section - Ocean Blue gradient per Module Landing Page Template */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              Property Manager Interface Module
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Your Vendors Have Safety Records.<br />
              <span className="text-blue-100">You Just Can't See Them.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Compare vendor safety ratings, track resident complaint response times, and document your due diligence.<br />
              <strong>All in one read-only dashboard designed specifically for property managers.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-hero-trial">
                Start Your Free 60-Day Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={openLogin} data-testid="button-hero-signin">
                Sign In
              </Button>
            </div>
            
            <SoftwareReplaces 
              software={MODULE_SOFTWARE_MAPPING["property-manager-interface"]} 
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
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">{timeSaved}%</div>
                  <div className="text-base text-muted-foreground mt-1">Lookup time saved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">{dataPoints}x</div>
                  <div className="text-base text-muted-foreground mt-1">More data points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">{reportReduction}%</div>
                  <div className="text-base text-muted-foreground mt-1">Fewer report requests</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">{dueDiligence}%</div>
                  <div className="text-base text-muted-foreground mt-1">Due diligence documented</div>
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
            The Liability Gap Nobody Mentions
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                You hire rope access companies to clean windows, maintain facades, and service buildings 20 stories up.
              </p>
              <p>
                But when the insurance adjuster asks what due diligence you performed on your contractor's safety practices, what do you show them?
              </p>
              <p>
                Most property managers have nothing. You picked the vendor based on price, maybe a reference call, and hope they know what they're doing. Their safety record? A mystery. Their complaint response rate? Unknown. Whether they've kept up with equipment inspections? Complete blind spot.
              </p>
              <p className="font-medium text-foreground">
                Then something goes wrong.
              </p>
              <Separator className="my-6" />
              <p className="font-medium text-foreground text-lg">
                OnRopePro gives property managers direct visibility into vendor safety compliance without the administrative burden. See Company Safety Ratings. Track complaint resolution times. Compare vendors with objective data before you sign.
              </p>
              <p className="text-foreground">
                When someone asks "Did you verify this contractor?" you have documented proof.
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
            What This Module Does
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            Vendor transparency without vendor access. The Property Manager Interface provides read-only visibility into your rope access vendors' safety compliance and responsiveness.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: My Vendors Dashboard */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">My Vendors Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">Your central hub for every rope access company servicing your buildings.</p>
                <p>No more digging through contracts or emails to find who services what property.</p>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>All contracted rope access companies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>CSR scores per vendor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Quick access to building-level details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Search and filter by vendor or property</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 2: Company Safety Rating Visibility */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Company Safety Rating Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">Three compliance percentages tell you how seriously each vendor takes safety.</p>
                <p>Documentation completeness, toolbox meeting frequency, and harness inspection rates. You see the score, not the underlying documents.</p>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Documentation compliance percentage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Toolbox meeting completion rate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Harness inspection frequency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Historical trend direction</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3: Response Time and Feedback Tracking */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">Response Time and Feedback Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">When residents complain, does your vendor actually respond?</p>
                <p>Average resolution time and feedback history show you which vendors address issues and which ones ignore them.</p>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Average complaint resolution time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Feedback history per building</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Response rate by vendor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Issue patterns over time</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Stakeholder Benefits Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Benefits by Stakeholder
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            The Property Manager Interface creates value for everyone in the vendor relationship.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Property Managers */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6E9075] to-[#5A7A60]"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-[#6E9075]/10 flex items-center justify-center mb-3">
                  <Building2 className="w-6 h-6 text-[#6E9075]" />
                </div>
                <CardTitle className="text-xl">For Property Managers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Documented due diligence when it matters most.</p>
                  <p className="mt-1">When insurance adjusters or legal teams ask about your vendor vetting process, you have timestamped CSR scores and compliance data on record.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Instant vendor comparison beyond price.</p>
                  <p className="mt-1">Two vendors bid within $200 of each other. One has an 86% CSR score. The other sits at 23%. Now you have something real to base your decision on.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">One dashboard for your entire portfolio.</p>
                  <p className="mt-1">Fifty buildings. Six vendors. Instead of searching emails and contracts, you check one screen. Thirty seconds. Done.</p>
                </div>
              </CardContent>
            </Card>

            {/* Rope Access Company Owners */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">For Rope Access Company Owners</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Stop manually generating safety reports for property managers.</p>
                  <p className="mt-1">They ask quarterly. They lose the files. They ask again. With the Property Manager Interface, clients check your CSR score whenever they want.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Win contracts on safety, not just price.</p>
                  <p className="mt-1">Your 94% CSR score becomes a visible competitive advantage. Property managers comparing vendors see exactly where you stand before signing.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Control what property managers see.</p>
                  <p className="mt-1">Read-only access protects your operational data. They see compliance percentages, not individual documents. Transparency without exposure.</p>
                </div>
              </CardContent>
            </Card>

            {/* Building Managers */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-3">
                  <Home className="w-6 h-6 text-violet-600" />
                </div>
                <CardTitle className="text-xl">For Building Managers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Confidence in the contractors on your property.</p>
                  <p className="mt-1">Rope access work happens 200 feet above your tenants. CSR scores show you the safety compliance record of every contractor accessing your building.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Clear accountability for vendor performance.</p>
                  <p className="mt-1">Track feedback history and response times for your specific building. When complaints pile up without resolution, you have data to support the conversation.</p>
                </div>
              </CardContent>
            </Card>

            {/* Technicians & Residents */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">For Technicians & Residents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Technicians: Your company's professionalism speaks for itself.</p>
                  <p className="mt-1">When property managers see your employer's high CSR score, it reflects the safety practices you maintain every day. Good work becomes visible.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Residents: Transparency about who services your building.</p>
                  <p className="mt-1">Through the connected Resident Portal, tenants can see that their building contracts with safety-compliant vendors. The rope access company working on your home isn't a mystery.</p>
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
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            Six capabilities that transform how property managers evaluate and monitor rope access vendors.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">CSR Score Display</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                View the Company Safety Rating for every contracted vendor. Three compliance percentages combine into one clear picture. Compare vendors instantly without requesting a single document.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5 text-emerald-600" />
                </div>
                <CardTitle className="text-lg">Anchor Certificate Upload</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Your one write permission. Upload annual anchor inspection certificates directly to each building's record. Building owners often receive these from third-party inspectors, not vendors.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-2">
                  <Key className="w-5 h-5 text-amber-600" />
                </div>
                <CardTitle className="text-lg">Property Manager Code Access</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                One code from each vendor grants access. Create your account, enter the buildings you manage, and you're connected. The vendor sees who has linked. You see only your properties.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-violet-600" />
                </div>
                <CardTitle className="text-lg">Response Time Metrics</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                How long does your vendor take to address complaints? Average resolution time surfaces vendors who respond quickly and exposes those who don't. Now you see both.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center mb-2">
                  <History className="w-5 h-5 text-rose-600" />
                </div>
                <CardTitle className="text-lg">Building-Level Feedback History</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Every complaint and resolution for your buildings, visible in one place. Track patterns. Identify recurring issues. Document vendor performance over months and years.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center mb-2">
                  <Lock className="w-5 h-5 text-cyan-600" />
                </div>
                <CardTitle className="text-lg">Read-Only Data Protection</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                You see compliance percentages, not underlying documents. You view project progress, not employee details. The right visibility with the right boundaries.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Problems Solved Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Problems Solved
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            Real challenges. Real solutions.
          </p>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="problem-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <span className="font-medium">"I need to know if my vendors are actually following safety protocols."</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                <p className="mb-3">You hire a rope access company based on lowest bid. Six months later, a technician has an incident. Insurance asks what due diligence you performed on this vendor's safety record. You have nothing.</p>
                <p className="font-medium text-foreground">CSR scores show three compliance percentages updated automatically. Documentation completeness. Toolbox meeting frequency. Harness inspection rates. You see exactly where each vendor stands on safety, documented and timestamped.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="problem-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4">
                <div className="flex items-start gap-3">
                  <Search className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <span className="font-medium">"I manage 60 buildings with different vendors. Finding who services what takes forever."</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                <p className="mb-3">A resident complaint comes in about rope access work at the building on Oak Street. Which company services that property? You search emails. Check contracts. Maybe call the building manager. Twenty minutes later, you have an answer.</p>
                <p className="font-medium text-foreground">My Vendors Dashboard centralizes every contracted company. Click on a building. See the vendor. Access their CSR score and contact information. Thirty seconds replaces thirty minutes.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="problem-3" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
                  <span className="font-medium">"Vendors don't respond to complaints and I have no way to prove it."</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                <p className="mb-3">Residents report streaky windows. You forward the complaint. Nothing happens. They report again. You forward again. Did the vendor respond? Did they fix it? Did they even acknowledge the issue?</p>
                <p className="font-medium text-foreground">Feedback history per building tracks every complaint and resolution. Average response time reveals how long issues actually take to address. When vendor performance conversations happen, you have data, not assumptions.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="problem-4" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="font-medium">"Property managers keep asking for safety documentation and I waste hours responding."</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                <p className="mb-3">Three property managers request proof of current safety compliance in the same week. Your admin pulls documents, formats reports, emails everything out. Next quarter, they ask again. The same documents. The same process.</p>
                <p className="font-medium text-foreground">CSR scores update automatically. Property managers check compliance status whenever they want. Self-serve transparency eliminates the request cycle entirely.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Measurable Results Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Measurable Results
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                <div className="font-medium text-foreground mb-2">Reduction in vendor safety lookup time</div>
                <p className="text-sm text-muted-foreground">From 20-30 minutes searching emails and contracts to 30 seconds in the My Vendors Dashboard. For property managers handling 50+ buildings, this saves hours monthly.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-emerald-600 mb-2">3x</div>
                <div className="font-medium text-foreground mb-2">More data points for vendor comparison</div>
                <p className="text-sm text-muted-foreground">Price alone used to determine vendor selection. Now you compare price, CSR score, and response time. Objective data replaces gut feel and hope.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-amber-600 mb-2">100%</div>
                <div className="font-medium text-foreground mb-2">Documented due diligence at all times</div>
                <p className="text-sm text-muted-foreground">CSR scores create timestamped records of vendor safety compliance visibility. When insurance or legal questions arise, you have proof of ongoing monitoring.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-violet-600 mb-2">100%</div>
                <div className="font-medium text-foreground mb-2">Reduction in compliance report requests</div>
                <p className="text-sm text-muted-foreground">Property managers access CSR scores directly. No more quarterly email threads requesting safety documentation. Self-serve transparency replaces manual reporting.</p>
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

          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem value="faq-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4 font-medium">
                What can property managers actually edit in the system?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                One thing: anchor inspection certificates. You can upload annual anchor inspection certificates to each building you manage. Everything else is read-only. No risk of accidentally modifying operational records.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4 font-medium">
                Can I see individual safety documents from my vendors?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                No. You see CSR percentages indicating compliance levels, not the underlying documents. This provides transparency without exposing operational details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4 font-medium">
                How do I get access to the Property Manager Interface?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                Your rope access vendor provides a Property Manager Code. Use that code to create your account, then specify which buildings you manage. Access is granted at the building level.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4 font-medium">
                Can different property managers at my company see different buildings?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                Yes. Each property manager creates their own account and specifies which buildings they manage. You only see vendors and data relevant to your portfolio.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4 font-medium">
                What if I manage buildings serviced by multiple rope access companies?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                My Vendors Dashboard shows all contracted companies across your portfolio. You see every vendor relationship in one view, regardless of how many companies service your buildings.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4 font-medium">
                Can my vendors see that I've viewed their information?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                Vendors know which property managers have connected via their code. They cannot see when you log in or what specific information you view.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4 font-medium">
                How often are CSR scores updated?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                CSR scores update automatically as vendors log safety activities. You always see current compliance status, not quarterly snapshots.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4 font-medium">
                What's the difference between CSR score and response time? Which matters more?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                CSR measures safety compliance (documentation, toolbox meetings, harness inspections). Response time measures how quickly vendors address complaints. Many property managers care more about response time. You see both metrics.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4 font-medium">
                Can I upload documents other than anchor inspection certificates?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                No. The single write permission is specifically for annual anchor inspection certificates. This maintains data integrity while acknowledging that building owners often receive these third-party certificates directly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-10" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left py-4 font-medium">
                Is my data separated from other property managers at my company?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                Yes. Each property manager account sees only the buildings they specified during setup. Portfolio separation is built into the access model.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="my-0" />

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stop Managing Blind. Start Managing Informed.
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Log in and see every vendor's CSR score. Compare safety compliance before signing contracts. Track complaint resolution over time. When someone asks what due diligence you performed? You show them exactly what you saw.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-cta-trial">
              Start Your Free 60-Day Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-cta-demo">
              <Link href="/employer">
                Learn About All Modules
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-8 w-auto" />
            <span className="text-muted-foreground text-sm">Built for rope access. Built for you.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

      <EmployerRegistration open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
}
