import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
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
  return (
    <ChangelogGuideLayout 
      title="Employee Management Guide"
      version="2.0"
      lastUpdated="December 5, 2025"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Employee Management system provides complete workforce administration including profile management, certification tracking, compensation configuration, and role-based access control. Access it from the Employees section in your dashboard.
          </p>
        </section>

        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Award className="w-5 h-5" />
                The Golden Rule: Certifications Drive Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Expired Cert = Work Restriction
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Certification tracking is mandatory for rope access work.</strong> The system monitors:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>irata Level</strong>: Level 1, 2, or 3 with expiration dates</li>
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

        {/* Problems Solved */}
        <section className="space-y-4">
          <Card className="border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2 text-green-900 dark:text-green-100">
                <CheckCircle2 className="w-5 h-5" />
                Problems Solved
              </CardTitle>
            </CardHeader>
            <CardContent className="text-green-900 dark:text-green-100">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Expired certification surprises:</strong> Automatic alerts when irata certifications approach expiration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Compensation confusion:</strong> Clear hourly rate and piece work toggle settings per employee</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Role-based access gaps:</strong> Granular permission assignment beyond base role capabilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Onboarding complexity:</strong> Streamlined employee creation with temporary password workflow</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Driver eligibility tracking:</strong> License expiration monitoring for vehicle assignments</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
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
                    <h3 className="text-xl md:text-2xl font-semibold">Basic Information</h3>
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
                    <h3 className="text-xl md:text-2xl font-semibold">Role Assignment</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select from 14 available roles across management and field positions. Roles provide baseline access, with granular permissions configurable per employee.
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
                    <h3 className="text-xl md:text-2xl font-semibold">Certification Details</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter irata certification level (1, 2, or 3) and expiration date. Optionally add driver's license information for vehicle assignments.
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
                    <h3 className="text-xl md:text-2xl font-semibold">Compensation Setup</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure hourly rate for payroll calculations. Toggle between hourly and piece work compensation types as needed.
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
                    <h3 className="text-xl md:text-2xl font-semibold">Employee Created</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      The employee receives login credentials and can access the system based on their assigned role. They can be scheduled for jobs and assigned gear from inventory.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Employee Profile Fields
          </h2>
          <p className="text-muted-foreground text-sm">
            Each employee profile contains comprehensive information for workforce management.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-action-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
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
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-muted-foreground" />
                  <span>Profile photo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Birthday</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Start date</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span>Home address (street, city, province, country, postal code)</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>IRATA Level (1, 2, or 3)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-muted-foreground" />
                  <span>IRATA license number</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>IRATA expiration date</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-muted-foreground" />
                  <span>SPRAT certification (alternative to IRATA)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  <span>Driver's license (number, province, expiration)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <span>First Aid certification (type, expiration)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Years of rope access experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span>Rope access specialties</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
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
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Compensation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Hourly rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Hourly vs Salary toggle</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span>Annual salary amount</span>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Sensitive Information
                  <Badge variant="outline" className="ml-2 text-xs">Encrypted</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <div className="grid sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span>Social Insurance Number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span>Bank transit number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span>Bank institution number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span>Bank account number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span>Void cheque documents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span>Special medical conditions</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  All sensitive data is encrypted at rest using AES-256-GCM encryption.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Role Hierarchy & Permissions
          </h2>

          <p className="text-muted-foreground text-base">
            The system supports 14 employee roles organized into Management and Worker categories. Each role provides baseline access, with granular permissions configurable per individual.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Management Roles
                </CardTitle>
                <CardDescription>8 roles with elevated system access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 shrink-0">Company</Badge>
                  <p className="text-sm text-muted-foreground">Full system access including billing</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 shrink-0">Owner/CEO</Badge>
                  <p className="text-sm text-muted-foreground">Executive-level access</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 shrink-0">Operations Manager</Badge>
                  <p className="text-sm text-muted-foreground">Day-to-day operations control</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 shrink-0">Human Resources</Badge>
                  <p className="text-sm text-muted-foreground">Employee management focus</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 shrink-0">Accounting</Badge>
                  <p className="text-sm text-muted-foreground">Financial data access</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-action-100 text-action-800 dark:bg-action-900 dark:text-action-200 shrink-0">General Supervisor</Badge>
                  <p className="text-sm text-muted-foreground">Multi-team oversight</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-action-100 text-action-800 dark:bg-action-900 dark:text-action-200 shrink-0">Rope Access Supervisor</Badge>
                  <p className="text-sm text-muted-foreground">Rope team oversight</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 shrink-0">Account Manager</Badge>
                  <p className="text-sm text-muted-foreground">Client relationship focus</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  Worker Roles
                </CardTitle>
                <CardDescription>6 roles for field operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 shrink-0">Rope Access Tech</Badge>
                  <p className="text-sm text-muted-foreground">Primary field technician role</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 shrink-0">Supervisor</Badge>
                  <p className="text-sm text-muted-foreground">Generic supervisor role</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 shrink-0">Manager</Badge>
                  <p className="text-sm text-muted-foreground">Site or project manager</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 shrink-0">Ground Crew</Badge>
                  <p className="text-sm text-muted-foreground">Ground-level support</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 shrink-0">Ground Crew Supervisor</Badge>
                  <p className="text-sm text-muted-foreground">Ground team lead</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200 shrink-0">Labourer</Badge>
                  <p className="text-sm text-muted-foreground">General labor support</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-action-500 bg-action-50 dark:bg-action-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-action-900 dark:text-action-100">
                <Key className="w-5 h-5" />
                Granular Permission System
              </CardTitle>
            </CardHeader>
            <CardContent className="text-action-900 dark:text-action-100 space-y-3">
              <p className="text-base">
                Beyond base role access, individual permissions can be assigned to each employee. This allows fine-tuned control over who can access specific features.
              </p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>View Financial Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Manage Employees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>View Performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Manage Inventory</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>View Safety Documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Access Payroll</span>
                </div>
              </div>
              <p className="text-sm text-action-800 dark:text-action-200">
                Company owners automatically have all permissions. Other roles can be granted specific permissions individually.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Administrative Actions
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-600" />
                  Password Reset
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
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
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <UserX className="w-4 h-4 text-red-600" />
                  Employee Termination
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  Terminated employees lose system access but their historical data (work sessions, safety forms) is preserved for compliance records.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">Owner/Manager Only</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-action-50 dark:bg-action-950 border-action-200 dark:border-action-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-action-600 dark:text-action-400 mt-0.5 shrink-0" />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-action-900 dark:text-action-100">
                    Data Preservation Policy
                  </p>
                  <p className="text-action-800 dark:text-action-200">
                    When an employee is terminated, their account is deactivated but all associated records are preserved. This includes work sessions, safety form submissions, equipment assignments, and payroll history. This ensures compliance with regulatory requirements and maintains accurate historical records.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
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
                      <td className="py-2">irata Level</td>
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

              </div>
    </ChangelogGuideLayout>
  );
}
