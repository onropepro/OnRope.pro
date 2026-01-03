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
  Home as HomeIcon,
  Briefcase,
  CheckCircle2,
  Heart,
  Settings,
  Paintbrush,
  ShieldAlert,
  Search,
  Award,
  DollarSign,
} from "lucide-react";

const moduleCategories = [
  {
    name: "Operations",
    icon: Settings,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    count: 5,
    modules: [
      { name: "Project Management", detail: "4-elevation tracking with visual progress bars and crew assignment", icon: Briefcase },
      { name: "Work Sessions", detail: "GPS clock-in, drop tracking, automatic hour aggregation", icon: Clock },
      { name: "Scheduling", detail: "Drag-and-drop calendar with conflict detection and weather delays", icon: Calendar },
      { name: "Gear Inventory", detail: "Serial number tracking, assignment history, retirement workflows", icon: Package },
      { name: "White Label", detail: "Custom branding for client-facing portals and exports", icon: Paintbrush },
    ],
  },
  {
    name: "Safety",
    icon: Heart,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-900/20",
    count: 5,
    modules: [
      { name: "Safety Compliance", detail: "Digital forms, PDF plans, and audit-ready documentation", icon: Shield },
      { name: "Company Safety Rating", detail: "Real-time company safety score based on inspections and compliance", icon: BarChart3 },
      { name: "Personal Safety Rating", detail: "Portable technician safety score that follows you across employers", icon: Users },
      { name: "IRATA/SPRAT Logging", detail: "Same-day hour logging with OCR import and career-portable records", icon: FileText },
      { name: "Documents", detail: "Digital signatures, immutable audit trails, compliance reporting", icon: FileText },
    ],
  },
  {
    name: "Team",
    icon: Users,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    count: 4,
    modules: [
      { name: "Employee Management", detail: "Portable identities, certification tracking, role-based permissions", icon: Users },
      { name: "Technician Passport", detail: "Portable work history and certifications across employers", icon: Award },
      { name: "Job Board", detail: "Talent browser with unlimited postings and direct offers", icon: Search },
      { name: "User Access", detail: "Granular permissions and audit trails for every action", icon: ShieldAlert },
    ],
  },
  {
    name: "Financial",
    icon: Wallet,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    count: 3,
    modules: [
      { name: "Payroll", detail: "Automatic hour aggregation with overtime calculation and exports", icon: Wallet },
      { name: "Quoting", detail: "Multi-service quotes with photo documentation and historical data", icon: FileText },
      { name: "CRM", detail: "Client relationship management with contact history and notes", icon: Building2 },
    ],
  },
  {
    name: "Communication",
    icon: MessageSquare,
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    count: 2,
    modules: [
      { name: "Resident Portal", detail: "Progress tracking and feedback submission for building residents", icon: HomeIcon },
      { name: "Property Manager Portal", detail: "Real-time dashboards and compliance exports for property managers", icon: Building2 },
    ],
  },
];

const stakeholderBenefits = [
  {
    role: "For Company Owners",
    icon: Briefcase,
    tagline: "Run your business, not your spreadsheets",
    benefits: [
      { headline: "Create quotes in minutes, not hours", detail: "Pull historical data from similar jobs. Know exactly how many drops per day your crew averages. Send professional quotes directly to property managers.", metric: "15-20% more accurate bids" },
      { headline: "See every project's status without site visits", detail: "Real-time dashboard shows progress percentage, days remaining, assigned crew, and completion forecast. Filter by building, technician, or status.", metric: "10-15 hrs/week saved" },
      { headline: "Payroll runs itself", detail: "Work sessions logged by technicians auto-populate timesheets. Piece-work rates, hourly rates, and overtime calculated automatically. Export to QuickBooks.", metric: "87-93% time reduction" },
      { headline: "Stop the 3 AM anxiety", detail: "Everything lives in one system with automated reminders. COI expiring? System alerts you. Feedback awaiting response? Dashboard shows it. Mental bandwidth freed.", metric: "60-70% cognitive load reduction" },
      { headline: "Win contracts with your safety score", detail: "Company Safety Rating (CSR) visible to property managers. Document your toolbox meetings, harness inspections, and safety compliance. Stand out from competitors.", metric: "10-20% insurance discount" },
      { headline: "Know which techs are performing", detail: "Objective data on drops per day, job completion rates, and efficiency trends. Coach underperformers with facts, not feelings. Reward top performers fairly.", metric: "Zero he-said disputes" },
      { headline: "Never lose job history again", detail: "Searchable archive of every project completed. How long did that 15-story building take last year? What was the crew composition? Instant answers.", metric: "Data-driven future quotes" },
      { headline: "Equipment tracking that prevents surprises", detail: "Track rope service life, harness inspection dates, and gear assignments. Know when replacements are needed before equipment fails in the field.", metric: "$4K+ emergency costs avoided" },
    ],
  },
  {
    role: "For Operations Managers",
    icon: Users,
    tagline: "Coordinate crews without the chaos",
    benefits: [
      { headline: "Spot double-bookings before they happen", detail: "Visual calendar shows all crew assignments at a glance. Drag and drop to reassign. Conflict detection alerts you before mistakes cost time.", metric: "Zero scheduling disasters" },
      { headline: "Prove who's performing, who's coasting", detail: "Compare technician efficiency across similar job types. See who consistently beats estimates and who falls short. Performance reviews backed by data.", metric: "Objective performance data" },
      { headline: "Batch deficiency visits efficiently", detail: "Group outstanding deficiencies by building location. Generate optimized routes for follow-up work. Turn scattered callbacks into single efficient trips.", metric: "Half-day trips eliminated" },
      { headline: "Stop playing phone tag for updates", detail: "Technicians log progress from the field. You see it instantly. Property managers see their portal. Everyone informed, no calls required.", metric: "Real-time visibility" },
      { headline: "Balance workloads across crews", detail: "See total assigned hours per technician per week. Identify who's overloaded and who has capacity. Distribute work fairly and prevent burnout.", metric: "Prevent burnout" },
      { headline: "Generate safety docs automatically", detail: "Toolbox meeting templates pre-populated with project details. Harness inspection reminders automated. FLHA forms digitized and signed on-site.", metric: "30+ min per project saved" },
    ],
  },
  {
    role: "For Rope Access Technicians",
    icon: HardHat,
    tagline: "Log your work, prove your value",
    benefits: [
      { headline: "Your portable professional profile", detail: "IRATA/SPRAT hours, certifications, and work history travel with you. When you change employers, your verified record comes along. No more re-proving yourself.", metric: "Career follows you" },
      { headline: "Log drops from your phone in seconds", detail: "GPS-verified clock-in, simple drop counter, photo documentation. Takes 10 seconds. Your work is recorded accurately without paperwork.", metric: "10 seconds per entry" },
      { headline: "Know your daily target", detail: "See exactly how many drops are expected for this elevation. Compare your pace to the estimate. Know if you're ahead or behind before the day ends.", metric: "Clear expectations" },
      { headline: "Paycheck accuracy you can trust", detail: "Every hour and piece-work item logged in real-time. Review your timesheet before submission. Dispute discrepancies with timestamped evidence.", metric: "Zero payroll errors" },
      { headline: "See your schedule, plan your life", detail: "View your assigned projects weeks in advance. Know when you're working which building. Plan appointments and commitments with confidence.", metric: "Work-life visibility" },
      { headline: "Build your reputation with data", detail: "Your Personal Safety Rating (PSR) shows your compliance record. Efficiency metrics demonstrate your value. When applying for new positions, your profile speaks for you.", metric: "Objective career progression" },
    ],
  },
  {
    role: "For Property Managers",
    icon: Building2,
    tagline: "Verify vendor performance, reduce your liability",
    benefits: [
      { headline: "See vendor safety compliance at a glance", detail: "Company Safety Rating (CSR) shows documentation completion, toolbox meetings, and harness inspections. Compare vendors objectively before signing contracts.", metric: "Due diligence documented" },
      { headline: "Answer owner questions instantly", detail: "'How's the window washing going?' Log in, check progress: '68% complete, ahead of schedule.' No calling the contractor.", metric: "Instant status visibility" },
      { headline: "Get out of the complaint loop", detail: "Residents submit feedback directly to vendors through the portal. You see resolution status without being the middleman.", metric: "20+ hrs/month saved" },
      { headline: "Evaluate vendors with data, not gut feel", detail: "Average response time, resolution rates, and CSR trends over time. Contract renewal decisions backed by objective performance metrics.", metric: "Data-driven decisions" },
      { headline: "Download safety docs without asking", detail: "Anchor inspection certificates, insurance docs, and rope access plans available in your portal. No email requests, no waiting.", metric: "Self-service access" },
      { headline: "Protect yourself when accidents happen", detail: "'What due diligence did you perform?' Show documented vendor CSR review, safety compliance tracking, and contract requirements.", metric: "Liability protection" },
    ],
  },
  {
    role: "For Building Managers",
    icon: Building2,
    tagline: "Stop fielding resident calls about contractor work",
    benefits: [
      { headline: "Residents stop calling you for updates", detail: "Point them to the resident portal. They see real-time progress on their building. You're no longer the information relay.", metric: "70% fewer calls" },
      { headline: "Upload anchor inspections directly", detail: "Your building's anchor certification documents stored in one place. Vendors see them when planning work. No hunting for paperwork.", metric: "Centralized compliance" },
      { headline: "Track vendor performance across jobs", detail: "See which rope access companies consistently deliver on time with fewer complaints. Make informed recommendations to your property management company.", metric: "Objective recommendations" },
      { headline: "Complaints routed directly to vendors", detail: "Resident feedback goes straight to the company doing the work. You're copied for awareness but don't need to manage the resolution.", metric: "Out of the middle" },
    ],
  },
  {
    role: "For Building Residents",
    icon: HomeIcon,
    tagline: "See what's happening outside your window",
    benefits: [
      { headline: "Know when they'll reach your floor", detail: "Visual progress tracker shows which elevations are complete and which are upcoming. Plan around the work instead of guessing.", metric: "Plan around the work" },
      { headline: "Submit complaints with photos", detail: "See a streak on your window? Snap a photo, submit through the portal. The company sees it immediately with your unit number.", metric: "Visible accountability" },
      { headline: "See real-time progress on your building", detail: "Progress bars show overall completion. No more wondering 'are they still working on this building?' Clear visibility into the work.", metric: "Transparent progress" },
      { headline: "Your account moves with you", detail: "Move to a new building with OnRopePro-connected vendors? Your account transfers. Continuous visibility across properties.", metric: "Portable profile" },
    ],
  },
];

export default function PreLaunchHomePage() {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

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
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What It Does For Everyone In Your Operation
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Different roles, different problems. Here's exactly how the platform helps each person.
          </p>

          <div className="space-y-16">
            {stakeholderBenefits.map((stakeholder) => (
              <div key={stakeholder.role}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <stakeholder.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{stakeholder.role}</h3>
                    <p className="text-base text-muted-foreground">{stakeholder.tagline}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stakeholder.benefits.map((benefit, idx) => (
                    <Card key={idx} className="border border-slate-200 dark:border-slate-800">
                      <CardContent className="p-5 flex flex-col h-full">
                        <h4 className="font-semibold text-base mb-2">{benefit.headline}</h4>
                        <p className="text-base text-muted-foreground flex-1 mb-4">{benefit.detail}</p>
                        <Badge className="w-fit bg-[#fa7315] text-white border-0 font-medium">
                          {benefit.metric}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
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
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            19 Modules. One Platform. All Connected. All Included.
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            Everything you need to run a profitable rope access company, from first quote to final payment
            and every drop in between.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <Button 
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('all')}
              className="gap-2"
            >
              <Package className="w-4 h-4" /> All Modules
            </Button>
            {moduleCategories.map((cat) => (
              <Button
                key={cat.name}
                variant={activeCategory === cat.name ? 'default' : 'outline'}
                onClick={() => setActiveCategory(cat.name)}
                className="gap-2"
              >
                <cat.icon className={`w-4 h-4 ${cat.color}`} />
                {cat.name}
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 flex items-center justify-center p-0">
                  {cat.count}
                </Badge>
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {moduleCategories
              .flatMap(cat => cat.modules.map(mod => ({ ...mod, category: cat.name })))
              .filter(mod => activeCategory === 'all' || mod.category === activeCategory)
              .map((mod, i) => (
                <Card key={i} className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover-elevate transition-all duration-200">
                  <CardContent className="p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100/50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <mod.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-1">{mod.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{mod.detail}</p>
                    </div>
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
