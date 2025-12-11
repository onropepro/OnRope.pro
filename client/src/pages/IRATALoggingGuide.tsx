import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  UserCheck,
  Award,
  Timer,
  ListChecks,
  FileText,
  TrendingUp,
  Calendar,
  Plus,
  History,
  Target,
  AlertTriangle,
  Info,
  BookOpen,
  Camera,
  ChevronsUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ALL_ACCORDION_ITEMS = [
  "tech-1", "tech-2", "tech-3", "tech-4", "tech-5",
  "owner-1", "owner-2",
  "supervisor-1"
];

export default function IRATALoggingGuide() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const allExpanded = openItems.length === ALL_ACCORDION_ITEMS.length;

  const toggleAll = () => {
    setOpenItems(allExpanded ? [] : [...ALL_ACCORDION_ITEMS]);
  };

  return (
    <ChangelogGuideLayout 
      title="IRATA / SPRAT Task Logging Guide"
      version="3.0"
      lastUpdated="December 10, 2025"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The IRATA / SPRAT Task Logging System allows rope access technicians to track their work hours against specific task types for certification progression. Hours are automatically captured from work sessions and can be categorized by the type of rope access work performed.
          </p>
        </section>

        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Award className="w-5 h-5" />
                The Golden Rule: Hours Build Your IRATA / SPRAT Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Total Hours = Baseline + Logged Sessions
                </p>
              </div>
              
              <div className="space-y-2 text-base">
                <p><strong>Your IRATA / SPRAT hours accumulate automatically.</strong> The system tracks:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Baseline Hours</strong>: Pre-existing logbook hours you enter manually</li>
                  <li><strong>Session Hours</strong>: Hours automatically logged from completed work sessions</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  IRATA / SPRAT Technicians Only
                </p>
                <p className="mt-1">The task logging prompt only appears for employees with IRATA / SPRAT certification tracking enabled. After ending a work session, you'll be prompted to categorize your hours.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Baseline Entry</p>
                  <p className="font-bold">Pre-existing Hours</p>
                  <p className="text-lg font-mono">500 hrs</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">New Sessions</p>
                  <p className="font-bold">Logged This Month</p>
                  <p className="text-lg font-mono">+45 hrs</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-bold">Career Hours</p>
                  <p className="text-lg font-mono text-green-700 dark:text-green-300">545 hrs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Critical Disclaimer */}
        <section className="space-y-4">
          <Card className="border-2 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <p className="font-bold text-red-900 dark:text-red-100 text-lg">
                    Important: This Does NOT Replace Your Physical Logbook
                  </p>
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    IRATA and SPRAT still require you to maintain a physical logbook. WorkSafeBC and other regulatory bodies may request to see your written logbook on-site. OnRopePro's digital logging is a <strong>supplement</strong> that helps you maintain accurate records, not a replacement for your official certification documentation.
                  </p>
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    <strong>Note:</strong> If you have no logged rope time for 6 months, your certification may be considered invalid until recertification. Consistent logging protects your credentials.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Key Features Summary */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Key Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">OCR Logbook Scanning</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Photograph your existing paper logbook pages. AI extracts hours and task data automatically, no manual entry required.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Automatic Session Capture</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      When connected to an employer, your work hours are captured automatically from clock in/out. No timesheets needed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-action-100 dark:bg-action-900 flex items-center justify-center shrink-0">
                    <ListChecks className="w-5 h-5 text-action-600 dark:text-action-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">20+ Task Categories</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Industry-standard IRATA/SPRAT task types ensure your hours are properly categorized for certification assessments.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">PDF Export</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Export your complete hour history for any date range. Perfect for certification renewals and job applications.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Works Connected or Independent</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Log hours whether you're employed through the platform or working independently. Your portable profile goes with you.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Career Statistics</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      View hours by week, month, or year. Track task diversity to ensure you're building well-rounded experience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Problems Solved - Stakeholder Segmented with Accordions */}
        <section className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                Problems Solved
              </h2>
              <p className="text-muted-foreground mt-2">
                The IRATA/SPRAT Task Logging module solves different problems for different users. Find your role below.
              </p>
            </div>
            <Button 
              onClick={toggleAll} 
              variant="outline"
              data-testid="button-toggle-all-accordions"
            >
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          {/* For Rope Access Technicians */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <UserCheck className="w-5 h-5 text-purple-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Rope Access Technicians</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={openItems} 
              onValueChange={setOpenItems}
              className="space-y-3"
            >
              <AccordionItem value="tech-1" className="border rounded-lg px-4" data-testid="accordion-tech-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I haven't updated my logbook in months"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> Opening your physical logbook every day is tedious. You put it off for a week, then two weeks, then months. When you finally try to catch up, you can't remember which buildings you worked at, what tasks you performed, or how many hours you actually spent on rope. You end up guessing, and your logbook becomes unreliable.
                  </p>
                  <div className="bg-muted/50 rounded p-3 border-l-2 border-purple-300">
                    <p className="text-xs text-muted-foreground mb-1">Real Example:</p>
                    <p className="italic text-sm">
                      "My last entry is December 29th, 2023... Two years. Where did I work in the past year? I don't even have access to my hours anymore because I don't work there. I don't have an account. It's all gone now."
                    </p>
                  </div>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> OnRopePro captures your hours automatically when you clock in/out. After each session, you simply select which tasks you performed. The system builds your chronological history without you having to write anything down.
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400">
                    <span className="font-medium">Benefit:</span> Never lose track of your hours again. Even if you forget to update your physical logbook, you have a complete digital record to reference when you catch up.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className="border rounded-lg px-4" data-testid="accordion-tech-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I just log 'descending' for everything"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> When you're catching up on weeks of logging, you can't remember which specific tasks you performed each day. Did you do a rope transfer on Tuesday or Wednesday? Was that rigging job last week or the week before? You end up putting "descending" or "window cleaning" for everything because it's easier than guessing.
                  </p>
                  <div className="bg-muted/50 rounded p-3 border-l-2 border-purple-300">
                    <p className="text-xs text-muted-foreground mb-1">Real Example:</p>
                    <p className="italic text-sm">
                      "You'll just kind of purposely lie, like 'yeah, probably did a rope transfer that day.' I know I did that many times at a building. I knew I was at that building and I know there are rope transfer drops on that building. But which day did I do them? Don't know."
                    </p>
                  </div>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> Task selection happens immediately after each work session while it's fresh in your mind. The system shows you standardized task types, and you allocate your hours across what you actually did that day.
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400">
                    <span className="font-medium">Benefit:</span> Build an accurate, diverse task history that actually reflects your experience, which is critical for Level 3 assessments.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-3" className="border rounded-lg px-4" data-testid="accordion-tech-3">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I showed up to my Level 3 assessment with a weak logbook"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> You've accumulated 1,000+ hours and feel ready for Level 3. But when the assessor reviews your logbook, they see page after page of "descending" with no rope transfers, no rigging, no rescue practice. They either send you home to get more experience, or they pass you but watch you like a hawk during the entire assessment.
                  </p>
                  <div className="bg-muted/50 rounded p-3 border-l-2 border-purple-300">
                    <p className="text-xs text-muted-foreground mb-1">Real Example:</p>
                    <p className="italic text-sm">
                      "If you show up at your certification and you show the assessor that all you did in your thousand hours of level two is descend on rope, they're gonna return you home and say go get more experience. Or you'll get the course, but the assessor will focus on you a lot."
                    </p>
                  </div>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> OnRopePro tracks hours by task type and shows you statistics. You can see at a glance whether you're building well-rounded experience or if you need to seek out more rope transfers, rigging, or rescue training.
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400">
                    <span className="font-medium">Benefit:</span> Walk into your Level 3 assessment with confidence, backed by documented diverse experience that assessors respect.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-4" className="border rounded-lg px-4" data-testid="accordion-tech-4">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I changed jobs and lost access to my hour records"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> You worked for a company for two years. All your hours were tracked in their system. Then you leave, and suddenly you can't access any of that data. Your physical logbook has gaps because you relied on the company's records. Now you're starting fresh with incomplete history.
                  </p>
                  <div className="bg-muted/50 rounded p-3 border-l-2 border-purple-300">
                    <p className="text-xs text-muted-foreground mb-1">Real Example:</p>
                    <p className="italic text-sm">
                      "I don't even have access to my hours anymore because I don't work there. I don't have an account. It's all gone now. I have to..."
                    </p>
                  </div>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> Your IRATA/SPRAT hours belong to YOUR technician profile, not your employer. When you move to a new company, your complete hour history comes with you automatically.
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400">
                    <span className="font-medium">Benefit:</span> Portable professional identity. Your career history is yours forever, regardless of which companies you work for.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-5" className="border rounded-lg px-4" data-testid="accordion-tech-5">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"Nobody actually verifies what I write in my logbook"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> You're supposed to get your logbook signed regularly by a Level 3 or supervisor. But realistically, you bring six months of entries to your boss and they just sign everything without looking. There's no actual verification that you did what you claim.
                  </p>
                  <div className="bg-muted/50 rounded p-3 border-l-2 border-purple-300">
                    <p className="text-xs text-muted-foreground mb-1">Real Example:</p>
                    <p className="italic text-sm">
                      "I bring my book to Jeff for the past six months of work, he's just signing. He doesn't know what I did. He just signs."
                    </p>
                  </div>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> When hours are logged same-day and linked to actual project locations, supervisors can verify entries against known work. "Tommy was at Marina Side today, I know there's rope transfers on that building. Approve."
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400">
                    <span className="font-medium">Benefit:</span> More credible records. When approvals happen in real-time against known projects, your logged hours carry more weight.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Company Owners */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Company Owners</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={openItems} 
              onValueChange={setOpenItems}
              className="space-y-3"
            >
              <AccordionItem value="owner-1" className="border rounded-lg px-4" data-testid="accordion-owner-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I don't know if my techs are actually qualified"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> You hire a Level 2 tech who claims 2,000 hours of experience. But their logbook is a mess, with gaps everywhere, vague entries, and signatures from months ago. Are they actually experienced, or did they just accumulate time without developing real skills?
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> When techs use OnRopePro, you can see their verified hour history with task breakdowns. You know exactly how much rigging, rescue, and specialized work they've actually performed.
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400">
                    <span className="font-medium">Benefit:</span> Hire with confidence. Assign techs to jobs that match their actual documented experience level.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className="border rounded-lg px-4" data-testid="accordion-owner-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"Signing logbooks is a rubber-stamp exercise"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> Your Level 3s are supposed to verify and sign tech logbooks. In reality, techs show up with months of backlogged entries and your supervisors just sign everything. There's no meaningful quality control.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> Digital approval flow means supervisors can review and approve hours daily or weekly while details are fresh. They can see which projects the tech worked on and verify the task types make sense.
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400">
                    <span className="font-medium">Benefit:</span> Meaningful verification. Your company's signature on a tech's hours actually means something.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Level 3 Technicians / Supervisors */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <ClipboardCheck className="w-5 h-5 text-action-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Level 3 Technicians & Supervisors</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={openItems} 
              onValueChange={setOpenItems}
              className="space-y-3"
            >
              <AccordionItem value="supervisor-1" className="border rounded-lg px-4" data-testid="accordion-supervisor-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I'm signing off on hours I can't actually verify"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> A tech brings you six months of logbook entries to sign. You weren't on every job with them. You have no idea if they actually did rope transfers on March 15th or if they're padding their book. But you sign anyway because that's how it's always been done.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> When entries are logged same-day and linked to specific projects, you can cross-reference against job records. "This tech logged rope transfers at Building X on Tuesday. I know that building has transfer points on the north elevation. Approve."
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400">
                    <span className="font-medium">Benefit:</span> Sign with integrity. Your IRATA/SPRAT number on an approval actually represents verification, not just rubber-stamping.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Rope Access Task Types
          </h2>
          <p className="text-muted-foreground text-sm">
            The system includes 20 canonical rope access task types recognized in the industry and defined in the IRATA standards.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-action-600 dark:text-action-400" />
                  Movement & Positioning
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Ascending</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Descending</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Rope Transfer</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Deviation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Re-Anchor</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Aid Climbing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Edge Transition</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Knot Passing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Mid-Rope Changeover</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Horizontal Traverse</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-600" />
                  Rigging & Load Operations
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Rigging</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Hauling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Lowering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Tensioned Rope Work</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  Work Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Window Cleaning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Building Inspection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Maintenance Work</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-600" />
                  Emergency & Other
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Rescue Technique</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Other</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Timer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            How Task Logging Works
          </h2>

          <div className="space-y-4">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Complete Your Work Session</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Clock in, perform your rope access work, and end your session normally through the standard workflow.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-action-600 dark:text-action-400 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Confirm IRATA / SPRAT Logging</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      A prompt asks if you want to log these hours to your IRATA / SPRAT portfolio. This only appears for certified technicians.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Task Selection Dialog Appears</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      After ending your session, a dialog prompts you to select which rope access tasks you performed. This only appears for IRATA / SPRAT certified technicians.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Select Tasks & Allocate Hours</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose the task types you performed and distribute your session hours across them. The system validates that hours don't exceed the session duration.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hours Allocation Warning */}
            <Card className="border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-semibold text-amber-900 dark:text-amber-100">
                      Important: Task Hours are not the same as Shift Hours
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      An 8-hour shift doesn't mean 8 hours of rope access tasks. Deduct lunch breaks, travel time, ground-level prep, and non-rope work. IRATA assessors review your logged tasks carefully, so accuracy matters for your certification progression.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Hours Added to Your Portfolio</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your logged hours are automatically added to your IRATA / SPRAT portfolio. View your complete history on the "My Logged Hours" page.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            My Logged Hours Page
          </h2>
          <p className="text-muted-foreground text-sm">
            Access your complete IRATA / SPRAT hours history from your Profile page.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold">Statistics Overview</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span>Total accumulated hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>Hours by month breakdown</span>
                </div>
                <div className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-purple-500" />
                  <span>Hours by task type</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold">History Features</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span>Full session history with details</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-500" />
                  <span>Filter by task type</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span>Date range export (PDF)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Baseline Hours Entry
          </h2>

          <Card className="bg-action-50 dark:bg-action-950 border-action-200 dark:border-action-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-action-600 dark:text-action-400 mt-0.5 shrink-0" />
                <div className="space-y-3 text-sm">
                  <p className="font-semibold text-action-900 dark:text-action-100">
                    Already Have IRATA / SPRAT Experience?
                  </p>
                  <p className="text-action-800 dark:text-action-200">
                    If you have pre-existing hours in your physical logbook from previous employment, you have two options to import them:
                  </p>
                  <div className="space-y-2 ml-4">
                    <div className="flex items-start gap-2">
                      <Camera className="w-4 h-4 text-action-600 dark:text-action-400 mt-0.5 shrink-0" />
                      <span className="text-action-800 dark:text-action-200">
                        <strong>Scan Your Logbook:</strong> Take photos of each page. Our OCR system extracts dates, hours, and task types automatically.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Plus className="w-4 h-4 text-action-600 dark:text-action-400 mt-0.5 shrink-0" />
                      <span className="text-action-800 dark:text-action-200">
                        <strong>Manual Entry:</strong> Enter your total baseline hours directly if you prefer not to scan individual pages.
                      </span>
                    </div>
                  </div>
                  <p className="text-action-800 dark:text-action-200">
                    Access baseline hour entry from the "My Logged Hours" page. Once entered, these hours combine with your new logged sessions for accurate certification tracking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Best Practices Section */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Best Practices
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Do
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Log your hours the same day while tasks are fresh in memory</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Deduct lunch, breaks, and non-rope time from your task hours</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Build diverse task experience (rope transfers, rigging, rescue) for Level 3</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Keep your physical logbook updated alongside digital records</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-red-900 dark:text-red-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Don't
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <span>Log full shift hours as task hours (8hr shift is not 8hrs of tasks)</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <span>Wait weeks or months to catch up on logging</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <span>Log only "descending" if you're preparing for Level 3 assessment</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <span>Assume digital records replace your official paper logbook</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* FAQ Section */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Does this replace my physical IRATA/SPRAT logbook?</h3>
                <p className="text-sm text-muted-foreground">
                  No. IRATA and SPRAT still require physical logbooks, and regulatory bodies like WorkSafeBC may request to see your written records. OnRopePro is a digital supplement that helps you maintain accurate records and never lose your hour history.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">What happens to my hours if I change employers?</h3>
                <p className="text-sm text-muted-foreground">
                  Your IRATA/SPRAT hours belong to your technician profile, not your employer. When you move to a new company, your complete hour history comes with you, so no re-entry is required.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Can I log hours if I'm not connected to an employer on the platform?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes. Independent technicians can manually log their hours and tasks. You can also scan your existing paper logbook to import historical data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">How do I log training hours from external courses?</h3>
                <p className="text-sm text-muted-foreground">
                  Training at IRATA/SPRAT schools counts as rope time. Use the manual entry feature to add training hours, specifying the training provider and skills practiced.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">What's the difference between shift hours and task hours?</h3>
                <p className="text-sm text-muted-foreground">
                  Shift hours are your total time at work. Task hours are the actual time performing rope access activities. An 8-hour shift might only include 6-7 hours of actual rope work after breaks, travel, and ground prep. Log task hours, not shift hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Quick Reference
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Feature</th>
                      <th className="text-left py-2 font-semibold">Description</th>
                      <th className="text-left py-2 font-semibold">Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2">Task Selection</td>
                      <td className="py-2 text-muted-foreground">Choose task types after ending session</td>
                      <td className="py-2"><Badge variant="outline">IRATA / SPRAT Techs</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">My Logged Hours</td>
                      <td className="py-2 text-muted-foreground">View complete hours history</td>
                      <td className="py-2"><Badge variant="outline">Profile Page</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Baseline Entry</td>
                      <td className="py-2 text-muted-foreground">Add pre-existing logbook hours</td>
                      <td className="py-2"><Badge variant="outline">My Logged Hours</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Statistics</td>
                      <td className="py-2 text-muted-foreground">Hours breakdown by task/month</td>
                      <td className="py-2"><Badge variant="outline">My Logged Hours</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Task Types</td>
                      <td className="py-2 text-muted-foreground">20+ canonical rope access tasks</td>
                      <td className="py-2"><Badge variant="outline">System Defined</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </ChangelogGuideLayout>
  );
}
