import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { Link } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Users,
  Building2,
  Briefcase,
  Gauge,
  AlertTriangle,
  FileCheck,
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  ShieldCheck,
  Bell,
  FileText,
  PieChart,
  Presentation,
  Calculator,
  Link2,
  ClipboardCheck,
  Timer,
  Award,
  DollarSign,
  Globe,
  ChevronsUpDown,
  HelpCircle
} from "lucide-react";

export default function CSRLandingPropertyManagers() {
  const [openProblems, setOpenProblems] = useState<string[]>([]);
  const [openFaqs, setOpenFaqs] = useState<string[]>([]);

  const allProblems = ["pm-1", "pm-2", "pm-3", "risk-1", "risk-2"];
  const allFaqs = ["faq-1", "faq-2", "faq-3", "faq-4", "faq-5", "faq-6", "faq-7", "faq-8", "faq-9", "faq-10", "faq-11", "faq-12"];

  const problemsAllExpanded = openProblems.length === allProblems.length;
  const faqsAllExpanded = openFaqs.length === allFaqs.length;

  const toggleAllProblems = () => {
    setOpenProblems(problemsAllExpanded ? [] : [...allProblems]);
  };

  const toggleAllFaqs = () => {
    setOpenFaqs(faqsAllExpanded ? [] : [...allFaqs]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="property-manager" />
      
      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              Company Safety Rating Module
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Prove Your Vendors Are Safe<br />
              Before The Incident,<br />
              <span className="text-blue-100">Not After The Lawsuit.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              One real-time safety rating for every vendor across your entire portfolio. Automated compliance tracking, instant audit trails, and the documentation that protects you when incidents happen.<br />
              <strong>Built for property managers who need systematic vendor safety verification across multiple properties.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" asChild data-testid="button-hero-trial">
                <Link href="/register">
                  Start Your Free 60-Day Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-hero-faq">
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
                  <div className="text-3xl md:text-4xl font-bold text-rose-600">$29M</div>
                  <div className="text-base text-muted-foreground mt-1">Judgment risk</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">5-70+</div>
                  <div className="text-base text-muted-foreground mt-1">Buildings managed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">20-50%</div>
                  <div className="text-base text-muted-foreground mt-1">Manual compliance rates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-sky-600">Real-time</div>
                  <div className="text-base text-muted-foreground mt-1">Score updates</div>
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
            Manual Vendor Safety Tracking Fails at Portfolio Scale
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                You manage 5 to 70 buildings across one or multiple cities.
              </p>
              <p className="text-base">
                Each property manager relationship involves 5-15 rope access vendors across your portfolio. That's 5-15 critical vendor relationships where you're liable for safety compliance but may have limited visibility into actual practices.
              </p>
              <p className="text-base">
                Manual processes achieve 20-50% compliance rates because tracking vendor safety across properties at scale is nearly impossible without automated systems.
              </p>
              <p className="text-base">
                When a vendor incident happens, the question is always: "Did you verify they followed safety procedures?" Without documentation, you have no defense. One property management firm faced a $29 million judgment for vendor negligence. Their documentation? Scattered emails and Excel files that couldn't prove safety compliance.
              </p>
              <p className="text-base">
                The real problem isn't that building managers don't care about safety. The problem is that safety has always been unmeasured at scale. You assume vendors are compliant until the incident proves they weren't. Then you discover your liability exposure was invisible the entire time.
              </p>
              <Separator className="my-6" />
              <p className="font-medium text-foreground text-lg">
                OnRopePro's Company Safety Rating provides automated, portfolio-wide vendor safety compliance tracking with real-time scoring, instant gap identification, and audit-ready documentation that transforms vendor management from administrative task into defensible risk infrastructure.
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
            Portfolio-Wide Vendor Safety Compliance Infrastructure
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            Automated safety scoring for every vendor across every property, calculated in real-time from actual compliance data.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Real-Time Safety Scoring */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <Gauge className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Real-Time Safety Scoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">Every vendor company receives an automated CSR score calculated from four categories.</p>
                <p>Core documentation (COI, safety manuals), daily harness inspections, project-specific requirements (anchor inspections, toolbox meetings), and employee safety document acknowledgments. Scores update in real-time as compliance activities complete.</p>
                <p className="font-medium text-foreground mt-4">What gets tracked across portfolio:</p>
                <ul className="space-y-2 list-disc list-inside ml-2">
                  <li>Certificate of Insurance, Health & Safety Manual, Company Policy for each vendor</li>
                  <li>Harness inspection completion rates across all work sessions portfolio-wide</li>
                  <li>Project documentation (Rope Access Plans, FLHAs, Toolbox Meetings, Anchor Inspections)</li>
                  <li>Employee signature status on safety procedures for every technician</li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 2: Portfolio Compliance Dashboard */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center mb-3">
                  <BarChart3 className="w-6 h-6 text-sky-600" />
                </div>
                <CardTitle className="text-xl">Portfolio Compliance Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">View safety compliance across your entire portfolio from one dashboard.</p>
                <p>Filter by property, vendor, score range, or compliance category. Identify which vendors pose risk before contract renewal. Track compliance trends over time. Compare vendor safety performance across properties.</p>
                <p className="font-medium text-foreground mt-4">What portfolio managers see:</p>
                <ul className="space-y-2 list-disc list-inside ml-2">
                  <li>All vendors ranked by CSR with color-coded badges (green 90-100%, yellow 70-89%, orange 50-69%, red below 50%)</li>
                  <li>Properties with highest vendor risk concentration</li>
                  <li>Compliance gap trends requiring immediate attention</li>
                  <li>Vendor-by-vendor drill-down showing specific deficiencies</li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3: Audit-Ready Documentation */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-3">
                  <FileCheck className="w-6 h-6 text-violet-600" />
                </div>
                <CardTitle className="text-xl">Audit-Ready Documentation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">Export comprehensive safety compliance reports for insurance audits, board presentations, or legal defense.</p>
                <p>Every report includes vendor CSR scores, supporting documentation with timestamps, employee acknowledgment records, and compliance trend analysis. Transform weeks of manual compilation into instant report generation.</p>
                <p className="font-medium text-foreground mt-4">What gets documented for legal defense:</p>
                <ul className="space-y-2 list-disc list-inside ml-2">
                  <li>When you verified vendor safety compliance and at what percentage</li>
                  <li>Which specific employees signed which safety procedures (dates, timestamps)</li>
                  <li>Project-by-project safety documentation completion records</li>
                  <li>Historical compliance trends showing proactive monitoring</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Who Benefits Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Who Benefits From This Module
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Systematic vendor safety compliance that protects careers, companies, and properties.
          </p>

          <div className="space-y-8">
            {/* For Portfolio Property Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">For Portfolio Property Managers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Eliminate the vendor negligence liability that ends careers.</h4>
                    <p className="text-base text-muted-foreground">One $29 million judgment costs more than a lifetime of platform fees. CSR provides the documented proof that you verified vendor safety compliance before incidents occurred.</p>
                    <p className="text-base text-muted-foreground">When incidents happen, you have timestamped evidence showing exactly what vendors knew and when.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Standardize vendor safety compliance across 5-70+ properties.</h4>
                    <p className="text-base text-muted-foreground">You cannot personally verify safety practices for 5-15 rope access vendors across your entire portfolio. CSR automates compliance monitoring across all properties.</p>
                    <p className="text-base text-muted-foreground">Filter vendors by safety score. Make data-driven contract renewal decisions based on actual compliance rates, not sales pitches.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Win enterprise contracts by demonstrating operational sophistication.</h4>
                    <p className="text-base text-muted-foreground">When competing for large management opportunities, boards ask: "How do you manage vendor risk?"</p>
                    <p className="text-base text-muted-foreground">While competitors scramble to create presentations, you export real-time compliance dashboards showing systematic vendor safety monitoring across your portfolio.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Building-Level Operations Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-violet-50 dark:bg-violet-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-xl">For Building-Level Operations Managers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Make vendor selection decisions based on data, not guesswork.</h4>
                    <p className="text-base text-muted-foreground">When choosing between three window washing companies, see their actual safety compliance rates. A vendor with 87% CSR versus 35% CSR gives you defensible criteria for vendor selection.</p>
                    <p className="text-base text-muted-foreground">No more relying on price alone when safety should drive the decision.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Reduce liability exposure for the properties you manage.</h4>
                    <p className="text-base text-muted-foreground">When vendor incidents occur at your building, investigators ask if you verified safety compliance.</p>
                    <p className="text-base text-muted-foreground">CSR documentation shows exactly which vendors were compliant and which weren't, protecting you from negligence allegations.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Property Owners and Boards */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">For Property Owners and Boards</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Verify your property management company systematically manages vendor safety.</h4>
                    <p className="text-base text-muted-foreground">Request CSR compliance reports showing vendor safety trends across your properties. Know exactly which vendors pose risk before incidents happen.</p>
                    <p className="text-base text-muted-foreground">Hold property managers accountable for maintaining safe vendor relationships.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Protect against the liability exposure that destroys property values.</h4>
                    <p className="text-base text-muted-foreground">Major vendor incidents reduce property values and increase insurance premiums.</p>
                    <p className="text-base text-muted-foreground">CSR enables proactive vendor safety management that prevents incidents rather than reacting after damage occurs.</p>
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
            <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Key Features
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Every feature designed to solve the specific vendor safety tracking failures that create liability exposure at portfolio scale.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Portfolio-Wide Vendor Ranking</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      View all vendors across your entire portfolio ranked by safety compliance score. Filter by property, work type, or compliance category.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      Identify the bottom 10% requiring immediate remediation. Track improvement trends after implementing corrective actions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Compliance Gap Alerts</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Automated notifications when vendor safety scores drop below acceptable thresholds. Alerts show specific deficiencies and recommended corrective actions.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      Catch problems before they become incidents.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Vendor Selection Documentation</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      When selecting vendors for contracts, export comparison reports showing CSR scores with supporting compliance data.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      Document why you selected Vendor A (87% CSR) over Vendor B (42% CSR) for audit trails and board presentations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Insurance Audit Preparation</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Generate comprehensive vendor safety compliance reports in minutes. Reports include portfolio-wide statistics, vendor-by-vendor detail, and trend analysis.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      Transform multi-day audit preparation into instant report generation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Presentation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Board-Ready Presentations</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Export executive summaries showing portfolio-wide vendor safety performance. Color-coded dashboards, trend charts, and benchmark comparisons.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      Present data that proves systematic vendor risk management.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Calculator className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Proportional Impact Calculation</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      CSR scores reflect long-term compliance patterns, not isolated incidents. Vendors with 1,000 work sessions where one inspection was missed score differently than vendors with 10 sessions and one miss.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      The math rewards consistent compliance over time, giving accurate risk assessment.
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
            <h2 className="text-3xl md:text-4xl font-bold">Problems Solved</h2>
            <Button onClick={toggleAllProblems} variant="outline" data-testid="button-toggle-all-problems">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {problemsAllExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          {/* For Portfolio Property Managers */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Globe className="w-5 h-5 text-emerald-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Portfolio Property Managers</h3>
            </div>

            <Accordion type="multiple" value={openProblems} onValueChange={setOpenProblems} className="space-y-3">
              <AccordionItem value="pm-1" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-pm-1">
                  "I cannot manually verify vendor safety compliance across 5-70+ properties."
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-muted-foreground">
                  <p className="text-base">
                    <span className="font-medium text-foreground">The Pain:</span> You manage buildings across one or multiple cities. Each building manager works with 1-3 rope access vendors, with your portfolio using 5-15 different vendors total. That's 5-15 critical vendor relationships where you're liable for safety compliance but have no visibility into actual practices.
                  </p>
                  <p className="text-base">
                    <span className="font-medium text-foreground">Real Example:</span> Excel spreadsheets and email follow-ups achieve 20-50% compliance rates because manual processes don't scale across portfolios.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <span className="font-medium">Solution:</span> CSR automates portfolio-wide vendor compliance tracking. One dashboard shows every vendor's safety score across all properties. Filter by compliance threshold to identify which vendors pose risk.
                    </p>
                  </div>
                  <p className="text-base">
                    <span className="font-medium text-foreground">Benefit:</span> No more depending on building managers to manually verify safety documentation you cannot see.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pm-2" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-pm-2">
                  "When vendor incidents happen, I have no documented proof of compliance verification."
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-muted-foreground">
                  <p className="text-base">
                    <span className="font-medium text-foreground">The Pain:</span> A technician falls from your building. WorkSafe investigates. The vendor claims they followed procedures. Your defense depends on proving you verified the vendor had proper safety programs.
                  </p>
                  <p className="text-base">
                    <span className="font-medium text-foreground">Real Example:</span> Your documentation is scattered across multiple building managers' email folders and Excel files. You have no timestamped proof showing when safety compliance was verified.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <span className="font-medium">Solution:</span> CSR provides audit trails showing exactly when you verified each vendor's safety compliance and at what score. Export reports with timestamps proving you systematically monitored vendor safety.
                    </p>
                  </div>
                  <p className="text-base">
                    <span className="font-medium text-foreground">Benefit:</span> When incidents happen, documentation shows proactive monitoring, not reactive scrambling.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pm-3" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-pm-3">
                  "Vendors claim they're safe but I cannot objectively compare them."
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-muted-foreground">
                  <p className="text-base">
                    <span className="font-medium text-foreground">The Pain:</span> Every vendor says they prioritize safety. When selecting contractors, you rely on price, references, or gut feeling. But you have no objective measurement of which vendors actually maintain safety compliance versus which ones just claim to.
                  </p>
                  <p className="text-base">
                    <span className="font-medium text-foreground">Real Example:</span> This creates liability exposure when the lowest bidder turns out to be the riskiest operator.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <span className="font-medium">Solution:</span> CSR makes vendor safety performance visible and comparable. View vendor rankings across your portfolio. See which vendors maintain 90%+ compliance versus those averaging 40%.
                    </p>
                  </div>
                  <p className="text-base">
                    <span className="font-medium text-foreground">Benefit:</span> Make contract decisions based on data showing actual safety practices, not sales presentations.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Insurance and Risk Management */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Shield className="w-5 h-5 text-rose-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Insurance and Risk Management</h3>
            </div>

            <Accordion type="multiple" value={openProblems} onValueChange={setOpenProblems} className="space-y-3">
              <AccordionItem value="risk-1" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-risk-1">
                  "Insurance audits reveal vendor compliance gaps I didn't know existed."
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-muted-foreground">
                  <p className="text-base">
                    <span className="font-medium text-foreground">The Pain:</span> Annual insurance audits discover that 35% of your vendors have expired certificates or missing safety documentation. Your insurance carrier questions your vendor management systems. Premium increases follow.
                  </p>
                  <p className="text-base">
                    <span className="font-medium text-foreground">Real Example:</span> You scramble to remediate gaps that have existed for months without visibility.
                  </p>
                  <div className="bg-rose-50 dark:bg-rose-950 p-3 rounded-lg border border-rose-200 dark:border-rose-800">
                    <p className="text-base text-rose-800 dark:text-rose-200">
                      <span className="font-medium">Solution:</span> CSR provides continuous vendor compliance monitoring replacing annual audit surprises with proactive gap identification. Real-time dashboards show exactly which vendors have compliance deficiencies before insurance audits discover them.
                    </p>
                  </div>
                  <p className="text-base">
                    <span className="font-medium text-foreground">Benefit:</span> No more audit surprises. Address compliance gaps proactively.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="risk-2" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-risk-2">
                  "One uninsured vendor incident could result in $10-29M judgments against the firm."
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4 text-muted-foreground">
                  <p className="text-base">
                    <span className="font-medium text-foreground">The Pain:</span> Property management liability extends to vendor negligence. When uninsured vendors cause injuries or deaths, courts examine whether you verified adequate coverage and safety compliance.
                  </p>
                  <p className="text-base">
                    <span className="font-medium text-foreground">Real Example:</span> One firm faced a $29 million judgment because they could not prove systematic vendor safety verification. Your career and company depend on documentation you may not have.
                  </p>
                  <div className="bg-rose-50 dark:bg-rose-950 p-3 rounded-lg border border-rose-200 dark:border-rose-800">
                    <p className="text-base text-rose-800 dark:text-rose-200">
                      <span className="font-medium">Solution:</span> CSR creates the documented proof that you systematically verified vendor safety compliance. Timestamped records show when vendors were compliant, proving due diligence in vendor selection and ongoing monitoring.
                    </p>
                  </div>
                  <p className="text-base">
                    <span className="font-medium text-foreground">Benefit:</span> Legal defense documentation that proves proactive vendor safety management.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Measurable Results Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Measurable Results
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Quantifiable impact across risk reduction, efficiency, competitive positioning, and insurance optimization.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">Risk Reduction at Portfolio Scale</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-base text-muted-foreground">
                <p>WorkSafe BC investigations cost 16-40 hours of response time per incident. Legal consultation runs $2,000-$10,000. Compliance order responses cost $5,000-$25,000.</p>
                <p>Potential fines reach $10,000-$156,000+ per violation. Major negligence judgments hit $10-29 million.</p>
                <p className="font-medium text-foreground">CSR documentation reduces investigation time to minutes with instant audit trail access. Estimated risk reduction value: $15,000-$100,000 annually for 5-70 building portfolios.</p>
              </CardContent>
            </Card>

            <Card className="border-sky-200 dark:border-sky-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-sky-600" />
                  </div>
                  <CardTitle className="text-lg">Administrative Efficiency Across Portfolio</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-base text-muted-foreground">
                <p>Manual vendor safety tracking consumes 2-5 hours weekly per building manager for rope access vendor management. Multiply across 5-70 buildings: 10-350 hours weekly of building manager time spent on vendor safety paperwork.</p>
                <p className="font-medium text-foreground">CSR automates compliance monitoring, reducing administrative burden by 65-87%. For a 20-building portfolio: 60 hours weekly becomes 15 hours weekly. Annual value at $35/hour: $82K in reclaimed building manager capacity.</p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Award className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-lg">Competitive Contract Wins</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-base text-muted-foreground">
                <p>Enterprise management contracts require operational sophistication proof. Boards evaluating property managers ask: "How do you manage vendor risk across portfolios?"</p>
                <p>Competitors provide verbal assurances. You provide real-time compliance dashboards with multi-year trend data.</p>
                <p className="font-medium text-foreground">CSR differentiates your firm as systematically managing risk versus competitors using manual processes. Estimated impact: 10-15% improvement in enterprise contract win rates.</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg">Insurance Premium Optimization</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-base text-muted-foreground">
                <p>Properties with documented vendor compliance programs negotiate better insurance rates. Carriers reward systematic risk management with premium reductions.</p>
                <p className="font-medium text-foreground">CSR provides the documented proof carriers require. Estimated premium reduction: 5-10% on liability coverage for properties demonstrating vendor safety compliance infrastructure.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Integration Points Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <Link2 className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            Module Integration Points
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            CSR integrates with multiple OnRopePro modules to create unified vendor safety compliance infrastructure across your portfolio.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-sky-600" />
                  <CardTitle className="text-base font-medium">Safety & Compliance Module</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Vendor harness inspection data feeds directly into CSR calculation</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Toolbox meeting completion rates count toward project compliance scores</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Safety document templates populate vendor safety libraries automatically</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-violet-600" />
                  <CardTitle className="text-base font-medium">Document Management Module</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Vendor employee signature status updates CSR scores in real-time</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>PDF exports include all signed safety documents with timestamps</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Version control ensures vendors always sign current procedures</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-base font-medium">Project Management Module</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Project-specific safety requirements automatically tracked per project</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Projects cannot close until safety documentation completes</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Ensures compliance before final payment</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Timer className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-base font-medium">Time Tracking Module</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Work session counts provide denominator for harness inspection compliance</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>As vendors accumulate sessions, compliance history builds automatically</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Long-term patterns show which vendors maintain consistent safety practices</span>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-base font-medium">Vendor Management Dashboard</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-base text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>CSR scores integrate into vendor selection interfaces across your portfolio</span>
                  </div>
                  <div className="flex items-center gap-2 text-base text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Filter available vendors by minimum safety score requirements</span>
                  </div>
                  <div className="flex items-center gap-2 text-base text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Track vendor compliance trends over multi-year relationships</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Business Improvement Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            From Liability Exposure to Documented Risk Management
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-base">
                Right now, you assume vendors are compliant until incidents prove they weren't. You rely on building managers to manually verify safety documentation you cannot see. You respond to insurance audit findings showing 30-50% vendor non-compliance rates across your portfolio. You hope your scattered documentation will hold up under legal scrutiny if serious incidents occur.
              </p>
              <p className="text-base">
                Every vendor incident, you discover your liability exposure was invisible. Every insurance audit, you scramble to compile documentation from multiple building managers. Every enterprise contract opportunity, you struggle to demonstrate operational sophistication when competitors ask: "How do you systematically manage vendor safety at scale?"
              </p>
              <Separator className="my-6" />
              <p className="text-base font-medium text-foreground">
                With CSR, you check one dashboard and know exactly which vendors pose risk across your entire portfolio. Compliance gaps get flagged before insurance audits discover them. When incidents happen, you export audit trails showing systematic safety verification with timestamps. When competing for enterprise contracts, you present real-time compliance data proving operational maturity.
              </p>
              <p className="text-base">
                The time building managers spend chasing vendor safety paperwork goes back to property management. The anxiety about hidden liability exposure transforms into confidence backed by documentation. The vendor safety culture you've built becomes visible, measurable, and legally defensible.
              </p>
              <p className="text-lg font-semibold text-foreground">
                That's not just better vendor management. That's career protection and company survival.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* FAQs Section */}
      <section id="faqs" className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              Frequently Asked Questions
            </h2>
            <Button onClick={toggleAllFaqs} variant="outline" data-testid="button-toggle-all-faqs">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {faqsAllExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          <Accordion type="multiple" value={openFaqs} onValueChange={setOpenFaqs} className="space-y-3">
            <AccordionItem value="faq-1" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-1">
                How does CSR help me manage vendor safety across 5-70+ properties?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                CSR provides one portfolio-wide dashboard showing all vendor safety scores across all properties. Filter by property, vendor, compliance category, or score threshold. No more depending on multiple building managers to manually report vendor compliance you cannot verify.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-2">
                What happens when vendor safety scores drop?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Automated alerts notify portfolio managers when vendors fall below acceptable thresholds. Alerts specify which compliance category is deficient (missing inspections, unsigned documents, incomplete project requirements) and recommend corrective actions. Address problems before they become incidents.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-3">
                Can I require minimum CSR scores for vendor contracts?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Yes. Set portfolio-wide safety score requirements for vendor eligibility. Filter available vendors by minimum CSR threshold when selecting contractors. Document vendor selection criteria showing you chose vendors based on objective safety compliance data, not lowest price alone.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-4">
                How does CSR documentation protect against vendor negligence liability?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                CSR creates timestamped audit trails showing when you verified each vendor's safety compliance and at what score. If vendor incidents occur, export reports proving systematic safety monitoring. Courts give significant weight to documentary evidence showing proactive risk management versus reactive responses after incidents.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-5">
                What vendor safety compliance data do insurance carriers want to see?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Insurance carriers require proof of systematic vendor insurance verification, safety documentation tracking, and compliance monitoring. CSR reports show portfolio-wide vendor compliance rates, trend analysis, deficiency remediation timelines, and supporting documentation with timestamps. Transform multi-day audit preparation into instant report generation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-6">
                How do I compare vendor safety performance across my portfolio?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                View all vendors ranked by CSR score. Filter by property, work type, or geographic region. Export comparison reports showing vendor safety performance across multiple buildings. Identify which vendors maintain consistent compliance versus those with scattered deficiencies across properties.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-7">
                Can building managers see vendor CSR scores?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Yes. Building managers see CSR scores for vendors working at their properties. Portfolio managers see all vendors across all properties. Configure visibility based on role and property assignments. Vendors cannot see other vendors' scores.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-8">
                What happens when I acquire new properties with existing vendors?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                New property vendors automatically populate your portfolio dashboard. CSR scores calculate from available compliance data. Identify which inherited vendors meet your safety standards versus which require immediate remediation before contract renewal.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-9">
                How quickly do CSR scores update?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Real-time. When vendors complete harness inspections, sign safety documents, or finish project requirements, scores update immediately. Portfolio managers see current compliance status, not weekly batch updates.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-10" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-10">
                Can I export CSR data for board presentations?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Yes. Generate executive summaries showing portfolio-wide vendor safety performance with color-coded dashboards, trend charts, and benchmark comparisons. Export detailed vendor-by-vendor reports for board audit committees. Create before/after analyses showing compliance improvements after remediation initiatives.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-11" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-11">
                Do vendors know their CSR scores?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Yes. Vendors see their own safety scores with category-by-category breakdowns showing specific areas needing improvement. They cannot see competitor scores. Transparency incentivizes compliance improvement.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-12" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-12">
                How does CSR handle vendors working across multiple properties?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                Vendor CSR scores aggregate compliance data across all properties where they work. Portfolio managers see one unified score reflecting the vendor's safety performance portfolio-wide, not separate scores per property.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Vendor Safety Compliance?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start with a 60-day free trial. No credit card required. See exactly how CSR provides the documented proof that protects your career and company.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#0B64A3] hover:bg-[#0369A1] text-white" asChild data-testid="button-cta-trial">
              <Link href="/register">
                Start Your Free 60-Day Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-cta-contact">
              <Link href="/contact">
                Talk to Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
