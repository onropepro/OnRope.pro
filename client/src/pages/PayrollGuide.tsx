import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard,
  Clock,
  Calendar,
  Calculator,
  FileSpreadsheet,
  Settings,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  Users
} from "lucide-react";

export default function PayrollGuide() {
  return (
    <ChangelogGuideLayout
      title="Payroll & Financial Guide"
      version="1.0"
      lastUpdated="December 10, 2025"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Payroll & Financial module provides comprehensive timesheet generation and payroll processing capabilities. Work sessions are automatically aggregated into payroll-ready reports with configurable pay periods and overtime calculations.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Pay Period Configuration</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  Available Pay Periods
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Weekly</Badge>
                    <span className="text-muted-foreground text-sm">Every 7 days</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Bi-Weekly</Badge>
                    <span className="text-muted-foreground text-sm">Every 14 days</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Semi-Monthly</Badge>
                    <span className="text-muted-foreground text-sm">1st and 15th</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Monthly</Badge>
                    <span className="text-muted-foreground text-sm">Once per month</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  Timesheet Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Automatic aggregation from work sessions</li>
                  <li>Date range filtering</li>
                  <li>Employee-by-employee breakdown</li>
                  <li>Project attribution for each session</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-6 h-6 text-warning-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Overtime Calculation</h2>
          </div>

          <Card>
            <CardContent className="pt-4 text-base space-y-4">
              <p className="text-muted-foreground">
                Overtime is automatically calculated based on configurable thresholds:
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-muted p-3 rounded">
                  <p className="font-semibold text-sm mb-2">Daily Trigger (Default)</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Overtime after 8 hours per day</li>
                    <li>Configurable threshold</li>
                    <li>Standard 1.5x multiplier</li>
                  </ul>
                </div>
                
                <div className="bg-muted p-3 rounded">
                  <p className="font-semibold text-sm mb-2">Weekly Trigger (Optional)</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Overtime after 40 hours per week</li>
                    <li>Configurable threshold</li>
                    <li>Cumulative weekly tracking</li>
                  </ul>
                </div>
              </div>
              
              <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                <CardContent className="pt-3">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Overtime settings can be disabled entirely for companies that don't use overtime pay structures.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Hour Categorization</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success-500" />
                    Billable Hours
                  </CardTitle>
                  <Badge className="bg-success-100 text-success-600 dark:bg-success-600/20">Revenue-Generating</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base">
                <p className="text-muted-foreground">
                  Hours worked on client projects that can be billed. These are automatically tracked from work sessions linked to active projects.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning-500" />
                    Non-Billable Hours
                  </CardTitle>
                  <Badge className="bg-warning-100 text-warning-600 dark:bg-warning-600/20">Operational Cost</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  Hours that must be paid but cannot be billed to clients:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Travel time between sites</li>
                  <li>Equipment maintenance</li>
                  <li>Training and certifications</li>
                  <li>Administrative tasks</li>
                  <li>Weather delays</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <FileSpreadsheet className="w-6 h-6 text-success-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Timesheet Workflow</h2>
          </div>

          <Card>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-action-600">1</span>
                  </div>
                  <div>
                    <p className="font-semibold">Generation</p>
                    <p className="text-muted-foreground text-base">Timesheets are automatically generated from work session data for the selected pay period.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-action-600">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">Review</p>
                    <p className="text-muted-foreground text-base">Managers review timesheet details including regular hours, overtime, and project breakdown.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-action-600">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">Approval</p>
                    <p className="text-muted-foreground text-base">Authorized users approve timesheets for processing.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-success-600">4</span>
                  </div>
                  <div>
                    <p className="font-semibold">Export</p>
                    <p className="text-muted-foreground text-base">Approved timesheets can be exported for external payroll processing systems.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Export & Analytics</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Export Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>CSV export for payroll systems</li>
                  <li>PDF timesheet reports</li>
                  <li>Employee-level detail export</li>
                  <li>Project cost breakdown export</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Hours Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Billable vs non-billable ratio</li>
                  <li>Employee productivity metrics</li>
                  <li>Overtime trends over time</li>
                  <li>Project labor cost tracking</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">Permission Required</p>
                  <p className="text-base text-muted-foreground">
                    Access to payroll data requires the <code className="text-xs bg-muted px-1 py-0.5 rounded">canAccessFinancials</code> permission. Typically available to Company Owners and Operations Managers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
