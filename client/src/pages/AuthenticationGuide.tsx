import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import ChangelogLayout from "@/components/ChangelogLayout";
import {
  Shield,
  CheckCircle2,
  Lock,
  Users,
  ChevronRight,
  ArrowRight,
  Key,
  Eye,
  UserCheck,
  Building2,
  Mail,
  AlertTriangle,
  ShieldCheck,
  User,
  Settings,
  FileText,
  Globe,
  Fingerprint,
  LogIn,
  UserPlus,
  KeyRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AuthenticationGuide() {
  const [, navigate] = useLocation();

  return (
    <ChangelogLayout title="Authentication Guide">
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BackButton to="/changelog" />
              <div>
                <h1 className="text-xl font-bold">Authentication & User Management Guide</h1>
                <p className="text-xs text-muted-foreground">Secure multi-tenant access control documentation</p>
              </div>
            </div>
            <MainMenuButton />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                Authentication Overview
              </h2>
              <p className="text-muted-foreground">
                The platform uses <strong>session-based authentication</strong> with secure HTTP-only cookies to protect user sessions. Multi-tenant architecture ensures complete data isolation between companies while supporting multiple user roles with granular permissions.
              </p>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <Card className="border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                  <ShieldCheck className="w-5 h-5" />
                  Security Architecture
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
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              User Roles & Permissions
            </h2>
            
            <div className="grid gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">Owner</Badge>
                    Company Owner
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Full access to all company features including billing, employee management, and company settings. Can create and manage all user accounts.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Manager</Badge>
                    Operations Manager
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Manages daily operations, scheduling, and employee assignments. Can view financial data but cannot modify billing settings.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Supervisor</Badge>
                    Site Supervisor
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Oversees on-site work, can manage assigned projects and team members. Access to safety documentation and time tracking.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Tech</Badge>
                    Rope Access Technician
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Standard technician access for time tracking, safety inspections, and IRATA logging. Cannot access financial or administrative features.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">Crew</Badge>
                    Ground Crew
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Basic access for ground support staff. Time tracking only with minimal platform access.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Registration Flows
            </h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Company Registration
                  </CardTitle>
                  <CardDescription>New companies signing up for the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Company details and owner account created together</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Email verification required before full access</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Subscription tier selection during signup</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Employee Registration
                  </CardTitle>
                  <CardDescription>Adding new employees to an existing company</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Automatic credential generation with secure passwords</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Role assignment during onboarding</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>IRATA certification tracking setup</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Resident Registration
                  </CardTitle>
                  <CardDescription>Building residents accessing the complaint portal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Unique resident codes for account linking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Limited access to complaint submission and tracking</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Property Manager Registration
                  </CardTitle>
                  <CardDescription>Property managers accessing vendor information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Property manager codes for secure account linking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Read-only access to vendor company summaries</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Company Safety Rating (CSR) visibility</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Problems Solved
            </h2>
            
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="problem-1" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-medium">Credential Security & Password Management</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Problem:</p>
                    <p className="text-sm text-red-700 dark:text-red-300">Passwords stored in plain text or easily accessible, creating security vulnerabilities</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Solution:</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Bcrypt password hashing with salt rounds, HTTP-only session cookies, and secure credential generation for new employees</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="problem-2" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-medium">Multi-Company Data Isolation</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Problem:</p>
                    <p className="text-sm text-red-700 dark:text-red-300">Companies could potentially access other companies' data through API manipulation or session hijacking</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Solution:</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Complete multi-tenant architecture with company ID verification on every API request and database-level row filtering</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="problem-3" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-medium">Role-Based Feature Access</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Problem:</p>
                    <p className="text-sm text-red-700 dark:text-red-300">All employees see the same features regardless of their role, leading to confusion and potential misuse</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Solution:</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Granular permission system with 5 role levels and permission-based UI rendering that hides unauthorized features</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Account Management
            </h2>
            
            <div className="grid gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <KeyRound className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Password Changes</p>
                      <p className="text-sm text-muted-foreground">Users can change their passwords with current password verification. Admins can reset employee passwords when needed.</p>
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
                      <p className="text-sm text-muted-foreground">Account deletion available with appropriate permissions. Data retention policies ensure compliance while removing sensitive information.</p>
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
                      <p className="text-sm text-muted-foreground">Automatic session expiration and secure logout functionality. Users can view and terminate active sessions if needed.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

        </main>
      </div>
    </ChangelogLayout>
  );
}
