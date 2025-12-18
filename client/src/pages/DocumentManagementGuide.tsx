import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  FileText,
  FolderOpen,
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Download,
  Eye,
  Lock,
  Users,
  FileCheck,
  Signature,
  AlertTriangle,
  Info,
  Archive,
  ClipboardCheck,
  BookOpen,
  FileWarning,
  PenTool,
  Building2,
  HardHat,
  Briefcase,
  Clock,
  XCircle,
  Link2,
  Calculator,
  HelpCircle,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

function ProblemsSolvedSection() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  const expandAll = () => {
    setExpandedSections([
      "owner-1", "owner-2", "owner-3", "owner-4",
      "ops-1", "ops-2",
      "pm-1",
      "tech-1", "tech-2"
    ]);
  };
  
  const collapseAll = () => {
    setExpandedSections([]);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          Problems Solved
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll} data-testid="button-expand-all-problems">
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll} data-testid="button-collapse-all-problems">
            Collapse All
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground">
        The Document Management module solves different problems for different stakeholders. Find your role below.
      </p>

      {/* For Rope Access Company Owners */}
      <Card className="border-2 border-blue-200 dark:border-blue-900">
        <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
          <CardTitle className="text-xl flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Briefcase className="w-5 h-5" />
            For Rope Access Company Owners
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
            <AccordionItem value="owner-1">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-1">
                <span className="font-semibold">"Employees Don't Actually Read Safety Documents"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>You hand an employee your company safety manual and tell them to read it. They take it, set it aside, and say "yep, I read it" without ever opening it. They just want to get on the ropes and start working. Now you have zero proof they understood your procedures, and if something goes wrong, their ignorance becomes your liability.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> A technician causes damage during a window cleaning job because they used an improper technique. When you ask why, they say "the old company I worked at didn't do it that way." They never read your procedures because there was no accountability to actually review them.
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>Digital signature capture requires employees to actively acknowledge each document. The system records who signed, when they signed, and which specific document version they reviewed. Employees cannot claim ignorance when their signature is timestamped in the system.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">100% accountability for document review. Every employee has a compliance record showing exactly which policies and procedures they acknowledged. Liability protection through documented proof of training.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-2">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-2">
                <span className="font-semibold">"Scrambling for Documents During WorkSafeBC Audits"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>WorkSafeBC shows up for an audit and you're scrambling. Paper files are scattered across filing cabinets, desk drawers, and maybe a folder on someone's computer. You have no idea who signed what, who saw what, when they saw it, or whether they saw it at all. The auditor is waiting while your operations manager digs through boxes.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> An auditor asks for proof that all employees reviewed your harness inspection procedures. Your operations manager spends 45 minutes locating scattered paper files while technicians wait on standby, unable to start work until the audit is complete.
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>Centralized document storage with instant compliance reports. Every document, signature, and acknowledgment is searchable. Generate a complete compliance report showing all employee signatures in seconds, not hours.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Audit preparation time reduced from hours to minutes. Professional presentation to regulators. Technicians stay productive while compliance is verified instantly.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-3">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-3">
                <span className="font-semibold">"Nobody Knows If Insurance Is Current"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>Your Certificate of Insurance is filed somewhere, but nobody remembers when it expires. You find out it lapsed when a building manager asks for current documentation, forcing you to scramble for a renewal that may take days. Meanwhile, you cannot legally work on that property.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> A property manager requests your current COI before approving a job. Your office manager searches for 20 minutes before finding an expired certificate. The renewal takes 3 days, and you lose the job to a competitor who had current documentation ready.
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>Upload insurance certificates with expiration date tracking. The system provides advance warnings before expiry so you can renew proactively. Restricted visibility ensures only authorized personnel access sensitive financial documents.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Never get caught with expired insurance. Proactive renewal reminders protect your ability to work. Professional response time when building managers request documentation.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-4">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-4">
                <span className="font-semibold">"This Is Your Entire Business History"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>Document management seems like just filing, but it's actually your complete institutional memory. Safety procedure evolution, policy changes, training records, incident documentation, insurance history: if you lose it, you lose your ability to prove compliance, defend against claims, or demonstrate your safety culture to clients.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>OnRopePro becomes your permanent, searchable archive. Every document version is preserved. Every signature is timestamped. Your complete compliance history is accessible from any device.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Business continuity protected. Historical compliance provable. Institutional knowledge preserved even when employees leave.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* For Operations Managers & Supervisors */}
      <Card className="border-2 border-blue-200 dark:border-blue-900">
        <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
          <CardTitle className="text-xl flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Users className="w-5 h-5" />
            For Operations Managers & Supervisors
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
            <AccordionItem value="ops-1">
              <AccordionTrigger className="text-left" data-testid="accordion-ops-1">
                <span className="font-semibold">"Some Employees Know Procedures, Some Don't, Some Think They Know"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>You have 15 technicians on payroll. Some have worked with you for years and know every procedure. New hires brought habits from previous companies that may contradict your standards. When you ask if everyone knows the fall protection procedure, you get nods, but you have no way to verify who actually reviewed the current version.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> A new hire causes a safety near-miss because they assumed your anchor point requirements matched their previous employer. They "knew" the procedure but had the wrong information.
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>Track acknowledgment status for every employee against every document. Instantly see who has signed which procedures and who has gaps. New hires cannot start work until they acknowledge all required documents.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Visibility into actual knowledge gaps. Onboarding accountability. No more assumptions about who knows what.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ops-2">
              <AccordionTrigger className="text-left" data-testid="accordion-ops-2">
                <span className="font-semibold">"Missing Acknowledgment Tracking"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>You updated the toolbox meeting procedure last month. Some employees signed the new version, some haven't seen it yet, and you have no visibility into the gap. When the next audit happens, you discover 5 employees never acknowledged the updated procedure.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>Compliance status reporting shows exactly which employees have missing acknowledgments. Dashboard alerts highlight gaps before they become audit findings.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Proactive gap identification. No audit surprises. Clear action items for outstanding signatures.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* For Building Managers & Property Managers */}
      <Card className="border-2 border-violet-200 dark:border-violet-900">
        <CardHeader className="pb-2 bg-violet-50 dark:bg-violet-950">
          <CardTitle className="text-xl flex items-center gap-2 text-violet-900 dark:text-violet-100">
            <Building2 className="w-5 h-5" />
            For Building Managers & Property Managers
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
            <AccordionItem value="pm-1">
              <AccordionTrigger className="text-left" data-testid="accordion-pm-1">
                <span className="font-semibold">"No Visibility Into Contractor Safety Practices"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>You hire rope access contractors to work on your building, but you have no way to verify their safety documentation is current and complete. If an incident occurs, you share liability exposure. OSHA penalties can reach $156,000+ per violation, and lawsuits from injured workers or residents can run into millions.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> A contractor working on your building has an incident. Investigation reveals their safety procedures weren't documented and employees hadn't acknowledged training. As the property manager who hired them, your building's insurance rates increase and you face legal exposure.
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>Building Manager Portal access shows contractor CSR (Company Safety Rating), which includes document acknowledgment rates. Verify that contractors maintain proper documentation before they work on your property.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Due diligence documentation. Reduced liability exposure. Confidence in contractor safety practices.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* For Rope Access Technicians */}
      <Card className="border-2 border-amber-200 dark:border-amber-900">
        <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950">
          <CardTitle className="text-xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
            <HardHat className="w-5 h-5" />
            For Rope Access Technicians
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
            <AccordionItem value="tech-1">
              <AccordionTrigger className="text-left" data-testid="accordion-tech-1">
                <span className="font-semibold">"Paper Documents Get Lost or Never Reviewed"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>Your employer hands you a stack of safety documents during orientation. You're eager to get working, so you flip through them quickly and sign where they point. Later, you realize you have questions about a procedure but cannot find the document you supposedly read.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>All documents accessible from your phone or tablet. Navigate to the Documents section anytime to review procedures you previously acknowledged. Your compliance status is tracked automatically.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">24/7 access to procedures. No more hunting for paperwork. Clear record of what you acknowledged.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tech-2">
              <AccordionTrigger className="text-left" data-testid="accordion-tech-2">
                <span className="font-semibold">"Safe Work Practices Acknowledgment"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>Daily safety topics feel like busywork when there's no tracking or accountability. Some technicians engage seriously while others just nod along.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>10 daily safety practice topics with employee acknowledgment and sign-off. Your participation contributes to your company's CSR score.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Meaningful safety engagement. Your contribution to company safety rating is visible. Professional development documentation.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}

export default function DocumentManagementGuide() {
  const [faqExpanded, setFaqExpanded] = useState<string[]>([]);

  return (
    <ChangelogGuideLayout 
      title="Document Management Guide"
      version="2.0"
      lastUpdated="December 12, 2025"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Document Management system provides centralized storage for all company documents with compliance tracking, employee acknowledgment workflows, and role-based access controls. Access it from the Documents section in your dashboard.
          </p>
        </section>

        {/* Golden Rule */}
        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Signature className="w-5 h-5" />
                The Golden Rule: Signatures Create Accountability
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Document + Signature = Compliance Record
                </p>
              </div>
              
              <div className="space-y-2 text-base">
                <p><strong>Every document acknowledgment creates a permanent record.</strong> The system tracks:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Who</strong>: The employee who reviewed and signed</li>
                  <li><strong>When</strong>: Timestamp of acknowledgment</li>
                  <li><strong>What</strong>: The specific document version reviewed</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-base">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Audit Trail Protection
                </p>
                <p className="mt-1">Signature records cannot be deleted or modified. This creates an immutable audit trail for safety compliance and regulatory requirements.</p>
              </div>

              <p className="text-base">
                <strong>Why This Matters:</strong> When WorkSafeBC shows up for an audit, you need instant proof that every employee reviewed your safety procedures. Paper systems fail because employees can claim they read documents they never opened. Digital signatures with timestamps eliminate "I didn't know" as an excuse and protect employers from liability.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Key Features Summary */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-action-600 dark:text-action-400" />
            Key Features Summary
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Signature className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Digital Signature Capture</p>
                    <p className="text-muted-foreground text-base">Legally binding signatures with timestamps for every document acknowledgment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Immutable Audit Trail</p>
                    <p className="text-muted-foreground text-base">Signature records cannot be deleted or modified, creating permanent compliance proof</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FolderOpen className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Centralized Storage</p>
                    <p className="text-muted-foreground text-base">All safety manuals, policies, procedures, and training docs in one searchable location</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Role-Based Access</p>
                    <p className="text-muted-foreground text-base">Different visibility levels for owners, managers, supervisors, and technicians</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClipboardCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">15 Pre-Built SWP Templates</p>
                    <p className="text-muted-foreground text-base">Industry-standard Safe Work Procedure templates with PDF export</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">10 Daily Safety Practice Topics</p>
                    <p className="text-muted-foreground text-base">Employee acknowledgment tracking that feeds into CSR</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Compliance Reporting</p>
                    <p className="text-muted-foreground text-base">Employee signature status overview with missing acknowledgment alerts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Link2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">CSR Integration</p>
                    <p className="text-muted-foreground text-base">Document acknowledgment rates feed directly into Company Safety Rating</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Critical Disclaimer */}
        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <AlertTriangle className="w-5 h-5" />
                Important: Safety Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-3 text-base">
              <p>
                OnRopePro's Document Management module helps organize, track, and document safety procedures, but <strong>you remain fully responsible for workplace safety and regulatory compliance.</strong> This software does not replace:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Qualified safety professionals and consultants</li>
                <li>IRATA/SPRAT training and certification requirements</li>
                <li>Equipment inspections by certified inspectors</li>
                <li>Adherence to all applicable OSHA/WorkSafeBC regulations</li>
                <li>Legal review of your safety policies and procedures</li>
              </ul>
              <p className="font-semibold">
                Requirements vary by jurisdiction. Consult with qualified safety consultants and employment attorneys to ensure your operations meet all legal requirements.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Problems Solved */}
        <ProblemsSolvedSection />

        <Separator />

        {/* Document Categories */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-action-600 dark:text-action-400" />
            Document Categories
          </h2>
          <p className="text-muted-foreground text-base">
            Documents are organized into categories with different access levels and workflows.
          </p>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-action-600" />
                  Health & Safety Manual
                </CardTitle>
                <CardDescription className="text-base">Core safety documentation requiring employee acknowledgment</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Upload company health and safety manual</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Track employee acknowledgment status</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Digital signature capture</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Version control with history</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">All Employees</Badge>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Requires Signature</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-purple-600" />
                  Company Policies
                </CardTitle>
                <CardDescription className="text-base">Policy documents with signature tracking for employment, conduct, and operational procedures</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Multiple policy document support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Employee signature tracking per document</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Compliance status reporting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Update notification workflow</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">All Employees</Badge>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Requires Signature</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-600" />
                  Certificate of Insurance
                </CardTitle>
                <CardDescription className="text-base">Restricted access for sensitive insurance documentation</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Upload insurance certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Expiration date tracking with advance warnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Restricted visibility (Company Owner, Ops Manager)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Professional PDF storage</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="destructive">Restricted Access</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-orange-600" />
                  Safe Work Procedures
                </CardTitle>
                <CardDescription className="text-base">15 pre-built templates with PDF generation for industry-standard procedures</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>15 industry-standard procedure templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Professional PDF export</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Customizable content</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Employee acknowledgment tracking</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">All Employees</Badge>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Requires Signature</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Safe Work Practices
                </CardTitle>
                <CardDescription className="text-base">10 daily safety topics with acknowledgment for ongoing safety culture</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>10 daily safety practice topics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Employee acknowledgment and sign-off</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Contributes to Company Safety Rating (CSR)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Engagement tracking</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">All Employees</Badge>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Requires Signature</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <FileWarning className="w-4 h-4 text-amber-600" />
                  Damage Reports
                </CardTitle>
                <CardDescription className="text-base">Equipment damage documentation with serial number linking</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Link to specific equipment serial numbers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Damage description and severity</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Follow-up action tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Connects to Gear Inventory module</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">All Employees</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Document Review Workflow */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <PenTool className="w-5 h-5 text-action-600 dark:text-action-400" />
            Document Review Workflow
          </h2>

          <div className="space-y-4">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-action-600 dark:text-action-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Manager Uploads Document</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Company owner or operations manager uploads the document with title, category, and description. File type validation ensures only appropriate formats are accepted (PDF, DOC, DOCX).
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
                    <h3 className="font-semibold">Employees Access Documents</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Employees navigate to the Documents section and view available documents. Documents requiring their signature are highlighted. Previously signed documents show acknowledgment date.
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
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Review & Sign</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      After reviewing the document content, employees provide their digital signature to acknowledge understanding. The signature is captured with timestamp and stored securely. Signature records cannot be modified or deleted.
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
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold">Compliance Record Created</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      A permanent compliance record is created with employee name, signature, and timestamp. Managers can view compliance reports showing who has signed which documents.
                    </p>
                    <div className="mt-3 space-y-1 text-base">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Compliance record stored in audit trail</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Employee status updated in dashboard</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>CSR score recalculated if applicable</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Missing acknowledgment alerts updated</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Export & Reporting */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Download className="w-5 h-5 text-action-600 dark:text-action-400" />
            Export & Reporting
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold">Compliance Reports</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Employee signature status overview</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Missing acknowledgment alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Download signature reports as PDF or CSV</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold">Bulk Export</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <Archive className="w-4 h-4 text-teal-500" />
                  <span>Date range selection for historical records</span>
                </div>
                <div className="flex items-center gap-2">
                  <Archive className="w-4 h-4 text-teal-500" />
                  <span>ZIP file download for multiple documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <Archive className="w-4 h-4 text-teal-500" />
                  <span>Professional PDF formatting for audit submission</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Role-Based Access */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Eye className="w-5 h-5 text-action-600 dark:text-action-400" />
            Role-Based Access
          </h2>

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-action-600 dark:text-action-400 mt-0.5 shrink-0" />
                <div className="space-y-3 text-base">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    Document Visibility Rules
                  </p>
                  <div className="space-y-2 text-blue-800 dark:text-blue-200">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">Company Owner</Badge>
                      <span>Full access to all documents including insurance certificates</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">Ops Manager</Badge>
                      <span>Access to all documents except restricted financial documents</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">Supervisor</Badge>
                      <span>Access to safety documents, procedures, and team compliance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">Technician</Badge>
                      <span>Access to safety documents and personal compliance tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Permission Requirements Table */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-action-600 dark:text-action-400" />
            Permission Requirements
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Action</th>
                      <th className="text-center py-2 font-semibold">Owner</th>
                      <th className="text-center py-2 font-semibold">Ops Manager</th>
                      <th className="text-center py-2 font-semibold">Supervisor</th>
                      <th className="text-center py-2 font-semibold">Technician</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2">Upload documents</td>
                      <td className="py-2 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                      <td className="py-2 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                      <td className="py-2 text-center"><XCircle className="w-4 h-4 text-muted-foreground inline" /></td>
                      <td className="py-2 text-center"><XCircle className="w-4 h-4 text-muted-foreground inline" /></td>
                    </tr>
                    <tr>
                      <td className="py-2">View all documents</td>
                      <td className="py-2 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                      <td className="py-2 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                      <td className="py-2 text-center"><Badge variant="outline" className="text-xs">Safety only</Badge></td>
                      <td className="py-2 text-center"><Badge variant="outline" className="text-xs">Safety only</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">View COI</td>
                      <td className="py-2 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                      <td className="py-2 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                      <td className="py-2 text-center"><XCircle className="w-4 h-4 text-muted-foreground inline" /></td>
                      <td className="py-2 text-center"><XCircle className="w-4 h-4 text-muted-foreground inline" /></td>
                    </tr>
                    <tr>
                      <td className="py-2">Sign documents</td>
                      <td className="py-2 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                      <td className="py-2 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                      <td className="py-2 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                      <td className="py-2 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                    </tr>
                    <tr>
                      <td className="py-2">View compliance reports</td>
                      <td className="py-2 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                      <td className="py-2 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                      <td className="py-2 text-center"><Badge variant="outline" className="text-xs">Team only</Badge></td>
                      <td className="py-2 text-center"><Badge variant="outline" className="text-xs">Own only</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Export reports</td>
                      <td className="py-2 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                      <td className="py-2 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                      <td className="py-2 text-center"><XCircle className="w-4 h-4 text-muted-foreground inline" /></td>
                      <td className="py-2 text-center"><XCircle className="w-4 h-4 text-muted-foreground inline" /></td>
                    </tr>
                    <tr>
                      <td className="py-2">Delete documents</td>
                      <td className="py-2 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                      <td className="py-2 text-center"><XCircle className="w-4 h-4 text-muted-foreground inline" /></td>
                      <td className="py-2 text-center"><XCircle className="w-4 h-4 text-muted-foreground inline" /></td>
                      <td className="py-2 text-center"><XCircle className="w-4 h-4 text-muted-foreground inline" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Quick Reference */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Quick Reference
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Document Type</th>
                      <th className="text-left py-2 font-semibold">Requires Signature</th>
                      <th className="text-left py-2 font-semibold">Access Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2">Health & Safety Manual</td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                      <td className="py-2"><Badge variant="outline">All Employees</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Company Policies</td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                      <td className="py-2"><Badge variant="outline">All Employees</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Certificate of Insurance</td>
                      <td className="py-2"><Badge variant="secondary">No</Badge></td>
                      <td className="py-2"><Badge variant="destructive">Restricted</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Safe Work Procedures</td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                      <td className="py-2"><Badge variant="outline">All Employees</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Safe Work Practices</td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                      <td className="py-2"><Badge variant="outline">All Employees</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Damage Reports</td>
                      <td className="py-2"><Badge variant="secondary">No</Badge></td>
                      <td className="py-2"><Badge variant="outline">All Employees</Badge></td>
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
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Calculator className="w-5 h-5 text-action-600 dark:text-action-400" />
            Quantified Business Impact
          </h2>

          <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                <Clock className="w-5 h-5" />
                Time Savings (Per Week)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-emerald-900 dark:text-emerald-100">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b border-emerald-300 dark:border-emerald-700">
                      <th className="text-left py-2 font-semibold">Activity</th>
                      <th className="text-left py-2 font-semibold">Before OnRopePro</th>
                      <th className="text-left py-2 font-semibold">With OnRopePro</th>
                      <th className="text-left py-2 font-semibold">Time Saved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-200 dark:divide-emerald-800">
                    <tr>
                      <td className="py-2">Audit preparation</td>
                      <td className="py-2">4-6 hours</td>
                      <td className="py-2">15 minutes</td>
                      <td className="py-2 font-semibold">3.75-5.75 hours</td>
                    </tr>
                    <tr>
                      <td className="py-2">Document distribution</td>
                      <td className="py-2">2-3 hours</td>
                      <td className="py-2">10 minutes</td>
                      <td className="py-2 font-semibold">1.8-2.8 hours</td>
                    </tr>
                    <tr>
                      <td className="py-2">Signature tracking</td>
                      <td className="py-2">1-2 hours</td>
                      <td className="py-2">Automatic</td>
                      <td className="py-2 font-semibold">1-2 hours</td>
                    </tr>
                    <tr>
                      <td className="py-2">Compliance reporting</td>
                      <td className="py-2">1-2 hours</td>
                      <td className="py-2">5 minutes</td>
                      <td className="py-2 font-semibold">0.9-1.9 hours</td>
                    </tr>
                    <tr>
                      <td className="py-2">Document retrieval</td>
                      <td className="py-2">1 hour</td>
                      <td className="py-2">Instant</td>
                      <td className="py-2 font-semibold">1 hour</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <p className="font-semibold">Total Administrative Time Saved: 8-13 hours/week</p>
                <div className="mt-2 space-y-1 text-base">
                  <p><strong>Annual Value (Conservative):</strong> 8 hours x 50 weeks x $75/hour = <strong>$30,000</strong></p>
                  <p><strong>Annual Value (Realistic):</strong> 13 hours x 50 weeks x $75/hour = <strong>$48,750</strong></p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Shield className="w-5 h-5" />
                Risk Reduction & Compliance Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-900 dark:text-blue-100 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold">Quantified Risk Mitigation:</p>
                  <ul className="space-y-1 text-base">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span><strong>100%</strong> employee acknowledgment accountability</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span><strong>100%</strong> audit trail preservation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span><strong>90%+</strong> reduction in audit preparation time</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span><strong>Zero</strong> "I didn't know" liability exposure</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Compliance Failure Costs Avoided:</p>
                  <ul className="space-y-1 text-base">
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>WorkSafeBC penalty: up to <strong>$725,524 CAD</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>OSHA serious violation: up to <strong>$16,131 USD</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>OSHA willful violation: up to <strong>$161,323 USD</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Wrongful death lawsuit: <strong>$1M-$10M+</strong></span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Module Integration Points */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Link2 className="w-5 h-5 text-action-600 dark:text-action-400" />
            Module Integration Points
          </h2>
          <p className="text-muted-foreground text-base">
            Document Management doesn't exist in isolation. It's integrated with multiple OnRopePro modules.
          </p>

          <div className="grid gap-4">
            <Card className="bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-violet-900 dark:text-violet-100">
                  <FileCheck className="w-5 h-5" />
                  Company Safety Rating (CSR)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-violet-900 dark:text-violet-100 space-y-3">
                <div>
                  <p className="font-semibold">Integration:</p>
                  <ul className="list-disc list-inside text-base ml-2 space-y-1">
                    <li>Document acknowledgment rates feed directly into CSR calculation</li>
                    <li>Safe Work Practices daily acknowledgments contribute to safety score</li>
                    <li>Missing signatures impact CSR negatively</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Business Value:</p>
                  <p className="text-base">Unified safety compliance visibility. Building managers see your documentation discipline. Competitive differentiation through demonstrable safety culture.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-violet-900 dark:text-violet-100">
                  <Users className="w-5 h-5" />
                  Employee Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-violet-900 dark:text-violet-100 space-y-3">
                <div>
                  <p className="font-semibold">Integration:</p>
                  <ul className="list-disc list-inside text-base ml-2 space-y-1">
                    <li>Employee records link to their acknowledgment history</li>
                    <li>New employee onboarding triggers required document assignments</li>
                    <li>Terminated employee records preserved for compliance history</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Business Value:</p>
                  <p className="text-base">Seamless onboarding workflow. Complete employment documentation history. Compliance maintained across employee lifecycle.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-violet-900 dark:text-violet-100">
                  <FileWarning className="w-5 h-5" />
                  Gear Inventory
                </CardTitle>
              </CardHeader>
              <CardContent className="text-violet-900 dark:text-violet-100 space-y-3">
                <div>
                  <p className="font-semibold">Integration:</p>
                  <ul className="list-disc list-inside text-base ml-2 space-y-1">
                    <li>Damage Reports link to specific equipment by serial number</li>
                    <li>Equipment incident documentation preserved</li>
                    <li>Maintenance history connected to safety documentation</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Business Value:</p>
                  <p className="text-base">Complete equipment traceability. Incident investigation support. Insurance claim documentation.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Best Practices & Tips */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-action-600 dark:text-action-400" />
            Best Practices & Tips
          </h2>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Briefcase className="w-5 h-5" />
                  For Company Owners
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <p className="font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" /> Do:
                  </p>
                  <ul className="list-disc list-inside text-base ml-6 space-y-1 mt-2">
                    <li>Upload all safety documents before employee onboarding begins</li>
                    <li>Set expiry dates on insurance certificates and renew proactively</li>
                    <li>Review compliance reports weekly to catch gaps early</li>
                    <li>Version your documents clearly so employees know which is current</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold flex items-center gap-2 text-red-700 dark:text-red-300">
                    <XCircle className="w-4 h-4" /> Don't:
                  </p>
                  <ul className="list-disc list-inside text-base ml-6 space-y-1 mt-2">
                    <li>Assume employees have read documents without signed acknowledgment</li>
                    <li>Wait for audits to verify compliance status</li>
                    <li>Allow new employees to work before completing document acknowledgments</li>
                    <li>Delete or modify signed compliance records (system prevents this anyway)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Users className="w-5 h-5" />
                  For Supervisors
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <p className="font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" /> Do:
                  </p>
                  <ul className="list-disc list-inside text-base ml-6 space-y-1 mt-2">
                    <li>Check team compliance status before each project</li>
                    <li>Follow up with technicians who have missing acknowledgments</li>
                    <li>Ensure new team members complete all document reviews</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold flex items-center gap-2 text-red-700 dark:text-red-300">
                    <XCircle className="w-4 h-4" /> Don't:
                  </p>
                  <ul className="list-disc list-inside text-base ml-6 space-y-1 mt-2">
                    <li>Sign documents on behalf of employees</li>
                    <li>Pressure employees to rush through document review</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950">
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                  <HardHat className="w-5 h-5" />
                  For Technicians
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <p className="font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" /> Do:
                  </p>
                  <ul className="list-disc list-inside text-base ml-6 space-y-1 mt-2">
                    <li>Actually read documents before signing</li>
                    <li>Access procedures from your phone when you have questions on site</li>
                    <li>Complete acknowledgments promptly to maintain your compliance status</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold flex items-center gap-2 text-red-700 dark:text-red-300">
                    <XCircle className="w-4 h-4" /> Don't:
                  </p>
                  <ul className="list-disc list-inside text-base ml-6 space-y-1 mt-2">
                    <li>Sign documents without reviewing content</li>
                    <li>Assume procedures match your previous employer</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* FAQs */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-action-600 dark:text-action-400" />
            Frequently Asked Questions
          </h2>

          <Card>
            <CardContent className="pt-6">
              <Accordion type="multiple" value={faqExpanded} onValueChange={setFaqExpanded}>
                <AccordionItem value="faq-1">
                  <AccordionTrigger className="text-left" data-testid="accordion-faq-1">
                    <span className="font-semibold">"Can I edit or delete a signed document?"</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-base space-y-2">
                    <p><strong>Answer:</strong> No. Once a document acknowledgment is signed, the signature record is permanent and cannot be modified or deleted.</p>
                    <p><strong>Why:</strong> This creates an immutable audit trail that protects both employers and employees. Regulators require tamper-proof documentation to verify compliance.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-2">
                  <AccordionTrigger className="text-left" data-testid="accordion-faq-2">
                    <span className="font-semibold">"What happens when I update a document?"</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-base space-y-2">
                    <p><strong>Answer:</strong> When you upload a new version, the system creates a new document that requires fresh acknowledgments from all employees. Previous signatures remain associated with the previous version.</p>
                    <p><strong>Why:</strong> This ensures employees always acknowledge the current procedure, not an outdated version.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3">
                  <AccordionTrigger className="text-left" data-testid="accordion-faq-3">
                    <span className="font-semibold">"Who can see my Certificate of Insurance?"</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-base space-y-2">
                    <p><strong>Answer:</strong> Only Company Owner and Ops Manager roles can view COI documents. Supervisors and Technicians cannot access these restricted financial documents.</p>
                    <p><strong>Why:</strong> Insurance certificates contain sensitive financial information that should be limited to authorized personnel.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-4">
                  <AccordionTrigger className="text-left" data-testid="accordion-faq-4">
                    <span className="font-semibold">"How do Safe Work Practices affect my CSR?"</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-base space-y-2">
                    <p><strong>Answer:</strong> Employee acknowledgment of daily safety practice topics contributes positively to your Company Safety Rating. Consistent engagement demonstrates an active safety culture.</p>
                    <p><strong>Why:</strong> CSR rewards companies that don't just have safety documents but actively engage employees with safety topics.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-5">
                  <AccordionTrigger className="text-left" data-testid="accordion-faq-5">
                    <span className="font-semibold">"Can building managers see my documents?"</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-base space-y-2">
                    <p><strong>Answer:</strong> Building managers cannot see your actual documents. They can see your CSR score, which reflects your overall safety compliance including document acknowledgment rates.</p>
                    <p><strong>Why:</strong> This protects your proprietary procedures while giving building managers confidence in your safety practices.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Summary */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-action-600 dark:text-action-400" />
            Why Document Management Is Different
          </h2>

          <Card className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6 space-y-4">
              <p className="text-base text-blue-900 dark:text-blue-100">
                <strong>Most document storage treats files as passive archives.</strong> OnRopePro recognizes that in rope access, document management is the <strong>foundation of safety compliance</strong> connecting:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span><strong>Employees</strong> - Every technician has a verified training record</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <ClipboardCheck className="w-4 h-4 text-blue-600" />
                    <span><strong>Safety procedures</strong> - Current versions acknowledged, not assumed</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span><strong>Auditors</strong> - Instant compliance proof, not scrambling</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span><strong>Building managers</strong> - Confidence in your safety culture via CSR</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span><strong>Insurance</strong> - Proactive expiry tracking, not reactive scrambling</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span><strong>Legal protection</strong> - Immutable audit trail for liability defense</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-blue-900 rounded-lg p-4 text-center mt-4">
                <p className="text-lg md:text-xl font-semibold text-blue-900 dark:text-blue-100">
                  When you use Document Management, you're not just storing files, you're building a defensible compliance history that protects your business.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
