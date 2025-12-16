import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  HardHat,
  Target,
  ChevronsUpDown,
  BookOpen,
  EyeOff,
  Clock,
  FileCheck,
  BarChart3,
  Link as LinkIcon,
  Lightbulb,
  HelpCircle,
  Briefcase,
  Timer,
  DollarSign,
  TrendingUp,
  Award,
  Zap,
  GraduationCap,
  CircleDot
} from "lucide-react";
import { useState } from "react";

export default function CSRGuide() {
  const allProblemIds = [
    "owner-1", "owner-2", "owner-3", "owner-4", "owner-5",
    "tech-1", "tech-2", "tech-3",
    "pm-1", "pm-2"
  ];
  const [expandedProblems, setExpandedProblems] = useState<string[]>([]);

  const toggleAllProblems = () => {
    if (expandedProblems.length === allProblemIds.length) {
      setExpandedProblems([]);
    } else {
      setExpandedProblems(allProblemIds);
    }
  };

  return (
    <ChangelogGuideLayout
      title="Company Safety Rating (CSR) Guide"
      version="2.0"
      lastUpdated="December 15, 2025"
    >
      <div className="space-y-8">
        {/* Introduction Section */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Company Safety Rating (CSR) is a penalty-based compliance scoring system that provides an empirical measurement of your company's safety posture. Property managers can view a company's CSR score to assess vendor reliability, while company owners gain real-time visibility into their actual safety compliance.
          </p>
          
          <Card className="bg-action-50 dark:bg-action-950 border-action-200 dark:border-action-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-action-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-action-900 dark:text-action-100">Starting Score: 75%</p>
                  <p className="text-base text-action-800 dark:text-action-200">
                    CSR starts at 75% and reaches 100% as soon as your company uploads the three core documents: Certificate of Insurance (COI), Health and Safety Manual, and Company Policy.
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
            <CardContent className="pt-6">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-lg font-medium text-amber-900 dark:text-amber-100 italic">
                  "CSR is not just a number for property managers. It is an empirical way to build safety into your company culture."
                </p>
              </div>
              <p className="text-base text-amber-800 dark:text-amber-200 mt-4">
                The CSR transforms safety from "be safe out there" into measurable accountability. It tells property managers you're a safe company, but more importantly, it tells you as a company owner how safe your business actually is. When WorkSafe shows up, you have proof. When technicians evaluate job offers, they can see your commitment. When property managers compare vendors, data speaks louder than sales pitches.
              </p>
              <p className="text-base text-amber-800 dark:text-amber-200 mt-3 italic bg-amber-100 dark:bg-amber-800 p-3 rounded-lg">
                "This is massive. That tells, yes, it tells the property manager that you're a safe company, but it tells you as a company owner how safe you are. How safe is your business? How safe are your employees' knowledge?" - Tommy, IRATA Level 3
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

          <div className="overflow-x-auto">
            <table className="w-full text-base border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Feature</th>
                  <th className="text-left p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    75% Starting Score
                  </td>
                  <td className="p-3 text-muted-foreground">New companies start at 75%, reach 100% with three core documents (COI, H&S Manual, Company Policy)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-emerald-500" />
                    Four Project Documents
                  </td>
                  <td className="p-3 text-muted-foreground">Tracks Anchor Inspection, Rope Access Plan, Toolbox Meeting, and FLHA per project</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4 text-violet-500" />
                    Property Manager Visibility
                  </td>
                  <td className="p-3 text-muted-foreground">PMs see your CSR in vendor selection dashboard with color-coded badges</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-amber-500" />
                    Proportional Impact
                  </td>
                  <td className="p-3 text-muted-foreground">Individual misses have less impact as your work history grows</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <CircleDot className="w-4 h-4 text-emerald-500" />
                    Color-Coded Badge
                  </td>
                  <td className="p-3 text-muted-foreground">Green (90-100%), Yellow (70-89%), Orange (50-69%), Red (below 50%)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    PDF Export
                  </td>
                  <td className="p-3 text-muted-foreground">Generate signed document reports with timestamps for WorkSafe audits</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-violet-500" />
                    Cross-Module Integration
                  </td>
                  <td className="p-3 text-muted-foreground">Pulls data from Safety, Documents, Projects, and Time Tracking modules</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Clear Improvement Path
                  </td>
                  <td className="p-3 text-muted-foreground">Dashboard shows exactly what actions will increase your score</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <Separator />

        {/* Critical Disclaimer */}
        <section className="space-y-4">
          <Card className="border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-3">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">Important: Safety Compliance</p>
                  <p className="text-base text-amber-800 dark:text-amber-200">
                    The Company Safety Rating (CSR) helps document and track safety compliance, but OnRopePro is not a substitute for professional safety advice. You remain fully responsible for workplace safety and regulatory compliance including:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-base text-amber-800 dark:text-amber-200 ml-2">
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
              <Target className="w-6 h-6 text-action-500" />
              <h2 className="text-xl md:text-2xl font-semibold">Problems Solved</h2>
            </div>
            <button
              onClick={toggleAllProblems}
              className="flex items-center gap-1 text-sm text-muted-foreground hover-elevate rounded-md px-2 py-1"
              data-testid="button-toggle-all-problems"
            >
              <ChevronsUpDown className="w-4 h-4" />
              {expandedProblems.length === allProblemIds.length ? "Collapse All" : "Expand All"}
            </button>
          </div>

          {/* For Company Owners */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Company Owners</h3>
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
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Company owners know they need safety documentation but lack time to find templates online, hire someone to create PDFs, gather all employees together to review and sign. The administrative burden of proper safety documentation feels impossible alongside running actual jobs.
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">Real Example:</span> Owner wants to implement safe work procedures. Would need to: research requirements, create custom documents, print copies, schedule company meeting, collect physical signatures, file paperwork, track who signed what. This could take 2-3 full days of administrative work, time that doesn't exist during busy season.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> OnRopePro provides pre-made templates for Safe Work Procedures and Safe Work Practices covering common rope access scenarios (window washing, pressure washing, facade inspection). Owner adds documents in 2 minutes, sends notification to all employees via the app, each tech reviews and signs in 1 minute per document.
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
                    <span className="font-medium text-foreground">Benefit:</span> What would take 2-3 days of administrative work becomes a 2-minute task. Full documentation trail with legally binding digital signatures. No printing, no scheduling meetings, no chasing down paper forms.
                  </p>
                  <p className="text-base italic border-l-4 border-amber-500 pl-4 mt-4">
                    "All of these paperwork, safer procedures, safer practices, FLHA, toolbox meeting. They're all there and they barely have to do anything except... I'm just going to upload the pre-made one for window washing, pressure washing. It's like two minutes to add the document, and it's one minute per employee to review each document." - Tommy
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className="border rounded-lg px-4" data-testid="accordion-owner-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"When WorkSafe shows up, I can't prove my employees know the procedures"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> WorkSafe BC investigations are relentless. They show up, find one issue, then keep digging into gear, ropes, ladders, and documentation. The question always comes: "How do you know your employees have read and understand the safety procedures?" Without proof, you're scrambling to create documentation after the fact while facing compliance orders with tight deadlines.
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">Real Example:</span> Tommy dealt with WorkSafe BC multiple times. After one site visit where they found an issue, he had to meet them at the office two days later with Jeff, create new safe work procedure documents, fill out compliance paperwork, and meet tight deadlines. "Once they show up and they find one thing, they will keep digging and digging... They don't stop until they're satisfied. And they're never satisfied."
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Export a PDF report showing all employee signatures with timestamps for every safety document. When WorkSafe asks "How do you know your employee saw it?", you pull up the report instantly. Every signature is dated, every acknowledgment is recorded.
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
                    <span className="font-medium text-foreground">Benefit:</span> Transform a multi-day compliance nightmare into "Here's my PDF, see all the signatures." Complete audit trail instantly available on any device.
                  </p>
                  <p className="text-base italic border-l-4 border-amber-500 pl-4 mt-4">
                    "The company can also export a PDF report that shows all of the employee that signed which document... See all the signatures here? Those are all employee signatures. And they've all seen it." - Tommy
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className="border rounded-lg px-4" data-testid="accordion-owner-3">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I don't actually know how safe my company is"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Safety is typically unmeasured. Owners think they're safe but have no empirical data. You tell guys to "be safe out there" but have no visibility into whether harness inspections happen daily, whether toolbox meetings occur, whether new hires have actually read the safety manual. Problems grow invisibly until an accident happens.
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">Real Example:</span> It's May, you just hired seven new technicians for busy season. You're slammed with jobs. Three weeks later you realize nobody told the new guys to sign the safety documents. You have no idea if they've done harness inspections. Your safety program exists on paper but you have no way to verify compliance.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> CSR provides a single number that instantly shows your safety posture. Score drops? You know immediately something needs attention. Dashboard shows exactly which category is causing the drop and which employees or projects are the issue.
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
                    <span className="font-medium text-foreground">Benefit:</span> Move from "I think we're safe" to "I know we're 87% compliant, and here's exactly what needs improvement." Real-time visibility into actual safety practices, not assumed ones.
                  </p>
                  <p className="text-base italic border-l-4 border-amber-500 pl-4 mt-4">
                    "Oh, shit, I'm at 50. What's going on? Oh, it's because it's May, and I just hired seven guys and I forgot to tell them to sign a document. Hey, guys, go in the app, find the document. Boom, you're back up at 92." - Tommy
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-4" className="border rounded-lg px-4" data-testid="accordion-owner-4">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"Property managers choose competitors and I don't know why"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> When property managers compare vendors, they have no objective way to evaluate safety. Everyone claims they're safe. The company with the better pitch or lower price wins, regardless of actual safety practices. Your investment in doing things right is invisible.
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">Real Example:</span> You've spent years building a safety culture. Your techs do harness inspections every day. You hold toolbox meetings. Everyone has signed the safety manual. But when bidding against a competitor who cuts corners, the property manager has no way to see the difference. Price becomes the only differentiator.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> CSR is visible to property managers in the "My Vendors" dashboard. Your 87% rating versus a competitor's 35% rating becomes visible, quantifiable evidence of your safety commitment.
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
                    <span className="font-medium text-foreground">Benefit:</span> Convert your actual safety investment into a competitive advantage that wins contracts. Property managers can make data-driven vendor decisions instead of guessing.
                  </p>
                  <p className="text-base italic border-l-4 border-amber-500 pl-4 mt-4">
                    "I'm going to work real hard so the property manager picks me with like an 87 rating compared to Pacific Heights with a 22 rating. Because he doesn't give a [expletive]. I want to keep that score high." - Tommy
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-5" className="border rounded-lg px-4" data-testid="accordion-owner-5">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"If something goes wrong, I have no defense"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> When an incident occurs, the question is always "Did you do everything reasonable to prevent this?" Without documentation, you have no defense. Even if you told employees the procedures verbally, you can't prove it. Liability falls entirely on you.
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">Real Example:</span> A technician decides to go down on one rope instead of two for a three-floor drop. He falls. WorkSafe investigates. "Did you tell your employees this isn't allowed?" You say yes. "Where's the documentation?" You have none. Now it's your word against a serious injury, with no proof your safety program existed.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Every safety document is signed digitally with timestamps. PDF export shows exactly which employee signed which procedure and when. If a tech violates a signed procedure, you have documented proof they knew the rules.
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
                    <span className="font-medium text-foreground">Benefit:</span> Risk mitigation through documented compliance. "He decided on his own free will to go down one rope. He knows our procedure. He signed it. There's nothing I can do at this point."
                  </p>
                  <p className="text-base italic border-l-4 border-amber-500 pl-4 mt-4">
                    "It's risk mitigation on the company owner's part as well. Like, I know that all of my people have read this document because they've signed it." - Tommy
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Technicians */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <HardHat className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Rope Access Technicians</h3>
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
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Technicians put their lives on the line every day. When evaluating job offers or considering a new employer, there's no way to know if a company takes safety seriously until you're already on a rope 60 stories up. Some companies say "be safe" but provide no training, no documentation, no culture of safety.
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">Real Example:</span> You see two job postings. Both pay similar rates. Both claim to be professional operations. But one company has techs doing harness inspections daily, holds toolbox meetings, makes everyone sign safety procedures. The other company hands you gear and says "good luck." You have no way to tell which is which until you're already working there.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> CSR is visible to technicians when evaluating employers. Before accepting a job, you can see the company's safety rating and what it's based on.
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
                    <span className="font-medium text-foreground">Benefit:</span> Make informed career decisions based on data. Would you rather work for a company with a 40 CSR or a 95 CSR? Your life is literally on the line.
                  </p>
                  <p className="text-base italic border-l-4 border-amber-500 pl-4 mt-4">
                    "It would be like, a rope tech, would you rather go work for a company that has a 40 CSR or a 95 CSR? Because that's your life. You're putting your life on the line." - Tommy
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className="border rounded-lg px-4" data-testid="accordion-tech-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I can't access safety documents when I need them"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Paper-based safety documentation gets lost, sits in the office, isn't accessible on job sites. When a question comes up about proper procedure, you can't reference the documentation because it's not with you.
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">Real Example:</span> You're on site, about to do a confined space entry. You vaguely remember something from training about SCBA placement. The paper documentation is back at the office. You make your best guess.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> All signed safety documents are accessible in the app on your phone. Need to check company policy on working alone? It's right there. Want to review the safe work procedure for the specific task? Pull it up instantly.
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
                    <span className="font-medium text-foreground">Benefit:</span> Always have access to the safety information you need, exactly when you need it.
                  </p>
                  <p className="text-base italic border-l-4 border-amber-500 pl-4 mt-4">
                    "Everybody have access to those documents. At any point, hey, I want to know my company policy about lunch break or about working alone..." - Tommy
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-3" className="border rounded-lg px-4" data-testid="accordion-tech-3">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"My employer says safety matters but there's no accountability"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Some employers talk about safety but don't actually enforce it. They say "do your harness inspection" but never check if you did. They say "hold toolbox meetings" but don't track them. The gap between stated values and actual practice creates a culture where safety is optional.
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">Real Example:</span> The company handbook says daily harness inspections are mandatory. But no one ever asks to see your inspection log. Half the crew skips it. Management doesn't seem to notice or care.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> CSR creates accountability. When harness inspections directly impact the company's score (and that score is visible to clients), suddenly safety stops being optional. The system enforces what management says they want.
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
                    <span className="font-medium text-foreground">Benefit:</span> Work for companies where safety culture is backed by systems, not just words. If a company has a high CSR, you know their safety practices are actually happening, not just talked about.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Property Managers */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Users className="w-5 h-5 text-emerald-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Property Managers</h3>
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
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> All vendors claim they're safe. Everyone has a "safety program." Without objective measurement, you rely on gut feeling, price, or whoever gives the best pitch. If something goes wrong, you have no documentation showing you did due diligence in vendor selection.
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">Real Example:</span> You need to hire a rope access company for window washing on a 40-story residential tower. Three companies bid. All claim excellent safety records. You pick the cheapest one. A month later, a resident complains about unsafe practices they witnessed. You have no way to evaluate whether this is a real concern or the vendor's normal (acceptable) operations.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> View each vendor's CSR through the "My Vendors" dashboard. Color-coded badges (green/yellow/orange/red) provide instant assessment. Click through for detailed breakdown of what's contributing to the score.
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
                    <span className="font-medium text-foreground">Benefit:</span> Make data-driven vendor decisions. Document your due diligence in vendor selection. Protect your building and your liability with vendors who demonstrably prioritize safety.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pm-2" className="border rounded-lg px-4" data-testid="accordion-pm-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I have no leverage to improve vendor safety practices"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground pb-4">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Even if you suspect a vendor has poor safety practices, what can you do? Fire them and find another vendor who might be the same? You have no metrics to point to, no way to say "improve this specific thing."
                  </p>
                  <p className="italic bg-muted p-3 rounded-lg">
                    <span className="font-medium text-foreground">Real Example:</span> You've heard from residents that the rope access crew seems rushed and doesn't always follow proper procedures. But when you raise the concern with the vendor, they assure you everything is fine. You have no data to counter their claims.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> CSR gives you specific, actionable visibility. "Your harness inspection completion rate is at 60%. We need that above 90% to continue working with you." The vendor knows exactly what to fix.
                  </p>
                  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
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
            <Eye className="w-6 h-6 text-violet-500" />
            <h2 className="text-xl md:text-2xl font-semibold">CSR Visibility Matrix</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-500" />
                  Who Can See CSR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Company Owners</p>
                    <p className="text-base text-muted-foreground">Full dashboard: overall score, category breakdowns, specific metrics, improvement tips</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Technicians</p>
                    <p className="text-base text-muted-foreground">Company CSR score when evaluating employers via job listings and company profiles</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Property Managers</p>
                    <p className="text-base text-muted-foreground">Overall CSR percentage, color badge, category breakdown in "My Vendors" dashboard</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <EyeOff className="w-5 h-5 text-rose-500" />
                  Who Cannot See CSR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Building Managers</p>
                    <p className="text-base text-muted-foreground">They handle logistics (keys, water access, site coordination), not vendor selection</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Residents</p>
                    <p className="text-base text-muted-foreground">Would create unnecessary concerns and complaints without context</p>
                  </div>
                </div>
                <p className="text-base italic border-l-4 border-violet-500 pl-4 mt-4">
                  "I don't see that being a useful thing for [building managers]... Building managers are really like the guy who gives you the keys and fixes physical problems." - Tommy
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* How CSR Works */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">How CSR Works</h2>
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-4 space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">Starting Score</h4>
                <p className="text-base text-muted-foreground">
                  CSR starts at 75% for new companies. Upload your three core documents to reach 100%:
                </p>
                <ol className="list-decimal list-inside space-y-1 mt-2 text-base text-muted-foreground ml-2">
                  <li><span className="font-medium text-foreground">Certificate of Insurance (COI)</span> - Proof of liability coverage</li>
                  <li><span className="font-medium text-foreground">Health & Safety Manual</span> - Your company's safety policies</li>
                  <li><span className="font-medium text-foreground">Company Policy</span> - General company policies and procedures</li>
                </ol>
                <p className="text-base italic border-l-4 border-blue-500 pl-4 mt-4">
                  "It starts at 75% and will reach 100% as soon as the company uploads their health and safety manual as well as their company policy and certificate of insurance." - Tommy
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-lg mb-2">Safe Work Documents Impact</h4>
                <p className="text-base text-muted-foreground">
                  When you add Safe Work Procedures or Safe Work Practices templates, your score temporarily decreases until all employees review and sign those documents. Once all signatures are collected, your score returns to full compliance.
                </p>
                <p className="text-base text-muted-foreground mt-2">
                  <span className="font-medium text-foreground">Why this design:</span> It ensures every team member has actually read and acknowledged your safety policies. Adding a document without ensuring it's read provides no real safety benefit.
                </p>
                <p className="text-base italic border-l-4 border-blue-500 pl-4 mt-4">
                  "They can go through those templates and decide which one they want to have. Once they add those as their own, then the score will go back until all employees have reviewed and signed those documents." - Tommy
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Penalty Categories */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-rose-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Penalty Categories</h2>
          </div>

          <p className="text-base text-muted-foreground mb-4">
            CSR uses a penalty-based system. Your score starts at 100% (after uploading core documents) and decreases based on compliance gaps in these four categories:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-violet-200 dark:border-violet-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-violet-500" />
                    Documentation Penalty
                  </CardTitle>
                  <Badge variant="secondary" className="bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300">Max 25%</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground mb-2">
                  <span className="font-medium text-foreground">What's Tracked:</span> Certificate of Insurance (COI), Health & Safety Manual, Company Policy
                </p>
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">How It Works:</span> These three documents bring your score from 75% to 100%. Missing any of them keeps you at the lower baseline.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-blue-500" />
                    Project Documents Penalty
                  </CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">Max 25%</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground mb-2">
                  <span className="font-medium text-foreground">What's Tracked (per project):</span> Anchor Inspection, Rope Access Plan (RAP), Toolbox Meeting, Field Level Hazard Assessment (FLHA)
                </p>
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">Important Exception:</span> Anchor inspection is waived for non-rope jobs (parkade pressure washing, ground-level work). The system recognizes when anchor inspection doesn't apply.
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-500" />
                    Harness Inspection Penalty
                  </CardTitle>
                  <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">Max 25%</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground mb-2">
                  <span className="font-medium text-foreground">What's Tracked:</span> Completion rate of harness inspections across all work sessions. Each work day should have a corresponding inspection before starting work.
                </p>
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">Key Insight:</span> The math is simple division. As your company accumulates more work sessions, each individual miss has proportionally less impact. 1 miss out of 1,000 sessions = 0.1% penalty.
                </p>
                <p className="text-base italic border-l-4 border-amber-500 pl-4 mt-3">
                  "Once you have like a thousand sessions, if you're missing one, it won't impact you all that much... I don't want anybody to have 100 because nobody is a hundred percent safe." - Tommy
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-500" />
                    Document Review Penalty
                  </CardTitle>
                  <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">Max 5%</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground mb-2">
                  <span className="font-medium text-foreground">What's Tracked:</span> Unsigned employee acknowledgments for Health & Safety Manual, Company Policy, Safe Work Procedures, Safe Work Practices
                </p>
                <p className="text-base text-muted-foreground">
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
            <Award className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Color-Coded Badge System</h2>
          </div>

          <p className="text-base text-muted-foreground mb-4">
            Your CSR displays as a color-coded badge providing instant visual assessment:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-base border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Score Range</th>
                  <th className="text-left p-3 font-semibold">Color</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">90-100%</td>
                  <td className="p-3"><Badge className="bg-emerald-500 text-white">Green</Badge></td>
                  <td className="p-3">Excellent</td>
                  <td className="p-3 text-muted-foreground">Strong safety culture, highly compliant</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">70-89%</td>
                  <td className="p-3"><Badge className="bg-amber-500 text-white">Yellow</Badge></td>
                  <td className="p-3">Good</td>
                  <td className="p-3 text-muted-foreground">Solid foundation, minor gaps to address</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">50-69%</td>
                  <td className="p-3"><Badge className="bg-orange-500 text-white">Orange</Badge></td>
                  <td className="p-3">Warning</td>
                  <td className="p-3 text-muted-foreground">Significant gaps requiring attention</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Below 50%</td>
                  <td className="p-3"><Badge className="bg-rose-500 text-white">Red</Badge></td>
                  <td className="p-3">Critical</td>
                  <td className="p-3 text-muted-foreground">Serious compliance issues</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-base italic border-l-4 border-emerald-500 pl-4 mt-4">
            "The CSR at 20% goes red. 20 to 80, I think it's yellow and then it goes green." - Tommy
          </p>
        </section>

        <Separator />

        {/* Using CSR Step-by-Step */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Using CSR: Step-by-Step</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</span>
                  Upload Core Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground mb-2">
                  <span className="font-medium text-foreground">Required Documents:</span> Certificate of Insurance (COI), Health & Safety Manual, Company Policy
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-emerald-600 border-emerald-300">Score increases from 75% to 100% baseline</Badge>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-300">Documents become available for employee review</Badge>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-300">Property managers see your documentation is complete</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">2</span>
                  Add Safe Work Documents (Optional but Recommended)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground mb-2">
                  <span className="font-medium text-foreground">Available Templates:</span> Safe Work Procedures (task-specific safety steps), Safe Work Practices (general safety guidelines)
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-amber-600 border-amber-300">Score temporarily decreases (documents added but not yet signed)</Badge>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-300">Employees receive notification to review and sign</Badge>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-300">Score returns to full as employees complete signatures</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">3</span>
                  Ensure Daily Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground mb-2">
                  <span className="font-medium text-foreground">Daily Requirements:</span> Harness inspection before starting work, Toolbox meeting for each project/work day, Project documents completed for active jobs
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-emerald-600 border-emerald-300">Completion rates feed into CSR calculation</Badge>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-300">Dashboard shows specific gaps</Badge>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-300">Score reflects actual daily practices</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">4</span>
                  Monitor and Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground mb-2">
                  <span className="font-medium text-foreground">Dashboard Shows:</span> Overall CSR score with color indicator, category-by-category breakdown, specific metrics, prioritized improvement tips
                </p>
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">Actions to Take:</span> Address highest-impact gaps first, follow up with employees who haven't signed documents, ensure project documentation is complete before closing jobs.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* CSR Lifecycle */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-violet-500" />
            <h2 className="text-xl md:text-2xl font-semibold">CSR Lifecycle</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 pb-3">
                <CardTitle className="text-lg">Stage 1: Initial Setup</CardTitle>
                <p className="text-base text-muted-foreground">New company, 75% baseline</p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div>
                  <p className="font-medium text-foreground mb-1">What Happens:</p>
                  <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground ml-2">
                    <li>Account created</li>
                    <li>CSR starts at 75%</li>
                    <li>Dashboard shows three required documents</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">User Actions:</p>
                  <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground ml-2">
                    <li>Upload COI, Health & Safety Manual, Company Policy</li>
                    <li>Score increases to 100%</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="bg-amber-50 dark:bg-amber-950 pb-3">
                <CardTitle className="text-lg">Stage 2: Active Operations</CardTitle>
                <p className="text-base text-muted-foreground">Ongoing work affecting score</p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div>
                  <p className="font-medium text-foreground mb-1">What Happens:</p>
                  <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground ml-2">
                    <li>Work sessions tracked</li>
                    <li>Harness inspections monitored</li>
                    <li>Project documents tracked</li>
                    <li>Employee signatures monitored</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">User Actions:</p>
                  <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground ml-2">
                    <li>Ensure daily harness inspections</li>
                    <li>Complete project documentation</li>
                    <li>Follow up on unsigned documents</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950 pb-3">
                <CardTitle className="text-lg">Stage 3: Continuous Improvement</CardTitle>
                <p className="text-base text-muted-foreground">Building long-term compliance history</p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div>
                  <p className="font-medium text-foreground mb-1">What Happens:</p>
                  <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground ml-2">
                    <li>Work session count grows</li>
                    <li>Individual miss impact decreases</li>
                    <li>Consistent compliance builds strong score</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">User Actions:</p>
                  <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground ml-2">
                    <li>Maintain daily practices</li>
                    <li>Onboard new employees quickly</li>
                    <li>Review dashboard weekly for gaps</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Terminology & Naming */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Terminology & Naming</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">CSR (Company Safety Rating)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">A penalty-based compliance score from 0-100% measuring a company's safety documentation and practices.</p>
                <p className="text-base text-muted-foreground italic">"Our CSR is 87%, down from 92% because two new hires haven't signed the safety manual yet."</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">FLHA (Field Level Hazard Assessment)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">Site-specific hazard identification completed before starting work at a location.</p>
                <p className="text-base text-muted-foreground italic">"Before starting the facade inspection, complete the FLHA identifying anchor points and fall hazards."</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">RAP (Rope Access Plan)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">Detailed plan for how rope access work will be conducted at a specific site.</p>
                <p className="text-base text-muted-foreground italic">"The RAP for this building specifies primary and backup anchor points on the rooftop."</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Toolbox Meeting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">Pre-work safety discussion held before starting a work session.</p>
                <p className="text-base text-muted-foreground italic">"Morning toolbox meeting covered the construction noise on floors 5-7 and required hearing protection."</p>
              </CardContent>
            </Card>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-base border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Abbreviation</th>
                  <th className="text-left p-3 font-semibold">Full Term</th>
                  <th className="text-left p-3 font-semibold">Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">CSR</td>
                  <td className="p-3">Company Safety Rating</td>
                  <td className="p-3 text-muted-foreground">Overall safety compliance score</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">COI</td>
                  <td className="p-3">Certificate of Insurance</td>
                  <td className="p-3 text-muted-foreground">Proof of liability insurance coverage</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">FLHA</td>
                  <td className="p-3">Field Level Hazard Assessment</td>
                  <td className="p-3 text-muted-foreground">Site-specific hazard checklist</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">RAP</td>
                  <td className="p-3">Rope Access Plan</td>
                  <td className="p-3 text-muted-foreground">Detailed rope work procedure document</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">H&S</td>
                  <td className="p-3">Health & Safety</td>
                  <td className="p-3 text-muted-foreground">General term for safety-related items</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <Separator />

        {/* Business Impact */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Quantified Business Impact</h2>
          </div>

          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-950 pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Timer className="w-5 h-5 text-emerald-600" />
                Time Savings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-base border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-semibold">Activity</th>
                      <th className="text-left p-3 font-semibold">Before OnRopePro</th>
                      <th className="text-left p-3 font-semibold">With OnRopePro</th>
                      <th className="text-left p-3 font-semibold">Time Saved</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Creating safety documents</td>
                      <td className="p-3 text-muted-foreground">16-24 hours</td>
                      <td className="p-3 text-muted-foreground">10 minutes</td>
                      <td className="p-3 font-medium text-emerald-600">15-23 hours</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Collecting employee signatures</td>
                      <td className="p-3 text-muted-foreground">4-8 hours</td>
                      <td className="p-3 text-muted-foreground">Automatic</td>
                      <td className="p-3 font-medium text-emerald-600">4-8 hours</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Preparing for WorkSafe audit</td>
                      <td className="p-3 text-muted-foreground">8-16 hours</td>
                      <td className="p-3 text-muted-foreground">5 minutes (PDF export)</td>
                      <td className="p-3 font-medium text-emerald-600">8-16 hours</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Tracking harness inspections</td>
                      <td className="p-3 text-muted-foreground">2-4 hours/week</td>
                      <td className="p-3 text-muted-foreground">Automatic</td>
                      <td className="p-3 font-medium text-emerald-600">2-4 hours/week</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Safety compliance reporting</td>
                      <td className="p-3 text-muted-foreground">2-4 hours/week</td>
                      <td className="p-3 text-muted-foreground">Real-time dashboard</td>
                      <td className="p-3 font-medium text-emerald-600">2-4 hours/week</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-base text-muted-foreground mt-4">
                <span className="font-medium text-foreground">Total Administrative Time Saved:</span> 30-55 hours initially + 4-8 hours/week ongoing
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-violet-200 dark:border-violet-800">
              <CardHeader className="bg-violet-50 dark:bg-violet-950 pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-600" />
                  Risk Reduction
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-base text-muted-foreground font-medium">WorkSafe BC Investigation Costs (Avoided):</p>
                <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground ml-2">
                  <li>Average investigation response time: 16-40 hours</li>
                  <li>Legal consultation: $2,000-$10,000</li>
                  <li>Compliance order response: $5,000-$25,000</li>
                  <li>Potential fines: $10,000-$100,000+</li>
                </ul>
                <p className="text-base text-emerald-600 font-medium mt-3">
                  Risk reduction value: $10,000-$50,000 annually (avoided incidents/fines)
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Competitive Advantage
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-base text-muted-foreground font-medium">Contract Win Rate Improvement:</p>
                <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground ml-2">
                  <li>Property managers increasingly require safety documentation</li>
                  <li>Visible CSR differentiates from competitors</li>
                  <li>Estimated 10-20% improvement in win rate for safety-conscious clients</li>
                </ul>
                <p className="text-base text-blue-600 font-medium mt-3">
                  Revenue Impact: $5,000+ additional revenue per contract opportunity
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader className="bg-amber-50 dark:bg-amber-950 pb-3">
              <CardTitle className="text-lg">Total Annual Value</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-base border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-semibold">Category</th>
                      <th className="text-left p-3 font-semibold">Conservative</th>
                      <th className="text-left p-3 font-semibold">Realistic</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Time savings</td>
                      <td className="p-3 text-muted-foreground">$15,000</td>
                      <td className="p-3 text-muted-foreground">$26,250</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Risk reduction</td>
                      <td className="p-3 text-muted-foreground">$10,000</td>
                      <td className="p-3 text-muted-foreground">$25,000</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Revenue growth</td>
                      <td className="p-3 text-muted-foreground">$5,000</td>
                      <td className="p-3 text-muted-foreground">$15,000</td>
                    </tr>
                    <tr className="border-b bg-emerald-50 dark:bg-emerald-950">
                      <td className="p-3 font-bold">Total</td>
                      <td className="p-3 font-bold text-emerald-600">$30,000</td>
                      <td className="p-3 font-bold text-emerald-600">$66,250</td>
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
            <LinkIcon className="w-6 h-6 text-violet-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Module Integration Points</h2>
          </div>

          <p className="text-base text-muted-foreground mb-4">
            CSR doesn't exist in isolation. It's integrated with multiple OnRopePro modules:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Safety & Compliance Module
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">
                  Harness inspection completion feeds directly into CSR calculation. Toolbox meeting records count toward project compliance. Safety document templates available for one-click addition.
                </p>
                <div className="flex items-center gap-2 text-base text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Real-time score updates as safety activities complete</span>
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
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">
                  Employee signature status feeds into Document Review penalty. PDF export includes all signed documents with timestamps. Document version control ensures employees sign current versions.
                </p>
                <div className="flex items-center gap-2 text-base text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Audit-ready exports at any time</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-violet-500" />
                  Project Management Module
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">
                  Project document requirements (RAP, FLHA, Toolbox, Anchor Inspection) tracked per project. Non-rope jobs automatically exempt from anchor inspection.
                </p>
                <div className="flex items-center gap-2 text-base text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Job-type-aware requirements</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Timer className="w-5 h-5 text-amber-500" />
                  Time Tracking Module
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">
                  Work session count used for harness inspection penalty calculation. Session-based tracking enables proportional penalty math. Daily work activity triggers inspection requirements.
                </p>
                <div className="flex items-center gap-2 text-base text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Long-term compliance history builds automatically</span>
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
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">
                  New employee onboarding triggers document signature requirements. Employee list determines who needs to sign each document. Terminated employees excluded from active calculations.
                </p>
                <div className="flex items-center gap-2 text-base text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>New hires automatically prompted to sign safety documents</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Who Benefits Most */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Who Benefits Most</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 pb-3">
                <CardTitle className="text-lg">Small Operators</CardTitle>
                <p className="text-base text-muted-foreground">1-5 technicians, under $500K revenue</p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">Primary Pain:</span> Owner does everything, no time for paperwork
                </p>
                <div>
                  <p className="font-medium text-foreground mb-1">Key Benefits:</p>
                  <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground ml-2">
                    <li>Pre-made templates eliminate document creation</li>
                    <li>Mobile-first design works in the field</li>
                    <li>Single dashboard shows everything at a glance</li>
                  </ul>
                </div>
                <p className="text-base text-blue-600 font-medium">Time Saved: 5-10 hours/week</p>
                <p className="text-base text-emerald-600 font-medium">Annual Value: $25,000</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="bg-amber-50 dark:bg-amber-950 pb-3">
                <CardTitle className="text-lg">Medium Operators</CardTitle>
                <p className="text-base text-muted-foreground">5-20 technicians, $500K-$2M revenue</p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">Primary Pain:</span> Growing team, inconsistent safety practices
                </p>
                <div>
                  <p className="font-medium text-foreground mb-1">Key Benefits:</p>
                  <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground ml-2">
                    <li>Scalable system that works for any team size</li>
                    <li>Accountability without micromanagement</li>
                    <li>Visibility into who's compliant and who isn't</li>
                  </ul>
                </div>
                <p className="text-base text-amber-600 font-medium">Time Saved: 10-15 hours/week</p>
                <p className="text-base text-emerald-600 font-medium">Annual Value: $55,000</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950 pb-3">
                <CardTitle className="text-lg">Growing Operators</CardTitle>
                <p className="text-base text-muted-foreground">20+ technicians, $2M+ revenue</p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-base text-muted-foreground">
                  <span className="font-medium text-foreground">Primary Pain:</span> Can't personally verify everyone's compliance
                </p>
                <div>
                  <p className="font-medium text-foreground mb-1">Key Benefits:</p>
                  <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground ml-2">
                    <li>System-enforced compliance at scale</li>
                    <li>Data for management decisions</li>
                    <li>Documentation that satisfies enterprise clients</li>
                  </ul>
                </div>
                <p className="text-base text-emerald-600 font-medium">Time Saved: 15-25 hours/week</p>
                <p className="text-base text-emerald-600 font-medium">Annual Value: $90,000</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Best Practices & Tips */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Best Practices & Tips</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  For Company Owners
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-emerald-600 mb-2">Do:</p>
                  <ul className="space-y-2">
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
                  <ul className="space-y-2">
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

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HardHat className="w-5 h-5 text-amber-500" />
                  For Technicians
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-emerald-600 mb-2">Do:</p>
                  <ul className="space-y-2">
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
                  <ul className="space-y-2">
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
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="faq-1" className="border rounded-lg px-4" data-testid="accordion-faq-1">
              <AccordionTrigger className="text-left">
                <span className="font-medium">Why does my score start at 75% instead of 100%?</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground pb-4">
                <p className="text-base">
                  The 75% starting point reflects that a new company hasn't yet proven their safety documentation is in place. Uploading your three core documents (COI, Health & Safety Manual, Company Policy) immediately brings you to 100%.
                </p>
                <p className="text-base">
                  <span className="font-medium text-foreground">Why this design:</span> It incentivizes completing basic setup quickly and shows property managers that documentation is verified, not assumed.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4" data-testid="accordion-faq-2">
              <AccordionTrigger className="text-left">
                <span className="font-medium">Why did my score drop after I added Safe Work Procedures?</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground pb-4">
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
                <span className="font-medium">Can I ever reach a perfect 100% score?</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground pb-4">
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
                <span className="font-medium">Who can see my company's CSR?</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground pb-4">
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
                <span className="font-medium">How does one missed harness inspection affect my score?</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground pb-4">
                <p className="text-base">
                  It depends on your total work session count. If you have 1 session and miss 1 inspection, that's 100% penalty in the harness category. If you have 1,000 sessions and miss 1, that's only 0.1% penalty.
                </p>
                <p className="text-base">
                  <span className="font-medium text-foreground">Why this design:</span> Long-term consistent compliance matters more than occasional lapses. New companies feel the impact more, incentivizing good habits from the start.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4" data-testid="accordion-faq-6">
              <AccordionTrigger className="text-left">
                <span className="font-medium">What if I do non-rope jobs that don't need anchor inspection?</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground pb-4">
                <p className="text-base">
                  The system recognizes job types. Non-rope work (parkade pressure washing, ground-level tasks) doesn't require anchor inspection, so missing it won't affect your score for those projects.
                </p>
                <p className="text-base">
                  <span className="font-medium text-foreground">Why this design:</span> Penalties should reflect actual safety requirements. Requiring anchor inspection for ground-level work would be nonsensical.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <Separator />

        {/* Future Enhancements */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-6 h-6 text-violet-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Future Enhancements</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-violet-200 dark:border-violet-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">CSR Impact Logging</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground">
                  Track where and when your company gained or lost rating points. See specific actions tied to score changes. "You lost 2% on December 10 because Worker A missed harness inspection 3 times."
                </p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Training Area</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground">
                  Watch safety videos, complete quizzes, listen to podcasts to actively improve your CSR. Demonstrate learning, not just documentation. Potential to add percentage points through verified training completion.
                </p>
                <p className="text-base italic border-l-4 border-violet-500 pl-4 mt-3">
                  "We could add some YouTube videos on there... There could be some quizzes that will give you 1% more per quiz." - Tommy
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Summary */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Summary: Why CSR Is Different</h2>
          </div>

          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-6 space-y-4">
              <p className="text-base text-amber-800 dark:text-amber-200">
                Most safety software treats compliance as checkbox exercises. OnRopePro recognizes that in rope access, safety documentation is the foundation of your entire operation, connecting:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-base text-amber-800 dark:text-amber-200 ml-2">
                <li><span className="font-medium">Documentation</span> - Proof you have policies</li>
                <li><span className="font-medium">Signatures</span> - Proof employees know policies</li>
                <li><span className="font-medium">Daily Practices</span> - Proof policies are followed</li>
                <li><span className="font-medium">Visibility</span> - Proof to clients you're trustworthy</li>
                <li><span className="font-medium">Accountability</span> - Proof to yourself you're improving</li>
              </ol>
              <p className="text-base text-amber-900 dark:text-amber-100 font-medium">
                When you use CSR, you're not just checking boxes. You're building a documented safety culture that protects your workers, your business, and your reputation.
              </p>
              <p className="text-base italic border-l-4 border-amber-600 pl-4 mt-4 bg-amber-100 dark:bg-amber-800 p-3 rounded-lg">
                "CSR is like, it goes through the entire app type of thing. It's like a fundamental component of the app itself and of the business... It is one of the nucleus modules." - Tommy
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
