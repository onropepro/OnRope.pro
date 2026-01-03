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
  CheckCircle2,
  Ticket,
  BarChart3,
  Rocket,
  Clock,
  Smartphone,
  Award,
  Calendar,
  Wallet,
  TrendingUp,
} from "lucide-react";

const technicianBenefits = [
  {
    icon: Ticket,
    headline: "Your portable professional profile",
    detail: "IRATA/SPRAT certifications, work history, and performance stats travel with you. New employer? They see your verified track record instantly.",
    metric: "Career follows you",
  },
  {
    icon: Smartphone,
    headline: "Log drops from your phone in seconds",
    detail: "Tap to start work session, tap to end. Drop count, hours, and photos captured. No paper timesheets to fill out at end of day.",
    metric: "10 seconds per entry",
  },
  {
    icon: BarChart3,
    headline: "Know your daily target",
    detail: "See exactly what's expected. 'Marina Towers: 5 drops/day target. Yesterday you did 4.' No more guessing if you're meeting standards.",
    metric: "Clear expectations",
  },
  {
    icon: Wallet,
    headline: "Paycheck accuracy you can trust",
    detail: "Every work session timestamped and recorded. Piece-work rates calculated automatically. No more disputes over hours or drops.",
    metric: "Zero payroll errors",
  },
  {
    icon: Calendar,
    headline: "See your schedule, plan your life",
    detail: "Upcoming assignments visible in your app. Know where you're working next week. Request time off directly through the system.",
    metric: "Work-life visibility",
  },
  {
    icon: TrendingUp,
    headline: "Build your reputation with data",
    detail: "Performance trends show your growth over time. High performers stand out. When promotions happen, the data supports you.",
    metric: "Objective career progression",
  },
];

export default function PreLaunchTechnicianPage() {
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const signupMutation = useMutation({
    mutationFn: async (data: { companyName: string; email: string; stakeholderType: string; source: string }) => {
      return apiRequest("POST", "/api/early-access", data);
    },
    onSuccess: () => {
      toast({
        title: "You're on the list!",
        description: "We'll let you know when the technician portal launches.",
      });
      setFullName("");
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
    if (!fullName.trim() || !email.trim()) return;
    signupMutation.mutate({
      companyName: fullName.trim(),
      email: email.trim(),
      stakeholderType: "technician",
      source: "technician-landing",
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section
        className="relative text-white pb-[120px]"
        style={{ backgroundImage: "linear-gradient(135deg, #5C7A84 0%, #4A656E 100%)" }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="flex justify-center pt-8 pb-4">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-12 md:h-16" />
          </div>

          <div className="text-center space-y-6 pt-8">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1">
              FOR ROPE ACCESS TECHNICIANS
            </Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Log your work. Prove your value.<br className="hidden md:block" />
              <span className="text-slate-200">Own your career.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
              Your certifications, work history, and performance data in one portable profile.
              When you change employers, your reputation comes with you.
            </p>

            <p className="text-slate-200">
              Launching January 2026. Get notified when we go live.
            </p>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white text-left block">
                    Your Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                    data-testid="input-tech-name"
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
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                    data-testid="input-tech-email"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-white text-[#5C7A84] hover:bg-slate-100"
                disabled={signupMutation.isPending}
                data-testid="button-tech-early-access"
              >
                {signupMutation.isPending ? "Submitting..." : "Get Notified at Launch"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-xs text-slate-200/80">
                Free for technicians. No spam. Unsubscribe anytime.
              </p>
            </form>
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
                  <div className="text-2xl md:text-3xl font-bold text-blue-700">10 sec</div>
                  <div className="text-sm text-muted-foreground mt-1">To Log a Drop</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600">100%</div>
                  <div className="text-sm text-muted-foreground mt-1">Payroll Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600">Portable</div>
                  <div className="text-sm text-muted-foreground mt-1">Career Profile</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-violet-600">Free</div>
                  <div className="text-sm text-muted-foreground mt-1">For Technicians</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What OnRopePro Does For You
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Built for technicians who want their work to speak for itself.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {technicianBenefits.map((benefit, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-[#5C7A84]" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.headline}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{benefit.detail}</p>
                      <Badge variant="secondary" className="text-xs">
                        {benefit.metric}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Your Technician Passport
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Everything that makes you valuable as a rope access professional, documented and portable.
          </p>

          <Card>
            <CardContent className="p-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#5C7A84]" />
                    Certifications
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      IRATA/SPRAT levels with expiry tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Verified logged hours (same-day logging)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Supporting certifications (first aid, fall arrest)
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#5C7A84]" />
                    Performance Data
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Average drops per day
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Job completion rates
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Personal Safety Rating (PSR)
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section
        className="py-16 md:py-20 px-4 text-white"
        style={{ backgroundImage: "linear-gradient(135deg, #5C7A84 0%, #4A656E 100%)" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to own your career data?
          </h2>
          <p className="text-slate-200 text-lg mb-8">
            Join the waitlist. We'll notify you the moment the technician portal goes live.
          </p>
          <Button
            size="lg"
            className="bg-white text-[#5C7A84] hover:bg-slate-100"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-testid="button-tech-final-cta"
          >
            Get Notified at Launch
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <PreLaunchFooter />
    </div>
  );
}
