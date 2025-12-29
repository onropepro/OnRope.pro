import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { Link } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import { SoftwareReplaces, MODULE_SOFTWARE_MAPPING } from "@/components/SoftwareReplaces";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { EmployerRegistration } from "@/components/EmployerRegistration";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import {
  Briefcase,
  CheckCircle2,
  Users,
  ArrowRight,
  Building2,
  Clock,
  Globe,
  ChevronsUpDown,
  Crown,
  Home as HomeIcon,
  Wrench,
  Sparkles,
  Database,
  Zap,
  MapPin,
  FileText,
  Lock,
  Compass,
  BookOpen,
  DollarSign,
  Shield,
  ClipboardCheck,
  Calculator
} from "lucide-react";

const ALL_ACCORDION_ITEMS = [
  "owner-1", "owner-2", "owner-3",
  "manager-1", "manager-2",
  "tech-1",
  "pm-1",
  "bm-1"
];

export default function CRMLanding() {
  const [expandedProblems, setExpandedProblems] = useState<string[]>([]);
  const { openLogin } = useAuthPortal();
  const [showRegistration, setShowRegistration] = useState(false);
  const allExpanded = expandedProblems.length === ALL_ACCORDION_ITEMS.length;

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedProblems([]);
    } else {
      setExpandedProblems([...ALL_ACCORDION_ITEMS]);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="modules" />

      {/* Hero Section - Following Module Hero Template from design_guidelines.md */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              Client Relationship Management Module
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Your client info lives in 5 places.<br />
              Your building specs in 3.<br />
              <span className="text-blue-100">And your crew just showed up with short ropes.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Every client. Every building. Every spec. One system, one entry, forever. Select a client, and the floors, drops, parking, and address auto-populate into your next project in seconds.<br />
              <strong>Stop typing the same floor counts into the same spreadsheet for the same building every single year.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] border-white" onClick={() => setShowRegistration(true)} data-testid="button-cta-trial">
                Start Your Free 60-Day Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white bg-white/10" onClick={openLogin} data-testid="button-cta-signin">
                Sign In
              </Button>
            </div>
            
            <SoftwareReplaces 
              software={MODULE_SOFTWARE_MAPPING["client-relationship-management"]} 
              className="mt-8 bg-white/5 rounded-lg mx-auto max-w-2xl [&_span]:text-blue-100 [&_svg]:text-blue-200"
            />
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
                  <div className="text-3xl md:text-4xl font-bold text-blue-700">15 min</div>
                  <div className="text-2xl md:text-3xl font-bold text-blue-700">to 2 min</div>
                  <div className="text-base text-muted-foreground mt-1">Project Setup Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">36 to 1</div>
                  <div className="text-base text-muted-foreground mt-1">Data Entries Per Client/Year</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-orange-600">0</div>
                  <div className="text-base text-muted-foreground mt-1">Data Entry Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">1 System</div>
                  <div className="text-base text-muted-foreground mt-1">Not 5 Scattered Tools</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Pain Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950 rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl text-amber-900 dark:text-amber-100">The Spreadsheet Shuffle That Never Ends</CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <p className="text-base">Building LMS-1234 needs window cleaning next month. Where's the floor count? The Excel file. Where's the property manager's number? That text thread. Where's last year's drop schedule? A photo of your handwritten notes. Where's the billing address? An email from 2023.</p>
              <p className="text-base">Every project starts this way. Digging through old files, scrolling through conversations, hoping the numbers are still accurate. And when you finally piece it together, you type it all in again. The same building. The same specs. The same 15 minutes of your life.</p>
              <p className="text-base font-medium">OnRopePro ends the shuffle.</p>
            </CardContent>
          </Card>
          
          <Card className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 rounded-2xl shadow-md">
            <CardContent className="pt-6 text-emerald-900 dark:text-emerald-100 space-y-4">
              <p className="text-base">Enter a client once. Attach their buildings with full specs (floors, drops, parking, units). When you create next year's project, select the client from a dropdown. Every field populates automatically.</p>
              <p className="text-base font-medium">The data you entered in 2025 autofills in 2026 and beyond.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* What This Module Does Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">What This Module Does</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The central hub connecting clients, buildings, projects, and billing in one system.
          </p>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto">
            The CRM module stores your clients and their building portfolios with full operational specifications, then auto-populates that data whenever you create new projects.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Client Portfolio Management */}
          <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <CardTitle className="text-lg">Client Portfolio Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base text-muted-foreground">
              <p>Every client record holds multiple buildings. One property management company managing 12 towers? One client record, 12 LMS entries, each with individual specs.</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="font-medium text-foreground mb-2">What gets stored:</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />Primary contact: name, phone, email, company</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />Billing address (when different from service)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />Unlimited building portfolio</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />Relationship history across all projects</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Building Specification Database */}
          <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-3">
                <Database className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <CardTitle className="text-lg">Building Specification Database</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base text-muted-foreground">
              <p>Each building stores the operational data rope access crews need. Floor counts determine rope lengths. Drop targets drive scheduling. Parking stall counts affect crew logistics.</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="font-medium text-foreground mb-2">What gets tracked per building:</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />Strata plan number and display name</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />Full street address and floor count</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />Daily drop target</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />4-elevation drop counts (N/E/S/W)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Autofill Intelligence */}
          <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-lg">Autofill Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base text-muted-foreground">
              <p>When creating a new project, select a client. If that client has multiple buildings, select the building. The system auto-populates every field from your stored specs.</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="font-medium text-foreground mb-2">What auto-populates:</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />Strata plan number and building name</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />Building address and floor count</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />Daily drop target and 4-elevation drops</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />Unit count and parking stalls</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Stakeholder Benefits Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Who Benefits From This Module
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Every stakeholder gets exactly the data access they need
          </p>

          <div className="space-y-8">
            {/* For Employers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">For Employers (Company Owners)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Your building data becomes an asset, not a scavenger hunt.</h4>
                    <p className="text-base text-muted-foreground">Every client. Every building. Every specification. Stored once, searchable instantly, auto-filled into every future project.</p>
                    <p className="text-base text-muted-foreground">No more digging through old files.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Project setup drops from 15 minutes to 2.</h4>
                    <p className="text-base text-muted-foreground">Select client, select building, done. Floor counts, drop targets, addresses, contacts, all populate automatically.</p>
                    <p className="text-base text-muted-foreground">Three new contracts in one day? 6 minutes of setup instead of 45.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Data entry errors stop costing you jobs.</h4>
                    <p className="text-base text-muted-foreground">You typed 15 floors instead of 25. Crew shows up with short ropes. Half-day wasted. Client questioning your professionalism.</p>
                    <p className="text-base text-muted-foreground">Autofill intelligence eliminates manual entry entirely.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Operations Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-amber-50 dark:bg-amber-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">For Operations Managers and Supervisors</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Equipment planning gets specific.</h4>
                    <p className="text-base text-muted-foreground">Before dispatching crews, you know exact floor counts (which determines rope lengths), parking availability, and access points.</p>
                    <p className="text-base text-muted-foreground">No more calling the owner mid-meeting.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Duration estimates become accurate.</h4>
                    <p className="text-base text-muted-foreground">Building specs feed directly into scheduling. A 10-floor drop takes different time than a 50-floor drop.</p>
                    <p className="text-base text-muted-foreground">The data is already there.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Technicians */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-[#95ADB6]/10 dark:bg-[#95ADB6]/20 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#95ADB6]/20 dark:bg-[#95ADB6]/30 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-[#95ADB6]" />
                  </div>
                  <CardTitle className="text-xl">For Technicians</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">Your job info is complete before you arrive.</h4>
                  <p className="text-base text-muted-foreground">Building address, floor count, daily drop target, and 4-elevation breakdown, already in the project. No surprises on site.</p>
                </div>
              </CardContent>
            </Card>

            {/* For Property Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-[#6E9075]/10 dark:bg-[#6E9075]/20 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#6E9075]/20 dark:bg-[#6E9075]/30 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-[#6E9075]" />
                  </div>
                  <CardTitle className="text-xl">For Property Managers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">Your building specs are on file permanently.</h4>
                  <p className="text-base text-muted-foreground">When you request service next year, no one needs to ask "how many floors again?"</p>
                  <p className="text-base text-muted-foreground">Your data stays accurate across every project.</p>
                </div>
              </CardContent>
            </Card>

            {/* For Building Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-violet-50 dark:bg-violet-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-xl">For Building Managers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">Consistent service from day one.</h4>
                  <p className="text-base text-muted-foreground">Companies using OnRopePro already know your building's specs. Less back-and-forth. Faster project starts.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Key Features */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#0B64A3]" />
            Key Features
          </h2>
          <p className="text-muted-foreground mb-6">Six capabilities that transform scattered data into operational intelligence.</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">One Client, Unlimited Buildings</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Most property management companies oversee multiple towers. Strata Corp Ltd manages 3 buildings? One client record stores all three, each with individual specifications.
                    </p>
                    <p className="text-base text-muted-foreground mt-1">
                      No duplicate contacts. No fragmented data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Regional ID Flexibility</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Vancouver uses LMS and EMS. Vancouver Island uses VIS. OnRopePro accepts any format.
                    </p>
                    <p className="text-base text-muted-foreground mt-1">
                      Your strata numbers work however your region names them.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Reverse Client Creation</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Starting a project for a brand new client? Enter the details directly in the project form. After saving, the system prompts: "Save as new client?"
                    </p>
                    <p className="text-base text-muted-foreground mt-1">
                      One click creates both the project AND the permanent client record.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0B64A3]/10 dark:bg-[#0B64A3]/20 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5 text-[#0B64A3]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">4-Elevation Drop Tracking</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      North, East, South, West drop counts stored per building. When crews arrive, the elevation breakdown is already in the project.
                    </p>
                    <p className="text-base text-muted-foreground mt-1">
                      No site surveys required.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Separate Billing Addresses</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Service address and billing address often differ. Store both. Invoices route correctly automatically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Permission-Controlled Access</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Not everyone should see or edit client records. View-only access for those who need to reference.
                    </p>
                    <p className="text-base text-muted-foreground mt-1">
                      Full manage access for those who maintain the database.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Problems Solved Section */}
      <section id="problems-solved" className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-3xl md:text-4xl font-bold">Problems Solved</h2>
          <Button onClick={toggleAll} variant="outline" data-testid="button-toggle-all-accordions">
            <ChevronsUpDown className="w-4 h-4 mr-2" />
            {allExpanded ? "Collapse All" : "Expand All"}
          </Button>
        </div>

        {/* For Employers */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 pb-2 border-b">
            <Crown className="w-5 h-5 text-amber-500" />
            <h3 className="text-xl md:text-2xl font-semibold">For Employers (Company Owners)</h3>
          </div>
          
          <Accordion type="multiple" value={expandedProblems} onValueChange={setExpandedProblems} className="space-y-3">
            <AccordionItem value="owner-1" className="border rounded-lg px-4" data-testid="accordion-owner-1">
              <AccordionTrigger className="text-left">
                "I'm entering the same building information over and over again."
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p><span className="font-medium text-foreground">The Pain:</span> Strata Corp Ltd manages 3 buildings. Every year, window cleaning at all three. Without centralized records, you re-enter 25 floors, 4-elevation drop counts, parking stall info, and contact details for each building, for each project. That's 36+ manual data entries per year for one client.</p>
                <p><span className="font-medium text-foreground">The Solution:</span> Enter client and building information once. Select them from a dropdown for every future project. Building specs entered in 2025 auto-populate in 2026 and beyond.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="owner-2" className="border rounded-lg px-4" data-testid="accordion-owner-2">
              <AccordionTrigger className="text-left">
                "Our client information is scattered across Excel, texts, and paper."
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p><span className="font-medium text-foreground">The Pain:</span> Property manager Jane Doe calls about building LMS-1234. You need her phone number, the building address, floor count, and last year's drop targets. That information exists in 4 different places, and you're not sure which version is current.</p>
                <p><span className="font-medium text-foreground">The Solution:</span> All contact details, building specs, and project history organized in one searchable system. Find everything by client name, building address, or LMS number.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="owner-3" className="border rounded-lg px-4" data-testid="accordion-owner-3">
              <AccordionTrigger className="text-left">
                "Manual data entry errors are costing us money and credibility."
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p><span className="font-medium text-foreground">The Pain:</span> You type "15 floors" instead of "25 floors" for a new project. Crew shows up with short ropes. Half-day wasted, emergency equipment run, client questioning your professionalism.</p>
                <p><span className="font-medium text-foreground">The Solution:</span> Autofill intelligence eliminates manual entry. Building specs flow automatically from stored records. The same verified data used for every project.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* For Operations Managers */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 pb-2 border-b">
            <Briefcase className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl md:text-2xl font-semibold">For Operations Managers and Supervisors</h3>
          </div>
          
          <Accordion type="multiple" value={expandedProblems} onValueChange={setExpandedProblems} className="space-y-3">
            <AccordionItem value="manager-1" className="border rounded-lg px-4" data-testid="accordion-manager-1">
              <AccordionTrigger className="text-left">
                "I need building specs for equipment planning but can't find them."
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p><span className="font-medium text-foreground">The Pain:</span> Building LMS-4567 is scheduled for Wednesday. The new technician asks what rope length to bring. You don't have that building's specs handy. You call the owner. They're in a meeting. The technician brings wrong equipment.</p>
                <p><span className="font-medium text-foreground">The Solution:</span> Every building's floor count, drop targets, and specs are searchable instantly. Equipment planning happens with complete information.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="manager-2" className="border rounded-lg px-4" data-testid="accordion-manager-2">
              <AccordionTrigger className="text-left">
                "I'm duplicating setup work for repeat buildings."
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p><span className="font-medium text-foreground">The Pain:</span> Same building, same client, same specs as last year. But you're entering everything from scratch because there's no permanent record.</p>
                <p><span className="font-medium text-foreground">The Solution:</span> Building specs persist across years. Last year's 25-floor building with 4 north drops and 6 south drops? Still 25 floors with 4 north and 6 south.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* For Technicians */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 pb-2 border-b">
            <Wrench className="w-5 h-5 text-orange-500" />
            <h3 className="text-xl md:text-2xl font-semibold">For Technicians</h3>
          </div>
          
          <Accordion type="multiple" value={expandedProblems} onValueChange={setExpandedProblems} className="space-y-3">
            <AccordionItem value="tech-1" className="border rounded-lg px-4" data-testid="accordion-tech-1">
              <AccordionTrigger className="text-left">
                "I arrive at jobs without knowing the building layout."
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p><span className="font-medium text-foreground">The Pain:</span> How many floors? What's the daily drop target? Which elevations have the most work? You find out when you get there.</p>
                <p><span className="font-medium text-foreground">The Solution:</span> Project details include full building specs before you leave. Floor count, drop targets, and 4-elevation breakdown, all visible.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* For Property Managers */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 pb-2 border-b">
            <Globe className="w-5 h-5 text-[#6E9075]" />
            <h3 className="text-xl md:text-2xl font-semibold">For Property Managers</h3>
          </div>
          
          <Accordion type="multiple" value={expandedProblems} onValueChange={setExpandedProblems} className="space-y-3">
            <AccordionItem value="pm-1" className="border rounded-lg px-4" data-testid="accordion-pm-1">
              <AccordionTrigger className="text-left">
                "I have to re-explain my building every time I call for service."
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p><span className="font-medium text-foreground">The Pain:</span> Different rep each time. Same questions about floors, parking, access. Feels like they've never worked on your building before.</p>
                <p><span className="font-medium text-foreground">The Solution:</span> Your building specs are on file permanently. Request service and your details auto-populate. No re-explanation needed.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* For Building Managers */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 pb-2 border-b">
            <Building2 className="w-5 h-5 text-violet-500" />
            <h3 className="text-xl md:text-2xl font-semibold">For Building Managers</h3>
          </div>
          
          <Accordion type="multiple" value={expandedProblems} onValueChange={setExpandedProblems} className="space-y-3">
            <AccordionItem value="bm-1" className="border rounded-lg px-4" data-testid="accordion-bm-1">
              <AccordionTrigger className="text-left">
                "Vendor coordination takes too long because basic info is always missing."
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p><span className="font-medium text-foreground">The Pain:</span> Every new vendor needs building orientation. Floors, access points, parking limitations. The same briefing, different company, every time.</p>
                <p><span className="font-medium text-foreground">The Solution:</span> Companies using OnRopePro already have your building's specs. Less coordination. Faster project starts.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Module Integration Points */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The CRM Is The Foundation</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Building and client data flows into every other module. What you enter once propagates everywhere it needs to go.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  Project Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <p className="font-medium text-foreground">What Connects:</p>
                <p className="text-muted-foreground">Client selection auto-populates building specs into new projects. Floor counts, drop targets, and addresses transfer automatically.</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Payroll and Financial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <p className="font-medium text-foreground">What Connects:</p>
                <p className="text-muted-foreground">Client billing addresses flow into invoice generation. No manual address entry for each payment cycle.</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-rose-600" />
                  Quoting and Sales Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <p className="font-medium text-foreground">What Connects:</p>
                <p className="text-muted-foreground">Historical building data enables accurate quote generation. Past project specs inform future pricing.</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Work Sessions and Time Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <p className="font-medium text-foreground">What Connects:</p>
                <p className="text-muted-foreground">Building-specific daily drop targets set baseline expectations for session productivity.</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-sky-600" />
                  Safety and Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <p className="font-medium text-foreground">What Connects:</p>
                <p className="text-muted-foreground">Building specs (floor counts, elevation data) inform equipment requirements and safety planning.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-4xl mx-auto">
        <Card className="border-2 border-[#0B64A3] bg-[#0B64A3]/5 dark:bg-[#0B64A3]/10 rounded-2xl shadow-md">
          <CardContent className="p-8 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Stop Managing Data. Start Managing Growth.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Right now, every new project means hunting. Client contact in one spreadsheet. Building address in another. Floor counts in a text message you sent yourself 8 months ago.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              With the CRM module, that building data exists permanently. One entry. One source. Every future project pulls from the same verified specs. Select client, select building, start scheduling.
            </p>
            <p className="text-lg font-medium text-foreground max-w-2xl mx-auto">
              You didn't start a rope access company to manage spreadsheets. The CRM gives you back the time to run an actual business.
            </p>
            <div className="pt-4">
              <Button size="lg" className="bg-[#0B64A3] text-white hover:bg-[#0369A1]" onClick={() => setShowRegistration(true)} data-testid="button-final-cta">
                Start Your Free 60-Day Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="space-y-3">
          <AccordionItem value="faq-1" className="border rounded-lg px-4" data-testid="accordion-faq-1">
            <AccordionTrigger className="text-left font-medium">
              Can one client have multiple buildings?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes. This is the core design. One client (property management company or strata) can have unlimited buildings, each with their own LMS number and specifications. Strata Corp Ltd manages 3 buildings: LMS-1234, LMS-5678, and LMS-9012. All three are stored under the single Strata Corp Ltd client record.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="faq-2" className="border rounded-lg px-4" data-testid="accordion-faq-2">
            <AccordionTrigger className="text-left font-medium">
              What happens if I create a project without selecting an existing client?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              The system prompts you to save the entered details as a new client after project creation. You don't need to create the client first.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="faq-3" className="border rounded-lg px-4" data-testid="accordion-faq-3">
            <AccordionTrigger className="text-left font-medium">
              Is my building data shared with other companies?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              No. Currently, building data is private to your company. Each company maintains its own client/building database.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="faq-4" className="border rounded-lg px-4" data-testid="accordion-faq-4">
            <AccordionTrigger className="text-left font-medium">
              What's the difference between LMS, EMS, and VIS?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Regional naming conventions for building identifiers. LMS and EMS are used in Vancouver. VIS is used on Vancouver Island. OnRopePro accepts any format.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="faq-5" className="border rounded-lg px-4" data-testid="accordion-faq-5">
            <AccordionTrigger className="text-left font-medium">
              Why store parking stall counts?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Parking directly impacts operations. Crews need to know: Is there loading zone access? How many vehicles can park? This affects equipment delivery and crew logistics.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="faq-6" className="border rounded-lg px-4" data-testid="accordion-faq-6">
            <AccordionTrigger className="text-left font-medium">
              What does the 'stories' field actually do?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Stories (floor count) determines two critical things: how long a drop will take (different on a 10-floor vs. 50-floor building) and what equipment you need (rope length requirements). It's operational data, not just address info.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="faq-7" className="border rounded-lg px-4" data-testid="accordion-faq-7">
            <AccordionTrigger className="text-left font-medium">
              How does autofill intelligence work?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              When creating a new project, select a client from the dropdown. If that client has multiple buildings configured, select the specific building. The system automatically populates: strata plan number, building name, address, floor count, daily drop target, 4-elevation drops, unit count, and parking stalls.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="faq-8" className="border rounded-lg px-4" data-testid="accordion-faq-8">
            <AccordionTrigger className="text-left font-medium">
              Who can access client records?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Permission-controlled. "View Client" permission allows read-only access. "Manage Client" permission allows creating, editing, and deleting records.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="faq-9" className="border rounded-lg px-4" data-testid="accordion-faq-9">
            <AccordionTrigger className="text-left font-medium">
              Does my building data carry over to next year?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes. Permanently. Building specs entered in 2025 auto-populate when you create 2026 projects for the same client. One entry, use forever.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="faq-10" className="border rounded-lg px-4" data-testid="accordion-faq-10">
            <AccordionTrigger className="text-left font-medium">
              What if we already have client data in spreadsheets?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              You'll need to enter clients once into OnRopePro to start. After that, no more spreadsheet updates. The system becomes your single source of truth.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={onRopeProLogo} alt="OnRopePro" className="h-10 brightness-0 invert" />
            </div>
            <div className="text-sm text-slate-400">
              Client Relationship Management Module
            </div>
          </div>
        </div>
      </footer>

      <EmployerRegistration open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
}
