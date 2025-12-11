import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";


import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Users,
  ChevronRight,
  ArrowRight,
  Lock,
  Eye,
  AlertTriangle,
  Info,
  Package,
  ClipboardCheck,
  Calendar,
  PenTool,
  Building2,
  Gauge,
  Download,
  HardHat,
  Activity,
  XCircle,
  CircleDot,
  Target,
  UserCheck,
  Zap,
  Calculator
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Problems Solved - Stakeholder Segmented Component
function ProblemsSolvedSection() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  const expandAll = () => {
    setExpandedSections([
      "tech-1", "tech-2", "tech-3",
      "owner-1", "owner-2", "owner-3", "owner-4", "owner-5",
      "pm-1", "pm-2"
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
        Real problems from real rope access professionals, solved through digital safety documentation.
      </p>

      {/* For Rope Access Technicians */}
      <Card className="border-2 border-red-200 dark:border-red-900">
        <CardHeader className="pb-2 bg-red-50 dark:bg-red-950">
          <CardTitle className="text-xl flex items-center gap-2 text-red-900 dark:text-red-100">
            <HardHat className="w-5 h-5" />
            For Rope Access Technicians
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
            <AccordionItem value="tech-1">
              <AccordionTrigger className="text-left" data-testid="accordion-tech-1">
                <span className="font-semibold">"Safety paperwork is annoying and slows me down"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>You arrive at site ready to work. Before you can start, you're supposed to fill out a paper form with your harness serial number, date of manufacture, and checkboxes for 11 equipment categories. It's the same form every day. You have to dig through your gear bag to find serial numbers. Most guys just skip it or fill it out at the end of the day (or not at all).</p>
                </div>
                <div className="bg-muted p-3 rounded text-xs italic">
                  <strong>Real Example:</strong> "I promise you, people skip them because I do. More often than not I just put my harness on and go. Unless I had a doubt that something may have happened to it."
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>Your personal kit is saved once with all serial numbers. During inspection, the system loads your kit automatically. For a passing inspection, you just scroll down and hit submit. It takes seconds, not minutes.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Two-second inspections instead of five-minute paper hassles. Your equipment history follows you. If you change employers, your inspection records and certifications come with you.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tech-2">
              <AccordionTrigger className="text-left" data-testid="accordion-tech-2">
                <span className="font-semibold">"If I find damaged equipment, reporting it is a hassle"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>You notice a core shot in your rope or wear on your harness. Now you have to stop work, find your supervisor, fill out paperwork, and hope someone actually removes that gear from service. Meanwhile, the damaged equipment might get used by someone else.</p>
                </div>
                <div className="bg-muted p-3 rounded text-xs italic">
                  <strong>Real Example:</strong> Damaged equipment sitting in the gear room because nobody logged it properly. Next technician grabs it, doesn't notice the damage, and now it's a safety incident waiting to happen.
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>Mark the item as FAIL during your inspection. That equipment is automatically tagged as retired in inventory. It cannot be selected for future inspections until reviewed and cleared by management. One tap removes dangerous gear from circulation.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Zero chance of damaged equipment being reused. You're protected. Your coworkers are protected. No paperwork chase required.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tech-3">
              <AccordionTrigger className="text-left" data-testid="accordion-tech-3">
                <span className="font-semibold">"I don't have proof of my safety record when switching jobs"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>You've been doing inspections, attending toolbox meetings, and maintaining a clean safety record for three years. When you apply to a new company, you have nothing to show for it. Your safety history stayed with your old employer (if they even kept records).</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>Your safety documentation, inspection history, and certifications are tied to your technician profile, not your employer. When you join a new company, your verified safety record comes with you.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Portable professional identity. Better technicians can prove they're better. Companies can verify your safety record before hiring.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* For Rope Access Company Owners */}
      <Card className="border-2 border-blue-200 dark:border-blue-900">
        <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
          <CardTitle className="text-xl flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Building2 className="w-5 h-5" />
            For Rope Access Company Owners
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
            <AccordionItem value="owner-1">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-1">
                <span className="font-semibold">"I don't know if my crews are actually doing their safety checks"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>You tell everyone to do their harness inspections. You have a policy. But when you're not on site, how do you know? Are they actually inspecting or just saying they did? If someone gets hurt, "we have a policy" isn't going to hold up when there's no documentation.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>The employer dashboard shows every work session and whether a harness inspection form was actually submitted, not just whether someone clicked "yes I did it." Green checkmarks only appear when real forms are completed.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Actual visibility, not assumed compliance. If an employee lies about doing their check, you can see the gap. If WorkSafeBC investigates, you have timestamped proof of who did what.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-2">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-2">
                <span className="font-semibold">"Paper forms get lost, and I need to keep them for 7 years"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>Regulations require you to retain safety documentation for years. Paper forms get coffee-stained, lost in truck cabs, misfiled, or destroyed. When an auditor asks for records from 2022, you're digging through boxes hoping you can find something.</p>
                </div>
                <div className="bg-muted p-3 rounded text-xs italic">
                  <strong>Real Example:</strong> "A form every day with harness serial number, date of manufacture, bunch of check marks, all paper. Everyone has their own form. We sign it and it's getting stored for like seven years or something."
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>Digital forms with legally-binding signatures stored permanently. Searchable by date, employee, project, or equipment. Export to PDF instantly for any audit request.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Seven years of documentation accessible in seconds. No storage boxes. No lost forms. Instant audit response capability.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-3">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-3">
                <span className="font-semibold">"I don't know my company's actual safety compliance status"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>You think you're a safe company. You have policies. But are your crews actually following them? Are all the required documents uploaded? Have employees reviewed and signed the safety manual? You're flying blind.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>Company Safety Rating (CSR) provides real-time visibility into compliance gaps. Missing harness inspections? CSR drops. No health & safety manual uploaded? CSR drops. Employees haven't signed document reviews? You see it immediately.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Real-time compliance visibility. No more guessing. Address gaps before they become incidents or audit failures.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-4">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-4">
                <span className="font-semibold">"Incident reports don't get filed until days later (or never)"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>Something happens on site. Maybe a near-miss, maybe minor damage. Crews keep working. "We'll report it later." Later becomes tomorrow. Tomorrow becomes next week. Details get fuzzy. The incident never gets documented, or the report is filed so late that critical details are wrong.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>Mobile-first incident reporting. Capture details immediately while they're fresh. Photos, witness statements, root cause analysis, all on the phone, all timestamped, all stored permanently.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Accurate incident documentation. Legal protection. Evidence for corrective actions. No more "what happened again?" conversations three days later.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-5">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-5">
                <span className="font-semibold">"When clients request an audit, I scramble to find documentation"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>A flower pot gets knocked off a balcony. A resident complains. WorkSafeBC gets involved. Insurance company requests documentation. Client demands to see your safety records. Now you're digging through filing cabinets, calling supervisors, trying to piece together what happened.</p>
                </div>
                <div className="bg-muted p-3 rounded text-xs italic">
                  <strong>Real Example:</strong> "There was an incident on their building... the guy is coming down and he knocks a flower pot that was on some railing and the flower pot fell on one of the residents' head and now it's a big deal and then everybody needs everybody's insurance and paperwork and WorkSafe BC gets involved."
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>All safety documentation instantly available. Harness inspections, toolbox meetings, FLHAs, incident reports, searchable and exportable as professional PDFs with embedded signatures.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Audit response in minutes, not days. Professional documentation impresses clients and regulators. Legal protection through comprehensive records.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* For Property Managers & Building Owners */}
      <Card className="border-2 border-green-200 dark:border-green-900">
        <CardHeader className="pb-2 bg-green-50 dark:bg-green-950">
          <CardTitle className="text-xl flex items-center gap-2 text-green-900 dark:text-green-100">
            <Building2 className="w-5 h-5" />
            For Property Managers & Building Owners
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
            <AccordionItem value="pm-1">
              <AccordionTrigger className="text-left" data-testid="accordion-pm-1">
                <span className="font-semibold">"I have no way to verify if contractors are actually following safety procedures"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>You hire a rope access company to wash windows. You assume they're safe because they said so. But how would you know? If something goes wrong, a worker falls, equipment damages the building, a resident gets hurt, you're exposed. "We thought they were following safety procedures" isn't a defense.</p>
                </div>
                <div className="bg-muted p-3 rounded text-xs italic">
                  <strong>Real Example:</strong> OSHA penalties for failing to ensure contractor safety compliance can reach $156,259 per violation. Building owners can be held liable for contractor safety failures on their property.
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>Property managers can view the Company Safety Rating (CSR) for any vendor working on their building. See whether inspections are being done, whether toolbox meetings are happening, whether documentation is complete.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Vendor accountability. Due diligence documentation. Liability protection through verified compliance visibility.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pm-2">
              <AccordionTrigger className="text-left" data-testid="accordion-pm-2">
                <span className="font-semibold">"I can't compare vendor safety records when choosing contractors"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p>Three companies bid on your window washing contract. They all claim to be "safety focused." How do you actually compare? You're choosing based on price and promises, not verified safety performance.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p>CSR scores provide objective, verifiable safety metrics. Compare vendors based on documented compliance, not marketing claims.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1">Data-driven vendor selection. Choose the safest contractors, not just the cheapest. Protect your building and residents with verified compliance.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Important Disclaimer */}
      <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
        <CardContent className="pt-4 text-base text-amber-900 dark:text-amber-100">
          <p className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4" />
            Important: Safety Compliance Responsibility
          </p>
          <p className="mt-2 text-sm">
            OnRopePro helps document safety procedures, but <strong>you remain fully responsible for workplace safety and regulatory compliance.</strong> This software does not replace qualified safety professionals, IRATA/SPRAT training, equipment inspections by certified inspectors, or adherence to all applicable OSHA/WorkSafeBC regulations. Consult with qualified safety consultants to ensure your operations meet all legal requirements.
          </p>
        </CardContent>
      </Card>

      {/* Who This Isn't For */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="pt-4 text-base">
          <p className="flex items-center gap-2 font-semibold">
            <XCircle className="w-4 h-4 text-red-600" />
            Not for Unsafe Companies
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            If you're a company that doesn't prioritize worker safety, this software isn't for you. OnRopePro is built for companies that care about keeping their technicians safe. The transparency is a feature, not a bug. If you don't want visibility into your safety compliance, keep using paper forms.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

export default function SafetyGuide() {
  return (
    <ChangelogGuideLayout 
      title="Safety & Compliance Guide"
      version="2.0"
      lastUpdated="December 5, 2025"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Safety & Compliance system ensures all rope access work is documented, inspected, and compliant with IRATA, OSHA, and industry regulations. It provides <strong>digital capture of safety documentation</strong>, legally-binding digital signatures, professional PDF generation, and feeds into the <strong>Company Safety Rating (CSR)</strong> visible to property managers.
          </p>
        </section>

        {/* THE GOLDEN RULE */}
        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <AlertTriangle className="w-5 h-5" />
                The Golden Rule: Complete Safety Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  No Documentation Gaps
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Every work session requires supporting safety documentation.</strong> The system tracks compliance across three key areas:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Harness Inspections</strong>: Daily equipment verification before work begins</li>
                  <li><strong>Toolbox Meetings</strong>: Daily team safety briefings for each project</li>
                  <li><strong>Company Documentation</strong>: Health & Safety Manual, Company Policy, Certificate of Insurance</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Visible to Property Managers
                </p>
                <p className="mt-1">Missing documentation creates gaps visible in your Company Safety Rating (CSR). Property managers can view your compliance status when evaluating contractors.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <HardHat className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                  <p className="font-bold">Harness Inspections</p>
                  <p className="text-xs">Daily before work</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-action-600" />
                  <p className="font-bold">Toolbox Meetings</p>
                  <p className="text-xs">Daily per project</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="font-bold">Company Docs</p>
                  <p className="text-xs">Current and uploaded</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Problems Solved - Stakeholder Segmented */}
        <ProblemsSolvedSection />

        <Separator />

        {/* TWO ENTRY POINTS - Critical Architecture */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Two Entry Points: Understanding the Dual-Path System
          </h2>
          <p className="text-base text-muted-foreground">
            Safety compliance is tracked through <strong>two distinct pathways</strong> that both impact your Company Safety Rating. Understanding where to go for each task is critical.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Equipment Path */}
            <Card className="border-2 border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Package className="w-6 h-6 text-purple-600" />
                  <CardTitle className="text-xl md:text-2xl font-semibold text-purple-900 dark:text-purple-100">
                    Path A: Equipment Area
                  </CardTitle>
                </div>
                <CardDescription className="text-purple-800 dark:text-purple-200">
                  Physical gear inspection before work
                </CardDescription>
              </CardHeader>
              <CardContent className="text-base text-purple-900 dark:text-purple-100 space-y-3">
                <div className="bg-purple-100 dark:bg-purple-800 rounded p-2">
                  <p className="font-semibold">What happens here:</p>
                  <p className="text-xs mt-1">Harness Inspections</p>
                </div>
                <ul className="list-disc list-inside space-y-1 text-base">
                  <li>Triggered when starting work session</li>
                  <li>Links to your assigned personal gear kit</li>
                  <li>Inspects 11 equipment categories</li>
                  <li>Single technician signature</li>
                </ul>
                <div className="flex items-center gap-2 text-xs bg-white dark:bg-purple-900 p-2 rounded">
                  <Gauge className="w-4 h-4" />
                  <span><strong>CSR Impact:</strong> 25% penalty if inspections missing</span>
                </div>
              </CardContent>
            </Card>

            {/* Documentation Path */}
            <Card className="border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-action-600" />
                  <CardTitle className="text-xl md:text-2xl font-semibold text-action-900 dark:text-action-100">
                    Path B: Safety Forms Section
                  </CardTitle>
                </div>
                <CardDescription className="text-blue-800 dark:text-blue-200">
                  Team documentation and hazard assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="text-base text-blue-900 dark:text-blue-100 space-y-3">
                <div className="bg-blue-100 dark:bg-blue-800 rounded p-2">
                  <p className="font-semibold">What happens here:</p>
                  <p className="text-xs mt-1">Toolbox Meetings, FLHA, Incidents, Method Statements</p>
                </div>
                <ul className="list-disc list-inside space-y-1 text-base">
                  <li>Team safety briefings with all attendee signatures</li>
                  <li>Field-level hazard assessments</li>
                  <li>Incident reporting and investigation</li>
                  <li>Safe work procedure documentation</li>
                </ul>
                <div className="flex items-center gap-2 text-xs bg-white dark:bg-blue-900 p-2 rounded">
                  <Gauge className="w-4 h-4" />
                  <span><strong>CSR Impact:</strong> 25% penalty for uncovered work sessions</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-4 text-base text-amber-900 dark:text-amber-100">
              <p className="flex items-center gap-2 font-semibold">
                <Info className="w-4 h-4" />
                Why Two Paths?
              </p>
              <p className="mt-1">Equipment inspections are <strong>individual</strong> (each tech inspects their own gear) and tied to the moment before work begins. Safety documentation is often <strong>team-based</strong> (one meeting covers multiple workers) and can be completed before, during, or after work sessions.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Toolbox Meetings: Daily Safety Briefings */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-action-600 dark:text-action-400" />
            Toolbox Meetings: Daily Safety Briefings
          </h2>
          
          <Card className="border-2 border-action-500 bg-action-50 dark:bg-action-950">
            <CardContent className="pt-6 text-action-900 dark:text-action-100 space-y-4">
              <div className="bg-white dark:bg-action-900 rounded-lg p-4 text-center">
                <p className="text-xl font-mono font-bold">
                  Daily Briefings for Every Active Project
                </p>
              </div>

              <div className="text-sm space-y-3">
                <p><strong>Toolbox meetings are available in every project</strong> and serve as the primary team safety briefing mechanism.</p>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-action-100 dark:bg-action-800 rounded p-3">
                    <p className="font-semibold flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4" />
                      When to Hold Meetings
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>At least once daily for every active job</li>
                      <li>Whenever conditions change (weather, location, new hazards)</li>
                      <li>When equipment or procedures change</li>
                      <li>At the start of new project phases</li>
                    </ul>
                  </div>
                  
                  <div className="bg-action-100 dark:bg-action-800 rounded p-3">
                    <p className="font-semibold flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4" />
                      Topics to Cover
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>PPE requirements and condition</li>
                      <li>Rope and anchor inspection reminders</li>
                      <li>Weather precautions</li>
                      <li>Emergency procedures</li>
                      <li>Site-specific hazards</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-action-100 dark:bg-action-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  How It Works
                </p>
                <p className="mt-1">Anyone with project access can create a toolbox meeting. Select all attendees present, and <strong>all selected attendees must sign</strong> before the meeting can be submitted. Each meeting is timestamped and tied to the specific project.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Five Safety Document Types */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Five Safety Document Types
          </h2>
          <p className="text-base text-muted-foreground">Each document type serves a specific purpose in the safety workflow:</p>

          <div className="space-y-3">
            {/* Harness Inspection */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">
                    <HardHat className="w-5 h-5 text-red-600" />
                    1. Harness Inspection
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="destructive">Required Daily</Badge>
                    <Badge variant="outline">Work Blocker</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p><strong>Purpose:</strong> Pre-work verification of personal protective equipment condition.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>11 Equipment Categories:</strong></p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">Harness</Badge>
                    <Badge variant="secondary">Helmet</Badge>
                    <Badge variant="secondary">Descender</Badge>
                    <Badge variant="secondary">Ascender</Badge>
                    <Badge variant="secondary">Chest Ascender</Badge>
                    <Badge variant="secondary">Working Rope</Badge>
                    <Badge variant="secondary">Safety Rope</Badge>
                    <Badge variant="secondary">Anchors</Badge>
                    <Badge variant="secondary">Connectors</Badge>
                    <Badge variant="secondary">Lanyards</Badge>
                    <Badge variant="secondary">Backup Device</Badge>
                  </div>
                </div>
                <p><strong>Signature:</strong> Single technician (inspector)</p>
                <p><strong>CSR Impact:</strong> 25% maximum penalty for missing inspections</p>
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-3 text-sm space-y-2">
                  <p className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <Zap className="w-4 h-4" />
                    <strong>Speed Note:</strong> For routine passing inspections, completion takes seconds. The form defaults to PASS and technicians simply scroll and submit. Only failed items require detailed notes.
                  </p>
                  <p className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <Package className="w-4 h-4" />
                    <strong>Auto-Retirement:</strong> When equipment is marked as FAIL, it is automatically tagged as retired in the Inventory module. Failed equipment cannot be selected for future inspections until reviewed and cleared.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Toolbox Meeting */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-action-600" />
                    2. Toolbox Meeting
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className="bg-action-600">Team Document</Badge>
                    <Badge variant="outline">Daily Per Project</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p><strong>Purpose:</strong> Daily team safety briefing covering hazards, procedures, and emergency plans specific to that day's work.</p>
                <div className="bg-muted p-3 rounded text-sm">
                  <p><strong>Key Fields:</strong> Meeting topic, safety topics discussed, attendee list, signatures from all attendees</p>
                </div>
                <p><strong>Signature:</strong> All attendees must sign (enforced by system)</p>
                <p><strong>Frequency:</strong> One meeting daily per active project. Additional meetings required when conditions change.</p>
                <p><strong>CSR Impact:</strong> 25% maximum penalty for uncovered work sessions</p>
              </CardContent>
            </Card>

            {/* FLHA */}
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    3. FLHA (Field Level Hazard Assessment)
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">Optional</Badge>
                    <Badge variant="secondary" className="text-xs">Daily Requirement Coming Soon</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p><strong>Purpose:</strong> Site-specific hazard identification and control measures before work begins.</p>
                <div className="bg-muted p-3 rounded text-sm">
                  <p><strong>Key Fields:</strong> Location, work description, identified hazards, control measures, weather conditions</p>
                </div>
                <p><strong>Signature:</strong> Assessor signature required</p>
                <p><strong>CSR Impact:</strong> Does not directly impact CSR currently (best practice documentation). FLHA will become a daily requirement and impact CSR in a future update.</p>
              </CardContent>
            </Card>

            {/* Incident Report */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-purple-600" />
                    4. Incident Report
                  </CardTitle>
                  <Badge variant="outline">As Needed</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p><strong>Purpose:</strong> Documentation of safety incidents, near-misses, injuries, or property damage.</p>
                <div className="bg-muted p-3 rounded text-sm">
                  <p><strong>Key Fields:</strong> Incident type, severity, injured persons, witnesses, root cause analysis, corrective actions, regulatory reporting</p>
                </div>
                <p><strong>Signature:</strong> Reporter, supervisor, and management signatures supported</p>
                <p><strong>CSR Impact:</strong> Incident history visible in CSR breakdown</p>
              </CardContent>
            </Card>

            {/* Method Statement */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-green-600" />
                    5. Method Statement
                  </CardTitle>
                  <Badge variant="outline">As Needed</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p><strong>Purpose:</strong> Detailed safe work procedures for specific tasks or projects.</p>
                <div className="bg-muted p-3 rounded text-sm">
                  <p><strong>Key Fields:</strong> Work description, step-by-step procedures, equipment required, safety measures, emergency procedures</p>
                </div>
                <p><strong>Signature:</strong> Author and approver signatures</p>
                <p><strong>CSR Impact:</strong> Does not directly impact CSR (planning documentation)</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* CSR Breakdown */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Gauge className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Company Safety Rating (CSR) Breakdown
          </h2>
          <p className="text-base text-muted-foreground">
            The CSR is a penalty-based rating visible to property managers. Starting at 100%, penalties reduce the score based on compliance gaps.
          </p>

          <Card className="border-2 border-cyan-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl font-semibold text-center">CSR Calculation Formula</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-xl font-mono font-bold">
                  CSR = 100% - (Penalties)
                </p>
                <p className="text-sm text-muted-foreground mt-2">Maximum penalty: 80% (minimum score: 20%)</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Penalty Components:</h4>
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium">Company Documentation</span>
                    </div>
                    <Badge variant="destructive">Up to 25%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Missing Certificate of Insurance, Health & Safety Manual, or Company Policy</p>

                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-action-600" />
                      <span className="text-sm font-medium">Toolbox Meeting Coverage</span>
                    </div>
                    <Badge className="bg-action-600">Up to 25%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Work sessions without a same-day toolbox meeting for that project</p>

                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2">
                      <HardHat className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Harness Inspections</span>
                    </div>
                    <Badge className="bg-purple-600">Up to 25%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Work sessions without valid same-day harness inspection</p>

                  <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium">Document Reviews</span>
                    </div>
                    <Badge className="bg-amber-600">Up to 5%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Employee document acknowledgments pending signature</p>
                </div>
              </div>

              <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
                <CardContent className="pt-4 text-base text-amber-900 dark:text-amber-100">
                  <p className="flex items-center gap-2 font-semibold">
                    <Building2 className="w-4 h-4" />
                    Property Manager Visibility
                  </p>
                  <p className="mt-1">Property managers can view your company's CSR score with a detailed breakdown. This transparency builds trust and demonstrates your commitment to safety compliance.</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Digital Signatures */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <PenTool className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Digital Signature System
          </h2>

          <div className="space-y-3">
            <Card>
              <CardContent className="pt-4 text-base space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Legally Binding</p>
                    <p className="text-muted-foreground">All signatures are captured as base64 data URLs with timestamps, creating an immutable audit trail.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Immutable Once Signed</p>
                    <p className="text-muted-foreground">Once a safety document is signed and submitted, it cannot be modified. This ensures compliance integrity.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-action-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">PDF Generation</p>
                    <p className="text-muted-foreground">All safety documents can be exported as professional PDFs with embedded signatures for audit purposes.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
              <CardContent className="pt-4 text-base text-red-900 dark:text-red-100">
                <p className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  Toolbox Meeting Signature Enforcement
                </p>
                <p className="mt-1">All selected attendees for a toolbox meeting <strong>must sign</strong> before submission. The system validates that every attendee ID has a corresponding signature. Missing signatures block form submission.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Step-by-Step Workflows */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Step-by-Step Workflows
          </h2>

          <div className="space-y-4">
            {/* Workflow 1: Complete Harness Inspection */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600">Workflow 1</Badge>
                    <CardTitle>Complete Harness Inspection (Daily)</CardTitle>
                  </div>
                  <Badge variant="outline">Required</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Go to <strong>Dashboard</strong> and click <strong>Start Day</strong> on a project</li>
                  <li>If no inspection today, system shows harness inspection prompt</li>
                  <li>Select your <strong>Personal Kit</strong> (if you have assigned gear)</li>
                  <li>For each equipment category, mark as:
                    <ul className="list-disc list-inside ml-4 mt-1 text-muted-foreground">
                      <li><span className="text-green-600">Pass</span> - Equipment in good condition</li>
                      <li><span className="text-amber-600">N/A</span> - Not applicable or not using</li>
                      <li><span className="text-red-600">Fail</span> - Equipment needs attention</li>
                    </ul>
                  </li>
                  <li>Add notes for any concerns or failed items</li>
                  <li>Provide your <strong>digital signature</strong></li>
                  <li>Click <strong>Submit Inspection</strong></li>
                </ol>
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Result:</strong> Inspection saved. You can now start work sessions for the rest of the day.
                </div>
              </CardContent>
            </Card>

            {/* Workflow 2: Create Toolbox Meeting */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600">Workflow 2</Badge>
                    <CardTitle>Create Toolbox Meeting (Daily)</CardTitle>
                  </div>
                  <Badge variant="outline">Required Daily</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Navigate to <strong>Toolbox Meeting</strong> page (or project page safety button)</li>
                  <li>Select the <strong>Project</strong> this meeting covers</li>
                  <li>Enter <strong>Meeting Topic</strong> and <strong>Safety Topics Discussed</strong></li>
                  <li>Select all <strong>Attendees</strong> who are present</li>
                  <li>Have each attendee provide their <strong>digital signature</strong></li>
                  <li>Verify all attendees have signed (system will block if missing)</li>
                  <li>Click <strong>Submit Meeting</strong></li>
                </ol>
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Result:</strong> Meeting saved and timestamped for that day's work. Hold additional meetings whenever conditions change (weather, location, hazards).
                </div>
              </CardContent>
            </Card>

            {/* Workflow 3: Submit FLHA */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-600">Workflow 3</Badge>
                    <CardTitle>Submit FLHA Form</CardTitle>
                  </div>
                  <Badge variant="outline">Best Practice</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Navigate to <strong>FLHA Form</strong> page</li>
                  <li>Select the <strong>Project</strong> and <strong>Location</strong></li>
                  <li>Describe the <strong>Work to be Performed</strong></li>
                  <li>Complete the <strong>Hazard Checklist</strong> (weather, equipment, site conditions)</li>
                  <li>Document <strong>Control Measures</strong> for identified hazards</li>
                  <li>Provide your <strong>digital signature</strong></li>
                  <li>Click <strong>Submit FLHA</strong></li>
                </ol>
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Result:</strong> FLHA saved and available for PDF export. Documents site-specific safety planning.
                </div>
              </CardContent>
            </Card>

            {/* Workflow 4: Report Incident */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600">Workflow 4</Badge>
                    <CardTitle>Report Safety Incident</CardTitle>
                  </div>
                  <Badge variant="outline">As Needed</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Navigate to <strong>Incident Report</strong> page</li>
                  <li>Select <strong>Incident Type</strong>: Injury, Near-Miss, Property Damage, etc.</li>
                  <li>Select <strong>Severity Level</strong> and whether it's recordable</li>
                  <li>Document <strong>What Happened</strong> in detail</li>
                  <li>Add <strong>Injured Persons</strong> if applicable</li>
                  <li>Complete <strong>Root Cause Analysis</strong> and <strong>Corrective Actions</strong></li>
                  <li>Add <strong>Witnesses</strong> and relevant details</li>
                  <li>Obtain required signatures (reporter, supervisor, management)</li>
                  <li>Click <strong>Submit Report</strong></li>
                </ol>
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Result:</strong> Incident documented with full audit trail. Available for regulatory reporting if required.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Customer Journeys */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Customer Journeys
          </h2>

          <div className="space-y-6">
            {/* Technician Journey */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-red-700 dark:text-red-300">Technician Daily Safety Journey</h3>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 rounded-lg p-6 border border-red-200 dark:border-red-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Arrive at Site</p>
                      <p className="text-xs text-muted-foreground">Open app, tap project</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-red-600 dark:text-red-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Harness Inspection</p>
                      <p className="text-xs text-muted-foreground">Check all equipment, sign</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-red-600 dark:text-red-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Start Work</p>
                      <p className="text-xs text-muted-foreground">Clock in, begin session</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-red-600 dark:text-red-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Work Safely</p>
                      <p className="text-xs text-muted-foreground">Log drops, end session</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supervisor Journey */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-300">Supervisor Safety Management Journey</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Project Setup</p>
                      <p className="text-xs text-muted-foreground">Assign workers, brief job</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-action-600 dark:text-action-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Toolbox Meeting</p>
                      <p className="text-xs text-muted-foreground">Gather team, collect signatures</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-action-600 dark:text-action-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Monitor Work</p>
                      <p className="text-xs text-muted-foreground">Track progress, review docs</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-action-600 dark:text-action-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Review CSR</p>
                      <p className="text-xs text-muted-foreground">Check compliance status</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Complete Example Scenario */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
            Complete Example Scenario
          </h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scenario: First Day on a New Window Cleaning Project</CardTitle>
              <CardDescription>Follow this end-to-end example to understand the complete safety workflow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2 border-l-4 border-blue-500 pl-4">
                <p className="font-semibold text-blue-700 dark:text-blue-300">8:00 AM: Toolbox Meeting</p>
                <p>Supervisor opens Toolbox Meeting form:</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>Selects "Tower A Window Cleaning" project</li>
                  <li>Topic: "First day safety briefing - Tower A"</li>
                  <li>Discusses: Fall hazards, anchor points, weather, emergency procedures</li>
                  <li>All 4 technicians sign</li>
                </ul>
                <p className="text-xs bg-muted p-2 rounded">Result: Toolbox meeting saved with all attendee signatures. Meeting documented for safety records and PDF export.</p>
              </div>

              <div className="space-y-2 border-l-4 border-red-500 pl-4">
                <p className="font-semibold text-red-700 dark:text-red-300">8:15 AM: Harness Inspections</p>
                <p>Each technician completes their inspection:</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>Tech A selects personal kit "HR-001, HR-002"</li>
                  <li>Checks all 11 equipment categories</li>
                  <li>Marks harness, descender, ropes as PASS</li>
                  <li>Notes minor wear on lanyard (but still safe)</li>
                  <li>Signs and submits</li>
                </ul>
                <p className="text-xs bg-muted p-2 rounded">Result: Tech A can now start work sessions for today</p>
              </div>

              <div className="space-y-2 border-l-4 border-green-500 pl-4">
                <p className="font-semibold text-green-700 dark:text-green-300">8:30 AM: Start Work Session</p>
                <p>Tech A starts their work session:</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>Clicks "Start Day" on Tower A project</li>
                  <li>System verifies harness inspection exists for today</li>
                  <li>GPS captured, work session begins</li>
                  <li>Logs drops throughout the day</li>
                </ul>
                <p className="text-xs bg-muted p-2 rounded">CSR Status: Harness inspection covered. Toolbox meeting covered.</p>
              </div>

              <div className="space-y-2 border-l-4 border-purple-500 pl-4">
                <p className="font-semibold text-purple-700 dark:text-purple-300">4:00 PM: Near-Miss Incident</p>
                <p>Tool dropped from height (no injury):</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>Supervisor opens Incident Report</li>
                  <li>Type: Near-Miss, Severity: Minor</li>
                  <li>Documents what happened, root cause (loose tool pouch)</li>
                  <li>Corrective action: Tool lanyards required</li>
                  <li>Tech A and Supervisor sign</li>
                </ul>
                <p className="text-xs bg-muted p-2 rounded">Result: Incident documented for safety improvement. PDF available.</p>
              </div>

              <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
                <p className="font-semibold text-cyan-700 dark:text-cyan-300">5:00 PM: Review Safety Status</p>
                <p>Manager checks Company Safety Rating:</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>CSR: 95% (5% deducted for unsigned document reviews)</li>
                  <li>All harness inspections complete</li>
                  <li>All work sessions have toolbox coverage</li>
                  <li>Company docs all uploaded</li>
                </ul>
                <p className="text-xs bg-muted p-2 rounded">Property manager can view this score in their vendor portal</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Permission Model */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            Permission Model
          </h2>
          <p className="text-base text-muted-foreground">Access to safety features is controlled by role and specific permissions:</p>

          <div className="space-y-3">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
                    <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">View Safety Documents</p>
                      <Badge variant="secondary" className="text-xs">canViewSafetyDocuments</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      View harness inspections, toolbox meetings, and other safety records. All employees can view by default.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                    <Gauge className="w-4 h-4 text-action-600 dark:text-action-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">View Company Safety Rating</p>
                      <Badge variant="secondary" className="text-xs">canViewCSR</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      View the CSR breakdown and penalty calculations. Typically Company Owners, Ops Managers, and Property Managers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900 rounded-full p-2">
                    <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Create Safety Documents</p>
                      <Badge variant="secondary" className="text-xs">All Employees</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Any employee can create harness inspections, toolbox meetings, FLHA forms, incident reports, and method statements.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Key Features Summary */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Key Features Summary
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Pre-Work Enforcement</p>
                <p className="text-base text-muted-foreground">Harness inspection required before work sessions begin.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Daily Toolbox Meetings</p>
                <p className="text-base text-muted-foreground">One meeting daily per active project. Additional meetings when conditions change.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <PenTool className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Digital Signatures</p>
                <p className="text-base text-muted-foreground">Legally binding signatures captured with audit timestamps.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Immutable Records</p>
                <p className="text-base text-muted-foreground">Once signed, safety documents cannot be modified.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Download className="w-5 h-5 text-action-600 dark:text-action-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">PDF Export</p>
                <p className="text-base text-muted-foreground">Professional PDFs with embedded signatures for audits.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Gauge className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">CSR Visibility</p>
                <p className="text-base text-muted-foreground">Property managers can view your compliance rating.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Package className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Personal Kit Integration</p>
                <p className="text-base text-muted-foreground">Link inspections to your assigned equipment by serial.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Building2 className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">White-Label Branding <Badge variant="secondary" className="text-xs ml-1">Coming Soon</Badge></p>
                <p className="text-base text-muted-foreground">Company logo and name on PDF headers when white-label branding is active.</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Important Notes */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Important Technical Notes
          </h2>

          <div className="space-y-3">
            <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
              <CardContent className="pt-4 text-base text-red-900 dark:text-red-100 space-y-2">
                <p className="font-semibold">Harness Inspection is a Hard Gate</p>
                <p>The system will not allow starting a work session without a same-day harness inspection. This is enforced in code and cannot be bypassed.</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
              <CardContent className="pt-4 text-base text-blue-900 dark:text-blue-100 space-y-2">
                <p className="font-semibold">All Attendees Must Sign</p>
                <p>Toolbox meetings require signatures from every selected attendee. The API validates that each attendee ID has a corresponding signature before saving.</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950">
              <CardContent className="pt-4 text-base text-purple-900 dark:text-purple-100 space-y-2">
                <p className="font-semibold">Signatures are Immutable</p>
                <p>Once a safety document is signed and submitted, the signature data (base64 image) is stored permanently. No edit endpoints exist for safety documents.</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
              <CardContent className="pt-4 text-base text-amber-900 dark:text-amber-100 space-y-2">
                <p className="font-semibold">CSR Minimum is 20%</p>
                <p>Maximum penalty is 80% (25% + 25% + 25% + 5% for document reviews). Project completion status is informational only and doesn't penalize CSR.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quick Links */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Quick Links</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/harness-inspection">
              <Button variant="outline" className="w-full justify-between h-auto p-4" data-testid="link-harness-inspection">
                <div className="text-left">
                  <div className="font-semibold">Harness Inspection</div>
                  <div className="text-xs text-muted-foreground">Complete your daily equipment check</div>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/toolbox-meeting">
              <Button variant="outline" className="w-full justify-between h-auto p-4" data-testid="link-toolbox-meeting">
                <div className="text-left">
                  <div className="font-semibold">Toolbox Meeting</div>
                  <div className="text-xs text-muted-foreground">Create a team safety briefing</div>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/flha">
              <Button variant="outline" className="w-full justify-between h-auto p-4" data-testid="link-flha">
                <div className="text-left">
                  <div className="font-semibold">FLHA Form</div>
                  <div className="text-xs text-muted-foreground">Field level hazard assessment</div>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/documents">
              <Button variant="outline" className="w-full justify-between h-auto p-4" data-testid="link-documents">
                <div className="text-left">
                  <div className="font-semibold">Documents</div>
                  <div className="text-xs text-muted-foreground">View and export safety records</div>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
