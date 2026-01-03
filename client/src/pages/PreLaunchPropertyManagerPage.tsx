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
  BarChart3,
  Building2,
  MessageSquare,
  Eye,
  Clock,
  FileCheck,
  Upload,
  Check,
  Users,
  Layers,
  FileText,
} from "lucide-react";

const problemsData = [
  {
    before: "I have no way to verify if my vendors are actually following safety protocols",
    after: "Company Safety Rating shows documentation completion, toolbox meetings, and harness inspections. Objective data, not sales pitches.",
  },
  {
    before: "I spend hours chasing vendor insurance certificates before they expire",
    after: "All certificates visible in your portal. System alerts vendors before expiration. You just verify, not chase.",
  },
  {
    before: "Residents complain to me about window washing, and I have to relay it to the vendor",
    after: "Residents submit feedback directly to vendors. You see resolution status without playing telephone.",
  },
  {
    before: "When the building owner asks how the project is going, I have to call the contractor",
    after: "Log in and check: \"68% complete, ahead of schedule.\" Answer instantly without calling anyone.",
  },
  {
    before: "I have no data to justify why I chose one vendor over another",
    after: "CSR scores, response times, and resolution rates give you objective criteria for vendor selection and renewal decisions.",
  },
  {
    before: "If there's an accident, I can't prove I did due diligence on vendor safety",
    after: "Your portal shows documented history of CSR reviews, safety compliance monitoring, and certificate verification. Due diligence, documented.",
  },
];

const featuresData = [
  {
    title: "Company Safety Rating Visibility",
    description: "See each vendor's CSR score before and during contracts. Compare vendors objectively.",
    icon: BarChart3,
  },
  {
    title: "Real-Time Project Dashboards",
    description: "Progress by elevation, crew assignments, expected completion. No status calls required.",
    icon: Eye,
  },
  {
    title: "Self-Service Document Access",
    description: "Download insurance certificates, anchor inspections, and safety plans without asking.",
    icon: FileCheck,
  },
  {
    title: "Resident Feedback Routing",
    description: "Complaints go directly to vendors. You monitor resolution without managing the conversation.",
    icon: MessageSquare,
  },
  {
    title: "Response Time Metrics",
    description: "Average response and resolution times per vendor. Data for contract renewal decisions.",
    icon: Clock,
  },
  {
    title: "Anchor Inspection Upload",
    description: "Upload your building's annual anchor inspection certificates. Vendors see them automatically.",
    icon: Upload,
  },
];

const howItWorksSteps = [
  {
    step: 1,
    title: "Create Your Free Account",
    description: "Sign up in minutes. No vendor invitation required. Your account is ready to use immediately.",
  },
  {
    step: 2,
    title: "Add Your Buildings",
    description: "Register the buildings in your portfolio. Upload anchor inspection certificates and set up building profiles.",
  },
  {
    step: 3,
    title: "Connect With Vendors",
    description: "When a rope access company using OnRopePro works on your building, you automatically see their project data, safety docs, and CSR scores.",
  },
  {
    step: 4,
    title: "Residents Connect (Optional)",
    description: "Give residents access to see progress and submit feedback directly. Complaints route to vendors, not you.",
  },
  {
    step: 5,
    title: "Make Better Decisions",
    description: "Use objective data for vendor evaluations, contract renewals, and due diligence documentation.",
  },
];

const portfolioBenefits = [
  {
    title: "Multi-Building View",
    description: "See all active projects across your portfolio in one dashboard",
  },
  {
    title: "Vendor Comparison",
    description: "Compare CSR scores and response times across all your rope access vendors",
  },
  {
    title: "Building History",
    description: "Maintenance history accumulates over time, even when vendors change",
  },
  {
    title: "Team Access",
    description: "Add colleagues with appropriate permissions for different buildings",
  },
  {
    title: "Compliance Reporting",
    description: "Generate reports for building owners showing vendor safety compliance",
  },
];

const faqData = [
  {
    question: "Is this really free for property managers?",
    answer: "Yes. Rope access companies pay for OnRopePro. Property managers get free portal access when their vendors use the platform.",
  },
  {
    question: "What if my current vendor doesn't use OnRopePro?",
    answer: "You can tell them about it. When they join and add your building, you'll get invited to the portal. Or when you switch to a vendor who uses it, you'll see the difference immediately.",
  },
  {
    question: "Can I see vendors' safety records before hiring them?",
    answer: "If a vendor is on OnRopePro, you can request to view their Company Safety Rating as part of your RFP process. Vendors can share their CSR with prospective clients.",
  },
  {
    question: "What data do I have access to?",
    answer: "You see project progress, safety documentation, Company Safety Rating, response time metrics, and resident feedback for buildings you manage. You don't see vendor financials, employee details, or other clients' data.",
  },
  {
    question: "Can I upload documents like anchor inspections?",
    answer: "Yes. You can upload your building's annual anchor inspection certificates. Vendors see them automatically when they work on your building.",
  },
  {
    question: "Does this replace my property management software?",
    answer: "No. OnRopePro focuses specifically on rope access vendor management. It complements your existing property management systems.",
  },
  {
    question: "When does this launch?",
    answer: "January 2026. Join the waitlist to be notified when the property manager portal goes live. You'll be able to create your free account immediately at launch.",
  },
];

export default function PreLaunchPropertyManagerPage() {
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [buildingsManaged, setBuildingsManaged] = useState("");
  const [bottomFullName, setBottomFullName] = useState("");
  const [bottomEmail, setBottomEmail] = useState("");
  const [bottomCompanyName, setBottomCompanyName] = useState("");

  const signupMutation = useMutation({
    mutationFn: async (data: { companyName: string; email: string; stakeholderType: string; source: string; buildingsManaged?: string }) => {
      return apiRequest("POST", "/api/early-access", data);
    },
    onSuccess: () => {
      toast({
        title: "You're on the list!",
        description: "We'll notify you when the property manager portal goes live.",
      });
      setFullName("");
      setEmail("");
      setCompanyName("");
      setBuildingsManaged("");
      setBottomFullName("");
      setBottomEmail("");
      setBottomCompanyName("");
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate({
      companyName: `${fullName} - ${companyName}`,
      email,
      stakeholderType: "property-manager",
      source: "pm-prelaunch-hero",
      buildingsManaged,
    });
  };

  const handleBottomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate({
      companyName: `${bottomFullName} - ${bottomCompanyName}`,
      email: bottomEmail,
      stakeholderType: "property-manager",
      source: "pm-prelaunch-bottom",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex flex-col justify-center px-4 py-16 md:py-24"
        style={{ backgroundImage: "linear-gradient(135deg, #0F1629 0%, #193A63 100%)" }}
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="mb-6">
                <img
                  src={onRopeProLogo}
                  alt="OnRopePro"
                  className="h-10 md:h-12 w-auto"
                />
              </div>
              
              <Badge className="mb-6 bg-[#fa7315] text-white border-0 px-4 py-1.5 text-sm font-medium">
                LAUNCHING JANUARY 2026
              </Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                2026: The year you can finally see which vendors are worth renewing.
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
                Company Safety Ratings. Response time metrics. Real-time project dashboards. Stop guessing which rope access vendors are actually safe.
              </p>

              <p className="text-slate-400 text-base">
                Property managers across North America are tired of chasing vendor certificates. We built something better.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 md:p-8">
              <h2 className="text-white text-xl font-semibold mb-6">
                Get Early Access
              </h2>
              
              <form onSubmit={handleHeroSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-12"
                  data-testid="input-pm-hero-name"
                  required
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-12"
                  data-testid="input-pm-hero-email"
                  required
                />
                <Input
                  type="text"
                  placeholder="Company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-12"
                  data-testid="input-pm-hero-company"
                  required
                />
                <Select value={buildingsManaged} onValueChange={setBuildingsManaged}>
                  <SelectTrigger 
                    className="bg-white/10 border-white/20 text-white h-12"
                    data-testid="select-pm-buildings"
                  >
                    <SelectValue placeholder="Number of buildings managed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 buildings</SelectItem>
                    <SelectItem value="6-15">6-15 buildings</SelectItem>
                    <SelectItem value="16-50">16-50 buildings</SelectItem>
                    <SelectItem value="50+">50+ buildings</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#fa7315] hover:bg-[#e56610] text-white h-12 text-base font-semibold"
                  disabled={signupMutation.isPending}
                  data-testid="button-pm-hero-cta"
                >
                  Get Early Access
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
              
              <p className="text-slate-400 text-sm mt-4 text-center">
                Free for property managers. Your vendors pay for the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Answer Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Vendor compliance, finally visible.
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              OnRopePro gives you a window into your rope access vendors' operations. Safety documentation, project progress, response metrics. The data you need to make informed decisions and protect yourself from liability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-[#fa7315]/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-[#fa7315]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Company Safety Rating</h3>
                <p className="text-muted-foreground text-sm">
                  A real-time score reflecting each vendor's safety documentation, toolbox meetings, and compliance. Compare vendors objectively before signing contracts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-[#fa7315]/10 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-[#fa7315]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Your Vendor Dashboard</h3>
                <p className="text-muted-foreground text-sm">
                  See all your rope access vendors in one place. Project progress, safety docs, insurance certificates. No more email chains asking for updates.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-[#fa7315]/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-[#fa7315]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Direct Resident Feedback</h3>
                <p className="text-muted-foreground text-sm">
                  Residents submit complaints directly to vendors through the portal. You see resolution status without being the middleman.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problems Solved Section */}
      <section
        className="py-16 md:py-24 px-4"
        style={{ backgroundImage: "linear-gradient(135deg, #0F1629 0%, #193A63 100%)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Problems You Won't Have Anymore
            </h2>
            <p className="text-slate-300 text-lg">
              Every feature exists because a property manager told us about a real frustration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {problemsData.map((problem, i) => (
              <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <p className="text-slate-400 text-sm font-medium mb-2">Before:</p>
                    <p className="text-slate-300 text-sm italic">"{problem.before}"</p>
                  </div>
                  <div>
                    <p className="text-[#fa7315] text-sm font-medium mb-2">After:</p>
                    <p className="text-white text-sm">{problem.after}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Manage Rope Access Vendors
            </h2>
            <p className="text-lg text-muted-foreground">
              All free. Your vendors pay for the platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresData.map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-[#fa7315]" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sign Up Free. See Your Vendors Clearly.
            </h2>
            <p className="text-lg text-muted-foreground">
              Create your free property manager account in minutes. No vendor invitation required.
            </p>
          </div>

          <div className="space-y-6">
            {howItWorksSteps.map((step, i) => (
              <div key={i} className="flex gap-4 md:gap-6">
                <div className="w-10 h-10 rounded-full bg-[#fa7315] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  {step.step}
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Your Buildings Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              One Portal. All Your Buildings. Every Vendor.
            </h2>
            <p className="text-lg text-muted-foreground">
              Whether you manage 5 buildings or 50, your OnRopePro dashboard scales with you.
            </p>
          </div>

          <div className="space-y-4">
            {portfolioBenefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <Check className="w-5 h-5 text-[#fa7315] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-base">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 bg-slate-50 dark:bg-slate-900">
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

      {/* Final CTA Section */}
      <section
        className="py-16 md:py-20 px-4 text-white"
        style={{ backgroundImage: "linear-gradient(135deg, #fa7315 0%, #fa7315 100%)" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stop chasing. Start verifying.
          </h2>
          <p className="text-white text-lg mb-8">
            Join the waitlist. Be ready when your vendors join OnRopePro.
          </p>

          <form onSubmit={handleBottomSubmit} className="flex flex-col gap-4 max-w-lg mx-auto mb-6">
            <Input
              type="text"
              placeholder="Full name"
              value={bottomFullName}
              onChange={(e) => setBottomFullName(e.target.value)}
              className="bg-white text-black h-12"
              data-testid="input-pm-bottom-name"
              required
            />
            <Input
              type="email"
              placeholder="Email address"
              value={bottomEmail}
              onChange={(e) => setBottomEmail(e.target.value)}
              className="bg-white text-black h-12"
              data-testid="input-pm-bottom-email"
              required
            />
            <Input
              type="text"
              placeholder="Company name"
              value={bottomCompanyName}
              onChange={(e) => setBottomCompanyName(e.target.value)}
              className="bg-white text-black h-12"
              data-testid="input-pm-bottom-company"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="bg-slate-900 text-white hover:bg-slate-800 h-12 px-8"
              disabled={signupMutation.isPending}
              data-testid="button-pm-bottom-cta"
            >
              Get Early Access
            </Button>
          </form>

          <p className="text-white font-medium text-base mt-6">
            Free for property managers. Built by building maintenance professionals.
          </p>
        </div>
      </section>

      <PreLaunchFooter />
    </div>
  );
}
