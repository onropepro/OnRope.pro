import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import {
  FileText,
  DollarSign,
  Building2,
  Layers,
  Calculator,
  TrendingUp,
  ArrowRight,
  Lock,
  Eye,
  Settings,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  Kanban,
  Mail,
  Target,
  Trophy,
  XCircle,
  GripVertical,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuotingGuide() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton to="/changelog" />
            <div>
              <h1 className="text-xl font-bold">Quoting & Sales Pipeline Guide</h1>
              <p className="text-xs text-muted-foreground">Professional quote creation and pipeline management</p>
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
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
              <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              Quoting System Overview
            </h2>
            <p className="text-muted-foreground">
              The quoting system enables rope access companies to create detailed service quotes with automatic labor cost calculations. Quotes progress through a visual <strong>Kanban-style sales pipeline</strong> from Draft to Won/Lost, with drag-and-drop stage management. Access it from the Quotes section in your dashboard.
            </p>
          </div>
        </section>

        <Separator />

        {/* THE GOLDEN RULE */}
        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Calculator className="w-5 h-5" />
                The Golden Rule: Configure Before Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-2xl font-mono font-bold">
                  Total Cost = Hours x Rate + Service Fees
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Each service type has its own pricing model.</strong> Labor costs are calculated based on:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Rope Access Services</strong>: Drops per day and price per hour</li>
                  <li><strong>Parkade Cleaning</strong>: Price per stall x total stalls</li>
                  <li><strong>Dryer Vent Cleaning</strong>: Per unit or hourly pricing</li>
                  <li><strong>Ground Work</strong>: Estimated hours x hourly rate</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Financial Visibility
                </p>
                <p className="mt-1">Only users with <strong>Financial Access</strong> permission can view and edit pricing information. Other users can create quotes but will see pricing fields hidden.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Window Cleaning</p>
                  <p className="font-bold">120 total drops</p>
                  <p className="text-lg font-mono">30 drops/day</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Estimated</p>
                  <p className="font-bold">4 days x 8 hours</p>
                  <p className="text-lg font-mono">32 hours</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">At $75/hour</p>
                  <p className="font-bold">Total Cost</p>
                  <p className="text-lg font-mono text-green-700 dark:text-green-300">$2,400</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Service Types */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Available Service Types
          </h2>
          <p className="text-sm text-muted-foreground">Select from pre-configured service types when building a quote:</p>

          <div className="grid md:grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Window Cleaning
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-muted-foreground">Rope access window cleaning with elevation-based tracking.</p>
                <div className="mt-2 text-xs bg-muted p-2 rounded">
                  <strong>Tracks:</strong> Drops per elevation (N/E/S/W), daily target
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-600" />
                  Building Wash
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-muted-foreground">Exterior building washing via rope access.</p>
                <div className="mt-2 text-xs bg-muted p-2 rounded">
                  <strong>Tracks:</strong> Drops per elevation (N/E/S/W), daily target
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  Dryer Vent Cleaning
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-muted-foreground">In-suite dryer vent service with unit tracking.</p>
                <div className="mt-2 text-xs bg-muted p-2 rounded">
                  <strong>Pricing:</strong> Per unit OR hourly rate
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-orange-600" />
                  Parkade Cleaning
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-muted-foreground">Parking structure pressure washing.</p>
                <div className="mt-2 text-xs bg-muted p-2 rounded">
                  <strong>Pricing:</strong> Price per stall x total stalls
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-green-600" />
                  Ground Windows
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-muted-foreground">Ground-level window cleaning service.</p>
                <div className="mt-2 text-xs bg-muted p-2 rounded">
                  <strong>Tracks:</strong> Estimated hours, hourly rate
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-600" />
                  Custom Service
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-muted-foreground">Define your own service with custom name.</p>
                <div className="mt-2 text-xs bg-muted p-2 rounded">
                  <strong>Options:</strong> Rope access or ground work tracking
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Sales Pipeline */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Kanban className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Sales Pipeline (Kanban View)
          </h2>
          <p className="text-sm text-muted-foreground">Track quotes through your sales process with drag-and-drop stage management:</p>

          <div className="space-y-3">
            {/* Pipeline Stages */}
            <div className="grid grid-cols-6 gap-2">
              <Card className="border-l-4 border-l-gray-400">
                <CardContent className="p-3 text-center">
                  <Clock className="w-5 h-5 mx-auto text-gray-500 mb-1" />
                  <p className="text-xs font-semibold">Draft</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-blue-400">
                <CardContent className="p-3 text-center">
                  <Send className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                  <p className="text-xs font-semibold">Submitted</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-purple-400">
                <CardContent className="p-3 text-center">
                  <Eye className="w-5 h-5 mx-auto text-purple-500 mb-1" />
                  <p className="text-xs font-semibold">Review</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-orange-400">
                <CardContent className="p-3 text-center">
                  <Target className="w-5 h-5 mx-auto text-orange-500 mb-1" />
                  <p className="text-xs font-semibold">Negotiation</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-400">
                <CardContent className="p-3 text-center">
                  <Trophy className="w-5 h-5 mx-auto text-green-500 mb-1" />
                  <p className="text-xs font-semibold">Won</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-red-400">
                <CardContent className="p-3 text-center">
                  <XCircle className="w-5 h-5 mx-auto text-red-500 mb-1" />
                  <p className="text-xs font-semibold">Lost</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-blue-900 dark:text-blue-100">
                      Drag-and-Drop Movement
                    </p>
                    <p className="text-blue-800 dark:text-blue-200">
                      Simply drag quote cards between columns to update their status. The pipeline automatically calculates total value per stage and overall win rates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quote Creation Workflow */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Quote Creation Workflow
          </h2>

          <div className="space-y-3">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Select Services</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose one or more service types from the grid. Each selected service opens a configuration form with relevant fields.
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
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Configure Each Service</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter service-specific details: drops per elevation, stall counts, hourly rates, etc. System auto-calculates total hours and costs.
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
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Enter Building Information</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add building name, strata plan number, address, floor count, and strata manager details. Optional: upload a building photo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Quote Created</h3>
                    <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                      Quote is saved in Draft stage. You can view, edit, email to client, or drag to the next pipeline stage.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quote Features */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Quote Features
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Email Quotes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Send professional quote emails directly to clients from the quote detail view. Includes all service details and pricing.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Building Photos</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Attach building photos to quotes for reference. Photos are stored securely and displayed in quote details.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pipeline Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                View total quote values, win rates, and stage distribution in the Analytics tab. Track conversion metrics over time.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">My Quotes View</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Workers can access "My Quotes" tab to see quotes they created. Managers see all company quotes.
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Permission Hierarchy */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            Permission Requirements
          </h2>
          <p className="text-sm text-muted-foreground">Access to quoting features requires specific permissions:</p>

          <div className="space-y-3">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                    <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">View Quotes</p>
                      <Badge variant="secondary" className="text-xs">canViewQuotes</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Can view existing quotes and pipeline</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
                    <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Create Quotes</p>
                      <Badge variant="secondary" className="text-xs">canCreateQuotes</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Can create new quotes for buildings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
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
                    <p className="text-sm text-muted-foreground mt-1">Required to view and edit pricing information on quotes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quick Reference */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Quick Reference
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Service Type</th>
                      <th className="text-left py-2 font-semibold">Pricing Model</th>
                      <th className="text-left py-2 font-semibold">Key Input</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Window Cleaning</td>
                      <td className="py-2">Hours x Rate</td>
                      <td className="py-2">Drops per elevation, daily target</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Building Wash</td>
                      <td className="py-2">Hours x Rate</td>
                      <td className="py-2">Drops per elevation, daily target</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Parkade Cleaning</td>
                      <td className="py-2">Stalls x Rate</td>
                      <td className="py-2">Total stalls, price per stall</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Dryer Vent</td>
                      <td className="py-2">Units or Hours</td>
                      <td className="py-2">Unit count or hours, rate</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Ground Windows</td>
                      <td className="py-2">Hours x Rate</td>
                      <td className="py-2">Estimated hours</td>
                    </tr>
                    <tr>
                      <td className="py-2">Custom Service</td>
                      <td className="py-2">Configurable</td>
                      <td className="py-2">Rope access or ground work</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Customer Journeys */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Customer Journeys
          </h2>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-emerald-700 dark:text-emerald-300">Sales Manager Journey</h3>
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Create Quote</p>
                      <p className="text-xs text-muted-foreground">Select services, enter details</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Send to Client</p>
                      <p className="text-xs text-muted-foreground">Email quote for review</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Track Pipeline</p>
                      <p className="text-xs text-muted-foreground">Move through stages</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Close Deal</p>
                      <p className="text-xs text-muted-foreground">Mark Won or Lost</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Key Features Summary */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Key Features Summary
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Automatic Cost Calculation</p>
                <p className="text-sm text-muted-foreground">Labor costs computed from hours and rates.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Kanban className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Kanban Pipeline</p>
                <p className="text-sm text-muted-foreground">Drag-and-drop stage management.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Email Integration</p>
                <p className="text-sm text-muted-foreground">Send quotes directly to clients.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Financial Protection</p>
                <p className="text-sm text-muted-foreground">Pricing only visible to authorized users.</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Quick Links */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Quick Links</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="justify-between h-auto p-4"
              onClick={() => navigate("/quotes")}
              data-testid="link-quotes"
            >
              <div className="text-left">
                <div className="font-semibold">Go to Quotes</div>
                <div className="text-xs text-muted-foreground">Create and manage quotes</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline" 
              className="justify-between h-auto p-4"
              onClick={() => navigate("/changelog/crm")}
              data-testid="link-crm-guide"
            >
              <div className="text-left">
                <div className="font-semibold">CRM Guide</div>
                <div className="text-xs text-muted-foreground">Client management documentation</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <Card className="border-muted bg-muted/50">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            <p><strong>Last updated:</strong> December 3, 2024 | <strong>Version:</strong> 1.0</p>
            <p className="mt-1">This document serves as the authoritative reference for the Quoting & Sales Pipeline System.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
