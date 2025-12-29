import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { PublicHeader } from "@/components/PublicHeader";
import { SoftwareReplaces, MODULE_SOFTWARE_MAPPING } from "@/components/SoftwareReplaces";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import {
  ArrowRight,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Globe,
  TrendingUp,
  Award,
  Bell,
  Users,
  Shield,
  DollarSign,
  Zap,
  Send,
  ToggleLeft
} from "lucide-react";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

const TECHNICIAN_COLOR = "#95ADB6";
const TECHNICIAN_GRADIENT_END = "#7A9BA5";

export default function TechnicianJobBoardLanding() {
  const [faqOpen, setFaqOpen] = useState<string[]>([]);
  const { openLogin } = useAuthPortal();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="technician" />
      
      {/* Hero Section - Rust Brown Gradient */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: `linear-gradient(135deg, ${TECHNICIAN_COLOR} 0%, ${TECHNICIAN_GRADIENT_END} 100%)`}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-job-board-module">
              Job Board Module
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              One Job Board.<br />
              Every Urban Rope Access Gig.<br />
              <span className="text-orange-100">Zero Pipe Fitter Listings.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
              Search "rope access" on Indeed and get oil rigs, pipe fitting, and random construction gigs.<br />
              <strong>OnRopePro's Job Board shows only urban rope access building maintenance jobs. Every employer is verified. Every listing is relevant.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white hover:bg-orange-50" style={{color: TECHNICIAN_COLOR}} asChild data-testid="button-hero-create-account">
                <Link href="/technician?register=true">
                  Create Your Free Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10" 
                onClick={openLogin}
                data-testid="button-hero-login"
              >
                Sign In
              </Button>
            </div>
            
            <p className="text-sm text-orange-100/80">
              (No credit card. No spam. Takes 60 seconds.)
            </p>

            <SoftwareReplaces 
              software={MODULE_SOFTWARE_MAPPING["technician-job-board"]} 
              className="mt-8 bg-white/5 rounded-lg mx-auto max-w-2xl [&_span]:text-orange-100 [&_svg]:text-orange-200"
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

      {/* Tier Breakdown Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Two Tiers. Both Free Right Now.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every rope access technician deserves access to real opportunities. Here's exactly what you get.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* FREE Tier */}
            <Card className="border-2 border-border" data-testid="card-free-tier">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-2xl">FREE Account</CardTitle>
                  <Badge variant="secondary" className="text-base px-3 py-1">Free Forever</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Search className="w-5 h-5 text-[#95ADB6] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Browse All Jobs</p>
                      <p className="text-sm text-muted-foreground">Filter by city, job type, and certification level. Every listing is rope access building maintenance. No oil rigs. No pipe fitting.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-[#95ADB6] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Apply in 30 Seconds</p>
                      <p className="text-sm text-muted-foreground">Your profile, resume, and certifications auto-attach. One tap application. No retyping the same information 15 times.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#95ADB6] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Track Application Status</p>
                      <p className="text-sm text-muted-foreground">See when employers view your application. Know where you stand without chasing follow-ups.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-[#95ADB6] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Portable Profile</p>
                      <p className="text-sm text-muted-foreground">Your IRATA/SPRAT certification number becomes your permanent identifier. Your professional history follows you, not your employer.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-[#95ADB6] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Set Your Expected Pay Rate</p>
                      <p className="text-sm text-muted-foreground">Tell employers what you're worth before they reach out. No wasted interviews with companies that can't meet your number.</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Who It's For:</strong> Techs who want to browse opportunities, apply to specific jobs, and keep their profile private until they're ready.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* PLUS Tier */}
            <Card className="border-2 border-[#95ADB6] relative overflow-hidden" data-testid="card-plus-tier">
              <div className="absolute top-0 right-0 bg-[#95ADB6] text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                Free During Launch
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    PLUS Account
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">PRO</Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground font-medium">Everything in FREE, plus:</p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ToggleLeft className="w-5 h-5 text-[#95ADB6] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Profile Visibility Toggle</p>
                      <p className="text-sm text-muted-foreground">Make your profile visible to every hiring company on the platform. Get found instead of hunting.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Send className="w-5 h-5 text-[#95ADB6] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Direct Job Offers</p>
                      <p className="text-sm text-muted-foreground">Employers send offers directly to your portal. Accept or decline with one tap. No phone tag.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-[#95ADB6] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Individual Safety Rating Display</p>
                      <p className="text-sm text-muted-foreground">Your ISR shows on your profile. Employers see documented proof of your safety track record.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#95ADB6] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Multi-Employer Management</p>
                      <p className="text-sm text-muted-foreground">Work for 2, 3, 4 companies? Manage all your connections from one dashboard. Your hours, your records, one place.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-[#95ADB6] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Certification Tracking</p>
                      <p className="text-sm text-muted-foreground">Never miss a renewal. Automatic reminders before your IRATA or SPRAT expires.</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Who It's For:</strong> Techs actively looking for work, building their reputation, or managing multiple employers.
                  </p>
                  <div className="bg-[#95ADB6]/10 border border-[#95ADB6]/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-[#95ADB6]">
                      Upgrade to PLUS free during our technician launch. No credit card. No time limit on this offer for early adopters.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" className="bg-[#95ADB6] hover:bg-[#7A9BA5] text-white" asChild data-testid="button-tier-get-plus">
              <Link href="/technician?register=true&plus=true">
                Get PLUS Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-2">Limited to first 500 technicians</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Problems Solved Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Sound Familiar?
            </h2>
          </div>
          
          <div className="space-y-8">
            {/* Problem 1 */}
            <Card className="border bg-white dark:bg-slate-950" data-testid="card-problem-1">
              <CardContent className="p-6 space-y-4">
                <p className="text-lg font-semibold text-foreground italic">
                  "I search 'rope access' on Indeed and get 50 results. 48 of them are pipe fitters, welders, or offshore oil rigs."
                </p>
                <p className="text-muted-foreground">
                  You spend 30 minutes scrolling through irrelevant listings to find 2-3 that might be building maintenance. Half of those turn out to be posted by staffing agencies that don't understand the industry.
                </p>
                <div className="bg-[#95ADB6]/5 border border-[#95ADB6]/20 rounded-lg p-4">
                  <p className="text-foreground">
                    <strong>OnRopePro's Job Board</strong> is a closed ecosystem. Every job is rope access building maintenance. Filter by city, job type, and certification level. Every listing is verified. Every employer is real.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Problem 2 */}
            <Card className="border bg-white dark:bg-slate-950" data-testid="card-problem-2">
              <CardContent className="p-6 space-y-4">
                <p className="text-lg font-semibold text-foreground italic">
                  "I don't want my current boss to know I'm looking."
                </p>
                <p className="text-muted-foreground">
                  You're employed but casually browsing. Maybe testing the market. You don't want to flip your LinkedIn to "Open to Work" and have it get back to your crew lead.
                </p>
                <div className="bg-[#95ADB6]/5 border border-[#95ADB6]/20 rounded-lg p-4">
                  <p className="text-foreground">
                    <strong>Profile visibility is a toggle.</strong> Turn it on when actively looking. Turn it off when you're not. Browse and apply to jobs with your profile hidden. Only reveal yourself when you're ready.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Problem 3 */}
            <Card className="border bg-white dark:bg-slate-950" data-testid="card-problem-3">
              <CardContent className="p-6 space-y-4">
                <p className="text-lg font-semibold text-foreground italic">
                  "I applied to a job and never heard anything. Then saw it reposted two weeks later."
                </p>
                <p className="text-muted-foreground">
                  Black hole applications. No acknowledgment. No timeline. Just silence.
                </p>
                <div className="bg-[#95ADB6]/5 border border-[#95ADB6]/20 rounded-lg p-4">
                  <p className="text-foreground">
                    <strong>OnRopePro shows application status in real time.</strong> Submitted. Viewed. Under consideration. Offer sent. You always know where you stand.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Problem 4 */}
            <Card className="border bg-white dark:bg-slate-950" data-testid="card-problem-4">
              <CardContent className="p-6 space-y-4">
                <p className="text-lg font-semibold text-foreground italic">
                  "Every time I switch jobs, I have to re-enter all my certifications, emergency contacts, and upload the same documents again."
                </p>
                <p className="text-muted-foreground">
                  Three hours of paperwork just to start working. New void cheque. New tax forms. New copies of your certifications.
                </p>
                <div className="bg-[#95ADB6]/5 border border-[#95ADB6]/20 rounded-lg p-4">
                  <p className="text-foreground">
                    <strong>Your OnRopePro profile is portable.</strong> When an employer already on the platform hires you, onboarding takes 10 seconds. They enter your rate and permissions. Everything else is already there.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Problem 5 */}
            <Card className="border bg-white dark:bg-slate-950" data-testid="card-problem-5">
              <CardContent className="p-6 space-y-4">
                <p className="text-lg font-semibold text-foreground italic">
                  "I want to know if a company is legit before I apply."
                </p>
                <p className="text-muted-foreground">
                  Is this a real operation? Do they pay on time? Are their guys happy?
                </p>
                <div className="bg-[#95ADB6]/5 border border-[#95ADB6]/20 rounded-lg p-4">
                  <p className="text-foreground">
                    <strong>Every employer on OnRopePro is verified</strong> as a rope access building maintenance company. You can see company information before you apply. No mystery postings. No bait-and-switch.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* How It Works Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Three Steps. Under Two Minutes.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#95ADB6] text-white flex items-center justify-center mx-auto text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Create Your Account</h3>
              <p className="text-muted-foreground">
                Enter your name, email, and IRATA or SPRAT certification number. Your cert number becomes your permanent identifier. 60 seconds.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#95ADB6] text-white flex items-center justify-center mx-auto text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Complete Your Profile</h3>
              <p className="text-muted-foreground">
                Add your certifications, experience, expected pay rate, and upload your resume. This information auto-attaches to every application. Do it once.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#95ADB6] text-white flex items-center justify-center mx-auto text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Browse and Apply (or Get Found)</h3>
              <p className="text-muted-foreground">
                Search jobs filtered by your city and certification level. Apply with one tap. Or toggle your profile visible and let employers come to you.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-[#95ADB6] hover:bg-[#7A9BA5] text-white" asChild data-testid="button-how-create-account">
              <Link href="/technician?register=true">
                Create Your Free Account Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      {/* Comparison Table Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Not Indeed. Not Craigslist. Not a Facebook Group.
            </h2>
          </div>
          
          <Card className="overflow-hidden border bg-white dark:bg-slate-950">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50 dark:bg-slate-900">
                    <th className="text-left p-4 font-semibold"></th>
                    <th className="text-center p-4 font-semibold text-[#95ADB6]">OnRopePro</th>
                    <th className="text-center p-4 font-semibold text-muted-foreground">Indeed/LinkedIn/Craigslist</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Job Relevance</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span>100% rope access building maintenance</span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <XCircle className="w-5 h-5 text-rose-500" />
                        <span>2-5% relevant listings</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b bg-slate-50/50 dark:bg-slate-900/50">
                    <td className="p-4 font-medium">Employer Verification</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span>Every employer verified</span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <XCircle className="w-5 h-5 text-rose-500" />
                        <span>Anyone can post</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Application Time</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span>30 seconds</span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <XCircle className="w-5 h-5 text-rose-500" />
                        <span>15-20 minutes each</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b bg-slate-50/50 dark:bg-slate-900/50">
                    <td className="p-4 font-medium">Profile Portability</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span>Follows you forever</span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <XCircle className="w-5 h-5 text-rose-500" />
                        <span>Start over each job</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Application Status</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span>Real-time tracking</span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <XCircle className="w-5 h-5 text-rose-500" />
                        <span>Black hole submissions</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b bg-slate-50/50 dark:bg-slate-900/50">
                    <td className="p-4 font-medium">Expected Pay Rate</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span>Visible upfront</span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <XCircle className="w-5 h-5 text-rose-500" />
                        <span>Surprise salary talks</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Employer Cost</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span>No per-application fees</span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <XCircle className="w-5 h-5 text-rose-500" />
                        <span>$22+ per application</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
          
          <Card className="mt-8 border-2 border-[#95ADB6]/30 bg-[#95ADB6]/5">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">The Network Effect</h3>
              <p className="text-muted-foreground">
                More techs on the platform = more employers posting jobs = more opportunities for you.
              </p>
              <p className="text-[#95ADB6] font-medium mt-2">
                You're not just signing up. You're building the only job board that actually understands rope access.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* For Every Type of Tech Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Whether You're Climbing the Ladder or Chasing Freedom
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Career Climbers */}
            <Card className="border bg-white dark:bg-slate-950">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-[#95ADB6]/10 flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-[#95ADB6]" />
                </div>
                <CardTitle className="text-xl">Career Climbers</CardTitle>
                <p className="text-sm text-muted-foreground">L1/L2 Working Toward L3</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your hours are tracked. Your certifications are visible. When you hit 1,000 hours and apply for that L2, your documentation is organized and exportable. No scrambling.
                </p>
              </CardContent>
            </Card>

            {/* Multi-Employer Hustlers */}
            <Card className="border bg-white dark:bg-slate-950">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-[#95ADB6]/10 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-[#95ADB6]" />
                </div>
                <CardTitle className="text-xl">Multi-Employer Hustlers</CardTitle>
                <p className="text-sm text-muted-foreground">Managing 2-4 Companies</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  One dashboard for all your employers. See your total hours across all jobs. Never double-book. Never lose track of which company owes you what.
                </p>
              </CardContent>
            </Card>

            {/* Freedom Seekers */}
            <Card className="border bg-white dark:bg-slate-950">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-[#95ADB6]/10 flex items-center justify-center mb-3">
                  <Globe className="w-6 h-6 text-[#95ADB6]" />
                </div>
                <CardTitle className="text-xl">Freedom Seekers</CardTitle>
                <p className="text-sm text-muted-foreground">Moving City to City</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your profile is portable. Work in Vancouver this spring, Toronto this summer, Seattle in the fall. Your professional identity travels with you. 10-second onboarding at every new employer who uses OnRopePro.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* FAQ Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently Asked Questions
            </h2>
          </div>
          
          <Accordion 
            type="multiple" 
            value={faqOpen} 
            onValueChange={setFaqOpen}
            className="space-y-3"
          >
            <AccordionItem value="faq-1" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-1">
                Is there a cost to sign up?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                No. FREE tier is free forever. PLUS tier is free during our technician launch.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-2">
                What's the catch with PLUS being free?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                No catch. We're launching to technicians first. We want 500+ rope access professionals on the platform before we start charging employers. Early adopters get PLUS free.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-3">
                Will you spam me?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                No. You'll get job offer notifications (if you enable visibility) and application status updates. No marketing emails unless you opt in.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-4">
                Can my current employer see that I'm on here?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                Not unless you toggle your profile visible. You can browse and apply to jobs completely privately.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-5">
                What if the employer I apply to isn't on OnRopePro?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                Then they don't have access to this talent pool. All employers on the platform are verified rope access building maintenance companies.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-6">
                How is this different from Facebook groups or word of mouth?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                Facebook posts disappear. Word of mouth is unreliable. OnRopePro is permanent, searchable, and organized. Your profile stays updated. Your applications are tracked. Your career history is documented.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-7">
                Can I use this if I'm not IRATA or SPRAT certified?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                Yes. We support both IRATA and SPRAT certifications, plus non-certified building maintenance workers. Your certification level (or lack of it) is visible to employers, so they know what they're getting.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-8">
                What happens to my data if I delete my account?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                You own your data. Delete your account anytime and your profile is removed from employer searches. Any employer connections are severed.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-9">
                How do I upgrade to PLUS?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                Toggle it in your settings. During the technician launch, the upgrade is immediate and free. No credit card required.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section - Stakeholder Colored */}
      <section className="py-16 md:py-20 px-4 text-white" style={{backgroundImage: `linear-gradient(135deg, ${TECHNICIAN_COLOR} 0%, ${TECHNICIAN_GRADIENT_END} 100%)`}}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Your Next Gig is Already Posted
          </h2>
          <p className="text-lg text-white/90">
            Somewhere on this platform, an employer is looking for exactly your certification level, in exactly your city, at exactly your expected pay rate.
          </p>
          <p className="font-medium text-white">
            You just need to show up. Create your account. Complete your profile. Start browsing or get found.
          </p>
          <p className="text-orange-100 italic">
            The only job board built exclusively for rope access technicians.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-white hover:bg-orange-50" style={{color: TECHNICIAN_COLOR}} asChild data-testid="button-final-create-account">
              <Link href="/technician?register=true">
                Create Your Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-final-upgrade-plus">
              <Link href="/technician?register=true&plus=true">
                Upgrade to PLUS Free
                <Award className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-white/80 pt-2">
            First 500 technicians only
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
    </div>
  );
}
