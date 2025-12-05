import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import ChangelogLayout from "@/components/ChangelogLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Building2,
  FolderOpen,
  Calendar,
  Target,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Info,
  Layers,
  BarChart3,
  Users,
  Compass,
  Grid3X3,
  Zap,
  FileText,
  ChevronRight,
  Plus,
  Settings,
  Car,
  Home as HomeIcon,
  Droplets,
  Wind,
  Paintbrush,
  Search,
  MoreHorizontal,
  Crown,
  Key,
  Brain,
  DollarSign,
  Eye,
  CalendarCheck,
  History,
  MessageSquare,
  Sparkles,
  ParkingCircle,
  Wrench,
  AppWindow
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectsGuide() {
  const [, navigate] = useLocation();

  return (
    <ChangelogLayout title="Projects Guide">
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton to="/changelog" />
            <div>
              <h1 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Project Management Guide</h1>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>Version 2.0 - Updated December 5, 2025</p>
            </div>
          </div>
          <MainMenuButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Project Management Overview
            </h2>
            <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>
              Projects represent individual building maintenance jobs. Each project tracks a specific type of work at a specific location, with progress measured differently depending on the job type. Projects are the central hub connecting <strong>employees, scheduling, safety documentation, and financial tracking</strong>.
            </p>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <div className="rounded-lg border-l-4 border-amber-500 bg-card p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4" style={{ fontFamily: "Outfit, sans-serif", fontSize: "18px" }}>
              <Key className="w-5 h-5 text-amber-500" />
              The Golden Rule: Job Type Determines Tracking
            </h3>
            
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-base font-mono text-center leading-relaxed" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>
                Progress Method = f(Job Type)
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>Key Principles</h4>
                <ul className="space-y-2 text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>
                  <li className="flex gap-2">
                    <span className="text-amber-500 mt-1">1.</span>
                    <span><strong>Drop-based</strong>: Count "drops" (vertical passes) per building elevation. Used for window cleaning, building wash, facade work.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500 mt-1">2.</span>
                    <span><strong>Hours-based</strong>: Track time spent with manual completion percentage. Used for general maintenance, repairs, investigative work.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500 mt-1">3.</span>
                    <span><strong>Unit-based</strong>: Count individual units (suites) or stalls completed. Used for in-suite services, parkade cleaning.</span>
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 mt-4">
                <p className="font-medium flex items-center gap-2 mb-4" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>
                  <Info className="w-4 h-4 text-muted-foreground" />
                  Why This Matters
                </p>
                <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>
                  The form you see when ending a work session changes based on job type. Drop-based jobs ask for N/E/S/W drop counts. Hours-based jobs ask for completion percentage. The system adapts to each work type, ensuring accurate progress tracking and payroll calculation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Job Types Visual Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
            <Grid3X3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Supported Job Types
          </h2>
          
          <div className="grid md:grid-cols-3 gap-3">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <AppWindow className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>Window Cleaning</p>
                    <p className="text-xs text-muted-foreground">Drop-based tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Wind className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>Dryer Vent Cleaning</p>
                    <p className="text-xs text-muted-foreground">Drop-based tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>Building Wash</p>
                    <p className="text-xs text-muted-foreground">Drop-based tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <ParkingCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>Parkade Cleaning</p>
                    <p className="text-xs text-muted-foreground">Stall-based tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Search className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>Inspection</p>
                    <p className="text-xs text-muted-foreground">Hours-based tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>Repairs</p>
                    <p className="text-xs text-muted-foreground">Hours-based tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-dashed">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border-2 border-dashed flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>Custom Job Types</p>
                  <p className="text-xs text-muted-foreground">Create and save custom job types with icons for reuse across projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Directional Drop Tracking Visual */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
            <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Directional Drop Tracking
          </h2>
          
          <Card className="border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950">
            <CardContent className="pt-6 text-emerald-900 dark:text-emerald-100">
              <p className="mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Track progress on each side of a building independently:</p>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-white dark:bg-emerald-900 rounded-lg p-3">
                  <Compass className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                  <p className="font-bold text-sm">North</p>
                </div>
                <div className="bg-white dark:bg-emerald-900 rounded-lg p-3">
                  <Compass className="w-6 h-6 mx-auto mb-1 text-emerald-600 rotate-90" />
                  <p className="font-bold text-sm">East</p>
                </div>
                <div className="bg-white dark:bg-emerald-900 rounded-lg p-3">
                  <Compass className="w-6 h-6 mx-auto mb-1 text-emerald-600 rotate-180" />
                  <p className="font-bold text-sm">South</p>
                </div>
                <div className="bg-white dark:bg-emerald-900 rounded-lg p-3">
                  <Compass className="w-6 h-6 mx-auto mb-1 text-emerald-600 -rotate-90" />
                  <p className="font-bold text-sm">West</p>
                </div>
              </div>
              <p className="text-sm mt-4" style={{ fontFamily: "Outfit, sans-serif" }}>Each direction tracks its own drop count, completion status, and assigned crew members. This allows precise scheduling when different elevations have different access requirements or completion timelines.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Problems Solved */}
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Problems Solved</h2>
            <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>
              Real challenges addressed by OnRopePro's Project Management module.
            </p>
          </div>

          {/* Company Owners Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-medium" style={{ fontFamily: "Outfit, sans-serif", fontSize: "18px" }}>For Rope Access Company Owners</h3>
            </div>
            
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="owner-1" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium" style={{ fontFamily: "Outfit, sans-serif", fontSize: "18px" }}>I have no idea where my 6 active projects actually stand</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>
                    <p>You're juggling window washing at Tower A, caulking at Building B, and anchor inspections at Complex C. When a client calls asking for a status update, you're guessing based on what you remember from yesterday's phone call with your supervisor. You drive site-to-site taking notes, wasting 10-15 hours per week just figuring out what's happening.</p>
                    <p><span className="font-medium text-foreground">Example:</span> You bid a new project for next week, but you're not sure if your current jobs will finish on time. You don't know if Tommy is overloaded or if Sarah has capacity. You commit anyway and hope it works out—then discover you've double-booked your best crew.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Real-time dashboard showing every project's progress percentage, days remaining, assigned crew, and completion forecast. Filter by status, building, or technician. Updates automatically as work sessions are logged.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Instant oversight without site visits. Confidently quote new work based on real crew availability. Make data-driven prioritization decisions in seconds, not hours.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium" style={{ fontFamily: "Outfit, sans-serif", fontSize: "18px" }}>One tech is crushing it while another coasts—and I can't prove it</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>
                    <p>Your gut says Tommy completes 5 drops per day while another employee barely does 1, but they work the same hours. Without hard data, you can't have the coaching conversation. You suspect someone's on their phone half the day, but proving it means physical surveillance—awkward and time-consuming.</p>
                    <p><span className="font-medium text-foreground">Example:</span> Two techs worked the same 8-hour shift at the same building. Your client complains progress is slow. You pay both techs full wages, but you're only getting one tech's worth of productivity. The high performer feels demoralized; the underperformer coasts undetected.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Per-employee performance tracking showing drops/units completed per shift, target achievement rates (e.g., "Meeting target 87% of time"), and historical trends. Outlier detection automatically flags significant deviations from team averages.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Objective performance data for coaching conversations. High performers feel recognized (lower turnover). Underperformers either improve or self-select out. Clients see 20-30% faster project completion.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium" style={{ fontFamily: "Outfit, sans-serif", fontSize: "18px" }}>Residents bombard the property manager with status questions</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>
                    <p>The property manager receives 15-30 status calls per week during your project. Residents assume the worst because they have no visibility. The property manager becomes frustrated playing telephone between you and 40 units. Your professional reputation suffers even though your crew is working efficiently.</p>
                    <p><span className="font-medium text-foreground">Example:</span> Unit 402 has a birthday party on Sunday and demands you not work near their windows that day. The property manager calls you at 8 PM on Friday with this restriction. You scramble to reschedule your crew, move equipment, and adjust the timeline—2 hours of chaos that could have been avoided.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Resident-facing portal showing real-time progress (4-elevation visual system), upcoming work schedules ("We'll be near your unit Wednesday 9am-3pm"), photo galleries of completed work, and expected completion dates. Residents submit feedback directly without property manager middleman.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Property manager time saved (20+ hours/month per active project). Resident complaints drop 60-70%. Your company looks professional and transparent. Contract renewals increase 15-25%. Building managers refer you to other properties.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-4" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium" style={{ fontFamily: "Outfit, sans-serif", fontSize: "18px" }}>I create a project, then manually re-enter everything into my calendar</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>
                    <p>You win a new contract. You create the project in your system (or Excel). Then you open Google Calendar and manually block off dates. Then you text your supervisor the crew assignments. Then you update your whiteboard. Same information, four different places, wasting 30-45 minutes per project.</p>
                    <p><span className="font-medium text-foreground">Example:</span> You forget to add Project #3 to the calendar. Your supervisor doesn't see it on the schedule. The client calls on the scheduled start date asking where your crew is. Embarrassing scramble ensues—you send whoever's available, not the optimal crew. Client perceives you as disorganized.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Creating a project with date range + assigned employees automatically populates calendar entries. Color-coded project bars show scheduling conflicts instantly. Drag-and-drop editing syncs back to project assignments in real-time.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Zero redundant data entry. Impossible to forget calendar entries. Schedule automatically reflects project reality. <strong>5-10 hours/week saved.</strong> No more "Oh no, I forgot to schedule that" emergencies.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-5" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium" style={{ fontFamily: "Outfit, sans-serif", fontSize: "18px" }}>I'm guessing which techs are available next week</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>
                    <p>You need to quote a new project starting Monday. You think Tommy is finishing Tower A on Friday, but you're not certain. Sarah might be on vacation? You're not sure if you have enough crew capacity, so you either: (A) Decline the work (lost revenue) or (B) Commit and hope (risk overcommitting and disappointing clients).</p>
                    <p><span className="font-medium text-foreground">Example:</span> You confidently quote a project for next week, then realize you double-booked Tommy on two simultaneous jobs 40 km apart. You either pull him off one project (angry client A) or scramble to find last-minute coverage at premium rates (angry client B + unexpected labor costs).</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Calendar view with employee availability filters, color-coded project bars spanning multiple days, and automatic conflict detection. System flags when techs are double-booked or when projects lack assigned crew. "Tommy: Available Dec 10-15, Assigned Dec 16-20, Vacation Dec 21-23."</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Confidently commit to new work based on real availability. Optimize crew utilization (eliminate idle time). <strong>Prevent double-booking disasters that cost $2,000-$5,000 in emergency coverage.</strong></p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-6" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium" style={{ fontFamily: "Outfit, sans-serif", fontSize: "18px" }}>I have no idea how long this type of job should take</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>
                    <p>A client asks you to quote a 15-story window wash. How many days? How many techs? You completed a similar job six months ago, but you can't remember if it took 9 days or 14 days. You can't find your notes. You guess conservatively (overbid, lose contract) or aggressively (underbid, lose money).</p>
                    <p><span className="font-medium text-foreground">Example:</span> You quote 12 days for a building wash based on gut feel. Historical data would have shown you averaged 8 days for similar buildings (4.2 drops/day average). You overbid by 50%—client goes with competitor. You leave $18,000 on the table.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Searchable project archive with filters (date range, building type, job type, completion status). Analytics dashboard showing average drops/day by job type, labor hours per elevation, and project duration trends. "Similar Projects: 15-20 story window washes averaged 9.3 days, 2.4 techs, 4.1 drops/day."</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Data-driven quoting (<strong>15-20% more accurate pricing</strong>). Faster quote preparation (75% time saved—from 45 minutes to 10 minutes). Win more contracts with competitive pricing while protecting margins. <strong>Prevent 3-5 underbids/year = $6,000-$10,000 saved.</strong></p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-7" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium" style={{ fontFamily: "Outfit, sans-serif", fontSize: "18px" }}>My brain is my business—and it's exhausted</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>
                    <p>You're mentally tracking: which projects are behind schedule, who's assigned to which building tomorrow, which clients owe invoices, which technicians are approaching overtime, which buildings need safety documentation, when equipment inspections are due, and resident complaints that need responses.</p>
                    <p>This cognitive overload leads to: forgetting important details, making errors under pressure, burnout and decision fatigue, and inability to take vacation (business collapses without your mental database).</p>
                    <p><span className="font-medium text-foreground">Example:</span> You wake up at 3 AM wondering if you remembered to schedule Tommy for the Tower B project starting tomorrow. You check your phone. You didn't. You can't fall back asleep. This happens 3x per week. Your partner is frustrated. Your health suffers.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Unified system externalizes your mental database. Projects, schedules, payroll, safety docs, and client communications live in one place with automated reminders for critical tasks. "Tommy scheduled Tower B Dec 5-8" + "COI expires Dec 12—renew now" + "Unit 507 feedback awaiting response (2 days)."</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> <strong>Psychological load reduced by 60-70%.</strong> Mental bandwidth freed for strategic thinking (business growth, marketing, relationship building—not firefighting). Confidence to delegate operations to supervisors. Ability to take actual vacations without midnight panic attacks. Better sleep. Happier family.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-8" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium" style={{ fontFamily: "Outfit, sans-serif", fontSize: "18px" }}>Building managers call me constantly asking "How's it going?"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>
                    <p>Your building manager client has no visibility into project progress. They're fielding resident questions ("When will you finish my elevation?") and have no answers. They call/text you 5-10 times per week asking for updates. You spend <strong>3-4 hours per week</strong> on status calls instead of productive work—and you still sound vague because you don't have instant access to current progress either.</p>
                    <p><span className="font-medium text-foreground">Example:</span> Building manager calls Tuesday morning: "Mrs. Johnson in Unit 802 wants to know when you'll finish her elevation. She's having family visit this weekend." You don't have the answer immediately—you're at another job site. You have to check with your crew, call back later. Building manager perceives you as disorganized. Mrs. Johnson complains to strata council. Relationship strained.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Building manager portal with identical visibility to your internal dashboard. They log in anytime, see real-time progress by elevation, review before/after photo galleries, check upcoming schedules, and download safety documentation—without calling you. "South Elevation: 73% complete. Expected completion: Dec 8. View 47 progress photos."</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Status call volume drops 80% (from 8 calls/week to 1-2). Building managers perceive you as tech-savvy and professional—"most organized contractor we work with." <strong>Stronger client relationships. 15-25% higher contract renewal rates.</strong> Referrals to other buildings they manage.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Additional Problems Solved - Consolidated */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-medium" style={{ fontFamily: "Outfit, sans-serif", fontSize: "18px" }}>Additional Problems Solved</h3>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4 space-y-2">
                  <p className="font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>Inconsistent Project Tracking</p>
                  <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif" }}>Manual progress tracking leads to guesswork and outdated information. OnRopePro provides automatic, real-time progress measurement based on work session entries. Everyone sees the same accurate data.</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4 space-y-2">
                  <p className="font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>Missing Project Schedules</p>
                  <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif" }}>Without calendar integration, project timelines exist only in your head or scattered across multiple tools. OnRopePro automatically generates visual schedules showing project duration, crew assignments, and conflicts.</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4 space-y-2">
                  <p className="font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>Disconnected Safety Documentation</p>
                  <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif" }}>Safety docs, schedules, and worker assignments scattered across emails, Google Drive, and paper files. OnRopePro links all safety documentation (Rope Access Plans, Toolbox Meetings, Anchor Inspections) directly to the relevant project.</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4 space-y-2">
                  <p className="font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>Manual Payroll Data Entry</p>
                  <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif" }}>Technicians log work sessions with project-specific tracking (drops, hours, units). This data automatically feeds payroll calculations—no manual timesheet transcription. <strong>Eliminates 87-93% of payroll errors.</strong></p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
            <Grid3X3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Job Types and Their Tracking Methods
          </h2>
          <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>The platform supports multiple job types, each optimized for specific building maintenance work:</p>

          <div className="space-y-3">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600">Drop-Based</Badge>
                  <CardTitle className="text-base">Elevation Tracking Jobs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">Progress is tracked by counting "drops" (vertical passes down the building) for each compass direction.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="material-icons text-blue-600 text-lg">window</span>
                    <div>
                      <p className="font-medium text-xs">Window Cleaning</p>
                      <p className="text-xs text-muted-foreground">High-rise windows</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Wind className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-xs">Ext. Dryer Vent</p>
                      <p className="text-xs text-muted-foreground">Exterior cleaning</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-xs">Building Wash</p>
                      <p className="text-xs text-muted-foreground">Pressure washing</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                  <p className="font-semibold text-xs mb-2">How Drop Tracking Works:</p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white dark:bg-blue-900 p-2 rounded">
                      <Compass className="w-4 h-4 mx-auto mb-1" />
                      <p className="text-xs font-bold">North</p>
                      <p className="text-xs text-muted-foreground">12 drops</p>
                    </div>
                    <div className="bg-white dark:bg-blue-900 p-2 rounded">
                      <Compass className="w-4 h-4 mx-auto mb-1 rotate-90" />
                      <p className="text-xs font-bold">East</p>
                      <p className="text-xs text-muted-foreground">8 drops</p>
                    </div>
                    <div className="bg-white dark:bg-blue-900 p-2 rounded">
                      <Compass className="w-4 h-4 mx-auto mb-1 rotate-180" />
                      <p className="text-xs font-bold">South</p>
                      <p className="text-xs text-muted-foreground">12 drops</p>
                    </div>
                    <div className="bg-white dark:bg-blue-900 p-2 rounded">
                      <Compass className="w-4 h-4 mx-auto mb-1 -rotate-90" />
                      <p className="text-xs font-bold">West</p>
                      <p className="text-xs text-muted-foreground">8 drops</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Total project scope: 40 drops. Daily target: 10 drops.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">Hours-Based</Badge>
                  <CardTitle className="text-base">Time Tracking Jobs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">Progress is tracked by hours worked plus a manual completion percentage entered at the end of each session.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Droplets className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-medium text-xs">Gen. Pressure Wash</p>
                      <p className="text-xs text-muted-foreground">Ground-level work</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="material-icons text-green-600 text-lg">storefront</span>
                    <div>
                      <p className="font-medium text-xs">Ground Windows</p>
                      <p className="text-xs text-muted-foreground">Low-rise cleaning</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Paintbrush className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-medium text-xs">Painting</p>
                      <p className="text-xs text-muted-foreground">Coating services</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                  <p className="font-semibold text-xs mb-2">End-of-Day Prompt:</p>
                  <p className="text-xs">"How much of the job did you complete today?" Worker enters 0-100%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-600">Unit-Based</Badge>
                  <CardTitle className="text-base">Unit/Stall Tracking Jobs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">Progress is tracked by counting individual units (suites) or stalls completed each day.</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <HomeIcon className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="font-medium text-xs">In-Suite Dryer Vent</p>
                      <p className="text-xs text-muted-foreground">Per-unit service</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Car className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="font-medium text-xs">Parkade Cleaning</p>
                      <p className="text-xs text-muted-foreground">Per-stall tracking</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded">
                  <p className="font-semibold text-xs">Configuration:</p>
                  <p className="text-xs">Set total units/stalls and daily target. Progress = Completed / Total.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-violet-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-violet-600">Custom</Badge>
                  <CardTitle className="text-base">Custom Job Types</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">Create company-specific job types for specialized work. Custom types are saved and reusable.</p>
                
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <MoreHorizontal className="w-4 h-4 text-violet-600" />
                  <div>
                    <p className="font-medium text-xs">Other / Custom</p>
                    <p className="text-xs text-muted-foreground">You define the name and tracking method</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
            <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
            Creating a New Project
          </h2>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle>Step-by-Step Project Creation</CardTitle>
                <Badge variant="outline">Requires: Company or Ops Manager</Badge>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <strong>Navigate to Dashboard</strong>
                  <p className="text-muted-foreground ml-5">Click "New Project" button in the Projects section</p>
                </li>
                <li>
                  <strong>Select Job Type</strong>
                  <p className="text-muted-foreground ml-5">Choose from the visual grid of job type icons. This determines how progress will be tracked.</p>
                </li>
                <li>
                  <strong>Enter Building Details</strong>
                  <p className="text-muted-foreground ml-5">Building name, address, strata plan number (optional)</p>
                </li>
                <li>
                  <strong>Configure Job-Specific Settings</strong>
                  <p className="text-muted-foreground ml-5">
                    For drop-based: Total drops per elevation, daily target<br />
                    For hours-based: Estimated total hours<br />
                    For unit-based: Total units/stalls, daily target
                  </p>
                </li>
                <li>
                  <strong>Set Schedule (Optional)</strong>
                  <p className="text-muted-foreground ml-5">Start date, end date, target completion date. This creates a calendar entry automatically.</p>
                </li>
                <li>
                  <strong>Assign Employees (Optional)</strong>
                  <p className="text-muted-foreground ml-5">Pre-assign specific employees to this project</p>
                </li>
              </ol>

              <div className="bg-muted p-3 rounded">
                <p className="font-semibold text-xs flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Auto-Scheduling
                </p>
                <p className="text-xs mt-1">When you provide start and end dates during project creation, the system automatically creates a scheduled job entry that appears on the company calendar.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Progress Tracking Deep Dive
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-2 border-blue-200 dark:border-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  Drop-Based Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded space-y-2">
                  <p className="font-semibold text-xs">Calculation:</p>
                  <p className="font-mono text-xs">
                    Progress = (N + E + S + W completed) / (N + E + S + W total)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-semibold text-xs">Key Features:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Track which elevations are complete</li>
                    <li>Daily drop target with shortfall tracking</li>
                    <li>Visual progress bars per elevation</li>
                    <li>Automatic percentage calculation</li>
                  </ul>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950 p-2 rounded text-xs">
                  <p className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <strong>Shortfall Reason:</strong> Required if daily drops are below target
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  Hours-Based Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded space-y-2">
                  <p className="font-semibold text-xs">Calculation:</p>
                  <p className="font-mono text-xs">
                    Progress = Manual percentage entered by worker
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-semibold text-xs">Key Features:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Worker estimates completion at end of day</li>
                    <li>Hours tracked for payroll</li>
                    <li>No drop counts needed</li>
                    <li>Simple 0-100% input</li>
                  </ul>
                </div>

                <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-xs">
                  <p><strong>Best for:</strong> Jobs where counting units doesn't make sense</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
            <Settings className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Special Project Features
          </h2>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="material-icons text-amber-600 text-lg">attach_money</span>
                  Peace Work Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">When enabled, workers are paid per drop instead of hourly. Payment is calculated as:</p>
                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded text-center">
                  <p className="font-mono font-bold">Session Pay = Drops Completed x Price Per Drop</p>
                </div>
                <p className="text-xs text-muted-foreground">This mode is useful for incentivizing productivity and works automatically with payroll calculations.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Employee Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">Projects can have employees pre-assigned. This affects:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Which projects appear on an employee's dashboard</li>
                  <li>Calendar scheduling and resource allocation</li>
                  <li>Active workers tracking visibility</li>
                </ul>
                <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded text-xs">
                  <strong>Note:</strong> Unassigned employees can still clock into any active project if they have general access.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Project Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif" }}>Each project can store multiple documents:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-muted rounded text-xs">
                    <p className="font-semibold">Rope Access Plan</p>
                    <p className="text-muted-foreground">Site-specific safety and rigging plan</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-xs">
                    <p className="font-semibold">Anchor Inspection</p>
                    <p className="text-muted-foreground">Engineer-certified anchor point reports</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-xs">
                    <p className="font-semibold">Toolbox Meeting</p>
                    <p className="text-muted-foreground">Daily safety briefing documentation</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-xs">
                    <p className="font-semibold">Site Photos</p>
                    <p className="text-muted-foreground">Before/after images, progress shots</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-xs">
                    <p className="font-semibold">Contracts & Work Orders</p>
                    <p className="text-muted-foreground">Signed agreements with clients</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-xs">
                    <p className="font-semibold">Risk Assessments</p>
                    <p className="text-muted-foreground">Site-specific hazard analysis</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-xs">
                    <p className="font-semibold">Building Access Info</p>
                    <p className="text-muted-foreground">Security codes, key procedures, contacts</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-xs">
                    <p className="font-semibold">Permits & Approvals</p>
                    <p className="text-muted-foreground">City permits, strata approvals</p>
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground mt-3" style={{ fontFamily: "Outfit, sans-serif" }}>
                  <p><strong>Note:</strong> Certificate of Insurance (COI) is managed at the company level in the Compliance module, not per-project. Building managers can view your company COI through their portal.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            Project Lifecycle
          </h2>

          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
            <div className="flex flex-col items-center min-w-[100px]">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs font-semibold">Created</p>
              <p className="text-xs text-muted-foreground text-center">Project setup</p>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col items-center min-w-[100px]">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs font-semibold">Active</p>
              <p className="text-xs text-muted-foreground text-center">Work in progress</p>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col items-center min-w-[100px]">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-2">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-xs font-semibold">Tracking</p>
              <p className="text-xs text-muted-foreground text-center">Sessions logged</p>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col items-center min-w-[100px]">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs font-semibold">Completed</p>
              <p className="text-xs text-muted-foreground text-center">Marked done</p>
            </div>
          </div>

          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-4 text-sm text-amber-900 dark:text-amber-100">
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                Soft Delete
              </p>
              <p className="mt-1">Projects are never permanently deleted. When "deleted", they are marked with a flag and hidden from normal views but preserved for historical reporting and audit purposes.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Calendar Integration
          </h2>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px" }}>Projects with start and end dates automatically appear on the company calendar. The system supports:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Visual Features:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground" style={{ fontFamily: "Outfit, sans-serif", fontSize: "14px" }}>
                    <li>Color-coded project bars</li>
                    <li>Multi-day span visualization</li>
                    <li>Employee assignment indicators</li>
                    <li>Conflict detection highlighting</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Scheduling Actions:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground" style={{ fontFamily: "Outfit, sans-serif", fontSize: "14px" }}>
                    <li>Drag-and-drop date changes</li>
                    <li>Click to view project details</li>
                    <li>Filter by job type or employee</li>
                    <li>Week/month/timeline views</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Quick Reference: Project Fields by Job Type
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left font-semibold">Field</th>
                  <th className="p-3 text-center font-semibold">Drop-Based</th>
                  <th className="p-3 text-center font-semibold">Hours-Based</th>
                  <th className="p-3 text-center font-semibold">Unit-Based</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3">Total Drops (N/E/S/W)</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center">-</td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3">Daily Drop Target</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center">-</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">Estimated Hours</td>
                  <td className="p-3 text-center">Optional</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center">Optional</td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3">Total Units/Stalls</td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">Units Per Day</td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3">Peace Work Option</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="pt-8">
          <Button 
            onClick={() => navigate("/changelog")}
            variant="outline"
            className="w-full"
            data-testid="button-back-to-changelog"
          >
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Knowledge Base
          </Button>
        </div>
      </main>
      </div>
    </ChangelogLayout>
  );
}
