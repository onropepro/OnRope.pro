import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Users,
  ChevronRight,
  ArrowRight,
  Lock,
  Eye,
  AlertTriangle,
  Info,
  Package,
  ClipboardCheck,
  Calendar,
  PenTool,
  Building2,
  Gauge,
  Download,
  HardHat,
  Activity,
  XCircle,
  CircleDot,
  Target,
  UserCheck,
  Zap,
  Calculator
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SafetyGuide() {
  const [, navigate] = useLocation();

  return (
    <ChangelogLayout title="Safety Guide">
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton to="/changelog" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Safety & Compliance Guide</h1>
              <p className="text-xs text-muted-foreground">Complete documentation for safety systems</p>
            </div>
          </div>
          <MainMenuButton />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Overview */}
        <section className="space-y-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2 mb-2">
              <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              Safety & Compliance Overview
            </h2>
            <p className="text-muted-foreground">
              The Safety & Compliance system ensures all rope access work is documented, inspected, and compliant with IRATA, OSHA, and industry regulations. It provides <strong>digital capture of safety documentation</strong>, legally-binding digital signatures, professional PDF generation, and feeds into the <strong>Company Safety Rating (CSR)</strong> visible to property managers.
            </p>
          </div>
        </section>

        <Separator />

        {/* THE GOLDEN RULE */}
        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <AlertTriangle className="w-5 h-5" />
                The Golden Rule: No Inspection, No Work
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Harness Inspection Required Before Starting Work Session
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>This rule is absolute.</strong> When a technician clicks "Start Day" on any project:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>System checks: Has this employee completed a harness inspection <strong>today</strong>?</li>
                  <li>If <strong>NO</strong>: Redirected to complete harness inspection first</li>
                  <li>If <strong>YES</strong>: Work session can proceed</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Safety Critical
                </p>
                <p className="mt-1">This is a <strong>hard gate</strong> - not a warning. Workers physically cannot start clocking time without a valid inspection for the current date. This protects workers and ensures compliance.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <HardHat className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                  <p className="font-bold">Step 1</p>
                  <p className="text-xs">Complete Harness Inspection</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center flex flex-col items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-amber-600 mb-2" />
                  <p className="text-xs">Then...</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="font-bold">Step 2</p>
                  <p className="text-xs">Start Work Session</p>
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
                  <span><strong>Skipped safety checks:</strong> Hard gate enforcement ensures no one can start work without completing daily harness inspections</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Paper-based documentation:</strong> Digital forms with legally-binding signatures replace error-prone paper records</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Compliance tracking gaps:</strong> Company Safety Rating (CSR) provides real-time visibility into safety compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Incident report delays:</strong> Mobile-first incident reporting captures details immediately on site</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Client audit requests:</strong> Professional PDF exports available instantly for IRATA, OSHA, and insurance requirements</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* TWO ENTRY POINTS - Critical Architecture */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Two Entry Points: Understanding the Dual-Path System
          </h2>
          <p className="text-base text-muted-foreground">
            Safety compliance is tracked through <strong>two distinct pathways</strong> that both impact your Company Safety Rating. Understanding where to go for each task is critical.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Equipment Path */}
            <Card className="border-2 border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Package className="w-6 h-6 text-purple-600" />
                  <CardTitle className="text-xl md:text-2xl font-semibold text-purple-900 dark:text-purple-100">
                    Path A: Equipment Area
                  </CardTitle>
                </div>
                <CardDescription className="text-purple-800 dark:text-purple-200">
                  Physical gear inspection before work
                </CardDescription>
              </CardHeader>
              <CardContent className="text-base text-purple-900 dark:text-purple-100 space-y-3">
                <div className="bg-purple-100 dark:bg-purple-800 rounded p-2">
                  <p className="font-semibold">What happens here:</p>
                  <p className="text-xs mt-1">Harness Inspections</p>
                </div>
                <ul className="list-disc list-inside space-y-1 text-base">
                  <li>Triggered when starting work session</li>
                  <li>Links to your assigned personal gear kit</li>
                  <li>Inspects 11 equipment categories</li>
                  <li>Single technician signature</li>
                </ul>
                <div className="flex items-center gap-2 text-xs bg-white dark:bg-purple-900 p-2 rounded">
                  <Gauge className="w-4 h-4" />
                  <span><strong>CSR Impact:</strong> 25% penalty if inspections missing</span>
                </div>
              </CardContent>
            </Card>

            {/* Documentation Path */}
            <Card className="border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-action-600" />
                  <CardTitle className="text-xl md:text-2xl font-semibold text-action-900 dark:text-action-100">
                    Path B: Safety Forms Section
                  </CardTitle>
                </div>
                <CardDescription className="text-blue-800 dark:text-blue-200">
                  Team documentation and hazard assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="text-base text-blue-900 dark:text-blue-100 space-y-3">
                <div className="bg-blue-100 dark:bg-blue-800 rounded p-2">
                  <p className="font-semibold">What happens here:</p>
                  <p className="text-xs mt-1">Toolbox Meetings, FLHA, Incidents, Method Statements</p>
                </div>
                <ul className="list-disc list-inside space-y-1 text-base">
                  <li>Team safety briefings with all attendee signatures</li>
                  <li>Field-level hazard assessments</li>
                  <li>Incident reporting and investigation</li>
                  <li>Safe work procedure documentation</li>
                </ul>
                <div className="flex items-center gap-2 text-xs bg-white dark:bg-blue-900 p-2 rounded">
                  <Gauge className="w-4 h-4" />
                  <span><strong>CSR Impact:</strong> 25% penalty for uncovered work sessions</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-4 text-base text-amber-900 dark:text-amber-100">
              <p className="flex items-center gap-2 font-semibold">
                <Info className="w-4 h-4" />
                Why Two Paths?
              </p>
              <p className="mt-1">Equipment inspections are <strong>individual</strong> (each tech inspects their own gear) and tied to the moment before work begins. Safety documentation is often <strong>team-based</strong> (one meeting covers multiple workers) and can be completed before, during, or after work sessions.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* 7-Day Coverage Window */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            The 7-Day Toolbox Meeting Coverage Window
          </h2>
          
          <Card className="border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950">
            <CardContent className="pt-6 text-emerald-900 dark:text-emerald-100 space-y-4">
              <div className="bg-white dark:bg-emerald-900 rounded-lg p-4 text-center">
                <p className="text-xl font-mono font-bold">
                  One Meeting Covers Work Within 7 Days (Either Direction)
                </p>
              </div>

              <div className="text-sm space-y-2">
                <p>A toolbox meeting on <strong>Monday, Dec 2</strong> covers all work sessions from:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">Nov 25</Badge>
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">Nov 26</Badge>
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">Nov 27</Badge>
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">Nov 28</Badge>
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">Nov 29</Badge>
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">Nov 30</Badge>
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">Dec 1</Badge>
                  <Badge className="bg-emerald-600">Dec 2 (Meeting)</Badge>
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">Dec 3</Badge>
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">Dec 4</Badge>
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">Dec 5</Badge>
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">Dec 6</Badge>
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">Dec 7</Badge>
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">Dec 8</Badge>
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800">Dec 9</Badge>
                </div>
              </div>

              <div className="bg-emerald-100 dark:bg-emerald-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Practical Implication
                </p>
                <p className="mt-1">Hold a toolbox meeting at the start of a project, and all work sessions for the next 7 days are automatically covered. A meeting can even be held <em>after</em> work sessions and still provide retroactive coverage (within the 7-day window).</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Five Safety Document Types */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Five Safety Document Types
          </h2>
          <p className="text-base text-muted-foreground">Each document type serves a specific purpose in the safety workflow:</p>

          <div className="space-y-3">
            {/* Harness Inspection */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">
                    <HardHat className="w-5 h-5 text-red-600" />
                    1. Harness Inspection
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="destructive">Required Daily</Badge>
                    <Badge variant="outline">Work Blocker</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p><strong>Purpose:</strong> Pre-work verification of personal protective equipment condition.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>11 Equipment Categories:</strong></p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">Harness</Badge>
                    <Badge variant="secondary">Helmet</Badge>
                    <Badge variant="secondary">Descender</Badge>
                    <Badge variant="secondary">Ascender</Badge>
                    <Badge variant="secondary">Chest Ascender</Badge>
                    <Badge variant="secondary">Working Rope</Badge>
                    <Badge variant="secondary">Safety Rope</Badge>
                    <Badge variant="secondary">Anchors</Badge>
                    <Badge variant="secondary">Connectors</Badge>
                    <Badge variant="secondary">Lanyards</Badge>
                    <Badge variant="secondary">Backup Device</Badge>
                  </div>
                </div>
                <p><strong>Signature:</strong> Single technician (inspector)</p>
                <p><strong>CSR Impact:</strong> 25% maximum penalty for missing inspections</p>
              </CardContent>
            </Card>

            {/* Toolbox Meeting */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-action-600" />
                    2. Toolbox Meeting
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className="bg-action-600">Team Document</Badge>
                    <Badge variant="outline">7-Day Coverage</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p><strong>Purpose:</strong> Pre-work safety briefing covering hazards, procedures, and emergency plans.</p>
                <div className="bg-muted p-3 rounded text-sm">
                  <p><strong>Key Fields:</strong> Meeting topic, safety topics discussed, attendee list, signatures from all attendees</p>
                </div>
                <p><strong>Signature:</strong> All attendees must sign (enforced by system)</p>
                <p><strong>CSR Impact:</strong> 25% maximum penalty for uncovered work sessions</p>
              </CardContent>
            </Card>

            {/* FLHA */}
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    3. FLHA (Field Level Hazard Assessment)
                  </CardTitle>
                  <Badge variant="outline">Optional</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p><strong>Purpose:</strong> Site-specific hazard identification and control measures before work begins.</p>
                <div className="bg-muted p-3 rounded text-sm">
                  <p><strong>Key Fields:</strong> Location, work description, identified hazards, control measures, weather conditions</p>
                </div>
                <p><strong>Signature:</strong> Assessor signature required</p>
                <p><strong>CSR Impact:</strong> Does not directly impact CSR (best practice documentation)</p>
              </CardContent>
            </Card>

            {/* Incident Report */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-purple-600" />
                    4. Incident Report
                  </CardTitle>
                  <Badge variant="outline">As Needed</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p><strong>Purpose:</strong> Documentation of safety incidents, near-misses, injuries, or property damage.</p>
                <div className="bg-muted p-3 rounded text-sm">
                  <p><strong>Key Fields:</strong> Incident type, severity, injured persons, witnesses, root cause analysis, corrective actions, regulatory reporting</p>
                </div>
                <p><strong>Signature:</strong> Reporter, supervisor, and management signatures supported</p>
                <p><strong>CSR Impact:</strong> Incident history visible in CSR breakdown</p>
              </CardContent>
            </Card>

            {/* Method Statement */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-green-600" />
                    5. Method Statement
                  </CardTitle>
                  <Badge variant="outline">As Needed</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p><strong>Purpose:</strong> Detailed safe work procedures for specific tasks or projects.</p>
                <div className="bg-muted p-3 rounded text-sm">
                  <p><strong>Key Fields:</strong> Work description, step-by-step procedures, equipment required, safety measures, emergency procedures</p>
                </div>
                <p><strong>Signature:</strong> Author and approver signatures</p>
                <p><strong>CSR Impact:</strong> Does not directly impact CSR (planning documentation)</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* CSR Breakdown */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Gauge className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Company Safety Rating (CSR) Breakdown
          </h2>
          <p className="text-base text-muted-foreground">
            The CSR is a penalty-based rating visible to property managers. Starting at 100%, penalties reduce the score based on compliance gaps.
          </p>

          <Card className="border-2 border-cyan-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl font-semibold text-center">CSR Calculation Formula</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-xl font-mono font-bold">
                  CSR = 100% - (Penalties)
                </p>
                <p className="text-sm text-muted-foreground mt-2">Maximum penalty: 80% (minimum score: 20%)</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Penalty Components:</h4>
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium">Company Documentation</span>
                    </div>
                    <Badge variant="destructive">Up to 25%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Missing Certificate of Insurance, Health & Safety Manual, or Company Policy</p>

                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-action-600" />
                      <span className="text-sm font-medium">Toolbox Meeting Coverage</span>
                    </div>
                    <Badge className="bg-action-600">Up to 25%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Work sessions without meeting coverage within 7-day window</p>

                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2">
                      <HardHat className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Harness Inspections</span>
                    </div>
                    <Badge className="bg-purple-600">Up to 25%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Work sessions without valid same-day harness inspection</p>

                  <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium">Document Reviews</span>
                    </div>
                    <Badge className="bg-amber-600">Up to 5%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Employee document acknowledgments pending signature</p>
                </div>
              </div>

              <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
                <CardContent className="pt-4 text-base text-amber-900 dark:text-amber-100">
                  <p className="flex items-center gap-2 font-semibold">
                    <Building2 className="w-4 h-4" />
                    Property Manager Visibility
                  </p>
                  <p className="mt-1">Property managers can view your company's CSR score with a detailed breakdown. This transparency builds trust and demonstrates your commitment to safety compliance.</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Digital Signatures */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <PenTool className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Digital Signature System
          </h2>

          <div className="space-y-3">
            <Card>
              <CardContent className="pt-4 text-base space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Legally Binding</p>
                    <p className="text-muted-foreground">All signatures are captured as base64 data URLs with timestamps, creating an immutable audit trail.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Immutable Once Signed</p>
                    <p className="text-muted-foreground">Once a safety document is signed and submitted, it cannot be modified. This ensures compliance integrity.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-action-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">PDF Generation</p>
                    <p className="text-muted-foreground">All safety documents can be exported as professional PDFs with embedded signatures for audit purposes.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
              <CardContent className="pt-4 text-base text-red-900 dark:text-red-100">
                <p className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  Toolbox Meeting Signature Enforcement
                </p>
                <p className="mt-1">All selected attendees for a toolbox meeting <strong>must sign</strong> before submission. The system validates that every attendee ID has a corresponding signature. Missing signatures block form submission.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Step-by-Step Workflows */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Step-by-Step Workflows
          </h2>

          <div className="space-y-4">
            {/* Workflow 1: Complete Harness Inspection */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600">Workflow 1</Badge>
                    <CardTitle>Complete Harness Inspection (Daily)</CardTitle>
                  </div>
                  <Badge variant="outline">Required</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Go to <strong>Dashboard</strong> and click <strong>Start Day</strong> on a project</li>
                  <li>If no inspection today, system shows harness inspection prompt</li>
                  <li>Select your <strong>Personal Kit</strong> (if you have assigned gear)</li>
                  <li>For each equipment category, mark as:
                    <ul className="list-disc list-inside ml-4 mt-1 text-muted-foreground">
                      <li><span className="text-green-600">Pass</span> - Equipment in good condition</li>
                      <li><span className="text-amber-600">N/A</span> - Not applicable or not using</li>
                      <li><span className="text-red-600">Fail</span> - Equipment needs attention</li>
                    </ul>
                  </li>
                  <li>Add notes for any concerns or failed items</li>
                  <li>Provide your <strong>digital signature</strong></li>
                  <li>Click <strong>Submit Inspection</strong></li>
                </ol>
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Result:</strong> Inspection saved. You can now start work sessions for the rest of the day.
                </div>
              </CardContent>
            </Card>

            {/* Workflow 2: Create Toolbox Meeting */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600">Workflow 2</Badge>
                    <CardTitle>Create Toolbox Meeting</CardTitle>
                  </div>
                  <Badge variant="outline">Covers 7 Days</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Navigate to <strong>Toolbox Meeting</strong> page (or project page safety button)</li>
                  <li>Select the <strong>Project</strong> this meeting covers</li>
                  <li>Enter <strong>Meeting Topic</strong> and <strong>Safety Topics Discussed</strong></li>
                  <li>Select all <strong>Attendees</strong> who are present</li>
                  <li>Have each attendee provide their <strong>digital signature</strong></li>
                  <li>Verify all attendees have signed (system will block if missing)</li>
                  <li>Click <strong>Submit Meeting</strong></li>
                </ol>
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Result:</strong> Meeting saved. All work sessions within 7 days (before and after) are now covered for this project.
                </div>
              </CardContent>
            </Card>

            {/* Workflow 3: Submit FLHA */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-600">Workflow 3</Badge>
                    <CardTitle>Submit FLHA Form</CardTitle>
                  </div>
                  <Badge variant="outline">Best Practice</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Navigate to <strong>FLHA Form</strong> page</li>
                  <li>Select the <strong>Project</strong> and <strong>Location</strong></li>
                  <li>Describe the <strong>Work to be Performed</strong></li>
                  <li>Complete the <strong>Hazard Checklist</strong> (weather, equipment, site conditions)</li>
                  <li>Document <strong>Control Measures</strong> for identified hazards</li>
                  <li>Provide your <strong>digital signature</strong></li>
                  <li>Click <strong>Submit FLHA</strong></li>
                </ol>
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Result:</strong> FLHA saved and available for PDF export. Documents site-specific safety planning.
                </div>
              </CardContent>
            </Card>

            {/* Workflow 4: Report Incident */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600">Workflow 4</Badge>
                    <CardTitle>Report Safety Incident</CardTitle>
                  </div>
                  <Badge variant="outline">As Needed</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Navigate to <strong>Incident Report</strong> page</li>
                  <li>Select <strong>Incident Type</strong>: Injury, Near-Miss, Property Damage, etc.</li>
                  <li>Select <strong>Severity Level</strong> and whether it's recordable</li>
                  <li>Document <strong>What Happened</strong> in detail</li>
                  <li>Add <strong>Injured Persons</strong> if applicable</li>
                  <li>Complete <strong>Root Cause Analysis</strong> and <strong>Corrective Actions</strong></li>
                  <li>Add <strong>Witnesses</strong> and relevant details</li>
                  <li>Obtain required signatures (reporter, supervisor, management)</li>
                  <li>Click <strong>Submit Report</strong></li>
                </ol>
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Result:</strong> Incident documented with full audit trail. Available for regulatory reporting if required.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Customer Journeys */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Customer Journeys
          </h2>

          <div className="space-y-6">
            {/* Technician Journey */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-red-700 dark:text-red-300">Technician Daily Safety Journey</h3>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 rounded-lg p-6 border border-red-200 dark:border-red-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Arrive at Site</p>
                      <p className="text-xs text-muted-foreground">Open app, tap project</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-red-600 dark:text-red-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Harness Inspection</p>
                      <p className="text-xs text-muted-foreground">Check all equipment, sign</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-red-600 dark:text-red-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Start Work</p>
                      <p className="text-xs text-muted-foreground">Clock in, begin session</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-red-600 dark:text-red-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Work Safely</p>
                      <p className="text-xs text-muted-foreground">Log drops, end session</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supervisor Journey */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-300">Supervisor Safety Management Journey</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Project Setup</p>
                      <p className="text-xs text-muted-foreground">Assign workers, brief job</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-action-600 dark:text-action-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Toolbox Meeting</p>
                      <p className="text-xs text-muted-foreground">Gather team, collect signatures</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-action-600 dark:text-action-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Monitor Work</p>
                      <p className="text-xs text-muted-foreground">Track progress, review docs</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-action-600 dark:text-action-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Review CSR</p>
                      <p className="text-xs text-muted-foreground">Check compliance status</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Complete Example Scenario */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
            Complete Example Scenario
          </h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scenario: First Day on a New Window Cleaning Project</CardTitle>
              <CardDescription>Follow this end-to-end example to understand the complete safety workflow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2 border-l-4 border-blue-500 pl-4">
                <p className="font-semibold text-blue-700 dark:text-blue-300">8:00 AM: Toolbox Meeting</p>
                <p>Supervisor opens Toolbox Meeting form:</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>Selects "Tower A Window Cleaning" project</li>
                  <li>Topic: "First day safety briefing - Tower A"</li>
                  <li>Discusses: Fall hazards, anchor points, weather, emergency procedures</li>
                  <li>All 4 technicians sign</li>
                </ul>
                <p className="text-xs bg-muted p-2 rounded">Result: Work covered from Nov 25 - Dec 9 (7 days each direction)</p>
              </div>

              <div className="space-y-2 border-l-4 border-red-500 pl-4">
                <p className="font-semibold text-red-700 dark:text-red-300">8:15 AM: Harness Inspections</p>
                <p>Each technician completes their inspection:</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>Tech A selects personal kit "HR-001, HR-002"</li>
                  <li>Checks all 11 equipment categories</li>
                  <li>Marks harness, descender, ropes as PASS</li>
                  <li>Notes minor wear on lanyard (but still safe)</li>
                  <li>Signs and submits</li>
                </ul>
                <p className="text-xs bg-muted p-2 rounded">Result: Tech A can now start work sessions for today</p>
              </div>

              <div className="space-y-2 border-l-4 border-green-500 pl-4">
                <p className="font-semibold text-green-700 dark:text-green-300">8:30 AM: Start Work Session</p>
                <p>Tech A starts their work session:</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>Clicks "Start Day" on Tower A project</li>
                  <li>System verifies harness inspection exists for today</li>
                  <li>GPS captured, work session begins</li>
                  <li>Logs drops throughout the day</li>
                </ul>
                <p className="text-xs bg-muted p-2 rounded">CSR Status: Harness inspection covered. Toolbox meeting covered.</p>
              </div>

              <div className="space-y-2 border-l-4 border-purple-500 pl-4">
                <p className="font-semibold text-purple-700 dark:text-purple-300">4:00 PM: Near-Miss Incident</p>
                <p>Tool dropped from height (no injury):</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>Supervisor opens Incident Report</li>
                  <li>Type: Near-Miss, Severity: Minor</li>
                  <li>Documents what happened, root cause (loose tool pouch)</li>
                  <li>Corrective action: Tool lanyards required</li>
                  <li>Tech A and Supervisor sign</li>
                </ul>
                <p className="text-xs bg-muted p-2 rounded">Result: Incident documented for safety improvement. PDF available.</p>
              </div>

              <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
                <p className="font-semibold text-cyan-700 dark:text-cyan-300">5:00 PM: Review Safety Status</p>
                <p>Manager checks Company Safety Rating:</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>CSR: 95% (5% deducted for unsigned document reviews)</li>
                  <li>All harness inspections complete</li>
                  <li>All work sessions have toolbox coverage</li>
                  <li>Company docs all uploaded</li>
                </ul>
                <p className="text-xs bg-muted p-2 rounded">Property manager can view this score in their vendor portal</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Permission Model */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            Permission Model
          </h2>
          <p className="text-base text-muted-foreground">Access to safety features is controlled by role and specific permissions:</p>

          <div className="space-y-3">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
                    <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">View Safety Documents</p>
                      <Badge variant="secondary" className="text-xs">canViewSafetyDocuments</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      View harness inspections, toolbox meetings, and other safety records. All employees can view by default.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                    <Gauge className="w-4 h-4 text-action-600 dark:text-action-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">View Company Safety Rating</p>
                      <Badge variant="secondary" className="text-xs">canViewCSR</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      View the CSR breakdown and penalty calculations. Typically Company Owners, Ops Managers, and Property Managers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900 rounded-full p-2">
                    <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Create Safety Documents</p>
                      <Badge variant="secondary" className="text-xs">All Employees</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Any employee can create harness inspections, toolbox meetings, FLHA forms, incident reports, and method statements.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Key Features Summary */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Key Features Summary
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Pre-Work Enforcement</p>
                <p className="text-base text-muted-foreground">Harness inspection required before work sessions begin.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">7-Day Coverage Window</p>
                <p className="text-base text-muted-foreground">One toolbox meeting covers work within 7 days either direction.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <PenTool className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Digital Signatures</p>
                <p className="text-base text-muted-foreground">Legally binding signatures captured with audit timestamps.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Immutable Records</p>
                <p className="text-base text-muted-foreground">Once signed, safety documents cannot be modified.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Download className="w-5 h-5 text-action-600 dark:text-action-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">PDF Export</p>
                <p className="text-base text-muted-foreground">Professional PDFs with embedded signatures for audits.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Gauge className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">CSR Visibility</p>
                <p className="text-base text-muted-foreground">Property managers can view your compliance rating.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Package className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Personal Kit Integration</p>
                <p className="text-base text-muted-foreground">Link inspections to your assigned equipment by serial.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Building2 className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">White-Label Branding</p>
                <p className="text-base text-muted-foreground">Company name appears on PDF headers when branding active.</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Important Notes */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Important Technical Notes
          </h2>

          <div className="space-y-3">
            <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
              <CardContent className="pt-4 text-base text-red-900 dark:text-red-100 space-y-2">
                <p className="font-semibold">Harness Inspection is a Hard Gate</p>
                <p>The system will not allow starting a work session without a same-day harness inspection. This is enforced in code and cannot be bypassed.</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
              <CardContent className="pt-4 text-base text-blue-900 dark:text-blue-100 space-y-2">
                <p className="font-semibold">All Attendees Must Sign</p>
                <p>Toolbox meetings require signatures from every selected attendee. The API validates that each attendee ID has a corresponding signature before saving.</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950">
              <CardContent className="pt-4 text-base text-emerald-900 dark:text-emerald-100 space-y-2">
                <p className="font-semibold">Bi-Directional 7-Day Coverage</p>
                <p>A toolbox meeting covers work sessions 7 days <em>before</em> and 7 days <em>after</em> the meeting date. A meeting on Dec 2 covers Nov 25 - Dec 9.</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950">
              <CardContent className="pt-4 text-base text-purple-900 dark:text-purple-100 space-y-2">
                <p className="font-semibold">Signatures are Immutable</p>
                <p>Once a safety document is signed and submitted, the signature data (base64 image) is stored permanently. No edit endpoints exist for safety documents.</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
              <CardContent className="pt-4 text-base text-amber-900 dark:text-amber-100 space-y-2">
                <p className="font-semibold">CSR Minimum is 20%</p>
                <p>Maximum penalty is 80% (25% + 25% + 25% + 5% for document reviews). Project completion status is informational only and doesn't penalize CSR.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quick Links */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Quick Links</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="justify-between h-auto p-4"
              onClick={() => navigate("/harness-inspection")}
              data-testid="link-harness-inspection"
            >
              <div className="text-left">
                <div className="font-semibold">Harness Inspection</div>
                <div className="text-xs text-muted-foreground">Complete your daily equipment check</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline" 
              className="justify-between h-auto p-4"
              onClick={() => navigate("/toolbox-meeting")}
              data-testid="link-toolbox-meeting"
            >
              <div className="text-left">
                <div className="font-semibold">Toolbox Meeting</div>
                <div className="text-xs text-muted-foreground">Create a team safety briefing</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline" 
              className="justify-between h-auto p-4"
              onClick={() => navigate("/flha")}
              data-testid="link-flha"
            >
              <div className="text-left">
                <div className="font-semibold">FLHA Form</div>
                <div className="text-xs text-muted-foreground">Field level hazard assessment</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline" 
              className="justify-between h-auto p-4"
              onClick={() => navigate("/documents")}
              data-testid="link-documents"
            >
              <div className="text-left">
                <div className="font-semibold">Documents</div>
                <div className="text-xs text-muted-foreground">View and export safety records</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <Card className="border-muted bg-muted/50">
          <CardContent className="pt-6 text-base text-muted-foreground">
            <p><strong>Last updated:</strong> December 2, 2024 | <strong>Version:</strong> 1.0</p>
            <p className="mt-1">This document serves as the authoritative reference for the Safety & Compliance System. For technical implementation details, see <code>safety-documentation-instructions-v1.0.md</code> in the instructions folder.</p>
          </CardContent>
        </Card>
      </main>
      </div>
    </ChangelogLayout>
  );
}
