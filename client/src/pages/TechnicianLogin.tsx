import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  HardHat, 
  ArrowLeft, 
  Mail, 
  CreditCard, 
  CheckCircle2, 
  Shield, 
  Clock, 
  FileText, 
  Bell, 
  Users,
  Star,
  ChevronRight,
  Lock,
  Smartphone,
  MapPin,
  Download,
  Share2,
  Award
} from "lucide-react";
import { TechnicianRegistration } from "@/components/TechnicianRegistration";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const loginSchema = z.object({
  identifier: z.string().min(1, "License number or email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const problemRows = [
  {
    direction: "left" as const,
    problems: [
      "New job, same paperwork again",
      "Proving yourself from zero",
      "Where's my first aid cert?",
      "Can't find my logbook",
      "Filling out banking forms for the 4th time",
      "IRATA expiring next week",
      "Nobody told me",
    ]
  },
  {
    direction: "right" as const,
    problems: [
      "Lost 3 hours to admin",
      "Paper logbook is a disaster",
      "Can't remember what I worked on",
      "Certification scattered everywhere",
      "New employer treats me like a rookie",
      "Work history doesn't follow me",
    ]
  },
  {
    direction: "left" as const,
    problems: [
      "$63 missing from my check",
      "Supervisor logged wrong hours",
      "My word against a spreadsheet",
      "Payroll disputes every month",
      "I swear I worked 9 hours",
      "Can't prove anything",
    ]
  },
  {
    direction: "right" as const,
    problems: [
      "Indeed is useless for rope access jobs",
      "Where are the good postings?",
      "How do I prove 8 years experience?",
      "Gut feel isn't negotiation leverage",
      "High performer, average review",
    ]
  },
  {
    direction: "left" as const,
    problems: [
      "Safety records stayed with last employer",
      "Can't prove training history",
      "Paper forms somewhere in a truck",
      "Audit asks for 6 months of inspections",
      "My reputation locked in someone else's filing cabinet",
    ]
  },
  {
    direction: "right" as const,
    problems: [
      "Moonlighting is a coordination nightmare",
      "Can't work two companies easily",
      "Weekends wasted on admin",
      "No way to track multiple employers",
      "Building my own client base with no system",
    ]
  },
  {
    direction: "left" as const,
    problems: [
      "Onboarding takes half a day",
      "Same questions every job",
      "Emergency contact forms again",
      "Voided cheque request #47",
      "Why doesn't this follow me?",
      "Starting over is exhausting",
    ]
  },
  {
    direction: "right" as const,
    problems: [
      "Career progress invisible",
      "No data for raise negotiations",
      "Performance measured by politics not output",
      "High performers unrecognized",
      "Coasters get the same treatment",
      "Where's the proof?",
    ]
  },
];

function ScrollingProblems({ problems, direction }: { problems: string[], direction: "left" | "right" }) {
  const duplicatedProblems = [...problems, ...problems, ...problems];
  
  return (
    <div className="overflow-hidden py-2">
      <div 
        className={`flex gap-10 whitespace-nowrap ${
          direction === "left" ? "animate-scroll-left" : "animate-scroll-right"
        }`}
        style={{
          width: "max-content",
        }}
      >
        {duplicatedProblems.map((problem, index) => (
          <span 
            key={index} 
            className="text-lg text-muted-foreground/80 flex items-center gap-3"
          >
            {problem}
            <span className="text-muted-foreground/40">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TechnicianLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [loginMethod, setLoginMethod] = useState<"license" | "email">("license");
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
    retry: false,
    staleTime: 30000,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (userData?.user) {
      if (userData.user.role === "rope_access_tech") {
        if (userData.user.companyId && !userData.user.terminatedDate) {
          setLocation("/dashboard");
        } else {
          setLocation("/technician-portal");
        }
      } else if (userData.user.role === "resident") {
        setLocation("/resident");
      } else if (userData.user.role === "property_manager") {
        setLocation("/property-manager");
      } else if (userData.user.role === "superuser") {
        setLocation("/superuser");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [userData, setLocation]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        form.setError("identifier", { message: result.message || "Login failed" });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      const userResponse = await fetch("/api/user", {
        credentials: "include",
      });
      
      if (!userResponse.ok) {
        form.setError("identifier", { 
          message: "Failed to verify account status. Please try again." 
        });
        return;
      }
      
      const userDataResult = await userResponse.json();
      const user = userDataResult.user;
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.name}`,
      });
      
      if (user.role === "rope_access_tech") {
        if (user.companyId && !user.terminatedDate) {
          setLocation("/dashboard");
        } else {
          setLocation("/technician-portal");
        }
      } else {
        setLocation("/dashboard");
      }
    } catch (error) {
      form.setError("identifier", { message: "An error occurred. Please try again." });
    }
  };

  const features = [
    {
      icon: FileText,
      title: "Professional Profile",
      description: "One tap to verify credentials. No more digging through emails."
    },
    {
      icon: Clock,
      title: "Work Session Logging",
      description: "Building, tasks, height, hours, supervisor signature—all searchable later."
    },
    {
      icon: Shield,
      title: "Logbook Scanner",
      description: "Photograph paper pages → digitized, searchable records. Never lose your history."
    },
    {
      icon: Lock,
      title: "Secure Document Vault",
      description: "SIN, banking, void cheque—encrypted storage, shared only with your permission."
    },
    {
      icon: Bell,
      title: "Expiry Alerts",
      description: "30 days before your IRATA/SPRAT expires. Your employer sees it too. Zero surprises."
    },
    {
      icon: Download,
      title: "Exportable History",
      description: "PDF work history for job applications. Prove 178 rope transfers, not just \"experienced.\""
    },
  ];

  const standardFeatures = [
    "Connect to 1 employer",
    "Professional profile with verified credentials",
    "Secure document vault",
    "Full work session logging",
    "Logbook photo scanning",
    "Emergency contact storage",
    "Referral code"
  ];

  const plusFeatures = [
    "Everything in Standard",
    "PLUS badge on your profile",
    "30-day certification expiry alerts",
    "Unlimited employer connections",
    "Exportable work history PDF",
    "Work history analytics",
    "Resume storage"
  ];

  const steps = [
    {
      number: "1",
      title: "Create your free profile",
      description: "Name, email, IRATA/SPRAT ID. That's it."
    },
    {
      number: "2",
      title: "Add your credentials",
      description: "Upload certifications, first aid, driver's abstract. Stored securely."
    },
    {
      number: "3",
      title: "Start logging",
      description: "New work sessions auto-track. Old paper pages become searchable digital records."
    },
    {
      number: "4",
      title: "Share your referral code",
      description: "One tech signs up → you both unlock Plus. No commission schemes. Just mutual benefit."
    }
  ];

  const faqs = [
    {
      question: "Why is this free?",
      answer: "Employers pay. You don't. When you bring your verified profile to a new company, they save hours of onboarding paperwork. That's worth paying for. Your career data stays yours forever—we just make it portable."
    },
    {
      question: "Who owns my data?",
      answer: "You do. Export it anytime. Delete it anytime. Your profile, your rules."
    },
    {
      question: "What if my employer doesn't use OnRopePro?",
      answer: "You still get all the personal benefits—document storage, logbook digitization, certification tracking. When they do eventually adopt it (most do), you're already set up."
    },
    {
      question: "Is my SIN/banking info safe?",
      answer: "Bank-level encryption. Shared only when YOU connect to an employer. Never sold. Never shared otherwise."
    },
    {
      question: "What's the referral thing about?",
      answer: "Share your unique code. When one tech signs up using it, you both get Plus. Not MLM. Not commission. Just both of you getting upgraded for free."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }
        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Left Column - 70% Marketing Content */}
      <div className="flex-1 lg:w-[70%] overflow-y-auto bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <img 
                src={onRopeProLogo} 
                alt="OnRopePro" 
                className="h-8 object-contain"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowLoginDialog(true)}
              data-testid="button-sign-in"
            >
              Sign In
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-full bg-primary/10">
                <HardHat className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">For IRATA & SPRAT Technicians</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Your Career Doesn't Follow You.{" "}
              <span className="text-primary">It Should.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              The free professional profile for rope access technicians. Your certifications, 
              work history, and reputation—portable, verified, and yours forever.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button 
                size="lg" 
                className="gap-2 text-lg px-8"
                onClick={() => setShowRegistration(true)}
                data-testid="button-hero-cta"
              >
                Create Your Free Profile
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Free forever. No credit card. Takes 2 minutes.
            </p>
          </div>
        </section>

        {/* Problem Section */}
        <section className="bg-muted/30 py-16 lg:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-8">
                You've earned your reputation. Why does it disappear every time you change jobs?
              </h2>
              
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  Eight years on rope. Level 3 IRATA. Hundreds of buildings. Zero safety incidents.
                </p>
                <p className="text-lg font-medium text-foreground">
                  None of that follows you.
                </p>
                <p>
                  New employer? You're a stranger with a certification card. Back to proving yourself 
                  on easy jobs while the loud guy who's been there six months gets the high-rise work.
                </p>
                <p>
                  Your paper logbook is a mess. Your certifications are scattered across three email 
                  accounts. Your banking info? You're filling it out for the fourth time this year.
                </p>
                <p className="text-lg font-semibold text-foreground pt-4">
                  This isn't how professionals work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-8">
                One profile. Every job. Forever yours.
              </h2>
              
              <p className="text-lg text-muted-foreground mb-10">
                OnRopePro gives you a portable professional identity that stays with you—no matter where you work.
              </p>
              
              <div className="grid gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Your credentials, verified</h3>
                    <p className="text-muted-foreground">
                      IRATA/SPRAT ID, first aid, driver's abstract—stored securely, shared when YOU connect.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Your history, preserved</h3>
                    <p className="text-muted-foreground">
                      Every work session, every building, every task. Scan your paper logbook pages to digitize years of experience.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Your documents, ready</h3>
                    <p className="text-muted-foreground">
                      Banking info, void cheque, emergency contact—auto-shared only when you join a new employer. No more paperwork on day one.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Your future, protected</h3>
                    <p className="text-muted-foreground">
                      30-day certification expiry alerts. Never get caught with a lapsed IRATA again.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-muted/30 py-16 lg:py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4">Built for how you actually work</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              Everything you need to own your professional identity and take it with you.
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Free vs Plus */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4">Free forever. Plus when you share.</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              Get started for free. Share with one tech to unlock Plus for both of you.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
              {/* Standard */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardHat className="w-5 h-5" />
                    Tech Standard
                  </CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">$0</span>
                    <span className="text-muted-foreground"> forever</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Everything you need to own your professional identity:
                  </p>
                  <ul className="space-y-2">
                    {standardFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Plus */}
              <Card className="border-primary/50 bg-primary/5 relative">
                <div className="absolute -top-3 left-4">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Tech Plus
                  </CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">$0</span>
                    <span className="text-muted-foreground"> with 1 referral</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share your code with one tech. When they sign up, you both unlock Plus:
                  </p>
                  <ul className="space-y-2">
                    {plusFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className={index === 0 ? "font-medium" : ""}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => setShowRegistration(true)}
                data-testid="button-plans-cta"
              >
                Get Your Free Profile
                <ChevronRight className="w-5 h-5" />
              </Button>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share with one tech. You both get Plus. It's that simple.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted/30 py-16 lg:py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4">2 minutes to start. Yours for life.</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              Getting started is simple. Here's how it works:
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-4 left-10 w-[calc(100%-2.5rem)] h-px bg-border" />
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => setShowRegistration(true)}
                data-testid="button-steps-cta"
              >
                Create Your Free Profile
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4">"What's the catch?"</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              Great question. Here are the answers to what you're probably wondering:
            </p>
            
            <div className="max-w-3xl space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-border pb-6 last:border-0">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-primary/5 border-t py-16 lg:py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Your career is worth more than a paper logbook.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              You've spent years building skills, experience, and reputation. Stop leaving it behind.
            </p>
            
            <div className="flex flex-col items-center gap-4">
              <Button 
                size="lg" 
                className="gap-2 text-lg px-8"
                onClick={() => setShowRegistration(true)}
                data-testid="button-final-cta"
              >
                Create Your Free Profile
                <ChevronRight className="w-5 h-5" />
              </Button>
              
              <button 
                onClick={() => setShowLoginDialog(true)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-sign-in"
              >
                Already have an account? Sign In
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-8">
              Join thousands of rope access professionals who own their career data.
            </p>
          </div>
        </section>

        {/* Footer Trust Elements */}
        <footer className="border-t py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Bank-level encryption
              </span>
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Works on any device
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Canadian company, Canadian data storage
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                IRATA/SPRAT verified
              </span>
            </div>
          </div>
        </footer>

        {/* Mobile: Show scrolling problems at bottom */}
        <div className="lg:hidden bg-muted/50 py-8 overflow-hidden">
          <p className="text-xs text-center text-muted-foreground mb-4 px-6">
            Sound familiar?
          </p>
          {problemRows.map((row, index) => (
            <ScrollingProblems key={index} problems={row.problems} direction={row.direction} />
          ))}
        </div>
      </div>

      {/* Right Column - 30% Scrolling Problems (Desktop only) */}
      <div className="hidden lg:block lg:w-[30%] bg-muted/50 border-l h-screen sticky top-0 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="shrink-0 bg-muted/50 border-b p-4">
            <p className="text-base font-medium text-muted-foreground text-center">
              Sound familiar?
            </p>
          </div>
          <div className="flex-1 flex flex-col justify-evenly py-6">
            {problemRows.map((row, index) => (
              <ScrollingProblems key={index} problems={row.problems} direction={row.direction} />
            ))}
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-login">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HardHat className="w-5 h-5 text-primary" />
              Technician Sign In
            </DialogTitle>
            <DialogDescription>
              Sign in with your IRATA/SPRAT license number or email
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={loginMethod === "license" ? "default" : "outline"}
                className="flex-1 gap-2"
                onClick={() => {
                  setLoginMethod("license");
                  form.setValue("identifier", "");
                }}
                data-testid="button-login-license"
              >
                <CreditCard className="w-4 h-4" />
                License Number
              </Button>
              <Button
                type="button"
                variant={loginMethod === "email" ? "default" : "outline"}
                className="flex-1 gap-2"
                onClick={() => {
                  setLoginMethod("email");
                  form.setValue("identifier", "");
                }}
                data-testid="button-login-email"
              >
                <Mail className="w-4 h-4" />
                Email
              </Button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {loginMethod === "license" ? "IRATA or SPRAT License Number" : "Email Address"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type={loginMethod === "email" ? "email" : "text"}
                          placeholder={loginMethod === "license" ? "e.g., 123456 (without /1, /2, /3)" : "you@example.com"}
                          data-testid="input-identifier"
                        />
                      </FormControl>
                      {loginMethod === "license" && (
                        <p className="text-xs text-muted-foreground">
                          Enter just the number without the level prefix (e.g., 123456 not 1/123456)
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
                          data-testid="input-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                  data-testid="button-login-submit"
                >
                  {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  New technician?
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                setShowLoginDialog(false);
                setShowRegistration(true);
              }}
              data-testid="button-register"
            >
              <HardHat className="w-4 h-4" />
              Register as a Technician
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <TechnicianRegistration 
        open={showRegistration} 
        onOpenChange={setShowRegistration}
      />
    </div>
  );
}
