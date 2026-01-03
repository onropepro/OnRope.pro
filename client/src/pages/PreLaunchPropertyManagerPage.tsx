import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PreLaunchFooter } from "@/components/PreLaunchFooter";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Eye,
  Clock,
  FileText,
  BarChart3,
  Scale,
  Download,
  MessageSquare,
} from "lucide-react";

const pmBenefits = [
  {
    icon: Shield,
    headline: "See vendor safety compliance at a glance",
    detail: "Company Safety Rating (CSR) shows documentation completion, toolbox meetings, and harness inspections. Compare vendors objectively before signing contracts.",
    metric: "Due diligence documented",
  },
  {
    icon: Eye,
    headline: "Answer owner questions instantly",
    detail: "'How's the window washing going?' Log in, check progress: '68% complete, ahead of schedule.' No calling the contractor.",
    metric: "Instant status visibility",
  },
  {
    icon: MessageSquare,
    headline: "Get out of the complaint loop",
    detail: "Residents submit feedback directly to vendors through the portal. You see resolution status without being the middleman.",
    metric: "20+ hrs/month saved",
  },
  {
    icon: BarChart3,
    headline: "Evaluate vendors with data, not gut feel",
    detail: "Average response time, resolution rates, and CSR trends over time. Contract renewal decisions backed by objective performance metrics.",
    metric: "Data-driven decisions",
  },
  {
    icon: Download,
    headline: "Download safety docs without asking",
    detail: "Anchor inspection certificates, insurance docs, and rope access plans available in your portal. No email requests, no waiting.",
    metric: "Self-service access",
  },
  {
    icon: Scale,
    headline: "Protect yourself when accidents happen",
    detail: "'What due diligence did you perform?' Show documented vendor CSR review, safety compliance tracking, and contract requirements.",
    metric: "Liability protection",
  },
];

export default function PreLaunchPropertyManagerPage() {
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");

  const signupMutation = useMutation({
    mutationFn: async (data: { companyName: string; email: string; stakeholderType: string; source: string }) => {
      return apiRequest("POST", "/api/early-access", data);
    },
    onSuccess: () => {
      toast({
        title: "You're on the list!",
        description: "We'll let you know when the property manager portal launches.",
      });
      setFullName("");
      setCompany("");
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
      companyName: company.trim() ? `${fullName.trim()} - ${company.trim()}` : fullName.trim(),
      email: email.trim(),
      stakeholderType: "property_manager",
      source: "property-manager-landing",
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section
        className="relative text-white pb-[120px]"
        style={{ backgroundImage: "linear-gradient(135deg, #6E9075 0%, #5A7A60 100%)" }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="flex justify-center pt-8 pb-4">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-12 md:h-16" />
          </div>

          <div className="text-center space-y-6 pt-8">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1">
              FOR PROPERTY & STRATA MANAGERS
            </Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Verify vendor performance.<br className="hidden md:block" />
              <span className="text-green-100">Reduce your liability.</span>
            </h1>

            <p className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              See real-time project progress, safety compliance scores, and response metrics
              for your rope access vendors. No more phone calls for updates.
            </p>

            <p className="text-green-100">
              Launching January 2026. Get notified when we go live.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 pt-4">
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
                  data-testid="input-pm-name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-white text-left block">
                  Management Company (optional)
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your management company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                  data-testid="input-pm-company"
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
                  data-testid="input-pm-email"
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-white text-[#6E9075] hover:bg-green-50"
                disabled={signupMutation.isPending}
                data-testid="button-pm-early-access"
              >
                {signupMutation.isPending ? "Submitting..." : "Get Notified at Launch"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-xs text-green-100/80">
                Free for property managers. No spam. Unsubscribe anytime.
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
                  <div className="text-2xl md:text-3xl font-bold text-blue-700">Real-time</div>
                  <div className="text-sm text-muted-foreground mt-1">Project Visibility</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600">20+ hrs</div>
                  <div className="text-sm text-muted-foreground mt-1">Monthly Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600">1-Click</div>
                  <div className="text-sm text-muted-foreground mt-1">Safety Doc Access</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-violet-600">Free</div>
                  <div className="text-sm text-muted-foreground mt-1">For Property Managers</div>
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
            Get out of the middle. Let the data do the talking.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {pmBenefits.map((benefit, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-[#6E9075]" />
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
            Company Safety Rating (CSR)
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Finally, an objective way to compare rope access vendors.
          </p>

          <Card>
            <CardContent className="p-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#6E9075]" />
                    What CSR Measures
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Safety documentation completion rate
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Toolbox meeting frequency
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Harness inspection compliance
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Incident history and response
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#6E9075]" />
                    Documentation Access
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Anchor inspection certificates
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Insurance documents (COI)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Rope access plans
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Method statements
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
        style={{ backgroundImage: "linear-gradient(135deg, #6E9075 0%, #5A7A60 100%)" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to see vendor performance clearly?
          </h2>
          <p className="text-green-100 text-lg mb-8">
            Join the waitlist. We'll notify you the moment the property manager portal goes live.
          </p>
          <Button
            size="lg"
            className="bg-white text-[#6E9075] hover:bg-green-50"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-testid="button-pm-final-cta"
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
