import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  Shield,
  Users,
  Building2,
  Database,
  ArrowRight,
  Lock,
  Eye,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Crown,
  Gift,
  BarChart3,
  Key,
  Activity,
  CreditCard,
  UserPlus,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PlatformAdminGuide() {
  return (
    <ChangelogGuideLayout 
      title="SuperUser Administration Guide"
      version="2.0"
      lastUpdated="December 5, 2025"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            Platform Administration provides <strong>SuperUser-level access</strong> to manage all registered companies, monitor platform health, and provision accounts. SuperUsers operate outside the normal company structure with full visibility across the entire platform.
          </p>
        </section>

        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Crown className="w-5 h-5" />
                The Golden Rule: SuperUser Separation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  SuperUser ≠ Company User
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>SuperUsers exist outside the company structure.</strong> Key principles:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>No companyId</strong>: SuperUsers have null companyId - they are platform administrators</li>
                  <li><strong>Cross-company visibility</strong>: Can view all companies and their data</li>
                  <li><strong>Impersonation mode</strong>: "View as Company" allows testing company experiences</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Critical Understanding
                </p>
                <p className="mt-1">SuperUsers cannot be employees or have time tracking. They are purely administrative accounts for platform oversight.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">SuperUser</p>
                  <p className="font-bold">Platform Admin</p>
                  <p className="text-lg font-mono">companyId: null</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Company Owner</p>
                  <p className="font-bold">Business Admin</p>
                  <p className="text-lg font-mono">companyId: ABC123</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Employee</p>
                  <p className="font-bold">Team Member</p>
                  <p className="text-lg font-mono">companyId: ABC123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

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
                  <span><strong>Platform oversight gaps:</strong> SuperUser dashboard provides centralized visibility into all registered companies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>License enforcement:</strong> Tier-based limits on projects and seats enforced automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Support debugging:</strong> "View as Company" impersonation mode enables safe troubleshooting</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Subscription tracking:</strong> Real-time status monitoring for billing and renewals</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Multi-tenant isolation:</strong> Clear separation between platform admin and company data</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            System Architecture
          </h2>
          <p className="text-base text-muted-foreground">The platform administration system consists of these core components:</p>

          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-action-600" />
                  1. Company Registry
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>Central database of all registered companies on the platform.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Key Fields:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><code>companyName</code> - Business name</li>
                    <li><code>licenseKey</code> - Unique activation key</li>
                    <li><code>tier</code> - Subscription level (Basic, Starter, Premium, Enterprise)</li>
                    <li><code>maxProjects</code>, <code>maxSeats</code> - License limits</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Key className="w-4 h-4 text-green-600" />
                  2. License Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>Tracks subscription status, billing, and feature access for each company.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>License Tiers:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><strong>Basic</strong>: 2 projects, 4 seats</li>
                    <li><strong>Starter</strong>: 5 projects, 10 seats</li>
                    <li><strong>Premium</strong>: 9 projects, 18 seats</li>
                    <li><strong>Enterprise</strong>: Unlimited</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  3. Platform Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>Real-time analytics and business intelligence across all companies.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Tracked Metrics:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>MRR/ARR - Monthly and Annual Recurring Revenue</li>
                    <li>Customer distribution by tier</li>
                    <li>Churn rate and resubscription tracking</li>
                    <li>Feature adoption analytics</li>
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
            Access Hierarchy
          </h2>
          <p className="text-base text-muted-foreground">Platform administration uses a strict access model:</p>

          <div className="space-y-3">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900 rounded-full p-2">
                    <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">SuperUser</p>
                      <Badge variant="secondary" className="text-xs">isSuperUser: true</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Full platform access. Can view all companies, gift accounts, access metrics, and impersonate company views.</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">View All Companies</Badge>
                      <Badge variant="outline" className="text-xs">Gift Accounts</Badge>
                      <Badge variant="outline" className="text-xs">Platform Metrics</Badge>
                      <Badge variant="outline" className="text-xs">Feature Requests</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-action-100 dark:bg-action-900 rounded-full p-2">
                    <Building2 className="w-4 h-4 text-action-600 dark:text-action-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Company Owner</p>
                      <Badge variant="secondary" className="text-xs">isOwner: true</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Full access within their company. Cannot see other companies or platform-level data.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
                    <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Employees</p>
                      <Badge variant="secondary" className="text-xs">Permission-based</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Access controlled by granular permissions set by company owner.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-action-600 dark:text-action-400" />
            Workflows
          </h2>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Workflow 1</Badge>
                  <CardTitle className="text-base">View All Companies</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">Navigate to SuperUser Dashboard</p>
                      <p className="text-base text-muted-foreground">Access via /superuser route after SuperUser login</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">Click "View All Companies"</p>
                      <p className="text-base text-muted-foreground">Opens company registry with search and filtering</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">View company details</p>
                      <p className="text-base text-muted-foreground">See license status, subscription tier, employee count, and usage metrics</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Workflow 2</Badge>
                  <CardTitle className="text-base">Gift Company Account</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">Click "Gift Company Account"</p>
                      <p className="text-base text-muted-foreground">Opens provisioning dialog</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">Enter company details</p>
                      <p className="text-base text-muted-foreground">Company name, admin email, password, and subscription tier</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">Review license key</p>
                      <p className="text-base text-muted-foreground">Auto-generated GIFT-XXXXX key is shown for reference</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="font-medium">Create account</p>
                      <p className="text-base text-muted-foreground">Company is immediately provisioned with full access - no payment required</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Workflow 3</Badge>
                  <CardTitle className="text-base">View as Company (Impersonation)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">Select company from list</p>
                      <p className="text-base text-muted-foreground">Find target company in registry</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">Click "View as Company"</p>
                      <p className="text-base text-muted-foreground">Enters impersonation mode with company context</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">Navigate platform as company</p>
                      <p className="text-base text-muted-foreground">See exactly what company users see for troubleshooting</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="font-medium">Exit impersonation</p>
                      <p className="text-base text-muted-foreground">Return to SuperUser dashboard</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Customer Journeys
          </h2>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl md:text-2xl font-semibold text-amber-700 dark:text-amber-300">SuperUser Journey</h3>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Login</p>
                      <p className="text-xs text-muted-foreground">SuperUser credentials</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-amber-600 dark:text-amber-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Dashboard</p>
                      <p className="text-xs text-muted-foreground">Platform overview</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-amber-600 dark:text-amber-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Select Action</p>
                      <p className="text-xs text-muted-foreground">Companies/Metrics/Gifts</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-amber-600 dark:text-amber-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Execute</p>
                      <p className="text-xs text-muted-foreground">Complete task</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Key Features Summary
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <Building2 className="w-5 h-5 text-action-600 dark:text-action-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Company Registry</p>
                <p className="text-base text-muted-foreground">View and search all registered companies.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Gift className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Gift Accounts</p>
                <p className="text-base text-muted-foreground">Provision free company accounts instantly.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Platform Metrics</p>
                <p className="text-base text-muted-foreground">MRR, ARR, churn, and business analytics.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Eye className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Impersonation Mode</p>
                <p className="text-base text-muted-foreground">View platform as any company for support.</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Quick Links</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/superuser">
              <Button variant="outline" 
              className="w-full justify-between h-auto p-4"
              data-testid="link-superuser">

              <div className="text-left">
                <div className="font-semibold">SuperUser Dashboard</div>
                <div className="text-xs text-muted-foreground">Access platform administration</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
            </Link>

            <Link href="/changelog/analytics">
              <Button variant="outline" 
              className="w-full justify-between h-auto p-4"
              data-testid="link-analytics-guide">

              <div className="text-left">
                <div className="font-semibold">Analytics Guide</div>
                <div className="text-xs text-muted-foreground">Reporting and insights</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
            </Link>
          </div>
        </section>

        <Card className="border-muted bg-muted/50">
          <CardContent className="pt-6 text-base text-muted-foreground">
            <p><strong>Last updated:</strong> December 3, 2024 | <strong>Version:</strong> 1.0</p>
            <p className="mt-1">This document serves as the authoritative reference for Platform Administration.</p>
          </CardContent>
        </Card>
      </div>
    </ChangelogGuideLayout>
  );
}
