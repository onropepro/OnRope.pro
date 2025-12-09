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
      "Filling out banking forms for the 4th time",
      "\"Bring a void cheque\"",
      "Emergency contact form again",
      "Half-day orientation",
      "Why doesn't this follow me?",
    ]
  },
  {
    direction: "right" as const,
    problems: [
      "Texting hours to the office",
      "Timesheet every Friday",
      "\"Did you log yesterday?\"",
      "Forgot to submit my time",
      "Hope they entered it right",
      "My word against their spreadsheet",
    ]
  },
  {
    direction: "left" as const,
    problems: [
      "Filling out my logbook two weeks late",
      "What building was I at?",
      "Making stuff up because I can't remember",
      "Staring at my phone trying to recall",
      "10 pages of guesswork",
      "This can't be right",
    ]
  },
  {
    direction: "right" as const,
    problems: [
      "$63 missing from my check",
      "Supervisor logged wrong hours",
      "Payroll disputes every month",
      "\"I swear I worked 9 hours\"",
      "Can't prove anything",
      "Who's actually tracking this?",
    ]
  },
  {
    direction: "left" as const,
    problems: [
      "8 years experience, zero proof",
      "\"I've done hundreds of rope transfers\"",
      "No data for raise negotiations",
      "Gut feel isn't leverage",
      "How do I prove what I've done?",
    ]
  },
  {
    direction: "right" as const,
    problems: [
      "Indeed is useless for rope access",
      "Endless search, zero results",
      "Where are the real postings?",
      "Nobody hiring on job boards",
      "Industry jobs are invisible",
    ]
  },
  {
    direction: "left" as const,
    problems: [
      "IRATA expiring next week",
      "Nobody told me",
      "Scrambling for recert",
      "Almost got caught on site with expired SPRAT",
      "Why isn't there a renewal alert?",
      "This could have been prevented",
    ]
  },
  {
    direction: "right" as const,
    problems: [
      "Moonlighting is a nightmare",
      "Can't work two companies easily",
      "Weekend jobs with no system",
      "Building my own clients with paper",
      "One profile should handle this",
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
            className="text-2xl text-muted-foreground/80 flex items-center gap-4"
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
      icon: Users,
      title: "Instant Employer Connection",
      description: "Plug into any company using OnRopePro. Your certs, banking, contacts—auto-shared. Employer only enters salary and permissions."
    },
    {
      icon: Clock,
      title: "Automatic Work Logging",
      description: "Connected to an employer? Hours, buildings, tasks submit automatically. No timesheets. No texts. No disputes."
    },
    {
      icon: FileText,
      title: "Logbook Reference",
      description: "Every session recorded—building, tasks, height, hours. Fill out your IRATA logbook from real data, not guesswork two weeks later."
    },
    {
      icon: Award,
      title: "Professional Profile",
      description: "IRATA/SPRAT ID, first aid, driver's abstract—verified and ready for any employer to see."
    },
    {
      icon: Lock,
      title: "Secure Document Vault",
      description: "SIN, banking, void cheque—encrypted. Shared only when YOU connect. Never asked for a void cheque again."
    },
    {
      icon: Shield,
      title: "Logbook Scanner",
      description: "Photograph old paper pages → digitized, searchable records. Your history doesn't disappear."
    },
    {
      icon: Bell,
      title: "Expiry Alerts (Plus)",
      description: "30 days before IRATA/SPRAT expires. Your employer sees it too. Zero surprises, zero lapses."
    },
    {
      icon: Download,
      title: "Exportable History (Plus)",
      description: "PDF proving 178 rope transfers, 3,500 deviations, 2,000 drops—not just \"I have 8 years experience.\""
    },
  ];

  const standardFeatures = [
    "Connect to 1 employer (instant onboarding, automatic hour logging)",
    "Professional profile with verified credentials",
    "Secure document vault (certs, banking, emergency contact)",
    "Automatic work session submission (no timesheets)",
    "Logbook reference (know what you actually worked on)",
    "Logbook photo scanning (digitize your history)",
    "Referral code to unlock Plus"
  ];

  const plusFeatures = [
    "Everything in Standard",
    "PLUS badge on your profile",
    "Unlimited employer connections (plug into multiple companies simultaneously)",
    "30-day certification expiry alerts (you AND your employer notified)",
    "Safety Rating score (0-100) with improvement recommendations",
    "Exportable work history PDF (178 rope transfers, 3,500 deviations—actual proof)",
    "Work history analytics (lifetime totals by task type)",
    "Resume storage",
    "Job board access (rope access-specific postings—no more endless Indeed searches)"
  ];

  const steps = [
    {
      number: "1",
      title: "Create your free profile",
      description: "Name, email, IRATA/SPRAT ID. Done in 2 minutes."
    },
    {
      number: "2",
      title: "Add your credentials once",
      description: "Upload certs, first aid, banking info. You'll never enter this again."
    },
    {
      number: "3",
      title: "Plug into your employer",
      description: "If they use OnRopePro, connect your account. They instantly see your verified credentials—zero paperwork on their end, zero on yours."
    },
    {
      number: "4",
      title: "Work. Everything logs automatically.",
      description: "Clock in through the app. Your hours, buildings, and tasks submit to your employer automatically. No timesheets. No texts. No disputes."
    },
    {
      number: "5",
      title: "Share your code, unlock Plus",
      description: "One tech signs up with your referral → you both get Plus. Unlimited employer connections, exportable history, expiry alerts, job board access."
    }
  ];

  const faqs = [
    {
      question: "Why is this free?",
      answer: "Employers pay. You don't. When you plug your verified profile into a new company, they skip hours of onboarding paperwork and get automatic hour tracking. That's worth paying for. Your profile stays yours forever—we just make it portable."
    },
    {
      question: "What does \"plug in\" actually mean?",
      answer: "If your employer uses OnRopePro, you connect your account to theirs with one tap. Instantly, they see your verified certs, banking info, and emergency contact—no forms to fill. From then on, your work hours submit automatically when you clock in/out. No timesheets. No texts. No \"did you log yesterday?\""
    },
    {
      question: "What if my employer doesn't use OnRopePro?",
      answer: "You still get all the personal benefits—document storage, logbook digitization, certification tracking, exportable work history. And when you eventually work for a company that does use it (or convince your current one), you're already set up for instant onboarding."
    },
    {
      question: "Who owns my data?",
      answer: "You do. Export it anytime. Delete it anytime. Unplug from any employer anytime. Your profile, your rules."
    },
    {
      question: "Is my SIN/banking info safe?",
      answer: "Bank-level encryption. Shared only when YOU connect to an employer. Never sold. Never shared otherwise. You control access."
    },
    {
      question: "What's the referral thing about?",
      answer: "Share your unique code. When one tech signs up using it, you both get Plus—unlimited employer connections, exportable history, expiry alerts. Not MLM. Not commission. Just mutual benefit."
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
              <span className="text-sm font-medium text-muted-foreground">For IRATA & SPRAT Technicians / Employees Working In Rope Access</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              You Work.{" "}
              <span className="text-primary">Everything Else Is Automatic.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              One profile. Any employer using OnRopePro. Hours submit themselves. Certs already verified. 
              Logbook entries you didn't have to make up. Onboarding done before you arrive.
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
                Same forms. Same timesheets. Same logbook you're making up.
              </h2>
              
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  New employer. New banking forms. New emergency contact sheet. New void cheque request. Again.
                </p>
                <p>
                  Every Friday: text your hours to the office. Hope they log them right. Dispute the paycheck when they don't.
                </p>
                <p>
                  And your logbook? You're filling it out two weeks late, staring at your phone trying to remember what building you were at, what tasks you did, making stuff up because who actually remembers.
                </p>
                <p className="text-lg font-medium text-foreground">
                  Eight years on rope. Level 3 IRATA. Hundreds of buildings.
                </p>
                <p>
                  And you're still filling out the same forms, still texting timesheets, still guessing at logbook entries like it's your first month.
                </p>
                <p className="text-lg font-semibold text-foreground pt-4">
                  There's a better way.
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
                Set up once. Plug into any employer. Done.
              </h2>
              
              <p className="text-lg text-muted-foreground mb-10">
                OnRopePro gives you a portable professional identity that <strong className="text-foreground">connects</strong> to any company using the platform.
              </p>
              
              <p className="font-semibold mb-4">Here's what that means:</p>
              
              <div className="grid gap-8">
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Day 1 at a new job?</h3>
                  <p className="text-muted-foreground">
                    You plug in. They instantly have your IRATA/SPRAT certs, first aid, driver's abstract, banking info, emergency contact—verified and ready. The only thing your employer has to do is enter your salary and permissions. That's it. No forms. No "bring a void cheque." No half-day orientation.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Every day after that?</h3>
                  <p className="text-muted-foreground">
                    Your work hours, buildings, tasks—logged automatically. Clock in, do your work, clock out. Hours submitted. No timesheets. No texts to the office. No "I swear I worked 9 hours" disputes.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">When you fill out your logbook?</h3>
                  <p className="text-muted-foreground">
                    Every session is recorded. Building address, tasks, height, hours. Fill out your IRATA logbook from actual records—not fuzzy memory two weeks later.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Change employers?</h3>
                  <p className="text-muted-foreground">
                    Unplug from Company A. Plug into Company B. Same instant onboarding. Same automatic logging. Your profile stays yours.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Work multiple companies?</h3>
                  <p className="text-muted-foreground">
                    With Plus, connect to unlimited employers simultaneously. Four days at Company A, weekends at Company B, your own clients on the side. One profile handles it all.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-muted/30 py-16 lg:py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4">The system that works while you work</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              Everything you need to own your professional identity and take it with you.
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-3">
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
            <h2 className="text-3xl font-bold mb-4">2 minutes to set up. Automatic from there.</h2>
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
              Set up once. That's it.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your certs. Your banking info. Your hours. Your logbook reference. Enter them once. Plug into any employer. Automatic from there.
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
              Free forever. Join rope access professionals who set up once and never looked back.
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
