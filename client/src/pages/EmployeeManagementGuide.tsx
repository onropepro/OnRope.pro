import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import {
  Users,
  UserPlus,
  UserCheck,
  Shield,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Award,
  Calendar,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Key,
  AlertTriangle,
  Info,
  Car,
  Heart,
  Lock,
  UserX,
  Settings,
  BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmployeeManagementGuide() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton to="/changelog" />
            <div>
              <h1 className="text-xl font-bold">Employee Management Guide</h1>
              <p className="text-xs text-muted-foreground">Workforce administration and certification tracking</p>
            </div>
          </div>
          <MainMenuButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
              <Users className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              Employee Management Overview
            </h2>
            <p className="text-muted-foreground">
              The Employee Management system provides complete workforce administration including profile management, certification tracking, compensation configuration, and role-based access control. Access it from the Employees section in your dashboard.
            </p>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Award className="w-5 h-5" />
                The Golden Rule: Certifications Drive Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-2xl font-mono font-bold">
                  Expired Cert = Work Restriction
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Certification tracking is mandatory for rope access work.</strong> The system monitors:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>IRATA Level</strong>: Level 1, 2, or 3 with expiration dates</li>
                  <li><strong>Driver's License</strong>: Required for company vehicle use</li>
                  <li><strong>Expiration Alerts</strong>: Visual warnings as dates approach</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Expiration Warning System
                </p>
                <p className="mt-1">The system displays visual indicators when certifications are approaching expiration (30 days) or have expired. This helps ensure continuous compliance with safety regulations.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-bold text-green-700 dark:text-green-300">Valid</p>
                  <p className="text-lg font-mono">60+ days</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-bold text-amber-700 dark:text-amber-300">Warning</p>
                  <p className="text-lg font-mono">30 days</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-bold text-red-700 dark:text-red-300">Expired</p>
                  <p className="text-lg font-mono">0 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Adding New Employees
          </h2>

          <div className="space-y-4">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Basic Information</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter employee name, email address, and phone number. The email will be used for login credentials.
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
                  <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Role Assignment</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select the employee's role: Rope Access Technician, Supervisor, or Operations Manager. This determines their system permissions and dashboard access.
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
                  <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Certification Details</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter IRATA certification level (1, 2, or 3) and expiration date. Optionally add driver's license information for vehicle assignments.
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
                  <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold">Compensation Setup</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure hourly rate for payroll calculations. Toggle between hourly and peace work compensation types as needed.
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
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold">Employee Created</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      The employee receives login credentials and can access the system based on their assigned role. They'll appear in scheduling and assignment lists.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Employee Profile Fields
          </h2>
          <p className="text-muted-foreground text-sm">
            Each employee profile contains comprehensive information for workforce management.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Full name</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>Email address (login)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>Phone number</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>IRATA Level (1, 2, or 3)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>IRATA expiration date</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  <span>Driver's license details</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Contact name</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>Contact phone number</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>Relationship</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Compensation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Hourly rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Compensation type toggle</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span>Hourly vs Peace Work</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Role Hierarchy & Permissions
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 shrink-0">Company Owner</Badge>
                  <div className="text-sm">
                    <p className="font-medium">Full system access</p>
                    <p className="text-muted-foreground">All features including billing, employee management, financial data, and company settings.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 shrink-0">Operations Manager</Badge>
                  <div className="text-sm">
                    <p className="font-medium">Operational control</p>
                    <p className="text-muted-foreground">Employee management, scheduling, projects, payroll, and most operational features except billing.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 shrink-0">Supervisor</Badge>
                  <div className="text-sm">
                    <p className="font-medium">Team oversight</p>
                    <p className="text-muted-foreground">Project management, scheduling, safety forms, and team coordination. Limited employee management.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 shrink-0">Rope Access Tech</Badge>
                  <div className="text-sm">
                    <p className="font-medium">Field operations</p>
                    <p className="text-muted-foreground">Clock in/out, safety forms, personal profile, IRATA hours logging, and assigned project access.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Administrative Actions
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-600" />
                  Password Reset
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground">
                  Administrators can reset employee passwords when needed. A temporary password is generated and must be changed on first login.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">Owner/Manager Only</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserX className="w-4 h-4 text-red-600" />
                  Employee Termination
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground">
                  Terminated employees lose system access but their historical data (work sessions, safety forms) is preserved for compliance records.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">Owner/Manager Only</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    Data Preservation Policy
                  </p>
                  <p className="text-blue-800 dark:text-blue-200">
                    When an employee is terminated, their account is deactivated but all associated records are preserved. This includes work sessions, safety form submissions, equipment assignments, and payroll history. This ensures compliance with regulatory requirements and maintains accurate historical records.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Quick Reference
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Field</th>
                      <th className="text-left py-2 font-semibold">Required</th>
                      <th className="text-left py-2 font-semibold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2">Name</td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                      <td className="py-2 text-muted-foreground">Display and identification</td>
                    </tr>
                    <tr>
                      <td className="py-2">Email</td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                      <td className="py-2 text-muted-foreground">Login credentials</td>
                    </tr>
                    <tr>
                      <td className="py-2">Phone</td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                      <td className="py-2 text-muted-foreground">Contact and emergencies</td>
                    </tr>
                    <tr>
                      <td className="py-2">Role</td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                      <td className="py-2 text-muted-foreground">Access permissions</td>
                    </tr>
                    <tr>
                      <td className="py-2">IRATA Level</td>
                      <td className="py-2"><Badge variant="secondary">Recommended</Badge></td>
                      <td className="py-2 text-muted-foreground">Certification compliance</td>
                    </tr>
                    <tr>
                      <td className="py-2">Hourly Rate</td>
                      <td className="py-2"><Badge variant="secondary">Optional</Badge></td>
                      <td className="py-2 text-muted-foreground">Payroll calculations</td>
                    </tr>
                    <tr>
                      <td className="py-2">Emergency Contact</td>
                      <td className="py-2"><Badge variant="secondary">Recommended</Badge></td>
                      <td className="py-2 text-muted-foreground">Safety compliance</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="mt-8 flex justify-center">
          <Link href="/changelog">
            <Button variant="outline" className="gap-2" data-testid="button-back-to-changelog">
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Knowledge Base
            </Button>
          </Link>
        </div>

      </main>
    </div>
  );
}
