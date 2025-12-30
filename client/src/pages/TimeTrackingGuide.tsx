import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocation } from "wouter";
import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  Clock,
  Play,
  Square,
  MapPin,
  Calendar,
  Timer,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  Users,
  BarChart3,
  FileText,
  ChevronRight,
  Shield,
  Compass,
  Target,
  Calculator,
  ClipboardCheck,
  Smartphone,
  Key,
  HardHat,
  Layers,
  ChevronsUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ALL_ACCORDION_ITEMS = [
  "owner-1", "owner-2", "owner-3", "owner-4", "owner-5", "owner-6", "owner-7",
  "tech-1", "tech-2",
  "ops-1", "ops-2"
];

export default function TimeTrackingGuide() {
  const [, navigate] = useLocation();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const allExpanded = openItems.length === ALL_ACCORDION_ITEMS.length;

  const toggleAll = () => {
    setOpenItems(allExpanded ? [] : [...ALL_ACCORDION_ITEMS]);
  };

  return (
    <ChangelogGuideLayout 
      title="Work Session & Time Tracking Guide"
      version="2.1"
      lastUpdated="December 10, 2025"
    >
      <div className="space-y-8">
        
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            Work sessions are the core time tracking mechanism. When an employee "starts their day" on a project, the system records their start time, location, and links the session to both the project and their payroll. At the end of the day, they log their work output and the session closes.
          </p>
        </section>

        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Key className="w-5 h-5" />
                The Golden Rule: Inspection Before Work
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Harness Inspection Required Before Clock-In
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>When an employee clicks "Start Day", they see three options:</strong></p>
                <div className="space-y-2 ml-2 mt-2">
                  <div className="flex items-start gap-2">
                    <Badge variant="default" className="shrink-0 mt-0.5">Yes</Badge>
                    <span>Confirms inspection is complete. Proceeds to start work session.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="destructive" className="shrink-0 mt-0.5">No</Badge>
                    <span>Redirected to complete harness inspection form first.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0 mt-0.5 border-amber-600 text-amber-900 dark:text-amber-100">Not Applicable</Badge>
                    <span>For non-rope-access work (ground tasks, office work, equipment transport). Records N/A status and proceeds.</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Honor System with Passive Auditing
                </p>
                <p className="mt-1">Employees can select "Yes" and proceed to work even without a matching inspection record in the database. The system does NOT actively block work sessions. However, the inspection database is checked independently during CSR (Company Safety Rating) calculations. Any discrepancy (claiming "Yes" without a matching inspection record) creates a penalty that affects the company's compliance score visible to property managers. Honest employees build trust. Dishonest answers are passively tracked and penalize the company's safety rating.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Problems Solved */}
        <section className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              Problems Solved
            </h2>
            <Button onClick={toggleAll} variant="outline" data-testid="button-toggle-all-accordions">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          {/* For Company Owners */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <DollarSign className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Company Owners</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="owner-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4">
                  "I suspect some guys are clocking in from their truck before they even get to the building"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> Paper timesheets are easy to fudge. An employee says they started at 8:00 AM, but did they really? You have no way to verify if they were at the job site or still at the coffee shop.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "The GPS pins point them on a map. So you can see that the guy actually clocked in at the building and not at the boss's place half hour earlier. Same for clock out."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> GPS coordinates are captured at both clock-in and clock-out. Location pins confirm employees are at the actual job site, not clocking in from home or a coffee shop.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> GPS-verified timestamps eliminate "phantom hours." Pay only for actual on-site work.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4">
                  "I have no idea how many hours my guys spent driving around versus actually working"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> You pay your crew for 40 hours but have no visibility into how much time they spent on revenue-generating work versus running errands, picking up supplies, or waiting around.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "Go ask Jeff tomorrow. How many hours were the guys driving around, moving gear from one building to another, picking up soap for another guy? No clue. He wouldn't even know."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Non-billable hours are tracked separately with automatic categorization. The dashboard shows your billable vs non-billable ratio by week, month, and year.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Accurate cost of goods sold for every project. Identify and reduce non-productive time.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4">
                  "Every day I'm calling my techs asking where they're at on the building"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> You have 5 projects running and zero visibility into progress. You call each tech individually, they give vague answers, you try to piece together where things stand.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "There is not a day that goes by that Jeff doesn't call one person per project to see where they're at... Probably 90 of his phone calls are with the techs being like, when will you be done?"</p>
                  <p><span className="font-medium text-foreground">Solution:</span> End-of-day forms capture drops completed, completion percentages, and shortfall reasons automatically. Project dashboards show real-time progress without a single phone call.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Eliminate 90% of status-check phone calls. Know instantly if a project is on track or falling behind, and why.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-4" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4">
                  "The building went 20 hours over budget and I don't really know why"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> A project finishes, you're way over labor budget, and you can't reconstruct what happened. Was it weather? Lazy workers? Bad estimate? You move on to the next job never knowing.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "At the end of the building, you're just pissed off because your building went 20 hours over budget and you don't really know why. Move on. Next building."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Every work session logs hours worked, drops completed, and shortfall reasons. Project analytics show exactly where time was spent.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Data-driven post-mortems. Accurate re-quoting for repeat jobs. Stop losing money without understanding why.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-5" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4">
                  "One guy is crushing it while another coasts, and I can't prove it"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> Your gut says Tommy does 5 drops per day while another employee barely does 1. They work the same hours, you pay them the same, but productivity is wildly different.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "Now it's just like, why didn't you do your drops? Well, look on OnRopePro, it's all there, it's all explained. Oh, okay, thanks."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Per-employee performance tracking shows drops completed per shift, target achievement rates, and reasons for shortfalls. Automatic shortfall prompts ensure accountability.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Objective performance data for coaching conversations. High performers feel recognized. Underperformers either improve or self-select out.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-6" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4">
                  "I pay people by the drop but tracking it is a nightmare"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> Some projects use piece work (pay per drop instead of hourly). Tracking this manually means reconciling drop counts with timesheets, calculating compensation, and hoping you didn't miss anything.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "Piece work is... some companies pay per drop. They'll have a budget, let's say $10,000 for a building. They allow $6,000 for the guys. So that $6,000 is spread into drops."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Toggle "Piece Work" on any project and set the price per drop. When employees end their session and enter drops completed, payroll automatically calculates: 3 drops x $70/drop = $210.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Zero manual calculation. Piece work and hourly employees can work the same project. Payroll exports are accurate automatically.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-7" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4">
                  "Payroll takes forever because I'm deciphering texts and timesheets"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> Every pay period, you're collecting timesheets from paper forms, text messages, emails, and memory. Then you're entering it all into payroll manually. The whole process takes 6-10 hours for a 15-person crew.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "Tommy texts 'worked 9.5 hours Tuesday, building was rough.' Sarah's paper timesheet says '8 hours Monday, 10 hours Wednesday.' You have three texts you can't find, one timesheet that's illegible, and Friday's hours aren't submitted yet. Payroll is due in 2 hours."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Work sessions are logged in real-time with automatic overtime calculation. The system tracks regular hours (0-8), overtime hours (8-12), and double-time hours (12+) based on your company's rules.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Payroll processing time reduced by 87-93%. Overtime calculated automatically. Export to your payroll provider in seconds.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Technicians */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <HardHat className="w-5 h-5 text-orange-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Technicians</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="tech-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4">
                  "I forgot to fill out my logbook and now I can't remember what tasks I did"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> IRATA and SPRAT certifications require detailed task logging. You're supposed to log these daily, but life gets busy. Two months later, you're filling out your logbook from memory.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "Your IRATA recertification is in 3 weeks. You open your logbook, last entry was 6 months ago. You've done hundreds of hours of rope work since then. You guess at task breakdowns and hope the assessor doesn't ask detailed questions."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> After ending each work session, you're prompted to log your irata/SPRAT task hours by category (20+ task types available). This data accumulates in your profile.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Accurate certification tracking without daily logbook discipline. Recertification prep takes 30 minutes instead of 3 hours of guessing.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4">
                  "My boss thinks I'm slacking when I legitimately couldn't hit target"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> You're evaluated on drops per day, but some days are impossible. Wind picks up at noon, you lose half the afternoon. Building access gets blocked for 2 hours. Without documentation, it looks like you underperformed.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "I could fix that easily just by adding a bunch of automatic reasons that you can select like weather delays... if one of those are selected, it will not affect their performance."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> When you don't meet your daily target, the system requires a shortfall reason before you can close your session. Certain reasons are "performance-protected" and don't negatively impact your productivity metrics.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Your legitimate challenges are documented, not forgotten. Weather delays don't hurt your performance score.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Operations Managers */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Operations Managers</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="ops-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4">
                  "I have 15 workers across 6 sites and no idea who's where"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> You're managing multiple crews across multiple buildings. Someone calls in sick, someone finishes early, someone hasn't clocked in and you don't know if they're late or just forgot.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "It's 9:15 AM. You see 12 of 15 workers have clocked in. Are the other 3 late? Did they forget to clock in? Are they sick? You start making calls. You just spent 30 minutes on basic attendance."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Real-time Active Workers dashboard shows everyone currently clocked in, which project they're working on, and when they started. Missing workers are immediately visible.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Attendance tracking in seconds, not 30 minutes. Know exactly who's where without phone calls.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ops-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4">
                  "A tech forgot to clock out and now their hours are wrong"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> Employees forget to clock out. They close the app and go home. Next morning, you see a 16-hour work session that's obviously wrong. Now you're playing detective.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "Tommy's session shows 15.5 hours yesterday. He definitely didn't work that long. But the system has him clocked out at 9:30 PM. You call Tommy, he doesn't remember exactly when he left."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Users with financial permissions can edit completed sessions. Adjust start time, end time, drops completed, and billable status. The system automatically recalculates hours breakdown.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Fix clock-out errors in 30 seconds without complicated workarounds. Payroll stays accurate.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Play className="w-5 h-5 text-green-600 dark:text-green-400" />
            Starting a Work Session (Clock In)
          </h2>

          <Card>
            <CardContent className="pt-6 text-base space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="font-semibold">What Happens:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Employee opens project on Dashboard</li>
                    <li>Clicks "Start Day" button</li>
                    <li>System checks for today's harness inspection</li>
                    <li>If passed, GPS location is captured</li>
                    <li>Session record created with start time</li>
                    <li>Employee status changes to "Active"</li>
                  </ol>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold">Data Captured:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Clock className="w-4 h-4 text-action-600" />
                      <div>
                        <p className="font-medium text-xs">Start Time</p>
                        <p className="text-xs text-muted-foreground">Precise timestamp</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <div>
                        <p className="font-medium text-xs">GPS Coordinates</p>
                        <p className="text-xs text-muted-foreground">Latitude & longitude</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="font-medium text-xs">Work Date</p>
                        <p className="text-xs text-muted-foreground">Local date (user's timezone)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                <p className="flex items-center gap-2 font-semibold text-xs">
                  <Smartphone className="w-4 h-4" />
                  Location Permission
                </p>
                <p className="text-xs mt-1 text-muted-foreground">The app requests GPS permission. If denied, the session still starts but location won't be tracked. A warning toast is shown.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Square className="w-5 h-5 text-red-600 dark:text-red-400" />
            Ending a Work Session (Clock Out)
          </h2>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-action-600">Drop-Based Jobs</Badge>
                  <CardTitle className="text-base">End Day Form</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <p className="text-muted-foreground">For window cleaning, building wash, and similar jobs:</p>
                
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-muted p-2 rounded">
                    <Compass className="w-4 h-4 mx-auto mb-1" />
                    <p className="text-xs font-bold">North</p>
                    <p className="text-xs text-muted-foreground">Drops done</p>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <Compass className="w-4 h-4 mx-auto mb-1 rotate-90" />
                    <p className="text-xs font-bold">East</p>
                    <p className="text-xs text-muted-foreground">Drops done</p>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <Compass className="w-4 h-4 mx-auto mb-1 rotate-180" />
                    <p className="text-xs font-bold">South</p>
                    <p className="text-xs text-muted-foreground">Drops done</p>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <Compass className="w-4 h-4 mx-auto mb-1 -rotate-90" />
                    <p className="text-xs font-bold">West</p>
                    <p className="text-xs text-muted-foreground">Drops done</p>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950 p-2 rounded text-sm">
                  <p className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <strong>Shortfall Reason:</strong> If total drops are less than daily target, a reason is required.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">Hours-Based Jobs</Badge>
                  <CardTitle className="text-base">End Day Form</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <p className="text-muted-foreground">For general pressure washing, ground windows, painting:</p>
                
                <div className="bg-muted p-4 rounded text-center">
                  <p className="text-xs text-muted-foreground mb-2">How much of the job did you complete today?</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-20 h-10 bg-white dark:bg-green-900 rounded flex items-center justify-center border">
                      <span className="text-lg font-mono">25</span>
                    </div>
                    <span className="text-lg">%</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">This percentage contributes to overall project completion tracking.</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Data Captured at Clock Out</CardTitle>
            </CardHeader>
            <CardContent className="text-base space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="p-2 bg-muted rounded text-center">
                  <Clock className="w-4 h-4 mx-auto mb-1" />
                  <p className="text-xs font-semibold">End Time</p>
                </div>
                <div className="p-2 bg-muted rounded text-center">
                  <MapPin className="w-4 h-4 mx-auto mb-1" />
                  <p className="text-xs font-semibold">End Location</p>
                </div>
                <div className="p-2 bg-muted rounded text-center">
                  <Target className="w-4 h-4 mx-auto mb-1" />
                  <p className="text-xs font-semibold">Work Output</p>
                </div>
                <div className="p-2 bg-muted rounded text-center">
                  <Calculator className="w-4 h-4 mx-auto mb-1" />
                  <p className="text-xs font-semibold">Hours Calc</p>
                </div>
                <div className="p-2 bg-muted rounded text-center">
                  <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                  <p className="text-xs font-semibold">Performance</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Each completed work session contributes to the employee's performance analytics, tracking target achievement rates and productivity trends over time.</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-600" />
                Performance-Protected Shortfall Reasons
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base space-y-3">
              <p className="text-muted-foreground">When technicians don't meet their daily target, they must provide a reason. Certain reasons are designated as "performance-protected" and do NOT negatively impact the employee's productivity metrics:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-300">Protected Reasons (No Impact):</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Weather delays (wind, rain, lightning)</li>
                    <li>Equipment issues</li>
                    <li>Building access problems</li>
                    <li>Emergency evacuation</li>
                    <li>Client-requested pause</li>
                    <li>Safety concern</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-300">Unprotected (Custom) Reasons:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Free-text explanations are logged</li>
                    <li>DO count toward performance metrics</li>
                    <li>Supervisors can review during performance reviews</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Hours Calculation & Overtime
          </h2>

          <Card className="border-2 border-purple-200 dark:border-purple-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Timer className="w-4 h-4 text-purple-600" />
                Automatic Overtime Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base space-y-4">
              <p className="text-muted-foreground">When a session ends, the system automatically calculates hours breakdown based on company settings:</p>
              
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded text-center">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">8h</p>
                  <p className="text-xs font-semibold">Regular Hours</p>
                  <p className="text-xs text-muted-foreground">First 8 hours daily</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded text-center">
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">1.5x</p>
                  <p className="text-xs font-semibold">Overtime Hours</p>
                  <p className="text-xs text-muted-foreground">Hours 8-12</p>
                </div>
                <div className="bg-red-50 dark:bg-red-950 p-3 rounded text-center">
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">2x</p>
                  <p className="text-xs font-semibold">Double Time</p>
                  <p className="text-xs text-muted-foreground">Hours 12+</p>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded">
                <p className="font-semibold text-xs">Example Calculation:</p>
                <p className="text-xs mt-1">10-hour shift = 8 regular + 2 overtime</p>
                <p className="text-xs">14-hour shift = 8 regular + 4 overtime + 2 double time</p>
              </div>

              <div className="bg-muted p-2 rounded text-sm space-y-2">
                <p><strong>Configurable Settings:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li><strong>Daily triggers:</strong> Overtime/double-time calculated per day (default)</li>
                  <li><strong>Weekly triggers:</strong> Hours accumulated across the week before OT kicks in</li>
                  <li><strong>Custom thresholds:</strong> Adjust when OT/DT begin (8h/12h defaults)</li>
                  <li><strong>Disable overtime:</strong> Set trigger to "none" for flat-rate pay</li>
                </ul>
              </div>

              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded text-xs">
                <strong>Labor Cost Tracking:</strong> Each session also captures the employee's hourly rate at time of work, calculating and storing total labor cost for project analytics.
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            Payroll Integration
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Hourly Employees</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="bg-muted p-3 rounded space-y-2">
                  <p className="font-mono text-xs">
                    Pay = (Regular × Rate) + (OT × Rate × 1.5) + (DT × Rate × 2)
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-1 text-base">
                  <li>Each session's hours are summed by type</li>
                  <li>Rate pulled from employee profile</li>
                  <li>Payroll page shows detailed breakdown</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Piece Work Projects</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="bg-muted p-3 rounded space-y-2">
                  <p className="font-mono text-xs">
                    Pay = Total Drops × Price Per Drop
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-1 text-base">
                  <li>Enabled per-project in settings</li>
                  <li>Hours still tracked for records</li>
                  <li>Payment based on output, not time</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-4 text-base text-amber-900 dark:text-amber-100">
              <p className="flex items-center gap-2 font-semibold">
                <Info className="w-4 h-4" />
                Billable vs Non-Billable
              </p>
              <p className="mt-1">Sessions can be marked as non-billable (for training, meetings, travel, etc.). Non-billable hours appear in a separate section and don't count toward project labor costs, but they're still tracked for payroll.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-action-600 dark:text-action-400" />
            Active Workers Tracking
          </h2>

          <Card>
            <CardContent className="pt-6 text-base space-y-4">
              <p className="text-muted-foreground">Managers can see who's currently working in real-time:</p>
              
              <div className="bg-muted p-4 rounded space-y-3">
                <div className="flex items-center justify-between p-2 bg-background rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-medium text-xs">John Smith</span>
                    <Badge variant="outline" className="text-xs">Rope Access Tech</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Started 9:15 AM
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-background rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-medium text-xs">Sarah Johnson</span>
                    <Badge variant="outline" className="text-xs">Supervisor</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Started 8:45 AM
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold text-xs">Features:</p>
                  <ul className="list-disc list-inside space-y-1 text-base">
                    <li>Real-time status updates</li>
                    <li>View session start time</li>
                    <li>Filter by project</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-xs">Default Access:</p>
                  <ul className="list-disc list-inside space-y-1 text-base">
                    <li>Company owners: All workers</li>
                    <li>Ops managers: All workers</li>
                    <li>Supervisors: Their team</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: Company owners can grant Active Workers visibility to any role via permission settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            IRATA Hours Logging
          </h2>

          <div className="bg-amber-100 dark:bg-amber-900 border-2 border-amber-500 p-4 rounded-lg mb-4">
            <p className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-100">
              <AlertTriangle className="w-5 h-5" />
              Important Disclaimer
            </p>
            <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
              irata/SPRAT hours logged in OnRopePro are <strong>NOT certification-approved</strong>. 
              This tool helps technicians track their hours to accurately fill their official logbooks. 
              It does not replace the official IRATA or SPRAT logging requirements. 
              Future integration with certification bodies is planned.
            </p>
          </div>

          <Card className="border-2 border-teal-200 dark:border-teal-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Certification Progression Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base space-y-4">
              <p className="text-muted-foreground">After ending a work session, technicians are prompted to log their IRATA task hours for certification progression:</p>
              
              <div className="bg-teal-50 dark:bg-teal-950 p-3 rounded space-y-2">
                <p className="font-semibold text-xs">Task Categories (20 types available):</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-background rounded">Rope Transfer</div>
                  <div className="p-2 bg-background rounded">Re-Anchor</div>
                  <div className="p-2 bg-background rounded">Ascending</div>
                  <div className="p-2 bg-background rounded">Descending</div>
                  <div className="p-2 bg-background rounded">Rigging</div>
                  <div className="p-2 bg-background rounded">Deviation</div>
                  <div className="p-2 bg-background rounded">Aid Climbing</div>
                  <div className="p-2 bg-background rounded">Edge Transition</div>
                  <div className="p-2 bg-background rounded">Knot Passing</div>
                  <div className="p-2 bg-background rounded">Rescue Technique</div>
                  <div className="p-2 bg-background rounded">Hauling / Lowering</div>
                  <div className="p-2 bg-background rounded text-muted-foreground">+ 9 more...</div>
                </div>
              </div>

              <div className="bg-muted p-3 rounded">
                <p className="font-semibold text-xs">How It Works:</p>
                <ol className="list-decimal list-inside space-y-1 text-base mt-2">
                  <li>End work session normally</li>
                  <li>Prompt appears: "Log your IRATA hours?"</li>
                  <li>Enter hours by task category</li>
                  <li>Hours accumulated in personal profile</li>
                  <li>View total logged hours in "My Logged Hours" page</li>
                </ol>
              </div>

              <p className="text-xs text-muted-foreground">This data helps technicians track their progression toward IRATA Level 2 or Level 3 certification requirements.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Session Editing (Manager Override)
          </h2>

          <Card>
            <CardContent className="pt-6 text-base space-y-4">
              <p className="text-muted-foreground">Users with financial permission can edit completed sessions:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold text-xs">Editable Fields:</p>
                  <ul className="list-disc list-inside space-y-1 text-base">
                    <li>Start time</li>
                    <li>End time</li>
                    <li>Drops completed (per elevation)</li>
                    <li>Completion percentage</li>
                    <li>Billable status</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-xs">Auto-Recalculated:</p>
                  <ul className="list-disc list-inside space-y-1 text-base">
                    <li>Total hours worked</li>
                    <li>Overtime breakdown</li>
                    <li>Piece work pay (if applicable)</li>
                    <li>Payroll amounts</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-950 p-3 rounded">
                <p className="flex items-center gap-2 font-semibold text-xs text-red-900 dark:text-red-100">
                  <Shield className="w-4 h-4" />
                  Required Permission: canAccessFinancials
                </p>
                <p className="text-xs mt-1 text-red-800 dark:text-red-200">Session editing is restricted to prevent unauthorized payroll modifications. This permission is typically granted to company owners, operations managers, and accounting roles.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Session Workflow Summary
          </h2>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-x-auto pb-2">
            <div className="flex flex-col items-center min-w-[90px]">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-xs font-semibold text-center">Harness Check</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center min-w-[90px]">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs font-semibold text-center">Start Day</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center min-w-[90px]">
              <div className="w-12 h-12 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-action-600" />
              </div>
              <p className="text-xs font-semibold text-center">Work Session</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center min-w-[90px]">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-2">
                <Square className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-xs font-semibold text-center">End Day</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center min-w-[90px]">
              <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-2">
                <ClipboardCheck className="w-6 h-6 text-teal-600" />
              </div>
              <p className="text-xs font-semibold text-center">Log irata</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center min-w-[90px]">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs font-semibold text-center">Payroll</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Module Integration Points */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            Module Integration Points
          </h2>
          <p className="text-muted-foreground text-base">
            Work sessions connect to these core modules, creating a unified data flow across the platform:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  Employee Directory
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Sessions link to employee profiles for rate lookup, IRATA level tracking, and role-based visibility. Updates to employee hourly rates automatically apply to future sessions.
              </CardContent>
            </Card>
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  Payroll Module
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Completed sessions flow directly into the Payroll page with automatic overtime calculation. Regular/OT/DT hours, piece work earnings, and billable status are all computed automatically.
              </CardContent>
            </Card>
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  Safety Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Daily harness inspection is required before clock-in. Failed inspections block work and notify supervisors. Inspection history is logged for compliance auditing.
              </CardContent>
            </Card>
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  Project Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Sessions are tied to specific projects. Drop counts and completion percentages update project progress automatically, enabling accurate forecasting and resource allocation.
              </CardContent>
            </Card>
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Session data feeds into employee performance metrics: drops per day, target achievement rates, and shortfall patterns. Protected reasons are excluded from negative scoring.
              </CardContent>
            </Card>
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-teal-500" />
                  irata/SPRAT Logging
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                After each session, technicians can log task-specific hours for certification tracking. Data accumulates in their profile for easy logbook updates during recertification.
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Quick Reference: Session Data Fields
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left font-semibold">Field</th>
                  <th className="p-3 text-left font-semibold">Description</th>
                  <th className="p-3 text-center font-semibold">Required</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3 font-mono text-xs">startTime</td>
                  <td className="p-3 text-xs">Timestamp when session began</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3 font-mono text-xs">endTime</td>
                  <td className="p-3 text-xs">Timestamp when session ended</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-mono text-xs">startLatitude/Longitude</td>
                  <td className="p-3 text-xs">GPS coordinates at clock-in</td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-muted-foreground mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3 font-mono text-xs">endLatitude/Longitude</td>
                  <td className="p-3 text-xs">GPS coordinates at clock-out</td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-muted-foreground mx-auto" /></td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-mono text-xs">dropsCompleted*</td>
                  <td className="p-3 text-xs">N/E/S/W drop counts (drop-based jobs)</td>
                  <td className="p-3 text-center">Job type</td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3 font-mono text-xs">manualCompletionPercentage</td>
                  <td className="p-3 text-xs">0-100% (hours-based jobs)</td>
                  <td className="p-3 text-center">Job type</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-mono text-xs">regularHours</td>
                  <td className="p-3 text-xs">Auto-calculated regular hours</td>
                  <td className="p-3 text-center">Auto</td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3 font-mono text-xs">overtimeHours</td>
                  <td className="p-3 text-xs">Auto-calculated OT hours</td>
                  <td className="p-3 text-center">Auto</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-mono text-xs">doubleTimeHours</td>
                  <td className="p-3 text-xs">Auto-calculated 2x hours</td>
                  <td className="p-3 text-center">Auto</td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3 font-mono text-xs">shortfallReason</td>
                  <td className="p-3 text-xs">Why target wasn't met</td>
                  <td className="p-3 text-center">If below target</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
