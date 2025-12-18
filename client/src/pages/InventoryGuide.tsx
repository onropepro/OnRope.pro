import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building2,
  Briefcase,
  HardHat,
  Database,
  Lock,
  Eye,
  Settings,
  Users,
  Zap,
  Share2,
  Target,
  Info,
  Package,
  ClipboardCheck,
  Shield,
  BarChart3,
  UserCheck,
  ChevronsUpDown
} from "lucide-react";

const ALL_ACCORDION_ITEMS = [
  "owner-1", "owner-2", "owner-3", "owner-4",
  "ops-1", "ops-2",
  "pm-1",
  "tech-1", "tech-2",
  "faq-1", "faq-2", "faq-3", "faq-4", "faq-5", "faq-6", "faq-7"
];

export default function InventoryGuide() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const allExpanded = openItems.length === ALL_ACCORDION_ITEMS.length;

  const toggleAll = () => {
    setOpenItems(allExpanded ? [] : [...ALL_ACCORDION_ITEMS]);
  };

  return (
    <ChangelogGuideLayout
      title="Gear Inventory Management Guide"
      version="3.0"
      lastUpdated="December 15, 2025"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Gear Inventory module provides centralized equipment tracking and management for rope access companies. It uses a <strong>slot-based availability model</strong> where equipment availability is calculated as Total Quantity minus Assigned Quantity. Serial numbers are optional metadata for tracking individual units, not gatekeepers for availability.
          </p>
        </section>

        {/* Golden Rule Card */}
        <section className="space-y-6">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Calculator className="w-5 h-5" />
                The Golden Rule: Slot-Based Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Available = Quantity - Assigned
                </p>
              </div>

              <div className="space-y-2 text-base">
                <p><strong>This formula is absolute.</strong> Available slots are determined ONLY by:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Quantity:</strong> Total items your company owns (set on the gear item)</li>
                  <li><strong>Assigned:</strong> Sum of all assignment quantities for that item</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-base">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Critical Understanding
                </p>
                <p className="mt-1">Serial number registration has <strong>NO EFFECT</strong> on availability. You can have 10 items with quantity=10, only 2 registered serial numbers, and still have 10 available slots (if none are assigned).</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-base">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Example Item</p>
                  <p className="font-bold">Harnesses</p>
                  <p className="text-lg font-mono">Qty: 10</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total Assigned</p>
                  <p className="font-bold">To 3 employees</p>
                  <p className="text-lg font-mono">Assigned: 4</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Result</p>
                  <p className="font-bold">For new assignments</p>
                  <p className="text-lg font-mono text-green-700 dark:text-green-300">Available: 6</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Critical Disclaimer */}
        <section className="space-y-4">
          <Card className="border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-rose-900 dark:text-rose-100">
                <AlertTriangle className="w-5 h-5" />
                Important: Safety Equipment Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-rose-900 dark:text-rose-100 space-y-3 text-base">
              <p>
                OnRopePro's Gear Inventory module helps track equipment and assignments, but <strong>OnRopePro is not a substitute for professional safety consultation.</strong> You are responsible for ensuring compliance with:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>IRATA/SPRAT equipment inspection requirements</li>
                <li>OSHA/WorkSafeBC safety equipment standards</li>
                <li>Manufacturer service life recommendations (typically 5 years hard gear, 10 years soft gear)</li>
                <li>Insurance documentation requirements</li>
                <li>Local workplace safety regulations</li>
              </ul>
              <p className="text-sm">
                Equipment service life calculations are guidelines only. Actual replacement timing depends on usage intensity, environmental conditions, manufacturer specifications, and professional inspection results. Consult with qualified safety professionals for equipment retirement decisions.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Problems Solved Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              Problems Solved
            </h2>
            <Button variant="outline" onClick={toggleAll} data-testid="button-toggle-all-accordions">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>
          <p className="text-muted-foreground text-base">
            Real problems from real rope access professionals, solved through intelligent inventory management.
          </p>

          {/* For Rope Access Company Owners */}
          <Card className="border-2 border-blue-200 dark:border-blue-900">
            <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
              <CardTitle className="text-xl flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Building2 className="w-5 h-5" />
                For Rope Access Company Owners
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
                <AccordionItem value="owner-1">
                  <AccordionTrigger className="text-left" data-testid="accordion-owner-1">
                    <span className="font-semibold">"I have no idea where my equipment actually is"</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base">
                    <div className="space-y-2">
                      <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                      <p className="text-muted-foreground">You bought 10 harnesses last year. Today, you can only find 6. Are they in the shop? In someone's truck? Did someone quit and keep them? You're about to order more because you can't prove what you have, and every harness costs $400-800.</p>
                    </div>
                    <div className="bg-muted p-3 rounded text-base italic">
                      <strong>Real Example:</strong> A tech quit last month. He claims he returned all his gear. Your records (a spreadsheet last updated 4 months ago) show nothing. You have no proof either way. You eat the $2,400 loss.
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                      <p className="text-muted-foreground">Real-time tracking of all equipment with clear assignment history. Every item shows: total quantity owned, who has what, when it was assigned, and current availability. Digital paper trail proves who received equipment and when.</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                      <p className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        The Benefit:
                      </p>
                      <p className="mt-1 text-muted-foreground">Eliminate "he said/she said" disputes over equipment. Stop buying duplicates of gear you already own. Recover $2,000-4,000 annually in lost equipment costs. Complete audit trail for insurance and tax purposes.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="owner-2">
                  <AccordionTrigger className="text-left" data-testid="accordion-owner-2">
                    <span className="font-semibold">"Our spreadsheet is always wrong and out of date"</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base">
                    <div className="space-y-2">
                      <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                      <p className="text-muted-foreground">Your Excel spreadsheet for inventory was accurate... three months ago. Now nobody updates it. When you need to know if you have enough harnesses for a big job next week, you spend an hour calling around, checking the shop, texting employees. By the time you get an answer, you've wasted half your morning.</p>
                    </div>
                    <div className="bg-muted p-3 rounded text-base italic">
                      <strong>Real Example:</strong> Client calls Monday asking if you can staff a 6-person crew Wednesday. You think you have enough gear but aren't sure. You spend 45 minutes verifying, then realize two harnesses are at inspection. You scramble to rent equipment at premium cost, losing $300 on a job that should have been routine.
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                      <p className="text-muted-foreground">Real-time database that updates automatically when employees assign gear to themselves, when managers distribute equipment, and when items are returned. No manual data entry. No outdated information. Answer "do we have enough gear?" in 4 seconds.</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                      <p className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        The Benefit:
                      </p>
                      <p className="mt-1 text-muted-foreground">91% reduction in time spent finding information (45 minutes to 4 minutes). Eliminate rental costs from poor inventory visibility. Accept jobs confidently knowing exactly what equipment is available.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="owner-3">
                  <AccordionTrigger className="text-left" data-testid="accordion-owner-3">
                    <span className="font-semibold">"I don't know when equipment needs to be replaced"</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base">
                    <div className="space-y-2">
                      <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                      <p className="text-muted-foreground">IRATA standards say harnesses should be retired after 5 years of use (10 years from manufacture for soft gear). But you have no idea when most of your equipment went into service. You're either replacing gear too early (wasting money) or too late (risking safety violations and failed audits).</p>
                    </div>
                    <div className="bg-muted p-3 rounded text-base italic">
                      <strong>Real Example:</strong> IRATA auditor asks for proof of equipment service life tracking. You have purchase receipts somewhere, but no record of when each item actually went into service. The auditor notes the gap. Your certification is at risk.
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                      <p className="text-muted-foreground">Date of manufacture and in-service dates tracked per assignment. Color-coded indicators (green/yellow/red) for service life status. Equipment approaching replacement timelines is flagged automatically for review.</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                      <p className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        The Benefit:
                      </p>
                      <p className="mt-1 text-muted-foreground">Budget accurately for equipment replacement. Prevent $1,500-3,000 in emergency equipment purchases. Pass IRATA/SPRAT audits with complete equipment lifecycle documentation. Reduce insurance premiums 10-20% with documented safety practices.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="owner-4">
                  <AccordionTrigger className="text-left" data-testid="accordion-owner-4">
                    <span className="font-semibold">"Employees claim they never received equipment"</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base">
                    <div className="space-y-2">
                      <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                      <p className="text-muted-foreground">Tech leaves the company. You ask for their gear back. They say "I never had a descender, that wasn't mine." You have no proof. Your word against theirs. You either eat the cost or create an ugly confrontation.</p>
                    </div>
                    <div className="bg-muted p-3 rounded text-base italic">
                      <strong>Real Example:</strong> Former employee disputes owing $1,800 in equipment. Without documented assignment records, you have no legal standing to recover the gear or deduct from final pay. HR advises you to let it go.
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                      <p className="text-muted-foreground">Every assignment is timestamped and tracked. When gear is assigned (by manager or self-service), the system records who, what, when. Clear digital trail shows exactly what each employee received. No ambiguity.</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                      <p className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        The Benefit:
                      </p>
                      <p className="mt-1 text-muted-foreground">Eliminate "I didn't know" excuses. Legal documentation for equipment recovery. Protect final paycheck deductions with proof. Reduce equipment disputes by 90%+.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* For Operations Managers */}
          <Card className="border-2 border-blue-200 dark:border-blue-900">
            <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
              <CardTitle className="text-xl flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Briefcase className="w-5 h-5" />
                For Operations Managers & Supervisors
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
                <AccordionItem value="ops-1">
                  <AccordionTrigger className="text-left" data-testid="accordion-ops-1">
                    <span className="font-semibold">"I spend hours tracking down who has what gear"</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base">
                    <div className="space-y-2">
                      <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                      <p className="text-muted-foreground">Before every big job, you need to verify your crew has the right equipment. That means texting everyone, calling the shop, checking vehicles. What should take 5 minutes takes 2 hours because information is scattered across texts, memory, and outdated lists.</p>
                    </div>
                    <div className="bg-muted p-3 rounded text-base italic">
                      <strong>Real Example:</strong> Monday morning crew meeting. You need 4 techs with full kits for a 3-day project. You ask who has their harnesses. Three say yes. One thinks his is at the shop. Another says he lent his descender to someone else. You spend the next hour sorting it out instead of briefing the job.
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                      <p className="text-muted-foreground">Team Gear view shows exactly what equipment each employee has assigned. One glance tells you who has what, what's missing, and what's available. Verify crew readiness in seconds.</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                      <p className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        The Benefit:
                      </p>
                      <p className="mt-1 text-muted-foreground">95% reduction in equipment coordination time. Crew briefings focus on work, not gear logistics. Identify equipment gaps before they cause project delays. Reassign gear between techs with clear transfer records.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ops-2">
                  <AccordionTrigger className="text-left" data-testid="accordion-ops-2">
                    <span className="font-semibold">"New hires take forever to get equipped"</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base">
                    <div className="space-y-2">
                      <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                      <p className="text-muted-foreground">New tech starts Monday. You need to assign harness, descender, ascenders, carabiners, helmet, ropes. That's at least 30 minutes of your time, plus walking through the shop, finding what's available, documenting what you gave them. Multiply by 5 new hires in busy season.</p>
                    </div>
                    <div className="bg-muted p-3 rounded text-base italic">
                      <strong>Real Example:</strong> You hire 3 techs for summer rush. Each onboarding takes 45 minutes just for equipment. That's 2+ hours of supervisor time on paperwork instead of billable work. And you still aren't sure you documented everything correctly.
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                      <p className="text-muted-foreground">Employee self-service assignment. New tech logs in, browses available equipment, assigns what they need to their own kit. System tracks everything automatically. Their kit is built in 10 minutes without supervisor involvement.</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                      <p className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        The Benefit:
                      </p>
                      <p className="mt-1 text-muted-foreground">Reduce onboarding equipment time from 45 minutes to 10 minutes per employee. Free supervisor time for revenue-generating work. Complete documentation happens automatically. New hires take ownership of their kit from day one.</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded border border-blue-200 dark:border-blue-800 text-sm italic">
                      <strong>Validated:</strong> "Enter what you have, how many you have, and then everything else. People will build their kit. We'll do the inspection though. It's all handled from there."
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* For Building/Property Managers */}
          <Card className="border-2 border-violet-200 dark:border-violet-900">
            <CardHeader className="pb-2 bg-violet-50 dark:bg-violet-950">
              <CardTitle className="text-xl flex items-center gap-2 text-violet-900 dark:text-violet-100">
                <Building2 className="w-5 h-5" />
                For Building Managers & Property Managers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
                <AccordionItem value="pm-1">
                  <AccordionTrigger className="text-left" data-testid="accordion-pm-1">
                    <span className="font-semibold">"I can't verify my contractor's equipment compliance"</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base">
                    <div className="space-y-2">
                      <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                      <p className="text-muted-foreground">You're responsible for vendor safety compliance. When the rope access company shows up, you have to trust they have proper equipment. If something goes wrong, you could be liable for not verifying their safety practices.</p>
                    </div>
                    <div className="bg-muted p-3 rounded text-base italic">
                      <strong>Real Example:</strong> Incident occurs on your property. Investigation asks what you knew about the contractor's equipment safety protocols. You have nothing documented. You trusted them. Now your insurance company is asking hard questions.
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                      <p className="text-muted-foreground">CSR (Corporate Safety Record) visibility through the OnRopePro portal. Building managers can view contractor equipment tracking, inspection status, and compliance documentation. Verify vendor professionalism before they start work.</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                      <p className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        The Benefit:
                      </p>
                      <p className="mt-1 text-muted-foreground">Due diligence documentation for liability protection. Verify contractor equipment compliance in seconds. Professional vendors stand out from competitors. Reduce your exposure if incidents occur.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* For Technicians */}
          <Card className="border-2 border-amber-200 dark:border-amber-900">
            <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950">
              <CardTitle className="text-xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <HardHat className="w-5 h-5" />
                For Rope Access Technicians
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
                <AccordionItem value="tech-1">
                  <AccordionTrigger className="text-left" data-testid="accordion-tech-1">
                    <span className="font-semibold">"I never know what gear is available for me"</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base">
                    <div className="space-y-2">
                      <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                      <p className="text-muted-foreground">You show up to the shop, need a new descender because yours is at inspection. You dig through bins, ask around, finally find one. But is it assigned to someone else? Are you supposed to take it? Nobody knows.</p>
                    </div>
                    <div className="bg-muted p-3 rounded text-base italic">
                      <strong>Real Example:</strong> You grab a backup rope from the shop for a job. Turns out it was reserved for another crew. Now there's a conflict, the other job is delayed, and everyone's pointing fingers. All because there was no clear system showing what was available.
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                      <p className="text-muted-foreground">Self-service inventory access. Browse available equipment from your phone. See exactly what's unassigned. Assign it to yourself instantly. No guessing, no conflicts, no permission needed for available gear.</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                      <p className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        The Benefit:
                      </p>
                      <p className="mt-1 text-muted-foreground">Know exactly what's available before you get to the shop. Assign gear to yourself in 30 seconds. Avoid equipment conflicts with coworkers. Build your personal kit on your own time.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tech-2">
                  <AccordionTrigger className="text-left" data-testid="accordion-tech-2">
                    <span className="font-semibold">"My harness inspection is blocked because inventory isn't set up"</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base">
                    <div className="space-y-2">
                      <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                      <p className="text-muted-foreground">You try to do your pre-work harness inspection. System says you need to have equipment assigned first. But nobody set up the inventory. Now you can't complete your safety requirements, can't start your drop, and you're waiting for someone with admin access.</p>
                    </div>
                    <div className="bg-muted p-3 rounded text-base italic">
                      <strong>Real Example:</strong> Monday 7am at the job site. You need to complete harness inspection before work. System blocks you because your harness isn't in inventory. You call the office. They're not in until 9am. Two hours of billable time lost.
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                      <p className="text-muted-foreground">Inventory connects directly to harness inspections. Equipment must be assigned before inspection can occur. This ensures the system always knows what you're inspecting and builds complete equipment history.</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                      <p className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        The Benefit:
                      </p>
                      <p className="mt-1 text-muted-foreground">Clear workflow: assign gear, then inspect, then work. No blocked inspections from missing inventory setup. Your inspection records link to specific equipment serial numbers. Complete safety documentation for every piece of gear you use.</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded border border-amber-200 dark:border-amber-800 text-sm italic">
                      <strong>Validated:</strong> "In order to do harness inspections, in order to do drops, inventory's got to be done. Because they can't have a harness to inspect unless it's out of the inventory."
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Additional Core Problems */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            Additional Technical Problems Solved
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Generic Inventory Systems
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <p className="text-muted-foreground">Off-the-shelf inventory software treats all equipment the same. But rope access has unique requirements: IRATA certification tracking, service life monitoring, inspection integration, safety compliance documentation.</p>
                <p className="text-muted-foreground">Built by rope access professionals (IRATA Level 3 + Operations Manager) who experienced every pain point firsthand. Equipment types, terminology, workflows all designed for building maintenance and industrial rope work.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  Financial Value Visibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <p className="text-muted-foreground">You know you have "a lot" of equipment, but what's it actually worth? For insurance purposes, tax documentation, and business valuation, you need accurate asset values.</p>
                <p className="text-muted-foreground">Optional item price tracking with financial permission controls. Managers with financial access can see total inventory value. Regular employees see quantities without dollar amounts.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5 text-violet-600" />
                  Complex Permission Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <p className="text-muted-foreground">Some employees should only view inventory. Others should be able to assign equipment. Managers need full control. Building managers shouldn't see your internal inventory at all.</p>
                <p className="text-muted-foreground">Four-tier permission hierarchy plus automatic self-assignment. View inventory, manage inventory, assign gear, view team gear. Each permission grants specific capabilities.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* System Architecture */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Database className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            System Architecture: Three Tables
          </h2>
          <p className="text-muted-foreground text-base">
            The inventory system uses three interconnected database tables to manage equipment, assignments, and serial number tracking.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Package className="w-5 h-5" />
                  1. Gear Items (Inventory Catalog)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-base">
                <p className="text-muted-foreground">The master list of equipment your company owns.</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-muted-foreground">
                  <li><code className="text-xs bg-muted px-1 rounded">quantity</code> - Total count of this item type (the "slots")</li>
                  <li><code className="text-xs bg-muted px-1 rounded">equipmentType</code> - Category (harness, rope, descender, etc.)</li>
                  <li><code className="text-xs bg-muted px-1 rounded">brand</code>, <code className="text-xs bg-muted px-1 rounded">model</code> - Product identification</li>
                  <li><code className="text-xs bg-muted px-1 rounded">itemPrice</code> - Cost (only visible with financial permissions)</li>
                  <li><code className="text-xs bg-muted px-1 rounded">inService</code> - Whether item is available for use</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2 bg-emerald-50 dark:bg-emerald-950">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                  <Users className="w-5 h-5" />
                  2. Gear Assignments (Who Has What)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-base">
                <p className="text-muted-foreground">Records of which employees have which equipment. Each assignment "consumes" slots from the gear item's quantity.</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-muted-foreground">
                  <li><code className="text-xs bg-muted px-1 rounded">employeeId</code> - Who has the gear</li>
                  <li><code className="text-xs bg-muted px-1 rounded">quantity</code> - How many of this item they have</li>
                  <li><code className="text-xs bg-muted px-1 rounded">serialNumber</code> - Optional: which specific unit</li>
                  <li><code className="text-xs bg-muted px-1 rounded">dateOfManufacture</code>, <code className="text-xs bg-muted px-1 rounded">dateInService</code> - Per-assignment dates</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-900 dark:text-amber-100">
                  <Database className="w-5 h-5" />
                  3. Gear Serial Numbers (Optional Registry)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-base">
                <p className="text-muted-foreground">A registry of individual serial numbers for high-value or regulated equipment. Completely optional. The system works without any serial numbers.</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-muted-foreground">
                  <li><code className="text-xs bg-muted px-1 rounded">serialNumber</code> - Unique identifier for the unit</li>
                  <li><code className="text-xs bg-muted px-1 rounded">dateOfManufacture</code>, <code className="text-xs bg-muted px-1 rounded">dateInService</code> - Per-unit dates</li>
                  <li><code className="text-xs bg-muted px-1 rounded">isRetired</code> - Whether this specific unit is retired</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Permission Hierarchy */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Lock className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            Permission Hierarchy (Four Levels)
          </h2>
          <p className="text-muted-foreground text-base">
            Access to inventory features is controlled by four distinct permissions, plus automatic self-assignment for all employees.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2 bg-slate-50 dark:bg-slate-950">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-slate-600" />
                  Level 1: View Inventory
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-base">
                <Badge variant="outline" className="text-xs">canAccessInventory</Badge>
                <p className="text-muted-foreground">See all gear items, their quantities, and availability. Access the Inventory page.</p>
                <p className="text-sm text-muted-foreground"><strong>Who has it:</strong> All employees (automatically). NOT residents or property managers.</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Settings className="w-5 h-5" />
                  Level 2: Manage Inventory
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-base">
                <Badge variant="outline" className="text-xs">canManageInventory</Badge>
                <p className="text-muted-foreground">Add new gear items, edit quantities, register serial numbers, delete items.</p>
                <p className="text-sm text-muted-foreground"><strong>Who has it:</strong> Company owners (always), employees with "manage_inventory" permission.</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2 bg-emerald-50 dark:bg-emerald-950">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                  <UserCheck className="w-5 h-5" />
                  Level 3: Assign Gear
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-base">
                <Badge variant="outline" className="text-xs">canAssignGear</Badge>
                <p className="text-muted-foreground">Assign equipment to ANY employee, edit or remove assignments for others.</p>
                <p className="text-sm text-muted-foreground"><strong>Who has it:</strong> Company owners (always), employees with "assign_gear" permission.</p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardHeader className="pb-2 bg-violet-50 dark:bg-violet-950">
                <CardTitle className="text-lg flex items-center gap-2 text-violet-900 dark:text-violet-100">
                  <Users className="w-5 h-5" />
                  Level 4: View Team Gear
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-base">
                <Badge variant="outline" className="text-xs">canViewGearAssignments</Badge>
                <p className="text-muted-foreground">See what gear ALL employees have (Team Gear tab). Without this, employees only see their own gear.</p>
                <p className="text-sm text-muted-foreground"><strong>Who has it:</strong> Company owners (always), employees with "view_gear_assignments" permission.</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Zap className="w-5 h-5" />
                Special: Self-Assignment (No Permission Required)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 text-base">
              <p>All employees can assign available gear to THEMSELVES and remove their own assignments. No special permission required. Every employee, automatically.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Step-by-Step Workflows */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            Step-by-Step Workflows
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Workflow 1: Add New Gear to Inventory
                </CardTitle>
                <Badge variant="secondary" className="w-fit">Requires: canManageInventory</Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Navigate to <strong>Inventory</strong> page</li>
                  <li>Click <strong>"Add Item"</strong> button</li>
                  <li>Fill in equipment details (type, brand, model, quantity, price)</li>
                  <li>(Optional) Add serial numbers with manufacture/service dates</li>
                  <li>Click <strong>Save</strong></li>
                </ol>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Result: Item appears in inventory with [Quantity] available slots.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  Workflow 2: Manager Assigns Gear
                </CardTitle>
                <Badge variant="secondary" className="w-fit">Requires: canAssignGear</Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Navigate to <strong>Inventory</strong> page</li>
                  <li>Find the gear item (shows "X of Y available")</li>
                  <li>Click the item to open details</li>
                  <li>Click <strong>"Assign to Employee"</strong></li>
                  <li>Select target employee, enter quantity, (optional) serial</li>
                  <li>Click <strong>Assign</strong></li>
                </ol>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Result: Assignment created. Available slots decrease. Employee sees gear in "My Gear".</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HardHat className="w-5 h-5 text-amber-600" />
                  Workflow 3: Employee Self-Assigns
                </CardTitle>
                <Badge variant="secondary" className="w-fit">Requires: Any employee (no special permission)</Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Navigate to <strong>My Gear</strong> page (or Inventory)</li>
                  <li>Click <strong>"Add Gear from Inventory"</strong></li>
                  <li>Browse available items</li>
                  <li>Select item, quantity, and optional serial</li>
                  <li>Click <strong>Add to My Kit</strong></li>
                </ol>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Result: Gear assigned to yourself. Appears in "My Gear" immediately.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  Workflow 4: Return/Remove Gear
                </CardTitle>
                <Badge variant="secondary" className="w-fit">Requires: Assignment owner OR canAssignGear</Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <p className="text-muted-foreground font-medium">For your own gear:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Go to <strong>My Gear</strong></li>
                  <li>Find the assignment, click <strong>Remove</strong></li>
                </ol>
                <p className="text-muted-foreground font-medium mt-2">For others' gear (managers):</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Go to <strong>Inventory</strong> or <strong>Team Gear</strong></li>
                  <li>Click <strong>Remove Assignment</strong></li>
                </ol>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Result: Assignment deleted. Slot becomes available again.</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Workflow 5: Mark Equipment Out of Service
                </CardTitle>
                <Badge variant="secondary" className="w-fit">Requires: canManageInventory</Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Navigate to <strong>Inventory</strong> page</li>
                  <li>Find the gear item, click to open details</li>
                  <li>Toggle <strong>"In Service"</strong> to Off</li>
                  <li>Add reason/notes (optional)</li>
                  <li>Confirm change</li>
                </ol>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Result: Item remains in inventory but unavailable for new assignments. Existing assignments remain until returned.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Module Integration Points */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Share2 className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            Module Integration Points
          </h2>
          <p className="text-muted-foreground text-base">
            Gear Inventory doesn't exist in isolation. It's integrated with multiple OnRopePro modules.
          </p>
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded border border-blue-200 dark:border-blue-800 text-sm italic">
            <strong>Validated:</strong> "Everything connects. There is no one function in there that doesn't do something for something else."
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                  Harness Inspections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Equipment must be assigned before inspection can occur</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Inspection records link to specific serial numbers</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Failed inspections can trigger equipment retirement workflow</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  Work Sessions (Drops)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Gear must be assigned to technician before starting drops</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Equipment checkout is prerequisite for work authorization</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Links work records to specific equipment used</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-600" />
                  Employee Profiles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Assigned gear appears in employee kit</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Portable identity includes equipment history</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> 10-second onboarding for returning technicians</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  Safety Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Pre-work inspection requires assigned harness</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> No inspection = no work session allowed</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Audit-ready safety documentation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Reports & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Equipment utilization metrics</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Service life tracking for budget planning</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Assignment history for audit preparation</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Data-driven equipment budgeting</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quantified Business Impact */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Calculator className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            Quantified Business Impact
          </h2>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Time Savings (Per Week)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4">Activity</th>
                      <th className="text-left py-2 pr-4">Before OnRopePro</th>
                      <th className="text-left py-2 pr-4">With OnRopePro</th>
                      <th className="text-left py-2 font-bold text-emerald-600">Time Saved</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="py-2 pr-4">Finding equipment info</td>
                      <td className="py-2 pr-4">45 minutes</td>
                      <td className="py-2 pr-4">4 minutes</td>
                      <td className="py-2 font-bold text-emerald-600">41 minutes</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4">Equipment coordination</td>
                      <td className="py-2 pr-4">2 hours</td>
                      <td className="py-2 pr-4">15 minutes</td>
                      <td className="py-2 font-bold text-emerald-600">1.75 hours</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4">New hire equipment setup</td>
                      <td className="py-2 pr-4">45 min/hire</td>
                      <td className="py-2 pr-4">10 min/hire</td>
                      <td className="py-2 font-bold text-emerald-600">35 min/hire</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4">Audit preparation</td>
                      <td className="py-2 pr-4">2-3 days</td>
                      <td className="py-2 pr-4">4 minutes</td>
                      <td className="py-2 font-bold text-emerald-600">16+ hours</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Equipment disputes</td>
                      <td className="py-2 pr-4">30 min/dispute</td>
                      <td className="py-2 pr-4">2 minutes</td>
                      <td className="py-2 font-bold text-emerald-600">28 min/dispute</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-base font-medium">Total Administrative Time Saved: 5-8 hours/week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Equipment Cost Reduction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4">Loss Source</th>
                      <th className="text-left py-2 pr-4">Annual Cost Without</th>
                      <th className="text-left py-2 pr-4">With OnRopePro</th>
                      <th className="text-left py-2 font-bold text-emerald-600">Savings</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="py-2 pr-4">Lost/unreturned equipment</td>
                      <td className="py-2 pr-4">$2,000-4,000</td>
                      <td className="py-2 pr-4">Tracked & documented</td>
                      <td className="py-2 font-bold text-emerald-600">$2,000-4,000</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4">Emergency equipment purchases</td>
                      <td className="py-2 pr-4">$1,500-3,000</td>
                      <td className="py-2 pr-4">Service life planned</td>
                      <td className="py-2 font-bold text-emerald-600">$1,500-3,000</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4">Duplicate purchases</td>
                      <td className="py-2 pr-4">$1,000-2,000</td>
                      <td className="py-2 pr-4">Accurate counts</td>
                      <td className="py-2 font-bold text-emerald-600">$1,000-2,000</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Failed IRATA audits</td>
                      <td className="py-2 pr-4">Certification risk</td>
                      <td className="py-2 pr-4">Complete records</td>
                      <td className="py-2 font-bold text-emerald-600">Priceless</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-base font-medium">Total Annual Equipment Savings: $4,500-9,000</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Small Operator (3-5 techs)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-base text-blue-900 dark:text-blue-100">
                <p>Time savings: $12,000</p>
                <p>Equipment savings: $4,500</p>
                <p>Insurance savings: $1,500</p>
                <p className="font-bold text-lg pt-2">Total: $18,000/year</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-emerald-900 dark:text-emerald-100">Medium Operator (6-10 techs)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-base text-emerald-900 dark:text-emerald-100">
                <p>Time savings: $22,000</p>
                <p>Equipment savings: $7,000</p>
                <p>Insurance savings: $2,500</p>
                <p className="font-bold text-lg pt-2">Total: $31,500/year</p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-violet-900 dark:text-violet-100">Large Operator (15+ techs)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-base text-violet-900 dark:text-violet-100">
                <p>Time savings: $35,000</p>
                <p>Equipment savings: $12,000</p>
                <p>Insurance savings: $4,000</p>
                <p className="font-bold text-lg pt-2">Total: $51,000/year</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Best Practices */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            Best Practices & Tips
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Building2 className="w-5 h-5" />
                  For Company Owners
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-base">
                <div>
                  <p className="font-medium text-emerald-600 mb-1">Do:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Enter all equipment with accurate quantities on Day 1</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Set up permission levels before inviting employees</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Enable self-service assignment to reduce your workload</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Use serial numbers for safety-critical gear</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-rose-600 mb-1">Don't:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" /> Manually assign every item (let employees self-service)</li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" /> Skip serial numbers on harnesses and descenders</li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" /> Forget to mark equipment out of service when retired</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Briefcase className="w-5 h-5" />
                  For Operations Managers
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-base">
                <div>
                  <p className="font-medium text-emerald-600 mb-1">Do:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Check Team Gear view before scheduling crews</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Use atomic serial registration when distributing new equipment</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Train new hires on self-service assignment immediately</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Review service life indicators weekly</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-rose-600 mb-1">Don't:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" /> Delete serials that are currently assigned</li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" /> Skip date of manufacture when known</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-900 dark:text-amber-100">
                  <HardHat className="w-5 h-5" />
                  For Technicians
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-base">
                <div>
                  <p className="font-medium text-emerald-600 mb-1">Do:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Build your kit from available inventory on first day</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Complete harness inspection when prompted</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Return gear properly when assignment ends</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Use self-service to grab backup equipment when needed</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-rose-600 mb-1">Don't:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" /> Take equipment without self-assigning in system</li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" /> Share assigned gear with coworkers</li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" /> Skip inspections (blocks work sessions)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* FAQ Section */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Info className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            Frequently Asked Questions
          </h2>

          <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
            <AccordionItem value="faq-1">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-1">
                <span className="font-semibold">"What if I have 10 harnesses but only registered 5 serial numbers?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-base text-muted-foreground">
                <p>You still have 10 available slots. Serial numbers are optional metadata, not gatekeepers. You can assign all 10 even with only 5 serials registered.</p>
                <p>The slot-based model counts quantity, not serial registrations. This flexibility allows you to add serials gradually as equipment is distributed.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-2">
                <span className="font-semibold">"Can two different items have the same serial number?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-base text-muted-foreground">
                <p>Yes. Serial numbers must be unique within each gear item type, but a harness and a rope can both have serial "HR-001".</p>
                <p>Different manufacturers may use similar numbering schemes. The system prevents duplicates within an item type, which is what matters for tracking.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-3">
                <span className="font-semibold">"What happens when equipment expires?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-base text-muted-foreground">
                <p>The system tracks in-service dates with color-coded indicators for manual review. Hard gear (5 years) and soft gear (10 years) guidelines are displayed. You decide when to retire based on inspections and manufacturer recommendations.</p>
                <p><strong>Important:</strong> OnRopePro provides data for decision-making. Actual retirement decisions should involve qualified safety professionals.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-4">
                <span className="font-semibold">"Who can see equipment prices?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-base text-muted-foreground">
                <p>Only users with financial permissions. Regular employees see quantities and assignments but not dollar values.</p>
                <p>Financial data is sensitive. Owners need it for budgeting and insurance. Employees don't need to know what their harness cost.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-5">
                <span className="font-semibold">"Can I delete a serial number that's assigned to someone?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-base text-muted-foreground">
                <p>No. You must return the gear assignment first, then you can delete or edit the serial.</p>
                <p>This prevents orphaned assignments pointing to non-existent serials. Data integrity is maintained by enforcing proper return workflow.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-6">
                <span className="font-semibold">"What if I need to reduce quantity below what's assigned?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-base text-muted-foreground">
                <p>You cannot. If 5 items are assigned, you cannot reduce quantity below 5. Return some assignments first.</p>
                <p>This prevents negative availability and ensures the system always reflects physical reality.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-7">
                <span className="font-semibold">"Do employees need permission to assign gear to themselves?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-base text-muted-foreground">
                <p>No. All employees can self-assign from available inventory. No special permission required.</p>
                <p>This reduces administrative burden. Employees take ownership of their kit. Managers focus on oversight, not data entry.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <Separator />

        {/* Summary */}
        <section className="space-y-4">
          <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Package className="w-5 h-5" />
                Why Gear Inventory Is Different
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-900 dark:text-blue-100 space-y-4 text-base">
              <p>Most inventory software treats equipment as static assets sitting on shelves. OnRopePro recognizes that in rope access, gear inventory is the <strong>FOUNDATION</strong> connecting:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Safety Compliance:</strong> Harness inspections require assigned equipment</li>
                <li><strong>Work Authorization:</strong> Can't start drops without gear checkout</li>
                <li><strong>Employee Identity:</strong> Personal kits become part of technician profiles</li>
                <li><strong>Liability Protection:</strong> Assignment records prove who had what, when</li>
                <li><strong>Financial Planning:</strong> Service life tracking prevents budget surprises</li>
                <li><strong>Audit Readiness:</strong> Complete equipment history in seconds, not days</li>
              </ul>
              <p className="font-medium">When you manage inventory in OnRopePro, you're not just tracking assets. You're building the accountability infrastructure that protects your people, your equipment, and your business.</p>
              <p className="text-sm italic">"Every single problem that we list, like the major problem, is something that just made my day worse and worse."</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
