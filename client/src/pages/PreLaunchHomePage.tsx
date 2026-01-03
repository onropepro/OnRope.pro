import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PreLaunchFooter } from "../components/PreLaunchFooter";
import onRopeProLogo from "@assets/OnRopePro-logo-white_1767469623033.png";
import {
  ArrowRight,
  Shield,
  BarChart3,
  Clock,
  Users,
  FileText,
  Calendar,
  Package,
  Wallet,
  MessageSquare,
  Building2,
  HardHat,
  Home,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

const moduleCategories = [
  {
    name: "Operations",
    color: "text-blue-600",
    modules: [
      "Project Management",
      "Work Sessions",
      "Scheduling",
      "Gear Inventory",
      "White Label",
    ],
  },
  {
    name: "Safety",
    color: "text-red-600",
    modules: [
      "Safety Compliance",
      "Company Safety Rating",
      "Personal Safety Rating",
      "IRATA/SPRAT Logging",
      "Documents",
    ],
  },
  {
    name: "Team",
    color: "text-violet-600",
    modules: [
      "Employee Management",
      "Technician Passport",
      "Job Board",
      "User Access",
    ],
  },
  {
    name: "Financial",
    color: "text-emerald-600",
    modules: ["Payroll", "Quoting", "CRM"],
  },
  {
    name: "Communication",
    color: "text-rose-600",
    modules: ["Resident Portal", "Property Manager Portal"],
  },
];

const stakeholderBenefits = [
  {
    role: "For Company Owners",
    icon: Briefcase,
    tagline: "Run your business, not your spreadsheets",
    benefits: [
      { headline: "Create quotes in minutes, not hours", metric: "15-20% more accurate bids" },
      { headline: "See every project's status without site visits", metric: "10-15 hrs/week saved" },
      { headline: "Payroll runs itself", metric: "87-93% time reduction" },
      { headline: "Stop the 3 AM anxiety", metric: "60-70% cognitive load reduction" },
      { headline: "Win contracts with your safety score", metric: "10-20% insurance discount" },
      { headline: "Know which techs are performing", metric: "Zero he-said disputes" },
      { headline: "Never lose job history again", metric: "Data-driven future quotes" },
      { headline: "Equipment tracking that prevents surprises", metric: "$4K+ emergency costs avoided" },
    ],
  },
  {
    role: "For Operations Managers",
    icon: Users,
    tagline: "Coordinate crews without the chaos",
    benefits: [
      { headline: "Spot double-bookings before they happen", metric: "Zero scheduling disasters" },
      { headline: "Prove who's performing, who's coasting", metric: "Objective performance data" },
      { headline: "Batch deficiency visits efficiently", metric: "Half-day trips eliminated" },
      { headline: "Stop playing phone tag for updates", metric: "Real-time visibility" },
      { headline: "Balance workloads across crews", metric: "Prevent burnout" },
      { headline: "Generate safety docs automatically", metric: "30+ min per project saved" },
    ],
  },
  {
    role: "For Rope Access Technicians",
    icon: HardHat,
    tagline: "Log your work, prove your value",
    benefits: [
      { headline: "Your portable professional profile", metric: "Career follows you" },
      { headline: "Log drops from your phone in seconds", metric: "10 seconds per entry" },
      { headline: "Know your daily target", metric: "Clear expectations" },
      { headline: "Paycheck accuracy you can trust", metric: "Zero payroll errors" },
      { headline: "See your schedule, plan your life", metric: "Work-life visibility" },
      { headline: "Build your reputation with data", metric: "Objective career progression" },
    ],
  },
  {
    role: "For Property Managers",
    icon: Building2,
    tagline: "Verify vendor performance, reduce your liability",
    benefits: [
      { headline: "See vendor safety compliance at a glance", metric: "Due diligence documented" },
      { headline: "Answer owner questions instantly", metric: "Instant status visibility" },
      { headline: "Get out of the complaint loop", metric: "20+ hrs/month saved" },
      { headline: "Evaluate vendors with data, not gut feel", metric: "Data-driven decisions" },
      { headline: "Download safety docs without asking", metric: "Self-service access" },
      { headline: "Protect yourself when accidents happen", metric: "Liability protection" },
    ],
  },
  {
    role: "For Building Managers",
    icon: Building2,
    tagline: "Stop fielding resident calls about contractor work",
    benefits: [
      { headline: "Residents stop calling you for updates", metric: "70% fewer calls" },
      { headline: "Upload anchor inspections directly", metric: "Centralized compliance" },
      { headline: "Track vendor performance across jobs", metric: "Objective recommendations" },
      { headline: "Complaints routed directly to vendors", metric: "Out of the middle" },
    ],
  },
  {
    role: "For Building Residents",
    icon: Home,
    tagline: "See what's happening outside your window",
    benefits: [
      { headline: "Know when they'll reach your floor", metric: "Plan around the work" },
      { headline: "Submit complaints with photos", metric: "Visible accountability" },
      { headline: "See real-time progress on your building", metric: "Transparent progress" },
      { headline: "Your account moves with you", metric: "Portable profile" },
    ],
  },
];

export default function PreLaunchHomePage() {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");

  const signupMutation = useMutation({
    mutationFn: async (data: { companyName: string; email: string; stakeholderType: string; source: string }) => {
      return apiRequest("POST", "/api/early-access", data);
    },
    onSuccess: () => {
      toast({
        title: "You're on the list!",
        description: "We'll be in touch when we launch in January 2026.",
      });
      setCompanyName("");
      setEmail("");
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again or email hello@onrope.pro",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !email.trim()) return;
    signupMutation.mutate({
      companyName: companyName.trim(),
      email: email.trim(),
      stakeholderType: "company",
      source: "homepage",
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section
        className="relative text-white pb-[120px]"
        style={{ backgroundImage: "linear-gradient(135deg, #193A63 0%, #193A63 100%)" }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="flex justify-center pt-8 pb-4">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-12 md:h-16" />
          </div>

          <div className="text-center space-y-6 pt-8">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1">
              LAUNCHING JANUARY 2026
            </Badge>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              2026: The year property & strata managers can finally see <span className="text-[#fa7315]">what sets you apart.</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-4">
              Built by a Level 3 tech and operations manager who got tired of the same chaos you're dealing with.
            </p>
            <p className="text-lg text-blue-100/80 italic mb-10">
              OnRopePro launches January 2026. Early access list now open.
            </p>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-white text-left block">
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                    data-testid="input-company-name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-left block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                    data-testid="input-email"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-white text-[#0B64A3] hover:bg-blue-50"
                disabled={signupMutation.isPending}
                data-testid="button-early-access"
              >
                {signupMutation.isPending ? "Submitting..." : "Get Early Access"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-base text-blue-100/80">
                Be first to see it. No spam. Unsubscribe anytime.
              </p>
            </form>

            <div className="text-blue-100 text-base pt-4 space-y-1">
              <p className="text-base">
                There are <span className="text-[#fa7315] font-bold">86 urban rope access companies</span> in Canada. We're onboarding 10 of them in January.
              </p>
              <p className="font-bold text-base">
                Will you be one of them?
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-white dark:fill-slate-950"
            />
          </svg>
        </div>
      </section>
      <section className="relative bg-white dark:bg-slate-950 -mt-px overflow-visible">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
          <Card className="shadow-xl border-0 relative z-20 -mt-20">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-700">19</div>
                  <div className="text-base text-muted-foreground mt-1">Connected Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600">87%</div>
                  <div className="text-base text-muted-foreground mt-1">Payroll Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600">10+ hrs</div>
                  <div className="text-base text-muted-foreground mt-1">Weekly Admin Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-violet-600">1 Platform</div>
                  <div className="text-base text-muted-foreground mt-1">Replaces 5-10 Tools</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Your professionalism, finally visible.
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Company Safety Rating. Real-time project dashboards. Response time metrics.
            OnRopePro makes the things you're already doing well visible to the people deciding who gets the contract.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Company Safety Rating</h3>
                <p className="text-muted-foreground text-base">
                  A real-time score that reflects your safety documentation, toolbox meetings, and compliance.
                  Property & strata managers see it. Your competitors probably don't have one.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Property Manager Portal</h3>
                <p className="text-muted-foreground text-base">
                  They log in and see your project progress, safety documentation, and response metrics.
                  No calls asking for updates. Your professionalism speaks for itself.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Resident Portal</h3>
                <p className="text-muted-foreground text-base">
                  Residents see progress on their building and submit feedback directly to you.
                  Property managers stay out of the loop. Fewer complaints, faster resolution.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What It Does For Everyone In Your Operation
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Different roles, different problems. Here's exactly how the platform helps each person.
          </p>

          <div className="space-y-8">
            {stakeholderBenefits.map((stakeholder) => (
              <Card key={stakeholder.role} className="overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800 border-b px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <stakeholder.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{stakeholder.role}</h3>
                      <p className="text-base text-muted-foreground">{stakeholder.tagline}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {stakeholder.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-base">{benefit.headline}</p>
                          <p className="text-sm text-muted-foreground">{benefit.metric}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 md:py-20 px-4 bg-[#0F1629] text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Problems You Won't Have Anymore
          </h2>
          <p className="text-center text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
            Every feature exists because a rope access company told us about a real problem.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                before: "I'm juggling Excel, Google Sheets, text messages, and a whiteboard",
                after: "One platform replaces 5-10 scattered tools. Everything connected, nothing lost."
              },
              {
                before: "Payroll takes 7+ hours every two weeks and there's always errors",
                after: "Work sessions auto-populate timesheets. Export to QuickBooks. 45 minutes max."
              },
              {
                before: "I have no idea how long this type of job should take",
                after: "Searchable archive shows average days and crew size for every past job type."
              },
              {
                before: "Building managers call me 10 times a week asking for updates",
                after: "They log in and see the same dashboard you do. Calls drop 80%."
              },
              {
                before: "Residents complain to property managers who complain to me",
                after: "Direct resident portal routes complaints to you. Property managers out of the loop."
              },
              {
                before: "When WorkSafe shows up, I scramble for documentation",
                after: "One-click PDF export of all safety docs with signatures and timestamps."
              },
              {
                before: "I wake at 3 AM remembering something I forgot",
                after: "Automated reminders for COI renewals, pending feedback, and overdue tasks."
              },
              {
                before: "I can't prove which techs are actually performing",
                after: "Objective data: drops per day, efficiency trends, comparative performance."
              }
            ].map((problem, i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Before</p>
                    <p className="text-base text-slate-300">"{problem.before}"</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#fa7315] rotate-90" />
                  <div>
                    <p className="text-base text-emerald-400 font-medium">{problem.after}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            19 Modules. One Platform. All Connected.
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            Everything you need to run a profitable rope access company, from first quote to final payment
            and every drop in between. Complex operations made simple through absolute transparency.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Project Management", detail: "4-elevation tracking with visual progress bars and crew assignment" },
              { name: "Work Sessions", detail: "GPS clock-in, drop tracking, automatic hour aggregation" },
              { name: "Scheduling", detail: "Drag-and-drop calendar with conflict detection and weather delays" },
              { name: "Gear Inventory", detail: "Serial number tracking, assignment history, retirement workflows" },
              { name: "White Label", detail: "Custom branding for client-facing portals and exports" },
              { name: "Safety Compliance", detail: "Digital forms, PDF plans, and audit-ready documentation" },
              { name: "Company Safety Rating", detail: "Real-time company safety score based on inspections and compliance" },
              { name: "Personal Safety Rating", detail: "Portable technician safety score that follows you across employers" },
              { name: "IRATA/SPRAT Logging", detail: "Same-day hour logging with OCR import and career-portable records" },
              { name: "Documents", detail: "Digital signatures, immutable audit trails, compliance reporting" },
              { name: "Employee Management", detail: "Portable identities, certification tracking, role-based permissions" },
              { name: "Technician Passport", detail: "Portable work history and certifications across employers" },
              { name: "Job Board", detail: "Talent browser with unlimited postings and direct offers" },
              { name: "User Access", detail: "Granular permissions and audit trails for every action" },
              { name: "Payroll", detail: "Automatic hour aggregation with overtime calculation and exports" },
              { name: "Quoting", detail: "Multi-service quotes with photo documentation and historical data" },
              { name: "CRM", detail: "Client relationship management with contact history and notes" },
              { name: "Resident Portal", detail: "Progress tracking and feedback submission for building residents" },
              { name: "Property Manager Portal", detail: "Real-time dashboards and compliance exports for property managers" }
            ].map((mod, i) => (
              <Card key={i} className="bg-slate-50/50 dark:bg-slate-900/50 border-0">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-base mb-1">{mod.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{mod.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12 bg-slate-900 text-white border-0">
            <CardContent className="p-8 text-center">
              <p className="text-lg">
                <span className="text-[#fa7315] font-bold">Every module talks to every other module.</span> A work session updates payroll, tracking, performance analytics, and safety compliance automatically. Create a project once, it pulls from your history. Information flows where it needs to go, when it needs to get there.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <section
        className="py-16 md:py-20 px-4 text-white"
        style={{ backgroundImage: "linear-gradient(135deg, #fa7315 0%, #fa7315 100%)" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            January 2026. Limited slots.
          </h2>
          <p className="text-white text-lg mb-8">
            Early adopters get hands-on onboarding and direct input on the roadmap. Get in line.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6">
            <Input
              type="text"
              placeholder="Company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="bg-white text-black h-12"
              required
            />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-black h-12"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="bg-slate-900 text-white hover:bg-slate-800 h-12 px-8"
              disabled={signupMutation.isPending}
            >
              Get Early Access
            </Button>
          </form>

          <p className="text-white font-medium text-base mt-6">
            Built by a Level 3 tech and operations manager. For rope access professionals.
          </p>
        </div>
      </section>
      <PreLaunchFooter />
    </div>
  );
}
