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
  Clock,
  ArrowRight
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

        <section className="space-y-4">
          <Card className="border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-green-900 dark:text-green-100">
                <CheckCircle2 className="w-5 h-5" />
                Problems Solved
              </CardTitle>
            </CardHeader>
            <CardContent className="text-green-900 dark:text-green-100">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Rigid Access Systems:</strong> Flexible permissions adapt to any company's organizational structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Data Leakage:</strong> Complete multi-tenant isolation ensures companies only see their own data</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Credential Insecurity:</strong> Bcrypt password hashing with industry-standard security</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Session Vulnerabilities:</strong> Server-side sessions with HTTPS-only cookies and CSRF protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>External Transparency:</strong> Building managers and residents access only their building's data</span>
                </li>
              </ul>
            </CardContent>
          </Card>
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
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <span className="font-bold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <p>Company Owner creates new employee account</p>
                </div>
                <ArrowRight className="w-4 h-4 mx-auto text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <span className="font-bold text-blue-600 dark:text-blue-400">2</span>
                  </div>
                  <p>Selects base role (e.g., "Operations Manager" or "Inventory Manager")</p>
                </div>
                <ArrowRight className="w-4 h-4 mx-auto text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <span className="font-bold text-blue-600 dark:text-blue-400">3</span>
                  </div>
                  <div>
                    <p>Assigns granular permissions across all categories:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
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
                <ArrowRight className="w-4 h-4 mx-auto text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <span className="font-bold text-blue-600 dark:text-blue-400">4</span>
                  </div>
                  <p>Employee receives unique access profile (role + custom permissions)</p>
                </div>
                <ArrowRight className="w-4 h-4 mx-auto text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p>Permissions can be modified at any time by company owner</p>
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
