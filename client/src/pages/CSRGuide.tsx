import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Star,
  Shield,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingDown,
  Building2,
  Users,
  Eye
} from "lucide-react";

export default function CSRGuide() {
  return (
    <ChangelogGuideLayout
      title="Company Safety Rating (CSR) Guide"
      version="1.0"
      lastUpdated="December 10, 2025"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Company Safety Rating (CSR) is a penalty-based compliance scoring system that starts at 100% and decreases based on safety compliance gaps. Property managers can view a company's CSR score to assess vendor reliability.
          </p>
          
          <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-100">Penalty-Based System</p>
                  <p className="text-base text-amber-800 dark:text-amber-200">
                    CSR starts at 100% and deducts points for missing or incomplete compliance items. The maximum total penalty is 80%, meaning the lowest possible score is 20%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-rust-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Penalty Categories</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-action-500" />
                    Documentation Penalty
                  </CardTitle>
                  <Badge className="bg-rust-100 text-rust-600 dark:bg-rust-600/20">Max 25%</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Deducted for missing essential company documents:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Certificate of Insurance (COI)</li>
                  <li>Health & Safety Manual</li>
                  <li>Company Policy document</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-warning-500" />
                    Toolbox Meeting Penalty
                  </CardTitle>
                  <Badge className="bg-rust-100 text-rust-600 dark:bg-rust-600/20">Max 25%</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Based on work session coverage ratio:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Work sessions must have a toolbox meeting within a 7-day window</li>
                  <li>7-day bidirectional coverage: 3 days before OR 3 days after</li>
                  <li>Penalty scales with the percentage of uncovered sessions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-success-500" />
                    Harness Inspection Penalty
                  </CardTitle>
                  <Badge className="bg-rust-100 text-rust-600 dark:bg-rust-600/20">Max 25%</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Based on inspection completion rate:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Each work session should have a corresponding harness inspection</li>
                  <li>Inspections can be completed before starting work</li>
                  <li>Penalty proportional to missing inspections</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-action-500" />
                    Document Review Penalty
                  </CardTitle>
                  <Badge className="bg-warning-100 text-warning-600 dark:bg-warning-600/20">Max 5%</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Unsigned employee acknowledgments for:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Health & Safety Manual</li>
                  <li>Company Policy</li>
                  <li>Safe Work Procedures</li>
                  <li>Safe Work Practices</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-neutral-50 dark:bg-neutral-900">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                    Project Completion
                  </CardTitle>
                  <Badge variant="secondary">Informational Only</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base">
                <p className="text-muted-foreground">
                  Project completion rates are tracked and displayed but do not affect the CSR score. This metric is for transparency and informational purposes only.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">CSR Visibility</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-violet-500" />
                  Property Manager View
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Overall CSR percentage displayed</li>
                  <li>Detailed breakdown by category</li>
                  <li>Color-coded progress bars</li>
                  <li>Access via "My Vendors" dashboard</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Company Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Real-time compliance status indicators</li>
                  <li>Quick actions to address gaps</li>
                  <li>Category-by-category breakdown</li>
                  <li>Trend tracking over time</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-warning-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Improving Your CSR</h2>
          </div>

          <Card className="bg-success-50 dark:bg-success-950 border-success-200 dark:border-success-800">
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-success-900 dark:text-success-100">Upload Required Documents</p>
                    <p className="text-base text-success-800 dark:text-success-200">
                      Ensure COI, Health & Safety Manual, and Company Policy are uploaded and current.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-success-900 dark:text-success-100">Complete Toolbox Meetings</p>
                    <p className="text-base text-success-800 dark:text-success-200">
                      Hold toolbox meetings within 3 days of work sessions to ensure coverage.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-success-900 dark:text-success-100">Require Harness Inspections</p>
                    <p className="text-base text-success-800 dark:text-success-200">
                      Ensure technicians complete harness inspections before starting work each day.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-success-900 dark:text-success-100">Employee Document Sign-Off</p>
                    <p className="text-base text-success-800 dark:text-success-200">
                      Have all employees acknowledge required safety documents through the Documents page.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
