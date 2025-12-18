import { useState } from "react";
import { useTranslation } from "react-i18next";
import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CreditCard,
  Clock,
  Calendar,
  Calculator,
  FileSpreadsheet,
  Settings,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  Users,
  Crown,
  Briefcase,
  Wrench,
  Building2,
  ChevronsUpDown,
  Star,
  ArrowRight,
  Target,
  Zap,
  FileText,
  BarChart3,
  Link2,
  HelpCircle,
  Lightbulb,
  Shield
} from "lucide-react";

const ALL_ACCORDION_ITEMS = [
  "owner-1", "owner-2", "owner-3", "owner-4", "owner-5",
  "ops-1", "ops-2",
  "tech-1", "tech-2",
  "bm-1"
];

export default function PayrollGuide() {
  const [openItems, setOpenItems] = useState<string[]>(["owner-1"]);
  const allExpanded = ALL_ACCORDION_ITEMS.every(item => openItems.includes(item));

  const toggleAll = () => {
    if (allExpanded) {
      setOpenItems([]);
    } else {
      setOpenItems([...ALL_ACCORDION_ITEMS]);
    }
  };

  return (
    <ChangelogGuideLayout
      title="Payroll & Financial Guide"
      version="2.0"
      lastUpdated="December 17, 2025"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Payroll & Financial module creates a complete data pipeline from field work to payroll export. Every clock-in becomes payroll data automatically. Zero manual entry required between field work and payroll preparation. This module does NOT process payroll (no CPP, EI, tax calculations). It prepares payroll-ready data for export to external payroll software like QuickBooks, ADP, or Gusto.
          </p>
        </section>

        {/* Golden Rule Section */}
        <section className="space-y-6">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Target className="w-5 h-5" />
                The Golden Rule: Automated Payroll Data Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Work Sessions → Timesheets → Payroll Export
                </p>
              </div>
              
              <div className="space-y-2 text-base">
                <p><strong>The Data Flow:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Work Session Created</strong>: GPS-verified clock-in captures start time</li>
                  <li><strong>Hours Calculated</strong>: Regular and overtime hours computed automatically</li>
                  <li><strong>Project Attribution</strong>: Which building, which job, all tracked</li>
                  <li><strong>Pay Period Aggregation</strong>: Automatic grouping by your configured period</li>
                  <li><strong>Timesheet Generation</strong>: Employee-by-employee breakdown ready for review</li>
                  <li><strong>Export</strong>: CSV for payroll software, PDF for records</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-base">
                <p className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Why This Matters
                </p>
                <p className="mt-1">When you process payroll in OnRopePro, you're not just calculating hours. You're getting complete visibility into labor costs, project profitability, and operational efficiency. No more paper timesheets, no more calculators, no more errors.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Key Features Summary */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Key Features Summary</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2" data-testid="grid-key-features">
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded" data-testid="feature-pay-period">
              <Calendar className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Pay Period Configuration</p>
                <p className="text-muted-foreground text-base">Weekly, Bi-Weekly, Semi-Monthly, or Monthly. System auto-generates period boundaries based on your selection.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded" data-testid="feature-aggregation">
              <Zap className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Automatic Aggregation</p>
                <p className="text-muted-foreground text-base">Work sessions flow directly into timesheets with zero manual data entry. Hours calculated automatically.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded" data-testid="feature-overtime">
              <Calculator className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Configurable Overtime</p>
                <p className="text-muted-foreground text-base">Daily trigger (8 hours), weekly trigger (40 hours), or custom thresholds. Multipliers adjustable (1.5x, 2x, 3x). Can disable entirely.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded" data-testid="feature-project-attribution">
              <Building2 className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Project Attribution</p>
                <p className="text-muted-foreground text-base">Every work session shows which project it was logged against. Know exactly how many hours went to each building.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded" data-testid="feature-billable">
              <TrendingUp className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Billable vs Non-Billable</p>
                <p className="text-muted-foreground text-base">Distinguish revenue-generating client hours from operational costs (travel, training, weather delays).</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded" data-testid="feature-export">
              <Download className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Export Capabilities</p>
                <p className="text-muted-foreground text-base">CSV export for payroll software integration (QuickBooks, ADP, Gusto). PDF timesheet reports for records.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded" data-testid="feature-permissions">
              <Shield className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Granular Permissions</p>
                <p className="text-muted-foreground text-base">Access controlled via canAccessFinancials permission. Granted through role-based permission system.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded" data-testid="feature-historical">
              <Clock className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Historical Access</p>
                <p className="text-muted-foreground text-base">View past pay periods and work sessions. Essential for job costing, audits, and bid accuracy.</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Critical Disclaimer */}
        <section>
          <Card className="border-2 border-rose-500 bg-rose-50 dark:bg-rose-950">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-rose-900 dark:text-rose-100">
                <AlertTriangle className="w-5 h-5" />
                Important: Tax and Labor Law Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-rose-900 dark:text-rose-100 space-y-3 text-base">
              <p>
                OnRopePro's Payroll module helps aggregate hours and prepare timesheet data, but <strong>OnRopePro is not a substitute for professional accounting or legal advice.</strong>
              </p>
              <p>OnRopePro does NOT calculate:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>CPP/EI deductions (Canada)</li>
                <li>Social Security/Medicare (US)</li>
                <li>Federal, state/provincial, or local tax withholding</li>
                <li>Workers' compensation premiums</li>
                <li>Any statutory deductions</li>
              </ul>
              <p>
                You are responsible for ensuring compliance with all applicable federal, state/provincial, and local labor laws including minimum wage, overtime rules, tax withholding, and reporting requirements. <strong>Requirements vary by jurisdiction.</strong> Consult with qualified accountants and employment attorneys to ensure your specific compliance needs are met.
              </p>
              <p>
                OnRopePro exports payroll-ready data for import into your payroll processing software (QuickBooks, ADP, Gusto, etc.), where actual payroll calculations occur.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Problems Solved Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-3xl md:text-4xl font-bold">Problems Solved</h2>
            <Button 
              onClick={toggleAll} 
              variant="outline"
              data-testid="button-toggle-all-accordions"
            >
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          {/* For Company Owners */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Company Owners</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3" data-testid="accordion-owners">
              <AccordionItem value="owner-1" className={`border rounded-lg px-4 ${openItems.includes("owner-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-owner-1">
                  <span className="text-left font-medium">"Manual paper timesheet nightmare consuming hours every pay period"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> Payroll day means printing stacks of paper, laying them across your desk, and manually circling each employee's hours with a pen. Then grabbing a calculator to add everything up. One employee's timesheet prints across four pages. You have 12 employees. That's 48 pages minimum, every single pay period.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Jeff at a Vancouver rope access company would print timesheets from Veraclock for all employees. Each employee's data spread across multiple pages. He laid papers across his entire desk, circled relevant numbers with a pen, then used a calculator to total each person's hours. This took 2-3 hours every payday, and he still made mistakes.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> OnRopePro aggregates all work session data automatically into employee-by-employee timesheets. Select pay period, view hours, export. No paper. No calculator. No circling.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> 87-93% reduction in payroll processing time. From 6-10 hours per week down to 30-45 minutes.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className={`border rounded-lg px-4 ${openItems.includes("owner-2") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-owner-2">
                  <span className="text-left font-medium">"Constant payroll errors and late payments damaging trust"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> When you're manually tracking hours across multiple systems, errors happen constantly. Employees track their own hours in notebooks. You pull data from a time clock system. The numbers don't match. Someone gets shorted. Someone gets overpaid. You have to send random e-transfers to make corrections. Your bookkeeper is confused by unexplained transactions.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> A technician clocks out at noon after the owner tells him to go home early but he'll still get paid for the full day. The technician writes "8 hours" in his notebook. The time clock shows 4 hours. Owner processes based on time clock data. Technician gets shorted. This happens twice. Now you owe the employee 8-10 hours and have to send correction payments.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> Single source of truth for all hours. Work sessions capture actual time with GPS verification. Manager overrides documented with reasons. No conflicting systems creating discrepancies.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Eliminates payroll disputes. No more "he said, she said" about hours worked. Complete audit trail for every minute.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className={`border rounded-lg px-4 ${openItems.includes("owner-3") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-owner-3">
                  <span className="text-left font-medium">"Random e-transfers creating accounting chaos"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> When payroll errors happen, you fix them with quick e-transfers. Problem solved for the employee. Problem created for your books. Your bookkeeper sees unexplained $130 transfers and has to track you down for explanations. Each correction creates more work downstream.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Owner sends correction payment to employee. Bookkeeper asks: "What's this random $130 e-transfer to Tommy for?" Owner: "That was payroll. I messed up. Just catching up with him." Now bookkeeper has to manually adjust records, recategorize the transaction, and document the correction. Multiply this by 3-4 corrections per pay period.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> Accurate timesheets from the start mean no corrections needed. If adjustments are required, they're documented in the system with full audit trails before export.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Clean books. No unexplained transactions. Bookkeeper gets complete, accurate data every time.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-4" className={`border rounded-lg px-4 ${openItems.includes("owner-4") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-owner-4">
                  <span className="text-left font-medium">"Disorganization domino effect spreading through operations"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> Payroll chaos doesn't stay contained. When processing payroll is painful, you put it off. Once you're late, the culture shifts. Being on time becomes optional. Employees expect delays. You hate payday because it means hours of misery. The chaos spreads from payroll into general business operations.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Owner dreads payroll so much that he starts running late consistently. First by a day, then two days. Employees start budgeting around "getting paid late." The operation develops a culture where deadlines are suggestions. This mentality bleeds into project timelines, client communications, and safety documentation.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> When payroll takes 30 minutes instead of 6 hours, you don't dread it. You stay on time. The culture stays professional.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Payroll becomes a non-event instead of a crisis. Professional operations attract better employees and clients.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-5" className={`border rounded-lg px-4 ${openItems.includes("owner-5") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-owner-5">
                  <span className="text-left font-medium">"Job costing blindness leads to underbidding projects"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> You quoted a building for 200 hours. The job took 260 hours. But you don't know which employees went over, which days were inefficient, or whether the scope expanded. Without project-level labor tracking, you can't learn from mistakes. You keep underbidding because you don't have data.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Owner quotes annual window cleaning at a high-rise. Job runs 60 hours over budget. All hours were legitimate (extra work, difficult access, weather delays). But without project attribution, owner doesn't know until invoice time. Next year, same mistake. The 60-hour underbid costs $2,400 in labor that can't be billed.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> Every work session tracks which project it belongs to. Payroll view shows hours by project. You see exactly where time went and can adjust future bids accordingly.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Learn from every job. Increase quote accuracy. Stop leaving money on the table.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Operations Managers & Supervisors */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Operations Managers & Supervisors</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3" data-testid="accordion-operations">
              <AccordionItem value="ops-1" className={`border rounded-lg px-4 ${openItems.includes("ops-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-ops-1">
                  <span className="text-left font-medium">"Checking multiple systems for hours takes forever"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> To verify an employee's hours for the pay period, you have to check the time clock system, cross-reference with the schedule, look at project assignments, and sometimes call the employee to confirm. Three different places minimum, often more.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Supervisor needs to verify Brock's hours for the week. Opens Veraclock (time clock). Opens scheduling spreadsheet. Opens project log. Compares numbers. Finds discrepancy. Calls Brock. Wastes 20 minutes on what should be a 30-second check.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> Payroll module shows work sessions for each employee for each pay period in one view. Click employee, see all sessions, hours calculated, projects attributed.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> 30-second verification instead of 20-minute investigation. Supervise more, administrate less.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ops-2" className={`border rounded-lg px-4 ${openItems.includes("ops-2") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-ops-2">
                  <span className="text-left font-medium">"Can't easily access historical data for audits"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> Need to check what an employee worked three pay periods ago? Good luck finding those paper timesheets or digging through archived spreadsheets. Historical data is scattered or lost entirely.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> CRA audit requires documentation of hours worked for a specific employee over the past year. Office manager spends 3 days hunting through filing cabinets and old email attachments to reconstruct the data.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> Access past pay periods and past work sessions for any employee instantly. Full history preserved and searchable.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Answer questions immediately. Handle disputes with data. Prepare for audits without panic.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Technicians */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Wrench className="w-5 h-5 text-orange-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Technicians</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3" data-testid="accordion-technicians">
              <AccordionItem value="tech-1" className={`border rounded-lg px-4 ${openItems.includes("tech-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-tech-1">
                  <span className="text-left font-medium">"Getting paid wrong (again) and having to fight for my money"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> You keep your own log of hours because you've been burned before. Your notebook says 80 hours. Your paycheck says 72. Now you have to fight for your money, and maybe the owner believes you, maybe he doesn't. Even when you win, it takes weeks to get the correction.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Technician tracks hours in phone notes. Owner pulls from time clock that missed some entries. Check is short by $280. Technician has to prove the hours, wait for correction, and hope it's on the next check instead of a random e-transfer that messes up their budget.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> Single source of truth that both technician and owner see. GPS-verified clock-ins. No conflicting records. What you logged is what you get paid.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Fair pay, every time. No more fighting for your hours.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className={`border rounded-lg px-4 ${openItems.includes("tech-2") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-tech-2">
                  <span className="text-left font-medium">"Not getting paid on time wreaks havoc on my budget"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> Payday comes and goes. No deposit. Owner says he's "catching up" or "running behind." You're budgeting around expected income that doesn't arrive. Bills pile up. Stress increases.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Employees at one company expected late payments as normal. "That's if you got paid on time" was the reality. Rent due on the 1st, paycheck arrives on the 5th. Every month.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> When payroll prep takes 30 minutes instead of 6 hours, owners don't procrastinate. They process on time because it's not painful anymore.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Predictable paychecks. Budget with confidence. Reduced financial stress.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Building Managers & Property Managers */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Building2 className="w-5 h-5 text-violet-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Building Managers & Property Managers</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3" data-testid="accordion-building-managers">
              <AccordionItem value="bm-1" className={`border rounded-lg px-4 ${openItems.includes("bm-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-bm-1">
                  <span className="text-left font-medium">"No visibility into labor costs by project"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> When you hire a rope access company for annual maintenance, you get an invoice for total hours. But you don't know if those hours were efficient, excessive, or properly allocated. No project-level transparency.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Property manager receives invoice for 120 hours at $85/hour for window cleaning. Did it really take 120 hours? Were there inefficiencies? No way to verify because the contractor's tracking is a black box.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> Rope access companies using OnRopePro can provide project-level labor breakdowns showing exactly how many hours were spent on your building, by which technicians, on which days.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Verify you're getting what you paid for. Benchmark for future contract negotiations. Hold vendors accountable with data.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator />

        {/* Overtime Calculation Deep Dive */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Overtime Calculation</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Daily Trigger (Default)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <p className="text-muted-foreground">Overtime kicks in after the configured daily threshold.</p>
                <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm">
                  <p>Regular Hours: First 8 hours of any day</p>
                  <p>Overtime Hours: Hours 9+ on any day</p>
                  <p>Multiplier: 1.5x (configurable)</p>
                </div>
                <p className="text-muted-foreground text-base">
                  <strong>Example:</strong> Employee works 10 hours on Monday. Regular: 8 hrs x $35 = $280. Overtime: 2 hrs x $52.50 = $105. Day Total: $385.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  Weekly Trigger (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <p className="text-muted-foreground">Overtime kicks in after the configured weekly threshold.</p>
                <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm">
                  <p>Regular Hours: First 40 hours of any week</p>
                  <p>Overtime Hours: Hours 41+ in the week</p>
                  <p>Multiplier: 1.5x (configurable)</p>
                </div>
                <p className="text-muted-foreground text-base">
                  <strong>Example:</strong> Employee works 50 hours Mon-Fri. Regular: 40 hrs x $35 = $1,400. Overtime: 10 hrs x $52.50 = $525. Week Total: $1,925.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Settings className="w-5 h-5" />
                Configuration Options
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-900 dark:text-blue-100 space-y-2 text-base">
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Daily threshold:</strong> Adjustable (6, 8, 10, 12 hours)</li>
                <li><strong>Weekly threshold:</strong> Adjustable (35, 40, 44, 50 hours)</li>
                <li><strong>Multiplier:</strong> Adjustable (1.5x, 2x, 3x)</li>
                <li><strong>Disable entirely:</strong> For companies without OT structures</li>
              </ul>
              <p className="mt-2 text-sm">Match your company's payroll policies and local labor law requirements.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Hour Categorization */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Hour Categorization</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2 bg-emerald-50 dark:bg-emerald-950 border-b border-emerald-200 dark:border-emerald-800">
                <CardTitle className="text-lg flex items-center justify-between gap-2 flex-wrap">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Billable Hours
                  </span>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Revenue-Generating</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3 pt-4">
                <p className="text-muted-foreground">
                  Hours worked on client projects that can be billed. Automatically tracked from work sessions linked to active projects.
                </p>
                <div>
                  <p className="font-medium mb-1">Examples:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Window cleaning at client building</li>
                    <li>Pressure washing contracted work</li>
                    <li>Facade inspection for property manager</li>
                  </ul>
                </div>
                <p className="text-muted-foreground text-base">
                  <strong>Financial Impact:</strong> Feeds into project profitability analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800">
                <CardTitle className="text-lg flex items-center justify-between gap-2 flex-wrap">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Non-Billable Hours
                  </span>
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">Operational Cost</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3 pt-4">
                <p className="text-muted-foreground">
                  Hours that must be paid but cannot be billed to clients. Tracked from sessions not linked to billable projects.
                </p>
                <div>
                  <p className="font-medium mb-1">Examples:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Travel time between sites</li>
                    <li>Equipment maintenance</li>
                    <li>Training and certifications</li>
                    <li>Administrative tasks</li>
                    <li>Weather delays</li>
                  </ul>
                </div>
                <p className="text-muted-foreground text-base">
                  <strong>Financial Impact:</strong> Important for true labor cost understanding.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Module Integration Points */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Link2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Module Integration Points</h2>
          </div>

          <p className="text-muted-foreground text-base">
            The Payroll & Financial module connects with other OnRopePro modules to create a seamless data flow from field work to payroll export.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Work Sessions & Time Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground text-sm">Primary data source. Every clock-in/clock-out creates work session data that flows directly into payroll aggregation.</p>
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Start time, end time, GPS location</span>
                  <span className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Project assignment and break time</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-600" />
                  Employee Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground text-sm">Rate and role lookup. Hourly rate pulled from employee profile at time of work session.</p>
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Hourly rate, salary, piece rate</span>
                  <span className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Role and permissions lookup</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-violet-600" />
                  Project Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground text-sm">Project attribution. Work sessions link to projects, enabling labor cost tracking per building/job.</p>
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Project name and building address</span>
                  <span className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Job type and budget hours</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  Scheduling & Calendar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground text-sm">Shift assignment context. Scheduled shifts provide expected hours for comparison with actual hours worked.</p>
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Scheduled start/end times</span>
                  <span className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Assigned employees and projects</span>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-5 h-5 text-rose-600" />
                  Safety Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground text-sm">Work eligibility verification. Harness inspection required before clock-in. Failed inspections block work sessions. Safety compliance feeds into work eligibility which affects payroll.</p>
                <div className="flex flex-wrap gap-4">
                  <span className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Inspection status verification</span>
                  <span className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Compliance flags and blocks</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quantified Business Impact */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Quantified Business Impact</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-blue-600">87-93%</p>
                <p className="text-sm text-muted-foreground mt-1">Reduction in payroll processing time</p>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-emerald-600">97%</p>
                <p className="text-sm text-muted-foreground mt-1">Faster per-employee verification</p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 dark:border-amber-800">
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-amber-600">100%</p>
                <p className="text-sm text-muted-foreground mt-1">Overtime calculation automated</p>
              </CardContent>
            </Card>
            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-violet-600">196%</p>
                <p className="text-sm text-muted-foreground mt-1">Annual ROI on subscription</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Time Savings Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table data-testid="table-time-savings">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Before</TableHead>
                      <TableHead>After</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Weekly payroll processing</TableCell>
                      <TableCell>6-10 hours</TableCell>
                      <TableCell className="text-emerald-600">30-45 min</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Per-employee verification</TableCell>
                      <TableCell>15-20 min</TableCell>
                      <TableCell className="text-emerald-600">30 seconds</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Overtime calculation</TableCell>
                      <TableCell>30-60 min</TableCell>
                      <TableCell className="text-emerald-600">Automatic</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Historical lookup</TableCell>
                      <TableCell>10-30 min</TableCell>
                      <TableCell className="text-emerald-600">10 seconds</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">ROI Calculation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base">
                <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm space-y-1">
                  <p>Owner hourly value: $75/hour</p>
                  <p>Weekly time saved: 5 hours</p>
                  <p>Annual time saved: 260 hours</p>
                  <p className="pt-2 border-t">Value of time: $19,500/year</p>
                  <p>Annual subscription: ~$6,588</p>
                  <p className="font-bold text-emerald-600">Net benefit: $12,912/year</p>
                </div>
                <p className="text-muted-foreground text-base">Pay one hour to save ten. The subscription pays for itself within the first month.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Permissions & Access Control */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Permissions & Access Control</h2>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Role-Based Access Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <Table data-testid="table-permissions">
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">View Timesheets</TableHead>
                    <TableHead className="text-center">Approve</TableHead>
                    <TableHead className="text-center">Export</TableHead>
                    <TableHead className="text-center">Configure</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Technician</TableCell>
                    <TableCell className="text-center">Own only</TableCell>
                    <TableCell className="text-center text-rose-500">No</TableCell>
                    <TableCell className="text-center text-rose-500">No</TableCell>
                    <TableCell className="text-center text-rose-500">No</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Supervisor</TableCell>
                    <TableCell className="text-center">Team</TableCell>
                    <TableCell className="text-center text-rose-500">No</TableCell>
                    <TableCell className="text-center text-rose-500">No</TableCell>
                    <TableCell className="text-center text-rose-500">No</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Operations Manager*</TableCell>
                    <TableCell className="text-center">All</TableCell>
                    <TableCell className="text-center text-emerald-500">Yes</TableCell>
                    <TableCell className="text-center text-emerald-500">Yes</TableCell>
                    <TableCell className="text-center text-emerald-500">Yes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Company Owner</TableCell>
                    <TableCell className="text-center">All</TableCell>
                    <TableCell className="text-center text-emerald-500">Yes</TableCell>
                    <TableCell className="text-center text-emerald-500">Yes</TableCell>
                    <TableCell className="text-center text-emerald-500">Yes</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-muted-foreground text-sm mt-3">*Requires canAccessFinancials permission granted through the role-based permission system.</p>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">canAccessFinancials Permission</p>
                  <p className="text-base text-muted-foreground mt-1">
                    This permission controls access to payroll data company-wide, timesheet approval, payroll report export, overtime configuration, and labor cost analytics. It is NOT automatically assigned to any role. Company owner grants it based on trust and need.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* FAQs */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"Does OnRopePro handle actual payroll processing (CPP, EI, tax deductions)?"</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base">
                <p>No. OnRopePro generates payroll-ready data for export to your payroll software (QuickBooks, ADP, Gusto, etc.). Tax calculations, statutory deductions, and actual payment processing happen in your payroll processor.</p>
                <p className="mt-2">Tax and labor laws vary by jurisdiction (federal, provincial/state, local). Payroll processors specialize in compliance for your specific location.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"What happens if an employee forgets to clock out?"</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base">
                <p>Manager can edit the session end time with an override reason. Full audit trail maintained showing original data, edit, editor name, and reason.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"Can overtime thresholds be customized?"</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base">
                <p>Yes. Daily trigger (default 8 hours), weekly trigger (40 hours), and multiplier (1.5x, 2x, 3x) are all configurable. Can also disable overtime calculation entirely for companies that don't use overtime pay structures.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"How does project attribution work?"</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base">
                <p>Each work session is logged against a specific project. When viewing payroll data, you see exactly how many hours were spent on each building/job. This enables accurate job costing and bid improvement.</p>
                <p className="mt-2"><strong>Example:</strong> Technician worked 8 hours. Payroll shows: 4 hours on Downtown Tower, 4 hours on Harbor Building. Each building's labor cost tracked separately.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"Can I see historical pay periods?"</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base">
                <p>Yes. Access past pay periods and past work sessions for any employee instantly. Essential for audits, disputes, and job costing analysis.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"What export formats are available?"</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base">
                <p>CSV (for payroll software import) and PDF (for records/employee copies). Export includes employee name, pay period dates, regular hours, overtime hours, project breakdown, and calculated amounts.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Best Practices */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Best Practices & Tips</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800">
                <CardTitle className="text-base flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  For Company Owners
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-sm">
                <div>
                  <p className="font-medium text-emerald-600 mb-1">Do:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-1">
                    <li>Review timesheets before approval</li>
                    <li>Configure overtime to match your policies</li>
                    <li>Use project attribution for future bids</li>
                    <li>Export both CSV and PDF for records</li>
                    <li>Assign canAccessFinancials carefully</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-rose-600 mb-1">Don't:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-1">
                    <li>Skip review assuming automation is perfect</li>
                    <li>Ignore non-billable hour tracking</li>
                    <li>Give financial access unnecessarily</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  For Operations Managers
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-sm">
                <div>
                  <p className="font-medium text-emerald-600 mb-1">Do:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-1">
                    <li>Check employee hours weekly</li>
                    <li>Investigate anomalies immediately</li>
                    <li>Use project attribution to identify inefficient jobs</li>
                    <li>Cross-reference with scheduling</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-rose-600 mb-1">Don't:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-1">
                    <li>Wait until payday to review</li>
                    <li>Approve without verifying schedules</li>
                    <li>Ignore patterns of excessive overtime</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-2 bg-orange-50 dark:bg-orange-950 border-b border-orange-200 dark:border-orange-800">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-orange-500" />
                  For Technicians
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-sm">
                <div>
                  <p className="font-medium text-emerald-600 mb-1">Do:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-1">
                    <li>Clock in/out consistently using the app</li>
                    <li>Verify your hours weekly in the app</li>
                    <li>Report discrepancies immediately</li>
                    <li>Trust the system (GPS-verified)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-rose-600 mb-1">Don't:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-1">
                    <li>Keep separate manual logs</li>
                    <li>Wait until payday to check hours</li>
                    <li>Forget to clock out</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
