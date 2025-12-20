import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicHeader } from "@/components/PublicHeader";
import { 
  ArrowRight, 
  Clock, 
  DollarSign, 
  Shield, 
  Briefcase,
  HardHat,
  Building2,
  Users,
  Home,
  Ticket,
  BarChart3,
  Rocket,
  Eye,
  Camera,
  Timer,
  Phone,
  RefreshCw,
  TrendingUp,
  Scale,
  ClipboardList,
  FolderOpen,
  Calendar,
  Wrench,
  BookOpen,
  FileText,
  MessageSquare,
  UserCog,
  Award,
  LineChart,
  Palette,
  CheckCircle2,
  XCircle,
  Lock,
  HeartHandshake,
  Mail
} from "lucide-react";

type Segment = "employer" | "technician" | "property-manager" | "building-manager" | "resident";

const segmentContent = {
  employer: {
    headline: "Stop Chasing Your Business. Start Running It.",
    subheadline: "You didn't start a rope access company to spend 22 hours a week on spreadsheets, text threads, and payroll chaos. One platform. Everything connected. Reclaim your time.",
    pillars: [
      { icon: Clock, headline: "87-93% Less Payroll Time", text: "One-click payroll prep. Automatic overtime. Zero calculation errors." },
      { icon: DollarSign, headline: "$22K-45K Recovered Annually", text: "Unbilled hours tracked. Payroll errors eliminated. Quotes that don't underbid." },
      { icon: Shield, headline: "Audit-Ready in 4 Minutes", text: "Every document, every inspection, every certification. Exportable. Defensible." }
    ],
    primaryCta: { text: "Start Free Trial", href: "/register" },
    secondaryCta: { text: "See How It Works", href: "/pricing" },
    secondarySubtext: "15-minute demo with someone who's been on the ropes",
    trustSignal: "30 days free. No credit card."
  },
  technician: {
    headline: "Your Career. Your Data. Your Platform.",
    subheadline: "Your IRATA/SPRAT hours are yours—not your employer's. Build a portable professional identity that follows you from company to company, job to job, for your entire career.",
    pillars: [
      { icon: Ticket, headline: "Portable Work Passport", text: "Your hours, certifications, and work history travel with you. Change jobs without losing your record." },
      { icon: BarChart3, headline: "Automatic Hour Logging", text: "Connected to an employer? Hours, drops, and tasks log automatically. No more end-of-week paperwork." },
      { icon: Rocket, headline: "Level Up Faster", text: "Track progress toward L2 and L3. Know exactly how many hours you need and in which task categories." }
    ],
    primaryCta: { text: "Create Free Account", href: "/technician" },
    secondaryCta: { text: "How It Works for Techs", href: "/technician" },
    trustSignal: "PLUS features unlock free when you refer one other technician"
  },
  "property-manager": {
    headline: "Know Your Vendors Before the Incident—Not After.",
    subheadline: "Stop accepting vendor safety claims at face value. See real compliance data. Compare vendors objectively. Protect your portfolio with documented due diligence.",
    pillars: [
      { icon: BarChart3, headline: "Company Safety Ratings", text: "Three compliance percentages: documentation, toolbox meetings, harness inspections. At a glance." },
      { icon: Scale, headline: "Liability Protection", text: 'Documented vendor vetting. When insurance asks "what due diligence did you perform?"—you have the answer.' },
      { icon: ClipboardList, headline: "Portfolio Dashboard", text: "All your buildings. All your vendors. All their safety data. One screen." }
    ],
    primaryCta: { text: "Create Free Account", href: "/property-manager", subtext: "Free for property managers" },
    secondaryCta: { text: "See Vendor Comparison Demo", href: "/property-manager" },
    trustSignal: "Join 50+ property managers already using OnRopePro for vendor oversight"
  },
  "building-manager": {
    headline: "Stop Being the Middleman.",
    subheadline: "Every resident complaint shouldn't flow through you. Every progress question shouldn't require three phone calls. Get visibility without the coordination burden.",
    pillars: [
      { icon: Phone, headline: "70% Fewer Calls", text: 'Residents see project progress in real-time. They stop calling you to ask "when will they do my side?"' },
      { icon: RefreshCw, headline: "24-Hour Resolution", text: "Residents submit feedback directly to vendors. You see everything without handling every back-and-forth." },
      { icon: TrendingUp, headline: "Proof for Council", text: "Generate professional vendor performance reports in 2 minutes instead of 2 hours." }
    ],
    primaryCta: { text: "Create Free Account", href: "/building-portal" },
    secondaryCta: { text: "See Building Manager Portal", href: "/building-portal" },
    trustSignal: "Free for building managers"
  },
  resident: {
    headline: "Know What's Happening. Report What's Wrong.",
    subheadline: "No more wondering when the window cleaners will reach your unit. No more calling the building manager just to find out what's going on.",
    pillars: [
      { icon: Eye, headline: "Real-Time Progress", text: "See which building elevations are complete and when work will reach your unit. Plan accordingly." },
      { icon: Camera, headline: "Direct Feedback", text: "Notice a problem? Submit it with photos. Track status until it's resolved. No more unanswered emails." },
      { icon: Timer, headline: "Faster Resolution", text: "Average issue resolution: 24 hours vs. 3-5 days with traditional phone tag." }
    ],
    primaryCta: { text: "Create Free Account", href: "/resident" },
    secondaryCta: { text: "How the Resident Portal Works", href: "/resident" },
    trustSignal: "Free for residents"
  }
};

const modules = [
  { name: "Project Management", desc: "Create, assign, track, and close jobs. Every building. Every drop. Every hour.", icon: FolderOpen },
  { name: "Time & Work Sessions", desc: "GPS-verified clock in/out. Automatic overtime. Zero disputed hours.", icon: Clock },
  { name: "Payroll Processing", desc: "One-click prep. 87-93% faster. Export to QuickBooks or download CSVs.", icon: DollarSign },
  { name: "Scheduling & Calendar", desc: "Drag-and-drop crew assignments. Conflict detection. Time-off management.", icon: Calendar },
  { name: "Safety & Compliance", desc: "SWMS, Toolbox Meetings, Anchor Certs, JHAs. Audit-ready in 4 minutes.", icon: Shield },
  { name: "Equipment Inventory", desc: "Every harness, rope, and descender tracked. Serial numbers. Service life alerts.", icon: Wrench },
  { name: "IRATA/SPRAT Task Logging", desc: "Automatic hour logging toward certification. Exportable for assessments.", icon: BookOpen },
  { name: "Document Management", desc: "Insurance certs, training records, rope access plans. Upload once, access anywhere.", icon: FileText },
  { name: "Quoting System", desc: "Multi-service quotes with historical pricing. Pipeline tracking. Stop underbidding.", icon: DollarSign },
  { name: "Client Management", desc: "Building database with service history. Know every building's quirks.", icon: Building2 },
  { name: "Resident Portal", desc: "Residents submit feedback with photos. 70% fewer calls to building managers.", icon: Home },
  { name: "Complaint Management", desc: "Track, assign, resolve, document. Metrics that win contract renewals.", icon: MessageSquare },
  { name: "Employee Management", desc: "Profiles, certifications, hourly rates, permissions. Onboard in minutes.", icon: UserCog },
  { name: "Company Safety Rating", desc: "Aggregate safety score. Differentiate in bids. Impress building managers.", icon: Award },
  { name: "Performance Analytics", desc: "Which techs are fastest? Which buildings take longest? Data replaces guessing.", icon: LineChart },
  { name: "White-Label Branding", desc: "Your logo, your colors. Professional client-facing portal.", icon: Palette }
];

const chaosItems = [
  "6-10 hours/week processing payroll from scattered timesheets",
  "45+ minutes finding documents when building managers ask",
  "2-3 hours per quote because you're guessing at historical costs",
  "Endless text threads tracking who's where and when",
  "Spreadsheets for certifications that nobody actually updates",
  "Paper inspection forms that live in filing cabinets (maybe)"
];

const leakItems = [
  { amount: "$1,200-3,600/year", desc: "in payroll calculation errors" },
  { amount: "$12,600+/year", desc: "in unbilled hours (forgot to log, disputed, lost)" },
  { amount: "$5,000-15,000/year", desc: "from underbid quotes (no historical data)" },
  { amount: "$2,000-4,000/year", desc: "in lost or untracked equipment" },
  { amount: "10-20% higher insurance", desc: "because you can't document your safety program" }
];

const fixItems = [
  "Payroll prep in 30-45 minutes (not 6-10 hours)",
  "Every document searchable and exportable in seconds",
  "Historical job costing per building eliminates underbidding",
  "Scheduling, time tracking, and projects—all linked",
  "Equipment inventory with service life alerts",
  "Safety documentation that impresses building managers"
];

const beforeAfterData = [
  { metric: "Weekly payroll time", before: "6-10 hours", after: "30-45 minutes" },
  { metric: "Finding documents", before: "45+ minutes", after: "4 minutes" },
  { metric: "Creating quotes", before: "2-3 hours", after: "30 minutes" },
  { metric: "Audit preparation", before: "2-3 days scrambling", after: "4 minutes" },
  { metric: "Certification tracking", before: "Spreadsheet chaos", after: "Automatic alerts" }
];

const roiExample = [
  { label: "Annual platform cost", value: "$5,388" },
  { label: "Time savings value (owner hours reclaimed)", value: "$79,200" },
  { label: "Payroll errors eliminated", value: "$2,400" },
  { label: "Unbilled hours recovered", value: "$12,600" },
  { label: "Quote accuracy improvement", value: "$7,500" }
];

export default function HomePage() {
  const [activeSegment, setActiveSegment] = useState<Segment | null>(null);
  const content = activeSegment ? segmentContent[activeSegment] : null;

  const segmentButtons: { id: Segment; label: string; icon: typeof Briefcase }[] = [
    { id: "employer", label: "Rope Access Company", icon: Briefcase },
    { id: "technician", label: "Technician", icon: HardHat },
    { id: "property-manager", label: "Property Manager", icon: Users },
    { id: "building-manager", label: "Building Manager", icon: Building2 },
    { id: "resident", label: "Building Resident", icon: Home }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <PublicHeader />

      {/* Hero Section */}
      <section 
        className="relative text-white pb-[120px]" 
        style={{ backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)' }}
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyek0zNCAyNGgydjRoLTJ2LTR6TTI0IDI0aDJ2NGgtMnYtNHptMCA2aDJ2NGgtMnYtNHptMCA2aDJ2NGgtMnYtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            {/* Pre-headline badge */}
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-preheadline">
              The rope access industry's only purpose-built platform
            </Badge>

            {/* Primary Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              One Platform. Everyone Connected.<br />
              <span className="text-blue-100">Zero Chaos.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Projects. Payroll. Safety. Scheduling. Compliance. All in one place—built by a Level 3 technician who got tired of watching good companies drown in paperwork.
            </p>

            {/* Segment Selector */}
            <div className="pt-8">
              <p className="text-lg font-medium mb-4">I'm a...</p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {segmentButtons.map((btn) => (
                  <Button
                    key={btn.id}
                    variant={activeSegment === btn.id ? "default" : "outline"}
                    className={activeSegment === btn.id 
                      ? "bg-white text-[#0B64A3] hover:bg-blue-50" 
                      : "border-white/40 text-white hover:bg-white hover:text-[#0B64A3] transition-colors"
                    }
                    onClick={() => setActiveSegment(btn.id)}
                    data-testid={`button-segment-${btn.id}`}
                  >
                    <btn.icon className="w-4 h-4 mr-2" />
                    {btn.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Segment-specific content - only shown when a segment is selected */}
          {content && (
            <div className="mt-12 text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-segment-headline">
                  {content.headline}
                </h2>
                <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                  {content.subheadline}
                </p>
              </div>

              {/* Value Pillars */}
              <div className="grid md:grid-cols-3 gap-6 pt-4">
                {content.pillars.map((pillar, i) => (
                  <Card key={i} className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <pillar.icon className="w-10 h-10 mx-auto mb-4 text-white" />
                      <h3 className="text-lg font-bold text-white mb-2">{pillar.headline}</h3>
                      <p className="text-blue-100 text-base">{pillar.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <div className="flex flex-col items-center gap-1">
                  <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" asChild>
                    <Link href={content.primaryCta.href}>
                      {content.primaryCta.text}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  {'subtext' in content.primaryCta && content.primaryCta.subtext && (
                    <span className="text-xs text-blue-100">{content.primaryCta.subtext}</span>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
                    <Link href={content.secondaryCta.href}>
                      {content.secondaryCta.text}
                    </Link>
                  </Button>
                  {'secondarySubtext' in content && content.secondarySubtext && (
                    <span className="text-xs text-blue-100">{content.secondarySubtext}</span>
                  )}
                </div>
              </div>

              {/* Trust Signal */}
              <p className="text-sm text-blue-100 italic">{content.trustSignal}</p>
            </div>
          )}
        </div>

        {/* Wave separator */}
        <div className="absolute -bottom-[1px] left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-background"/>
          </svg>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-white dark:bg-slate-950 py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Built by Rope Access. For Rope Access.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            OnRopePro was created by a Level 3 IRATA technician who spent years watching good companies drown in administrative chaos. 
            Every feature exists because rope access operators asked for it. Every workflow was tested on actual job sites. 
            This isn't adapted HR software. It's the system we wished existed when we were running crews.
          </p>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="bg-muted/30 py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            The Problem With How You're Running Things Now
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Column 1: The Chaos */}
            <Card className="bg-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">The Chaos</h3>
                <p className="text-sm font-medium text-muted-foreground mb-4">Where Your Time Actually Goes</p>
                <ul className="space-y-3">
                  {chaosItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-base">
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-base font-medium text-muted-foreground italic">
                  You started a rope access company to do rope access. Not data entry.
                </p>
              </CardContent>
            </Card>

            {/* Column 2: The Leaks */}
            <Card className="bg-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">The Leaks</h3>
                <p className="text-sm font-medium text-muted-foreground mb-4">Money Disappearing Every Month</p>
                <ul className="space-y-3">
                  {leakItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-base">
                      <DollarSign className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span><strong className="text-rose-600">{item.amount}</strong> {item.desc}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-lg font-bold text-rose-600">
                  Total: $22,000-45,000/year in preventable losses.
                </p>
              </CardContent>
            </Card>

            {/* Column 3: The Fix */}
            <Card className="bg-card border-2 border-[#0B64A3]">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[#0B64A3]">The Fix</h3>
                <p className="text-sm font-medium text-muted-foreground mb-4">One Platform. Everything Connected.</p>
                <ul className="space-y-3">
                  {fixItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-base">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-base font-medium text-muted-foreground">
                  OnRopePro costs <strong>$99/month + $34.95/tech</strong>. The leaks you're plugging are worth 10x that.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section - 16 Modules */}
      <section className="bg-white dark:bg-slate-950 py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">16 Modules. One Platform. No Add-Ons.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run a rope access company—from first quote to final payment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((module, i) => (
              <Card key={i} className="hover-elevate">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0B64A3]/10 flex items-center justify-center shrink-0">
                      <module.icon className="w-5 h-5 text-[#0B64A3]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{module.name}</h3>
                      <p className="text-sm text-muted-foreground">{module.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" className="bg-[#0B64A3] text-white hover:bg-[#0369A1]" asChild>
              <Link href="/pricing">
                See All Features & Pricing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="bg-muted/30 py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">The Math Is Simple</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* The Investment */}
            <Card className="bg-card">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold mb-6">The Investment</h3>
                <div className="bg-muted/50 rounded-xl p-6 mb-6">
                  <div className="text-4xl font-bold text-[#0B64A3] mb-2">$99<span className="text-xl font-normal">/month base</span></div>
                  <div className="text-2xl font-semibold mb-2">+ $34.95<span className="text-base font-normal">/month per technician</span></div>
                  <div className="text-lg text-muted-foreground">= Your monthly cost</div>
                </div>
                <p className="text-base text-muted-foreground">
                  $34.95 is what you pay a technician for <strong>one hour</strong> of work.<br />
                  This platform saves each tech <strong>10+ hours</strong> per month.<br />
                  <strong>You do the math.</strong>
                </p>
              </CardContent>
            </Card>

            {/* The Return - Before/After */}
            <Card className="bg-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 text-center">The Return</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-sm font-medium text-muted-foreground pb-2 border-b">
                    <span>Metric</span>
                    <span className="text-center">Without</span>
                    <span className="text-center">With OnRopePro</span>
                  </div>
                  {beforeAfterData.map((row, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 text-base py-2 border-b border-muted/50">
                      <span className="font-medium">{row.metric}</span>
                      <span className="text-center text-rose-600">{row.before}</span>
                      <span className="text-center text-emerald-600 font-medium">{row.after}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ROI Example */}
          <Card className="bg-card border-2 border-[#0B64A3]">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6 text-center">ROI Example: 10 Technicians</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  {roiExample.map((row, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-muted/50">
                      <span className="text-base">{row.label}</span>
                      <span className={`font-semibold ${i === 0 ? 'text-foreground' : 'text-emerald-600'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-center items-center bg-[#0B64A3]/5 rounded-xl p-6">
                  <div className="text-sm uppercase tracking-wide text-muted-foreground mb-2">Total Annual Value</div>
                  <div className="text-3xl font-bold text-[#0B64A3] mb-4">$101,700</div>
                  <div className="text-sm uppercase tracking-wide text-muted-foreground mb-2">Net Benefit</div>
                  <div className="text-2xl font-bold text-emerald-600 mb-4">$96,312</div>
                  <div className="bg-[#0B64A3] text-white px-6 py-3 rounded-full">
                    <span className="text-2xl font-bold">1,788%</span> <span className="text-lg">ROI</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white dark:bg-slate-950 py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Companies Like Yours Trust OnRopePro</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-[#0B64A3]/10 flex items-center justify-center mx-auto mb-4">
                  <HardHat className="w-8 h-8 text-[#0B64A3]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Built by Rope Access</h3>
                <p className="text-base text-muted-foreground">
                  Created by a Level 3 IRATA technician. Every feature designed for how rope access companies actually work—not adapted from generic field service software.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Your Data, Your Control</h3>
                <p className="text-base text-muted-foreground">
                  Bank-level encryption. Daily backups. Export everything you've ever entered at any time. You're never locked in.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
                  <HeartHandshake className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">No Contracts, No Surprises</h3>
                <p className="text-base text-muted-foreground">
                  Monthly billing. Cancel anytime. No setup fees. No per-project charges. We'd rather earn your business every month than trap you in a contract.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section 
        className="relative text-white py-16 md:py-24 px-4"
        style={{ backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Stop the Chaos?</h2>
          <p className="text-xl text-blue-100 mb-8">
            30-day free trial. No credit card required. Full access to every feature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" asChild>
              <Link href="/register">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
              <Link href="/pricing">
                Schedule a 15-minute demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Value Props */}
      <section className="bg-slate-900 text-slate-300 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-slate-400" />
              <h4 className="text-lg font-semibold text-white mb-2">Simple Pricing</h4>
              <p className="text-base">$99/month + $34.95/technician. Everything included.</p>
            </div>
            <div>
              <Lock className="w-8 h-8 mx-auto mb-3 text-slate-400" />
              <h4 className="text-lg font-semibold text-white mb-2">No Lock-In</h4>
              <p className="text-base">Monthly billing. Cancel anytime. Export your data whenever you want.</p>
            </div>
            <div>
              <Mail className="w-8 h-8 mx-auto mb-3 text-slate-400" />
              <h4 className="text-lg font-semibold text-white mb-2">Real Support</h4>
              <p className="text-base">Same-day email response. Documentation that actually helps.</p>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-slate-700">
            <p className="text-sm text-slate-500">OnRopePro - Built by Rope Access, for Rope Access</p>
          </div>
        </div>
      </section>
    </div>
  );
}
