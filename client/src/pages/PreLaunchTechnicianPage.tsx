import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PreLaunchFooter } from "../components/PreLaunchFooter";
import onRopeProLogo from "@assets/OnRopePro-logo-white_1767469623033.png";
import {
  ArrowRight,
  IdCard,
  Star,
  Clock,
  Users,
  Link2,
  Smartphone,
  TrendingUp,
  Share2,
  Check,
} from "lucide-react";

const problemsData = [
  {
    before: "I switched companies and had to prove my experience all over again",
    after: "Your Technician Passport travels with you. New employer sees your verified history instantly.",
  },
  {
    before: "My paper logbook got damaged and I lost years of hours",
    after: "Digital backup of every hour logged. OCR import for existing logbooks. Never lose your records again.",
  },
  {
    before: "I have no idea if I'm performing well compared to other techs",
    after: "Personal performance dashboard shows your drops per day, efficiency trends, and growth over time.",
  },
  {
    before: "Payroll disputes because my hours don't match what they have",
    after: "Every work session timestamped and recorded. Your data matches theirs. Zero disputes.",
  },
  {
    before: "I don't know my schedule until the night before",
    after: "See your upcoming assignments in the app. Plan your life around your work, not the other way around.",
  },
  {
    before: "When I apply for jobs, I have no way to prove my track record",
    after: "Shareable profile link shows verified certifications, hours, and performance data to prospective employers.",
  },
];

const howItWorksSteps = [
  {
    step: 1,
    title: "Create Your Free Account",
    description: "Sign up with your email. Add your IRATA/SPRAT certifications. Import your existing logbook hours via OCR.",
    icon: Users,
  },
  {
    step: 2,
    title: "Connect to Your Employer",
    description: "When your company uses OnRopePro, link your account. Your profile pre-populates their system. No re-entering your info.",
    icon: Link2,
  },
  {
    step: 3,
    title: "Log Your Work",
    description: "Clock in, log drops, upload photos. 10 seconds per entry. Your hours automatically sync to your permanent record.",
    icon: Smartphone,
  },
  {
    step: 4,
    title: "Build Your Reputation",
    description: "Performance data accumulates. Personal Safety Rating builds. Your professional identity grows with every job.",
    icon: TrendingUp,
  },
  {
    step: 5,
    title: "Take It With You",
    description: "Switch employers? Your account stays yours. New company sees your verified history. No starting over.",
    icon: Share2,
  },
];

const freeFeatures = [
  {
    title: "Portable Profile",
    description: "Your certifications, contact info, and work history in one place - owned by you",
  },
  {
    title: "Logbook Photo Import",
    description: "Snap a photo of your physical logbook pages. The app reads and imports your historical data automatically.",
  },
  {
    title: "Instant Employer Connection",
    description: "When connected to an employer on OnRopePro: 10 seconds to onboard, not 60 minutes of paperwork",
  },
  {
    title: "Automatic Hour Tracking",
    description: "Every work session, building, height, and task logged automatically (when employer uses OnRopePro)",
  },
  {
    title: "Personal Safety Rating",
    description: "Your compliance score based on inspections and document acknowledgments",
  },
  {
    title: "Data Export Anytime",
    description: "Download your complete work history. You own your data, period.",
  },
  {
    title: "One Employer Connection",
    description: "Connect with one company at a time",
  },
];

const plusFeatures = [
  {
    title: "Certification Expiry Alerts",
    description: "60-day yellow warning, 30-day red alert. Never miss a renewal.",
  },
  {
    title: "Multi-Employer Connections",
    description: "Work your main job Monday-Thursday, pick up side gigs Friday-Sunday.",
  },
  {
    title: "Job Board Access",
    description: "See and apply to urban rope tech positions posted by companies on the platform",
  },
  {
    title: "Enhanced Profile Visibility",
    description: "Employers searching for techs see your profile first",
  },
  {
    title: "Level Progression Tracking",
    description: "Visual display of hours toward your next IRATA level (L1 to L2 to L3)",
  },
];

const faqData = [
  {
    question: "Is this really free for technicians?",
    answer: "Yes. Technicians never pay for Standard accounts. Employers pay for the platform. Your career data belongs to you.",
  },
  {
    question: "What if my employer doesn't use OnRopePro?",
    answer: "You can still create your account and log your hours manually. When they join (or you switch to an employer who uses it), your history is already there.",
  },
  {
    question: "Can I import my existing IRATA/SPRAT logbook?",
    answer: "Yes. Our OCR import lets you photograph your existing logbook pages and digitize your hours automatically.",
  },
  {
    question: "What happens to my data if I leave an employer?",
    answer: "Your Technician Passport stays with you. Your work history, certifications, and performance data are yours permanently. Employers only see data from the time you worked for them.",
  },
  {
    question: "Can employers see my data without permission?",
    answer: "No. You control who sees your profile. Employers can only see data from projects you worked on for them. Your complete history is only visible to you (and anyone you choose to share it with).",
  },
  {
    question: "When does this launch?",
    answer: "January 2026. Early waitlist members get priority onboarding and founding member benefits.",
  },
];

export default function PreLaunchTechnicianPage() {
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [irataLevel, setIrataLevel] = useState("");
  const [bottomFullName, setBottomFullName] = useState("");
  const [bottomEmail, setBottomEmail] = useState("");

  const signupMutation = useMutation({
    mutationFn: async (data: { companyName: string; email: string; stakeholderType: string; source: string; irataLevel?: string }) => {
      return apiRequest("POST", "/api/early-access", data);
    },
    onSuccess: () => {
      toast({
        title: "You're on the list!",
        description: "We'll reach out before launch.",
      });
      setFullName("");
      setEmail("");
      setIrataLevel("");
      setBottomFullName("");
      setBottomEmail("");
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again or email hello@onrope.pro",
        variant: "destructive",
      });
    },
  });

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    signupMutation.mutate({
      companyName: fullName.trim(),
      email: email.trim(),
      stakeholderType: "technician",
      source: "technician-landing-hero",
      irataLevel: irataLevel || undefined,
    });
  };

  const handleBottomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bottomFullName.trim() || !bottomEmail.trim()) return;
    signupMutation.mutate({
      companyName: bottomFullName.trim(),
      email: bottomEmail.trim(),
      stakeholderType: "technician",
      source: "technician-landing-footer",
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section
        className="relative text-white pb-[120px]"
        style={{ backgroundImage: "linear-gradient(135deg, #0F1629 0%, #1a2744 100%)" }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="flex justify-center pt-8 pb-4">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-12 md:h-16" />
          </div>

          <div className="text-center space-y-6 pt-8">
            <Badge className="bg-[#fa7315] text-white border-0 text-sm px-4 py-1">
              LAUNCHING JANUARY 2026
            </Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              2026: The year your work history<br className="hidden md:block" />
              <span className="text-slate-300">finally belongs to you.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Every drop. Every certification. Every employer. One portable profile that follows your career, not theirs.
            </p>

            <div className="max-w-xl mx-auto pt-4">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-xl">
                <form onSubmit={handleHeroSubmit} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 h-12"
                    data-testid="input-tech-name"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 h-12"
                    data-testid="input-tech-email"
                    required
                  />
                  <Select value={irataLevel} onValueChange={setIrataLevel}>
                    <SelectTrigger className="bg-white/10 border-white/30 text-white h-12" data-testid="select-tech-level">
                      <SelectValue placeholder="Current IRATA/SPRAT Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="level1">Level 1</SelectItem>
                      <SelectItem value="level2">Level 2</SelectItem>
                      <SelectItem value="level3">Level 3</SelectItem>
                      <SelectItem value="not-certified">Not Yet Certified</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#fa7315] text-white hover:bg-[#e5680f] h-12"
                    disabled={signupMutation.isPending}
                    data-testid="button-tech-early-access"
                  >
                    {signupMutation.isPending ? "Submitting..." : "Join the Waitlist"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>
                <p className="text-sm text-slate-300 mt-4 text-center">
                  Free for technicians. Always.
                </p>
              </div>
            </div>

            <p className="text-base text-slate-400 pt-4">
              500+ rope access techs across North America. The ones who join early build their verified history first.
            </p>
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

      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Your career, finally documented.
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            IRATA/SPRAT hours logged automatically. Performance data that proves your value. A professional profile that moves when you move. No more starting from zero with every new employer.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <IdCard className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Technician Passport</h3>
                <p className="text-muted-foreground text-base">
                  Your certifications, work history, and safety record in one portable profile. Switch employers without losing your professional identity.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Personal Safety Rating</h3>
                <p className="text-muted-foreground text-base">
                  A score that follows you across employers and proves your professionalism. High performers stand out.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Verified Hours</h3>
                <p className="text-muted-foreground text-base">
                  Same-day IRATA/SPRAT logging with OCR import from existing logbooks. Your hours, always current, always verified.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 bg-[#0F1629] text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Problems You Won't Have Anymore
          </h2>
          <p className="text-center text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
            Every feature exists because a rope access tech told us about a real frustration.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problemsData.map((problem, i) => (
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

      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            One Account. Every Employer. Your Entire Career.
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Your OnRopePro account belongs to you, not your employer.
          </p>

          <div className="space-y-6">
            {howItWorksSteps.map((step) => (
              <Card key={step.step} className="border border-slate-200 dark:border-slate-800">
                <CardContent className="p-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-[#fa7315] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">{step.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <step.icon className="w-5 h-5 text-[#fa7315]" />
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-base">{step.description}</p>
                    </div>
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
            Crystal Clear: What's Free, What's PLUS
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Your free account is yours forever. PLUS adds premium features - or get it free with one referral.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-xl">FREE Account</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-6">Always free. Never expires.</p>
                <ul className="space-y-4">
                  {freeFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-base">{feature.title}</p>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  This is yours. Forever. No strings.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#fa7315]">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-xl">PLUS Account</h3>
                  <Badge className="bg-[#fa7315] text-white border-0">PRO</Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-6">or FREE with one referral</p>
                <p className="text-sm font-medium text-muted-foreground mb-4 italic">Everything in Free, plus...</p>
                <ul className="space-y-4">
                  {plusFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#fa7315] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-base">{feature.title}</p>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <span className="font-medium">How to get PLUS:</span> Refer one other technician who creates an account. They get a free account. You both win.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section
        className="py-16 md:py-20 px-4 text-white"
        style={{ backgroundImage: "linear-gradient(135deg, #fa7315 0%, #fa7315 100%)" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your hours are your proof. Start documenting them.
          </h2>
          <p className="text-white text-lg mb-8">
            Join the waitlist. Be first to claim your Technician Passport.
          </p>

          <form onSubmit={handleBottomSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6">
            <Input
              type="text"
              placeholder="Full name"
              value={bottomFullName}
              onChange={(e) => setBottomFullName(e.target.value)}
              className="bg-white text-black h-12"
              data-testid="input-tech-bottom-name"
              required
            />
            <Input
              type="email"
              placeholder="Email address"
              value={bottomEmail}
              onChange={(e) => setBottomEmail(e.target.value)}
              className="bg-white text-black h-12"
              data-testid="input-tech-bottom-email"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="bg-slate-900 text-white hover:bg-slate-800 h-12 px-8"
              disabled={signupMutation.isPending}
              data-testid="button-tech-bottom-cta"
            >
              Join the Waitlist
            </Button>
          </form>

          <p className="text-white font-medium text-base mt-6">
            Free for technicians. Built by rope access professionals.
          </p>
        </div>
      </section>

      <PreLaunchFooter />
    </div>
  );
}
