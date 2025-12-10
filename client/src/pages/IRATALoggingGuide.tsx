import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  UserCheck,
  Award,
  Timer,
  ListChecks,
  FileText,
  TrendingUp,
  Calendar,
  Plus,
  History,
  Target,
  AlertTriangle,
  Info,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IRATALoggingGuide() {
  return (
    <ChangelogGuideLayout 
      title="IRATA Task Logging Guide"
      version="2.0"
      lastUpdated="December 5, 2025"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The IRATA Task Logging System allows rope access technicians to track their work hours against specific task types for certification progression. Hours are automatically captured from work sessions and can be categorized by the type of rope access work performed.
          </p>
        </section>

        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Award className="w-5 h-5" />
                The Golden Rule: Hours Build Your IRATA Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Total Hours = Baseline + Logged Sessions
                </p>
              </div>
              
              <div className="space-y-2 text-base">
                <p><strong>Your IRATA hours accumulate automatically.</strong> The system tracks:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Baseline Hours</strong>: Pre-existing logbook hours you enter manually</li>
                  <li><strong>Session Hours</strong>: Hours automatically logged from completed work sessions</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  IRATA Technicians Only
                </p>
                <p className="mt-1">The task logging prompt only appears for employees with IRATA certification tracking enabled. After ending a work session, you'll be prompted to categorize your hours.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Baseline Entry</p>
                  <p className="font-bold">Pre-existing Hours</p>
                  <p className="text-lg font-mono">500 hrs</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">New Sessions</p>
                  <p className="font-bold">Logged This Month</p>
                  <p className="text-lg font-mono">+45 hrs</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-bold">Career Hours</p>
                  <p className="text-lg font-mono text-green-700 dark:text-green-300">545 hrs</p>
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
                  <span><strong>Paper logbook management:</strong> Digital IRATA hours tracking replaces error-prone physical logbooks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Certification progression tracking:</strong> Automatic hour accumulation shows progress toward next IRATA level</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Task categorization gaps:</strong> Standardized 20+ rope access task types ensure proper hour classification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Lost pre-existing hours:</strong> Baseline entry allows importing historical logbook hours into the system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Assessment preparation:</strong> Complete hour history available instantly for IRATA level assessments</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Rope Access Task Types
          </h2>
          <p className="text-muted-foreground text-sm">
            The system includes 20+ canonical rope access task types recognized in the industry.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-action-600 dark:text-action-400" />
                  Movement & Positioning
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Ascending</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Descending</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Rope Transfer</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Deviation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Re-anchor</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Aid Climbing</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-600" />
                  Rigging & Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Rigging</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Anchor Systems</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Rope Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Equipment Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Hauling Systems</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-600" />
                  Rescue & Emergency
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Rescue Techniques</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Casualty Handling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>First Aid at Height</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Self-Rescue</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  Work Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Window Cleaning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Painting/Coating</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Inspection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Installation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Maintenance</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Timer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            How Task Logging Works
          </h2>

          <div className="space-y-4">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Complete Your Work Session</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Clock in, perform your rope access work, and end your session normally through the standard workflow.
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
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Task Selection Dialog Appears</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      After ending your session, a dialog prompts you to select which rope access tasks you performed. This only appears for IRATA-certified technicians.
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
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Select Tasks & Allocate Hours</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose the task types you performed and distribute your session hours across them. The system validates that hours don't exceed the session duration.
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
                    4
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Hours Added to Your Portfolio</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your logged hours are automatically added to your IRATA portfolio. View your complete history on the "My Logged Hours" page.
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
            <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            My Logged Hours Page
          </h2>
          <p className="text-muted-foreground text-sm">
            Access your complete IRATA hours history from your Profile page.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold">Statistics Overview</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span>Total accumulated hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>Hours by month breakdown</span>
                </div>
                <div className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-purple-500" />
                  <span>Hours by task type</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold">History Features</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span>Full session history with details</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-500" />
                  <span>Filter by task type</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>Date range filtering</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Baseline Hours Entry
          </h2>

          <Card className="bg-action-50 dark:bg-action-950 border-action-200 dark:border-action-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-action-600 dark:text-action-400 mt-0.5 shrink-0" />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-action-900 dark:text-action-100">
                    Already Have IRATA Experience?
                  </p>
                  <p className="text-action-800 dark:text-action-200">
                    If you have pre-existing hours in your IRATA logbook from previous employment, you can enter these as baseline hours. This ensures your total portfolio reflects your complete career experience.
                  </p>
                  <p className="text-action-800 dark:text-action-200">
                    Access baseline hour entry from the "My Logged Hours" page. Once entered, these hours combine with your new logged sessions for accurate certification tracking.
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
                      <th className="text-left py-2 font-semibold">Feature</th>
                      <th className="text-left py-2 font-semibold">Description</th>
                      <th className="text-left py-2 font-semibold">Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2">Task Selection</td>
                      <td className="py-2 text-muted-foreground">Choose task types after ending session</td>
                      <td className="py-2"><Badge variant="outline">IRATA Techs</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">My Logged Hours</td>
                      <td className="py-2 text-muted-foreground">View complete hours history</td>
                      <td className="py-2"><Badge variant="outline">Profile Page</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Baseline Entry</td>
                      <td className="py-2 text-muted-foreground">Add pre-existing logbook hours</td>
                      <td className="py-2"><Badge variant="outline">My Logged Hours</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Statistics</td>
                      <td className="py-2 text-muted-foreground">Hours breakdown by task/month</td>
                      <td className="py-2"><Badge variant="outline">My Logged Hours</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Task Types</td>
                      <td className="py-2 text-muted-foreground">20+ canonical rope access tasks</td>
                      <td className="py-2"><Badge variant="outline">System Defined</Badge></td>
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
