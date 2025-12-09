import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import ChangelogLayout from "@/components/ChangelogLayout";
import {
  Clock,
  Play,
  Square,
  MapPin,
  Calendar,
  Timer,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  Users,
  BarChart3,
  FileText,
  ChevronRight,
  Shield,
  Compass,
  Target,
  Calculator,
  ClipboardCheck,
  Smartphone,
  Key
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TimeTrackingGuide() {
  const [, navigate] = useLocation();

  return (
    <ChangelogLayout title="Time Tracking Guide">
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton to="/changelog" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Work Session & Time Tracking Guide</h1>
              <p className="text-xs text-muted-foreground">Clock in/out, GPS tracking, and payroll integration</p>
            </div>
          </div>
          <MainMenuButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        <section className="space-y-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2 mb-2">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              Work Session Overview
            </h2>
            <p className="text-muted-foreground">
              Work sessions are the core time tracking mechanism. When an employee "starts their day" on a project, the system records their start time, location, and links the session to both the project and their payroll. At the end of the day, they log their work output and the session closes.
            </p>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Key className="w-5 h-5" />
                The Golden Rule: Inspection Before Work
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Harness Inspection Required Before Clock-In
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>When an employee clicks "Start Day", they see three options:</strong></p>
                <div className="space-y-2 ml-2 mt-2">
                  <div className="flex items-start gap-2">
                    <Badge variant="default" className="shrink-0 mt-0.5">Yes</Badge>
                    <span>Confirms inspection is complete. Proceeds to start work session.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="destructive" className="shrink-0 mt-0.5">No</Badge>
                    <span>Redirected to complete harness inspection form first.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0 mt-0.5 border-amber-600 text-amber-900 dark:text-amber-100">Not Applicable</Badge>
                    <span>For non-rope-access work (ground tasks, office work, equipment transport). Records N/A status and proceeds.</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Honor System with Auditing
                </p>
                <p className="mt-1">Employees can select "Yes" even without completing an inspection, but the system knows. The inspection database is checked independently, and any discrepancy (claiming "Yes" without a matching inspection record) is reflected in the Company Safety Rating (CSR). Honest employees build trust. Dishonest answers create an audit trail that affects company compliance scores visible to property managers.</p>
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
                  <span><strong>Inaccurate time records:</strong> GPS-verified clock-in/out with precise timestamps eliminates timesheet fraud</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Manual hour calculations:</strong> Automatic billable vs non-billable hour tracking for payroll accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Piece work complexity:</strong> Integrated drop tracking feeds directly into technician compensation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Missing work output data:</strong> End-of-day forms capture drops, units, or completion percentages by job type</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>No visibility into active workers:</strong> Real-time dashboard shows who is currently working on which projects</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Play className="w-5 h-5 text-green-600 dark:text-green-400" />
            Starting a Work Session (Clock In)
          </h2>

          <Card>
            <CardContent className="pt-6 text-sm space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="font-semibold">What Happens:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Employee opens project on Dashboard</li>
                    <li>Clicks "Start Day" button</li>
                    <li>System checks for today's harness inspection</li>
                    <li>If passed, GPS location is captured</li>
                    <li>Session record created with start time</li>
                    <li>Employee status changes to "Active"</li>
                  </ol>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold">Data Captured:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Clock className="w-4 h-4 text-action-600" />
                      <div>
                        <p className="font-medium text-xs">Start Time</p>
                        <p className="text-xs text-muted-foreground">Precise timestamp</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <div>
                        <p className="font-medium text-xs">GPS Coordinates</p>
                        <p className="text-xs text-muted-foreground">Latitude & longitude</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="font-medium text-xs">Work Date</p>
                        <p className="text-xs text-muted-foreground">Local date (user's timezone)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                <p className="flex items-center gap-2 font-semibold text-xs">
                  <Smartphone className="w-4 h-4" />
                  Location Permission
                </p>
                <p className="text-xs mt-1 text-muted-foreground">The app requests GPS permission. If denied, the session still starts but location won't be tracked. A warning toast is shown.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Square className="w-5 h-5 text-red-600 dark:text-red-400" />
            Ending a Work Session (Clock Out)
          </h2>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-action-600">Drop-Based Jobs</Badge>
                  <CardTitle className="text-base">End Day Form</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">For window cleaning, building wash, and similar jobs:</p>
                
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-muted p-2 rounded">
                    <Compass className="w-4 h-4 mx-auto mb-1" />
                    <p className="text-xs font-bold">North</p>
                    <p className="text-xs text-muted-foreground">Drops done</p>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <Compass className="w-4 h-4 mx-auto mb-1 rotate-90" />
                    <p className="text-xs font-bold">East</p>
                    <p className="text-xs text-muted-foreground">Drops done</p>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <Compass className="w-4 h-4 mx-auto mb-1 rotate-180" />
                    <p className="text-xs font-bold">South</p>
                    <p className="text-xs text-muted-foreground">Drops done</p>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <Compass className="w-4 h-4 mx-auto mb-1 -rotate-90" />
                    <p className="text-xs font-bold">West</p>
                    <p className="text-xs text-muted-foreground">Drops done</p>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950 p-2 rounded text-xs">
                  <p className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <strong>Shortfall Reason:</strong> If total drops are less than daily target, a reason is required.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">Hours-Based Jobs</Badge>
                  <CardTitle className="text-base">End Day Form</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">For general pressure washing, ground windows, painting:</p>
                
                <div className="bg-muted p-4 rounded text-center">
                  <p className="text-xs text-muted-foreground mb-2">How much of the job did you complete today?</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-20 h-10 bg-white dark:bg-green-900 rounded flex items-center justify-center border">
                      <span className="text-lg font-mono">25</span>
                    </div>
                    <span className="text-lg">%</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">This percentage contributes to overall project completion tracking.</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Data Captured at Clock Out</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-2 bg-muted rounded text-center">
                  <Clock className="w-4 h-4 mx-auto mb-1" />
                  <p className="text-xs font-semibold">End Time</p>
                </div>
                <div className="p-2 bg-muted rounded text-center">
                  <MapPin className="w-4 h-4 mx-auto mb-1" />
                  <p className="text-xs font-semibold">End Location</p>
                </div>
                <div className="p-2 bg-muted rounded text-center">
                  <Target className="w-4 h-4 mx-auto mb-1" />
                  <p className="text-xs font-semibold">Work Output</p>
                </div>
                <div className="p-2 bg-muted rounded text-center">
                  <Calculator className="w-4 h-4 mx-auto mb-1" />
                  <p className="text-xs font-semibold">Hours Calc</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Hours Calculation & Overtime
          </h2>

          <Card className="border-2 border-purple-200 dark:border-purple-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Timer className="w-4 h-4 text-purple-600" />
                Automatic Overtime Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p className="text-muted-foreground">When a session ends, the system automatically calculates hours breakdown based on company settings:</p>
              
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded text-center">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">8h</p>
                  <p className="text-xs font-semibold">Regular Hours</p>
                  <p className="text-xs text-muted-foreground">First 8 hours daily</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded text-center">
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">1.5x</p>
                  <p className="text-xs font-semibold">Overtime Hours</p>
                  <p className="text-xs text-muted-foreground">Hours 8-12</p>
                </div>
                <div className="bg-red-50 dark:bg-red-950 p-3 rounded text-center">
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">2x</p>
                  <p className="text-xs font-semibold">Double Time</p>
                  <p className="text-xs text-muted-foreground">Hours 12+</p>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded">
                <p className="font-semibold text-xs">Example Calculation:</p>
                <p className="text-xs mt-1">10-hour shift = 8 regular + 2 overtime</p>
                <p className="text-xs">14-hour shift = 8 regular + 4 overtime + 2 double time</p>
              </div>

              <div className="bg-muted p-2 rounded text-xs">
                <strong>Note:</strong> These thresholds are configurable per company in settings.
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            Payroll Integration
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Hourly Employees</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="bg-muted p-3 rounded space-y-2">
                  <p className="font-mono text-xs">
                    Pay = (Regular × Rate) + (OT × Rate × 1.5) + (DT × Rate × 2)
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Each session's hours are summed by type</li>
                  <li>Rate pulled from employee profile</li>
                  <li>Payroll page shows detailed breakdown</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Peace Work Projects</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="bg-muted p-3 rounded space-y-2">
                  <p className="font-mono text-xs">
                    Pay = Total Drops × Price Per Drop
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Enabled per-project in settings</li>
                  <li>Hours still tracked for records</li>
                  <li>Payment based on output, not time</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-4 text-sm text-amber-900 dark:text-amber-100">
              <p className="flex items-center gap-2 font-semibold">
                <Info className="w-4 h-4" />
                Billable vs Non-Billable
              </p>
              <p className="mt-1">Sessions can be marked as non-billable (for training, meetings, travel, etc.). Non-billable hours appear in a separate section and don't count toward project labor costs, but they're still tracked for payroll.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-action-600 dark:text-action-400" />
            Active Workers Tracking
          </h2>

          <Card>
            <CardContent className="pt-6 text-sm space-y-4">
              <p className="text-muted-foreground">Managers can see who's currently working in real-time:</p>
              
              <div className="bg-muted p-4 rounded space-y-3">
                <div className="flex items-center justify-between p-2 bg-background rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-medium text-xs">John Smith</span>
                    <Badge variant="outline" className="text-xs">Rope Access Tech</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Started 9:15 AM
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-background rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-medium text-xs">Sarah Johnson</span>
                    <Badge variant="outline" className="text-xs">Supervisor</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Started 8:45 AM
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold text-xs">Features:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Real-time status updates</li>
                    <li>Click to see GPS location</li>
                    <li>View session start time</li>
                    <li>Filter by project</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-xs">Access:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Company owners: All workers</li>
                    <li>Ops managers: All workers</li>
                    <li>Supervisors: Their team</li>
                    <li>Technicians: Not accessible</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            IRATA Hours Logging
          </h2>

          <Card className="border-2 border-teal-200 dark:border-teal-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Certification Progression Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p className="text-muted-foreground">After ending a work session, technicians are prompted to log their IRATA task hours for certification progression:</p>
              
              <div className="bg-teal-50 dark:bg-teal-950 p-3 rounded space-y-2">
                <p className="font-semibold text-xs">Task Categories:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-background rounded">Rigging & anchor work</div>
                  <div className="p-2 bg-background rounded">Rope access work</div>
                  <div className="p-2 bg-background rounded">Rescue practice</div>
                  <div className="p-2 bg-background rounded">Equipment inspection</div>
                </div>
              </div>

              <div className="bg-muted p-3 rounded">
                <p className="font-semibold text-xs">How It Works:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs mt-2">
                  <li>End work session normally</li>
                  <li>Prompt appears: "Log your IRATA hours?"</li>
                  <li>Enter hours by task category</li>
                  <li>Hours accumulated in personal profile</li>
                  <li>View total logged hours in "My Logged Hours" page</li>
                </ol>
              </div>

              <p className="text-xs text-muted-foreground">This data helps technicians track their progression toward IRATA Level 2 or Level 3 certification requirements.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Session Editing (Manager Override)
          </h2>

          <Card>
            <CardContent className="pt-6 text-sm space-y-4">
              <p className="text-muted-foreground">Users with financial permission can edit completed sessions:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold text-xs">Editable Fields:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Start time</li>
                    <li>End time</li>
                    <li>Drops completed (per elevation)</li>
                    <li>Completion percentage</li>
                    <li>Billable status</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-xs">Auto-Recalculated:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Total hours worked</li>
                    <li>Overtime breakdown</li>
                    <li>Peace work pay (if applicable)</li>
                    <li>Payroll amounts</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-950 p-3 rounded">
                <p className="flex items-center gap-2 font-semibold text-xs text-red-900 dark:text-red-100">
                  <Shield className="w-4 h-4" />
                  Required Permission: view_financial_data
                </p>
                <p className="text-xs mt-1 text-red-800 dark:text-red-200">Session editing is restricted to prevent unauthorized payroll modifications.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Session Workflow Summary
          </h2>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-x-auto pb-2">
            <div className="flex flex-col items-center min-w-[90px]">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-xs font-semibold text-center">Harness Check</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center min-w-[90px]">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs font-semibold text-center">Start Day</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center min-w-[90px]">
              <div className="w-12 h-12 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-action-600" />
              </div>
              <p className="text-xs font-semibold text-center">Work Session</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center min-w-[90px]">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-2">
                <Square className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-xs font-semibold text-center">End Day</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center min-w-[90px]">
              <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-2">
                <ClipboardCheck className="w-6 h-6 text-teal-600" />
              </div>
              <p className="text-xs font-semibold text-center">Log IRATA</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center min-w-[90px]">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs font-semibold text-center">Payroll</p>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Quick Reference: Session Data Fields
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left font-semibold">Field</th>
                  <th className="p-3 text-left font-semibold">Description</th>
                  <th className="p-3 text-center font-semibold">Required</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3 font-mono text-xs">startTime</td>
                  <td className="p-3 text-xs">Timestamp when session began</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3 font-mono text-xs">endTime</td>
                  <td className="p-3 text-xs">Timestamp when session ended</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-mono text-xs">startLatitude/Longitude</td>
                  <td className="p-3 text-xs">GPS coordinates at clock-in</td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-muted-foreground mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3 font-mono text-xs">endLatitude/Longitude</td>
                  <td className="p-3 text-xs">GPS coordinates at clock-out</td>
                  <td className="p-3 text-center"><XCircle className="w-4 h-4 text-muted-foreground mx-auto" /></td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-mono text-xs">dropsCompleted*</td>
                  <td className="p-3 text-xs">N/E/S/W drop counts (drop-based jobs)</td>
                  <td className="p-3 text-center">Job type</td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3 font-mono text-xs">manualCompletionPercentage</td>
                  <td className="p-3 text-xs">0-100% (hours-based jobs)</td>
                  <td className="p-3 text-center">Job type</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-mono text-xs">regularHours</td>
                  <td className="p-3 text-xs">Auto-calculated regular hours</td>
                  <td className="p-3 text-center">Auto</td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3 font-mono text-xs">overtimeHours</td>
                  <td className="p-3 text-xs">Auto-calculated OT hours</td>
                  <td className="p-3 text-center">Auto</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-mono text-xs">doubleTimeHours</td>
                  <td className="p-3 text-xs">Auto-calculated 2x hours</td>
                  <td className="p-3 text-center">Auto</td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3 font-mono text-xs">shortfallReason</td>
                  <td className="p-3 text-xs">Why target wasn't met</td>
                  <td className="p-3 text-center">If below target</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="pt-8">
          <Button 
            onClick={() => navigate("/changelog")}
            variant="outline"
            className="w-full"
            data-testid="button-back-to-changelog"
          >
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Knowledge Base
          </Button>
        </div>
      </main>
      </div>
    </ChangelogLayout>
  );
}
