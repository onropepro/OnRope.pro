import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import ChangelogLayout from "@/components/ChangelogLayout";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  CalendarDays,
  CalendarClock,
  UserCheck,
  Palmtree,
  Stethoscope,
  Heart,
  AlertTriangle,
  Info,
  GripVertical,
  Eye,
  Layers,
  RefreshCw,
  XCircle,
  Send,
  ThumbsUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SchedulingGuide() {
  const [, navigate] = useLocation();

  return (
    <ChangelogLayout title="Scheduling Guide">
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton to="/changelog" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Scheduling & Time-Off Guide</h1>
              <p className="text-xs text-muted-foreground">Calendar management and leave request workflows</p>
            </div>
          </div>
          <MainMenuButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        <section className="space-y-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2 mb-2">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              Scheduling System Overview
            </h2>
            <p className="text-muted-foreground">
              The Scheduling system provides a dual-calendar view for project assignments and employee availability, with integrated time-off management. Access it from the Schedule section in your dashboard.
            </p>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <AlertTriangle className="w-5 h-5" />
                The Golden Rule: Conflicts Block Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  One Employee = One Location at a Time
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>The system prevents scheduling conflicts automatically.</strong> It checks:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Existing Assignments</strong>: Already scheduled for another project</li>
                  <li><strong>Time-Off Requests</strong>: Approved vacation or sick leave</li>
                  <li><strong>Date Overlaps</strong>: Any overlap triggers a conflict warning</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Conflict Detection
                </p>
                <p className="mt-1">When you try to assign an employee who has a conflict, the system displays a warning with details about the existing assignment or time-off. You can still override if necessary.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Problems Solved */}
        <section className="space-y-4">
          <Card className="border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-green-900 dark:text-green-100">
                <CheckCircle2 className="w-5 h-5" />
                Problems Solved
              </CardTitle>
            </CardHeader>
            <CardContent className="text-green-900 dark:text-green-100">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Double-booking workers:</strong> Automatic conflict detection prevents assigning employees to overlapping projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Time-off visibility gaps:</strong> Approved leave requests block assignments for those dates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Resource planning blindspots:</strong> Dual calendar views show project timelines AND employee workloads</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Manual scheduling errors:</strong> Drag-and-drop interface with visual conflict warnings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Leave request chaos:</strong> Structured approval workflow with manager notification system</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Dual Calendar Views
          </h2>
          <p className="text-muted-foreground text-sm">
            The schedule page offers two complementary calendar views for different planning needs.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-action-600" />
                  Project Calendar
                </CardTitle>
                <CardDescription>View assignments by project</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>See all projects on timeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Color-coded by project type</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Click to view project details</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Month, week, and day views</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Resource Timeline
                </CardTitle>
                <CardDescription>View assignments by employee</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Each row = one employee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>See employee workload at a glance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Identify availability gaps</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Time-off shown inline</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <GripVertical className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Drag-and-Drop Assignment
          </h2>

          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Select Employee</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      From the employee list panel, click and hold on an employee name to start dragging.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Drop on Project/Date</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Drag the employee to the project calendar on the desired date. The system highlights valid drop zones.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Assignment Created</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Release to create the assignment. If conflicts exist, you'll see a warning with options to proceed or cancel.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Palmtree className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Time-Off Request Types
          </h2>
          <p className="text-muted-foreground text-sm">
            Employees can request various types of leave through the system.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Palmtree className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Vacation</h3>
                    <p className="text-xs text-muted-foreground">Planned time off</p>
                  </div>
                </div>
                <p className="text-base text-muted-foreground">
                  Pre-planned vacation days. Requires advance notice and manager approval.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Sick Leave</h3>
                    <p className="text-xs text-muted-foreground">Illness or injury</p>
                  </div>
                </div>
                <p className="text-base text-muted-foreground">
                  Unplanned absence due to illness. Can be submitted same-day.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center">
                    <CalendarClock className="w-5 h-5 text-action-600 dark:text-action-400" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Personal</h3>
                    <p className="text-xs text-muted-foreground">Personal matters</p>
                  </div>
                </div>
                <p className="text-base text-muted-foreground">
                  Personal appointments or obligations requiring time away.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Bereavement</h3>
                    <p className="text-xs text-muted-foreground">Loss of family member</p>
                  </div>
                </div>
                <p className="text-base text-muted-foreground">
                  Time off following the death of a family member or close friend.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold">Medical</h3>
                    <p className="text-xs text-muted-foreground">Medical appointments</p>
                  </div>
                </div>
                <p className="text-base text-muted-foreground">
                  Scheduled medical appointments, procedures, or treatments.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Time-Off Request Workflow
          </h2>

          <div className="space-y-4">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                      Employee Submits Request
                      <Send className="w-4 h-4 text-muted-foreground" />
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Employee selects leave type, date range, and optionally adds notes explaining the request.
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
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                      Request Pending Review
                      <Clock className="w-4 h-4 text-amber-500" />
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      The request enters pending status and appears in the manager's time-off queue. Managers receive notification of new requests.
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
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                      Manager Reviews Request
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manager checks scheduling conflicts, workload impact, and team coverage before making a decision.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-8">
              <div className="flex flex-col items-center">
                <ArrowRight className="w-5 h-5 text-emerald-500 rotate-[135deg]" />
                <span className="text-xs text-emerald-600 mt-1">Approve</span>
              </div>
              <div className="flex flex-col items-center">
                <ArrowRight className="w-5 h-5 text-red-500 rotate-45" />
                <span className="text-xs text-red-600 mt-1">Deny</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <ThumbsUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold text-emerald-900 dark:text-emerald-100">Approved</h3>
                      <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                        Time-off is added to calendar. Employee is blocked from scheduling during these dates.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold text-red-900 dark:text-red-100">Denied</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                        Employee is notified with reason. They can submit a modified request if desired.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Calendar Color Coding
          </h2>

          <Card className="bg-action-50 dark:bg-action-950 border-action-200 dark:border-action-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-action-600 dark:text-action-400 mt-0.5 shrink-0" />
                <div className="space-y-3 text-sm">
                  <p className="font-semibold text-action-900 dark:text-action-100">
                    Visual Identification System
                  </p>
                  <div className="space-y-2 text-action-800 dark:text-action-200">
                    <p>Projects are color-coded for quick identification:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><strong>Project Colors</strong>: Each project type has a consistent color across all views</li>
                      <li><strong>Time-Off</strong>: Displayed in a distinct color (typically gray or striped) to differentiate from work assignments</li>
                      <li><strong>Conflicts</strong>: Highlighted with warning indicators when overlaps are detected</li>
                    </ul>
                  </div>
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
                      <th className="text-left py-2 font-semibold">Employee Access</th>
                      <th className="text-left py-2 font-semibold">Manager Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2">View Calendar</td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Submit Time-Off Request</td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Approve/Deny Requests</td>
                      <td className="py-2"><Badge variant="secondary">No</Badge></td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Assign Employees to Projects</td>
                      <td className="py-2"><Badge variant="secondary">No</Badge></td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Resource Timeline View</td>
                      <td className="py-2"><Badge variant="secondary">Limited</Badge></td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Full</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Conflict Override</td>
                      <td className="py-2"><Badge variant="secondary">No</Badge></td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
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
    </ChangelogLayout>
  );
}
