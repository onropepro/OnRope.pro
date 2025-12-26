import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Database,
  ArrowRight,
  Lock,
  Eye,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  DollarSign,
  Calendar,
  Activity,
  PieChart,
  Target,
  Timer,
  FileText,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AnalyticsGuide() {
  return (
    <ChangelogGuideLayout 
      title="Analytics & Reporting Guide"
      version="2.0"
      lastUpdated="December 5, 2025"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Analytics system provides <strong>comprehensive business intelligence</strong> across time tracking, project performance, workforce productivity, and financial metrics. Reports are permission-controlled to ensure appropriate data access.
          </p>
        </section>

        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Target className="w-5 h-5" />
                The Golden Rule: Permission-Based Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  See Only What You're Authorized
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Analytics respect permission boundaries.</strong> Key principles:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Financial data</strong>: Requires canAccessFinancials permission</li>
                  <li><strong>Employee data</strong>: Filtered by canViewEmployees permission</li>
                  <li><strong>Own data only</strong>: Workers without permissions see only their metrics</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Critical Understanding
                </p>
                <p className="mt-1">The same analytics page shows different data based on who is viewing. A manager sees company-wide stats; an employee sees only their own performance.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Owner View</p>
                  <p className="font-bold">All Company Data</p>
                  <p className="text-lg font-mono text-green-700 dark:text-green-300">Full Access</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Manager View</p>
                  <p className="font-bold">Team Metrics</p>
                  <p className="text-lg font-mono text-blue-700 dark:text-blue-300">Filtered</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Employee View</p>
                  <p className="font-bold">Personal Stats</p>
                  <p className="text-lg font-mono text-amber-700 dark:text-amber-300">Self Only</p>
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
                  <span><strong>Invisible productivity:</strong> Real-time billable vs non-billable hour tracking across all employees</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Unknown labor costs:</strong> Project-level cost analysis shows actual spend against estimates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>No workforce visibility:</strong> Active worker tracking shows who's clocked in where right now</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Sensitive data exposure:</strong> Permission-based filtering controls who sees financial metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Manual reporting burden:</strong> Automated dashboards replace spreadsheet compilation</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Analytics Categories
          </h2>
          <p className="text-base text-muted-foreground">The platform provides analytics across these key areas:</p>

          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-action-600" />
                  1. Time Tracking Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>Insights into workforce time allocation and productivity.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Key Metrics:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><strong>Billable vs Non-Billable</strong>: Ratio of revenue-generating work</li>
                    <li><strong>Hours by Project</strong>: Time distribution across jobs</li>
                    <li><strong>Hours by Employee</strong>: Individual productivity tracking</li>
                    <li><strong>Active Workers</strong>: Real-time clock-in status</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-green-600" />
                  2. Project Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>Performance metrics for active and completed projects.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Key Metrics:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><strong>Labor Costs</strong>: Total cost per project (requires financial permission)</li>
                    <li><strong>Completion Rate</strong>: Progress tracking against estimates</li>
                    <li><strong>Drop Tracking</strong>: Elevation progress for window/building work</li>
                    <li><strong>Status Distribution</strong>: Projects by status</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  3. Workforce Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>Employee performance and certification tracking.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Key Metrics:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><strong>IRATA Certification Status</strong>: Expiration tracking</li>
                    <li><strong>Hours Logged</strong>: Total work time per employee</li>
                    <li><strong>Harness Inspection Status</strong>: Compliance tracking</li>
                    <li><strong>Equipment Assignments</strong>: Gear utilization</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  4. Financial Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>Revenue and cost tracking (requires canAccessFinancials permission).</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Key Metrics:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><strong>Payroll Summary</strong>: Total labor costs by period</li>
                    <li><strong>Quote Pipeline</strong>: Win rates and revenue forecasting</li>
                    <li><strong>Project Profitability</strong>: Revenue vs labor costs</li>
                    <li><strong>Equipment Value</strong>: Inventory asset tracking</li>
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
            Permission Requirements
          </h2>
          <p className="text-base text-muted-foreground">Analytics access is controlled by these permissions:</p>

          <div className="space-y-3">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                    <Eye className="w-4 h-4 text-action-600 dark:text-action-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">View Reports</p>
                      <Badge variant="secondary" className="text-xs">canViewReports</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Access dashboard analytics and time reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
                    <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">View Employees</p>
                      <Badge variant="secondary" className="text-xs">canViewEmployees</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">See workforce productivity metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900 rounded-full p-2">
                    <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Financial Access</p>
                      <Badge variant="secondary" className="text-xs">canAccessFinancials</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">View payroll, costs, and revenue analytics</p>
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
                  <CardTitle className="text-base">View Time Analytics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">Navigate to Dashboard</p>
                      <p className="text-base text-muted-foreground">Access main dashboard from sidebar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">View Active Workers widget</p>
                      <p className="text-base text-muted-foreground">See real-time clock-in status and billable hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">Click for detailed reports</p>
                      <p className="text-base text-muted-foreground">Drill into time entries by project or employee</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Workflow 2</Badge>
                  <CardTitle className="text-base">Generate Payroll Report</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">Navigate to Financials</p>
                      <p className="text-base text-muted-foreground">Requires canAccessFinancials permission</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">Select date range</p>
                      <p className="text-base text-muted-foreground">Choose pay period for report</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">View breakdown by employee</p>
                      <p className="text-base text-muted-foreground">Hours, rates, and total compensation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="font-medium">Export if needed</p>
                      <p className="text-base text-muted-foreground">Download for accounting software</p>
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
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Customer Journeys
          </h2>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-indigo-700 dark:text-indigo-300">Manager Analytics Journey</h3>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Dashboard</p>
                      <p className="text-xs text-muted-foreground">View summary widgets</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-indigo-600 dark:text-indigo-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Select Metric</p>
                      <p className="text-xs text-muted-foreground">Choose area of focus</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-indigo-600 dark:text-indigo-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Drill Down</p>
                      <p className="text-xs text-muted-foreground">View detailed data</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-indigo-600 dark:text-indigo-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Take Action</p>
                      <p className="text-xs text-muted-foreground">Informed decisions</p>
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
              <Clock className="w-5 h-5 text-action-600 dark:text-action-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Real-Time Tracking</p>
                <p className="text-base text-muted-foreground">Live active worker status and billable hours.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Visual Charts</p>
                <p className="text-base text-muted-foreground">Interactive graphs and distribution charts.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Financial Insights</p>
                <p className="text-base text-muted-foreground">Payroll and project cost analytics.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Target className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Permission Filtering</p>
                <p className="text-base text-muted-foreground">Data shown based on user access level.</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Quick Links</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/dashboard">
              <Button variant="outline" 
              className="w-full justify-between h-auto p-4"
              data-testid="link-dashboard">

              <div className="text-left">
                <div className="font-semibold">Go to Dashboard</div>
                <div className="text-xs text-muted-foreground">View analytics widgets</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
            </Link>

            <Link href="/changelog/time-tracking">
              <Button variant="outline" 
              className="w-full justify-between h-auto p-4"
              data-testid="link-time-tracking-guide">

              <div className="text-left">
                <div className="font-semibold">Time Tracking Guide</div>
                <div className="text-xs text-muted-foreground">Clock-in/out documentation</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
            </Link>
          </div>
        </section>

        <Card className="border-muted bg-muted/50">
          <CardContent className="pt-6 text-base text-muted-foreground">
            <p><strong>Last updated:</strong> December 3, 2024 | <strong>Version:</strong> 1.0</p>
            <p className="mt-1">This document serves as the authoritative reference for Analytics & Reporting.</p>
          </CardContent>
        </Card>
      </div>
    </ChangelogGuideLayout>
  );
}
