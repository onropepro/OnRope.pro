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
  Clipboard
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
              <p className="text-xs text-muted-foreground">Understanding roles, permissions, and access levels</p>
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
              The platform uses a <strong>role-based access control (RBAC)</strong> system where each user is assigned a role that determines their capabilities. Additionally, employees can receive <strong>granular permissions</strong> to extend their access beyond their base role.
            </p>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Key className="w-5 h-5" />
                The Golden Rule: Role + Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-900 dark:text-blue-100 space-y-4">
              <div className="bg-white dark:bg-blue-900 rounded-lg p-4 text-center">
                <p className="text-xl font-mono font-bold">
                  Access = Base Role Capabilities + Additional Permissions
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Every user has exactly one role.</strong> This role provides baseline access:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Role</strong>: Defines user type (Company Owner, Technician, Resident, etc.)</li>
                  <li><strong>Permissions</strong>: Optional array of additional capabilities granted to employees</li>
                </ul>
              </div>

              <div className="bg-blue-100 dark:bg-blue-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Multi-Tenant Isolation
                </p>
                <p className="mt-1">Every piece of data is scoped to a specific company. Employees can only see their own company's data, residents only see their linked company's projects, and property managers see only their linked vendors.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Three User Categories
          </h2>
          <p className="text-sm text-muted-foreground">Users fall into one of three distinct categories, each with its own authentication flow and capabilities:</p>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-2 border-amber-200 dark:border-amber-900">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-base">Company Accounts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground">Business owners who register and manage their rope access company.</p>
                <div className="bg-amber-50 dark:bg-amber-950 p-2 rounded text-xs">
                  <p className="font-semibold">Authentication:</p>
                  <p>Email + Password registration</p>
                </div>
                <div className="text-xs">
                  <span className="font-semibold">Capabilities:</span> Full platform access, employee management, subscription control
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
                <p className="text-muted-foreground">Staff members added by companies with specific roles.</p>
                <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded text-xs">
                  <p className="font-semibold">Authentication:</p>
                  <p>Email + Temporary password (must change on first login)</p>
                </div>
                <div className="text-xs">
                  <span className="font-semibold">Capabilities:</span> Based on assigned role + permissions
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
                <p className="text-muted-foreground">Residents and property managers who link to companies.</p>
                <div className="bg-green-50 dark:bg-green-950 p-2 rounded text-xs">
                  <p className="font-semibold">Authentication:</p>
                  <p>Self-registration + Company linking code</p>
                </div>
                <div className="text-xs">
                  <span className="font-semibold">Capabilities:</span> Read-only access to linked company data
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Employee Role Hierarchy
          </h2>
          <p className="text-sm text-muted-foreground">Employee roles are ordered from most to least access. Higher roles automatically inherit capabilities of lower roles.</p>

          <div className="space-y-3">
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900 rounded-full p-2">
                    <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Company Owner</p>
                      <Badge className="bg-amber-600 text-xs">Full Access</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Complete platform control including subscription, billing, employee management, and all operational features.</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">Manage Employees</Badge>
                      <Badge variant="outline" className="text-xs">View Financial Data</Badge>
                      <Badge variant="outline" className="text-xs">Manage Inventory</Badge>
                      <Badge variant="outline" className="text-xs">All Permissions</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-2">
                    <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Operations Manager</p>
                      <Badge variant="secondary" className="text-xs">operations_manager</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">High-level operational control. Can manage projects, employees, scheduling, and access financial data.</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">Create Projects</Badge>
                      <Badge variant="outline" className="text-xs">Manage Schedule</Badge>
                      <Badge variant="outline" className="text-xs">View Payroll</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                    <Clipboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Supervisor</p>
                      <Badge variant="secondary" className="text-xs">supervisor / rope_access_supervisor / general_supervisor</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Team leadership with project oversight. Can view team progress, manage safety documentation, and access project details.</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">View All Sessions</Badge>
                      <Badge variant="outline" className="text-xs">Safety Forms</Badge>
                      <Badge variant="outline" className="text-xs">Team Management</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-cyan-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-cyan-100 dark:bg-cyan-900 rounded-full p-2">
                    <HardHat className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Rope Access Technician</p>
                      <Badge variant="secondary" className="text-xs">rope_access_tech</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Field workers who perform rope access tasks. Can clock in/out, log drops, complete safety forms, and view assigned projects.</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">Start/End Sessions</Badge>
                      <Badge variant="outline" className="text-xs">Log Drops</Badge>
                      <Badge variant="outline" className="text-xs">Safety Inspections</Badge>
                      <Badge variant="outline" className="text-xs">IRATA Hours</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
                    <Wrench className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Ground Crew</p>
                      <Badge variant="secondary" className="text-xs">ground_crew / ground_crew_supervisor</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Ground-level support staff. Can clock in/out for non-rope access work and complete basic safety documentation.</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">Start/End Sessions</Badge>
                      <Badge variant="outline" className="text-xs">Basic Safety Forms</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
            Granular Permissions
          </h2>
          <p className="text-sm text-muted-foreground">
            Beyond base roles, employees can receive additional permissions to extend their capabilities. These are stored as an array of permission strings.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  View Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <code className="text-xs">view_financial_data</code>
                    <span className="text-xs text-muted-foreground">See payroll, rates, costs</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <code className="text-xs">view_gear_assignments</code>
                    <span className="text-xs text-muted-foreground">See all team gear</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <code className="text-xs">view_all_projects</code>
                    <span className="text-xs text-muted-foreground">See all company projects</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  Management Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <code className="text-xs">manage_inventory</code>
                    <span className="text-xs text-muted-foreground">Add/edit gear items</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <code className="text-xs">assign_gear</code>
                    <span className="text-xs text-muted-foreground">Assign gear to others</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <code className="text-xs">manage_employees</code>
                    <span className="text-xs text-muted-foreground">Add/edit employees</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-4 text-sm text-amber-900 dark:text-amber-100">
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                Permission Assignment
              </p>
              <p className="mt-1">Only company owners and operations managers can assign permissions to employees. Permissions are managed through the Employees page by editing an employee's profile.</p>
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
                <CardDescription>Building occupants</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">Residents can link their account to a company using a unique resident code, then view project progress and submit complaints.</p>
                
                <div className="bg-teal-50 dark:bg-teal-950 p-2 rounded space-y-1">
                  <p className="font-semibold text-xs">How to Link:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-xs">
                    <li>Register with email and strata plan number</li>
                    <li>Go to /link page</li>
                    <li>Enter company's resident code</li>
                    <li>Account is now linked</li>
                  </ol>
                </div>

                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">View Projects</Badge>
                  <Badge variant="outline" className="text-xs">Submit Complaints</Badge>
                  <Badge variant="outline" className="text-xs">View Photo Gallery</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-200 dark:border-indigo-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  Property Manager
                </CardTitle>
                <CardDescription>Building management</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">Property managers link to multiple vendor companies and access a "My Vendors" dashboard showing company safety ratings and project summaries.</p>
                
                <div className="bg-indigo-50 dark:bg-indigo-950 p-2 rounded space-y-1">
                  <p className="font-semibold text-xs">How to Link:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-xs">
                    <li>Register as property manager</li>
                    <li>Request linking code from vendor</li>
                    <li>Enter code on /link page</li>
                    <li>Repeat for multiple vendors</li>
                  </ol>
                </div>

                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">View CSR Scores</Badge>
                  <Badge variant="outline" className="text-xs">Read-Only Company Info</Badge>
                  <Badge variant="outline" className="text-xs">Multiple Vendors</Badge>
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
                  <li>Visit <strong>/register</strong> page</li>
                  <li>Enter company name, email, and password</li>
                  <li>Account created with <code>role: "company"</code></li>
                  <li>Redirected to subscription selection</li>
                  <li>After payment, full access granted</li>
                </ol>
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
                  <li>Company owner adds employee via <strong>Employees</strong> page</li>
                  <li>System generates temporary password</li>
                  <li>Employee receives credentials (email or in-person)</li>
                  <li>Employee logs in and <strong>must change password</strong> on first login</li>
                  <li>Account is linked to company with assigned role</li>
                </ol>
                <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded text-xs">
                  <strong>Note:</strong> The <code>isTempPassword</code> flag forces password change on first login.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">Flow 3</Badge>
                    <CardTitle>Resident/PM Linking</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>User registers as resident or property manager</li>
                  <li>Receives linking code from company</li>
                  <li>Enters code on <strong>/link</strong> page</li>
                  <li>System validates code and creates link</li>
                  <li>If company changes code, link is invalidated on next API call</li>
                </ol>
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
                  <li>HTTP-only secure cookies</li>
                  <li>Server-side session storage</li>
                  <li>Automatic session expiration</li>
                  <li>CSRF protection</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Data Isolation</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>Company-scoped database queries</li>
                  <li>Role-based API response filtering</li>
                  <li>Permission checks on every request</li>
                  <li>Audit trails for sensitive actions</li>
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
              <p className="mt-1">Every API endpoint validates: (1) User is authenticated, (2) User has required role, (3) Requested data belongs to user's company. Financial data is additionally filtered unless user has <code>view_financial_data</code> permission.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Quick Reference: Who Can Do What
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left font-semibold">Action</th>
                  <th className="p-3 text-center font-semibold">Company</th>
                  <th className="p-3 text-center font-semibold">Ops Mgr</th>
                  <th className="p-3 text-center font-semibold">Supervisor</th>
                  <th className="p-3 text-center font-semibold">Tech</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3">Create Projects</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3">Add Employees</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">View Payroll</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3">Clock In/Out</td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">Safety Forms</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3">Manage Subscription</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
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
