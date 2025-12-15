import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PublicHeader } from "@/components/PublicHeader";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  HardHat, 
  ArrowLeft,
  ArrowRight,
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
  MessageSquareWarning,
  Briefcase,
  BookOpen,
  Zap,
  DollarSign
} from "lucide-react";
import { TechnicianRegistration } from "@/components/TechnicianRegistration";
import { InstallPWAButton } from "@/components/InstallPWAButton";
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
      "Changed employer, job history gone",
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
      "My Indeed account is mostly SPAM",
      "Endless search, zero results",
      "Where are the real postings?",
      "Are jobs listed on job boards even real?",
      "Industry jobs are invisible",
    ]
  },
  {
    direction: "left" as const,
    problems: [
      "irata expiring next week",
      "Nobody told me",
      "Scrambling for recert",
      "What do you mean my irata license is expired?!?!?!",
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
      description: "Every session recorded. Building, tasks, height, hours. Fill out your irata logbook from real data, not guesswork two weeks later."
    },
    {
      icon: Award,
      title: "Professional Profile",
      description: "irata/SPRAT ID, first aid, driver's abstract - verified and ready for any employer to see."
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
      description: "30 days before irata/SPRAT expires. Your employer sees it too. Zero surprises, zero lapses."
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
    "Job board access (rope access-specific postings, no more endless Indeed searches)",
    "Resume/CV storage",
    "PLUS badge on your profile",
    "Unlimited employer connections (plug into multiple companies simultaneously)",
    "30-day certification expiry alerts (you AND your employer notified)",
    "Safety Rating score (0-100) with improvement recommendations",
    "Exportable work history PDF (178 rope transfers, 3,500 deviations - actual proof)",
    "Work history analytics (lifetime totals by task type)"
  ];

  const steps = [
    {
      number: "1",
      title: "Create your free profile",
      description: "Name, email, irata/SPRAT ID. Done in 2 minutes."
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
      description: "One tech signs up with your referral and you're automatically upgraded to Plus. Unlimited employer connections, exportable history, expiry alerts, job board access."
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
      answer: "Share your unique code. When one tech signs up using it, you're automatically upgraded to Plus: unlimited employer connections, exportable history, expiry alerts. Not MLM. Not commission. Just a thank-you for spreading the word."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
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
          animation: scroll-left 60s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 60s linear infinite;
        }
        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      <PublicHeader activeNav="technician" />

      {/* Hero Section - Passport Landing Design */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              Passport for IRATA & SPRAT Technicians
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Your Logged Hours. Your Certs. Your Career.<br />
              <span className="text-blue-100">Finally in One Place.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Your portable professional identity. One account that travels with you across every employer, every project, every assessment.<br />
              <strong>Never lose another hour of work history.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="bg-white text-[#0B64A3] hover:bg-blue-50" 
                onClick={() => setShowRegistration(true)}
                data-testid="button-hero-cta"
              >
                Create Your Free Passport
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10"
                onClick={() => setShowLoginDialog(true)}
                data-testid="button-hero-signin"
              >
                Sign In
                <BookOpen className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-white dark:fill-slate-950"/>
          </svg>
        </div>
      </section>

      {/* Stats Panel */}
      <section className="relative bg-white dark:bg-slate-950 -mt-px overflow-visible">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
          <Card className="shadow-xl border-0 relative z-20 -mt-20">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">10s</div>
                  <div className="text-base text-muted-foreground mt-1">Onboarding time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">Zero</div>
                  <div className="text-base text-muted-foreground mt-1">Guesswork on hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">100%</div>
                  <div className="text-base text-muted-foreground mt-1">Safety compliance</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">Forever</div>
                  <div className="text-base text-muted-foreground mt-1">Career protection</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-950">

        {/* Scrolling Problems Marquee */}
        <div className="bg-neutral-100 dark:bg-navy-950 py-4 overflow-hidden border-b border-neutral-200 dark:border-navy-800" data-testid="marquee-problems">
          <div 
            className="flex gap-8 whitespace-nowrap animate-scroll-left"
            style={{ width: "max-content" }}
          >
            {[...problemRows.flatMap(row => row.problems), ...problemRows.flatMap(row => row.problems), ...problemRows.flatMap(row => row.problems)].map((problem, index) => (
              <span 
                key={index} 
                className="text-base text-muted-foreground/70 flex items-center gap-8"
              >
                {problem}
                <span className="text-muted-foreground/30">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Problem Section - Flowbite Style */}
        <section className="py-20 lg:py-28 bg-neutral-100 dark:bg-navy-950">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
                  <span className="text-xs font-semibold text-destructive uppercase tracking-wider">The Problem</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
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
                  <div className="p-6 rounded-lg bg-background border">
                    <p className="text-lg font-semibold text-foreground mb-2">
                      Eight years on rope. Level 3 irata. Hundreds of buildings.
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success-100 border border-success-600/20 mb-6">
                  <span className="text-xs font-semibold text-success-600 uppercase tracking-wider">The Solution</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Set up once. Plug into any employer. Done.
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  OnRopePro gives you a portable professional identity that <strong className="text-foreground">connects</strong> to any company using the platform.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Day 1 at a new job?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You plug in. They instantly have your certs, banking, emergency contact, verified and ready. No forms. No "bring a void cheque."
                  </p>
                </div>
                
                <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Every day after that?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Hours, buildings, tasks - logged automatically. Clock in, do your work, clock out. No timesheets. No disputes.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Fill out your logbook?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every session recorded. Building, tasks, height, hours. Use actual records, not fuzzy memory two weeks later.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">4</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Change employers?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Unplug from Company A. Plug into Company B. Same instant onboarding. Your profile stays yours.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">5</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Work multiple companies?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    With Plus, connect to unlimited employers. Weekdays, weekends, your own clients. One profile handles it all.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg border-2 border-primary bg-primary/5 hover:shadow-lg transition-shadow flex flex-col justify-center">
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

        {/* Your Career Lives in Too Many Places Section */}
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Your Career Lives in Too Many Places
            </h2>
            
            <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Your hours are in a crumpled notebook. Your certs are in a folder somewhere. Your last three employers have records you'll never see again.
                </p>
                <p>
                  When assessment day comes, you reconstruct months of work from memory. You guess at heights. You estimate dates. You hope the numbers add up.
                </p>
                <p>
                  Every new job means 15 forms with the same information. Banking details. Emergency contacts. Certification copies. Again. And again. And again.
                </p>
                <p>
                  Meanwhile, your Level 3 renewal is 47 days away. Or is it 67? You meant to check.
                </p>
                <Separator className="my-6" />
                <p className="font-medium text-foreground text-lg">
                  The rope access industry treats your work history like company property. OnRopePro treats it like what it is: <strong>yours</strong>.
                </p>
                <p className="font-medium text-foreground">
                  One account. Complete history. Always with you.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What Your Passport Contains Section */}
        <section id="features" className="pt-8 md:pt-12 pb-16 md:pb-20 px-4 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              What Your Passport Contains
            </h2>
            <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
              Your Technician Passport is the single source of truth for your professional identity.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1: Your Work History */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Your Work History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-base text-muted-foreground">
                  <p className="font-medium text-foreground">Your hours, your drops, your projects. All in one place.</p>
                  <p>When you connect to an employer using OnRopePro, every work session logs automatically: building address, heights, specific tasks, and duration. Sessions group by project with totals calculated for you.</p>
                  <p className="font-medium text-foreground mt-4">What gets tracked:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Total logged hours with detailed session breakdowns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Drop counts and elevation data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Task categories matching IRATA logbook requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Building addresses and project dates</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Card 2: Your Certifications */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">Your Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-base text-muted-foreground">
                  <p className="font-medium text-foreground">Your credentials, verified and visible.</p>
                  <p>Store your IRATA or SPRAT certification with level and expiry date. Upload First Aid, fall protection, and additional qualifications. Your certification status is visible to employers searching for qualified techs.</p>
                  <p className="font-medium text-foreground mt-4">What gets stored:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>IRATA/SPRAT level and license number</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Certification expiry dates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>First Aid and supplementary certifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Resume/CV upload</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Card 3: Your Safety Record */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">Your Safety Record</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-base text-muted-foreground">
                  <p className="font-medium text-foreground">Your compliance history demonstrates professionalism.</p>
                  <p>Your personal safety rating calculates from document acknowledgments and harness inspections across all employers. A strong rating shows you take safety seriously. It follows you to every new job.</p>
                  <p className="font-medium text-foreground mt-4">What gets measured:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Harness inspection completion rate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Safety document acknowledgment history</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Compliance score across all employers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Audit-ready documentation trail</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The system that works while you work</h2>
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning-ds-100 border border-warning-ds-600/20 mb-6">
                <span className="text-xs font-semibold text-warning-ds-600 uppercase tracking-wider">Pricing</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Free forever. Plus when you share.</h2>
              <p className="text-lg text-muted-foreground">
                Get started for free. Share your code with one tech to unlock Plus for yourself.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Standard */}
              <div className="p-8 rounded-lg border-2 border-border bg-card">
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
              <div className="p-8 rounded-lg border-2 border-primary bg-gradient-to-b from-primary/5 to-primary/10 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-action-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                    This One Is Better
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Tech Plus</h3>
                    <p className="text-sm text-muted-foreground">Unlock by referring OnRopePro to 1 other tech</p>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="text-muted-foreground ml-2">also forever</span>
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
                  className="w-full rounded-full bg-action-500 hover:bg-action-600 focus:ring-4 focus:ring-action-500/50"
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
                Share with one tech. You get Plus. It's that simple.
              </p>
            </div>
          </div>
        </section>

        {/* Plus Value Comparison Table - Flowbite Style */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning-ds-100 border border-warning-ds-600/20 mb-6">
                <span className="text-xs font-semibold text-warning-ds-600 uppercase tracking-wider">Plus Value</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Plus grows with your career</h2>
              <p className="text-lg text-muted-foreground">
                Great standalone value. Even better when your employer joins.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="max-w-5xl mx-auto overflow-hidden rounded-lg border border-border bg-card">
              {/* Table Header */}
              <div className="grid grid-cols-3 bg-muted/50 border-b border-border">
                <div className="p-4 font-semibold text-sm">Feature</div>
                <div className="p-4 font-semibold text-sm text-center border-l border-border">
                  <span className="text-warning-ds-600">Plus</span> - Standalone
                </div>
                <div className="p-4 font-semibold text-sm text-center border-l border-border bg-primary/5">
                  <span className="text-primary">Plus</span> - Employer Connected
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-border">
                {/* Job Board Access */}
                <div className="grid grid-cols-3">
                  <div className="p-4 font-medium text-sm flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    Job Board Access
                  </div>
                  <div className="p-4 text-sm border-l border-border">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Full access. Browse real rope access jobs from real companies.</span>
                    </div>
                  </div>
                  <div className="p-4 text-sm border-l border-border bg-primary/5">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Same + employers can see your verified profile and reach out directly.</span>
                    </div>
                  </div>
                </div>

                {/* Document Vault */}
                <div className="grid grid-cols-3">
                  <div className="p-4 font-medium text-sm flex items-start gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    Document Vault
                  </div>
                  <div className="p-4 text-sm border-l border-border">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Store certs, banking info, void cheque, SIN. Encrypted, organized.</span>
                    </div>
                  </div>
                  <div className="p-4 text-sm border-l border-border bg-primary/5">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">One-click share to employer on connection. Zero re-entry.</span>
                    </div>
                  </div>
                </div>

                {/* Logbook */}
                <div className="grid grid-cols-3">
                  <div className="p-4 font-medium text-sm flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    Logbook
                  </div>
                  <div className="p-4 text-sm border-l border-border">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Photo scan your physical logbook pages. Converted to text and saved.</span>
                    </div>
                  </div>
                  <div className="p-4 text-sm border-l border-border bg-primary/5">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Scanning + automatic detailed logging. No more trying to remember.</span>
                    </div>
                  </div>
                </div>

                {/* Exportable Work History */}
                <div className="grid grid-cols-3">
                  <div className="p-4 font-medium text-sm flex items-start gap-2">
                    <Download className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    Exportable Work History
                  </div>
                  <div className="p-4 text-sm border-l border-border">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">From scanned logbook data. Useful for job apps.</span>
                    </div>
                  </div>
                  <div className="p-4 text-sm border-l border-border bg-primary/5">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Rich data: rope transfers, deviations, drops with dates and buildings.</span>
                    </div>
                  </div>
                </div>

                {/* Cert Expiry Alerts */}
                <div className="grid grid-cols-3">
                  <div className="p-4 font-medium text-sm flex items-start gap-2">
                    <Bell className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    30-Day Cert Expiry Alerts
                  </div>
                  <div className="p-4 text-sm border-l border-border">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">You get notified before irata/SPRAT lapses.</span>
                    </div>
                  </div>
                  <div className="p-4 text-sm border-l border-border bg-primary/5">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">You AND employer get notified. No surprises.</span>
                    </div>
                  </div>
                </div>

                {/* Safety Rating */}
                <div className="grid grid-cols-3">
                  <div className="p-4 font-medium text-sm flex items-start gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    Safety Rating (0-100)
                  </div>
                  <div className="p-4 text-sm border-l border-border">
                    <div className="flex items-start gap-2">
                      <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Not available. Requires daily harness inspections + signed docs.</span>
                    </div>
                  </div>
                  <div className="p-4 text-sm border-l border-border bg-primary/5">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">CSR score builds from compliance. Visible to future employers.</span>
                    </div>
                  </div>
                </div>

                {/* Automatic Hour Logging */}
                <div className="grid grid-cols-3">
                  <div className="p-4 font-medium text-sm flex items-start gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    Automatic Hour Logging
                  </div>
                  <div className="p-4 text-sm border-l border-border">
                    <div className="flex items-start gap-2">
                      <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Not available.</span>
                    </div>
                  </div>
                  <div className="p-4 text-sm border-l border-border bg-primary/5">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Clock in/out. Hours submit themselves. No timesheets.</span>
                    </div>
                  </div>
                </div>

                {/* Instant Onboarding */}
                <div className="grid grid-cols-3">
                  <div className="p-4 font-medium text-sm flex items-start gap-2">
                    <Zap className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    Instant Onboarding
                  </div>
                  <div className="p-4 text-sm border-l border-border">
                    <div className="flex items-start gap-2">
                      <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Not available.</span>
                    </div>
                  </div>
                  <div className="p-4 text-sm border-l border-border bg-primary/5">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Plug in. Employer enters salary + permissions. Day 1 ready.</span>
                    </div>
                  </div>
                </div>

                {/* Payroll Accuracy */}
                <div className="grid grid-cols-3">
                  <div className="p-4 font-medium text-sm flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    Payroll Accuracy
                  </div>
                  <div className="p-4 text-sm border-l border-border">
                    <div className="flex items-start gap-2">
                      <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Still at mercy of manual systems.</span>
                    </div>
                  </div>
                  <div className="p-4 text-sm border-l border-border bg-primary/5">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Verified hours = no disputes. Transparent pay.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-warning-ds-100 flex items-center justify-center">
                    <Star className="w-4 h-4 text-warning-ds-600" />
                  </div>
                  <h3 className="font-bold">Plus Standalone</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your professional home base. Certs organized. Logbook digitized. Job board access. Ready for when employers join.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-primary bg-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-bold">Plus + Employer</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  You work. Everything else is automatic. Hours, certs, logbook, onboarding, safety rating. Handled.
                </p>
              </div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">2 minutes to set up. Automatic from there.</h2>
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
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-action-500 text-white flex items-center justify-center font-bold text-lg z-10">
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
                className="gap-2 rounded-full bg-action-500 hover:bg-action-600 focus:ring-4 focus:ring-action-500/50"
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">"What's the catch?"</h2>
              <p className="text-lg text-muted-foreground">
                Great question. Here are the answers to what you're probably wondering:
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 rounded-lg border bg-card">
                  <h3 className="font-bold text-lg mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Flowbite Style */}
        <section className="py-20 lg:py-28 bg-action-500/10 dark:bg-navy-900">
          <div className="container mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Set up once. That's it.
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Your certs. Your banking info. Your hours. Your logbook reference. Enter them once. Plug into any employer. Automatic from there.
            </p>
            
            <div className="flex flex-col items-center gap-6">
              <Button 
                size="lg" 
                className="gap-2 rounded-full bg-action-500 hover:bg-action-600 shadow-lg shadow-action-500/25 focus:ring-4 focus:ring-action-500/50"
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
                irata/SPRAT verified
              </span>
            </div>
          </div>
        </footer>

        {/* Scrolling problems at bottom */}
        <div className="bg-muted/50 py-8 overflow-hidden">
          <p className="text-sm font-medium text-muted-foreground text-center mb-4">Sound familiar?</p>
          {problemRows.map((row, index) => (
            <ScrollingProblems key={index} problems={row.problems} direction={row.direction} />
          ))}
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
              Sign in with your irata/SPRAT license number or email
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
                        {loginMethod === "license" ? "irata or SPRAT License Number" : "Email Address"}
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
