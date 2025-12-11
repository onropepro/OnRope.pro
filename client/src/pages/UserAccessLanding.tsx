import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import {
  Shield,
  CheckCircle2,
  Lock,
  Users,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  UserCheck,
  Key,
  FileText,
  Layers,
  BookOpen,
  Briefcase,
  Home,
  HardHat,
  ClipboardList,
  BarChart3,
  Calendar,
  DollarSign,
  UserX,
  AlertTriangle,
  Database,
  ShieldCheck
} from "lucide-react";

export default function UserAccessLanding() {
  const [, setLocation] = useLocation();
  const [showModulesMenu, setShowModulesMenu] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [controlPercentage, setControlPercentage] = useState(0);
  const modulesMenuRef = useRef<HTMLDivElement>(null);

  // Initialize countdown numbers and count-up percentage
  useEffect(() => {
    const start1 = Math.floor(Math.random() * 80) + 40;
    const start2 = Math.floor(Math.random() * 60) + 30;
    const start3 = Math.floor(Math.random() * 70) + 35;

    let current1 = start1, current2 = start2, current3 = start3;
    let currentPercentage = 0;
    setCount1(current1);
    setCount2(current2);
    setCount3(current3);
    setControlPercentage(currentPercentage);
    
    const interval = setInterval(() => {
      if (current1 > 0) { current1--; setCount1(current1); }
      if (current2 > 0) { current2--; setCount2(current2); }
      if (current3 > 0) { current3--; setCount3(current3); }
      if (currentPercentage < 100) { currentPercentage++; setControlPercentage(currentPercentage); }
      
      if (current1 === 0 && current2 === 0 && current3 === 0 && currentPercentage === 100) {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modulesMenuRef.current && !modulesMenuRef.current.contains(e.target as Node)) {
        setShowModulesMenu(false);
      }
    };
    
    if (showModulesMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showModulesMenu]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-8 py-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center">
          <Link href="/">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-16 object-contain cursor-pointer" />
          </Link>
        </div>
        
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <Button
            variant="ghost"
            className="text-sm font-medium"
            onClick={() => setLocation("/employer")}
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
          <Button
            variant="ghost"
            className="text-sm font-medium"
            onClick={() => setLocation("/link")}
            data-testid="nav-resident"
          >
            Resident
          </Button>
          <Button
            variant="ghost"
            className="text-sm font-medium"
            onClick={() => setLocation("/building-portal")}
            data-testid="nav-building-manager"
          >
            Building Manager
          </Button>
          <div 
            className="relative" 
            ref={modulesMenuRef}
            onMouseEnter={() => setShowModulesMenu(true)}
            onMouseLeave={() => setShowModulesMenu(false)}
          >
            <Button
              variant="ghost"
              className="text-sm font-medium"
              data-testid="nav-modules"
            >
              Modules
            </Button>
            {showModulesMenu && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-4 w-[480px] z-50">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left group"
                    onClick={() => {
                      setLocation("/modules/safety-compliance");
                      setShowModulesMenu(false);
                    }}
                    data-testid="nav-safety-compliance"
                  >
                    <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Shield className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Safety & Compliance</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Harness inspections, toolbox meetings, audit-ready exports</div>
                    </div>
                  </button>
                  <button
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left group"
                    onClick={() => {
                      setLocation("/modules/user-access-authentication");
                      setShowModulesMenu(false);
                    }}
                    data-testid="nav-user-access"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Lock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">User Access & Authentication</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Granular permissions, role-based access, audit trails</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-sign-in-header"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => setLocation("/pricing")}
            className="bg-[#A3320B]"
            data-testid="button-get-started-header"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center space-y-6">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              User Access & Authentication Module
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Built for the moment you realize<br />
              your new hire<br />
              <span className="text-indigo-200">can see everyone's rates.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              Grant project creation, employee scheduling, and safety<br />
              compliance access to the people who need it.<br />
              <strong>Keep hourly rates, labor costs, and profit margins visible only to you.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50" asChild data-testid="button-hero-trial">
                <Link href="/register">
                  Start Your 90-Day Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-hero-demo">
                <Link href="#features">
                  See It In Action
                  <Eye className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-background"/>
          </svg>
        </div>
      </section>

      {/* Stats Panel */}
      <section className="relative z-10 -mt-8 max-w-5xl mx-auto px-4">
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600">{count1}</div>
                <div className="text-sm text-muted-foreground mt-1">Exposed pay rates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-rose-600">{count2}</div>
                <div className="text-sm text-muted-foreground mt-1">Unauthorized edits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-600">{count3}</div>
                <div className="text-sm text-muted-foreground mt-1">Access conflicts</div>
              </div>
              <div className="text-center">
                <div 
                  className="text-3xl md:text-4xl font-bold text-emerald-600 transition-opacity duration-300"
                  style={{ display: 'inline-block' }}
                >
                  {controlPercentage}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">Control maintained</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Problem Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            The Access Problem Nobody Talks About
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                Construction software wasn't built for your business.
              </p>
              <p>
                The moment you add your supervisor to the system, they see everything. Pay rates. Profit margins. Which jobs lose money. Which technicians cost you the most.
              </p>
              <p>
                It's not that you don't trust them. It's that some information belongs at the owner level. Period.
              </p>
              <p>
                Most systems force a choice: handle everything yourself (and become the bottleneck), or give access and hope nobody looks where they shouldn't.
              </p>
              <Separator className="my-6" />
              <p className="font-medium text-foreground text-lg">
                OnRopePro separates what people can do from what they can see.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Control What Each Person Can Access
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Enterprise-grade permission controls built for small operations.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Granular Permissions */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-3">
                  <Layers className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Granular Permission Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Your bookkeeper sees aggregate labor costs. Not individual rates.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Customize exactly what each employee can view and edit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Supervisors create projects without seeing pay rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Office admin processes invoices without profit margins</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Multi-Tenant Isolation */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <Database className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Multi-Tenant Data Isolation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Your company's data exists in a completely separate partition.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Every query filters automatically to your company</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Security issues with other accounts can't expose you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Bank-level protection without an IT department</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* IRATA/SPRAT Tracking */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                  <UserCheck className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">IRATA/SPRAT Level Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Answer client questions in seconds, not minutes.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Each profile includes certification level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Know instantly which Level 2/3 techs are available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>No spreadsheets, no digging through files</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Building Accounts */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center mb-3">
                  <Building2 className="w-6 h-6 text-sky-600" />
                </div>
                <CardTitle className="text-xl">Building-Level Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">New building manager? Change one login, not twelve vendor accounts.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Building accounts persist through staff changes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>No vendor coordination when managers change</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>No access gaps, no stale credentials</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Resident Portal */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-3">
                  <Home className="w-6 h-6 text-violet-600" />
                </div>
                <CardTitle className="text-xl">Resident Portal Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Unit 1847 checks their own progress instead of calling the property manager.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Residents see project updates for their building</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Real-time visibility reduces status calls 60-70%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Know when work reaches your elevation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Audit Trail */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-rose-600" />
                </div>
                <CardTitle className="text-xl">Complete Audit Trail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Every permission change logged. Every access attempt recorded.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>See who changed what, when, and from where</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>When questions arise, answers exist</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>Retention policies ensure compliance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problems Solved Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            We Built This for Situations Like Yours
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Real problems. Real solutions. Organized by who you are.
          </p>

          <Accordion type="multiple" className="space-y-4">
            {/* Company Owners */}
            <AccordionItem value="owners" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-lg font-semibold">For Company Owners</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">"My supervisor accidentally saw everyone's pay rates."</p>
                  <p className="text-muted-foreground text-sm">
                    You need your ops manager to create projects and check budgets. The moment you grant access, they see what every technician earns. Now your Level 1 knows your Level 3 lead makes $18 more per hour.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                      <strong>Solution:</strong> OnRopePro separates operational access from financial visibility. Grant project creation, scheduling, and client communication without exposing rate information.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">"A technician changed his own hourly rate from $32 to $42."</p>
                  <p className="text-muted-foreground text-sm">
                    He also adjusted last week's drop counts. You discovered it during payroll when the numbers didn't add up. Traditional systems let anyone modify data they can see.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                      <strong>Solution:</strong> Permission controls restrict editing based on assigned capabilities. Technicians log work for assigned projects. Only designated managers modify rates, historical records, and financial data.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">"I don't know if I have seats available to hire someone."</p>
                  <p className="text-muted-foreground text-sm">
                    Peak season hit. You needed three temporary techs immediately. But you couldn't remember your plan's limit, and you didn't know how many seats you were using.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                      <strong>Solution:</strong> Your dashboard shows "Using 7 of 8 seats" with visual indicators. Make hiring decisions confidently. Avoid surprise overage charges.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Operations Managers */}
            <AccordionItem value="ops" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-lg font-semibold">For Operations Managers</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">"I want my field supervisors to create projects when clients call."</p>
                  <p className="text-muted-foreground text-sm">
                    Your most trusted supervisor handles the entire North Shore territory. When clients call, he has to reach you to create the project. You're in meetings. Clients wait hours for setup that takes two minutes.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                      <strong>Solution:</strong> Grant project creation and employee assignment without financial access. Supervisors handle day-to-day operations independently. You focus on strategic work.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Building Managers */}
            <AccordionItem value="building" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-sky-600" />
                  </div>
                  <span className="text-lg font-semibold">For Building Managers</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">"I'm the middleman for every issue between residents and vendors."</p>
                  <p className="text-muted-foreground text-sm">
                    Mrs. Chen emails you photos of streaky windows. You forward to the rope access company. Three days pass with no response. Meanwhile, Mrs. Chen files council complaints about management responsiveness.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                      <strong>Solution:</strong> Centralized feedback with building-level visibility. Residents submit directly. You see all feedback in real-time without being in the communication chain. Average resolution drops from 3-5 days to 24 hours.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">"Building manager turnover every 6-12 months creates access chaos."</p>
                  <p className="text-muted-foreground text-sm">
                    Sarah managed Tower One for 8 months. Mike takes over. You email 12 vendors requesting account changes. Three weeks later, Sarah still has access and Mike can't log in.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                      <strong>Solution:</strong> Building accounts transfer with the role, not the person. Access changes happen in minutes, not weeks.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Residents */}
            <AccordionItem value="residents" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Home className="w-5 h-5 text-violet-600" />
                  </div>
                  <span className="text-lg font-semibold">For Residents</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">"I see maintenance equipment on the roof. Nobody tells me what's happening."</p>
                  <p className="text-muted-foreground text-sm">
                    Technicians are on the west side Monday. Are they coming to your side? You need to move balcony plants before cleaning. You call the building manager. They don't know. They contact the vendor.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                      <strong>Solution:</strong> The resident portal shows which elevations are complete. The schedule shows east elevation starts Wednesday. You move your plants Tuesday night. No calls necessary.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Technical Credibility Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Enterprise Security Built for Small Operations
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            The security you'd expect from enterprise software, without the enterprise price tag.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-indigo-600" />
                  <CardTitle className="text-lg">Session Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Automatic expiration after 30 days of inactivity. Secure logout clears all session data. Users remain logged in across browser sessions until explicit logout or expiration.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-lg">Password Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Industry-standard bcrypt hashing with salt rounds. Passwords are never stored in plain text. Not even you can retrieve them. Reset only.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-lg">API Protection</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Every endpoint validates authentication, permission, and company scope. Financial data filtered unless user has financial permissions.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-rose-600" />
                  <CardTitle className="text-lg">Request Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>CSRF protection via token-based validation. Rate limiting prevents brute force attacks. SQL injection blocked through parameterized statements. All traffic encrypted via TLS/SSL.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Module Integration Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Permissions Flow Through Everything
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            User access controls aren't a feature. They're the foundation. When you grant someone project creation rights, they can create projects. When you withhold financial visibility, dashboards, reports, and data exports all respect that decision.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Employee Directory</h3>
                <p className="text-sm text-muted-foreground">Only owners create employees and assign roles. Prevents unauthorized hiring.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Payroll & Time Tracking</h3>
                <p className="text-sm text-muted-foreground">Supervisors see hours worked. Technicians see only their own time. Owners see full payroll cost visibility.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                <HardHat className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Safety & Compliance</h3>
                <p className="text-sm text-muted-foreground">Technicians submit safety documents. Safety officers review. Owners see audit trails. Clear responsibility chain.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Scheduling & Projects</h3>
                <p className="text-sm text-muted-foreground">Owners create and assign. Supervisors manage their projects. Technicians see their scheduled work.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 md:col-span-2">
              <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Analytics & Reporting</h3>
                <p className="text-sm text-muted-foreground">Owners see full financial and productivity analytics. Building managers see their building's data. Technicians see personal metrics. Reporting respects permission boundaries completely.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-900 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Take Control?
          </h2>
          <p className="text-lg text-indigo-100">
            Set up your first employee with custom permissions in under 5 minutes.<br />
            Full access. No credit card. Real data stays private from day one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50" asChild data-testid="button-cta-trial">
              <Link href="/register">
                Start Your 90-Day Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-cta-guide">
              <Link href="/changelog/user-access">
                Read the Full Guide
                <BookOpen className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-8 object-contain" />
            <span className="text-sm text-muted-foreground">Management Software for Rope Access</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/changelog" className="hover:text-foreground transition-colors">Changelog</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
