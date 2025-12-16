import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Zap,
  Users,
  BarChart3,
  FileText,
  Shield,
  Target,
  Calculator,
  ClipboardCheck,
  Smartphone,
  Key,
  HardHat,
  Layers,
  ChevronsUpDown,
  Briefcase,
  Compass,
  Wifi,
  WifiOff,
  Edit3,
  UserCheck,
  Building2,
  Link as LinkIcon,
  HelpCircle,
  Globe,
  Award,
  TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const ALL_PROBLEM_ITEMS = [
  "owner-1", "owner-2", "owner-3", "owner-4", "owner-5", "owner-6", "owner-7",
  "tech-1", "tech-2",
  "ops-1", "ops-2"
];

const ALL_WORKFLOW_ITEMS = [
  "workflow-1", "workflow-2", "workflow-3", "workflow-4", "workflow-5", "workflow-6", "workflow-7"
];

const ALL_FAQ_ITEMS = [
  "faq-1", "faq-2", "faq-3", "faq-4", "faq-5", "faq-6", "faq-7", "faq-8", "faq-9", "faq-10",
  "faq-11", "faq-12", "faq-13", "faq-14", "faq-15", "faq-16", "faq-17", "faq-18", "faq-19", "faq-20",
  "faq-21", "faq-22"
];

export default function TimeTrackingGuide() {
  const [openProblems, setOpenProblems] = useState<string[]>([]);
  const [openWorkflows, setOpenWorkflows] = useState<string[]>([]);
  const [openFaqs, setOpenFaqs] = useState<string[]>([]);

  const allProblemsExpanded = openProblems.length === ALL_PROBLEM_ITEMS.length;
  const allWorkflowsExpanded = openWorkflows.length === ALL_WORKFLOW_ITEMS.length;
  const allFaqsExpanded = openFaqs.length === ALL_FAQ_ITEMS.length;

  const toggleAllProblems = () => {
    setOpenProblems(allProblemsExpanded ? [] : [...ALL_PROBLEM_ITEMS]);
  };

  const toggleAllWorkflows = () => {
    setOpenWorkflows(allWorkflowsExpanded ? [] : [...ALL_WORKFLOW_ITEMS]);
  };

  const toggleAllFaqs = () => {
    setOpenFaqs(allFaqsExpanded ? [] : [...ALL_FAQ_ITEMS]);
  };

  return (
    <ChangelogGuideLayout 
      title="Work Session & Time Tracking Guide"
      version="2.0"
      lastUpdated="December 16, 2025"
    >
      <div className="space-y-8">
        
        {/* Introduction Section */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            Work Sessions and Time Tracking is the operational backbone of OnRopePro, eliminating 87-93% of payroll processing time while providing real-time field operation visibility. GPS-verified clock-ins, automatic overtime calculation, 4-elevation integration, and offline functionality create a comprehensive solution that transforms time tracking from a 6-10 hour weekly burden into a 30-45 minute export.
          </p>
          
          {/* Key Success Metrics Card */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">Key Success Metrics</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white dark:bg-blue-900 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">87-93%</p>
                      <p className="text-base text-blue-800 dark:text-blue-200">Payroll Time Saved</p>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-blue-900 rounded-lg">
                      <p className="text-2xl font-bold text-emerald-600">90%</p>
                      <p className="text-base text-blue-800 dark:text-blue-200">Fewer Phone Calls</p>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-blue-900 rounded-lg">
                      <p className="text-2xl font-bold text-violet-600">100%</p>
                      <p className="text-base text-blue-800 dark:text-blue-200">GPS Verification</p>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-blue-900 rounded-lg">
                      <p className="text-2xl font-bold text-amber-600">11</p>
                      <p className="text-base text-blue-800 dark:text-blue-200">Problems Solved</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Golden Rule Section */}
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
              
              <div className="space-y-3 text-base">
                <p><strong>When an employee clicks "Start Day", they see three options:</strong></p>
                <div className="space-y-3 ml-2 mt-2">
                  <div className="flex items-start gap-3">
                    <Badge variant="default" className="shrink-0 mt-0.5">Yes</Badge>
                    <span>Confirms inspection is complete. Proceeds to start work session.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="destructive" className="shrink-0 mt-0.5">No</Badge>
                    <span>Redirected to complete harness inspection form first.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0 mt-0.5 border-amber-600 text-amber-900 dark:text-amber-100">Not Applicable</Badge>
                    <span>For non-rope-access work (ground tasks, office work, equipment transport). Records N/A status and proceeds.</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-4 text-base">
                <p className="font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Honor System with Passive Auditing
                </p>
                <p className="mt-2">
                  Employees can select "Yes" and proceed to work even without a matching inspection record in the database. The system does NOT actively block work sessions.
                </p>
                <p className="mt-2">
                  However, the inspection database is checked independently during CSR (Company Safety Rating) calculations. Any discrepancy (claiming "Yes" without a matching inspection record) creates a penalty that affects the company's compliance score visible to property managers.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Core Concepts Section */}
        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Core Concepts
          </h2>

          {/* GPS Verification */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                GPS Verification (50-Meter Radius)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                <p className="font-semibold text-blue-900 dark:text-blue-100">Critical Implementation Detail:</p>
                <p className="text-blue-800 dark:text-blue-200 mt-2">
                  Clock-in requires the technician to be within 50 meters of the building coordinates. If outside this range, clock-in is blocked and the system displays the actual distance from the site.
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="font-semibold">How It Works:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Technician clicks "Start Day"</li>
                  <li>App requests GPS permission</li>
                  <li>Current location compared to building coordinates</li>
                  <li>Within 50m: Clock-in proceeds normally</li>
                  <li>Outside 50m: Error displayed with actual distance</li>
                </ol>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="italic text-muted-foreground">
                  "GPS pins point them on a map. So you can see the guy actually clocked in at the building and not at the boss's place half hour earlier."
                </p>
              </div>

              <div className="space-y-2 text-muted-foreground">
                <p><span className="font-medium text-foreground">Fraud Prevention:</span> Prevents "coffee shop clock-ins", creates audit trail, location data stored with each session.</p>
                <p>If GPS permission is denied, the session starts but is flagged for manager review.</p>
              </div>
            </CardContent>
          </Card>

          {/* Billable vs Non-Billable */}
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Billable vs. Non-Billable Classification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-4">
                  <p className="font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Billable Hours (Revenue-Generating)
                  </p>
                  <p className="text-emerald-800 dark:text-emerald-200 mt-2">
                    Window cleaning, building washing, facade repairs, parkade cleaning. Work directly tied to client invoices.
                  </p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Non-Billable Hours (Overhead)
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 mt-2">
                    Travel time, equipment pickup, gear maintenance, meetings, admin, training.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">Why It Matters:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                  <li>Employees are paid for ALL hours (billable and non-billable)</li>
                  <li>Project costs only include BILLABLE hours</li>
                  <li>Accurate COGS for profitability analysis</li>
                  <li>Dashboard shows billable/non-billable ratio analytics</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold mb-2">Example: Tommy's Monday</p>
                <div className="grid grid-cols-2 gap-2 text-base">
                  <span>8:00-8:30 AM: Travel</span><span className="text-muted-foreground">30 min non-billable</span>
                  <span>8:30-12:00 PM: Window cleaning</span><span className="text-emerald-600">3.5 hrs billable</span>
                  <span>12:00-12:30 PM: Lunch</span><span className="text-muted-foreground">30 min non-billable</span>
                  <span>12:30-4:30 PM: Window cleaning</span><span className="text-emerald-600">4 hrs billable</span>
                  <span>4:30-5:00 PM: Return to shop</span><span className="text-muted-foreground">30 min non-billable</span>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <p><span className="font-medium">Total Payroll:</span> 9 hours | <span className="font-medium">Billable:</span> 7.5 hours | <span className="font-medium">Overhead:</span> 1.5 hours (16.7%)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4-Elevation Integration */}
          <Card className="border-violet-200 dark:border-violet-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Layers className="w-5 h-5 text-violet-600" />
                4-Elevation Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
              <p className="text-muted-foreground">
                Work sessions automatically update project progress by elevation (North, East, South, West). When technicians log drops completed at end-of-day, the Project Management module receives updates in real-time.
              </p>

              <div className="space-y-2">
                <p className="font-semibold">How It Works:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-muted-foreground">
                  <li>Technician completes North elevation drops</li>
                  <li>End-of-day form: North = 5 drops</li>
                  <li>Project Management module receives update in real-time</li>
                  <li>North elevation progress recalculates: 25/30 = 83%</li>
                  <li>Project dashboard shows per-elevation completion</li>
                  <li>Timeline projections adjust based on actual vs target</li>
                </ol>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Real-time Progress</p>
                    <p className="text-muted-foreground">No manual updates needed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Staged Invoicing</p>
                    <p className="text-muted-foreground">Bill by elevation completion</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Accurate Forecasting</p>
                    <p className="text-muted-foreground">Based on actual work output</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Historical Data</p>
                    <p className="text-muted-foreground">Productivity per building face</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* End-of-Day Reporting Philosophy */}
          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-600" />
                End-of-Day Reporting: Accountability Without Punishment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
              <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-4">
                <p className="font-semibold text-amber-900 dark:text-amber-100">Philosophy:</p>
                <p className="text-amber-800 dark:text-amber-200 mt-2">
                  End-of-day reporting is NOT a disciplinary tool. It's a context preservation system that benefits both technicians and managers by documenting what actually happened.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <HardHat className="w-4 h-4 text-orange-500" />
                    For Technicians:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                    <li>Documents legitimate challenges</li>
                    <li>Protects against unfair evaluations</li>
                    <li>Creates evidence when targets unrealistic</li>
                    <li>Ensures challenges are remembered</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    For Managers:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                    <li>Identifies systemic issues</li>
                    <li>Distinguishes delays from underperformance</li>
                    <li>Provides coaching data without guesswork</li>
                    <li>Enables data-driven conversations</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-semibold">Scenarios:</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-emerald-900 dark:text-emerald-100">Target Met (6/6 drops)</p>
                      <p className="text-emerald-800 dark:text-emerald-200">End session immediately, no explanation required.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">Target Missed, Protected Reason (4/6 drops)</p>
                      <p className="text-blue-800 dark:text-blue-200">Select "Weather delays (wind)". Session closes, reason logged, NO performance penalty.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-amber-900 dark:text-amber-100">Target Missed, Custom Reason (3/6 drops)</p>
                      <p className="text-amber-800 dark:text-amber-200">Write custom explanation. Session closes, reason logged, DOES impact performance metrics.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold mb-2">Protected Categories (No Performance Penalty):</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Weather</Badge>
                  <Badge variant="secondary">Equipment Failure</Badge>
                  <Badge variant="secondary">Building Access</Badge>
                  <Badge variant="secondary">Emergency</Badge>
                  <Badge variant="secondary">Client-Requested Pause</Badge>
                  <Badge variant="secondary">Safety Concern</Badge>
                </div>
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
            <Button onClick={toggleAllProblems} variant="outline" data-testid="button-toggle-all-problems">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allProblemsExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          {/* For Company Owners */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <DollarSign className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Company Owners</h3>
            </div>

            <Accordion type="multiple" value={openProblems} onValueChange={setOpenProblems} className="space-y-3">
              <AccordionItem value="owner-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-owner-1">
                  "I suspect some guys are clocking in from their truck before they even get to the building"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> Paper timesheets are easy to fudge. An employee says they started at 8:00 AM, but did they really? You have no way to verify if they were at the job site or still at the coffee shop.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "The GPS pins point them on a map. So you can see that the guy actually clocked in at the building and not at the boss's place half hour earlier. Same for clock out."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> GPS coordinates are captured at both clock-in and clock-out within a 50-meter radius of the building. Location pins confirm employees are at the actual job site.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> GPS-verified timestamps eliminate "phantom hours." Pay only for actual on-site work. Complete audit trail for compliance.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-owner-2">
                  "I have no idea how many hours my guys spent driving around versus actually working"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> You pay your crew for 40 hours but have no visibility into how much time they spent on revenue-generating work versus running errands, picking up supplies, or waiting around.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "Go ask Jeff tomorrow. How many hours were the guys driving around, moving gear from one building to another, picking up soap for another guy? No clue. He wouldn't even know."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Billable and non-billable hours are tracked separately. The dashboard shows your billable vs non-billable ratio by week, month, and year.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Accurate cost of goods sold for every project. Identify and reduce non-productive time. Data-driven pricing decisions.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-owner-3">
                  "Every day I'm calling my techs asking where they're at on the building"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> You have 5 projects running and zero visibility into progress. You call each tech individually, they give vague answers, you try to piece together where things stand.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "There is not a day that goes by that Jeff doesn't call one person per project to see where they're at... Probably 90 of his phone calls are with the techs being like, when will you be done?"</p>
                  <p><span className="font-medium text-foreground">Solution:</span> End-of-day forms capture drops completed per elevation and shortfall reasons automatically. Project dashboards show real-time progress without phone calls.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Eliminate 90% of status-check phone calls. Know instantly if a project is on track or falling behind, and why.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-4" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-owner-4">
                  "The building went 20 hours over budget and I don't really know why"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> A project finishes, you're way over labor budget, and you can't reconstruct what happened. Was it weather? Underperformance? Bad estimate? You move on to the next job never knowing.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "At the end of the building, you're just pissed off because your building went 20 hours over budget and you don't really know why. Move on. Next building."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Every work session logs hours worked, drops completed, and shortfall reasons with categories. Project analytics show exactly where time was spent.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Data-driven post-mortems. Accurate re-quoting for repeat jobs. Stop losing money without understanding why.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-5" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-owner-5">
                  "One guy is crushing it while another coasts, and I can't prove it"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> Your gut says Tommy does 5 drops per day while another employee barely does 1. They work the same hours, you pay them the same, but productivity is wildly different.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "Now it's just like, why didn't you do your drops? Well, look on OnRopePro, it's all there, it's all explained. Oh, okay, thanks."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Per-employee performance tracking shows drops completed per shift, target achievement rates, and categorized shortfall reasons. Protected reasons don't impact performance scores.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Objective performance data for coaching conversations. High performers feel recognized. Underperformers either improve or self-select out.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-6" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-owner-6">
                  "I pay people by the drop but tracking it is a nightmare"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> Some projects use piece work (pay per drop instead of hourly). Tracking this manually means reconciling drop counts with timesheets, calculating compensation, and hoping you didn't miss anything.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "Piece work is... some companies pay per drop. They'll have a budget, let's say $10,000 for a building. They allow $6,000 for the guys. So that $6,000 is spread into drops."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Toggle "Piece Work" on any project and set the price per drop. When employees end their session and enter drops completed, payroll automatically calculates compensation.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Zero manual calculation. Piece work and hourly employees can work the same project simultaneously. Payroll exports are accurate automatically.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-7" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-owner-7">
                  "Payroll takes forever because I'm deciphering texts and timesheets"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> Every pay period, you're collecting timesheets from paper forms, text messages, emails, and memory. Then you're entering it all into payroll manually. The whole process takes 6-10 hours for a 15-person crew.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "Tommy texts 'worked 9.5 hours Tuesday, building was rough.' Sarah's paper timesheet says '8 hours Monday, 10 hours Wednesday.' You have three texts you can't find, one timesheet that's illegible, and Friday's hours aren't submitted yet."</p>
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

            <Accordion type="multiple" value={openProblems} onValueChange={setOpenProblems} className="space-y-3">
              <AccordionItem value="tech-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-tech-1">
                  "I forgot to fill out my logbook and now I can't remember what tasks I did"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> IRATA and SPRAT certifications require detailed task logging. You're supposed to log these daily, but life gets busy. Two months later, you're filling out your logbook from memory.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "Your IRATA recertification is in 3 weeks. You open your logbook, last entry was 6 months ago. You've done hundreds of hours of rope work since then. You guess at task breakdowns and hope the assessor doesn't ask detailed questions."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> After ending each work session, you're prompted to log your IRATA/SPRAT task hours by category (20+ task types available). This data accumulates in your profile.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Accurate certification tracking without daily logbook discipline. Recertification prep takes 30 minutes instead of 3 hours of guessing.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-tech-2">
                  "My boss thinks I'm slacking when I legitimately couldn't hit target"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> You're evaluated on drops per day, but some days are impossible. Wind picks up at noon, you lose half the afternoon. Building access gets blocked for 2 hours. Without documentation, it looks like you underperformed.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "I could fix that easily just by adding a bunch of automatic reasons that you can select like weather delays... if one of those are selected, it will not affect their performance."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> When you don't meet your daily target, the system requires a shortfall reason before you can close your session. Protected reasons (weather, equipment, access) don't negatively impact your productivity metrics.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Your legitimate challenges are documented, not forgotten. Weather delays don't hurt your performance score. Fair evaluation based on what you could control.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Operations Managers */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Operations Managers</h3>
            </div>

            <Accordion type="multiple" value={openProblems} onValueChange={setOpenProblems} className="space-y-3">
              <AccordionItem value="ops-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-ops-1">
                  "I have 15 workers across 6 sites and no idea who's where"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> You're managing multiple crews across multiple buildings. Someone calls in sick, someone finishes early, someone hasn't clocked in and you don't know if they're late or just forgot.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "It's 9:15 AM. You see 12 of 15 workers have clocked in. Are the other 3 late? Did they forget to clock in? Are they sick? You start making calls. You just spent 30 minutes on basic attendance."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Real-time Active Workers dashboard shows everyone currently clocked in, which project they're working on, when they started, and GPS-verified location status. Missing workers are immediately visible.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Attendance tracking in seconds, not 30 minutes. Know exactly who's where without phone calls. Proactive problem-solving instead of reactive firefighting.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ops-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-ops-2">
                  "A tech forgot to clock out and now their hours are wrong"
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p><span className="font-medium text-foreground">The Pain:</span> Employees forget to clock out. They close the app and go home. Next morning, you see a 16-hour work session that's obviously wrong. Now you're playing detective.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> "Tommy's session shows 15.5 hours yesterday. He definitely didn't work that long. But the system has him clocked out at 9:30 PM. You call Tommy, he doesn't remember exactly when he left."</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Users with financial permissions can edit completed sessions. Adjust start time, end time, drops completed, and billable status. The system automatically recalculates hours, overtime, and labor costs.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Fix clock-out errors in 30 seconds without complicated workarounds. Full audit trail of all edits. Payroll stays accurate.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator />

        {/* Feature Specifications */}
        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Feature Specifications
          </h2>

          {/* Starting a Work Session */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Play className="w-5 h-5 text-emerald-600" />
                Starting a Work Session (Clock In)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="font-semibold">User Flow:</p>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Open project on Dashboard</li>
                    <li>Click "Start Day" button</li>
                    <li>Harness inspection prompt (Yes/No/N/A)</li>
                    <li>GPS permission requested</li>
                    <li>GPS location captured and validated (50m radius)</li>
                    <li>Select work type: Billable / Non-Billable</li>
                    <li>Session record created with start time</li>
                    <li>Employee status changes to "Active"</li>
                  </ol>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold">Data Captured:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                      <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span><span className="font-medium">Start Time:</span> Precise timestamp</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                      <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span><span className="font-medium">GPS:</span> Latitude/Longitude coordinates</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                      <Calendar className="w-4 h-4 text-violet-600 flex-shrink-0" />
                      <span><span className="font-medium">Work Date:</span> Local date, user timezone</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                      <Building2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span><span className="font-medium">Project ID:</span> Linked project</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                      <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><span className="font-medium">Inspection Status:</span> Yes/No/N/A</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                      <DollarSign className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><span className="font-medium">Billable Status:</span> Billable/Non-Billable</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ending a Work Session */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Square className="w-5 h-5 text-red-600" />
                Ending a Work Session (Clock Out)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="font-semibold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-violet-500" />
                    Drop-Based Jobs
                  </p>
                  <p className="text-muted-foreground">Window cleaning, building wash</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                    <li>Enter North/East/South/West drop counts</li>
                    <li>If total less than daily target: Shortfall reason required</li>
                    <li>Protected reasons don't penalize performance</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold flex items-center gap-2">
                    <Timer className="w-4 h-4 text-blue-500" />
                    Hours-Based Jobs
                  </p>
                  <p className="text-muted-foreground">Pressure washing, painting</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                    <li>Enter completion percentage (0-100%)</li>
                    <li>Contributes to overall project completion</li>
                    <li>No target enforcement (more flexible)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold mb-2">Auto-Calculated at Clock Out:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Total hours worked</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Regular/OT/DT breakdown</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Labor cost calculation</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Performance metrics</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Project progress updates</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Piece work pay (if applicable)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hours Calculation & Overtime */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                Hours Calculation and Overtime
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-semibold">Hours Range</th>
                      <th className="text-left p-3 font-semibold">Rate Multiplier</th>
                      <th className="text-left p-3 font-semibold">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">0-8 hours</td>
                      <td className="p-3 font-medium text-emerald-600">1.0x</td>
                      <td className="p-3">Regular</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">8-12 hours</td>
                      <td className="p-3 font-medium text-amber-600">1.5x</td>
                      <td className="p-3">Overtime</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">12+ hours</td>
                      <td className="p-3 font-medium text-red-600">2.0x</td>
                      <td className="p-3">Double Time</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Example: 10-hour shift</p>
                  <p className="text-muted-foreground">8 regular + 2 OT = 11 compensable hours</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Example: 14-hour shift</p>
                  <p className="text-muted-foreground">8 regular + 4 OT + 2 DT = 18 compensable hours</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">Configurable Options:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                  <li><span className="font-medium text-foreground">Daily triggers (default):</span> OT/DT calculated per day</li>
                  <li><span className="font-medium text-foreground">Weekly triggers:</span> Hours accumulate across week (40+ = OT)</li>
                  <li><span className="font-medium text-foreground">Custom thresholds:</span> Adjust when OT/DT begin</li>
                  <li><span className="font-medium text-foreground">Disable overtime:</span> Flat-rate pay (hours tracked, not multiplied)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Offline Functionality */}
          <Card className="border-violet-200 dark:border-violet-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-violet-600" />
                Offline Functionality (PWA)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
              <div className="bg-violet-50 dark:bg-violet-950 rounded-lg p-4">
                <p className="font-semibold text-violet-900 dark:text-violet-100">Why It Matters:</p>
                <p className="text-violet-800 dark:text-violet-200 mt-2">
                  Rope access work occurs in underground parkades, high-rise building cores, remote sites, and elevator shafts with no cell signal. The app must work offline.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">How Offline Mode Works:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-muted-foreground">
                  <li>Technician in underground parkade (no signal)</li>
                  <li>Clicks "Start Day" and app loads from cached data</li>
                  <li>GPS captured (works offline)</li>
                  <li>Session data stored locally on device</li>
                  <li>Warning banner: "Offline, Will sync when connected"</li>
                  <li>Works normally throughout day</li>
                  <li>Exits parkade, signal restored</li>
                  <li>Background sync initiates automatically</li>
                  <li>Confirmation: "Session synced successfully"</li>
                </ol>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    Supported Offline:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                    <li>Start session (clock in)</li>
                    <li>End session (clock out)</li>
                    <li>Log drops completed</li>
                    <li>Enter shortfall reasons</li>
                    <li>View today's schedule</li>
                    <li>Access project details (cached)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold flex items-center gap-2 text-red-600">
                    <XCircle className="w-4 h-4" />
                    Requires Online:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                    <li>Company-wide analytics</li>
                    <li>Edit other employees' sessions</li>
                    <li>Access payroll data</li>
                    <li>Generate reports</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-Time Dashboard */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Real-Time Dashboard: Command Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
              <p className="text-muted-foreground">
                The dashboard provides real-time visibility into all field operations, eliminating the need for status-check phone calls.
              </p>

              <div className="bg-muted/50 rounded-lg p-4 font-mono text-base">
                <p className="font-semibold mb-3 font-sans">Active Workers Panel:</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span>Sarah Johnson - Tower Plaza North</span>
                    <span className="text-emerald-600">On-site</span>
                  </div>
                  <div className="text-muted-foreground text-base">Started: 8:45 AM | Elapsed: 3h 15m | Status: Active</div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span>Tommy Paquette - Gateway Building</span>
                    <span className="text-emerald-600">On-site</span>
                  </div>
                  <div className="text-muted-foreground text-base">Started: 9:00 AM | Elapsed: 3h 0m | Status: Active</div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span>Mike Chen - Central Tower</span>
                    <span className="text-amber-600">75m from site</span>
                  </div>
                  <div className="text-muted-foreground text-base">Started: 9:15 AM | Elapsed: 2h 45m | Status: Active</div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">Notification Triggers:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                  <li>Worker clock-in delayed 30+ minutes past scheduled start</li>
                  <li>GPS shows worker significantly off-site during active session</li>
                  <li>Shortfall reason mentions "equipment" (Ops manager alerted)</li>
                  <li>Project behind schedule by 20%+ (Owner notification)</li>
                  <li>Harness inspection "No" selected (Safety team notified)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Manager Override */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                Manager Override: Session Editing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Who Can Edit:</span> Users with <code className="bg-muted px-1 py-0.5 rounded">canAccessFinancials</code> permission (Owners, Ops Managers, Accounting)
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold">Editable Fields:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                    <li>Start time, End time</li>
                    <li>Drops completed (per elevation)</li>
                    <li>Completion percentage</li>
                    <li>Billable status</li>
                    <li>Shortfall reason</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Auto-Recalculated:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                    <li>Total hours worked</li>
                    <li>Regular/OT/DT breakdown</li>
                    <li>Piece work pay (if applicable)</li>
                    <li>Payroll amounts</li>
                    <li>Project costs</li>
                    <li>Performance metrics</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-semibold">Common Use Cases:</p>
                <div className="space-y-2">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">Forgotten Clock-Out</p>
                    <p className="text-muted-foreground">Tommy's session shows 15.5 hours (never clocked out). Reality: Left at 4:30 PM. Manager changes end time, system recalculates automatically.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">Incorrect Drop Count</p>
                    <p className="text-muted-foreground">Sarah logged 8 drops, actually completed 10. Manager updates North elevation 8 to 10, project progress recalculates.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">Wrong Billable Status</p>
                    <p className="text-muted-foreground">Mike's session marked "Billable" but was training (non-billable). Manager changes status, project labor cost reduced, payroll unchanged.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                <p className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Shield className="w-4 h-4" />
                  <span className="font-semibold">Audit Trail:</span> All edits logged (who, what changed, when, why)
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* User Workflows */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              User Workflows
            </h2>
            <Button onClick={toggleAllWorkflows} variant="outline" data-testid="button-toggle-all-workflows">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allWorkflowsExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          <Accordion type="multiple" value={openWorkflows} onValueChange={setOpenWorkflows} className="space-y-3">
            <AccordionItem value="workflow-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-workflow-1">
                Workflow 1: Standard Day (Hourly Employee)
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                <p><span className="font-medium text-foreground">Scenario:</span> Sarah works standard 8-hour window cleaning shift at Tower Plaza.</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>7:45 AM: Opens app, sees assigned project</li>
                  <li>8:00 AM: Clicks "Start Day", harness inspection "Yes", GPS verified (15m from building)</li>
                  <li>8:00 AM-4:00 PM: Works North elevation (6 drops) + East elevation (2 drops)</li>
                  <li>4:00 PM: Clicks "End Day", enters drops (N:6, E:2, Total:8), target met (6), no shortfall reason needed</li>
                  <li>4:01 PM: System calculates: 8 hours regular @ $32 = $256, project progress updated</li>
                  <li>Next day: Manager sees accurate payroll: Sarah 8 hours, $256</li>
                </ol>
                <p className="font-medium text-emerald-600">Result: Zero manual data entry, automatic payroll, real-time manager visibility.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="workflow-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-workflow-2">
                Workflow 2: Overtime Day (Equipment Issues)
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                <p><span className="font-medium text-foreground">Scenario:</span> Tommy encounters equipment problems requiring overtime.</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>7:30 AM: Clocks in at Gateway Building</li>
                  <li>7:30-11:00 AM: Completes 3 drops (on track for 6-drop target)</li>
                  <li>11:15 AM: Rope jams, cannot continue. Supervisor notified via dashboard, dispatches replacement</li>
                  <li>11:15 AM-1:30 PM: Waiting for replacement gear</li>
                  <li>1:30-6:00 PM: Works extended hours, completes 4 more drops (total: 7)</li>
                  <li>6:00 PM: Clocks out (10.5 hours), logs drops, target exceeded</li>
                  <li>6:01 PM: System calculates: 8 reg ($280) + 2.5 OT ($131.25) = $411.25</li>
                </ol>
                <p className="font-medium text-emerald-600">Result: Overtime auto-calculated, equipment issue documented, no manual reconciliation.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="workflow-3" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-workflow-3">
                Workflow 3: Underperformance (Protected Reason)
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                <p><span className="font-medium text-foreground">Scenario:</span> Mike misses daily target due to weather conditions.</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>8:00 AM: Clocks in at Central Tower, target: 6 drops</li>
                  <li>8:00-11:30 AM: Completes 3 drops (on track)</li>
                  <li>11:30 AM: Wind speed 35 km/h, work stopped (protocol: stop above 30 km/h)</li>
                  <li>11:30 AM-2:00 PM: Weather delay (2.5 hours lost)</li>
                  <li>2:00-4:30 PM: Wind decreases, completes 2 more drops (total: 5)</li>
                  <li>4:30 PM: Clocks out (8.5 hours), logs drops (5), target not met (6)</li>
                  <li>Shortfall reason required: Selects "Weather delays (wind)"</li>
                  <li>4:31 PM: System calculates hours, shortfall reason Protected, NO performance penalty</li>
                </ol>
                <p className="font-medium text-emerald-600">Result: Legitimate challenge documented, employee not penalized, manager identifies pattern.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="workflow-4" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-workflow-4">
                Workflow 4: Piecework Project
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                <p><span className="font-medium text-foreground">Scenario:</span> Sarah works piecework project paying $70/drop.</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Project setup: "Piece Work" ON, rate $70/drop, Sarah's profile: Piecework compensation</li>
                  <li>8:00 AM: Clocks in normally</li>
                  <li>8:00 AM-3:30 PM: Works (7.5 hours tracked but not used for pay)</li>
                  <li>3:30 PM: Clocks out, logs drops (N:3, E:2, S:3, W:2, Total:10)</li>
                  <li>3:31 PM: System calculates: 10 drops x $70 = $700 (effective rate: $93.33/hour)</li>
                  <li>Next day: Payroll shows: Sarah, Piece Work, 10 drops, $700</li>
                </ol>
                <p className="font-medium text-emerald-600">Result: Zero manual piecework calculation, automatic payroll integration.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="workflow-5" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-workflow-5">
                Workflow 5: Multi-Project Day
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                <p><span className="font-medium text-foreground">Scenario:</span> Tommy works two different projects in one day.</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>7:30 AM: Project 1: Tower Plaza, works 4 hours, completes 3 drops, clocks out 11:30 AM</li>
                  <li>11:30 AM: Travel to Gateway Building (30 min unpaid break)</li>
                  <li>12:00 PM: Project 2: Gateway Building, works 5 hours, completes 4 drops, clocks out 5:00 PM</li>
                  <li>5:01 PM: System calculates daily totals: 9 hours (8 reg + 1 OT) = $332.50</li>
                  <li>Project costs: Tower Plaza $140, Gateway $175 + $52.50 OT = $227.50</li>
                </ol>
                <p className="font-medium text-emerald-600">Result: Accurate tracking across multiple projects, OT calculated across full day, each project properly charged.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="workflow-6" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-workflow-6">
                Workflow 6: Manager Correction (Forgotten Clock Out)
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                <p><span className="font-medium text-foreground">Scenario:</span> Mike forgets to clock out, session remains open overnight.</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Tuesday 8:00 AM: Clocks in at Central Tower</li>
                  <li>Tuesday 4:30 PM: Forgets to clock out, closes app, drives home</li>
                  <li>Wednesday 8:15 AM: Opens app to clock in, error: "You already have an active session"</li>
                  <li>Calls manager: "I forgot to clock out, left around 4:30 PM"</li>
                  <li>Wednesday 8:20 AM: Manager opens Active Workers, sees Mike's session (24+ hours), clicks "Edit Session"</li>
                  <li>Changes end time to "Tuesday 4:30 PM", adds reason: "Employee forgot to clock out, confirmed via phone"</li>
                  <li>Wednesday 8:21 AM: System recalculates: 8.5 hours (8 reg + 0.5 OT) = $297.50</li>
                  <li>Mike can now clock in for Wednesday</li>
                  <li>Audit trail logged: Edited by Jeff, original end NULL to Tuesday 4:30 PM</li>
                </ol>
                <p className="font-medium text-emerald-600">Result: Quick error correction, accurate payroll, full audit trail preserved.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="workflow-7" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-workflow-7">
                Workflow 7: Offline Session (Parkade Work)
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                <p><span className="font-medium text-foreground">Scenario:</span> Sarah works in underground parkade with no cell signal.</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>8:00 AM: Arrives at parkade ground level (has signal), opens app</li>
                  <li>8:05 AM: Descends to P3 level, loses signal, app displays "Offline"</li>
                  <li>8:10 AM: Clocks in (offline), GPS captured (works without internet), stored locally</li>
                  <li>8:10 AM-3:30 PM: Works entire day with no signal</li>
                  <li>3:30 PM: Clocks out (still offline), completes end-of-day form, data stored locally</li>
                  <li>Banner: "Queued actions: 2, Session start, Session end"</li>
                  <li>3:40 PM: Returns to ground level, signal restored, background sync initiates</li>
                  <li>3:41 PM: Sync complete, server validates, hours calculated (7.5), confirmation toast displayed</li>
                </ol>
                <p className="font-medium text-emerald-600">Result: Seamless offline work, automatic sync when connectivity restored, no data loss.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <Separator />

        {/* Integration Points */}
        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <LinkIcon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            Integration Points
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Employee Directory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Sessions link to employee profiles for rate lookup</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>IRATA tracking and role-based visibility</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Hourly rate captured at time of work</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Payroll Module
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Sessions flow directly with automatic OT</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>87-93% reduction in processing time</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>One-click export to ADP/Gusto/QuickBooks</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  Safety Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Daily harness inspection required before clock-in</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Inspection history logged for CSR calculation</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Failed inspections block work</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Layers className="w-4 h-4 text-violet-600" />
                  Project Management (4-Elevation)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Drop counts update project progress automatically</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Completion percentages feed project status</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Timeline projections adjust based on actuals</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Session data feeds drops/day metrics</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Target achievement and shortfall patterns</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Protected reasons excluded from negative scoring</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  IRATA/SPRAT Certification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Task-specific hours logged after each session</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Data accumulates for certification progression</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>20+ task types available</span>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  Company Safety Rating (CSR)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Harness inspection compliance affects CSR score</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Sessions claiming "Yes" without database record = penalty</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Property managers see CSR when selecting vendors</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Permissions & Access Control */}
        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Key className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            Permissions and Access Control
          </h2>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl">Role-Based Visibility Matrix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-semibold">Role</th>
                      <th className="text-center p-3 font-semibold">View Own</th>
                      <th className="text-center p-3 font-semibold">View Team</th>
                      <th className="text-center p-3 font-semibold">View All</th>
                      <th className="text-center p-3 font-semibold">Edit</th>
                      <th className="text-center p-3 font-semibold">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Technician</td>
                      <td className="p-3 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-3 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                      <td className="p-3 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                      <td className="p-3 text-center text-base text-muted-foreground">Own active only</td>
                      <td className="p-3 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Supervisor</td>
                      <td className="p-3 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-3 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-3 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                      <td className="p-3 text-center text-base text-muted-foreground">Team*</td>
                      <td className="p-3 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Operations Manager</td>
                      <td className="p-3 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-3 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-3 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-3 text-center text-base text-muted-foreground">All*</td>
                      <td className="p-3 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Company Owner</td>
                      <td className="p-3 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-3 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-3 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-3 text-center text-base text-muted-foreground">All*</td>
                      <td className="p-3 text-center text-base text-muted-foreground">All*</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground">*Requires <code className="bg-muted px-1 py-0.5 rounded">canAccessFinancials</code> permission</p>

              <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-4">
                <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Financial Permission Controls:</p>
                <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-200">
                  <li>Edit completed sessions</li>
                  <li>View company-wide payroll</li>
                  <li>Export payroll reports</li>
                  <li>Delete sessions (owner only)</li>
                </ul>
                <p className="mt-3 text-amber-800 dark:text-amber-200">
                  <span className="font-medium">Who Has:</span> Owners (always), Ops Managers (usually), Accounting (always), Supervisors (rarely)
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* FAQs */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Frequently Asked Questions
            </h2>
            <Button onClick={toggleAllFaqs} variant="outline" data-testid="button-toggle-all-faqs">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allFaqsExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          <Accordion type="multiple" value={openFaqs} onValueChange={setOpenFaqs} className="space-y-3">
            <AccordionItem value="faq-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-1">
                What if technician's phone dies mid-shift?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Session remains open. When recharged, end session normally. If phone unrecoverable, manager manually closes with correct times.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-2">
                Can technicians clock in from home then drive to site?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                No. GPS verification requires within 50 meters of building before clock-in allowed.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-3">
                What if GPS permissions denied?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Session starts (work not blocked) but location not captured. Warning displayed, flagged for manager review.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-4">
                Do overtime calculations consider weekly or daily hours?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Configurable. Default is daily (8 reg + OT), but can set weekly thresholds (40 hours/week before OT).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-5">
                Can piece work and hourly employees work same project?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Yes. Toggle "Piece Work" ON at project level, set individual employee compensation type. System handles both simultaneously.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-6">
                What if GPS inaccurate due to tall buildings?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                50-meter radius accommodates typical GPS drift. Extreme cases: manager manually verifies location, overrides if necessary.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-7">
                Does app track location continuously during shift?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                No. GPS captured only at clock-in and clock-out. No background tracking, no movement trail. Privacy protected.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-8">
                What if employee works in building with no GPS signal?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Uses last known GPS location before entering. Offline mode activates, session data stored locally, syncs when connectivity restored.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-9">
                If employee works multiple projects in one day, how is OT calculated?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Based on total hours across all projects for that day. Last project typically absorbs OT cost.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-10" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-10">
                How does system handle paid vs unpaid lunch breaks?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Set in Company Settings. Options: Paid lunch (don't clock out), Unpaid lunch (clock out/in), Auto-deduct 30 min after 6 hours.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-11" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-11">
                Can overtime be disabled entirely?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Yes. Set trigger to "None" in settings. Hours tracked (labor records) but pay remains base rate regardless of hours.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-12" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-12">
                Who decides which shortfall reasons are "performance-protected"?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Pre-configured industry-standard: weather, equipment failure, building access, emergency, client-requested pause, safety concern. Owners can add custom categories.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-13" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-13">
                Can managers see patterns of "protected" shortfall reasons?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Yes. Manager Dashboard includes Shortfall Pattern Analysis showing occurrences by type/employee.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-14" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-14">
                What if technician legitimately couldn't meet target but no good "protected" reason?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Write free-text explanation. Will impact performance metrics but provides context for manager review. Manager can manually exclude from performance review.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-15" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-15">
                Does logging IRATA hours in OnRopePro satisfy certification requirements?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                NO. Not certification-approved. Tool helps track hours to fill official logbooks. Still need official IRATA/SPRAT logbook with supervisor signatures.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-16" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-16">
                Can technicians edit their IRATA hours after logging?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Yes. Navigate to "My Logged Hours", select session, adjust task allocations, save. (Only task breakdown editable, not total hours, those locked for payroll.)
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-17" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-17">
                Can I export session data to Excel for custom analysis?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Yes. Reports, Work Sessions, Export. Formats: CSV, PDF, JSON. Filterable by date, employee, project, billable status.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-18" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-18">
                How long is session data retained?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Indefinitely (while account active). Benefits: historical benchmarking, multi-year comparisons, compliance audits (labor boards require 3-7 years).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-19" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-19">
                What happens to session data if employee leaves?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Options: Archive employee (recommended, data preserved), Delete employee (sessions remain, name shows "[Deleted]"), Full GDPR deletion (employee and all data removed).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-20" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-20">
                What if app crashes during active work session?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Session data safe. Start time/GPS saved to database immediately at clock-in. Reopen app, session automatically resumes, clock out normally.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-21" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-21">
                Does app work on both iOS and Android?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Yes. Progressive Web App (PWA) works on iOS, Android, Desktop via web browser. No app store download required.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-22" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="accordion-faq-22">
                What's minimum internet speed required?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Very minimal. 2G connection or better. Clock in/out: approximately 5 KB per action. Full day normal use: approximately 500 KB total.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <Separator />

        {/* Related Resources */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            Related Resources
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/changelog/safety">
              <Card className="hover-elevate cursor-pointer h-full">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span className="font-medium">Safety Compliance Guide</span>
                  </div>
                  <p className="text-base text-muted-foreground">Harness inspections, toolbox meetings, FLHA forms</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/changelog/csr">
              <Card className="hover-elevate cursor-pointer h-full">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">Company Safety Rating Guide</span>
                  </div>
                  <p className="text-base text-muted-foreground">CSR calculation, property manager visibility</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/changelog/projects">
              <Card className="hover-elevate cursor-pointer h-full">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-violet-600" />
                    <span className="font-medium">Project Management Guide</span>
                  </div>
                  <p className="text-base text-muted-foreground">4-elevation tracking, progress management</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

      </div>
    </ChangelogGuideLayout>
  );
}
