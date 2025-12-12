import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import ropeAccessSoftwareImg from "@assets/rope-access-software_1765481835892.jpg";
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
  Wrench,
  Sparkles,
  Compass,
  Eye,
  DollarSign,
  Search,
  Camera,
  GitBranch,
  BookOpen
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

      {/* Hero Section - Ocean Blue gradient per design guidelines */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B64A3] to-[#0369A1] text-white py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center space-y-6">
          <Badge className="bg-white/20 text-white border border-white/40">Project Management Module</Badge>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            Stop Managing Projects<br />
            <span className="text-white/90">In Your Head</span>
          </h1>
          
          <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            Track every building, elevation, and technician from one dashboard. See exactly where every job stands without a single phone call or site visit.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" className="h-11 px-6 bg-[#AB4521] text-white border-[#AB4521]" asChild data-testid="button-cta-trial">
              <Link href="/register">
                Start Your 90-Day Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-11 px-6 bg-white/10 backdrop-blur-xl border-white/40 text-white" asChild data-testid="button-cta-demo">
              <Link href="#knowledgebase">
                Find Answers
                <BookOpen className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-background"/>
          </svg>
        </div>
      </section>

      {/* Stats Section - per design guidelines: rounded-3xl, shadow-xl, -mt-20, p-12, 4-col grid */}
      <section className="relative z-10 -mt-20 max-w-7xl mx-auto px-4 md:px-8">
        <Card className="shadow-xl rounded-3xl border border-slate-200 dark:border-slate-800">
          <CardContent className="p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0 md:[&:nth-child(4)]:border-r-0">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600">4</div>
                <div className="text-sm text-muted-foreground mt-1">Elevations tracked independently</div>
              </div>
              <div className="text-center border-r border-slate-200 dark:border-slate-700 md:border-r md:[&:nth-child(4)]:border-r-0">
                <div className="text-3xl md:text-4xl font-bold text-[#0B64A3]">87-93%</div>
                <div className="text-sm text-muted-foreground mt-1">Payroll errors eliminated</div>
              </div>
              <div className="text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0 md:[&:nth-child(4)]:border-r-0">
                <div className="text-3xl md:text-4xl font-bold text-rose-600">60-70%</div>
                <div className="text-sm text-muted-foreground mt-1">Fewer resident complaints</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-violet-600">75%</div>
                <div className="text-sm text-muted-foreground mt-1">Faster quote preparation</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-200 dark:border-slate-700">
              <div className="text-center border-r border-slate-200 dark:border-slate-700">
                <div className="text-3xl md:text-4xl font-bold text-amber-600">5-10</div>
                <div className="text-sm text-muted-foreground mt-1">Hours saved weekly on scheduling</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600">20-30%</div>
                <div className="text-sm text-muted-foreground mt-1">Faster project completion</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* The Pain Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950 rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl text-amber-900 dark:text-amber-100">The Reality</CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <p>You're juggling window washing at Tower A, caulking at Building B, and anchor inspections at Complex C. A client calls asking for a status update. You're guessing.</p>
              <p>You think Tommy's finishing the north elevation today. Maybe. Sarah might have capacity next week. Probably. Your brain is your business. And it's exhausted.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* What Changes Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Every Project. Every Elevation. Every Technician. One Screen.</h2>
          <p className="text-muted-foreground leading-relaxed">
            OnRopePro's Project Management module tracks progress the way rope access actually works. Drop-based tracking for window cleaning and building wash. Hours-based for inspections and repairs. Unit-based for parkade cleaning and in-suite services.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Create a project with a date range and assigned crew, and the calendar populates automatically. Log work sessions from the field, and progress updates in real time. No duplicate data entry. No forgotten schedule conflicts. No 3 AM panic attacks.
          </p>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Buildings Have Four Sides. Your Tracking Should Too.</h2>
          <p className="text-muted-foreground leading-relaxed">
            High-rise window cleaning doesn't happen all at once. The north elevation might be 80% done while the south hasn't started. OnRopePro tracks North, East, South, and West independently. See exactly which directions are complete, in progress, or waiting. Your supervisor knows where to send the crew. Your client sees real progress instead of vague percentages.
          </p>
        </div>
      </section>

      {/* Software in Action Image */}
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <img 
              src={ropeAccessSoftwareImg} 
              alt="OnRopePro project management software shown on tablet with rope access technician working on high-rise building" 
              className="w-full h-auto object-cover"
              data-testid="img-software-showcase"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 md:p-8">
              <p className="text-white text-lg md:text-xl font-medium">
                Real-time elevation tracking. From any device. At any height.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Key Features */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#0B64A3]" />
            Key Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Directional Drop Tracking</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track progress on each building elevation (N/E/S/W) independently. Perfect for high-rise window cleaning with different access requirements per side.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Real-Time Progress Dashboard</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      See every project's completion percentage, days remaining, and assigned crew. Updates automatically as work sessions are logged.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0B64A3]/10 dark:bg-[#0B64A3]/20 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-[#0B64A3]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Flexible Tracking Methods</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Drop-based for window cleaning, hours-based for repairs, unit-based for suites. The system adapts to each job type.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Crew Assignment & Scheduling</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Assign technicians to specific projects and elevations. Color-coded project bars show scheduling conflicts instantly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0B64A3]/10 dark:bg-[#0B64A3]/20 flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5 text-[#0B64A3]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Client & Resident Visibility</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Property managers and residents check progress themselves. Photo galleries and completion status reduce status calls by 60-70%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Performance Analytics</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track drops or units completed per shift by technician. Identify top performers and coach underperformers with objective data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Piece Work Mode</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enable piece work compensation for drop-based projects. Set rate per drop, and payroll calculates automatically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Project Archive & Search</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Completed projects archive automatically but remain searchable. Historical data powers accurate future quoting.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Photo Documentation</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Attach photos to work sessions showing completed work. Before/after galleries accessible to building managers and residents.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0B64A3]/10 dark:bg-[#0B64A3]/20 flex items-center justify-center shrink-0">
                    <GitBranch className="w-5 h-5 text-[#0B64A3]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Status Workflow</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Projects move through Draft, Active, On Hold, Completed, and Archived stages. Pause projects for weather or client requests.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Module Integration Points */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Talks To Everything Else</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Projects are the operational hub connecting multiple OnRopePro modules. When data enters one place, it flows everywhere it needs to go.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Employee Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">What Connects:</p>
                  <p className="text-muted-foreground mt-1">Crew assignments pull directly from your employee directory. System filters by qualification level (irata Level 2+). Performance metrics from work sessions feed back into employee records.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Why It Matters:</p>
                  <p className="text-muted-foreground mt-1">Ensure qualified crew assigned every time. Performance reviews backed by objective data. Career progression tracked through project complexity.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Work Sessions & Time Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">What Connects:</p>
                  <p className="text-muted-foreground mt-1">When technicians log work sessions on a project, data automatically populates payroll timesheets. Drop counts, hours, or units convert directly to wages. No transcription required.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Why It Matters:</p>
                  <p className="text-muted-foreground mt-1">87-93% reduction in payroll errors. 15-25 hours per week saved. Zero disputes because system timestamps everything.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Payroll</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">What Connects:</p>
                  <p className="text-muted-foreground mt-1">Project-specific tracking feeds payroll calculations. Drop-based projects calculate piece work pay. Hours-based projects calculate hourly wages. Payroll module pulls all session data without manual entry.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Why It Matters:</p>
                  <p className="text-muted-foreground mt-1">Payroll runs in 30 minutes instead of 4-8 hours. Employees see exactly how their pay was calculated. Disputes drop to near zero.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Safety & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">What Connects:</p>
                  <p className="text-muted-foreground mt-1">Each project links to required safety documentation: Rope Access Plans, Job Safety Analyses, Toolbox Meetings, Anchor Inspections. Attach directly to the relevant project.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Why It Matters:</p>
                  <p className="text-muted-foreground mt-1">Building managers download compliance docs instantly. Complete audit trail for insurance. 10-20% insurance premium discount with documented safety program.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Job Schedule & Calendar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">What Connects:</p>
                  <p className="text-muted-foreground mt-1">Creating a project with date range and assigned employees automatically generates calendar entries. Drag-and-drop rescheduling syncs back to project assignments. Conflict detection flags double-bookings.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Why It Matters:</p>
                  <p className="text-muted-foreground mt-1">Zero redundant data entry. Impossible to forget calendar entries. 5-10 hours per week saved. Prevent $2,000-$5,000 double-booking disasters.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Buildings Database</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">What Connects:</p>
                  <p className="text-muted-foreground mt-1">Projects link to building records containing address, contact info, access instructions, and historical maintenance data. System pulls existing building data automatically for repeat clients.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Why It Matters:</p>
                  <p className="text-muted-foreground mt-1">No re-entering building details. Complete history of all work at each location. Property managers see building's maintenance timeline in one place.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Resident Portal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">What Connects:</p>
                  <p className="text-muted-foreground mt-1">Residents register with building-specific codes. They see progress on projects affecting their building, filtered to show only their elevation. Feedback submissions link directly to the relevant project.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Why It Matters:</p>
                  <p className="text-muted-foreground mt-1">Residents self-serve instead of calling. Complaints route directly to you with project context. Status calls drop 60-70%.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Documents Repository</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">What Connects:</p>
                  <p className="text-muted-foreground mt-1">Project-specific documents store in centralized repository with project tags. Safety docs, contracts, photos, reports all link back to their project. Search by project name, date, or type.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Why It Matters:</p>
                  <p className="text-muted-foreground mt-1">Everything in one place. Insurance audits take minutes instead of hours. No more digging through email or truck compartments.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Client & Property Manager Records</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">What Connects:</p>
                  <p className="text-muted-foreground mt-1">Projects associate with client records containing contact preferences, billing details, and communication history. Building manager portal access grants visibility into all projects at their properties.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Why It Matters:</p>
                  <p className="text-muted-foreground mt-1">Know which building manager prefers email versus phone. Track communication history when disputes arise. Building managers feel informed without requiring your time.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Complaints & Feedback Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">What Connects:</p>
                  <p className="text-muted-foreground mt-1">When residents or building managers submit feedback, it attaches to the specific project. You respond within the system. The full conversation history stays linked to the project record.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Why It Matters:</p>
                  <p className="text-muted-foreground mt-1">No digging through email threads to find complaint context. All stakeholders see the same conversation. Professional response tracking for client retention.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">Invoicing <Badge variant="secondary" className="text-xs">Coming Soon</Badge></CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">What Connects:</p>
                  <p className="text-muted-foreground mt-1">Project completion will trigger invoice generation. Labor hours and materials will auto-populate billing. Client portal will show project details matching invoice line items.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Why It Matters:</p>
                  <p className="text-muted-foreground mt-1">Same-day invoicing instead of 1-2 week delays. Reduced billing disputes because backup documentation is transparent. Faster payment cycles improve cash flow.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">Quoting <Badge variant="secondary" className="text-xs">Coming Soon</Badge></CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">What Connects:</p>
                  <p className="text-muted-foreground mt-1">Historical project data will feed quote generation. System will suggest pricing based on similar past projects. Accepted quotes will convert directly to projects with one click.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Why It Matters:</p>
                  <p className="text-muted-foreground mt-1">Accurate quotes based on real historical data. 25% improvement in quote accuracy. No more underbidding or leaving money on the table.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Archive & Analytics */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Historical Data Makes Future Quotes Accurate</h2>
          <p className="text-muted-foreground leading-relaxed">
            Completed projects are archived, not deleted. Search by building name, job type, date range, assigned employees, or completion status. Pull up analytics showing average drops per day, labor hours per building type, project duration trends.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            "Last time we did a 20-story window wash, it took 14 days with 2 techs averaging 8 drops per day." No more guessing. No more underbidding by 50%. No more overbidding by 30% and leaving money on the table.
          </p>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Problems Solved */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Problems Solved</h2>
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
              <Wrench className="w-5 h-5 text-amber-600" />
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
