import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { EmployerRegistration } from "@/components/EmployerRegistration";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  Users,
  Building2,
  HardHat,
  TrendingUp,
  Award,
  Target,
  ShieldCheck,
  ClipboardCheck,
  FileCheck,
  Gauge,
  RefreshCw,
  Briefcase,
  Eye,
  BarChart3,
  ChevronRight,
  CircleDot,
  UserCheck
} from "lucide-react";

export default function SafetyLanding() {
  const [, setLocation] = useLocation();
  const { openLogin } = useAuthPortal();
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="modules" stakeholderColor="#193a63" />
      
      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #193a63 0%, #112a4d 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-safety-label">
              Raising the Bar for an Entire Industry
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Safety Is Either Measured<br />
              <span className="text-blue-100">or It's Made Up.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              PSR measures technician safety practices.<br />
              CSR measures company safety culture.<br />
              <strong className="text-white">When both are visible, the entire industry gets safer.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#193a63] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-hero-trial">
                Start Building Your Safety Record
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={openLogin} data-testid="button-hero-signin">
                Sign In
              </Button>
            </div>
            
            <p className="text-sm text-blue-200 pt-2">
              Free for technicians. Always. 14-day trial for companies.
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

      {/* Stats Panel */}
      <section className="relative bg-white dark:bg-slate-950 -mt-px overflow-visible">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-12">
          <Card className="shadow-xl border-0 relative z-20 -mt-20">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#AB4521]">Measured</div>
                  <div className="text-base text-muted-foreground mt-1">Or it didn't happen</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#0B64A3]">Portable</div>
                  <div className="text-base text-muted-foreground mt-1">Follows you everywhere</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600">Visible</div>
                  <div className="text-base text-muted-foreground mt-1">To everyone who matters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-violet-600">Permanent</div>
                  <div className="text-base text-muted-foreground mt-1">Can't be faked</div>
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
            Safety Theater vs. Safety Culture
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                Most rope access companies talk about safety. Some have binders full of procedures sitting in the office. A few actually follow them.
              </p>
              <p className="text-base">
                The problem is nobody can tell the difference. A technician interviewing at two companies hears the same pitch: "We take safety seriously." One company does daily harness inspections, holds real toolbox meetings, and makes sure everyone understands the procedures. The other company hands you gear and says "don't fall."
              </p>
              <p className="text-base">
                A property manager evaluating bids sees the same safety claims in every proposal. Everyone has a "comprehensive safety program." Nobody can prove it. Price becomes the only differentiator.
              </p>
              <p className="text-base font-medium text-foreground">
                This system protects nobody.
              </p>
              <Separator className="my-6" />
              <p className="text-base">
                OnRopePro changes the equation by making safety measurable, portable, and visible. Not safety claims. Safety actions. Documented, timestamped, aggregated into scores that follow technicians and companies everywhere they go.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Two Scores Section */}
      <section id="scores" className="pt-8 md:pt-12 pb-16 md:pb-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Two Scores That Change Everything
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            When these scores matter, behavior changes.<br />
            When behavior changes, people actually go home safe.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* PSR Card */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{backgroundColor: '#AB4521'}}></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{backgroundColor: 'rgba(171, 69, 33, 0.1)'}}>
                  <UserCheck className="w-6 h-6" style={{color: '#AB4521'}} />
                </div>
                <CardTitle className="text-xl">PSR: Personal Safety Rating</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base text-muted-foreground">
                  Your individual safety record, aggregated across every employer you've ever worked for on OnRopePro.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-600" />
                    <span className="text-base">How often you complete harness inspections</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-600" />
                    <span className="text-base">How quickly you acknowledge safety documents</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-600" />
                    <span className="text-base">Your compliance rate over time, not just today</span>
                  </div>
                </div>
                <Separator />
                <p className="text-base font-medium">
                  Your PSR is portable. It belongs to you, not your employer. When you apply for a new job, employers see your safety rating before they hire you.
                </p>
              </CardContent>
            </Card>

            {/* CSR Card */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#0B64A3]"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-[#0B64A3]" />
                </div>
                <CardTitle className="text-xl">CSR: Company Safety Rating</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base text-muted-foreground">
                  Your company's safety culture, calculated from operational data across four categories.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <FileCheck className="w-5 h-5 mt-0.5 text-[#0B64A3]" />
                    <span className="text-base">Core Documentation (25%)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ClipboardCheck className="w-5 h-5 mt-0.5 text-[#0B64A3]" />
                    <span className="text-base">Project Documentation (25%)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <HardHat className="w-5 h-5 mt-0.5 text-[#0B64A3]" />
                    <span className="text-base">Harness Inspections (25%)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="w-5 h-5 mt-0.5 text-[#0B64A3]" />
                    <span className="text-base">Document Acknowledgment (5%)</span>
                  </div>
                </div>
                <Separator />
                <p className="text-base font-medium">
                  CSR is visible to property managers. When they compare bids, they're comparing 86% versus 43%. Green badge versus red badge.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* The Flywheel Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            OnRopePro Is Giving Safety a Value
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            A self-reinforcing cycle where everyone wins by prioritizing safety.
          </p>

          <div className="max-w-3xl mx-auto mb-16 space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Safety has always been theoretical. Companies say the right words. Techs nod along. Nobody measures anything. Nothing changes.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're making safety practical. Measurable. Tradeable.
              When a technician's PSR affects their job prospects, they care about their inspections. When a company's CSR affects their contract wins, they invest in their culture. When property managers choose vendors by safety score, the market rewards the right behavior.
            </p>
            <p className="text-lg font-medium text-foreground leading-relaxed">
              This isn't compliance software. This is infrastructure that makes safety worth something. The entire industry rises because the incentives finally align.
            </p>
          </div>

          <div className="space-y-6">
            {/* Stage 1 */}
            <Card className="border-l-4 border-l-[#AB4521] border-t-0 border-r-0 border-b-0 rounded-none bg-slate-50 dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0" style={{backgroundColor: '#AB4521'}}>1</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Technicians Start Caring About Their Score</h3>
                    <p className="text-base text-muted-foreground">
                      When PSR follows you everywhere, you start paying attention. That harness inspection you used to skip when you were "in a hurry"? It affects your score. Suddenly, safety isn't something the boss nags you about. It's your professional reputation. It's career capital.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage 2 */}
            <Card className="border-l-4 border-l-[#0B64A3] border-t-0 border-r-0 border-b-0 rounded-none bg-slate-50 dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0B64A3] flex items-center justify-center font-bold text-white shrink-0">2</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Employers Hire Based on PSR</h3>
                    <p className="text-base text-muted-foreground">
                      A technician applies with a 92% PSR. Another applies with a 58% PSR. Same certifications. Similar experience. Which one do you trust with your company's reputation? Employers start filtering for high-PSR candidates. The message spreads: if you want the good jobs, maintain your rating.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage 3 */}
            <Card className="border-l-4 border-l-emerald-500 border-t-0 border-r-0 border-b-0 rounded-none bg-slate-50 dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white shrink-0">3</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">High-PSR Techs Raise Company Standards</h3>
                    <p className="text-base text-muted-foreground">
                      When you hire people who take safety seriously, your company culture shifts. They do their inspections without being reminded. They sign documents promptly. They hold each other accountable. Your CSR rises because your team is actually doing the work.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage 4 */}
            <Card className="border-l-4 border-l-[#6E9075] border-t-0 border-r-0 border-b-0 rounded-none bg-slate-50 dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0" style={{backgroundColor: '#6E9075'}}>4</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Property Managers Choose High-CSR Vendors</h3>
                    <p className="text-base text-muted-foreground">
                      Two bids on the table. Similar pricing. One vendor shows 91% CSR. The other shows 52% CSR. The property manager has liability concerns. The board asks questions. The high-CSR vendor wins. Not because they talked better. Because they proved they're better.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage 5 */}
            <Card className="border-l-4 border-l-violet-500 border-t-0 border-r-0 border-b-0 rounded-none bg-slate-50 dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center font-bold text-white shrink-0">5</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Market Pressure Forces Industry Improvement</h3>
                    <p className="text-base text-muted-foreground">
                      Companies losing bids to high-CSR competitors have a choice: improve or keep losing. The cowboys who undercut on price while cutting corners find themselves locked out of quality contracts. 
                    </p>
                    <p className="text-base text-muted-foreground">
                      <strong className="text-foreground">The industry standard rises. Not because of regulation. Because the incentives aligned.</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* For Stakeholders Section */}
      <section className="pt-8 md:pt-12 pb-16 md:pb-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What This Means For You
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* For Technicians */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{backgroundColor: '#AB4521'}}></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{backgroundColor: 'rgba(171, 69, 33, 0.1)'}}>
                  <HardHat className="w-6 h-6" style={{color: '#AB4521'}} />
                </div>
                <CardTitle className="text-lg">For Technicians</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">Higher PSR = Better opportunities</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">Your safety record protects you in incidents</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">Evaluate employers before you commit</span>
                </div>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground italic">
                  "Would you rather work for a company with a 40 CSR or a 95 CSR? Your life is on the line."
                </p>
                <Link href="/technician">
                  <Button variant="outline" size="sm" className="w-full mt-2" data-testid="button-learn-technician">
                    Learn More <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* For Company Owners */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#0B64A3]"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Briefcase className="w-6 h-6 text-[#0B64A3]" />
                </div>
                <CardTitle className="text-lg">For Company Owners</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">Win contracts you used to lose</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">Attract better technicians</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">Protected when WorkSafe shows up</span>
                </div>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground italic">
                  "I know all my people have read this document because they've signed it."
                </p>
                <Link href="/employer">
                  <Button variant="outline" size="sm" className="w-full mt-2" data-testid="button-learn-employer">
                    Learn More <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* For Property Managers */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{backgroundColor: '#6E9075'}}></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{backgroundColor: 'rgba(110, 144, 117, 0.1)'}}>
                  <Building2 className="w-6 h-6" style={{color: '#6E9075'}} />
                </div>
                <CardTitle className="text-lg">For Property Managers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">Defensible vendor selection</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">Leverage to improve vendor performance</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">Reduced liability exposure</span>
                </div>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground italic">
                  "They have a 92% CSR. Their documentation is complete and current."
                </p>
                <Link href="/property-manager">
                  <Button variant="outline" size="sm" className="w-full mt-2" data-testid="button-learn-pm">
                    Learn More <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Why Scores Work Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why This Matters Beyond Business
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            The real goal: people going home safe.
          </p>
          
          <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4">
              <p className="text-base text-muted-foreground">
                Rope access is dangerous work. Falls kill. Equipment failures kill. Skipped procedures kill.
              </p>
              <p className="text-base text-muted-foreground">
                The industry talks about safety because everyone knows the stakes. But talking isn't enough. Systems that enforce safety are what actually protect people.
              </p>
              <div className="space-y-3 py-4">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 mt-0.5 text-[#AB4521]" />
                  <p className="text-base"><strong>PSR makes technicians care</strong> about their own safety practices because those practices now affect their careers.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 mt-0.5 text-[#0B64A3]" />
                  <p className="text-base"><strong>CSR makes companies care</strong> about their safety culture because that culture now affects their revenue.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 mt-0.5 text-[#6E9075]" />
                  <p className="text-base"><strong>Property manager behavior</strong> makes the market reward safety because vendors with high CSR win contracts.</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-foreground text-center pt-4">
                When incentives align with safety, safety happens. <br />
                Not as an afterthought.<br />
                As the foundation of how the industry operates.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-0" />

      {/* FAQ Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="new-psr" className="bg-white dark:bg-slate-950 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium" data-testid="accordion-new-psr">
                What if I've never used OnRopePro before? Do I start with a zero PSR?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                New technicians start building their PSR from their first inspection. There's no penalty for being new. Your score reflects your actual history on the platform.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="fake-inspection" className="bg-white dark:bg-slate-950 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium" data-testid="accordion-fake-inspection">
                Can I fake a harness inspection just to keep my score up?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                No. The system requires you to step through each equipment category. Failed items automatically retire in inventory. The process takes 30 seconds when done honestly. Gaming it would take longer and create equipment management problems.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="psr-employer" className="bg-white dark:bg-slate-950 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium" data-testid="accordion-psr-employer">
                What happens to my PSR if my employer has a low CSR?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                Your PSR is independent. It tracks your individual compliance, not your employer's overall score. A disciplined tech working for a disorganized company still builds strong PSR through their own actions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="new-company" className="bg-white dark:bg-slate-950 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium" data-testid="accordion-new-company">
                We're a new company. Won't we be at a disadvantage with a short history?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                New companies can reach 100% CSR immediately by uploading core documents and maintaining daily compliance. History matters for weathering occasional lapses, but new companies with disciplined practices quickly build competitive scores.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pm-see-psr" className="bg-white dark:bg-slate-950 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium" data-testid="accordion-pm-see-psr">
                Do property managers see individual technician ratings?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                No. Property managers see company CSR only. Individual PSR is visible to employers during hiring, not to external parties.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="disagree-csr" className="bg-white dark:bg-slate-950 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium" data-testid="accordion-disagree-csr">
                What if I disagree with my CSR calculation?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                The dashboard shows exactly where you're losing points. If documentation shows 85% but you believe you're at 100%, you can see exactly which documents are missing signatures. The system doesn't hide its logic.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="surveillance" className="bg-white dark:bg-slate-950 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium" data-testid="accordion-surveillance">
                This seems like surveillance. Is it?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                It's accountability. The same way a pilot's flight hours and certifications are tracked, your professional safety actions are tracked. This protects you when things go wrong. It builds your reputation when things go right. Your data belongs to you and travels with you.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 text-center" style={{backgroundColor: '#193a63'}}>
        <div className="max-w-3xl mx-auto text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Building Your Safety Record Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Your safety practices are either measured or they're made up. Start measuring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#193a63] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-cta-start">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Link href="/modules/company-safety-rating">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" data-testid="button-cta-csr">
                Learn About CSR
              </Button>
            </Link>
            <Link href="/changelog/psr">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" data-testid="button-cta-psr">
                Learn About PSR
              </Button>
            </Link>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            Free for technicians. Always. 14-day trial for companies. No credit card required.
          </p>
        </div>
      </section>

      {/* Registration Modal */}
      <EmployerRegistration 
        open={showRegistration} 
        onOpenChange={setShowRegistration}
      />
    </div>
  );
}
