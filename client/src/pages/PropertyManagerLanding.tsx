import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  ArrowRight, 
  Globe, 
  Shield,
  Eye,
  Clock, 
  CheckCircle2,
  Users,
  Building2,
  Wrench,
  Home,
  Briefcase,
  FileUp,
  Key,
  Timer,
  History,
  Lock,
  BookOpen,
  ChevronsUpDown,
  Zap,
  TrendingUp,
  ShieldCheck,
  FileX,
  Link as LinkIcon,
  Crown,
} from "lucide-react";
import { Link } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

const ALL_ACCORDION_ITEMS = [
  "pm-1", "pm-2", "pm-3", "owner-1", "owner-2", "bm-1"
];

export default function PropertyManagerLanding() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const allExpanded = openItems.length === ALL_ACCORDION_ITEMS.length;

  const toggleAll = () => {
    setOpenItems(allExpanded ? [] : [...ALL_ACCORDION_ITEMS]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader />
      
      {/* Hero Section - Following Module Landing Page Hero Template */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-pm-module">
              Property Manager Interface
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Your Vendors Have Safety Records.<br />
              <span className="text-blue-100">You Just Can't See Them.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Compare vendor safety ratings, track complaint response times, and document your due diligence.<br />
              <strong>All in one read-only dashboard designed specifically for property managers.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" asChild>
                <Link href="/register" data-testid="button-start-trial-hero">
                  Start Your Free 60-Day Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
                <Link href="#how-it-works" data-testid="button-learn-more">
                  Learn How It Works
                  <BookOpen className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Wave Separator */}
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
                <div className="text-center" data-testid="stat-time-savings">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">98%</div>
                  <div className="text-sm text-muted-foreground mt-1">Time Savings</div>
                </div>
                <div className="text-center" data-testid="stat-data-points">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">3x</div>
                  <div className="text-sm text-muted-foreground mt-1">More Data Points</div>
                </div>
                <div className="text-center" data-testid="stat-documented">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">100%</div>
                  <div className="text-sm text-muted-foreground mt-1">Documented</div>
                </div>
                <div className="text-center" data-testid="stat-updates">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">Real-Time</div>
                  <div className="text-sm text-muted-foreground mt-1">CSR Updates</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
          The Liability Gap Nobody Mentions
        </h2>
        
        <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
          <p>
            You hire rope access companies to clean windows, maintain facades, and service buildings 20 stories up. But when the insurance adjuster asks what due diligence you performed on your contractor's safety practices, what do you show them?
          </p>
          <p>
            Most property managers have nothing. You picked the vendor based on price, maybe a reference call, and hope they know what they're doing. Their safety record? A mystery. Their complaint response rate? Unknown. Whether they've kept up with equipment inspections? Complete blind spot.
          </p>
          <p>
            Then something goes wrong.
          </p>
          <p className="font-medium text-foreground">
            OnRopePro gives property managers direct visibility into vendor safety compliance without the administrative burden. See Company Safety Ratings. Track complaint resolution times. Compare vendors with objective data before you sign. When someone asks "Did you verify this contractor?" you have documented proof.
          </p>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* What This Module Does Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto" id="how-it-works">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          What This Module Does
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          Vendor transparency without vendor access
        </p>
        <p className="text-base text-muted-foreground leading-relaxed mb-8 text-center max-w-3xl mx-auto">
          The Property Manager Interface provides read-only visibility into your rope access vendors' safety compliance and responsiveness. You see what matters. You control nothing that isn't yours.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: My Vendors Dashboard */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-950 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">My Vendors Dashboard</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <p className="text-base text-muted-foreground">
                Your central hub for every rope access company servicing your buildings. No more digging through contracts or emails to find who services what property.
              </p>
              <p className="text-base font-medium text-foreground">What you see at a glance:</p>
              <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground ml-2">
                <li>All contracted rope access companies</li>
                <li>CSR (Company Safety Rating) scores per vendor</li>
                <li>Quick access to building-level details</li>
                <li>Search and filter by vendor or property</li>
              </ul>
            </CardContent>
          </Card>

          {/* Card 2: Company Safety Rating Visibility */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-950 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Company Safety Rating Visibility</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <p className="text-base text-muted-foreground">
                Three compliance percentages tell you how seriously each vendor takes safety: documentation completeness, toolbox meeting frequency, and harness inspection rates. You see the score, not the underlying documents.
              </p>
              <p className="text-base font-medium text-foreground">What the rating reveals:</p>
              <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground ml-2">
                <li>Documentation compliance percentage</li>
                <li>Toolbox meeting completion rate</li>
                <li>Harness inspection frequency</li>
                <li>Historical trend direction (improving or declining)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Card 3: Response Time and Feedback Tracking */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-950 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Response Time and Feedback Tracking</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <p className="text-base text-muted-foreground">
                When residents complain about streaky windows or missed spots, does your vendor actually respond? Average resolution time and feedback history show you which vendors address issues and which ones ignore them.
              </p>
              <p className="text-base font-medium text-foreground">What you track:</p>
              <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground ml-2">
                <li>Average complaint resolution time</li>
                <li>Feedback history per building</li>
                <li>Response rate by vendor</li>
                <li>Issue patterns over time</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Stakeholder Benefits Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Who Benefits From This Module
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Five stakeholder groups, each with tailored visibility and value
          </p>

          <div className="space-y-8">
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
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Documented due diligence when it matters most.</h4>
                    <p className="text-base text-muted-foreground">
                      When insurance adjusters or legal teams ask about your vendor vetting process, you have timestamped CSR scores and compliance data on record. Not a folder full of promises. Actual data.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Instant vendor comparison beyond price.</h4>
                    <p className="text-base text-muted-foreground">
                      Two vendors bid within $200 of each other. One has an 86% CSR score. The other sits at 23%. Now you have something real to base your decision on besides lowest number wins.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">One dashboard for your entire portfolio.</h4>
                    <p className="text-base text-muted-foreground">
                      Fifty buildings. Six vendors. Instead of searching emails and contracts, you check one screen. Which company services that building on Main Street? Thirty seconds. Done.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Rope Access Company Owners */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">For Rope Access Company Owners (Primary Buyers)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Stop manually generating safety reports for property managers.</h4>
                    <p className="text-base text-muted-foreground">
                      They ask quarterly. They lose the files. They ask again. With the Property Manager Interface, clients check your CSR score whenever they want. No PDFs. No PowerPoints. No repeated email threads.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Win contracts on safety, not just price.</h4>
                    <p className="text-base text-muted-foreground">
                      Your 94% CSR score becomes a visible competitive advantage. Property managers comparing vendors see exactly where you stand before signing. Good safety practices finally pay off in contract decisions.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Control what property managers see.</h4>
                    <p className="text-base text-muted-foreground">
                      Read-only access protects your operational data. They see compliance percentages, not individual documents. They view project progress, not employee information. Transparency without exposure.
                    </p>
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
                    <h4 className="text-lg font-semibold text-foreground">Confidence in the contractors on your property.</h4>
                    <p className="text-base text-muted-foreground">
                      Rope access work happens 200 feet above your tenants. CSR scores show you the safety compliance record of every contractor accessing your building. Not just their marketing claims.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Clear accountability for vendor performance.</h4>
                    <p className="text-base text-muted-foreground">
                      Track feedback history and response times for your specific building. When complaints pile up without resolution, you have data to support the conversation.
                    </p>
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
                  <CardTitle className="text-xl">For Technicians</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">Your company's professionalism speaks for itself.</h4>
                  <p className="text-base text-muted-foreground">
                    When property managers see your employer's high CSR score, it reflects the safety practices you maintain every day. Good work becomes visible to the people approving contracts.
                  </p>
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
                  <CardTitle className="text-xl">For Residents</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">Transparency about who services your building.</h4>
                  <p className="text-base text-muted-foreground">
                    Through the connected Resident Portal, tenants can see that their building contracts with safety-compliant vendors. The rope access company working on your home isn't a mystery.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Key Features Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Key Features
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          Six capabilities that transform how property managers evaluate and monitor rope access vendors.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="text-lg font-semibold">CSR Score Display</h4>
              </div>
              <p className="text-base text-muted-foreground">
                View the Company Safety Rating for every contracted vendor. Three compliance percentages (documentation, toolbox meetings, harness inspections) combine into one clear picture of safety practices.
              </p>
              <p className="text-base text-muted-foreground">
                Compare vendors instantly without requesting a single document.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <FileUp className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold">Anchor Inspection Certificate Upload</h4>
              </div>
              <p className="text-base text-muted-foreground">
                Your one write permission. Upload annual anchor inspection certificates directly to each building's record. Building owners often receive these from third-party inspectors, not vendors.
              </p>
              <p className="text-base text-muted-foreground">
                Now they attach properly without handing documents to contractors.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <Key className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="text-lg font-semibold">Property Manager Code Access</h4>
              </div>
              <p className="text-base text-muted-foreground">
                One code from each vendor grants access. Create your account, enter the buildings you manage, and you're connected. The vendor sees who has linked.
              </p>
              <p className="text-base text-muted-foreground">
                You see only your properties.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                  <Timer className="w-5 h-5 text-violet-600" />
                </div>
                <h4 className="text-lg font-semibold">Response Time Metrics</h4>
              </div>
              <p className="text-base text-muted-foreground">
                How long does your vendor take to address complaints? Average resolution time surfaces vendors who respond quickly and exposes those who don't.
              </p>
              <p className="text-base text-muted-foreground">
                Response time may matter more to you than safety scores. Now you see both.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                  <History className="w-5 h-5 text-rose-600" />
                </div>
                <h4 className="text-lg font-semibold">Building-Level Feedback History</h4>
              </div>
              <p className="text-base text-muted-foreground">
                Every complaint and resolution for your buildings, visible in one place. Track patterns. Identify recurring issues.
              </p>
              <p className="text-base text-muted-foreground">
                Document vendor performance over months and years, not just recent memory.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-slate-600" />
                </div>
                <h4 className="text-lg font-semibold">Read-Only Data Protection</h4>
              </div>
              <p className="text-base text-muted-foreground">
                You see compliance percentages, not underlying documents. You view project progress, not employee personal details. You check feedback history, not financial data.
              </p>
              <p className="text-base text-muted-foreground">
                The right visibility with the right boundaries.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Problems Solved Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">Problems Solved</h2>
          <Button onClick={toggleAll} variant="outline" data-testid="button-toggle-all-accordions">
            <ChevronsUpDown className="w-4 h-4 mr-2" />
            {allExpanded ? "Collapse All" : "Expand All"}
          </Button>
        </div>

        {/* For Property Managers */}
        <div className="space-y-6 mb-10">
          <div className="flex items-center gap-3 pb-2 border-b">
            <Globe className="w-5 h-5 text-emerald-500" />
            <h3 className="text-xl md:text-2xl font-semibold">For Property Managers</h3>
          </div>
          
          <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
            <AccordionItem value="pm-1" className="border rounded-lg px-4" data-testid="accordion-pm-1">
              <AccordionTrigger className="text-left">
                "I need to know if my vendors are actually following safety protocols."
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground">
                <p>
                  You hire a rope access company based on lowest bid. Six months later, a technician has an incident. Insurance asks what due diligence you performed on this vendor's safety record. You have nothing. A phone reference from three years ago. Maybe a brochure.
                </p>
                <p>
                  CSR scores show three compliance percentages updated automatically. Documentation completeness. Toolbox meeting frequency. Harness inspection rates. You see exactly where each vendor stands on safety, documented and timestamped.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pm-2" className="border rounded-lg px-4" data-testid="accordion-pm-2">
              <AccordionTrigger className="text-left">
                "I manage 60 buildings with different vendors. Finding who services what takes forever."
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground">
                <p>
                  A resident complaint comes in about rope access work at the building on Oak Street. Which company services that property? You search emails. Check contracts. Maybe call the building manager. Twenty minutes later, you have an answer.
                </p>
                <p>
                  My Vendors Dashboard centralizes every contracted company. Click on a building. See the vendor. Access their CSR score and contact information. Thirty seconds replaces thirty minutes.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pm-3" className="border rounded-lg px-4" data-testid="accordion-pm-3">
              <AccordionTrigger className="text-left">
                "Vendors don't respond to complaints and I have no way to prove it."
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground">
                <p>
                  Residents report streaky windows. You forward the complaint. Nothing happens. They report again. You forward again. Did the vendor respond? Did they fix it? Did they even acknowledge the issue?
                </p>
                <p>
                  Feedback history per building tracks every complaint and resolution. Average response time reveals how long issues actually take to address. When vendor performance conversations happen, you have data, not assumptions.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* For Rope Access Company Owners */}
        <div className="space-y-6 mb-10">
          <div className="flex items-center gap-3 pb-2 border-b">
            <Crown className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl md:text-2xl font-semibold">For Rope Access Company Owners</h3>
          </div>
          
          <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
            <AccordionItem value="owner-1" className="border rounded-lg px-4" data-testid="accordion-owner-1">
              <AccordionTrigger className="text-left">
                "Property managers keep asking for safety documentation and I waste hours responding."
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground">
                <p>
                  Three property managers request proof of current safety compliance in the same week. Your admin pulls documents, formats reports, emails everything out. Next quarter, they ask again. The same documents. The same process.
                </p>
                <p>
                  CSR scores update automatically. Property managers check compliance status whenever they want. Self-serve transparency eliminates the request cycle entirely.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-2" className="border rounded-lg px-4" data-testid="accordion-owner-2">
              <AccordionTrigger className="text-left">
                "I want to show my safety record without giving clients access to our operational systems."
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground">
                <p>
                  You invest heavily in safety compliance. Equipment inspections. Training documentation. Toolbox meetings. But proving it to property managers means either manual reports or inappropriate system access.
                </p>
                <p>
                  The Property Manager Interface shows CSR percentages without exposing operational data. They see your professionalism. They don't see your payroll, employee details, or internal documents. Transparency with boundaries.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* For Building Managers */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b">
            <Building2 className="w-5 h-5 text-violet-500" />
            <h3 className="text-xl md:text-2xl font-semibold">For Building Managers</h3>
          </div>
          
          <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
            <AccordionItem value="bm-1" className="border rounded-lg px-4" data-testid="accordion-bm-1">
              <AccordionTrigger className="text-left">
                "I have no visibility into contractor safety practices for my property."
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base text-muted-foreground">
                <p>
                  Rope access technicians rappel down your building exterior every month. Their employer claims excellent safety practices. But you have no verification beyond their word. Until something goes wrong.
                </p>
                <p>
                  CSR scores provide independent visibility into contractor compliance. Documentation, toolbox meetings, equipment inspections. Objective data you can verify before an incident, not after.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Measurable Results Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Measurable Results
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                  <h4 className="font-semibold text-foreground mb-2">Time Savings</h4>
                  <p className="text-base text-muted-foreground">
                    From 20-30 minutes searching emails and contracts to 30 seconds in the My Vendors Dashboard. For property managers handling 50+ buildings, this saves hours monthly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-emerald-600 mt-1" />
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">3x</div>
                  <h4 className="font-semibold text-foreground mb-2">Decision Quality</h4>
                  <p className="text-base text-muted-foreground">
                    Price alone used to determine vendor selection. Now you compare price, CSR score, and response time. Objective data replaces gut feel and hope.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-amber-600 mt-1" />
                <div>
                  <div className="text-3xl font-bold text-amber-600 mb-2">Documented</div>
                  <h4 className="font-semibold text-foreground mb-2">Liability Protection</h4>
                  <p className="text-base text-muted-foreground">
                    CSR scores create timestamped records of vendor safety compliance visibility. When insurance or legal questions arise, you have proof of ongoing monitoring, not just initial vetting.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <FileX className="w-6 h-6 text-violet-600 mt-1" />
                <div>
                  <div className="text-3xl font-bold text-violet-600 mb-2">100%</div>
                  <h4 className="font-semibold text-foreground mb-2">Administrative Elimination</h4>
                  <p className="text-base text-muted-foreground">
                    Property managers access CSR scores directly. No more quarterly email threads requesting safety documentation. Self-serve transparency replaces manual reporting.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Connected Modules Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Connected Modules
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          The Property Manager Interface connects to five other OnRopePro modules, pulling data to create a complete vendor visibility picture.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-base font-medium">Company Safety Rating (CSR)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-base text-muted-foreground">
                CSR scores displayed in the Property Manager Interface come directly from the CSR module. As vendors update safety documentation, complete toolbox meetings, and log harness inspections, property managers see those percentages change in real time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-base font-medium">Project Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-base text-muted-foreground">
                View active and completed projects per building. Property managers see project progress without accessing internal scheduling or resource allocation. Timeline visibility without operational exposure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileUp className="w-5 h-5 text-violet-600" />
                <CardTitle className="text-base font-medium">Document Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-base text-muted-foreground">
                Anchor inspection certificates uploaded by property managers store through the Document Management system. The one write permission connects to centralized document storage per building.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-rose-600" />
                <CardTitle className="text-base font-medium">Resident Portal</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-base text-muted-foreground">
                Property Manager Interface and Resident Portal share the same access code architecture. Both provide external stakeholder visibility with appropriate permission boundaries.
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <LinkIcon className="w-5 h-5 text-amber-600" />
                <CardTitle className="text-base font-medium">Feedback System</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-base text-muted-foreground">
                Complaint history and response time metrics pull from the Feedback module. Resident-submitted feedback becomes visible to property managers, creating accountability across the vendor relationship.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* FAQs Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        
        <Accordion type="single" collapsible className="space-y-3">
          <AccordionItem value="faq-1" className="border rounded-lg px-4" data-testid="accordion-faq-1">
            <AccordionTrigger className="text-left font-medium">
              What can property managers actually edit in the system?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              One thing: anchor inspection certificates. You can upload annual anchor inspection certificates to each building you manage. Everything else is read-only. No risk of accidentally modifying operational records.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2" className="border rounded-lg px-4" data-testid="accordion-faq-2">
            <AccordionTrigger className="text-left font-medium">
              Can I see individual safety documents from my vendors?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              No. You see CSR percentages indicating compliance levels, not the underlying documents. This provides transparency without exposing operational details.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3" className="border rounded-lg px-4" data-testid="accordion-faq-3">
            <AccordionTrigger className="text-left font-medium">
              How do I get access to the Property Manager Interface?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              Your rope access vendor provides a Property Manager Code. Use that code to create your account, then specify which buildings you manage. Access is granted at the building level.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-4" className="border rounded-lg px-4" data-testid="accordion-faq-4">
            <AccordionTrigger className="text-left font-medium">
              Can different property managers at my company see different buildings?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              Yes. Each property manager creates their own account and specifies which buildings they manage. You only see vendors and data relevant to your portfolio.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-5" className="border rounded-lg px-4" data-testid="accordion-faq-5">
            <AccordionTrigger className="text-left font-medium">
              What if I manage buildings serviced by multiple rope access companies?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              My Vendors Dashboard shows all contracted companies across your portfolio. You see every vendor relationship in one view, regardless of how many companies service your buildings.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-6" className="border rounded-lg px-4" data-testid="accordion-faq-6">
            <AccordionTrigger className="text-left font-medium">
              Can my vendors see that I've viewed their information?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              Vendors know which property managers have connected via their code. They cannot see when you log in or what specific information you view.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-7" className="border rounded-lg px-4" data-testid="accordion-faq-7">
            <AccordionTrigger className="text-left font-medium">
              How often are CSR scores updated?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              CSR scores update automatically as vendors log safety activities. You always see current compliance status, not quarterly snapshots.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-8" className="border rounded-lg px-4" data-testid="accordion-faq-8">
            <AccordionTrigger className="text-left font-medium">
              What's the difference between CSR score and response time? Which matters more?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              CSR measures safety compliance (documentation, toolbox meetings, harness inspections). Response time measures how quickly vendors address complaints. Many property managers care more about response time. You see both metrics.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-9" className="border rounded-lg px-4" data-testid="accordion-faq-9">
            <AccordionTrigger className="text-left font-medium">
              Can I upload documents other than anchor inspection certificates?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              No. The single write permission is specifically for annual anchor inspection certificates. This maintains data integrity while acknowledging that building owners often receive these third-party certificates directly.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-10" className="border rounded-lg px-4" data-testid="accordion-faq-10">
            <AccordionTrigger className="text-left font-medium">
              Is my data separated from other property managers at my company?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              Yes. Each property manager account sees only the buildings they specified during setup. Portfolio separation is built into the access model.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Stop Managing Blind. Start Managing Informed.
        </h2>
        
        <div className="space-y-4 text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
          <p>
            Right now, you choose rope access vendors based on price and hope. You forward complaints and wonder if they're addressed. You carry liability for contractors whose safety practices you've never actually verified.
          </p>
          <p>
            When insurance asks about due diligence, you show them nothing because you have nothing to show.
          </p>
          <p className="font-medium text-foreground">
            The Property Manager Interface changes this equation. Log in and see every vendor's CSR score. Compare safety compliance before signing contracts. Track complaint resolution over time. Upload anchor inspection certificates to the right building record.
          </p>
          <p>
            You get visibility without administrative burden. Transparency without inappropriate access. Documented proof that you monitor your vendors, not just hire them.
          </p>
          <p className="font-medium text-foreground">
            And when someone asks what due diligence you performed? You show them exactly what you saw.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/register" data-testid="button-start-trial-cta">
              Start Your Free 60-Day Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <img 
            src={onRopeProLogo} 
            alt="OnRopePro" 
            className="h-10 object-contain mx-auto mb-4" 
          />
          <p className="text-sm text-muted-foreground">
            OnRopePro Management Software. Built for rope access professionals.
          </p>
        </div>
      </footer>
    </div>
  );
}
