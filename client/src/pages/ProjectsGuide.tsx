import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
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
import { useLocation } from "wouter";

export default function ProjectsGuide() {
  const [, navigate] = useLocation();
  return (
    <ChangelogGuideLayout 
      title="Project Management Guide"
      version="2.0"
      lastUpdated="December 5, 2025"
    >
      <div className="space-y-8">
        
        <section className="space-y-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2 mb-2">
              <FolderOpen className="w-6 h-6 text-action-600 dark:text-action-400" />
              Project Management Overview
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              Projects represent individual building maintenance jobs. Each project tracks a specific type of work at a specific location, with progress measured differently depending on the job type. Projects are the central hub connecting <strong>employees, scheduling, safety documentation, and financial tracking</strong>.
            </p>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Key className="w-5 h-5" />
                The Golden Rule: Job Type Determines Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Progress Method = f(Job Type)
                </p>
              </div>
              
              <div className="space-y-2 text-base">
                <p><strong>Key Principles:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Drop-based</strong>: Count "drops" (vertical passes) per building elevation. Used for window cleaning, building wash, facade work.</li>
                  <li><strong>Hours-based</strong>: Track time spent with manual completion percentage. Used for general maintenance, repairs, investigative work.</li>
                  <li><strong>Unit-based</strong>: Count individual units (suites) or stalls completed. Used for in-suite services, parkade cleaning.</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Why This Matters
                </p>
                <p className="mt-1">The form you see when ending a work session changes based on job type. Drop-based jobs ask for N/E/S/W drop counts. Hours-based jobs ask for completion percentage. The system adapts to each work type, ensuring accurate progress tracking and payroll calculation.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Job Types Visual Grid */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-action-600 dark:text-action-400" />
            Supported Job Types
          </h2>
          
          <div className="grid md:grid-cols-3 gap-3">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <AppWindow className="w-5 h-5 text-action-600 dark:text-action-400" />
                  </div>
                  <div>
                    <p className="font-medium">Window Cleaning</p>
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
                    <p className="font-medium">Dryer Vent Cleaning</p>
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
                    <p className="font-medium">Building Wash</p>
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
                    <p className="font-medium">Parkade Cleaning</p>
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
                    <p className="font-medium">Inspection</p>
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
                    <p className="font-medium">Repairs</p>
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
                  <p className="font-medium">Custom Job Types</p>
                  <p className="text-xs text-muted-foreground">Create and save custom job types with icons for reuse across projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Directional Drop Tracking Visual */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Directional Drop Tracking
          </h2>
          
          <Card className="border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950">
            <CardContent className="pt-6 text-emerald-900 dark:text-emerald-100">
              <p className="mb-4">Track progress on each side of a building independently:</p>
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
              <p className="text-sm mt-4">Each direction tracks its own drop count, completion status, and assigned crew members. This allows precise scheduling when different elevations have different access requirements or completion timelines.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Problems Solved */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Problems Solved</h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              Real challenges addressed by OnRopePro's Project Management module.
            </p>
          </div>

          {/* Company Owners Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Rope Access Company Owners</h3>
            </div>
            
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="owner-1" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">I have no idea where my 6 active projects actually stand</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You're juggling window washing at Tower A, caulking at Building B, and anchor inspections at Complex C. When a client calls asking for a status update, you're guessing based on what you remember from yesterday's phone call with your supervisor. You drive site-to-site taking notes, wasting 10-15 hours per week just figuring out what's happening.</p>
                    <p><span className="font-medium text-foreground">Example:</span> You bid a new project for next week, but you're not sure if your current jobs will finish on time. You don't know if Tommy is overloaded or if Sarah has capacity. You commit anyway and hope it works out—then discover you've double-booked your best crew.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Real-time dashboard showing every project's progress percentage, days remaining, assigned crew, and completion forecast. Filter by status, building, or technician. Updates automatically as work sessions are logged.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Instant oversight without site visits. Confidently quote new work based on real crew availability. Make data-driven prioritization decisions in seconds, not hours.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">One tech is crushing it while another coasts—and I can't prove it</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>Your gut says Tommy completes 5 drops per day while another employee barely does 1, but they work the same hours. Without hard data, you can't have the coaching conversation. You suspect someone's on their phone half the day, but proving it means physical surveillance—awkward and time-consuming.</p>
                    <p><span className="font-medium text-foreground">Example:</span> Two techs worked the same 8-hour shift at the same building. Your client complains progress is slow. You pay both techs full wages, but you're only getting one tech's worth of productivity. The high performer feels demoralized; the underperformer coasts undetected.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Per-employee performance tracking showing drops/units completed per shift, target achievement rates (e.g., "Meeting target 87% of time"), and historical trends. Outlier detection automatically flags significant deviations from team averages.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Objective performance data for coaching conversations. High performers feel recognized (lower turnover). Underperformers either improve or self-select out. Clients see 20-30% faster project completion.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Residents bombard the property manager with status questions</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>The property manager receives 15-30 status calls per week during your project. Residents assume the worst because they have no visibility. The property manager becomes frustrated playing telephone between you and 40 units. Your professional reputation suffers even though your crew is working efficiently.</p>
                    <p><span className="font-medium text-foreground">Example:</span> Unit 402 has a birthday party on Sunday and demands you not work near their windows that day. The property manager calls you at 8 PM on Friday with this restriction. You scramble to reschedule your crew, move equipment, and adjust the timeline—2 hours of chaos that could have been avoided.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Resident-facing portal showing real-time progress (4-elevation visual system), upcoming work schedules ("We'll be near your unit Wednesday 9am-3pm"), photo galleries of completed work, and expected completion dates. Residents submit feedback directly without property manager middleman.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Property manager time saved (20+ hours/month per active project). Resident complaints drop 60-70%. Your company looks professional and transparent. Contract renewals increase 15-25%. Building managers refer you to other properties.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-4" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">I create a project, then manually re-enter everything into my calendar</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You win a new contract. You create the project in your system (or Excel). Then you open Google Calendar and manually block off dates. Then you text your supervisor the crew assignments. Then you update your whiteboard. Same information, four different places, wasting 30-45 minutes per project.</p>
                    <p><span className="font-medium text-foreground">Example:</span> You forget to add Project #3 to the calendar. Your supervisor doesn't see it on the schedule. The client calls on the scheduled start date asking where your crew is. Embarrassing scramble ensues—you send whoever's available, not the optimal crew. Client perceives you as disorganized.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Creating a project with date range + assigned employees automatically populates calendar entries. Color-coded project bars show scheduling conflicts instantly. Drag-and-drop editing syncs back to project assignments in real-time.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Zero redundant data entry. Impossible to forget calendar entries. Schedule automatically reflects project reality. <strong>5-10 hours/week saved.</strong> No more "Oh no, I forgot to schedule that" emergencies.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-5" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">I'm guessing which techs are available next week</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You need to quote a new project starting Monday. You think Tommy is finishing Tower A on Friday, but you're not certain. Sarah might be on vacation? You're not sure if you have enough crew capacity, so you either: (A) Decline the work (lost revenue) or (B) Commit and hope (risk overcommitting and disappointing clients).</p>
                    <p><span className="font-medium text-foreground">Example:</span> You confidently quote a project for next week, then realize you double-booked Tommy on two simultaneous jobs 40 km apart. You either pull him off one project (angry client A) or scramble to find last-minute coverage at premium rates (angry client B + unexpected labor costs).</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Calendar view with employee availability filters, color-coded project bars spanning multiple days, and automatic conflict detection. System flags when techs are double-booked or when projects lack assigned crew. "Tommy: Available Dec 10-15, Assigned Dec 16-20, Vacation Dec 21-23."</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Confidently commit to new work based on real availability. Optimize crew utilization (eliminate idle time). <strong>Prevent double-booking disasters that cost $2,000-$5,000 in emergency coverage.</strong></p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-6" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">I have no idea how long this type of job should take</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>A client asks you to quote a 15-story window wash. How many days? How many techs? You completed a similar job six months ago, but you can't remember if it took 9 days or 14 days. You can't find your notes. You guess conservatively (overbid, lose contract) or aggressively (underbid, lose money).</p>
                    <p><span className="font-medium text-foreground">Example:</span> You quote 12 days for a building wash based on gut feel. Historical data would have shown you averaged 8 days for similar buildings (4.2 drops/day average). You overbid by 50%—client goes with competitor. You leave $18,000 on the table.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Searchable project archive with filters (date range, building type, job type, completion status). Analytics dashboard showing average drops/day by job type, labor hours per elevation, and project duration trends. "Similar Projects: 15-20 story window washes averaged 9.3 days, 2.4 techs, 4.1 drops/day."</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Data-driven quoting (<strong>15-20% more accurate pricing</strong>). Faster quote preparation (75% time saved—from 45 minutes to 10 minutes). Win more contracts with competitive pricing while protecting margins. <strong>Prevent 3-5 underbids/year = $6,000-$10,000 saved.</strong></p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-7" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">My brain is my business—and it's exhausted</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
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
                  <span className="text-left font-medium text-base">Building managers call me constantly asking "How's it going?"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
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
              <h3 className="text-xl md:text-2xl font-semibold">Additional Problems Solved</h3>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-4 space-y-2">
                  <p className="font-medium">Inconsistent Project Tracking</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Manual progress tracking leads to guesswork and outdated information. OnRopePro provides automatic, real-time progress measurement based on work session entries. Everyone sees the same accurate data.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4 space-y-2">
                  <p className="font-medium">Missing Project Schedules</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Without calendar integration, project timelines exist only in your head or scattered across multiple tools. OnRopePro automatically generates visual schedules showing project duration, crew assignments, and conflicts.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4 space-y-2">
                  <p className="font-medium">Disconnected Safety Documentation</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Safety docs, schedules, and worker assignments scattered across emails, Google Drive, and paper files. OnRopePro links all safety documentation (Rope Access Plans, Toolbox Meetings, Anchor Inspections) directly to the relevant project.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4 space-y-2">
                  <p className="font-medium">Manual Payroll Data Entry</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Technicians log work sessions with project-specific tracking (drops, hours, units). This data automatically feeds payroll calculations—no manual timesheet transcription. <strong>Eliminates 87-93% of payroll errors.</strong></p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Job Types and Their Tracking Methods
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base">The platform supports multiple job types, each optimized for specific building maintenance work:</p>

          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-action-600">Drop-Based</Badge>
                  <CardTitle className="text-base">Elevation Tracking Jobs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <p className="text-muted-foreground">Progress is tracked by counting "drops" (vertical passes down the building) for each compass direction.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="material-icons text-action-600 text-lg">window</span>
                    <div>
                      <p className="font-medium text-xs">Window Cleaning</p>
                      <p className="text-xs text-muted-foreground">High-rise windows</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Wind className="w-4 h-4 text-action-600" />
                    <div>
                      <p className="font-medium text-xs">Ext. Dryer Vent</p>
                      <p className="text-xs text-muted-foreground">Exterior cleaning</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Droplets className="w-4 h-4 text-action-600" />
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

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">Hours-Based</Badge>
                  <CardTitle className="text-base">Time Tracking Jobs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
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

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-600">Unit-Based</Badge>
                  <CardTitle className="text-base">Unit/Stall Tracking Jobs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
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

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-violet-600">Custom</Badge>
                  <CardTitle className="text-base">Custom Job Types</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
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
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
            Creating a New Project
          </h2>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <CardTitle>Step-by-Step Project Creation</CardTitle>
                <Badge variant="outline">Requires: Company or Ops Manager</Badge>
              </div>
            </CardHeader>
            <CardContent className="text-base space-y-4">
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
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-action-600 dark:text-action-400" />
            Progress Tracking Deep Dive
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-2 border-blue-200 dark:border-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Compass className="w-4 h-4 text-action-600" />
                  Drop-Based Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded space-y-2">
                  <p className="font-semibold text-xs">Example Calculation:</p>
                  <div className="text-xs space-y-1">
                    <p>North: 8/12 drops = 67%</p>
                    <p>East: 6/8 drops = 75%</p>
                    <p>South: 4/12 drops = 33%</p>
                    <p>West: 8/8 drops = 100%</p>
                  </div>
                  <div className="border-t pt-2">
                    <p className="font-bold text-xs">Overall: 26/40 drops = 65%</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">Progress is weighted by the total drops on each elevation. Larger elevations contribute more to overall percentage.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  Hours-Based Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded space-y-2">
                  <p className="font-semibold text-xs">End-of-Session Entry:</p>
                  <div className="text-xs space-y-1">
                    <p>Hours worked: 6.5 hours</p>
                    <p>Completion estimate: 45%</p>
                  </div>
                  <div className="border-t pt-2">
                    <p className="font-bold text-xs">Project: 45% complete</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">Worker manually enters completion percentage. Hours are tracked for payroll but don't determine progress.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 dark:border-amber-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <HomeIcon className="w-4 h-4 text-amber-600" />
                  Unit-Based Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded space-y-2">
                  <p className="font-semibold text-xs">Example: Dryer Vent Cleaning</p>
                  <div className="text-xs space-y-1">
                    <p>Total suites: 120</p>
                    <p>Completed today: 15</p>
                    <p>Cumulative: 45 suites</p>
                  </div>
                  <div className="border-t pt-2">
                    <p className="font-bold text-xs">Progress: 45/120 = 37.5%</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">Simple count-based tracking. Daily target helps measure productivity.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-violet-200 dark:border-violet-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-violet-600" />
                  Target Achievement
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="bg-violet-50 dark:bg-violet-950 p-3 rounded space-y-2">
                  <p className="font-semibold text-xs">Performance Tracking:</p>
                  <div className="text-xs space-y-1">
                    <p>Daily target: 10 drops</p>
                    <p>Actual: 12 drops</p>
                    <p>Achievement: 120%</p>
                  </div>
                  <div className="border-t pt-2">
                    <p className="font-bold text-xs">Status: Above Target</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">Targets help identify high performers and flag when projects are falling behind schedule.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-action-600 dark:text-action-400" />
            Calendar Integration
          </h2>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-action-600" />
                    Automatic Scheduling
                  </h4>
                  <p className="text-base text-muted-foreground">When you create a project with start/end dates, it automatically appears on the company calendar as a colored bar spanning those days.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-action-600" />
                    Crew Visibility
                  </h4>
                  <p className="text-base text-muted-foreground">Assigned employees see their scheduled projects on their personal calendar view. No more texting to ask "Where am I working tomorrow?"</p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Calendar Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    Multi-day project bars with color coding by job type
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    Filter by employee to see individual workload
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    Drag-and-drop rescheduling (coming soon)
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    Conflict detection when employees are double-booked
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-action-600 dark:text-action-400" />
            Linked Documentation
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Safety Documents</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground space-y-2">
                <p>Each project can have linked safety documentation:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Rope Access Plans (RAP)</li>
                  <li>Job Safety Analyses (JSA)</li>
                  <li>Toolbox Meeting records</li>
                  <li>Anchor inspection reports</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Work Session Logs</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground space-y-2">
                <p>Complete history of work performed:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Date, time, duration of each session</li>
                  <li>Employee who performed the work</li>
                  <li>Progress recorded (drops, percentage, units)</li>
                  <li>Notes and observations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-action-600 dark:text-action-400" />
            Project Settings & Management
          </h2>

          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Status Transitions</CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">Draft</Badge>
                  <ArrowRight className="w-4 h-4" />
                  <Badge className="bg-action-600">Active</Badge>
                  <ArrowRight className="w-4 h-4" />
                  <Badge className="bg-amber-600">On Hold</Badge>
                  <span className="text-muted-foreground">or</span>
                  <Badge className="bg-green-600">Completed</Badge>
                  <ArrowRight className="w-4 h-4" />
                  <Badge variant="secondary">Archived</Badge>
                </div>
                <p className="text-muted-foreground mt-3">Projects can be paused (On Hold) for weather, client requests, or scheduling conflicts. Completed projects are automatically archived after 30 days.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Editing Projects</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                <p>After creation, you can modify:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Schedule dates (affects calendar)</li>
                  <li>Assigned employees</li>
                  <li>Targets and scope (drops, hours, units)</li>
                  <li>Building details</li>
                </ul>
                <p className="mt-2">Note: Changing job type after work has been logged is not recommended as it changes how progress is calculated.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Soft Delete
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                <p>Deleted projects are soft-deleted (marked as inactive) rather than permanently removed. This preserves historical data for reporting and payroll. Admins can restore accidentally deleted projects.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-action-600 dark:text-action-400" />
            Project Archive & Analytics
          </h2>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground">Completed projects are automatically archived but remain searchable for future reference and analytics.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Search & Filter</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>By building name or address</li>
                    <li>By job type</li>
                    <li>By date range</li>
                    <li>By assigned employees</li>
                    <li>By completion status</li>
                  </ul>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Analytics</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Average drops/day by job type</li>
                    <li>Employee productivity comparisons</li>
                    <li>Project duration trends</li>
                    <li>Target achievement rates</li>
                    <li>Labor hours per building type</li>
                  </ul>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-action-50 dark:bg-action-950">
                <p className="font-semibold flex items-center gap-2 text-action-900 dark:text-action-100">
                  <Brain className="w-4 h-4" />
                  Historical Data = Better Quotes
                </p>
                <p className="text-sm mt-2 text-action-900 dark:text-action-100">Use archived project data to estimate future jobs more accurately. "Last time we did a 20-story window wash, it took 14 days with 2 techs averaging 8 drops/day."</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Eye className="w-5 h-5 text-action-600 dark:text-action-400" />
            Resident & Building Manager Portal
          </h2>

          <Card className="border-2 border-action-500">
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground">Building managers and residents can access a read-only view of project progress without needing to log in to the main system.</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-action-600" />
                  <p className="font-semibold">Live Progress</p>
                  <p className="text-base text-muted-foreground">4-direction completion visualization</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-action-600" />
                  <p className="font-semibold">Schedule View</p>
                  <p className="text-base text-muted-foreground">Upcoming work dates</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-action-600" />
                  <p className="font-semibold">Feedback</p>
                  <p className="text-base text-muted-foreground">Submit comments directly</p>
                </div>
              </div>

              <p className="text-base text-muted-foreground">This transparency reduces status calls by 80% and improves client satisfaction scores significantly.</p>
            </CardContent>
          </Card>
        </section>

        <div className="pt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">Need help with project management?</p>
          <Button onClick={() => navigate("/changelog")}>
            View All Documentation
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

      </div>
    </ChangelogGuideLayout>
  );
}
