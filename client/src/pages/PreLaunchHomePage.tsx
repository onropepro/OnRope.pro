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
    role: "Company Owners",
    icon: Briefcase,
    tagline: "Run your business, not your spreadsheets",
    benefits: [
      { headline: "Create quotes in minutes, not hours", metric: "15-20% more accurate bids" },
      { headline: "See every project's status without site visits", metric: "10-15 hrs/week saved" },
      { headline: "Payroll runs itself", metric: "87-93% time reduction" },
      { headline: "Win contracts with your safety score", metric: "10-20% insurance discount" },
    ],
  },
  {
    role: "Operations Managers",
    icon: Users,
    tagline: "Coordinate crews without the chaos",
    benefits: [
      { headline: "Spot double-bookings before they happen", metric: "Zero scheduling disasters" },
      { headline: "Prove who's performing, who's coasting", metric: "Objective performance data" },
      { headline: "Batch deficiency visits efficiently", metric: "Half-day trips eliminated" },
      { headline: "Generate safety docs automatically", metric: "30+ min per project saved" },
    ],
  },
  {
    role: "Rope Access Technicians",
    icon: HardHat,
    tagline: "Log your work, prove your value",
    benefits: [
      { headline: "Your portable professional profile", metric: "Career follows you" },
      { headline: "Log drops from your phone in seconds", metric: "10 seconds per entry" },
      { headline: "Paycheck accuracy you can trust", metric: "Zero payroll errors" },
      { headline: "Build your reputation with data", metric: "Objective career progression" },
    ],
  },
  {
    role: "Property Managers",
    icon: Building2,
    tagline: "Verify vendor performance, reduce your liability",
    benefits: [
      { headline: "See vendor safety compliance at a glance", metric: "Due diligence documented" },
      { headline: "Answer owner questions instantly", metric: "Instant status visibility" },
      { headline: "Get out of the complaint loop", metric: "20+ hrs/month saved" },
      { headline: "Protect yourself when accidents happen", metric: "Liability protection" },
    ],
  },
  {
    role: "Building Residents",
    icon: Home,
    tagline: "See what's happening outside your window",
    benefits: [
      { headline: "Know when they'll reach your floor", metric: "Plan around the work" },
      { headline: "Submit complaints with photos", metric: "Visible accountability" },
      { headline: "See real-time progress on your building", metric: "Transparent progress" },
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
        style={{ backgroundImage: "linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)" }}
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

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              2026: The year property & strata managers<br className="hidden md:block" />
              can finally see <span className="text-[#fa7315]">what sets you apart.</span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">Intelligent Urban Rope Access Software Built by a Level 3 Tech and Operations Manager Who Got Tired of the Same Chaos You're Dealing With.</p>

            <p className="text-blue-100">
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
              <p className="text-xs text-blue-100/80">
                Be first to see it. No spam. Unsubscribe anytime.
              </p>
            </form>

            <div className="text-blue-100 text-sm pt-4 space-y-1">
              <p className="text-[16px]">
                There are <span className="text-[#fa7315] font-bold">86 urban rope access companies</span> in Canada. We're onboarding 10 of them in January.
              </p>
              <p className="font-bold text-[16px]">
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
                  <div className="text-sm text-muted-foreground mt-1">Connected Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600">87%</div>
                  <div className="text-sm text-muted-foreground mt-1">Payroll Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600">10+ hrs</div>
                  <div className="text-sm text-muted-foreground mt-1">Weekly Admin Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-violet-600">1 Platform</div>
                  <div className="text-sm text-muted-foreground mt-1">Replaces 5-10 Tools</div>
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
                <p className="text-muted-foreground text-sm">
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
                <p className="text-muted-foreground text-sm">
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
                <p className="text-muted-foreground text-sm">
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
                      <p className="text-sm text-muted-foreground">{stakeholder.tagline}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {stakeholder.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">{benefit.headline}</p>
                          <p className="text-xs text-muted-foreground">{benefit.metric}</p>
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
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            19 Modules. One Platform. All Connected.
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            Everything you need to run a profitable rope access company, from first quote to final payment
            and every drop in between. Complex operations made simple through absolute transparency.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moduleCategories.map((category) => (
              <Card key={category.name}>
                <CardContent className="p-6">
                  <h3 className={`font-semibold text-lg mb-4 ${category.color}`}>
                    {category.name} ({category.modules.length})
                  </h3>
                  <ul className="space-y-2">
                    {category.modules.map((module) => (
                      <li key={module} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {module}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6 text-center">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Every module talks to every other module.</strong> A work session updates payroll,
                progress tracking, performance analytics, and safety compliance automatically.
                Information flows where it needs to go, when it needs to get there.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <section
        className="py-16 md:py-20 px-4 text-white"
        style={{ backgroundImage: "linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            January 2026. Limited slots.
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Early adopters get hands-on onboarding and direct input on the roadmap. Get in line.
          </p>
          <Button
            size="lg"
            className="bg-white text-[#0B64A3] hover:bg-blue-50"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-testid="button-final-cta"
          >
            Get Early Access
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-blue-100/80 text-sm mt-6">
            Built by a Level 3 tech and operations manager. For rope access professionals.
          </p>
        </div>
      </section>
      <PreLaunchFooter />
    </div>
  );
}
