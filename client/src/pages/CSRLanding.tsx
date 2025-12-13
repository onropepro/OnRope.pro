import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link, useLocation } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Briefcase,
  HardHat,
  Users,
  Eye,
  AlertTriangle,
  FileText,
  Gauge,
  ClipboardCheck,
  FileCheck,
  Palette,
  Download,
  TrendingUp,
  Clock,
  Award,
  Target,
  ShieldCheck,
  ClipboardList,
  Wrench,
  Building2,
  UserCheck,
  Zap
} from "lucide-react";

export default function CSRLanding() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="modules" />
      
      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              Company Safety Rating Module
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Know exactly how safe<br />
              your company is.<br />
              <span className="text-blue-100">Prove it to anyone who asks.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              The Company Safety Rating transforms scattered paperwork and good intentions into a single, auditable number. Property managers see it when comparing vendors. Technicians see it when evaluating job offers.<br />
              <strong>You see it when building a culture that protects your people and your business.</strong>
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
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">87%</div>
                  <div className="text-base text-muted-foreground mt-1">Average starting CSR</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-sky-600">Real-time</div>
                  <div className="text-base text-muted-foreground mt-1">Score updates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">5 min</div>
                  <div className="text-base text-muted-foreground mt-1">Audit preparation</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">100%</div>
                  <div className="text-base text-muted-foreground mt-1">Achievable compliance</div>
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
            The Safety Problem Nobody Talks About
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                Every rope access company says they're safe. Every one of them.
              </p>
              <p className="text-base">
                But when WorkSafe shows up and asks for proof, most operators scramble through filing cabinets, truck glove boxes, and text message threads looking for documentation that may or may not exist. When a property manager asks which vendor is safer, they're comparing marketing claims, not evidence. When a technician decides whether to accept a job, they're gambling their life on an employer's word.
              </p>
              <p className="text-base font-medium text-foreground">
                Safety without measurement is just hope. And hope is not a strategy when someone's hanging 40 stories up.
              </p>
              <Separator className="my-6" />
              <p className="text-base">
                OnRopePro's Company Safety Rating changes the conversation. Instead of "we're safe," you get a number: 87%. Instead of scattered forms, you get a single dashboard showing exactly where you stand and what needs attention. Instead of guessing, you know.
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
            What the CSR Module Does
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            A penalty-based compliance scoring system that measures safety posture in real time.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Automatic Score Calculation */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <Gauge className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Automatic Score Calculation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">The system tracks every safety document, every harness inspection, every toolbox meeting.</p>
                <p>Your score updates automatically as compliance events occur across your operation. No manual entry. No spreadsheets. No remembering to update anything.</p>
                <p className="font-medium text-foreground mt-4">What gets tracked:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Core company documents (COI, Health & Safety Manual, Company Policy)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Project-level safety documentation (FLHA, RAP, Toolbox Meeting, Anchor Inspection)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Daily harness inspection completion rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Employee acknowledgment status on all safety documents</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 2: Transparent Visibility */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Transparent Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">Different stakeholders see appropriate levels of detail.</p>
                <p>Property managers see your overall score and color-coded compliance badge. Company owners see full breakdowns with improvement recommendations. Technicians see enough to make informed decisions about employers.</p>
                <p className="font-medium text-foreground mt-4">What each role sees:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Users className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span><strong>Property Managers:</strong> Overall %, color badge, category breakdown</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                    <span><strong>Company Owners:</strong> Full dashboard, action items, improvement tips</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <HardHat className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                    <span><strong>Technicians:</strong> Company CSR when evaluating job offers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3: Penalty-Based Accountability */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">Penalty-Based Accountability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">Start at 75%. Reach 100% by uploading three core documents.</p>
                <p>From there, every compliance gap triggers a proportional penalty. Miss a harness inspection? Penalty. Toolbox meeting not completed? Penalty. Employee hasn't signed updated safety procedures? Penalty.</p>
                <p className="font-medium text-foreground mt-4">What creates penalties:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                    <span>Missing or expired company documentation (up to 25%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                    <span>Incomplete project documentation (up to 25%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                    <span>Harness inspections not completed before work (up to 25%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                    <span>Unsigned employee acknowledgments (up to 5%)</span>
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
            Safety visibility for everyone who needs it. Privacy for everyone who doesn't.
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
                    <h4 className="text-lg font-semibold text-foreground">Replace guesswork with certainty.</h4>
                    <p className="text-base text-muted-foreground">You know your crews are safe. You believe in your training. But until now, you had no objective proof. The CSR gives you a single number that reflects your actual compliance posture, updated in real time.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Turn safety into competitive advantage.</h4>
                    <p className="text-base text-muted-foreground">When a property manager compares your 91% rating against a competitor's 47%, they're not comparing marketing materials. They're comparing documented evidence of safety culture.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Protect yourself from regulatory nightmares.</h4>
                    <p className="text-base text-muted-foreground">When WorkSafe arrives, pull up a dashboard showing every harness inspection, every signed document, with timestamps and signatures. Multi-day scrambles become five-minute conversations.</p>
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
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Evaluate employers before accepting jobs.</h4>
                    <p className="text-base text-muted-foreground">Your life is on the line every time you clip in. The CSR lets you see how seriously a potential employer takes safety before you commit. A 95% rating operates differently than a 35%.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Access safety documents anywhere.</h4>
                    <p className="text-base text-muted-foreground">Every policy you've signed, every procedure you've acknowledged, stays accessible in the app. Suspended 40 stories up and need to check company protocol? It's right there.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Build your own safety reputation.</h4>
                    <p className="text-base text-muted-foreground">Your compliance behaviors contribute to company scores. Daily harness inspections, document sign-offs, and toolbox meeting participation create a record that follows you.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Property Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">For Property Managers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Compare vendors on facts, not claims.</h4>
                    <p className="text-base text-muted-foreground">Every rope access company promises they're safe. The CSR gives you objective data to back up or contradict those promises. Color-coded badges show at a glance which contractors maintain their programs.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Reduce your liability exposure.</h4>
                    <p className="text-base text-muted-foreground">Selecting a vendor with documented poor safety practices exposes your management company to liability. The CSR provides due diligence documentation for data-driven vendor decisions.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Justify decisions to owners and boards.</h4>
                    <p className="text-base text-muted-foreground">When building ownership asks why you chose one contractor over another, "they had a 94% safety rating versus 61%" is a defensible answer.</p>
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Key Features
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            The CSR module integrates with every safety-related system in OnRopePro to calculate accurate, real-time compliance scores.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Three-Document Baseline</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Upload your Certificate of Insurance, Health & Safety Manual, and Company Policy to reach 100% baseline. The system tracks expiration dates and renewal status.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Project Document Tracking</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Each project requires four safety documents: Anchor Inspection, Rope Access Plan, Toolbox Meeting, and FLHA. Missing documents trigger proportional penalties.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Harness Inspection Integration</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Daily harness inspections before work sessions contribute directly to your CSR. Consistent compliance over thousands of sessions builds a strong, resilient score.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Employee Document Acknowledgments</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      When you add Safe Work Procedures, your score temporarily decreases until employees review and sign. Ensures every team member has actually read your policies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Palette className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Color-Coded Compliance Badge</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Your CSR displays as a visual badge: green (90-100%), yellow (70-89%), orange (50-69%), or red (below 50%). Property managers see this instantly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Exportable Compliance Reports</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Generate PDF reports showing all employee signatures with timestamps. When WorkSafe asks "how do you know your employees saw this policy?", you have instant proof.
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
      <section id="faqs" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Problems Solved
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Real problems. Real solutions. Organized by who you are.
          </p>

          <Accordion type="multiple" className="space-y-4">
            {/* For Employers */}
            <AccordionItem value="employers" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-lg font-semibold">For Employers</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">"I know I should be safer, but I don't have time to create all the paperwork."</p>
                  <p className="text-muted-foreground text-base">
                    Creating comprehensive safety documentation from scratch takes days of administrative work. Hiring someone to build PDF templates, researching regulatory requirements, getting legal sign-off. Most small operators never get around to it.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>Solution:</strong> OnRopePro provides pre-made templates for Safe Work Procedures and Practices specific to rope access. Add a document in two minutes, send notifications, track sign-offs automatically.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">"When WorkSafe shows up, I can't prove my employees know the procedures."</p>
                  <p className="text-muted-foreground text-base">
                    You've told your crew a hundred times about the rules. They know. But when the regulator asks for documentation proving employees reviewed specific procedures, paper trails are incomplete or missing.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>Solution:</strong> Export a PDF report showing all employee signatures with timestamps. Transform a multi-day compliance scramble into instant verification.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">"I don't know how safe my company actually is."</p>
                  <p className="text-muted-foreground text-base">
                    Without measurable metrics, safety becomes an emotional assessment. You think you're safe because nothing bad has happened yet. That's survivorship bias, not evidence.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>Solution:</strong> CSR provides a single number showing your safety posture instantly. Score drops from 87% to 72%? You know immediately something needs attention.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">"Property managers are choosing competitors over me."</p>
                  <p className="text-muted-foreground text-base">
                    You invest in safety, train your people properly, maintain your equipment. But when bidding against competitors, you have no way to demonstrate that investment.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>Solution:</strong> Your 91% CSR rating versus a competitor's 47% becomes a decisive factor in vendor selection. Convert your safety investment into competitive advantage.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Technicians */}
            <AccordionItem value="technicians" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-lg font-semibold">For Technicians</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">"I don't know if this company is actually safe to work for."</p>
                  <p className="text-muted-foreground text-base">
                    Your life depends on your employer's commitment to safety. Not their marketing. Not their promises during the interview. Their actual day-to-day practices around equipment inspection and compliance.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>Solution:</strong> CSR is visible when you evaluate job offers. Would you rather work for a company with a 40% rating or a 95% rating? Now you can make informed decisions.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">"I need access to safety documents on the job site."</p>
                  <p className="text-muted-foreground text-base">
                    Company policies and procedures live in an office filing cabinet while you're suspended from a building. When you need to check protocol for an unusual situation, you're out of luck.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>Solution:</strong> All signed safety documents are accessible in the app. Need to check company policy on working alone, confined space entry, or emergency procedures? It's right there.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Property Managers */}
            <AccordionItem value="property-managers" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-lg font-semibold">For Property Managers</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">"I can't objectively compare vendor safety."</p>
                  <p className="text-muted-foreground text-base">
                    Every rope access contractor promises excellent safety practices. You have no way to verify those claims or compare them objectively. Current due diligence consists of checking insurance and maybe calling a reference.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>Solution:</strong> View each vendor's CSR through your "My Vendors" dashboard. Color-coded badges provide instant assessment. Make data-driven decisions based on documented compliance.
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
            Measurable Results
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Concrete improvements you'll see from day one.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Target className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Safety Visibility</h3>
                    <p className="text-base text-muted-foreground">
                      Transform "I think we're safe" into "I know we're 87% compliant." Real-time, objective measurement of your safety posture. Score changes alert you to gaps before they become problems.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Documentation Time: Days to Minutes</h3>
                    <p className="text-base text-muted-foreground">
                      Pre-built templates for Safe Work Procedures and Practices specific to rope access. Add a document, notify employees, track sign-offs automatically.
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
                    <Zap className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Regulatory Readiness: Scramble to Export</h3>
                    <p className="text-base text-muted-foreground">
                      WorkSafe inspections typically require producing documentation across multiple categories. The CSR dashboard consolidates everything into exportable reports with timestamps and signatures.
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
                    <Award className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Competitive Differentiation</h3>
                    <p className="text-base text-muted-foreground">
                      Property managers selecting between vendors with visible CSR ratings make objectively different decisions. Your safety investment finally translates into business results.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 text-center" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="max-w-3xl mx-auto text-white space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Stop Hoping You're Safe. Start Knowing.
          </h2>
          <p className="text-lg text-blue-100">
            Upload three documents and see your starting score in minutes.<br />
            Full access. No credit card. Real compliance data from day one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" asChild data-testid="button-cta-trial">
              <Link href="/register">
                Start Your 60-Day Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-cta-guide">
              <Link href="/guides/csr">
                Read the Full Guide
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
            <span className="text-sm text-muted-foreground">Management Software for Rope Access</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-footer-privacy">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="link-footer-terms">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
