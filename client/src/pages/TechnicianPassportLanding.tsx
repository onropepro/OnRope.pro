import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { Link } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import {
  ArrowRight,
  BookOpen,
  HardHat,
  Briefcase,
  Building2,
  Globe,
  Clock,
  Award,
  Shield,
  FileText,
  Users,
  Link2,
  Zap,
  TrendingUp,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Search,
  ChevronsUpDown,
  Eye,
  AlertTriangle,
  Folder,
  Timer,
  Network,
  ArrowUp
} from "lucide-react";

export default function TechnicianPassportLanding() {
  const [expandedOwnerProblems, setExpandedOwnerProblems] = useState<string[]>([]);
  const [expandedBMProblems, setExpandedBMProblems] = useState<string[]>([]);
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);

  const allOwnerProblemIds = ["owner-1", "owner-2", "owner-3", "owner-4", "owner-5"];
  const allBMProblemIds = ["bm-1"];
  const allFaqIds = ["faq-1", "faq-2", "faq-3", "faq-4", "faq-5", "faq-6", "faq-7", "faq-8", "faq-9", "faq-10"];

  const toggleAllOwnerProblems = () => {
    if (expandedOwnerProblems.length === allOwnerProblemIds.length) {
      setExpandedOwnerProblems([]);
    } else {
      setExpandedOwnerProblems(allOwnerProblemIds);
    }
  };

  const toggleAllBMProblems = () => {
    if (expandedBMProblems.length === allBMProblemIds.length) {
      setExpandedBMProblems([]);
    } else {
      setExpandedBMProblems(allBMProblemIds);
    }
  };

  const toggleAllFaqs = () => {
    if (expandedFaqs.length === allFaqIds.length) {
      setExpandedFaqs([]);
    } else {
      setExpandedFaqs(allFaqIds);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="modules" />
      
      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              Technician Passport Module
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Your Next Hire Is<br />
              <span className="text-blue-100">Already Onboarded.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Technicians on OnRopePro carry verified credentials, complete work history, and banking details in one portable profile. When they connect to your company, you receive everything instantly.<br />
              <strong>No paperwork. No verification calls. No waiting.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" onClick={() => scrollToSection('problem')} data-testid="button-hero-see-how">
                See How It Works
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-hero-trial">
                <Link href="/employer">
                  Start Your Free Trial
                  <Zap className="ml-2 w-5 h-5" />
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
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">10s</div>
                  <div className="text-base text-muted-foreground mt-1">Onboarding time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">100%</div>
                  <div className="text-base text-muted-foreground mt-1">Compliance rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">Zero</div>
                  <div className="text-base text-muted-foreground mt-1">Paperwork to chase</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">60+ min</div>
                  <div className="text-base text-muted-foreground mt-1">Time saved per hire</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Problem Statement Section */}
      <section id="problem" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Hiring Shouldn't Take Longer Than the First Day of Work
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                You find a qualified tech. Level 2, First Aid, available immediately. Perfect.
              </p>
              <p className="text-base">
                Then the paperwork starts.
              </p>
              <p className="text-base">
                Email the onboarding forms. Wait for them to fill out banking details. Chase the certification copies. Verify with IRATA (eventually). Send safety documentation. Wait for signatures. File everything (somewhere). Hope nothing gets lost before the next audit.
              </p>
              <p className="text-base font-medium text-foreground">
                By the time they're officially "onboarded," you've burned 60+ minutes of admin time. Multiply that by every hire, every season.
              </p>
              <p className="text-base">
                Meanwhile, that tech filled out the exact same forms for their last three employers. The same banking details. The same emergency contacts. The same certification copies.
              </p>
              <Separator className="my-6" />
              <p className="font-medium text-foreground text-lg">
                OnRopePro eliminates the redundancy. Technicians create one profile that travels with them. When they connect to your company, their verified credentials, work history, and personal details transfer in 10 seconds.
              </p>
              <p className="font-medium text-foreground">
                Your job is running projects. Not chasing paperwork.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-0" />

      {/* What You Get When a Tech Connects Section */}
      <section id="features" className="pt-8 md:pt-12 pb-16 md:pb-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What You Get When a Tech Connects
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            Every technician with an OnRopePro Passport carries their complete professional identity. When they accept your invitation, you receive:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Verified Credentials */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Verified Credentials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">Know exactly who you're hiring. Before they start.</p>
                <p>Search any IRATA or SPRAT license number and instantly see: name, certification level, First Aid status, and location. The tech approves the connection before you access their full profile. No more blurry photos of certifications. No more hiring based on unverified claims.</p>
                <p className="font-medium text-foreground mt-4">What you verify:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>IRATA/SPRAT level and license number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Certification expiry dates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>First Aid and supplementary qualifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Work history across previous employers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Personal safety rating</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 2: Complete Onboarding Data */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">Complete Onboarding Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">Everything you need for payroll and compliance. Already filled out.</p>
                <p>When a tech connects, you receive their banking details, SIN (if provided), emergency contacts, and address. No forms to email. No data to re-enter. No waiting for responses that never come.</p>
                <p className="font-medium text-foreground mt-4">What transfers automatically:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Banking details for direct deposit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Address and contact information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Emergency contact details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Resume and certifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Tax information (optional)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3: Automatic Safety Compliance */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Automatic Safety Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">100% acknowledgment rate. Zero chasing.</p>
                <p>When techs accept your invitation, they must read and sign all your safety procedures before accessing the Work Dashboard. New safety document added mid-season? Existing techs can't continue until they acknowledge it. Complete audit trail with timestamps.</p>
                <p className="font-medium text-foreground mt-4">What gets enforced:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Safety procedure acknowledgment before work begins</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Mandatory document signing for all new policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Harness inspection completion tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Audit-ready compliance records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>Zero "I didn't know" excuses</span>
                  </li>
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
            Every stakeholder in the rope access ecosystem gains from technician portability and verified credentials.
          </p>

          <div className="space-y-8">
            {/* For Company Owners */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">For Company Owners</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Onboard in 10 seconds, not 60 minutes</h4>
                    <p className="text-base text-muted-foreground">A tech with an OnRopePro Passport connects to your company with one click. You receive their complete profile instantly. Banking details, certifications, emergency contacts, work history. No forms. No verification calls. No data entry.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Verify qualifications before you hire</h4>
                    <p className="text-base text-muted-foreground">Search any IRATA license number and see their level, First Aid status, expiry date, and location. The tech must approve the connection before you receive full access. Never hire based on unverified claims again.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Guarantee safety compliance</h4>
                    <p className="text-base text-muted-foreground">Techs cannot access your Work Dashboard until they've read and signed every safety procedure. When you add a new policy, existing techs must acknowledge it before continuing. 100% compliance rate. Instant audit response.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Eliminate payroll disputes</h4>
                    <p className="text-base text-muted-foreground">When techs log hours through OnRopePro, every session records automatically: building address, heights, tasks performed, duration. Complete, timestamped records replace paper timesheets and "he said, she said" disputes.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Supervisors/Ops Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-violet-50 dark:bg-violet-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-xl">For Supervisors and Ops Managers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">See who's actually qualified</h4>
                    <p className="text-base text-muted-foreground">View certification levels, expiry dates, and safety ratings for every tech on your roster. Assign the right people to the right projects. Know when someone's cert is about to expire before it causes problems on site.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Track work in real-time</h4>
                    <p className="text-base text-muted-foreground">See which techs are assigned to which projects. View logged hours by building, by elevation, by task. No more piecing together paper timesheets at the end of the week.</p>
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
                    <h4 className="text-lg font-semibold text-foreground">One profile, every employer</h4>
                    <p className="text-base text-muted-foreground">Techs create their Passport once and carry it across their entire career. When they join your company, everything transfers automatically. When they leave, their work history goes with them. They're not starting over every time.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Automatic hour tracking</h4>
                    <p className="text-base text-muted-foreground">Every work session logs to their Passport with building address, heights, tasks, and duration. They never have to reconstruct months of work from memory for their IRATA logbook again.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Building Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">For Building Managers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">Verify your contractor's techs instantly</h4>
                  <p className="text-base text-muted-foreground">Through the Building Manager Portal, property managers can view certification levels, expiry dates, and safety ratings for techs working on their buildings. Protect their liability. Protect yours.</p>
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
            Every feature saves you time, reduces risk, or both.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">License Number Search</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                Search any IRATA or SPRAT license number. See name, certification level, First Aid status, and location instantly. The tech approves the connection before you receive their full profile.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-lg">Instant Profile Transfer</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                When a tech connects, you receive their complete profile in seconds: banking details, certifications, emergency contacts, work history, and safety rating. No forms to send. No responses to chase.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-lg">Mandatory Safety Acknowledgment</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                Techs cannot access your Work Dashboard until they've read and signed all safety procedures. Add a new policy mid-season? Existing techs must acknowledge before continuing. 100% compliance, guaranteed.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-violet-600" />
                </div>
                <CardTitle className="text-lg">Automatic Hour Logging</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                When techs work on your projects, every session logs automatically: building address, heights, specific tasks, duration. Sessions group by project. Export for payroll or audits anytime.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <CardTitle className="text-lg">Certification Expiry Visibility</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                See expiry dates for every tech's IRATA certification. Yellow flags at 60 days. Red flags at 30 days. Know before problems happen on site.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-cyan-600" />
                </div>
                <CardTitle className="text-lg">Safety Rating Access</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                Each tech carries a personal safety rating based on harness inspection completion and document acknowledgments across all their employers. See who takes compliance seriously.
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
            Problems This Module Solves
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Real solutions to the problems you face every day.
          </p>

          {/* For Company Owners */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">For Company Owners</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleAllOwnerProblems} data-testid="button-toggle-owner-problems">
                <ChevronsUpDown className="w-4 h-4 mr-2" />
                {expandedOwnerProblems.length === allOwnerProblemIds.length ? "Collapse All" : "Expand All"}
              </Button>
            </div>
            
            <Accordion type="multiple" value={expandedOwnerProblems} onValueChange={setExpandedOwnerProblems}>
              <AccordionItem value="owner-1">
                <AccordionTrigger className="text-base font-medium" data-testid="accordion-owner-1">
                  "Onboarding paperwork gets lost in email chaos."
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground space-y-3">
                  <p>New hire accepts job. You email safety documentation. They read it (maybe). They sign it (eventually). They email it back (sometimes to the wrong person). You file it (somewhere). Six months later, an insurance auditor asks for proof. Three are missing. Two have unsigned pages. You spend two hours searching inboxes.</p>
                  <p className="font-medium text-foreground">When a tech accepts your OnRopePro invitation, they must read and sign all safety documentation before accessing the Work Dashboard. Documents stored permanently with audit timestamps. No dashboard access until compliance is complete.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="owner-2">
                <AccordionTrigger className="text-base font-medium" data-testid="accordion-owner-2">
                  "I can't verify a tech's qualifications quickly."
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground space-y-3">
                  <p>Applicant claims Level 2 with First Aid. You ask for copies. They send blurry phone photos. You email IRATA for verification. Days pass. You need bodies on site tomorrow.</p>
                  <p className="font-medium text-foreground">Search their license number in OnRopePro. Name, level, First Aid status, location appear instantly. The tech approves the connection before you access their full profile. Verified in seconds, not days.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="owner-3">
                <AccordionTrigger className="text-base font-medium" data-testid="accordion-owner-3">
                  "A tech claimed hours that didn't match the project."
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground space-y-3">
                  <p>Paper timesheets show 8 hours. No detail on which building, which elevation, what tasks. The client disputes the invoice. You can't prove the work happened as billed.</p>
                  <p className="font-medium text-foreground">When techs connect to your company, every work session logs automatically: building address, heights, specific tasks (descend, ascend, rigging, rope transfer, re-anchor), and duration. Complete, timestamped, undisputable.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="owner-4">
                <AccordionTrigger className="text-base font-medium" data-testid="accordion-owner-4">
                  "My supervisor discovered an expired certification on site."
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground space-y-3">
                  <p>A tech's IRATA lapsed two weeks ago. Nobody noticed. The building manager asks for documentation. You scramble. The client threatens contract penalties.</p>
                  <p className="font-medium text-foreground">OnRopePro shows certification expiry dates for every connected tech. Yellow badge at 60 days. Red badge at 30 days. You see problems before they become emergencies.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="owner-5">
                <AccordionTrigger className="text-base font-medium" data-testid="accordion-owner-5">
                  "Every new hire means 60+ minutes of paperwork."
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground space-y-3">
                  <p>Banking details. Emergency contacts. Certification copies. Tax forms. Safety acknowledgments. The same information you collected from their last employer. The same information you'll collect again when the next tech joins.</p>
                  <p className="font-medium text-foreground">Techs with OnRopePro Passports carry everything with them. One click to connect. Complete profile transfers in 10 seconds. Your admin time drops to nearly zero.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Building Managers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold">For Building Managers</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleAllBMProblems} data-testid="button-toggle-bm-problems">
                <ChevronsUpDown className="w-4 h-4 mr-2" />
                {expandedBMProblems.length === allBMProblemIds.length ? "Collapse All" : "Expand All"}
              </Button>
            </div>
            
            <Accordion type="multiple" value={expandedBMProblems} onValueChange={setExpandedBMProblems}>
              <AccordionItem value="bm-1">
                <AccordionTrigger className="text-base font-medium" data-testid="accordion-bm-1">
                  "I can't verify contractor technician qualifications."
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground space-y-3">
                  <p>You hire a rope access company, but how do you know their technicians are certified? You request documentation. It takes days. Certifications might be expired. A resident complains about workers outside their window. The strata council demands proof.</p>
                  <p className="font-medium text-foreground">Through the Building Manager Portal, property managers view technician profiles for contractors working on their buildings: certification levels, expiry dates, safety ratings. Real-time verification without phone calls.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Measurable Results Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Measurable Results
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Real metrics that impact your bottom line.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                  <Timer className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">60+ min to 10 sec</h3>
                <p className="text-lg font-semibold text-foreground mb-2">Time Savings</p>
                <p className="text-base text-muted-foreground">Every tech with an OnRopePro Passport connects instantly. Banking details, certifications, emergency contacts, work history. All transferred automatically. Multiply by every hire, every season.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-600 mb-2">100% acknowledgment</h3>
                <p className="text-lg font-semibold text-foreground mb-2">Risk Reduction</p>
                <p className="text-base text-muted-foreground">Techs cannot access the Work Dashboard until they've signed every required safety procedure. No exceptions. No chasing. No "I didn't know" excuses during an incident investigation.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-amber-600 mb-2">Complete records</h3>
                <p className="text-lg font-semibold text-foreground mb-2">Dispute Elimination</p>
                <p className="text-base text-muted-foreground">Every logged session includes building address, heights, tasks, and duration. Client disputes an invoice? Export the records. Audit request? One click.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-2xl font-bold text-violet-600 mb-2">Zero expired certs</h3>
                <p className="text-lg font-semibold text-foreground mb-2">Compliance Certainty</p>
                <p className="text-base text-muted-foreground">Expiry visibility across your entire roster. Yellow warnings at 60 days. Red warnings at 30 days. Prevent problems before they cost you contracts.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Network Effect Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
              <Network className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Hundreds of Techs Already Have Passports
            </h2>
            <p className="text-lg text-muted-foreground">
              Your next hire might be one of them.
            </p>
          </div>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-base text-muted-foreground">
              <p>OnRopePro isn't starting from zero.</p>
              <p>Technicians across Canada are creating Passports right now. Storing certifications. Building work history. Preparing for the next opportunity.</p>
              <p>When you join OnRopePro, you're not just getting software. You're getting access to a network of verified professionals who are already onboarded.</p>
              <p>That Level 2 tech who applies next month? They might already have a Passport. Their certifications are verified. Their banking details are stored. Their safety rating is established.</p>
              <Separator className="my-6" />
              <p className="font-medium text-foreground text-lg">One click to connect. Ten seconds to onboard. Back to billable work.</p>
              <p>Every tech who joins the network makes your next hire faster. Every employer who joins makes the Passport more valuable for techs. The network grows in both directions.</p>
              <p className="font-medium text-foreground">The question isn't whether your industry will standardize on digital credentials. It's whether you'll be ahead of it or behind it.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Connected Modules Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Connected Modules
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            Technician Passports integrate with every OnRopePro module. Data flows automatically. No re-entry required.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Project Management</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                Assign techs to projects. Their work sessions log to both the project timeline and their personal Passport. Hours roll up automatically for billing and payroll.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-lg">Payroll Processing</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                Logged hours feed directly into payroll calculations. Banking details from Passports eliminate data entry. No more chasing forms before you can cut checks.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-lg">Safety & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                Harness inspection completions and document acknowledgments sync to both your company records and the tech's personal safety rating. Complete audit trail on both sides.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-violet-600" />
                </div>
                <CardTitle className="text-lg">Time Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                Clock-in, clock-out, break tracking. Every entry syncs to the tech's Passport. Dispute-proof timekeeping.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-rose-600" />
                </div>
                <CardTitle className="text-lg">Job Board</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                Post positions to the OnRopePro Job Board. Techs with PLUS accounts apply with one click. Their complete Passport sends automatically. Qualified applicants, pre-verified.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* How This Improves Your Business Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Stop Managing Paperwork. Start Managing Projects.
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-base text-muted-foreground">
              <p>How many hours does your office spend on onboarding paperwork every month?</p>
              <p>Forms sent. Forms returned. Forms missing. Forms re-sent. Certifications verified. Banking details entered. Safety documents signed (eventually). Everything filed (somewhere).</p>
              <p>That's admin time. Not billable time. Not project time. Not growth time.</p>
              <Separator className="my-6" />
              <p className="font-medium text-foreground">OnRopePro shifts the burden from your office to the tech's Passport. They fill everything out once. You receive it instantly, every time they connect.</p>
              <p>Your onboarding becomes: Search license number. Send invitation. Receive profile. Done.</p>
              <p>Your compliance becomes: Tech logs in. Signs documents. Starts work. Records kept.</p>
              <p>Your payroll becomes: Hours logged. Data synced. Disputes eliminated.</p>
              <Separator className="my-6" />
              <p>The techs who use OnRopePro get faster onboarding, automatic hour tracking, and a portable career record. You get verified credentials, guaranteed compliance, and hours of admin time back every week.</p>
              <p className="font-medium text-foreground text-lg">That time goes back into running projects. Growing the business. Actually building something.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-0" />

      {/* FAQs Section */}
      <section id="faqs" className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Everything you need to know about the Technician Passport module.
          </p>

          <div className="flex justify-end mb-4">
            <Button variant="ghost" size="sm" onClick={toggleAllFaqs} data-testid="button-toggle-all-faqs">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {expandedFaqs.length === allFaqIds.length ? "Collapse All" : "Expand All"}
            </Button>
          </div>
          
          <Accordion type="multiple" value={expandedFaqs} onValueChange={setExpandedFaqs}>
            <AccordionItem value="faq-1">
              <AccordionTrigger className="text-base font-medium" data-testid="accordion-faq-1">
                What if a tech doesn't have an OnRopePro Passport?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                You can still add them as an employee the traditional way. But you'll collect their information manually, verify certifications yourself, and chase safety acknowledgments via email. The value of Passports is that everything is already done.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-base font-medium" data-testid="accordion-faq-2">
                How do techs get Passports?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Technicians create free accounts at onrope.pro/technician. They enter their information once, store certifications, and connect to employers as needed. Encourage your current techs to create Passports. They'll benefit from portable work history, and you'll benefit from automatic data transfer when future techs already have profiles.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-base font-medium" data-testid="accordion-faq-3">
                What information do I see before a tech approves the connection?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                License number search shows: name, certification level, First Aid status, and location. Full profile access (banking, work history, safety rating) requires the tech's approval.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-base font-medium" data-testid="accordion-faq-4">
                Can techs change their information after connecting?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Yes. If a tech updates their address or banking details, the changes sync to all connected employers automatically. No more outdated forms in your files.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-5">
              <AccordionTrigger className="text-base font-medium" data-testid="accordion-faq-5">
                Is sensitive data secure?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                All financial data (banking, SIN) is encrypted using AES-256-GCM and stored on SOC2 Type II compliant infrastructure. OnRopePro operates in compliance with PIPEDA (Canada) and applicable provincial privacy legislation.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-6">
              <AccordionTrigger className="text-base font-medium" data-testid="accordion-faq-6">
                What happens when a tech leaves my company?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Their Passport (certifications, work history, safety rating) stays with them. Your company retains records of work they completed while connected. Clean separation for both sides.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-7">
              <AccordionTrigger className="text-base font-medium" data-testid="accordion-faq-7">
                Can I require techs to use OnRopePro?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Yes. Many employers will find it valuable to require techs to create Passports as a condition of employment. The tech gets portable work history. You get automatic onboarding. Both sides benefit.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-8">
              <AccordionTrigger className="text-base font-medium" data-testid="accordion-faq-8">
                How does this work with existing employees?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Invite existing employees to create Passports. Once they do, their future work sessions log automatically. Historical data from before they had Passports stays in your existing records.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-9">
              <AccordionTrigger className="text-base font-medium" data-testid="accordion-faq-9">
                What does this cost?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Technician Passports are free for techs. For employers, OnRopePro pricing is $99/month base plus $34.95 per employee. Passports are included, not a separate charge.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-10">
              <AccordionTrigger className="text-base font-medium" data-testid="accordion-faq-10">
                How do I get started?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Create an employer account at onrope.pro. Invite your current techs to create Passports. Start experiencing 10-second onboarding with your next hire.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 px-4" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Your Next Hire Doesn't Have to Take an Hour
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Verified credentials. Complete work history. Banking details ready. Safety compliance guaranteed.
            Techs with OnRopePro Passports carry everything you need. One click to connect. Ten seconds to onboard.
          </p>
          <p className="text-lg text-blue-100 mb-8 font-medium">
            Stop chasing paperwork. Start building.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" asChild data-testid="button-final-cta-trial">
              <Link href="/employer">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={() => scrollToSection('features')} data-testid="button-final-cta-platform">
              See the Platform
              <ArrowUp className="ml-2 w-5 h-5" />
            </Button>
          </div>
          
          <p className="text-blue-200 text-base">
            $99/month + $34.95 per employee. 90-day free trial.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <img src={onRopeProLogo} alt="OnRopePro" className="h-10 w-auto" />
              <span className="text-lg font-semibold text-white">OnRopePro</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm">
                Built for the rope access industry. Designed for professionals who work at height.
              </p>
              <p className="text-sm mt-2 text-slate-400">
                &copy; {new Date().getFullYear()} OnRopePro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
