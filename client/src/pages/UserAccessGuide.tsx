import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import {
  Users,
  Shield,
  Lock,
  Eye,
  Settings,
  UserCheck,
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
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserAccessGuide() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton to="/changelog" />
            <div>
              <h1 className="text-xl font-bold">User Access & Authentication Guide</h1>
              <p className="text-xs text-muted-foreground">Version 2.0 - Updated December 4, 2025</p>
            </div>
          </div>
          <MainMenuButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              User Access Overview
            </h2>
            <p className="text-muted-foreground">
              OnRopePro implements a sophisticated role-based access control system with <strong>company-scoped multi-tenant architecture</strong>. Each company's data remains completely isolated, and users can only access information relevant to their assigned company and role permissions.
            </p>
            <p className="text-muted-foreground mt-2">
              The platform supports three distinct user categories with <strong>granular, customizable permissions</strong> to accommodate diverse organizational structures across the rope access industry.
            </p>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Key className="w-5 h-5" />
                The Golden Rule: Role + Permissions = Access
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-900 dark:text-blue-100 space-y-4">
              <div className="bg-white dark:bg-blue-900 rounded-lg p-4 text-center">
                <p className="text-lg font-mono font-bold">
                  Access = Base Role (Organizational Structure) + Granular Permissions (Actual Capabilities)
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="font-semibold">Key Principles:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Each user has exactly one base role</strong> (Company Owner, Operations Manager, Supervisor, Technician, etc.)</li>
                  <li><strong>Base roles provide organizational structure</strong> — they suggest typical access patterns but do NOT determine permissions</li>
                  <li><strong>Permissions are CUSTOMIZED per employee</strong> by the company owner, regardless of role title</li>
                  <li><strong>Permissions define what users can actually DO</strong> with the data they can access</li>
                </ul>
              </div>

              <div className="bg-blue-100 dark:bg-blue-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4" />
                  Same Role, Different Capabilities
                </p>
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/50 dark:bg-blue-900/50 rounded p-2">
                    <p className="font-semibold mb-1">Company A - Operations Manager:</p>
                    <div className="space-y-0.5">
                      <p className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Financial permissions</p>
                      <p className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Create projects</p>
                      <p className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> Inventory management</p>
                    </div>
                  </div>
                  <div className="bg-white/50 dark:bg-blue-900/50 rounded p-2">
                    <p className="font-semibold mb-1">Company B - Operations Manager:</p>
                    <div className="space-y-0.5">
                      <p className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> Financial permissions</p>
                      <p className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> Create projects</p>
                      <p className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Inventory management</p>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-center font-medium">Same role title, completely different capabilities</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              Problems Solved
            </h2>
            <p className="text-muted-foreground">
              Comprehensive problem-solution documentation showing how OnRopePro's User Access & Authentication module addresses real challenges across the rope access industry.
            </p>
          </div>

          {/* For Rope Access Company Owners */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <Crown className="w-5 h-5" />
              For Rope Access Company Owners
            </h3>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"Supervisors accidentally seeing everyone's pay rates"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  You need your supervisor to create projects and assign technicians, but the moment you give them access, they can see what every technician earns. Now your Level 1 tech knows your Level 3 lead makes $18 more per hour. Generic construction software forces you to choose: operational efficiency or payroll privacy.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    Your operations manager needs to review project budgets to ensure profitability, but you don't want them seeing individual hourly rates. Traditional systems make this impossible—budget access automatically includes rate visibility.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    OnRopePro's flexible permission system separates operational capabilities from financial visibility. Grant your supervisor project creation rights, employee assignment capabilities, and schedule management—while keeping hourly rates, labor costs, and payroll data owner-only.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> Delegate confidently without compromising financial privacy. Supervisors manage day-to-day operations without seeing what anyone earns.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"Financial data visible to people who shouldn't see it"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Your bookkeeper needs access to generate reports. Your field supervisor needs to check if projects are on budget. But once they're in the system, they can see everything—company-wide profitability, individual employee rates, sensitive client billing margins.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    You hire a new administrative assistant to help with invoicing. Within a week, they know exactly how much profit you make on each client, what your best technicians earn, and which jobs are money-losers. This isn't malicious—the software just shows everything to anyone with access.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    Granular permission controls let you grant exactly what each employee needs. Your bookkeeper sees aggregate labor costs but not individual rates. Your supervisor sees project budgets but not company-wide profitability. Your admin sees client invoices but not internal cost breakdowns.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> Protect sensitive financial information while still delegating operational responsibilities. No more "all or nothing" access decisions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"Can't track IRATA certifications"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  You've got 15 technicians with different IRATA levels. Client contracts require Level 2 or higher for certain buildings. Insurance audits demand proof of certification levels. But you're tracking this in a spreadsheet that's always outdated because certifications expire and technicians upgrade.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    A client asks: "Which of your technicians are Level 2 or 3 and available next week?" You're digging through certification files, checking expiry dates, cross-referencing the schedule. This takes 30 minutes and you're still not confident the data is current.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    Each employee profile includes IRATA level (Level 1, 2, or 3) tracked in the system. When you need to assign work or respond to client requirements, you see certification levels instantly alongside availability and hourly rates.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> Instant visibility into team qualifications. Assign work confidently knowing technician certifications match client requirements. Respond to client questions in seconds, not minutes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"No control over who can edit/delete projects"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Everyone with system access can modify or delete projects—including your newest technician who accidentally deleted last month's completed job when trying to log today's drops. Now you've lost all historical data, photos, and time records for client billing.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    Your supervisor creates a project for a 40-story tower with detailed drop counts per elevation. A technician trying to log drops for a different building accidentally opens this project and changes the North elevation from 120 drops to 12 drops. The error isn't discovered until the project is complete and the client questions why you only invoiced for 12 drops on one side.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    Project management permissions control who can create, edit, and delete projects. Restrict these capabilities to supervisors and managers while technicians can only log work and upload photos for projects they're assigned to.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> Protect project data integrity. Prevent accidental deletions and modifications. Maintain accurate records for client billing and historical reference.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"Crew members changing data they shouldn't access"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  A technician logs into the system and starts browsing. They edit their own hourly rate from $32 to $42 per hour. They change last week's drop counts to show higher productivity. They access and modify other technicians' time records. You discover this during payroll processing when the numbers don't make sense.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    Your most experienced Level 3 tech knows the system well. During a slow week, he goes into past projects and adds extra drops to his record to make his productivity numbers look better for his upcoming performance review. The client complains months later when reviewing photos that don't match the drop counts you invoiced.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    Permission-based access controls what data each employee can view and modify. Technicians see only their own work records and assigned projects. Supervisors can view team performance but can't edit financial data. Only owners and designated managers can modify rates, historical records, and sensitive information.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> Prevent unauthorized data changes. Maintain data integrity for payroll, client billing, and performance reviews. Create clear audit trails showing who accessed and modified what data.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"Subscription limit monitoring - using 5 of 8 seats"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  You're on the Tier 1 plan with 8 included seats. You currently have 7 employees but are interviewing for your 8th technician. You hire two people thinking you had space, but discover you're now at 9 seats and being charged $19/month per extra seat. Or worse—you need to hire urgently but don't know if you have available seats without contacting support.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    Peak season hits. You need to hire 3 temporary technicians immediately to meet demand. But you can't remember if your plan includes 8 seats or 12 seats, and you don't know how many you're currently using. You delay hiring while trying to figure out your subscription status, losing work opportunities.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    Employee management dashboard displays your subscription tier limits clearly: "Using 7 of 8 seats" with visual indicators showing capacity. Know instantly if you can add employees or need to upgrade your tier before hiring.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> Make hiring decisions confidently. Avoid surprise overage charges. Plan tier upgrades proactively as your team grows. Never delay hiring because you're unsure about subscription capacity.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* For Operations Managers & Supervisors */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Briefcase className="w-5 h-5" />
              For Operations Managers & Supervisors
            </h3>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"Need to delegate responsibility but can't give full access"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  You're the operations manager coordinating 3-4 concurrent projects. You want your field supervisors to create new projects when clients call, assign technicians based on availability, and adjust schedules when weather delays work. But you can't give them system access without also giving them visibility into everyone's pay rates and company profitability.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    Your most trusted supervisor handles the entire North Shore territory. When clients call for quotes or want to start work, he has to call you to create the project in the system. This creates a bottleneck—you're stuck in meetings or on another call, and the client has to wait hours for a simple project setup that your supervisor could do in 2 minutes if he had access.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    Grant supervisors project creation and management permissions without financial data access. They can create projects, assign employees, manage schedules, and respond to resident feedback—all while hourly rates, labor costs, and profit margins remain visible only to owners and operations managers.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> Eliminate bottlenecks. Supervisors handle day-to-day operations independently. You focus on strategic work instead of being interrupted for routine tasks. Response time to clients improves from hours to minutes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* For Building Managers & Property Managers */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-violet-700 dark:text-violet-400">
              <Building2 className="w-5 h-5" />
              For Building Managers & Property Managers
            </h3>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"Administrative burden from tenant turnover - we change building managers every 6-12 months"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Your property management company manages 40 buildings across three cities. Building managers turnover every 6-12 months. Every time someone leaves, you need to contact every vendor (rope access, HVAC, electrical, landscaping, security) to deactivate the old manager's account and create a new one. This coordination takes 2-3 days per manager change, and often old managers retain access for weeks because vendors are slow to respond.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    Sarah managed Tower One for 8 months then transferred to another building. Mike takes over. You send emails to 12 different vendors requesting account changes. Only 4 respond within a week. Three weeks later, Sarah still has access to Tower One's maintenance portal and Mike is calling you asking why he can't log in. You're sending follow-up emails and making phone calls to chase down vendors.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    Building-level accounts eliminate individual manager account management. Each building has one permanent account (e.g., "Tower One Manager"). When managers change, your property management company updates the password in your internal system—access instantly transfers to the new manager. No vendor coordination required.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> Manager transitions take 30 seconds instead of 3 days. Zero vendor coordination required. No risk of former managers retaining access. No gaps where new managers can't access vendor systems.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"Residents calling constantly during maintenance work - 300% call spike"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  During window cleaning season (May-September), your office phone never stops ringing. "When are they coming to my side of the building?" "Did they do my floor yet?" "Why are there streaks on my windows?" Your administrative staff spends 15-20 hours per week just answering progress questions, pulling them away from lease renewals, maintenance coordination, and other higher-value work.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    It's Wednesday morning during a 2-week window cleaning project at Pacific Heights Tower. You've received 47 calls since Monday asking about progress. Your admin is on call #48: "When will they do the west side?" She doesn't know—she has to call the maintenance company, wait for a callback, then call the resident back. This one question consumed 25 minutes and three phone calls.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    Resident portal gives building occupants real-time visibility into maintenance progress. They see the 4-elevation building visualization showing exactly which sides are complete (North 100%, East 75%, South 20%, West 0%), view progress photos uploaded by technicians, and check the project schedule showing expected completion dates.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> Reduce resident calls by 60-70% during maintenance periods. Administrative staff freed from answering repetitive status questions. Residents get instant answers 24/7 without calling. Happier residents who feel informed and respected.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"Complaints escalating to building managers instead of going to the vendor"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Residents encounter issues during maintenance work: missed windows, water damage from cleaning, scheduling conflicts. But there's no direct way to report these to the maintenance company. So residents call you, the building manager. You become the middleman—taking complaints, calling the vendor, relaying information back and forth. You're spending hours on coordination that shouldn't involve you.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    Mrs. Chen in Unit 2304 emails you photos of streaky windows after the cleaning crew left. You forward the email to the rope access company. Three days pass with no response. Mrs. Chen emails you again asking for an update. You call the company, leave a voicemail. Two days later you get a callback saying they'll look into it. Meanwhile, Mrs. Chen is filing strata council complaints about management responsiveness—but it's not your fault, it's the vendor's lack of direct communication.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    Centralized feedback system with building-level visibility. Residents submit feedback directly to the maintenance company through the portal with photos and detailed descriptions. Building managers see all feedback for their buildings in real-time, can track response times, and verify resolution—without being the middleman for every issue.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> Zero complaints lost in email chains. You see all resident feedback and vendor responses in one place without handling every back-and-forth. Average resolution time drops from 3-5 days to 24 hours. Documented proof of vendor responsiveness for strata councils.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"Building managers don't see your value - looking unprofessional with scattered communication"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Your maintenance vendors communicate through whatever channel is convenient: text messages, personal emails, phone calls, sticky notes left in the lobby. When you need to compile a report for the strata council or justify a contract renewal, you're digging through months of texts and emails trying to prove the work was done properly and issues were addressed promptly.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    The strata council questions why they should renew the rope access contract. "How do we know they're responsive to resident concerns?" You remember several complaints were resolved quickly, but you're scrolling through text messages from March, checking your email for attachments, and trying to remember which issues were resolved when. You can't provide concrete data, just vague assurances that "they're usually pretty good."
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    Professional vendor portal provides building managers with complete visibility: real-time project progress, comprehensive photo galleries documenting work completion, all resident feedback with response times tracked, complete work history, and downloadable reports for council presentations.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> Answer council questions with data, not vague memories. Generate professional reports in 2 minutes instead of 2 hours of digging through communications. Demonstrate vendor performance objectively. Justify contract renewals with documented responsiveness and quality.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* For Building Residents */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <Home className="w-5 h-5" />
              For Building Residents
            </h3>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"70% more service calls than necessary - no transparency into work progress"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  You see maintenance equipment on the roof. Scaffolding goes up on the building's west side. You have no idea what's being done, when it will be done, or if it will affect your unit. So you call the building manager to ask. So does everyone else in your building. The building manager's office is overwhelmed with calls that wouldn't be necessary if residents simply knew what was happening.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    You're in Unit 1847 on the east side of the building. Monday morning you see rope access technicians on the west side. Are they coming to your side? Today? This week? Next month? You need to know because you have plants on your exterior balcony that need to be moved before cleaning. You call the building manager. They don't know—they have to contact the vendor and call you back. Two days later you still haven't heard back, so you call again.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    Resident portal shows your building's project in real-time. You see the 4-elevation visualization: West 100% complete, North 60% complete, East 0% (not started), South 0% (not started). Schedule shows east elevation starting Wednesday. You move your plants Tuesday night. No phone calls necessary.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> Plan your schedule around maintenance work. Know exactly when work will affect your unit. No calling and waiting for information. No surprises. Reduced stress and frustration.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"No record of complaint resolution - submit complaint and hear nothing back"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  You notice streaks on your windows after the cleaning crew left. You email the building manager with photos. Days pass with no acknowledgment. A week later, you email again. No response. You don't know if anyone saw your complaint, if it's being addressed, or if you should just give up and clean the windows yourself.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    Your exterior windows have water damage stains after pressure washing. You email photos to the building manager on Monday. By Friday you've heard nothing. You call and leave a voicemail. The following Tuesday you send another email. Wednesday you finally get a call: "Oh sorry, I forwarded that to the contractor last week, I think they're planning to come back." No timeline, no confirmation, no accountability.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    Submit feedback directly through the portal with photos. System timestamps your submission immediately. You see status change from "Open" to "In Progress" when management acknowledges the issue. You see public responses from the management team explaining resolution timeline. You see status change to "Closed" when fixed, with photos of corrected work.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> Know your concern was received immediately. See progress on resolution in real-time. Hold management accountable with transparent tracking. Average resolution time 24 hours vs. 3-5 days with traditional communication. No repeated emails or phone calls necessary.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"Residents complaining to building managers instead of maintenance company - 3-day resolution times from phone tag"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  The maintenance company needs to know about issues immediately to fix them quickly. But the communication chain is broken: resident to building manager to maintenance company back to building manager back to resident. Each handoff adds 12-24 hours of delay. A problem that could be resolved in 4 hours takes 3 days because of communication friction.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    Unit 3205 has a broken window screen after rope access work. Resident emails building manager Tuesday morning. Manager forwards to maintenance company Tuesday afternoon. Maintenance company sees the email Wednesday and schedules repair for Thursday. Building manager doesn't know it's scheduled until Thursday morning when the technician arrives. Resident isn't home Thursday because nobody told them someone was coming. Repair finally happens Friday—3 days after initial report for a 15-minute fix.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    Direct resident-to-vendor feedback system cuts out the middleman while keeping building managers informed. Resident submits issue Tuesday 9am. Maintenance company sees it Tuesday 9:05am, responds Tuesday 10am: "Scheduling for tomorrow 2pm." Building manager sees this entire exchange in their dashboard but doesn't handle any of the back-and-forth. Issue resolved Wednesday 2pm.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> 3-day resolution becomes 24-hour resolution. Building managers stay informed without handling every message. Maintenance companies respond faster because they see issues immediately. Residents get direct communication with the people who can actually fix problems.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security & Data Protection */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Shield className="w-5 h-5" />
              Security & Data Protection
            </h3>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"Multi-tenant data isolation - can't afford data breaches or leaks between companies"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  You're a small rope access company. You can't afford enterprise-grade IT security or data protection infrastructure. But you handle sensitive information: employee social insurance numbers, hourly rates, client billing data, building access codes, resident complaints. A data breach could destroy your business through lost client trust, regulatory penalties, and competitive disadvantage if competitors accessed your pricing.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    You're evaluating a construction software platform. Their security documentation is vague. You ask: "If I use your platform, can other companies see my data?" The answer is concerning: "Our system uses role-based permissions so only authorized users can access data." That doesn't answer the question—are other companies even in the same database? Could a security flaw expose your employee rates to competitors?
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    Complete multi-tenant isolation architecture. Your company's projects, employees, work sessions, photos, complaints, and financial data exist in a completely separate partition from every other company. A security flaw in another company's account cannot expose your data. Database queries are automatically scoped to your company ID—even system administrators cannot access your data without explicit audit-logged access.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> Bank-level data protection without hiring security experts. Guarantee to clients that their building information and resident data is isolated. Protect competitive advantages (pricing strategies, productivity rates, client relationships). Regulatory compliance for privacy laws. Sleep confidently knowing your data is protected by enterprise security architecture.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-red-700 dark:text-red-400">"Password security - can't control how employees manage passwords"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  You require employees to create strong passwords, but you have no way to enforce it. Technicians use "password123" or their birthdate. When someone leaves the company, you change their password to disable access—but if they wrote it down or the database is breached, their old password might still work on other systems where they used the same password.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-amber-500">
                  <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">Example:</p>
                  <p className="text-xs text-muted-foreground">
                    You hire a new technician. He creates his account with password "Rope2024". Six months later he leaves to work for a competitor. You disable his account, but his password was stored in plain text in the database. If the competitor hires a hacker to breach your system (extreme scenario but possible), they could retrieve actual passwords and try them on your email system, accounting software, and other platforms where employees often reuse passwords.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                  <p className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Solution:</p>
                  <p className="text-xs text-green-900 dark:text-green-100">
                    Industry-standard bcrypt password hashing with salt rounds. Passwords are never stored in plain text—not even you can see them. When an employee logs in, their entered password is hashed and compared to the stored hash. Even if someone gained database access, they would see only irreversible hashes: "$2b$10$EixZaYVK1fsbw1ZfbX3OXe". Cracking these would take thousands of years with current computing power.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Benefit:</strong> Protect employee accounts even if database is compromised. Meet security requirements for client contracts and insurance audits. Demonstrate professional security practices. Prevent password reuse vulnerabilities. Eliminate "I forgot my password and need you to tell me what it is" requests—you literally cannot retrieve passwords, only reset them.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Three User Categories
          </h2>
          <p className="text-sm text-muted-foreground">Users fall into one of three distinct categories with different authentication and data access patterns:</p>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-2 border-amber-200 dark:border-amber-900">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-base">Company Accounts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground">Company owners and staff employees (operations managers, supervisors, technicians, administrative staff).</p>
                <div className="bg-amber-50 dark:bg-amber-950 p-2 rounded text-xs space-y-1">
                  <p className="font-semibold">Authentication:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Email-based username</li>
                    <li>Password authentication</li>
                    <li>Company-scoped access</li>
                  </ul>
                </div>
                <div className="text-xs">
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
                  <HardHat className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-base">Employee Accounts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground">Field technicians, supervisors, managers, specialized roles (HR, accounting, inventory).</p>
                <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded text-xs space-y-1">
                  <p className="font-semibold">Authentication:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Created by company owner</li>
                    <li>Assigned base role</li>
                    <li>Individual permission assignment</li>
                  </ul>
                </div>
                <div className="text-xs">
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
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground">Building residents, property managers, building-level accounts.</p>
                <div className="bg-green-50 dark:bg-green-950 p-2 rounded text-xs space-y-1">
                  <p className="font-semibold">Authentication:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Unique company linking codes</li>
                    <li>Building/unit-specific access</li>
                    <li>Limited to building data only</li>
                  </ul>
                </div>
                <div className="text-xs">
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
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Employee Roles & Flexible Permissions
          </h2>
          <p className="text-sm text-muted-foreground">
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
              <CardContent className="text-sm space-y-2">
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
              <CardContent className="text-sm space-y-2">
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
                  <Clipboard className="w-4 h-4 text-blue-600" />
                  Field Leadership
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
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
                    <span className="font-medium">Ground Crew Supervisor</span>
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
              <CardContent className="text-sm space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Rope Access Technician</span>
                    <span className="text-xs text-muted-foreground">Certified rope work</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Ground Crew</span>
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
            <CardContent className="text-sm text-purple-900 dark:text-purple-100">
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
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
            <CardContent className="text-sm text-blue-900 dark:text-blue-100">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/50 dark:bg-blue-900/50 rounded-lg p-3">
                  <p className="font-semibold mb-2">Before (Rope Access Technician):</p>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Clock in/out</li>
                    <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Log drops</li>
                    <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Upload photos</li>
                    <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Submit inspections</li>
                  </ul>
                </div>
                <div className="bg-white/50 dark:bg-blue-900/50 rounded-lg p-3">
                  <p className="font-semibold mb-2">After (Supervisor):</p>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Create projects</li>
                    <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Assign employees</li>
                    <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Review feedback</li>
                    <li className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> Financial data (restricted)</li>
                    <li className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> Employee rates (restricted)</li>
                  </ul>
                </div>
              </div>
              <p className="mt-3 text-xs text-center">Same person, new role, custom permission set matching their responsibilities</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
            Granular Permissions
          </h2>
          
          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/50">
            <CardContent className="pt-4 text-sm text-amber-900 dark:text-amber-100">
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                Important: Permissions are NOT determined by role alone
              </p>
              <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
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
              <CardContent className="text-sm space-y-2">
                <p className="text-xs text-muted-foreground">Control access to sensitive cost and rate information:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded text-xs">View Financial Data - Labor costs, project budgets, hourly rates</div>
                  <div className="p-2 bg-muted rounded text-xs">View Employee Rates - Specific technician hourly wages</div>
                  <div className="p-2 bg-muted rounded text-xs">Edit Pricing - Quote values, project estimates, billing rates</div>
                  <div className="p-2 bg-muted rounded text-xs">Access Payroll Reports - Aggregated payroll summaries</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clipboard className="w-4 h-4 text-blue-600" />
                  Project Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-xs text-muted-foreground">Control project lifecycle and coordination:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded text-xs">Create Projects - Set up new building maintenance projects</div>
                  <div className="p-2 bg-muted rounded text-xs">Edit Projects - Modify details, targets, completion dates</div>
                  <div className="p-2 bg-muted rounded text-xs">Delete Projects - Remove from system (with warnings)</div>
                  <div className="p-2 bg-muted rounded text-xs">Mark Complete / View All / Assign Employees</div>
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
              <CardContent className="text-sm space-y-2">
                <p className="text-xs text-muted-foreground">Control team administration and sensitive data:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded text-xs">Create Employees - Onboard new team members</div>
                  <div className="p-2 bg-muted rounded text-xs">Edit Employees - Modify roles, rates, permissions</div>
                  <div className="p-2 bg-muted rounded text-xs">Deactivate Employees - Remove access for departed staff</div>
                  <div className="p-2 bg-muted rounded text-xs">View All / Assign Roles / Manage Permissions</div>
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
              <CardContent className="text-sm space-y-2">
                <p className="text-xs text-muted-foreground">Control equipment and asset management:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded text-xs">View Inventory - Access equipment lists and tracking</div>
                  <div className="p-2 bg-muted rounded text-xs">Add Inventory - Create new equipment records</div>
                  <div className="p-2 bg-muted rounded text-xs">Edit Inventory - Update details, status, assignments</div>
                  <div className="p-2 bg-muted rounded text-xs">Assign Equipment / Track Inspections</div>
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
              <CardContent className="text-sm space-y-2">
                <p className="text-xs text-muted-foreground">Control resident and client communication:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded text-xs">View Feedback - Access submitted feedback from residents</div>
                  <div className="p-2 bg-muted rounded text-xs">Respond to Feedback - Add public responses</div>
                  <div className="p-2 bg-muted rounded text-xs">Add Internal Notes - Private team coordination</div>
                  <div className="p-2 bg-muted rounded text-xs">Close Feedback / Delete Feedback / View Analytics</div>
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
              <CardContent className="text-sm space-y-2">
                <p className="text-xs text-muted-foreground">Control documentation and regulatory oversight:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded text-xs">Submit Inspections - Complete daily harness/equipment checks</div>
                  <div className="p-2 bg-muted rounded text-xs">View Inspections - Access inspection history</div>
                  <div className="p-2 bg-muted rounded text-xs">Approve Inspections - Supervisor review and sign-off</div>
                  <div className="p-2 bg-muted rounded text-xs">Create Toolbox Meetings / View Safety Docs / Manage Compliance</div>
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
              <CardContent className="text-sm space-y-2">
                <p className="text-xs text-muted-foreground">Control file uploads and access:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded text-xs">Upload Documents - Add PDFs, photos, certificates</div>
                  <div className="p-2 bg-muted rounded text-xs">View Documents - Access project or company-wide files</div>
                  <div className="p-2 bg-muted rounded text-xs">Delete Documents - Remove files from system</div>
                  <div className="p-2 bg-muted rounded text-xs">Download Documents - Export files for offline use</div>
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
              <CardContent className="text-sm space-y-2">
                <p className="text-xs text-muted-foreground">Control business intelligence access:</p>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded text-xs">View Analytics Dashboard - Performance metrics, productivity</div>
                  <div className="p-2 bg-muted rounded text-xs">Export Reports - Generate CSV/PDF summaries</div>
                  <div className="p-2 bg-muted rounded text-xs">View Historical Data - Access past project archives</div>
                  <div className="p-2 bg-muted rounded text-xs">Financial Reporting - Revenue, cost, profitability analyses</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-4 text-sm text-amber-900 dark:text-amber-100">
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                Permission Assignment Best Practices
              </p>
              <p className="mt-2 text-xs"><strong>Best Practice:</strong> Grant minimum necessary permissions. You can always add more later.</p>
              <div className="mt-2 space-y-1 text-xs">
                <p className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-600" /> Giving all supervisors financial access (only budget managers need it)</p>
                <p className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-600" /> Restricting project creation to owners only (supervisors often need this)</p>
                <p className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-600" /> Giving technicians access to all employee data (privacy concern)</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
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
              <CardContent className="text-sm space-y-3">
                <div className="bg-teal-50 dark:bg-teal-950 p-2 rounded space-y-1">
                  <p className="font-semibold text-xs">Authentication:</p>
                  <ul className="list-disc list-inside text-xs space-y-0.5">
                    <li>Self-registration with company access code</li>
                    <li>Unit-specific codes (e.g., "BLD2024-U207")</li>
                    <li>Each unit has permanent access code</li>
                  </ul>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> What they can do:</p>
                  <ul className="list-disc list-inside ml-3 space-y-0.5 text-muted-foreground">
                    <li>View their building's active projects</li>
                    <li>See real-time work progress</li>
                    <li>Access project photo galleries</li>
                    <li>Submit feedback with photos</li>
                    <li>Track feedback status</li>
                  </ul>
                </div>

                <div className="space-y-1 text-xs">
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
              <CardContent className="text-sm space-y-3">
                <div className="bg-indigo-50 dark:bg-indigo-950 p-2 rounded space-y-1">
                  <p className="font-semibold text-xs">Building-Level Accounts:</p>
                  <ul className="list-disc list-inside text-xs space-y-0.5">
                    <li>Each building gets ONE permanent account</li>
                    <li>Current manager uses those credentials</li>
                    <li>When manager changes: Just update password</li>
                    <li>Access automatically transfers to new manager</li>
                  </ul>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> What they can do:</p>
                  <ul className="list-disc list-inside ml-3 space-y-0.5 text-muted-foreground">
                    <li>View all projects for their building(s)</li>
                    <li>Monitor real-time work progress</li>
                    <li>Access project photo documentation</li>
                    <li>Review resident feedback</li>
                    <li>Download compliance reports</li>
                  </ul>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-semibold flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> What they cannot do:</p>
                  <ul className="list-disc list-inside ml-3 space-y-0.5 text-muted-foreground">
                    <li>View financial data (costs, rates, budgets)</li>
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
          <h2 className="text-xl font-bold flex items-center gap-2">
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
              <CardContent className="text-sm space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>User navigates to registration page</li>
                  <li>Enters company details (name, email, initial password)</li>
                  <li>System creates new company record in database</li>
                  <li>Creates first user account with ultimate permissions</li>
                  <li>User receives confirmation and can log in</li>
                </ol>
                <div className="bg-amber-50 dark:bg-amber-950 p-2 rounded text-xs">
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
              <CardContent className="text-sm space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Company owner navigates to employee management</li>
                  <li>Enters employee details: name, email, temporary password</li>
                  <li>Adds IRATA level and hourly rate (if applicable)</li>
                  <li>Selects base role from dropdown (standard or custom)</li>
                  <li>Assigns granular permissions across all categories</li>
                  <li>Employee can immediately log in and change password</li>
                </ol>
                <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded text-xs">
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
              <CardContent className="text-sm space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>User registers as Resident or Building Manager</li>
                  <li>Receives linking code from company (email, notice, or QR code)</li>
                  <li>Enters code on linking page during registration</li>
                  <li>System validates code and links user to specific building/unit</li>
                </ol>
                <div className="bg-green-50 dark:bg-green-950 p-2 rounded text-xs space-y-1">
                  <p><strong>Code Types:</strong></p>
                  <ul className="list-disc list-inside">
                    <li>Resident codes: Unit-specific (e.g., "BLD2024-U207")</li>
                    <li>Building manager codes: Building-level (e.g., "BLDMGR-TOWER1")</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            Security Architecture
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Session Management</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
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
              <CardContent className="text-sm space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>Bcrypt password hashing with salt rounds</li>
                  <li>No plain-text password storage anywhere</li>
                  <li>Configurable password complexity (upcoming)</li>
                  <li>Password change capability for all user types</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Request Security</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
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
              <CardContent className="text-sm space-y-2">
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
            <CardContent className="pt-4 text-sm text-red-900 dark:text-red-100">
              <p className="flex items-center gap-2 font-semibold">
                <Shield className="w-4 h-4" />
                API Protection
              </p>
              <p className="mt-1">Every API endpoint validates: (1) User is authenticated, (2) User has required permission, (3) Requested data belongs to user's company. Financial data is additionally filtered unless user has financial permissions.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Audit Trails</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
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
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Quick Reference: Who Can Do What
          </h2>

          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/50">
            <CardContent className="pt-4 text-sm text-amber-900 dark:text-amber-100">
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
              <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-500" /> Variable (depends on config)</span>
              <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-400" /> Rarely Granted</span>
              <span>* Customizable by company owner</span>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Upcoming Features
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Q1 2026</Badge>
                  <CardTitle className="text-base">Feedback Response Time Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground text-xs">Planned metrics:</p>
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  <li>Time from submission to first view</li>
                  <li>Time from submission to first response</li>
                  <li>Time from submission to closure</li>
                  <li>Average response time per project/building</li>
                  <li>SLA tracking and alerts</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Q2 2026</Badge>
                  <CardTitle className="text-base">Building Manager Document Upload</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground text-xs">Planned capabilities:</p>
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  <li>Building managers upload building-specific docs</li>
                  <li>Certificate of Insurance management</li>
                  <li>Building access instructions</li>
                  <li>Document expiry tracking & renewal notifications</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Concept</Badge>
                  <CardTitle className="text-base">Custom Permission Templates</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground text-xs">Save common permission configurations as templates for quick-apply when creating similar roles. Example templates: "Field Supervisor," "Office Admin," "Safety Officer"</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Terminology & Naming
          </h2>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">"Feedback" vs "Complaints"</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="text-muted-foreground">The platform uses <strong>"Feedback"</strong> terminology because:</p>
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                <div className="space-y-1 text-xs">
                  <p className="font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Why "Feedback":</p>
                  <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                    <li>Encompasses both positive and negative input</li>
                    <li>Maintains professional, non-confrontational tone</li>
                    <li>Encourages resident engagement</li>
                    <li>Opens door for positive comments</li>
                  </ul>
                </div>
                <div className="space-y-1 text-xs">
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

        <div className="pt-8">
          <Button 
            onClick={() => navigate("/changelog")}
            variant="outline"
            className="w-full"
            data-testid="button-back-to-changelog"
          >
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Knowledge Base
          </Button>
        </div>
      </main>
    </div>
  );
}
