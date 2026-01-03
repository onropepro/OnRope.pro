import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  Users,
  Shield,
  Lock,
  Eye,
  Settings,
  Building2,
  Home,
  Briefcase,
  HardHat,
  UserPlus,
  Key,
  LogIn,
  ChevronRight,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Layers,
  Crown,
  Wrench,
  Clipboard,
  DollarSign,
  Package,
  MessageSquare,
  FileText,
  BarChart3,
  UserCog,
  Clock,
  Calendar,
  Fingerprint,
  KeyRound,
  User,
  ShieldCheck,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ALL_ACCORDION_ITEMS = [
  "owner-1", "owner-2", "owner-3", "owner-4", "owner-5", "owner-6",
  "ops-1",
  "bm-1", "bm-2", "bm-3", "bm-4",
  "res-1", "res-2", "res-3",
  "sec-1", "sec-2"
];

export default function UserAccessGuide() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const allExpanded = openItems.length === ALL_ACCORDION_ITEMS.length;

  const toggleAll = () => {
    if (allExpanded) {
      setOpenItems([]);
    } else {
      setOpenItems([...ALL_ACCORDION_ITEMS]);
    }
  };

  return ( 
    <ChangelogGuideLayout 
      title="User Access & Authentication Guide"
      version="2.1"
      lastUpdated="December 5, 2025"
    >
      <div className="space-y-8">
        
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            OnRopePro implements a sophisticated role-based access control system with <strong>company-scoped multi-tenant architecture</strong>. Each company's data remains completely isolated, and users can only access information relevant to their assigned company and role permissions.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base">
            The platform supports three distinct user categories with <strong>granular, customizable permissions</strong> to accommodate diverse organizational structures across the rope access industry.
          </p>
        </section>

        <section className="space-y-6">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Key className="w-5 h-5" />
                The Golden Rule: Role + Permissions = Access
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Access = Base Role + Granular Permissions
                </p>
              </div>
              
              <div className="space-y-2 text-base">
                <p><strong>Key Principles:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>1.</strong> Each user has exactly one base role Company Owner, Operations Manager, Supervisor, Technician, etc.)</li>
                  <li><strong>2.</strong> Base roles provide organizational structure, they suggest typical access patterns but do NOT determine permissions</li>
                  <li><strong>3.</strong> Permissions are customized per employee by the company owner, regardless of role title</li>
                  <li><strong>4.</strong> Permissions define what users can actually do with the data they can access</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Same Role, Different Capabilities
                </p>
                <p className="mt-1">Two Operations Managers at different companies can have completely different permissions. Role titles are organizational labels, not permission sets.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Key Features Section */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Key Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Multi-Tenant Architecture</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete data isolation between companies. Each organization sees only their own employees, projects, and financial data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <UserCog className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Granular Permissions</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Customize exactly what each employee can view and edit. Separate operational access from financial visibility.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-action-100 dark:bg-action-900 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-action-600 dark:text-action-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Building-Level Accounts</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Property managers use building accounts that persist through staff turnover. No vendor coordination when managers change.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <HardHat className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">IRATA Level Tracking</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track irata/SPRAT certification levels for each technician. Filter by qualification when assigning crews to projects.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
                    <Home className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Resident Portal</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Building occupants check progress themselves. Real-time visibility reduces status calls to property managers by 60-70%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Role-Based Access Control</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Define roles with customizable capabilities. Same role title at different companies can have entirely different permissions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Problems Solved</h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                Real challenges addressed by OnRopePro's User Access & Authentication module.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={toggleAll}
              data-testid="button-toggle-all-accordions"
            >
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          {/* Company Owners Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Rope Access Company Owners</h3>
            </div>
            
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="owner-1" className={`border rounded-lg px-4 ${openItems.includes("owner-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Supervisors accidentally seeing everyone's pay rates</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You need your supervisor to create projects and assign technicians, but the moment you give them access, they can see what every technician earns. Generic construction software forces you to choose: operational efficiency or payroll privacy.</p>
                    <p><span className="font-medium text-foreground">Example:</span> Your operations manager needs to review project budgets to ensure profitability, but you don't want them seeing individual hourly rates. Traditional systems make this impossible, budget access automatically includes rate visibility.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> OnRopePro's flexible permission system separates operational capabilities from financial visibility. Grant your supervisor project creation rights, employee assignment capabilities, and schedule management, while keeping hourly rates, labor costs, and payroll data owner-only.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Delegate confidently without compromising financial privacy. Supervisors manage day-to-day operations without seeing what anyone earns.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className={`border rounded-lg px-4 ${openItems.includes("owner-2") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Financial data visible to people who shouldn't see it</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>Your bookkeeper needs access to generate reports. Your field supervisor needs to check if projects are on budget. But once they're in the system, they can see everything, company-wide profitability, individual employee rates, sensitive client billing margins.</p>
                    <p><span className="font-medium text-foreground">Example:</span> You hire a new administrative assistant to help with invoicing. Within a week, they know exactly how much profit you make on each client, what your best technicians earn, and which jobs are money-losers.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Granular permission controls let you grant exactly what each employee needs. Your bookkeeper sees aggregate labor costs but not individual rates. Your supervisor sees project budgets but not company-wide profitability.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Protect sensitive financial information while still delegating operational responsibilities. No more "all or nothing" access decisions.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className={`border rounded-lg px-4 ${openItems.includes("owner-3") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Can't track IRATA certifications</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You've got 15 technicians with different IRATA levels. Client contracts require Level 2 or higher for certain buildings. Insurance audits demand proof of certification levels. But you're tracking this in a spreadsheet that's always outdated.</p>
                    <p><span className="font-medium text-foreground">Example:</span> A client asks: "Which of your technicians are Level 2 or 3 and available next week?" You're digging through certification files, checking expiry dates, cross-referencing the schedule. This takes 30 minutes.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Each employee profile includes IRATA level Level 1, 2, or 3) tracked in the system. When you need to assign work or respond to client requirements, you see certification levels instantly.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Instant visibility into team qualifications. Respond to client questions in seconds, not minutes.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-4" className={`border rounded-lg px-4 ${openItems.includes("owner-4") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">No control over who can edit/delete projects</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>Everyone with system access can modify or delete projects, including your newest technician who accidentally deleted last month's completed job when trying to log today's drops.</p>
                    <p><span className="font-medium text-foreground">Example:</span> A technician accidentally changes the North elevation from 120 drops to 12 drops. The error isn't discovered until the client questions why you only invoiced for 12 drops.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Project management permissions control who can create, edit, and delete projects. Restrict these capabilities to supervisors and managers while technicians can only log work for assigned projects.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Protect project data integrity. Maintain accurate records for client billing and historical reference.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-5" className={`border rounded-lg px-4 ${openItems.includes("owner-5") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Crew members changing data they shouldn't access</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>A technician logs into the system and edits their own hourly rate from $32 to $42 per hour. They change last week's drop counts. You discover this during payroll processing.</p>
                    <p><span className="font-medium text-foreground">Example:</span> Your most experienced tech goes into past projects and adds extra drops to his record for his upcoming performance review. The client complains when photos don't match invoiced drop counts.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Permission-based access controls what each employee can view and modify. Technicians see only their own work records. Only owners can modify rates and historical records.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Prevent unauthorized data changes. Create clear audit trails.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-6" className={`border rounded-lg px-4 ${openItems.includes("owner-6") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Subscription limit monitoring</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You're on the Tier 1 plan with 8 included seats. You hire two people thinking you had space, but discover you're now at 9 seats and being charged extra per seat.</p>
                    <p><span className="font-medium text-foreground">Example:</span> Peak season hits. You need to hire 3 temporary technicians but can't remember your plan's seat limit. You delay hiring while trying to figure out your subscription status.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Employee management dashboard displays subscription tier limits clearly: "Using 7 of 8 seats" with visual indicators showing capacity.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Make hiring decisions confidently. Avoid surprise overage charges.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Operations Managers Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Briefcase className="w-5 h-5 text-action-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Operations Managers & Supervisors</h3>
            </div>
            
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="ops-1" className={`border rounded-lg px-4 ${openItems.includes("ops-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Need to delegate responsibility but can't give full access</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You're coordinating 3-4 concurrent projects. You want your field supervisors to create projects and adjust schedules. But you can't give them access without exposing pay rates and company profitability.</p>
                    <p><span className="font-medium text-foreground">Example:</span> Your most trusted supervisor handles the North Shore territory. When clients call, he has to call you to create projects. This creates bottlenecks, clients wait hours for simple project setup.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Grant supervisors project creation and management permissions without financial data access. They create projects and manage schedules while rates and margins remain visible only to owners.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Eliminate bottlenecks. Response time to clients improves from hours to minutes.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Building Managers Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Building2 className="w-5 h-5 text-violet-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Building Managers & Property Managers</h3>
            </div>
            
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="bm-1" className={`border rounded-lg px-4 ${openItems.includes("bm-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Administrative burden from tenant turnover</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>Your property management company manages 40 buildings. Building managers turnover every 6-12 months. Every time someone leaves, you contact every vendor to deactivate the old account and create a new one. This takes 2-3 days per manager change.</p>
                    <p><span className="font-medium text-foreground">Example:</span> Sarah managed Tower One for 8 months then transferred. Mike takes over. You send emails to 12 vendors. Only 4 respond within a week. Three weeks later, Sarah still has access and Mike can't log in.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Building-level accounts eliminate individual manager account management. Each building has one permanent account. When managers change, update the password, access instantly transfers. No vendor coordination.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Manager transitions take 30 seconds instead of 3 days.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="bm-2" className={`border rounded-lg px-4 ${openItems.includes("bm-2") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Residents calling constantly during maintenance work</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>During window cleaning season, your office phone never stops. "When are they coming to my side?" Your staff spends 15-20 hours per week answering progress questions.</p>
                    <p><span className="font-medium text-foreground">Example:</span> It's Wednesday during a 2-week cleaning project. You've received 47 calls since Monday. Your admin is on call #48. She has to call the maintenance company, wait for callback, then call the resident back. One question consumed 25 minutes.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Resident portal gives building occupants real-time visibility. They see which sides are complete, view progress photos, and check the project schedule.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Reduce resident calls by 60-70% during maintenance periods.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="bm-3" className={`border rounded-lg px-4 ${openItems.includes("bm-3") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Feedback escalating to building managers instead of vendors</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>Residents encounter issues during maintenance, missed windows, water damage, scheduling conflicts. But there's no direct way to report to the maintenance company. So residents call you, and you become the middleman.</p>
                    <p><span className="font-medium text-foreground">Example:</span> Mrs. Chen emails you photos of streaky windows. You forward to the rope access company. Three days pass with no response. Meanwhile, Mrs. Chen files strata council complaints about management responsiveness.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Centralized feedback system with building-level visibility. Residents submit feedback directly to the maintenance company. You see all feedback in real-time without being the middleman.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Average resolution time drops from 3-5 days to 24 hours.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="bm-4" className={`border rounded-lg px-4 ${openItems.includes("bm-4") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Building managers don't see your value - scattered communication</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>Your maintenance vendors communicate through text messages, personal emails, phone calls, sticky notes. When you need to compile a report for the strata council, you're digging through months of texts and emails.</p>
                    <p><span className="font-medium text-foreground">Example:</span> The strata council questions why they should renew the rope access contract. "How do we know they're responsive?" You're scrolling through texts from March. You can't provide concrete data.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Professional vendor portal provides complete visibility: real-time progress, photo galleries, all feedback with response times tracked, and downloadable reports for council presentations.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Generate professional reports in 2 minutes instead of 2 hours of digging.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Residents Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Home className="w-5 h-5 text-rose-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Building Residents</h3>
            </div>
            
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="res-1" className={`border rounded-lg px-4 ${openItems.includes("res-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">No transparency into work progress</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You see maintenance equipment on the roof. Scaffolding goes up on the west side. You have no idea what's being done, when it will be done, or if it will affect your unit. So you call the building manager. So does everyone else.</p>
                    <p><span className="font-medium text-foreground">Example:</span> You're in Unit 1847 on the east side. Monday morning you see technicians on the west side. Are they coming to your side? You need to move plants on your balcony before cleaning. You call the building manager. They don't know, they have to contact the vendor.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Resident portal shows your building's project in real-time. You see which elevations are complete, view the schedule showing east elevation starts Wednesday. You move your plants Tuesday night. No calls necessary.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Plan your schedule around maintenance work. No surprises. Reduced stress.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="res-2" className={`border rounded-lg px-4 ${openItems.includes("res-2") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">No record of feedback resolution</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You notice streaks on your windows after the cleaning crew left. You email the building manager with photos. Days pass with no acknowledgment. A week later, you email again. No response. You don't know if anyone saw your complaint.</p>
                    <p><span className="font-medium text-foreground">Example:</span> Your windows have water damage stains after pressure washing. You email Monday. By Friday you've heard nothing. Wednesday you finally get a call: "I forwarded that last week, I think they're planning to come back." No timeline, no accountability.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Submit feedback directly through the portal with photos. System timestamps your submission. You see status change from "Open" to "In Progress" when acknowledged, then "Closed" when fixed with photos of corrected work.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Know your concern was received immediately. Average resolution 24 hours vs. 3-5 days.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="res-3" className={`border rounded-lg px-4 ${openItems.includes("res-3") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">3-day resolution times from phone tag</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>The communication chain is broken: resident to building manager to maintenance company back to building manager back to resident. Each handoff adds 12-24 hours of delay.</p>
                    <p><span className="font-medium text-foreground">Example:</span> Unit 3205 has a broken window screen. Resident emails building manager Tuesday. Manager forwards Tuesday afternoon. Company schedules repair for Thursday. Resident isn't home Thursday because nobody told them. Repair happens Friday, 3 days for a 15-minute fix.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Direct resident-to-vendor feedback system cuts out the middleman while keeping building managers informed. Resident submits issue Tuesday 9am. Company sees it Tuesday 9:05am, responds at 10am. Issue resolved Wednesday 2pm.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> 3-day resolution becomes 24-hour resolution.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Security Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Shield className="w-5 h-5 text-emerald-500" />
              <h3 className="text-xl md:text-2xl font-semibold">Security & Data Protection</h3>
            </div>
            
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="sec-1" className={`border rounded-lg px-4 ${openItems.includes("sec-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Multi-tenant data isolation</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You're a small rope access company. You can't afford enterprise-grade IT security. But you handle sensitive information: employee SINs, hourly rates, client billing data, building access codes, resident feedback.</p>
                    <p><span className="font-medium text-foreground">Example:</span> You're evaluating a construction software platform. Their security documentation is vague. You ask: "Can other companies see my data?" The answer is concerning: "Our system uses role-based permissions." That doesn't answer the question.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Complete multi-tenant isolation architecture. Your company's data exists in a completely separate partition from every other company. A security flaw in another company's account cannot expose your data.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Bank-level data protection without hiring security experts. Regulatory compliance for privacy laws.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sec-2" className={`border rounded-lg px-4 ${openItems.includes("sec-2") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Password security</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You require employees to create strong passwords, but you have no way to enforce it. Technicians use "password123" or their birthdate. When someone leaves, if their password was stored in plain text, it could be used on other systems.</p>
                    <p><span className="font-medium text-foreground">Example:</span> A technician creates his account with password "Rope2024". Six months later he leaves to work for a competitor. His password was stored in plain text. If someone breaches your system, they could try those passwords on your email and other platforms.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Industry-standard bcrypt password hashing with salt rounds. Passwords are never stored in plain text, not even you can see them. Even if someone gained database access, they would see only irreversible hashes.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Protect employee accounts even if database is compromised. Eliminate "I forgot my password and need you to tell me what it is" requests, you literally cannot retrieve passwords, only reset them.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Three User Categories
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base">Users fall into one of three distinct categories with different authentication and data access patterns:</p>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-2 border-amber-200 dark:border-amber-900">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-base">Company Accounts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Company owners and staff employees operations managers, supervisors, technicians, administrative staff).</p>
                <div className="bg-amber-50 dark:bg-amber-950 p-2 rounded text-sm space-y-1">
                  <p className="font-semibold">Authentication:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Email-based username</li>
                    <li>Password authentication</li>
                    <li>Company-scoped access</li>
                  </ul>
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Characteristics:</span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-muted-foreground">
                    <li>Full internal system access based on permissions</li>
                    <li>Access spans all company projects</li>
                    <li>Role config controlled by company owner</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-blue-900">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <HardHat className="w-5 h-5 text-action-600" />
                  <CardTitle className="text-base">Employee Accounts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Field technicians, supervisors, managers, specialized roles HR, accounting, inventory).</p>
                <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded text-sm space-y-1">
                  <p className="font-semibold">Authentication:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Created by company owner</li>
                    <li>Assigned base role</li>
                    <li>Individual permission assignment</li>
                  </ul>
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Characteristics:</span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-muted-foreground">
                    <li>Access determined by permission grants</li>
                    <li>Permissions NOT inherited from role</li>
                    <li>Can be modified at any time</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-900">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-base">External Accounts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Building residents, property managers, building-level accounts.</p>
                <div className="bg-green-50 dark:bg-green-950 p-2 rounded text-sm space-y-1">
                  <p className="font-semibold">Authentication:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Unique company linking codes</li>
                    <li>Building/unit-specific access</li>
                    <li>Limited to building data only</li>
                  </ul>
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Characteristics:</span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-muted-foreground">
                    <li>Read-only or limited write access</li>
                    <li>Cannot access company-wide data</li>
                    <li>Auto access transfer on change</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Employee Roles & Flexible Permissions
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            Company owners select from predefined base roles OR create custom roles. <strong>Base roles organize your team structure but do NOT dictate permissions.</strong>
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-600" />
                  Executive/Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Company Owner</span>
                    <span className="text-xs text-muted-foreground">Ultimate admin control</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Operations Manager</span>
                    <span className="text-xs text-muted-foreground">Day-to-day operations</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Account Manager</span>
                    <span className="text-xs text-muted-foreground">Client relationships</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Administrative
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Human Resources</span>
                    <span className="text-xs text-muted-foreground">Onboarding, compliance</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Accounting</span>
                    <span className="text-xs text-muted-foreground">Financial, payroll</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clipboard className="w-4 h-4 text-action-600" />
                  Field Leadership
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">General Supervisor</span>
                    <span className="text-xs text-muted-foreground">Multi-trade oversight</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Rope Access Supervisor</span>
                    <span className="text-xs text-muted-foreground">Rope team leadership</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Rope Access Manager</span>
                    <span className="text-xs text-muted-foreground">Rope operations mgmt</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Support Staff Supervisor</span>
                    <span className="text-xs text-muted-foreground">Ground operations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <HardHat className="w-4 h-4 text-cyan-600" />
                  Field Workers
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Rope Access Technician</span>
                    <span className="text-xs text-muted-foreground">Certified rope work</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Support Staff</span>
                    <span className="text-xs text-muted-foreground">Ground-level support</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Laborer</span>
                    <span className="text-xs text-muted-foreground">General labor tasks</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-purple-900 dark:text-purple-100">
                <UserCog className="w-4 h-4" />
                Custom Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base text-purple-900 dark:text-purple-100">
              <p>For specialized organizational needs, company owners can create custom role titles:</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="outline">Inventory Manager</Badge>
                <Badge variant="outline">Safety Officer</Badge>
                <Badge variant="outline">Quality Control Inspector</Badge>
                <Badge variant="outline">Training Coordinator</Badge>
                <Badge variant="outline">Client Services Rep</Badge>
                <Badge variant="outline">Estimator</Badge>
              </div>
              <p className="mt-2 text-xs">Custom roles function identically to standard roles - they receive granular permission assignments and serve primarily for organizational clarity.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-action-600 dark:text-action-400" />
            How Permission Assignment Works
          </h2>

          <Card>
            <CardContent className="pt-4">
              <div className="relative text-sm">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-blue-200 dark:bg-blue-800" />
                
                <div className="relative flex gap-4 pb-6">
                  <div className="relative z-10 bg-blue-600 dark:bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <span className="font-bold text-white text-sm">1</span>
                  </div>
                  <div className="pt-1">
                    <p className="font-medium">Company Owner creates new employee account</p>
                  </div>
                </div>

                <div className="relative flex gap-4 pb-6">
                  <div className="relative z-10 bg-blue-600 dark:bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <span className="font-bold text-white text-sm">2</span>
                  </div>
                  <div className="pt-1">
                    <p className="font-medium">Selects base role</p>
                    <p className="text-xs text-muted-foreground mt-0.5">e.g., "Operations Manager" or "Inventory Manager"</p>
                  </div>
                </div>

                <div className="relative flex gap-4 pb-6">
                  <div className="relative z-10 bg-blue-600 dark:bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <span className="font-bold text-white text-sm">3</span>
                  </div>
                  <div className="pt-1">
                    <p className="font-medium">Assigns granular permissions across all categories</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="secondary" className="text-xs">Financial</Badge>
                      <Badge variant="secondary" className="text-xs">Project Mgmt</Badge>
                      <Badge variant="secondary" className="text-xs">Employee Mgmt</Badge>
                      <Badge variant="secondary" className="text-xs">Inventory</Badge>
                      <Badge variant="secondary" className="text-xs">Feedback</Badge>
                      <Badge variant="secondary" className="text-xs">Safety</Badge>
                      <Badge variant="secondary" className="text-xs">Documents</Badge>
                      <Badge variant="secondary" className="text-xs">Analytics</Badge>
                    </div>
                  </div>
                </div>

                <div className="relative flex gap-4 pb-6">
                  <div className="relative z-10 bg-blue-600 dark:bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <span className="font-bold text-white text-sm">4</span>
                  </div>
                  <div className="pt-1">
                    <p className="font-medium">Employee receives unique access profile</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Role + custom permissions combined</p>
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div className="relative z-10 bg-green-600 dark:bg-green-500 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="pt-1">
                    <p className="font-medium">Permissions can be modified at any time</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Company owner can adjust as responsibilities change</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-blue-900 dark:text-blue-100">Real-World Example: Technician Promotion</CardTitle>
            </CardHeader>
            <CardContent className="text-base text-blue-900 dark:text-blue-100">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/50 dark:bg-blue-900/50 rounded-lg p-3">
                  <p className="font-semibold mb-2">Before Rope Access Technician):</p>
                  <ul className="space-y-1 text-base">
                    <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Clock in/out</li>
                    <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Log drops</li>
                    <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Upload photos</li>
                    <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Submit inspections</li>
                  </ul>
                </div>
                <div className="bg-white/50 dark:bg-blue-900/50 rounded-lg p-3">
                  <p className="font-semibold mb-2">After Supervisor):</p>
                  <ul className="space-y-1 text-base">
                    <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Create projects</li>
                    <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Assign employees</li>
                    <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Review feedback</li>
                    <li className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> Financial data restricted)</li>
                    <li className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> Employee rates restricted)</li>
                  </ul>
                </div>
              </div>
              <p className="mt-3 text-xs text-center">Same person, new role, custom permission set matching their responsibilities</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
            Granular Permissions
          </h2>
          
          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/50">
            <CardContent className="pt-4 text-base text-amber-900 dark:text-amber-100">
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                Important: Permissions are NOT determined by role alone
              </p>
              <ul className="mt-2 space-y-1 text-base list-disc list-inside">
                <li>Company owners select base roles for organizational clarity</li>
                <li>Then assign granular permissions individually per employee</li>
                <li>Same role can have different permissions across companies</li>
                <li>Permissions can be modified at any time</li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Financial Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-base text-muted-foreground">Control access to sensitive cost and rate information:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded">View Financial Data - Labor costs, project budgets, hourly rates</div>
                  <div className="p-2 bg-muted rounded">View Employee Rates - Specific technician hourly wages</div>
                  <div className="p-2 bg-muted rounded">Edit Pricing - Quote values, project estimates, billing rates</div>
                  <div className="p-2 bg-muted rounded">Access Payroll Reports - Aggregated payroll summaries</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clipboard className="w-4 h-4 text-action-600" />
                  Project Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-base text-muted-foreground">Control project lifecycle and coordination:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded">Create Projects - Set up new building maintenance projects</div>
                  <div className="p-2 bg-muted rounded">Edit Projects - Modify details, targets, completion dates</div>
                  <div className="p-2 bg-muted rounded">Delete Projects - Remove from system with warnings)</div>
                  <div className="p-2 bg-muted rounded">Mark Complete / View All / Assign Employees</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Employee Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-base text-muted-foreground">Control team administration and sensitive data:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded">Create Employees - Onboard new team members</div>
                  <div className="p-2 bg-muted rounded">Edit Employees - Modify roles, rates, permissions</div>
                  <div className="p-2 bg-muted rounded">Deactivate Employees - Remove access for departed staff</div>
                  <div className="p-2 bg-muted rounded">View All / Assign Roles / Manage Permissions</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-600" />
                  Inventory Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-base text-muted-foreground">Control equipment and asset management:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded">View Inventory - Access equipment lists and tracking</div>
                  <div className="p-2 bg-muted rounded">Add Inventory - Create new equipment records</div>
                  <div className="p-2 bg-muted rounded">Edit Inventory - Update details, status, assignments</div>
                  <div className="p-2 bg-muted rounded">Assign Equipment / Track Inspections</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-600" />
                  Feedback Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-base text-muted-foreground">Control resident and client communication:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded">View Feedback - Access submitted feedback from residents</div>
                  <div className="p-2 bg-muted rounded">Respond to Feedback - Add public responses</div>
                  <div className="p-2 bg-muted rounded">Add Internal Notes - Private team coordination</div>
                  <div className="p-2 bg-muted rounded">Close Feedback / Delete Feedback / View Analytics</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-600" />
                  Safety & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-base text-muted-foreground">Control documentation and regulatory oversight:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded">Submit Inspections - Complete daily harness/equipment checks</div>
                  <div className="p-2 bg-muted rounded">View Inspections - Access inspection history</div>
                  <div className="p-2 bg-muted rounded">Approve Inspections - Supervisor review and sign-off</div>
                  <div className="p-2 bg-muted rounded">Create Toolbox Meetings / View Safety Docs / Manage Compliance</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Document Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-base text-muted-foreground">Control file uploads and access:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded">Upload Documents - Add PDFs, photos, certificates</div>
                  <div className="p-2 bg-muted rounded">View Documents - Access project or company-wide files</div>
                  <div className="p-2 bg-muted rounded">Delete Documents - Remove files from system</div>
                  <div className="p-2 bg-muted rounded">Download Documents - Export files for offline use</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-600" />
                  Reporting & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-base text-muted-foreground">Control business intelligence access:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded">View Analytics Dashboard - Performance metrics, productivity</div>
                  <div className="p-2 bg-muted rounded">Export Reports - Generate CSV/PDF summaries</div>
                  <div className="p-2 bg-muted rounded">View Historical Data - Access past project archives</div>
                  <div className="p-2 bg-muted rounded">Financial Reporting - Revenue, cost, profitability analyses</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-4 text-base text-amber-900 dark:text-amber-100">
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                Permission Assignment Best Practices
              </p>
              <p className="mt-2 text-xs"><strong>Best Practice:</strong> Grant minimum necessary permissions. You can always add more later.</p>
              <div className="mt-2 space-y-1 text-base">
                <p className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-600" /> Giving all supervisors financial access only budget managers need it)</p>
                <p className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-600" /> Restricting project creation to owners only supervisors often need this)</p>
                <p className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-600" /> Giving technicians access to all employee data privacy concern)</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Home className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            External User Roles
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-2 border-teal-200 dark:border-teal-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Home className="w-5 h-5 text-teal-600" />
                  Resident
                </CardTitle>
                <CardDescription>Building occupants monitoring work progress</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="bg-teal-50 dark:bg-teal-950 p-2 rounded space-y-1">
                  <p className="font-semibold text-xs">Authentication:</p>
                  <ul className="list-disc list-inside text-sm space-y-0.5">
                    <li>Self-registration with company access code</li>
                    <li>Unit-specific codes e.g., "BLD2024-U207")</li>
                    <li>Each unit has permanent access code</li>
                  </ul>
                </div>

                <div className="space-y-1 text-base">
                  <p className="font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> What they can do:</p>
                  <ul className="list-disc list-inside ml-3 space-y-0.5 text-muted-foreground">
                    <li>View their building's active projects</li>
                    <li>See real-time work progress</li>
                    <li>Access project photo galleries</li>
                    <li>Submit feedback with photos</li>
                    <li>Track feedback status</li>
                  </ul>
                </div>

                <div className="space-y-1 text-base">
                  <p className="font-semibold flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> What they cannot do:</p>
                  <ul className="list-disc list-inside ml-3 space-y-0.5 text-muted-foreground">
                    <li>View other buildings or company data</li>
                    <li>Access internal notes or coordination</li>
                    <li>See labor costs or financial data</li>
                    <li>Modify projects or work records</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-200 dark:border-indigo-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  Building Manager
                </CardTitle>
                <CardDescription>Property management personnel</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="bg-indigo-50 dark:bg-indigo-950 p-2 rounded space-y-1">
                  <p className="font-semibold text-xs">Building-Level Accounts:</p>
                  <ul className="list-disc list-inside text-sm space-y-0.5">
                    <li>Each building gets ONE permanent account</li>
                    <li>Current manager uses those credentials</li>
                    <li>When manager changes: Just update password</li>
                    <li>Access automatically transfers to new manager</li>
                  </ul>
                </div>

                <div className="space-y-1 text-base">
                  <p className="font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> What they can do:</p>
                  <ul className="list-disc list-inside ml-3 space-y-0.5 text-muted-foreground">
                    <li>View all projects for their building(s)</li>
                    <li>Monitor real-time work progress</li>
                    <li>Access project photo documentation</li>
                    <li>Review resident feedback</li>
                    <li>Download compliance reports</li>
                  </ul>
                </div>

                <div className="space-y-1 text-base">
                  <p className="font-semibold flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> What they cannot do:</p>
                  <ul className="list-disc list-inside ml-3 space-y-0.5 text-muted-foreground">
                    <li>View financial data costs, rates, budgets)</li>
                    <li>Access employee information</li>
                    <li>Modify project details or work records</li>
                    <li>See other buildings in the system</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <LogIn className="w-5 h-5 text-green-600 dark:text-green-400" />
            Authentication Flow
          </h2>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-600">Flow 1</Badge>
                    <CardTitle>Company Registration</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>User navigates to registration page</li>
                  <li>Enters company details name, email, initial password)</li>
                  <li>System creates new company record in database</li>
                  <li>Creates first user account with ultimate permissions</li>
                  <li>User receives confirmation and can log in</li>
                </ol>
                <div className="bg-amber-50 dark:bg-amber-950 p-2 rounded text-sm">
                  <strong>Result:</strong> New company tenant created with isolated data space
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600">Flow 2</Badge>
                    <CardTitle>Employee Onboarding</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Company owner navigates to employee management</li>
                  <li>Enters employee details: name, email, temporary password</li>
                  <li>Adds IRATA level and hourly rate if applicable)</li>
                  <li>Selects base role from dropdown standard or custom)</li>
                  <li>Assigns granular permissions across all categories</li>
                  <li>Employee can immediately log in and change password</li>
                </ol>
                <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded text-sm">
                  <strong>Note:</strong> No email verification required. Company owner is trusted to onboard legitimate employees.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">Flow 3</Badge>
                    <CardTitle>Resident/Building Manager Linking</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>User registers as Resident or Building Manager</li>
                  <li>Receives linking code from company email, notice, or QR code)</li>
                  <li>Enters code on linking page during registration</li>
                  <li>System validates code and links user to specific building/unit</li>
                </ol>
                <div className="bg-green-50 dark:bg-green-950 p-2 rounded text-sm space-y-1">
                  <p><strong>Code Types:</strong></p>
                  <ul className="list-disc list-inside">
                    <li>Resident codes: Unit-specific e.g., "BLD2024-U207")</li>
                    <li>Building manager codes: Building-level e.g., "BLDMGR-TOWER1")</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-violet-600">Flow 4</Badge>
                    <CardTitle>Property Manager Registration</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Property manager registers with email and password</li>
                  <li>Receives property manager code from rope access company</li>
                  <li>Enters code to link account to vendor company</li>
                  <li>Gains read-only access to vendor's company summary and CSR</li>
                </ol>
                <div className="bg-violet-50 dark:bg-violet-950 p-2 rounded text-sm space-y-1">
                  <p><strong>Access Granted:</strong></p>
                  <ul className="list-disc list-inside">
                    <li>Read-only access to vendor company summaries</li>
                    <li>Company Safety Rating CSR) visibility with breakdowns</li>
                    <li>My Vendors dashboard for multi-vendor management</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            Security Architecture
          </h2>

          <Card className="border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                <ShieldCheck className="w-5 h-5" />
                Security Foundations
              </CardTitle>
            </CardHeader>
            <CardContent className="text-emerald-900 dark:text-emerald-100 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-emerald-900 rounded-lg p-4">
                  <Lock className="w-6 h-6 mb-2 text-emerald-600" />
                  <p className="font-bold">HTTP-Only Cookies</p>
                  <p className="text-sm">Session tokens stored in secure HTTP-only cookies prevent XSS attacks from accessing credentials</p>
                </div>
                <div className="bg-white dark:bg-emerald-900 rounded-lg p-4">
                  <Fingerprint className="w-6 h-6 mb-2 text-emerald-600" />
                  <p className="font-bold">Password Hashing</p>
                  <p className="text-sm">All passwords are hashed using bcrypt with salt rounds, never stored in plain text</p>
                </div>
                <div className="bg-white dark:bg-emerald-900 rounded-lg p-4">
                  <Building2 className="w-6 h-6 mb-2 text-emerald-600" />
                  <p className="font-bold">Multi-Tenant Isolation</p>
                  <p className="text-sm">Complete data isolation ensures companies can never access each other's data</p>
                </div>
                <div className="bg-white dark:bg-emerald-900 rounded-lg p-4">
                  <Key className="w-6 h-6 mb-2 text-emerald-600" />
                  <p className="font-bold">Role-Based Access</p>
                  <p className="text-sm">Granular permissions control what each user role can view and modify</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Session Management</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>Server-side sessions for all authenticated users</li>
                  <li>HTTP-only secure cookies prevent XSS attacks</li>
                  <li>Automatic session expiration after 30 days inactivity</li>
                  <li>Secure cookie attributes: httpOnly, secure, sameSite</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Password Security</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>Bcrypt password hashing with salt rounds</li>
                  <li>No plain-text password storage anywhere</li>
                  <li>Configurable password complexity upcoming)</li>
                  <li>Password change capability for all user types</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Request Security</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>CSRF Protection:</strong> Token-based validation for state-changing requests</li>
                  <li><strong>Rate Limiting:</strong> 10-15 login attempts per minute per IP</li>
                  <li><strong>SQL Injection:</strong> Parameterized statements via Drizzle ORM</li>
                  <li><strong>HTTPS:</strong> All traffic encrypted using TLS/SSL</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Data Isolation</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>Company-scoped data access: Every API filtered by company ID</li>
                  <li>Residents only see their building's data</li>
                  <li>Building managers see assigned buildings only</li>
                  <li>Role-based API response filtering</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
            <CardContent className="pt-4 text-base text-red-900 dark:text-red-100">
              <p className="flex items-center gap-2 font-semibold">
                <Shield className="w-4 h-4" />
                API Protection
              </p>
              <p className="mt-1">Every API endpoint validates: 1) User is authenticated, (2) User has required permission, (3) Requested data belongs to user's company. Financial data is additionally filtered unless user has financial permissions.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Audit Trails</CardTitle>
            </CardHeader>
            <CardContent className="text-base space-y-2">
              <p className="text-muted-foreground">What's logged:</p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">Employee permission changes</Badge>
                <Badge variant="outline" className="text-xs">Role reassignments</Badge>
                <Badge variant="outline" className="text-xs">Project deletions</Badge>
                <Badge variant="outline" className="text-xs">Financial data access</Badge>
                <Badge variant="outline" className="text-xs">Sensitive config changes</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2"><strong>Retention:</strong> All audit logs retained indefinitely for compliance and security investigations. Access limited to company owners and system administrators.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Account Management
          </h2>
          
          <div className="grid gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <KeyRound className="w-5 h-5 text-action-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Password Changes</p>
                    <p className="text-base text-muted-foreground">Users can change their passwords with current password verification. Company owners can reset employee passwords when needed.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Account Deletion</p>
                    <p className="text-base text-muted-foreground">Account deletion available with appropriate permissions. Data retention policies ensure compliance while removing sensitive information. Historical work records are preserved for audit purposes.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <LogIn className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Session Management</p>
                    <p className="text-base text-muted-foreground">Automatic session expiration after 30 days of inactivity. Secure logout functionality clears all session data. Users remain logged in across browser sessions until explicit logout or expiration.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Quick Reference: Who Can Do What
          </h2>

          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/50">
            <CardContent className="pt-4 text-base text-amber-900 dark:text-amber-100">
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                Important Disclaimer
              </p>
              <p className="mt-1 text-xs">
                The permissions shown in this table are <strong>EXAMPLES ONLY</strong> representing typical configurations. Actual capabilities vary by company based on custom permission assignments. The same role title may have completely different access rights in different companies.
              </p>
            </CardContent>
          </Card>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left font-semibold">Action</th>
                  <th className="p-3 text-center font-semibold">Owner</th>
                  <th className="p-3 text-center font-semibold">Ops Mgr*</th>
                  <th className="p-3 text-center font-semibold">Supervisor*</th>
                  <th className="p-3 text-center font-semibold">Tech*</th>
                  <th className="p-3 text-center font-semibold">Resident</th>
                  <th className="p-3 text-center font-semibold">Bldg Mgr</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t bg-muted/30">
                  <td className="p-3 font-semibold" colSpan={7}>Projects</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">Create Project</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3">View Projects</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" /></td>
                  <td className="p-3 text-center"><AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/30">
                  <td className="p-3 font-semibold" colSpan={7}>Work Sessions</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">Clock In/Out</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3">View All Sessions</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" /></td>
                  <td className="p-3 text-center"><AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/30">
                  <td className="p-3 font-semibold" colSpan={7}>Employees</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">Create Employees</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3">Assign Roles</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/30">
                  <td className="p-3 font-semibold" colSpan={7}>Financial</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">View Financial Data</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" /></td>
                  <td className="p-3 text-center"><AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/30">
                  <td className="p-3 font-semibold" colSpan={7}>Safety</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">Submit Inspections</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3">View Inspections</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" /></td>
                  <td className="p-3 text-center"><AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" /></td>
                  <td className="p-3 text-center"><AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/30">
                  <td className="p-3 font-semibold" colSpan={7}>Inventory</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">View Inventory</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" /></td>
                  <td className="p-3 text-center"><AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" /></td>
                  <td className="p-3 text-center"><AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Legend:</strong></p>
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Typically Granted</span>
              <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-500" /> Variable depends on config)</span>
              <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-400" /> Rarely Granted</span>
              <span>* Customizable by company owner</span>
            </div>
          </div>
        </section>

        <Separator />

        {/* Module Integration Points */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
              <Layers className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              Module Integration Points
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              User access controls are the gatekeeper across all OnRopePro modules. Permissions define not just who can access data, but what they can do with it in every other system.
            </p>
          </div>

          <Card className="bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800 mb-4">
            <CardContent className="pt-6">
              <p className="italic">"Access isn't just visibility. It's capability. One permission grants, another denies, a third restricts to read-only. Everything else in the system respects that decision."</p>
              <p className="text-sm font-medium mt-2 text-muted-foreground">, Core authentication architecture philosophy</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-600" />
                  <CardTitle className="text-base">Employee Directory</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Only company owners can create employees and assign roles. Supervisors can view employees but cannot create new ones. Permission structure ensures qualified managers cannot over-extend hiring authority.</p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Prevents unauthorized hiring and role assignment</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-violet-600" />
                  <CardTitle className="text-base">Payroll & Time Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Permission controls expose financial data selectively. Supervisors see hours worked, technicians see only their own time. Company owners see full payroll cost visibility. Permission isolation prevents wage transparency between employees.</p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">100% payroll confidentiality maintained</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-600" />
                  <CardTitle className="text-base">Safety & Compliance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Technicians submit safety documents (anchors, inspections). Safety officers review and approve. Company owners see audit trails. Building managers see approval status. Each role sees exactly what they need to do their job.</p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Clear responsibility chain for safety compliance</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-violet-600" />
                  <CardTitle className="text-base">Scheduling & Projects</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Company owners create projects and assign crews. Supervisors manage their assigned projects only. Technicians see only their scheduled work. Residents see project progress on their building. Access auto-limits data scope.</p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Each user sees only relevant scheduled work</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-violet-600" />
                  <CardTitle className="text-base">Feedback Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Residents submit feedback on projects. Building managers and company owners see and respond. Technicians cannot access feedback (prevents defensive reactions). Permissions ensure professional feedback handling.</p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">Professional feedback workflow maintained</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-violet-600" />
                  <CardTitle className="text-base">Analytics & Reporting</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Company owners see full financial and productivity analytics. Building managers see only their building's progress. Technicians see personal performance metrics. Reporting respects permission boundaries completely.</p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Analytics data is automatically filtered by access level</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Info className="w-5 h-5 text-action-600 dark:text-action-400" />
            Terminology & Naming
          </h2>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">"Feedback" vs "Complaints"</CardTitle>
            </CardHeader>
            <CardContent className="text-base space-y-2">
              <p className="text-muted-foreground">The platform uses <strong>"Feedback"</strong> terminology because:</p>
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                <div className="space-y-1 text-base">
                  <p className="font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Why "Feedback":</p>
                  <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                    <li>Encompasses both positive and negative input</li>
                    <li>Maintains professional, non-confrontational tone</li>
                    <li>Encourages resident engagement</li>
                    <li>Opens door for positive comments</li>
                  </ul>
                </div>
                <div className="space-y-1 text-base">
                  <p className="font-semibold flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> Why not "Complaints":</p>
                  <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                    <li>Has 100% negative connotation</li>
                    <li>Residents hesitate to submit positive feedback</li>
                    <li>Creates confrontational expectations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </ChangelogGuideLayout>
  );
}
