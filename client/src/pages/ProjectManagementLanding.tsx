import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import {
  Briefcase,
  CheckCircle2,
  Calendar,
  BarChart3,
  Users,
  ArrowRight,
  AlertTriangle,
  Building2,
  MapPin,
  Clock,
  Target,
  TrendingUp,
  Shield,
  Lock,
  Globe,
  ChevronsUpDown,
  Crown,
  Home as HomeIcon,
  Wrench
} from "lucide-react";

const ALL_ACCORDION_ITEMS = [
  "owner-1", "owner-2", "owner-3", "owner-4", "owner-5", "owner-6", "owner-7",
  "manager-1", "manager-2",
  "resident-1",
  "tech-1", "tech-2", "tech-3"
];

export default function ProjectManagementLanding() {
  const [expandedProblems, setExpandedProblems] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const [showModulesMenu, setShowModulesMenu] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const modulesMenuRef = useRef<HTMLDivElement>(null);
  const allExpanded = expandedProblems.length === ALL_ACCORDION_ITEMS.length;

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedProblems([]);
    } else {
      setExpandedProblems([...ALL_ACCORDION_ITEMS]);
    }
  };

  useEffect(() => {
    const start1 = Math.floor(Math.random() * 60) + 40;
    const start2 = Math.floor(Math.random() * 80) + 40;
    const start3 = Math.floor(Math.random() * 100) + 50;

    let current1 = start1, current2 = start2, current3 = start3;
    setCount1(current1);
    setCount2(current2);
    setCount3(current3);
    
    const interval = setInterval(() => {
      if (current1 > 0) { current1--; setCount1(current1); }
      if (current2 > 0) { current2--; setCount2(current2); }
      if (current3 > 0) { current3--; setCount3(current3); }
      
      if (current1 === 0 && current2 === 0 && current3 === 0) {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modulesMenuRef.current && !modulesMenuRef.current.contains(e.target as Node)) {
        setShowModulesMenu(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-8 object-contain cursor-pointer" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" className="text-sm font-medium" onClick={() => setLocation("/")} data-testid="nav-employer">Employer</Button>
            <Button variant="ghost" className="text-sm font-medium" onClick={() => setLocation("/")} data-testid="nav-technician">Technician</Button>
            <Button variant="ghost" className="text-sm font-medium" onClick={() => setLocation("#")} data-testid="nav-property-manager">Property Manager</Button>
            <Button variant="ghost" className="text-sm font-medium" onClick={() => setLocation("/link")} data-testid="nav-resident">Resident</Button>
            <Button variant="ghost" className="text-sm font-medium" onClick={() => setLocation("/building-portal")} data-testid="nav-building-manager">Building Manager</Button>
            <div 
              className="relative pb-2" 
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
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-4 w-[480px] z-50">
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
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Lock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">User Access & Authentication</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Granular permissions, role-based access, audit trails</div>
                      </div>
                    </button>
                    <button
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left group col-span-2"
                      onClick={() => {
                        setLocation("/modules/project-management");
                        setShowModulesMenu(false);
                      }}
                      data-testid="nav-project-management"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Briefcase className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Project Management</div>
                        <div className="text-xs text-muted-foreground mt-0.5">4-elevation tracking, real-time dashboards, crew scheduling</div>
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6">
          <Badge className="bg-emerald-500/30 text-white border border-emerald-400">Project Management Module</Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Stop Managing Projects in Your Head
          </h1>
          
          <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            Track every building, elevation, and technician from one dashboard. See exactly where every job stands without a single phone call or site visit.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50" asChild data-testid="button-cta-trial">
              <Link href="/register">
                Start Your 90-Day Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-cta-demo">
              <Link href="/changelog/projects">
                Read the Full Guide
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 -mt-8 max-w-5xl mx-auto px-4">
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600">{count1}</div>
                <div className="text-sm text-muted-foreground mt-1">Manual status updates eliminated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-rose-600">{count2}</div>
                <div className="text-sm text-muted-foreground mt-1">Double-booking incidents prevented</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">{count3}</div>
                <div className="text-sm text-muted-foreground mt-1">Payroll hours saved per week</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600">100%</div>
                <div className="text-sm text-muted-foreground mt-1">Real-time visibility</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* The Pain Section */}
      <section className="py-16 md:py-20 px-4 max-w-4xl mx-auto">
        <div className="space-y-6">
          <Card className="border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl text-emerald-900 dark:text-emerald-100">The Reality</CardTitle>
            </CardHeader>
            <CardContent className="text-emerald-900 dark:text-emerald-100 space-y-4">
              <p>You're juggling window washing at Tower A, caulking at Building B, and anchor inspections at Complex C. A client calls asking for a status update. You're guessing.</p>
              <p>You think Tommy's finishing the north elevation today. Maybe. Sarah might have capacity next week. Probably. Your brain is your business. And it's exhausted.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* What Changes Section */}
      <section className="py-16 md:py-20 px-4 max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Every Project. Every Elevation. Every Technician. One Screen.</h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            OnRopePro's Project Management module tracks progress the way rope access actually works. Drop-based tracking for window cleaning and building wash. Hours-based for inspections and repairs. Unit-based for parkade cleaning and in-suite services.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base mt-4">
            Create a project with a date range and assigned crew, and the calendar populates automatically. Log work sessions from the field, and progress updates in real time. No duplicate data entry. No forgotten schedule conflicts. No 3 AM panic attacks.
          </p>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Buildings Have Four Sides. Your Tracking Should Too.</h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            High-rise window cleaning doesn't happen all at once. The north elevation might be 80% done while the south hasn't started. OnRopePro tracks North, East, South, and West independently. See exactly which directions are complete, in progress, or waiting. Your supervisor knows where to send the crew. Your client sees real progress instead of vague percentages.
          </p>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Features */}
      <section className="py-16 md:py-20 px-4 max-w-5xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-lg">4-Direction Elevation Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Track North, East, South, and West independently with separate drop counts, crew assignments, and completion status.</CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-lg">Real-Time Progress Dashboard</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">See every project's completion percentage, days remaining, and assigned crew. Updates automatically as work sessions are logged.</CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-lg">Flexible Tracking Methods</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Drop-based for window cleaning, hours-based for repairs, unit-based for suites. The system adapts to your job type.</CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-lg">Crew Assignment & Scheduling</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Assign technicians to specific projects and elevations. Color-coded project bars show scheduling conflicts instantly.</CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-lg">Client & Resident Visibility</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Property managers and residents check progress themselves through dedicated portals. Status calls drop 60-70%.</CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-lg">Performance Analytics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Track drops or units completed per shift by technician. Identify top performers and coach underperformers with objective data.</CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Problems Solved */}
      <section className="py-16 md:py-20 px-4 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Problems Solved</h2>
            <p className="text-muted-foreground mt-2">Real problems. Real solutions that teams actually use.</p>
          </div>
          <Button onClick={toggleAll} variant="outline" data-testid="button-toggle-all-accordions">
            <ChevronsUpDown className="w-4 h-4 mr-2" />
            {allExpanded ? "Collapse All" : "Expand All"}
          </Button>
        </div>

        <Accordion type="multiple" value={expandedProblems} onValueChange={setExpandedProblems} className="space-y-4">
          {/* Company Owners */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-600" />
              For Rope Access Company Owners
            </h3>
            
            <AccordionItem value="owner-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I have no idea where my 6 active projects actually stand."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You drive site-to-site taking notes, wasting 10-15 hours per week just figuring out what's happening. You bid new work but aren't sure if your crew will finish current jobs on time.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Real-time dashboard showing every project's progress percentage, days remaining, assigned crew, and completion forecast. Filter by status, building, or technician.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Instant oversight without site visits. Confidently quote new work based on real crew availability. Make data-driven prioritization decisions in seconds, not hours.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-2" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"One tech is crushing it while another coasts, and I can't prove it."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> Two techs work the same 8-hour shift at the same building. You pay both full wages, but you're only getting one tech's worth of productivity. The underperformer coasts undetected.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Per-employee performance tracking showing drops or units completed per shift, target achievement rates, and historical trends with outlier detection.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Objective performance data for coaching conversations. High performers feel recognized. Clients see 20-30% faster project completion.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-3" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I create a project, then manually re-enter everything into my calendar."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> Same information lives in four different places, wasting 30-45 minutes per project. You forget to add a project to the calendar and the client calls on the scheduled start date asking where your crew is.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Creating a project with date range and assigned employees automatically populates calendar entries. Color-coded project bars show scheduling conflicts instantly.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Zero redundant data entry. Impossible to forget calendar entries. 5-10 hours per week saved. No more emergency scrambles.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-4" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I'm guessing which techs are available next week."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You need to quote a new project starting Monday but aren't sure who's available. You double-book Tommy on two simultaneous jobs 40 km apart and have to scramble for emergency coverage at premium rates.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Calendar view with employee availability filters, color-coded project bars, and automatic conflict detection that flags double-bookings.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Confidently commit to new work based on real availability. Prevent double-booking disasters that cost $2,000-$5,000 in emergency coverage.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-5" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I have no idea how long this type of job should take."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> A client asks you to quote a 15-story window wash. You can't find your notes from the similar job six months ago. You guess and either overbid and lose the contract, or underbid and lose money.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Searchable project archive with filters for date range, building type, job type. Analytics dashboard showing average drops per day by job type and project duration trends.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Data-driven quoting with 15-20% more accurate pricing. Prevent 3-5 underbids per year, saving $6,000-$10,000.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-6" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"My brain is my business, and it's exhausted."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You're mentally tracking which projects are behind schedule, who's assigned where, which clients owe invoices, when inspections are due. This cognitive overload leads to burnout and inability to take vacation.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Unified system externalizes your mental database. Projects, schedules, payroll, safety docs, and client communications live in one place with automated reminders.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Psychological load reduced by 60-70%. Mental bandwidth freed for strategic thinking. Ability to take actual vacations without midnight panic attacks.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-7" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"Building managers call me constantly asking 'How's it going?'"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> Your building manager client calls or texts 5-10 times per week asking for updates. You spend 3-4 hours per week on status calls instead of productive work and still sound vague.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Building manager portal with identical visibility to your internal dashboard. They see real-time progress by elevation, photo galleries, schedules, and safety documentation.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Status call volume drops 80%. Building managers perceive you as tech-savvy and professional. 15-25% higher contract renewal rates.
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>

          {/* Building Managers */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2 pt-8">
              <Building2 className="w-5 h-5 text-violet-600" />
              For Building Managers & Property Managers
            </h3>
            
            <AccordionItem value="manager-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"Residents bombard me with status questions."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You receive 15-30 status calls per week. Unit 402 calls 8 PM Friday demanding no work Sunday. You scramble to contact the contractor and adjust their crew schedule. Two hours of chaos that could have been avoided.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Resident-facing portal showing real-time progress with 4-elevation visual system, upcoming work schedules, and expected completion dates.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Your time saved, 20+ hours per month. Resident complaints drop 60-70%. The contractor looks professional and transparent. Contract renewals increase 15-25%.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="manager-2" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I have no direct visibility into contractor progress."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You've hired a rope access company but have no way to verify they're working efficiently without site visits or constant calls. When residents ask for updates, you're reliant on the contractor's word.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Self-service portal access showing the exact same dashboard the rope access company sees. Real-time progress, crew assignments, safety documentation, all at your fingertips.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Answer questions instantly without contractor contact. Verify contractor performance objectively. Demonstrate professional property management through technology adoption.
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>

          {/* Residents */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2 pt-8">
              <HomeIcon className="w-5 h-5 text-rose-600" />
              For Building Residents
            </h3>
            
            <AccordionItem value="resident-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I have no idea when they'll finish MY elevation."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You're planning a family gathering this weekend but don't know if there will be strangers outside your windows. You have a birthday party Sunday and want to make sure the crew won't be working that day. It takes 2 days to get an answer.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Resident portal showing progress specific to your elevation. "South Elevation: 45% complete. Expected to reach your floor (8th) on Thursday Dec 12. Entire elevation complete by Dec 15."
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Peace of mind through transparency. Plan your life around construction schedules. No need to bother your property manager for basic status updates.
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>

          {/* Technicians */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2 pt-8">
              <Wrench className="w-5 h-5 text-orange-600" />
              For Rope Access Technicians
            </h3>
            
            <AccordionItem value="tech-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I don't know what my daily target is."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You show up to the job site and start working, but you're not sure if you're working fast enough. You complete 3 drops in a day. Later you find out the target was 5 drops per day. Nobody told you.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Mobile app shows your assigned projects with clear daily targets. "Marina Towers - Window Cleaning. Your target: 5 drops/day. Yesterday you completed: 4 drops."
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Clear expectations. Self-manage your pace. Know if you're on track before supervisor feedback. Feel confident you're meeting standards.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tech-2" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I have no visibility into my own performance."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You're working hard, but you have no idea how you compare to other technicians or to your own past performance. Annual review time, your supervisor says "inconsistent performance" but gives no concrete data.
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Performance dashboard showing your drops per day average, target achievement rate, and historical trends. "This month: 4.8 drops/day, 86% target achievement. Last month: 4.1 drops/day, 72%. You're improving."
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Objective self-assessment. Recognition for improvement. Clear areas for growth. Fair performance reviews based on data, not perception.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tech-3" className="border rounded-lg px-4 mt-3">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left">"I don't know where I'm working tomorrow."</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm text-muted-foreground pb-4">
                <div>
                  <span className="font-medium text-foreground">The Pain:</span> You finish work today and ask your supervisor "Where am I working tomorrow?" They say "I'll text you tonight." 9 PM rolls around, no text. You go to bed not knowing where to show up. 6 AM you get a text: "Marina Towers, be there by 7:30."
                </div>
                <div>
                  <span className="font-medium text-foreground">The Solution:</span> Mobile app shows your upcoming assignments. "Tomorrow: Marina Towers - Window Cleaning, 8:00 AM - 4:00 PM. Thursday: Ocean View Apartments - Caulking, 8:00 AM - 4:00 PM."
                </div>
                <div>
                  <span className="font-medium text-foreground">The Benefit:</span> Plan your commute the night before. Know what equipment to bring. No confusion or miscommunication. Professional clarity about your schedule.
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>
        </Accordion>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 text-white" style={{backgroundImage: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)'}}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Stop Managing in Your Head
          </h2>
          <p className="text-lg text-emerald-100">
            See exactly where every project stands without guessing or phone calls.<br />
            Full visibility. Real-time data. Simple calendar sync.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50" asChild data-testid="button-cta-trial">
              <Link href="/register">
                Start Your 90-Day Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-cta-guide">
              <Link href="/changelog/projects">
                Read the Full Guide
                <ArrowRight className="ml-2 w-5 h-5" />
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
