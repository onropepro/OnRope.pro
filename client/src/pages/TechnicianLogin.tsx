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
  Award,
  X,
  MessageSquareWarning
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
  const [showProblemsColumn, setShowProblemsColumn] = useState(true);

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
      description: "Plug into any company using OnRopePro. Your certs, banking, contacts - auto-shared. Employer only enters salary and permissions."
    },
    {
      icon: Clock,
      title: "Automatic Work Logging",
      description: "Connected to an employer? Hours, buildings, tasks submit automatically. No timesheets. No texts. No disputes."
    },
    {
      icon: FileText,
      title: "Logbook Reference",
      description: "Every session recorded. Building, tasks, height, hours. Fill out your IRATA logbook from real data, not guesswork two weeks later."
    },
    {
      icon: Award,
      title: "Professional Profile",
      description: "IRATA/SPRAT ID, first aid, driver's abstract - verified and ready for any employer to see."
    },
    {
      icon: Lock,
      title: "Secure Document Vault",
      description: "SIN, banking, void cheque - encrypted. Shared only when YOU connect. Never asked for a void cheque again."
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
      description: "PDF proving 178 rope transfers, 3,500 deviations, 2,000 drops - not just \"I have 8 years experience.\""
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
    "Exportable work history PDF (178 rope transfers, 3,500 deviations - actual proof)",
    "Work history analytics (lifetime totals by task type)",
    "Resume storage",
    "Job board access (rope access-specific postings, no more endless Indeed searches)"
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
      description: "If they use OnRopePro, connect your account. They instantly see your verified credentials, zero paperwork on their end, zero on yours."
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
      answer: "Employers pay. You don't. When you plug your verified profile into a new company, they skip hours of onboarding paperwork and get automatic hour tracking. That's worth paying for. Your profile stays yours forever. We just make it portable."
    },
    {
      question: "What does \"plug in\" actually mean?",
      answer: "If your employer uses OnRopePro, you connect your account to theirs with one tap. Instantly, they see your verified certs, banking info, and emergency contact, no forms to fill. From then on, your work hours submit automatically when you clock in/out. No timesheets. No texts. No \"did you log yesterday?\""
    },
    {
      question: "What if my employer doesn't use OnRopePro?",
      answer: "You still get all the personal benefits: document storage, logbook digitization, certification tracking, exportable work history. And when you eventually work for a company that does use it (or convince your current one), you're already set up for instant onboarding."
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
      answer: "Share your unique code. When one tech signs up using it, you both get Plus: unlimited employer connections, exportable history, expiry alerts. Not MLM. Not commission. Just mutual benefit."
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

      {/* Left Column - 70% Marketing Content (or 100% when problems column is hidden) */}
      <div className={`flex-1 ${showProblemsColumn ? 'lg:w-[70%]' : 'lg:w-full'} overflow-y-auto bg-background transition-all duration-300`}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
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
              <nav className="hidden md:flex items-center gap-1">
                <Button
                  variant="ghost"
                  className="text-sm font-medium"
                  onClick={() => setLocation("#")}
                  data-testid="nav-employer"
                >
                  Employer
                </Button>
                <Button
                  variant="ghost"
                  className="text-sm font-medium"
                  onClick={() => setLocation("/technician-login")}
                  data-testid="nav-technician"
                >
                  Technician
                </Button>
                <Button
                  variant="ghost"
                  className="text-sm font-medium"
                  onClick={() => setLocation("#")}
                  data-testid="nav-property-manager"
                >
                  Property Manager
                </Button>
              </nav>
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

        {/* Hero Section - Flowbite Style */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <HardHat className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">For IRATA & SPRAT Technicians</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                You Work.{" "}
                <span className="text-[#0369A1]">Everything Else Is Automatic.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                One profile. Plug in to any employer using OnRopePro and hours submit themselves. Certs already verified. 
                Logbook entries you didn't have to make up. Paperwork done before you arrive.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  size="lg" 
                  className="gap-2 rounded-full bg-[#0369A1] shadow-lg shadow-primary/25"
                  onClick={() => setShowRegistration(true)}
                  data-testid="button-hero-cta"
                >
                  Create Your Free Profile
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg" 
                  className="gap-2 rounded-full"
                  onClick={() => setShowLoginDialog(true)}
                  data-testid="button-hero-signin"
                >
                  Sign In
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Free forever. No credit card. Takes 2 minutes.
              </p>
            </div>
          </div>
        </section>

        {/* Problem Section - Flowbite Style */}
        <section className="py-20 lg:py-28 bg-[#F3F4F6] dark:bg-muted/30">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
                  <span className="text-xs font-semibold text-destructive uppercase tracking-wider">The Problem</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                  Same forms. Same timesheets. Same logbook you're making up.
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
                <div className="space-y-6">
                  <p className="leading-relaxed">
                    New employer. New banking forms. New emergency contact sheet. New void cheque request. Again.
                  </p>
                  <p className="leading-relaxed">
                    Every Friday: text your hours to the office. Hope they log them right. Dispute the paycheck when they don't.
                  </p>
                  <p className="leading-relaxed">
                    And your logbook? You're filling it out two weeks late, staring at your phone trying to remember what building you were at.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-background border">
                    <p className="text-lg font-semibold text-foreground mb-2">
                      Eight years on rope. Level 3 IRATA. Hundreds of buildings.
                    </p>
                    <p className="leading-relaxed">
                      And you're still filling out the same forms, still texting timesheets, still guessing at logbook entries like it's your first month.
                    </p>
                  </div>
                  <p className="text-xl font-bold text-primary text-center pt-4">
                    There's a better way.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section - Flowbite Style */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">The Solution</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                  Set up once. Plug into any employer. Done.
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  OnRopePro gives you a portable professional identity that <strong className="text-foreground">connects</strong> to any company using the platform.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Day 1 at a new job?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You plug in. They instantly have your certs, banking, emergency contact, verified and ready. No forms. No "bring a void cheque."
                  </p>
                </div>
                
                <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Every day after that?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Hours, buildings, tasks - logged automatically. Clock in, do your work, clock out. No timesheets. No disputes.
                  </p>
                </div>
                
                <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Fill out your logbook?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every session recorded. Building, tasks, height, hours. Use actual records, not fuzzy memory two weeks later.
                  </p>
                </div>
                
                <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">4</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Change employers?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Unplug from Company A. Plug into Company B. Same instant onboarding. Your profile stays yours.
                  </p>
                </div>
                
                <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">5</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Work multiple companies?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    With Plus, connect to unlimited employers. Weekdays, weekends, your own clients. One profile handles it all.
                  </p>
                </div>
                
                <div className="p-6 rounded-2xl border-2 border-primary bg-primary/5 hover:shadow-lg transition-shadow flex flex-col justify-center">
                  <p className="text-sm font-medium text-primary mb-3">Ready to simplify your career?</p>
                  <Button 
                    size="sm"
                    className="rounded-full"
                    onClick={() => setShowRegistration(true)}
                  >
                    Get Started Free
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid - Flowbite Style */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Features</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">The system that works while you work</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to own your professional identity and take it with you.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group text-center p-6">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Free vs Plus - Flowbite Style */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pricing</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Free forever. Plus when you share.</h2>
              <p className="text-lg text-muted-foreground">
                Get started for free. Share with one tech to unlock Plus for both of you.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Standard */}
              <div className="p-8 rounded-3xl border-2 border-border bg-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                    <HardHat className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Tech Standard</h3>
                    <p className="text-sm text-muted-foreground">Everything to get started</p>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="text-muted-foreground ml-2">forever</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {standardFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full rounded-full"
                  onClick={() => setShowRegistration(true)}
                >
                  Get Started Free
                </Button>
              </div>

              {/* Plus */}
              <div className="p-8 rounded-3xl border-2 border-primary bg-gradient-to-b from-primary/5 to-primary/10 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#0369A1] text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Tech Plus</h3>
                    <p className="text-sm text-muted-foreground">Unlocked via referral</p>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="text-muted-foreground ml-2">with 1 referral</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plusFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className={index === 0 ? "font-semibold" : ""}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  size="lg"
                  className="w-full rounded-full bg-[#0369A1]"
                  onClick={() => setShowRegistration(true)}
                  data-testid="button-plans-cta"
                >
                  Get Started Free
                </Button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share with one tech. You both get Plus. It's that simple.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works - Flowbite Style */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">How It Works</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">2 minutes to set up. Automatic from there.</h2>
              <p className="text-lg text-muted-foreground">
                Getting started is simple. Here's how it works:
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Vertical line connector */}
                <div className="absolute left-6 top-10 bottom-10 w-px bg-border hidden md:block" />
                
                <div className="space-y-8">
                  {steps.map((step, index) => (
                    <div key={index} className="relative flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0369A1] text-primary-foreground flex items-center justify-center font-bold text-lg z-10">
                        {step.number}
                      </div>
                      <div className="pt-2">
                        <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Button 
                size="lg" 
                className="gap-2 rounded-full bg-[#0369A1]"
                onClick={() => setShowRegistration(true)}
                data-testid="button-steps-cta"
              >
                Create Your Free Profile
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ - Flowbite Style */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border mb-6">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">FAQ</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">"What's the catch?"</h2>
              <p className="text-lg text-muted-foreground">
                Great question. Here are the answers to what you're probably wondering:
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 rounded-2xl border bg-card">
                  <h3 className="font-bold text-lg mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Flowbite Style */}
        <section className="py-20 lg:py-28 bg-[#0369A1]/10">
          <div className="container mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Set up once. That's it.
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Your certs. Your banking info. Your hours. Your logbook reference. Enter them once. Plug into any employer. Automatic from there.
            </p>
            
            <div className="flex flex-col items-center gap-6">
              <Button 
                size="lg" 
                className="gap-2 rounded-full bg-[#0369A1] shadow-lg shadow-primary/25"
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
          <p className="text-sm font-medium text-muted-foreground text-center mb-4">Sound familiar?</p>
          {problemRows.map((row, index) => (
            <ScrollingProblems key={index} problems={row.problems} direction={row.direction} />
          ))}
        </div>
      </div>

      {/* Right Column - 30% Scrolling Problems (Desktop only) */}
      {showProblemsColumn ? (
        <div className="hidden lg:block lg:w-[30%] bg-muted/50 border-l h-screen sticky top-0 overflow-hidden transition-all duration-300">
          <div className="h-full flex flex-col">
            <div className="shrink-0 bg-muted/50 border-b p-4 relative">
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2"
                onClick={() => setShowProblemsColumn(false)}
                data-testid="button-close-problems"
              >
                <X className="w-4 h-4" />
              </Button>
              <p className="text-base font-medium text-muted-foreground text-center">Sound familiar?</p>
            </div>
          <div className="flex-1 flex flex-col justify-evenly py-6">
            {problemRows.map((row, index) => (
              <ScrollingProblems key={index} problems={row.problems} direction={row.direction} />
            ))}
          </div>
        </div>
      </div>
      ) : (
        <div className="hidden lg:flex lg:items-start lg:pt-4 lg:pr-4 fixed right-0 top-0 z-50">
          <Button
            size="icon"
            variant="outline"
            className="shadow-lg"
            onClick={() => setShowProblemsColumn(true)}
            data-testid="button-open-problems"
          >
            <MessageSquareWarning className="w-4 h-4" />
          </Button>
        </div>
      )}

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
