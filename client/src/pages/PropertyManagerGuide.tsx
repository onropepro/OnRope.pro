import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import ChangelogLayout from "@/components/ChangelogLayout";
import {
  Building2,
  Users,
  Shield,
  Database,
  ArrowRight,
  Lock,
  Eye,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ClipboardCheck,
  Star,
  FileText,
  Search,
  BarChart3,
  Key,
  UserCheck,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PropertyManagerGuide() {
  const [, navigate] = useLocation();

  return (
    <ChangelogLayout title="Property Manager Guide">
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton to="/changelog" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Property Manager Interface Guide</h1>
              <p className="text-xs text-muted-foreground">Vendor management and safety compliance viewing</p>
            </div>
          </div>
          <MainMenuButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        <section className="space-y-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2 mb-2">
              <Building2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              Property Manager Interface Overview
            </h2>
            <p className="text-muted-foreground">
              The Property Manager Interface provides a <strong>dedicated "My Vendors" dashboard</strong> where property managers can view their contracted rope access companies, access read-only company information, and monitor safety compliance through the Company Safety Rating (CSR) system.
            </p>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Eye className="w-5 h-5" />
                The Golden Rule: Read-Only Access
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  View Only - No Modifications
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Property managers have read-only access to vendor data.</strong> Key principles:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>No editing</strong>: Cannot modify company data, employees, or projects</li>
                  <li><strong>Transparency</strong>: Full visibility into safety compliance</li>
                  <li><strong>CSR access</strong>: View detailed Company Safety Rating breakdowns</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Critical Understanding
                </p>
                <p className="mt-1">Property managers are linked to companies via the isPropertyManager role. They can only see companies they have been given access to view.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Can View</p>
                  <p className="font-bold">Company Profile</p>
                  <p className="text-lg font-mono text-green-700 dark:text-green-300">Yes</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Can View</p>
                  <p className="font-bold">Safety Rating</p>
                  <p className="text-lg font-mono text-green-700 dark:text-green-300">Yes</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Can Edit</p>
                  <p className="font-bold">Anything</p>
                  <p className="text-lg font-mono text-red-700 dark:text-red-300">No</p>
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
                  <span><strong>Vendor safety verification:</strong> Company Safety Rating (CSR) provides transparent compliance metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Scattered vendor information:</strong> Centralized "My Vendors" dashboard aggregates all contractor details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Audit evidence collection:</strong> Read-only access provides documentation without edit risk</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Liability concerns:</strong> CSR breakdown shows specific compliance categories and penalties</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Access control:</strong> Strict role-based linking ensures managers only see authorized vendors</span>
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
          <p className="text-base text-muted-foreground">The Property Manager Interface consists of these components:</p>

          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Home className="w-4 h-4 text-action-600" />
                  1. My Vendors Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>Central hub displaying all contracted rope access companies.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Dashboard Features:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Company cards with summary information</li>
                    <li>CSR score display prominently shown</li>
                    <li>Quick access to company details</li>
                    <li>Search and filter vendors</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-600" />
                  2. Company Safety Rating (CSR)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>Penalty-based rating system showing compliance status.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>CSR Components:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><strong>Base Score</strong>: Starts at 100 points</li>
                    <li><strong>Penalties</strong>: Deductions for compliance failures</li>
                    <li><strong>Categories</strong>: Harness inspections, certifications, safety forms</li>
                    <li><strong>Trend</strong>: Historical rating changes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  3. Read-Only Company View
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>Detailed company information accessible without edit capabilities.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Viewable Information:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Company profile and contact details</li>
                    <li>Active employees and certifications</li>
                    <li>Safety compliance history</li>
                    <li>Project assignments (building-specific)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Company Safety Rating (CSR) Details
          </h2>
          <p className="text-base text-muted-foreground">Understanding the penalty-based rating system:</p>

          <Card>
            <CardContent className="pt-4 space-y-4">
              <div className="bg-muted p-4 rounded text-sm">
                <p className="font-semibold mb-2">CSR Calculation Formula:</p>
                <p className="text-xl md:text-2xl font-mono font-bold text-center">CSR = 100 - Total Penalties</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Penalty Categories:</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>Expired IRATA Certification</span>
                    <Badge variant="destructive">-15 points</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>Overdue Harness Inspection</span>
                    <Badge variant="destructive">-10 points</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>Missing Toolbox Meeting</span>
                    <Badge variant="destructive">-5 points</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>Unsigned Safety Document</span>
                    <Badge variant="destructive">-3 points</Badge>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">90-100</p>
                  <p className="text-xs text-muted-foreground">Excellent</p>
                </div>
                <div className="text-center p-3 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">70-89</p>
                  <p className="text-xs text-muted-foreground">Needs Attention</p>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded border border-red-200 dark:border-red-800">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">Below 70</p>
                  <p className="text-xs text-muted-foreground">Critical</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            Access Control
          </h2>
          <p className="text-base text-muted-foreground">Property Manager role and access boundaries:</p>

          <div className="space-y-3">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-teal-100 dark:bg-teal-900 rounded-full p-2">
                    <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Property Manager Role</p>
                      <Badge variant="secondary" className="text-xs">isPropertyManager: true</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Dedicated role for strata managers and building owners to view their vendors</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">View Vendors</Badge>
                      <Badge variant="outline" className="text-xs">View CSR</Badge>
                      <Badge variant="outline" className="text-xs">View Compliance</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
                    <Lock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Restricted Actions</p>
                      <Badge variant="destructive" className="text-xs">Not Allowed</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Property managers cannot:</p>
                    <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
                      <li>Edit company information</li>
                      <li>View financial data</li>
                      <li>Access employee personal details</li>
                      <li>Modify safety records</li>
                    </ul>
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
                  <CardTitle className="text-xl md:text-2xl font-semibold">View Vendor CSR</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">Navigate to My Vendors</p>
                      <p className="text-base text-muted-foreground">Access from dashboard or sidebar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">Select vendor company</p>
                      <p className="text-base text-muted-foreground">Click on company card to view details</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">View CSR breakdown</p>
                      <p className="text-base text-muted-foreground">See overall score and penalty details</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="font-medium">Review compliance categories</p>
                      <p className="text-base text-muted-foreground">Drill into specific penalty sources</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Workflow 2</Badge>
                  <CardTitle className="text-xl md:text-2xl font-semibold">Compare Vendors</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">View all vendors</p>
                      <p className="text-base text-muted-foreground">My Vendors dashboard shows all contracted companies</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">Compare CSR scores</p>
                      <p className="text-base text-muted-foreground">Scores visible on each vendor card</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">Sort by rating</p>
                      <p className="text-base text-muted-foreground">Identify top-performing vendors</p>
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
              <h3 className="font-semibold text-sm text-teal-700 dark:text-teal-300">Property Manager Journey</h3>
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 rounded-lg p-6 border border-teal-200 dark:border-teal-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Login</p>
                      <p className="text-xs text-muted-foreground">Property Manager account</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-teal-600 dark:text-teal-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">My Vendors</p>
                      <p className="text-xs text-muted-foreground">View contracted companies</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-teal-600 dark:text-teal-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Check CSR</p>
                      <p className="text-xs text-muted-foreground">Review safety ratings</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-teal-600 dark:text-teal-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Make Decisions</p>
                      <p className="text-xs text-muted-foreground">Informed vendor choices</p>
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
              <Home className="w-5 h-5 text-action-600 dark:text-action-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">My Vendors Dashboard</p>
                <p className="text-base text-muted-foreground">Central hub for all contracted vendors.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Star className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">CSR Visibility</p>
                <p className="text-base text-muted-foreground">Detailed safety rating breakdowns.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Eye className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Read-Only Access</p>
                <p className="text-base text-muted-foreground">Transparent view without edit rights.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <ClipboardCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Compliance Monitoring</p>
                <p className="text-base text-muted-foreground">Track vendor safety performance.</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Quick Links</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="justify-between h-auto p-4"
              onClick={() => navigate("/my-vendors")}
              data-testid="link-my-vendors"
            >
              <div className="text-left">
                <div className="font-semibold">My Vendors</div>
                <div className="text-xs text-muted-foreground">View contracted companies</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline" 
              className="justify-between h-auto p-4"
              onClick={() => navigate("/changelog/safety")}
              data-testid="link-safety-guide"
            >
              <div className="text-left">
                <div className="font-semibold">Safety Guide</div>
                <div className="text-xs text-muted-foreground">Compliance documentation</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>

        <Card className="border-muted bg-muted/50">
          <CardContent className="pt-6 text-base text-muted-foreground">
            <p><strong>Last updated:</strong> December 3, 2024 | <strong>Version:</strong> 1.0</p>
            <p className="mt-1">This document serves as the authoritative reference for the Property Manager Interface.</p>
          </CardContent>
        </Card>
      </main>
      </div>
    </ChangelogLayout>
  );
}
