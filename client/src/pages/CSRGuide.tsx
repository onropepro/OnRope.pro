import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Star,
  Shield,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingDown,
  Building2,
  Users,
  Eye,
  Crown,
  Wrench,
  Globe,
  Target,
  Lightbulb,
  ChevronsUpDown,
  BookOpen,
  EyeOff,
  Clock,
  FolderOpen,
  ArrowRight,
  DollarSign,
  Zap,
  TrendingUp,
  HelpCircle,
  ListChecks,
  GraduationCap,
  CircleDot
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ALL_PROBLEM_IDS = [
  "owner-1", "owner-2", "owner-3", "owner-4", "owner-5",
  "tech-1", "tech-2", "tech-3",
  "pm-1", "pm-2"
];

const ALL_FAQ_IDS = ["faq-1", "faq-2", "faq-3", "faq-4", "faq-5"];

export default function CSRGuide() {
  const [expandedProblems, setExpandedProblems] = useState<string[]>([]);
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);

  const toggleAllProblems = () => {
    if (expandedProblems.length === ALL_PROBLEM_IDS.length) {
      setExpandedProblems([]);
    } else {
      setExpandedProblems([...ALL_PROBLEM_IDS]);
    }
  };

  const toggleAllFaqs = () => {
    if (expandedFaqs.length === ALL_FAQ_IDS.length) {
      setExpandedFaqs([]);
    } else {
      setExpandedFaqs([...ALL_FAQ_IDS]);
    }
  };

  return (
    <ChangelogGuideLayout
      title="Company Safety Rating (CSR) Guide"
      version="1.0"
      lastUpdated="December 15, 2025"
    >
      <div className="space-y-8">
        {/* Introduction Section */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Company Safety Rating (CSR) is a penalty-based compliance scoring system that provides an empirical measurement of your company's safety posture. Property managers can view a company's CSR score to assess vendor reliability, while company owners gain real-time visibility into their actual safety compliance. The CSR transforms safety from an unmeasured honor system into accountable, visible metrics.
          </p>
          
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">Starting Score: 75%</p>
                  <p className="text-base text-blue-800 dark:text-blue-200">
                    CSR starts at <span className="font-bold">75%</span> and reaches <span className="font-bold">100%</span> when your company uploads three core documents: Certificate of Insurance (COI), Health and Safety Manual, and Company Policy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* The Golden Rule */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl md:text-2xl font-semibold">The Golden Rule</h2>
          </div>

          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-6 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-lg font-medium text-amber-900 dark:text-amber-100 italic">
                  "CSR is not just a number for property managers. It is an empirical way to build safety into your company culture."
                </p>
              </div>
              
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4">
                <p className="text-base font-semibold text-amber-900 dark:text-amber-100 mb-2">The CSR Formula:</p>
                <p className="text-base font-mono font-bold text-amber-900 dark:text-amber-100 text-center">
                  CSR Score = 100% - (Documentation Penalty + Project Docs Penalty + Harness Penalty + Document Review Penalty)
                </p>
              </div>

              <p className="text-base text-amber-800 dark:text-amber-200">
                The CSR transforms safety from "be safe out there" into measurable accountability. It tells property managers you're a safe company, but more importantly, it tells you as a company owner how safe your business actually is. When WorkSafe shows up, you have proof. When technicians evaluate job offers, they can see your commitment. When property managers compare vendors, data speaks louder than sales pitches.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Key Features Summary */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Key Features Summary</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">75% Starting Score</p>
                  <p className="text-base text-muted-foreground">New companies start at 75%, reach 100% with three core documents</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <ClipboardCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Four Project Documents</p>
                  <p className="text-base text-muted-foreground">Tracks Anchor Inspection, Rope Access Plan, Toolbox Meeting, and FLHA per project</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Eye className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Property Manager Visibility</p>
                  <p className="text-base text-muted-foreground">PMs see your CSR in vendor selection dashboard with color-coded badges</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <TrendingDown className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Proportional Impact</p>
                  <p className="text-base text-muted-foreground">Individual misses have less impact as your work history grows</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <CircleDot className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Color-Coded Badge</p>
                  <p className="text-base text-muted-foreground">Green (90-100%), Yellow (70-89%), Orange (50-69%), Red (below 50%)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">PDF Export</p>
                  <p className="text-base text-muted-foreground">Generate signed document reports with timestamps for WorkSafe audits</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <FolderOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Cross-Module Integration</p>
                  <p className="text-base text-muted-foreground">Pulls data from Safety, Documents, Projects, and Time Tracking modules</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Clear Improvement Path</p>
                  <p className="text-base text-muted-foreground">Dashboard shows exactly what actions will increase your score</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Critical Disclaimer */}
        <section className="space-y-4">
          <Card className="border-2 border-amber-400 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-3">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">Important: Safety Compliance</p>
                  <p className="text-base text-amber-800 dark:text-amber-200">
                    The Company Safety Rating (CSR) helps document and track safety compliance, but OnRopePro is not a substitute for professional safety advice. You remain fully responsible for workplace safety and regulatory compliance including:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-200 ml-2">
                    <li>OSHA/WorkSafeBC regulations</li>
                    <li>IRATA/SPRAT certification requirements</li>
                    <li>Equipment inspection standards</li>
                    <li>Workers' compensation insurance requirements</li>
                  </ul>
                  <p className="text-base text-amber-800 dark:text-amber-200">
                    Requirements vary by jurisdiction. The CSR score is a management tool, not a certification or legal determination of safety compliance. Consult with qualified safety professionals to ensure your operations meet all legal requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Problems Solved Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl md:text-2xl font-semibold">Problems Solved</h2>
            </div>
            <Button
              onClick={toggleAllProblems}
              variant="outline"
              size="sm"
              data-testid="button-toggle-all-accordions"
            >
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {expandedProblems.length === ALL_PROBLEM_IDS.length ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            The CSR module solves different problems for different stakeholders. This section is organized by user type to help each stakeholder immediately identify the pain points most relevant to them.
          </p>

          {/* For Company Owners */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold">For Rope Access Company Owners</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="owner-1" className="border rounded-lg px-4" data-testid="accordion-owner-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I know I should be safer, but I don't have time to create all the paperwork"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Company owners know they need safety documentation but lack time to find templates online, hire someone to create PDFs, gather all employees together to review and sign. The administrative burden of proper safety documentation feels impossible alongside running actual jobs.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> An owner wants to implement safe work procedures. They would need to research requirements, create custom documents, print copies, schedule a company meeting, collect physical signatures, file paperwork, and track who signed what. This could take 2-3 full days of administrative work, time that doesn't exist during busy season.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> OnRopePro provides pre-made templates for Safe Work Procedures and Safe Work Practices covering common rope access scenarios (window washing, pressure washing, facade inspection). Owner adds documents in 2 minutes, sends notification to all employees via the app, each tech reviews and signs in 1 minute per document. Digital signatures with timestamps create an instant compliance trail.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> What would take 2-3 days of administrative work becomes a 2-minute task. Full documentation trail with legally binding digital signatures. No printing, no scheduling meetings, no chasing down paper forms.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className="border rounded-lg px-4" data-testid="accordion-owner-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"When WorkSafe shows up, I can't prove my employees know the procedures"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> WorkSafe BC investigations are relentless. They show up, find one issue, then keep digging into gear, ropes, ladders, and documentation. The question always comes: "How do you know your employees have read and understand the safety procedures?" Without proof, you're scrambling to create documentation after the fact while facing compliance orders with tight deadlines.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> After one site visit where they found an issue, an owner had to meet WorkSafe at the office two days later, create new safe work procedure documents, fill out compliance paperwork, and meet tight deadlines. "Once they show up and they find one thing, they will keep digging and digging. They don't stop until they're satisfied. And they're never satisfied."
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Export a PDF report showing all employee signatures with timestamps for every safety document. When WorkSafe asks "How do you know your employee saw it?", you pull up the report instantly. Every signature is dated, every acknowledgment is recorded.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Transform a multi-day compliance nightmare into "Here's my PDF, see all the signatures." Complete audit trail instantly available on any device.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className="border rounded-lg px-4" data-testid="accordion-owner-3">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I don't actually know how safe my company is"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Safety is typically unmeasured. Owners think they're safe but have no empirical data. You tell guys to "be safe out there" but have no visibility into whether harness inspections happen daily, whether toolbox meetings occur, whether new hires have actually read the safety manual. Problems grow invisibly until an accident happens.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> It's May, you just hired seven new technicians for busy season. You're slammed with jobs. Three weeks later you realize nobody told the new guys to sign the safety documents. You have no idea if they've done harness inspections. Your safety program exists on paper but you have no way to verify compliance.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> CSR provides a single number that instantly shows your safety posture. Score drops? You know immediately something needs attention. Dashboard shows exactly which category is causing the drop and which employees or projects are the issue.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Move from "I think we're safe" to "I know we're 87% compliant, and here's exactly what needs improvement." Real-time visibility into actual safety practices, not assumed ones.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-4" className="border rounded-lg px-4" data-testid="accordion-owner-4">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"Property managers choose competitors and I don't know why"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> When property managers compare vendors, they have no objective way to evaluate safety. Everyone claims they're safe. The company with the better pitch or lower price wins, regardless of actual safety practices. Your investment in doing things right is invisible.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> You've spent years building a safety culture. Your techs do harness inspections every day. You hold toolbox meetings. Everyone has signed the safety manual. But when bidding against a competitor who cuts corners, the property manager has no way to see the difference. Price becomes the only differentiator.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> CSR is visible to property managers in the "My Vendors" dashboard. Your 87% rating versus a competitor's 35% rating becomes visible, quantifiable evidence of your safety commitment.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Convert your actual safety investment into a competitive advantage that wins contracts. Property managers can make data-driven vendor decisions instead of guessing.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-5" className="border rounded-lg px-4" data-testid="accordion-owner-5">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"If something goes wrong, I have no defense"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> When an incident occurs, the question is always "Did you do everything reasonable to prevent this?" Without documentation, you have no defense. Even if you told employees the procedures verbally, you can't prove it. Liability falls entirely on you.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A technician decides to go down on one rope instead of two for a three-floor drop. He falls. WorkSafe investigates. "Did you tell your employees this isn't allowed?" You say yes. "Where's the documentation?" You have none. Now it's your word against a serious injury, with no proof your safety program existed.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Every safety document is signed digitally with timestamps. PDF export shows exactly which employee signed which procedure and when. If a tech violates a signed procedure, you have documented proof they knew the rules.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Risk mitigation through documented compliance. "He decided on his own free will to go down one rope. He knows our procedure. He signed it. There's nothing I can do at this point."
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Technicians */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Wrench className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold">For Rope Access Technicians</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="tech-1" className="border rounded-lg px-4" data-testid="accordion-tech-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I don't know if this company is actually safe to work for"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Technicians put their lives on the line every day. When evaluating job offers or considering a new employer, there's no way to know if a company takes safety seriously until you're already on a rope 60 stories up. Some companies say "be safe" but provide no training, no documentation, no culture of safety.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> You see two job postings. Both pay similar rates. Both claim to be professional operations. But one company has techs doing harness inspections daily, holds toolbox meetings, makes everyone sign safety procedures. The other company hands you gear and says "good luck." You have no way to tell which is which until you're already working there.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> CSR is visible to technicians when evaluating employers. Before accepting a job, you can see the company's safety rating and what it's based on.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Make informed career decisions based on data. Would you rather work for a company with a 40 CSR or a 95 CSR? Your life is literally on the line.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className="border rounded-lg px-4" data-testid="accordion-tech-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I can't access safety documents when I need them"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Paper-based safety documentation gets lost, sits in the office, isn't accessible on job sites. When a question comes up about proper procedure, you can't reference the documentation because it's not with you.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> You're on site, about to do a confined space entry. You vaguely remember something from training about SCBA placement. The paper documentation is back at the office. You make your best guess.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> All signed safety documents are accessible in the app on your phone. Need to check company policy on working alone? It's right there. Want to review the safe work procedure for the specific task? Pull it up instantly.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Always have access to the safety information you need, exactly when you need it.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-3" className="border rounded-lg px-4" data-testid="accordion-tech-3">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"My employer says safety matters but there's no accountability"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Some employers talk about safety but don't actually enforce it. They say "do your harness inspection" but never check if you did. They say "hold toolbox meetings" but don't track them. The gap between stated values and actual practice creates a culture where safety is optional.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> Your company talks about safety at every team meeting, but nobody ever follows up. Half the crew skips harness inspections. Toolbox meetings are rare. When something goes wrong, management blames the techs even though they never provided the systems to succeed.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> CSR creates accountability. When harness inspections directly impact the company's score (and that score is visible to clients), suddenly safety stops being optional. The system enforces what management says they want.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Work for companies where safety culture is backed by systems, not just words. If a company has a high CSR, you know their safety practices are actually happening, not just talked about.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Property Managers */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Globe className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-semibold">For Property Managers</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="pm-1" className="border rounded-lg px-4" data-testid="accordion-pm-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I can't objectively compare vendor safety"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> All vendors claim they're safe. Everyone has a "safety program." Without objective measurement, you rely on gut feeling, price, or whoever gives the best pitch. If something goes wrong, you have no documentation showing you did due diligence in vendor selection.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> You need to hire a rope access company for window washing on a 40-story residential tower. Three companies bid. All claim excellent safety records. You pick the cheapest one. A month later, a resident complains about unsafe practices they witnessed. You have no way to evaluate whether this is a real concern or the vendor's normal operations.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> View each vendor's CSR through the "My Vendors" dashboard. Color-coded badges (green, yellow, orange, red) provide instant assessment. Click through for detailed breakdown of what's contributing to the score.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Make data-driven vendor decisions. Document your due diligence in vendor selection. Protect your building and your liability with vendors who demonstrably prioritize safety.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pm-2" className="border rounded-lg px-4" data-testid="accordion-pm-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I have no leverage to improve vendor safety practices"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Even if you suspect a vendor has poor safety practices, what can you do? Fire them and find another vendor who might be the same? You have no metrics to point to, no way to say "improve this specific thing."
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> You've noticed your current vendor seems rushed, skips steps, doesn't always wear proper gear. But when you bring it up, they say "we're professionals, trust us." You have no data to challenge their assertion.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> CSR gives you specific, actionable visibility. "Your harness inspection completion rate is at 60%. We need that above 90% to continue working with you." The vendor knows exactly what to fix.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Move from vague concerns to specific requirements. Create vendor accountability backed by data.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator />

        {/* CSR Visibility Matrix */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">CSR Visibility Matrix</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-500" />
                  Who Can See CSR
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Crown className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Company Owners</p>
                      <p className="text-base text-muted-foreground">Full dashboard: overall score, category breakdowns, specific metrics, improvement tips</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Wrench className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Technicians</p>
                      <p className="text-base text-muted-foreground">Company CSR score when evaluating employers via job listings and company profiles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Property Managers</p>
                      <p className="text-base text-muted-foreground">Overall CSR percentage, color badge, category breakdown via "My Vendors" dashboard</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                  Who Cannot See CSR
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-violet-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Building Managers</p>
                      <p className="text-base text-muted-foreground">They handle logistics (keys, water access, site coordination), not vendor selection</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Residents</p>
                      <p className="text-base text-muted-foreground">Would create unnecessary concerns and complaints without context</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* How CSR Works */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">How CSR Works</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Starting Score</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  CSR starts at <span className="font-bold text-foreground">75%</span> for new companies. Upload your three core documents to reach 100%:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li><span className="font-medium text-foreground">Certificate of Insurance (COI)</span> - Proof of liability coverage</li>
                  <li><span className="font-medium text-foreground">Health and Safety Manual</span> - Your company's safety policies</li>
                  <li><span className="font-medium text-foreground">Company Policy</span> - General company policies and procedures</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Safe Work Documents Impact</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  When you add Safe Work Procedures or Safe Work Practices templates, your score temporarily decreases until all employees review and sign those documents. Once all signatures are collected, your score returns to full compliance.
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Why this design:</span> It ensures every team member has actually read and acknowledged your safety policies. Adding a document without ensuring it's read provides no real safety benefit.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Penalty Categories */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-rose-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Penalty Categories</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Documentation Penalty
                  </CardTitle>
                  <Badge variant="destructive">Max 25%</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">What's Tracked:</span> Certificate of Insurance (COI), Health and Safety Manual, Company Policy
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">How It Works:</span> These three documents bring your score from 75% to 100%. Missing any of them keeps you at the lower baseline.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-amber-500" />
                    Project Documents Penalty
                  </CardTitle>
                  <Badge variant="destructive">Max 25%</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">What's Tracked (per project):</span>
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li><span className="font-medium text-foreground">Anchor Inspection</span> - Verification of anchor points before use</li>
                  <li><span className="font-medium text-foreground">Rope Access Plan (RAP)</span> - Detailed plan for rope work</li>
                  <li><span className="font-medium text-foreground">Toolbox Meeting</span> - Pre-work safety discussion</li>
                  <li><span className="font-medium text-foreground">Field Level Hazard Assessment (FLHA)</span> - Site-specific hazard identification</li>
                </ul>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Important Exception:</span> Anchor inspection is waived for non-rope jobs (parkade pressure washing, ground-level work). The system recognizes when anchor inspection doesn't apply.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    Harness Inspection Penalty
                  </CardTitle>
                  <Badge variant="destructive">Max 25%</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">What's Tracked:</span> Completion rate of harness inspections across all work sessions. Each work day should have a corresponding inspection before starting work.
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">How It Calculates:</span> The penalty is a straight percentage of missing inspections. 1 miss out of 1 session = 100% penalty. 1 miss out of 100 sessions = 1% penalty. 20 misses out of 100 sessions = 20% penalty.
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Key Insight:</span> The math is simple division. As your company accumulates more work sessions, each individual miss has proportionally less impact. This rewards consistent, long-term safety compliance while not destroying your rating for occasional lapses.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Document Review Penalty
                  </CardTitle>
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100">Max 5%</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">What's Tracked:</span> Unsigned employee acknowledgments for Health and Safety Manual, Company Policy, Safe Work Procedures, and Safe Work Practices.
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">How It Works:</span> When employees haven't signed required documents, this category shows the gap. The penalty is proportional to how many employees are missing signatures.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Color-Coded Badge System */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <CircleDot className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Color-Coded Badge System</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            Your CSR displays as a color-coded badge providing instant visual assessment:
          </p>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">90+</span>
                </div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-100">Green</p>
                <p className="text-base text-emerald-800 dark:text-emerald-200">Excellent</p>
                <p className="text-base text-muted-foreground mt-1">Strong safety culture, highly compliant</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-500 mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">70+</span>
                </div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">Yellow</p>
                <p className="text-base text-yellow-800 dark:text-yellow-200">Good</p>
                <p className="text-base text-muted-foreground mt-1">Solid foundation, minor gaps to address</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-orange-500 mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">50+</span>
                </div>
                <p className="font-semibold text-orange-900 dark:text-orange-100">Orange</p>
                <p className="text-base text-orange-800 dark:text-orange-200">Warning</p>
                <p className="text-base text-muted-foreground mt-1">Significant gaps requiring attention</p>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-red-500 mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">&lt;50</span>
                </div>
                <p className="font-semibold text-red-900 dark:text-red-100">Red</p>
                <p className="text-base text-red-800 dark:text-red-200">Critical</p>
                <p className="text-base text-muted-foreground mt-1">Serious compliance issues</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Using CSR Step-by-Step */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <ListChecks className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Using CSR Step-by-Step</h2>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">1</span>
                  Upload Core Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Required Documents:</span> Certificate of Insurance (COI), Health and Safety Manual, Company Policy
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">What Happens:</span> Score increases from 75% to 100% baseline. Documents become available for employee review. Property managers can see your documentation is complete.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">2</span>
                  Add Safe Work Documents (Optional but Recommended)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Available Templates:</span> Safe Work Procedures (task-specific safety steps), Safe Work Practices (general safety guidelines)
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">What Happens:</span> Score temporarily decreases (documents added but not yet signed). Employees receive notification to review and sign. Score returns to full as employees complete signatures.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">3</span>
                  Ensure Daily Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Daily Requirements:</span> Harness inspection before starting work, Toolbox meeting for each project/work day, Project documents completed for active jobs
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">What Happens:</span> Completion rates feed into CSR calculation. Dashboard shows specific gaps. Score reflects actual daily practices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">4</span>
                  Monitor and Improve
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Dashboard Shows:</span> Overall CSR score with color indicator, category-by-category breakdown, specific metrics, prioritized improvement tips
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Actions to Take:</span> Address highest-impact gaps first. Follow up with employees who haven't signed documents. Ensure project documentation is complete before closing jobs.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* CSR Lifecycle */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">CSR Lifecycle</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950 border-b">
                <CardTitle className="text-lg">Stage 1: Initial Setup</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">Status:</span> New company, 75% baseline
                </p>
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">What Happens:</span> Account created, CSR starts at 75%, dashboard shows three required documents
                </p>
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">User Actions:</span> Upload COI, Health and Safety Manual, Company Policy. Score increases to 100%.
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950 border-b">
                <CardTitle className="text-lg">Stage 2: Active Operations</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">Status:</span> Ongoing work affecting score
                </p>
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">What Happens:</span> Work sessions tracked, harness inspections monitored, project documents tracked, employee signatures monitored
                </p>
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">User Actions:</span> Ensure daily harness inspections, complete project documentation, follow up on unsigned documents
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2 bg-emerald-50 dark:bg-emerald-950 border-b">
                <CardTitle className="text-lg">Stage 3: Continuous Improvement</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">Status:</span> Building long-term compliance history
                </p>
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">What Happens:</span> Work session count grows, individual miss impact decreases, consistent compliance builds strong score
                </p>
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">User Actions:</span> Maintain daily practices, onboard new employees to sign documents quickly, review dashboard weekly for gaps
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Terminology & Naming */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Terminology and Naming</h2>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Core Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-base space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-foreground">CSR (Company Safety Rating)</p>
                  <p className="text-muted-foreground">A penalty-based compliance score from 0-100% measuring a company's safety documentation and practices. Example: "Our CSR is 87%, down from 92% because two new hires haven't signed the safety manual yet."</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">FLHA (Field Level Hazard Assessment)</p>
                  <p className="text-muted-foreground">Site-specific hazard identification completed before starting work at a location. Example: "Before starting the facade inspection, complete the FLHA identifying anchor points and fall hazards."</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">RAP (Rope Access Plan)</p>
                  <p className="text-muted-foreground">Detailed plan for how rope access work will be conducted at a specific site. Example: "The RAP for this building specifies primary and backup anchor points on the rooftop."</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Toolbox Meeting</p>
                  <p className="text-muted-foreground">Pre-work safety discussion held before starting a work session. Example: "Morning toolbox meeting covered the construction noise on floors 5-7 and required hearing protection."</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Common Abbreviations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Abbreviation</th>
                      <th className="text-left p-3 font-medium">Full Term</th>
                      <th className="text-left p-3 font-medium">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3 font-medium">CSR</td>
                      <td className="p-3 text-muted-foreground">Company Safety Rating</td>
                      <td className="p-3 text-muted-foreground">Overall safety compliance score</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">COI</td>
                      <td className="p-3 text-muted-foreground">Certificate of Insurance</td>
                      <td className="p-3 text-muted-foreground">Proof of liability insurance coverage</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">FLHA</td>
                      <td className="p-3 text-muted-foreground">Field Level Hazard Assessment</td>
                      <td className="p-3 text-muted-foreground">Site-specific hazard checklist</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">RAP</td>
                      <td className="p-3 text-muted-foreground">Rope Access Plan</td>
                      <td className="p-3 text-muted-foreground">Detailed rope work procedure document</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">H&S</td>
                      <td className="p-3 text-muted-foreground">Health and Safety</td>
                      <td className="p-3 text-muted-foreground">General term for safety-related items</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Quantified Business Impact */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Quantified Business Impact</h2>
          </div>

          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Time Savings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead className="bg-emerald-50 dark:bg-emerald-950">
                    <tr>
                      <th className="text-left p-3 font-medium">Activity</th>
                      <th className="text-left p-3 font-medium">Before OnRopePro</th>
                      <th className="text-left p-3 font-medium">With OnRopePro</th>
                      <th className="text-left p-3 font-medium">Time Saved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3">Creating safety documents</td>
                      <td className="p-3 text-muted-foreground">16-24 hours</td>
                      <td className="p-3 text-muted-foreground">10 minutes</td>
                      <td className="p-3 font-medium text-emerald-600">15-23 hours</td>
                    </tr>
                    <tr>
                      <td className="p-3">Collecting employee signatures</td>
                      <td className="p-3 text-muted-foreground">4-8 hours</td>
                      <td className="p-3 text-muted-foreground">Automatic</td>
                      <td className="p-3 font-medium text-emerald-600">4-8 hours</td>
                    </tr>
                    <tr>
                      <td className="p-3">Preparing for WorkSafe audit</td>
                      <td className="p-3 text-muted-foreground">8-16 hours</td>
                      <td className="p-3 text-muted-foreground">5 minutes (PDF export)</td>
                      <td className="p-3 font-medium text-emerald-600">8-16 hours</td>
                    </tr>
                    <tr>
                      <td className="p-3">Tracking harness inspections</td>
                      <td className="p-3 text-muted-foreground">2-4 hours/week</td>
                      <td className="p-3 text-muted-foreground">Automatic</td>
                      <td className="p-3 font-medium text-emerald-600">2-4 hours/week</td>
                    </tr>
                    <tr>
                      <td className="p-3">Safety compliance reporting</td>
                      <td className="p-3 text-muted-foreground">2-4 hours/week</td>
                      <td className="p-3 text-muted-foreground">Real-time dashboard</td>
                      <td className="p-3 font-medium text-emerald-600">2-4 hours/week</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Risk Reduction</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="font-medium text-foreground">WorkSafe BC Investigation Costs (Avoided):</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Average investigation response time: 16-40 hours</li>
                  <li>Legal consultation: $2,000-$10,000</li>
                  <li>Compliance order response: $5,000-$25,000</li>
                  <li>Potential fines: $10,000-$100,000+</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  <span className="font-medium text-foreground">With CSR:</span> Instant documentation access, proof of employee acknowledgment, complete audit trail. Risk reduction value: $10,000-$50,000 annually.
                </p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Competitive Advantage</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="font-medium text-foreground">Contract Win Rate Improvement:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Property managers increasingly require safety documentation</li>
                  <li>Visible CSR differentiates from competitors</li>
                  <li>Estimated 10-20% improvement in win rate for safety-conscious clients</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  <span className="font-medium text-foreground">Revenue Impact:</span> 10% more contracts won multiplied by $50,000 average contract = $5,000+ additional revenue per contract opportunity.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-emerald-900 dark:text-emerald-100">Total Annual Value</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead className="bg-white dark:bg-emerald-900">
                    <tr>
                      <th className="text-left p-3 font-medium text-emerald-900 dark:text-emerald-100">Category</th>
                      <th className="text-left p-3 font-medium text-emerald-900 dark:text-emerald-100">Conservative</th>
                      <th className="text-left p-3 font-medium text-emerald-900 dark:text-emerald-100">Realistic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-200 dark:divide-emerald-800">
                    <tr>
                      <td className="p-3 text-emerald-800 dark:text-emerald-200">Time savings</td>
                      <td className="p-3 text-emerald-800 dark:text-emerald-200">$15,000</td>
                      <td className="p-3 text-emerald-800 dark:text-emerald-200">$26,250</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-emerald-800 dark:text-emerald-200">Risk reduction</td>
                      <td className="p-3 text-emerald-800 dark:text-emerald-200">$10,000</td>
                      <td className="p-3 text-emerald-800 dark:text-emerald-200">$25,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-emerald-800 dark:text-emerald-200">Revenue growth</td>
                      <td className="p-3 text-emerald-800 dark:text-emerald-200">$5,000</td>
                      <td className="p-3 text-emerald-800 dark:text-emerald-200">$15,000</td>
                    </tr>
                    <tr className="bg-white dark:bg-emerald-900">
                      <td className="p-3 font-bold text-emerald-900 dark:text-emerald-100">Total</td>
                      <td className="p-3 font-bold text-emerald-900 dark:text-emerald-100">$30,000</td>
                      <td className="p-3 font-bold text-emerald-900 dark:text-emerald-100">$66,250</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Module Integration Points */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <FolderOpen className="w-6 h-6 text-violet-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Module Integration Points</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            CSR doesn't exist in isolation. It's integrated with multiple OnRopePro modules:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Safety and Compliance Module
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Integration:</span> Harness inspection completion feeds directly into CSR calculation. Toolbox meeting records count toward project compliance. Safety document templates available for one-click addition.
                </p>
                <div className="space-y-1 mt-2">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-base">Single source of truth for all safety data</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-base">No double-entry or manual tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-base">Real-time score updates as safety activities complete</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Document Management Module
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Integration:</span> Employee signature status feeds into Document Review penalty. PDF export includes all signed documents with timestamps. Document version control ensures employees sign current versions.
                </p>
                <div className="space-y-1 mt-2">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-base">Know exactly who has/hasn't signed each document</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-base">Audit-ready exports at any time</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-base">Automatic tracking of document acknowledgments</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-amber-500" />
                  Project Management Module
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Integration:</span> Project document requirements (RAP, FLHA, Toolbox, Anchor Inspection) tracked per project. Project completion doesn't close until safety documents complete. Non-rope jobs automatically exempt from anchor inspection.
                </p>
                <div className="space-y-1 mt-2">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-base">Safety documentation tied to actual work</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-base">Can't close a project without compliance</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-base">Job-type-aware requirements</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-violet-500" />
                  Time Tracking Module
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Integration:</span> Work session count used for harness inspection penalty calculation. Session-based tracking enables proportional penalty math. Daily work activity triggers inspection requirements.
                </p>
                <div className="space-y-1 mt-2">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-base">Accurate denominator for penalty calculations</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-base">Long-term compliance history builds automatically</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-base">Individual miss impact decreases as sessions accumulate</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-500" />
                  Employee Management Module
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Integration:</span> New employee onboarding triggers document signature requirements. Employee list determines who needs to sign each document. Terminated employees excluded from active calculations.
                </p>
                <div className="grid gap-2 mt-2 md:grid-cols-3">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-base">New hires automatically prompted to sign safety documents</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-base">Clear visibility into which employees are compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-base">Turnover doesn't create false compliance gaps</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Who Benefits Most */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Who Benefits Most</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950 border-b">
                <CardTitle className="text-lg">Small Operators</CardTitle>
                <p className="text-base text-muted-foreground">1-5 technicians, under $500K revenue</p>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">Primary Pain:</span> Owner does everything, no time for paperwork
                </p>
                <div className="space-y-1">
                  <p className="text-base font-medium text-foreground">Key Benefits:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Pre-made templates eliminate document creation</li>
                    <li>Mobile-first design works in the field</li>
                    <li>Single dashboard shows everything at a glance</li>
                  </ul>
                </div>
                <p className="text-base text-muted-foreground"><span className="font-medium text-foreground">Time Saved:</span> 5-10 hours/week</p>
                <p className="text-base font-semibold text-emerald-600">Annual Value: $25,000</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950 border-b">
                <CardTitle className="text-lg">Medium Operators</CardTitle>
                <p className="text-base text-muted-foreground">5-20 technicians, $500K-$2M revenue</p>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">Primary Pain:</span> Growing team, inconsistent safety practices
                </p>
                <div className="space-y-1">
                  <p className="text-base font-medium text-foreground">Key Benefits:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Scalable system that works for any team size</li>
                    <li>Accountability without micromanagement</li>
                    <li>Visibility into who's compliant and who isn't</li>
                  </ul>
                </div>
                <p className="text-base text-muted-foreground"><span className="font-medium text-foreground">Time Saved:</span> 10-15 hours/week</p>
                <p className="text-base font-semibold text-emerald-600">Annual Value: $55,000</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2 bg-emerald-50 dark:bg-emerald-950 border-b">
                <CardTitle className="text-lg">Growing Operators</CardTitle>
                <p className="text-base text-muted-foreground">20+ technicians, $2M+ revenue</p>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">Primary Pain:</span> Can't personally verify everyone's compliance
                </p>
                <div className="space-y-1">
                  <p className="text-base font-medium text-foreground">Key Benefits:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>System-enforced compliance at scale</li>
                    <li>Data for management decisions</li>
                    <li>Documentation that satisfies enterprise clients</li>
                  </ul>
                </div>
                <p className="text-base text-muted-foreground"><span className="font-medium text-foreground">Time Saved:</span> 15-25 hours/week</p>
                <p className="text-base font-semibold text-emerald-600">Annual Value: $90,000</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quick Reference Tables */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <ListChecks className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Quick Reference Tables</h2>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Penalty Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Category</th>
                      <th className="text-left p-3 font-medium">Max Penalty</th>
                      <th className="text-left p-3 font-medium">What Triggers It</th>
                      <th className="text-left p-3 font-medium">How to Fix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3 font-medium">Documentation</td>
                      <td className="p-3 text-muted-foreground">25%</td>
                      <td className="p-3 text-muted-foreground">Missing COI, H&S Manual, or Company Policy</td>
                      <td className="p-3 text-muted-foreground">Upload the three core documents</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Project Documents</td>
                      <td className="p-3 text-muted-foreground">25%</td>
                      <td className="p-3 text-muted-foreground">Missing RAP, FLHA, Toolbox, or Anchor Inspection</td>
                      <td className="p-3 text-muted-foreground">Complete project documentation</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Harness Inspection</td>
                      <td className="p-3 text-muted-foreground">25%</td>
                      <td className="p-3 text-muted-foreground">Missed daily inspections</td>
                      <td className="p-3 text-muted-foreground">Ensure techs complete inspections before work</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Document Review</td>
                      <td className="p-3 text-muted-foreground">5%</td>
                      <td className="p-3 text-muted-foreground">Unsigned employee acknowledgments</td>
                      <td className="p-3 text-muted-foreground">Follow up with employees to sign</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Permission Requirements</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Action</th>
                      <th className="text-center p-3 font-medium">Company Owner</th>
                      <th className="text-center p-3 font-medium">Supervisor</th>
                      <th className="text-center p-3 font-medium">Technician</th>
                      <th className="text-center p-3 font-medium">Property Manager</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3">View CSR score</td>
                      <td className="p-3 text-center text-emerald-600">Full detail</td>
                      <td className="p-3 text-center text-emerald-600">Full detail</td>
                      <td className="p-3 text-center text-blue-600">Basic</td>
                      <td className="p-3 text-center text-blue-600">Vendor view</td>
                    </tr>
                    <tr>
                      <td className="p-3">Upload documents</td>
                      <td className="p-3 text-center text-emerald-600">Yes</td>
                      <td className="p-3 text-center text-amber-600">If assigned</td>
                      <td className="p-3 text-center text-muted-foreground">No</td>
                      <td className="p-3 text-center text-muted-foreground">No</td>
                    </tr>
                    <tr>
                      <td className="p-3">Sign documents</td>
                      <td className="p-3 text-center text-emerald-600">Yes</td>
                      <td className="p-3 text-center text-emerald-600">Yes</td>
                      <td className="p-3 text-center text-emerald-600">Yes</td>
                      <td className="p-3 text-center text-muted-foreground">No</td>
                    </tr>
                    <tr>
                      <td className="p-3">View employee compliance</td>
                      <td className="p-3 text-center text-emerald-600">Yes</td>
                      <td className="p-3 text-center text-amber-600">Own crew</td>
                      <td className="p-3 text-center text-blue-600">Own only</td>
                      <td className="p-3 text-center text-muted-foreground">No</td>
                    </tr>
                    <tr>
                      <td className="p-3">Export PDF reports</td>
                      <td className="p-3 text-center text-emerald-600">Yes</td>
                      <td className="p-3 text-center text-amber-600">If assigned</td>
                      <td className="p-3 text-center text-muted-foreground">No</td>
                      <td className="p-3 text-center text-muted-foreground">No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Best Practices & Tips */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Best Practices and Tips</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  For Company Owners
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <p className="font-medium text-emerald-600 mb-2">Do:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                      Upload all three core documents immediately after account creation
                    </li>
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                      Add Safe Work Procedures relevant to your work types
                    </li>
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                      Check CSR dashboard weekly to catch gaps early
                    </li>
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                      Follow up with new hires within first week to sign all documents
                    </li>
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                      Make harness inspection part of the non-negotiable morning routine
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-rose-600 mb-2">Don't:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                      Add documents without a plan to get them signed (temporarily lowers score)
                    </li>
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                      Ignore yellow warnings thinking they'll fix themselves
                    </li>
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                      Wait until WorkSafe shows up to care about compliance
                    </li>
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                      Blame technicians for low scores without providing the systems to succeed
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-2 bg-orange-50 dark:bg-orange-950 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-orange-500" />
                  For Technicians
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <p className="font-medium text-emerald-600 mb-2">Do:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                      Complete harness inspection every day before starting work
                    </li>
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                      Sign new documents promptly when notified
                    </li>
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                      Access safety documents in the app when you have questions
                    </li>
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                      Report issues with equipment through proper channels
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-rose-600 mb-2">Don't:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                      Skip harness inspection because you're "in a hurry"
                    </li>
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                      Ignore document signature requests
                    </li>
                    <li className="flex items-start gap-2 text-base text-muted-foreground">
                      <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                      Assume someone else will handle safety documentation
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* FAQs */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl md:text-2xl font-semibold">Frequently Asked Questions</h2>
            </div>
            <Button
              onClick={toggleAllFaqs}
              variant="outline"
              size="sm"
              data-testid="button-toggle-all-faqs"
            >
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {expandedFaqs.length === ALL_FAQ_IDS.length ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          <Accordion 
            type="multiple" 
            value={expandedFaqs}
            onValueChange={setExpandedFaqs}
            className="space-y-3"
          >
            <AccordionItem value="faq-1" className="border rounded-lg px-4" data-testid="accordion-faq-1">
              <AccordionTrigger className="text-left">
                <span className="font-medium">"Why does my score start at 75% instead of 100%?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground">
                <p className="text-base">
                  The 75% starting point reflects that a new company hasn't yet proven their safety documentation is in place. Uploading your three core documents (COI, Health and Safety Manual, Company Policy) immediately brings you to 100%.
                </p>
                <p className="text-base">
                  <span className="font-medium text-foreground">Why this design:</span> It incentivizes completing basic setup quickly and shows property managers that documentation is verified, not assumed.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4" data-testid="accordion-faq-2">
              <AccordionTrigger className="text-left">
                <span className="font-medium">"Why did my score drop after I added Safe Work Procedures?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground">
                <p className="text-base">
                  When you add new documents that require employee signatures, your score temporarily decreases until all employees have reviewed and signed them. Once everyone signs, your score returns to full.
                </p>
                <p className="text-base">
                  <span className="font-medium text-foreground">Why this design:</span> Adding a document without ensuring employees read it provides no real safety benefit. The temporary drop ensures documents are actually acknowledged, not just uploaded.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4" data-testid="accordion-faq-3">
              <AccordionTrigger className="text-left">
                <span className="font-medium">"Can I ever reach a perfect 100% score?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground">
                <p className="text-base">
                  Yes, but maintaining it long-term is very difficult by design. Missing even one harness inspection out of thousands of sessions will slightly reduce your score.
                </p>
                <p className="text-base">
                  <span className="font-medium text-foreground">Why this design:</span> "Nobody is 100% safe. That would just be a lie." The system acknowledges that perfection is impossible while rewarding consistent compliance.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4" data-testid="accordion-faq-4">
              <AccordionTrigger className="text-left">
                <span className="font-medium">"Who can see my company's CSR?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground">
                <p className="text-base">
                  Company owners see full detail. Technicians can see company scores when evaluating employers. Property managers see scores in their vendor dashboard. Building managers and residents cannot see CSR.
                </p>
                <p className="text-base">
                  <span className="font-medium text-foreground">Why this design:</span> CSR is a vendor selection tool for property managers and a management tool for owners. Building managers handle logistics, not vendor selection. Residents would have concerns without context.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4" data-testid="accordion-faq-5">
              <AccordionTrigger className="text-left">
                <span className="font-medium">"How does one missed harness inspection affect my score?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground">
                <p className="text-base">
                  It depends on your total work session count. If you have 1 session and miss 1 inspection, that's 100% penalty in the harness category. If you have 1,000 sessions and miss 1, that's only 0.1% penalty.
                </p>
                <p className="text-base">
                  <span className="font-medium text-foreground">Why this design:</span> Once you have many sessions, one miss won't significantly impact you. This rewards long-term consistent compliance while not destroying your rating for occasional human error.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
