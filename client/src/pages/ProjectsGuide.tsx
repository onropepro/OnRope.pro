import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import {
  Building2,
  FolderOpen,
  Calendar,
  Target,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Info,
  Layers,
  BarChart3,
  Users,
  Compass,
  Grid3X3,
  Zap,
  FileText,
  ChevronRight,
  Plus,
  Settings,
  Car,
  Home as HomeIcon,
  Droplets,
  Wind,
  Paintbrush,
  Search,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectsGuide() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton to="/changelog" />
            <div>
              <h1 className="text-xl font-bold">Project Management Guide</h1>
              <p className="text-xs text-muted-foreground">Understanding projects, job types, and progress tracking</p>
            </div>
          </div>
          <MainMenuButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
              <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Project Management Overview
            </h2>
            <p className="text-muted-foreground">
              Projects represent individual building maintenance jobs. Each project tracks a specific type of work at a specific location, with progress measured differently depending on the job type. Projects are the central hub connecting <strong>employees, scheduling, safety documentation, and financial tracking</strong>.
            </p>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Target className="w-5 h-5" />
                The Golden Rule: Job Type Determines Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-900 dark:text-blue-100 space-y-4">
              <div className="bg-white dark:bg-blue-900 rounded-lg p-4 text-center">
                <p className="text-xl font-mono font-bold">
                  Progress Method = f(Job Type)
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Each job type has a specific way to measure completion:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Drop-based</strong>: Count "drops" (vertical passes) per building elevation</li>
                  <li><strong>Hours-based</strong>: Track time spent with manual completion percentage</li>
                  <li><strong>Unit-based</strong>: Count individual units (suites) or stalls completed</li>
                </ul>
              </div>

              <div className="bg-blue-100 dark:bg-blue-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Why This Matters
                </p>
                <p className="mt-1">The form you see when ending a work session changes based on job type. Drop-based jobs ask for N/E/S/W drop counts. Hours-based jobs ask for completion percentage. The system adapts to each work type.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Job Types and Their Tracking Methods
          </h2>
          <p className="text-sm text-muted-foreground">The platform supports multiple job types, each optimized for specific building maintenance work:</p>

          <div className="space-y-3">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600">Drop-Based</Badge>
                  <CardTitle className="text-base">Elevation Tracking Jobs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">Progress is tracked by counting "drops" (vertical passes down the building) for each compass direction.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="material-icons text-blue-600 text-lg">window</span>
                    <div>
                      <p className="font-medium text-xs">Window Cleaning</p>
                      <p className="text-xs text-muted-foreground">High-rise windows</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Wind className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-xs">Ext. Dryer Vent</p>
                      <p className="text-xs text-muted-foreground">Exterior cleaning</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-xs">Building Wash</p>
                      <p className="text-xs text-muted-foreground">Pressure washing</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                  <p className="font-semibold text-xs mb-2">How Drop Tracking Works:</p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white dark:bg-blue-900 p-2 rounded">
                      <Compass className="w-4 h-4 mx-auto mb-1" />
                      <p className="text-xs font-bold">North</p>
                      <p className="text-xs text-muted-foreground">12 drops</p>
                    </div>
                    <div className="bg-white dark:bg-blue-900 p-2 rounded">
                      <Compass className="w-4 h-4 mx-auto mb-1 rotate-90" />
                      <p className="text-xs font-bold">East</p>
                      <p className="text-xs text-muted-foreground">8 drops</p>
                    </div>
                    <div className="bg-white dark:bg-blue-900 p-2 rounded">
                      <Compass className="w-4 h-4 mx-auto mb-1 rotate-180" />
                      <p className="text-xs font-bold">South</p>
                      <p className="text-xs text-muted-foreground">12 drops</p>
                    </div>
                    <div className="bg-white dark:bg-blue-900 p-2 rounded">
                      <Compass className="w-4 h-4 mx-auto mb-1 -rotate-90" />
                      <p className="text-xs font-bold">West</p>
                      <p className="text-xs text-muted-foreground">8 drops</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Total project scope: 40 drops. Daily target: 10 drops.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">Hours-Based</Badge>
                  <CardTitle className="text-base">Time Tracking Jobs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">Progress is tracked by hours worked plus a manual completion percentage entered at the end of each session.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Droplets className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-medium text-xs">Gen. Pressure Wash</p>
                      <p className="text-xs text-muted-foreground">Ground-level work</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="material-icons text-green-600 text-lg">storefront</span>
                    <div>
                      <p className="font-medium text-xs">Ground Windows</p>
                      <p className="text-xs text-muted-foreground">Low-rise cleaning</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Paintbrush className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-medium text-xs">Painting</p>
                      <p className="text-xs text-muted-foreground">Coating services</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                  <p className="font-semibold text-xs mb-2">End-of-Day Prompt:</p>
                  <p className="text-xs">"How much of the job did you complete today?" Worker enters 0-100%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-600">Unit-Based</Badge>
                  <CardTitle className="text-base">Unit/Stall Tracking Jobs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">Progress is tracked by counting individual units (suites) or stalls completed each day.</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <HomeIcon className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="font-medium text-xs">In-Suite Dryer Vent</p>
                      <p className="text-xs text-muted-foreground">Per-unit service</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Car className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="font-medium text-xs">Parkade Cleaning</p>
                      <p className="text-xs text-muted-foreground">Per-stall tracking</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded">
                  <p className="font-semibold text-xs">Configuration:</p>
                  <p className="text-xs">Set total units/stalls and daily target. Progress = Completed / Total.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-violet-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-violet-600">Custom</Badge>
                  <CardTitle className="text-base">Custom Job Types</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">Create company-specific job types for specialized work. Custom types are saved and reusable.</p>
                
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <MoreHorizontal className="w-4 h-4 text-violet-600" />
                  <div>
                    <p className="font-medium text-xs">Other / Custom</p>
                    <p className="text-xs text-muted-foreground">You define the name and tracking method</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
            Creating a New Project
          </h2>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle>Step-by-Step Project Creation</CardTitle>
                <Badge variant="outline">Requires: Company or Ops Manager</Badge>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <strong>Navigate to Dashboard</strong>
                  <p className="text-muted-foreground ml-5">Click "New Project" button in the Projects section</p>
                </li>
                <li>
                  <strong>Select Job Type</strong>
                  <p className="text-muted-foreground ml-5">Choose from the visual grid of job type icons. This determines how progress will be tracked.</p>
                </li>
                <li>
                  <strong>Enter Building Details</strong>
                  <p className="text-muted-foreground ml-5">Building name, address, strata plan number (optional)</p>
                </li>
                <li>
                  <strong>Configure Job-Specific Settings</strong>
                  <p className="text-muted-foreground ml-5">
                    For drop-based: Total drops per elevation, daily target<br />
                    For hours-based: Estimated total hours<br />
                    For unit-based: Total units/stalls, daily target
                  </p>
                </li>
                <li>
                  <strong>Set Schedule (Optional)</strong>
                  <p className="text-muted-foreground ml-5">Start date, end date, target completion date. This creates a calendar entry automatically.</p>
                </li>
                <li>
                  <strong>Assign Employees (Optional)</strong>
                  <p className="text-muted-foreground ml-5">Pre-assign specific employees to this project</p>
                </li>
              </ol>

              <div className="bg-muted p-3 rounded">
                <p className="font-semibold text-xs flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Auto-Scheduling
                </p>
                <p className="text-xs mt-1">When you provide start and end dates during project creation, the system automatically creates a scheduled job entry that appears on the company calendar.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Progress Tracking Deep Dive
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-2 border-blue-200 dark:border-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  Drop-Based Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded space-y-2">
                  <p className="font-semibold text-xs">Calculation:</p>
                  <p className="font-mono text-xs">
                    Progress = (N + E + S + W completed) / (N + E + S + W total)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-semibold text-xs">Key Features:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Track which elevations are complete</li>
                    <li>Daily drop target with shortfall tracking</li>
                    <li>Visual progress bars per elevation</li>
                    <li>Automatic percentage calculation</li>
                  </ul>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950 p-2 rounded text-xs">
                  <p className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <strong>Shortfall Reason:</strong> Required if daily drops are below target
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  Hours-Based Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded space-y-2">
                  <p className="font-semibold text-xs">Calculation:</p>
                  <p className="font-mono text-xs">
                    Progress = Manual percentage entered by worker
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-semibold text-xs">Key Features:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Worker estimates completion at end of day</li>
                    <li>Hours tracked for payroll</li>
                    <li>No drop counts needed</li>
                    <li>Simple 0-100% input</li>
                  </ul>
                </div>

                <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-xs">
                  <p><strong>Best for:</strong> Jobs where counting units doesn't make sense</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Special Project Features
          </h2>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="material-icons text-amber-600 text-lg">attach_money</span>
                  Peace Work Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">When enabled, workers are paid per drop instead of hourly. Payment is calculated as:</p>
                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded text-center">
                  <p className="font-mono font-bold">Session Pay = Drops Completed x Price Per Drop</p>
                </div>
                <p className="text-xs text-muted-foreground">This mode is useful for incentivizing productivity and works automatically with payroll calculations.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Employee Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">Projects can have employees pre-assigned. This affects:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Which projects appear on an employee's dashboard</li>
                  <li>Calendar scheduling and resource allocation</li>
                  <li>Active workers tracking visibility</li>
                </ul>
                <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded text-xs">
                  <strong>Note:</strong> Unassigned employees can still clock into any active project if they have general access.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Project Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">Each project can store multiple documents:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-muted rounded text-xs">
                    <p className="font-semibold">Rope Access Plan</p>
                    <p className="text-muted-foreground">Required safety document</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-xs">
                    <p className="font-semibold">Anchor Inspection</p>
                    <p className="text-muted-foreground">Certification document</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-xs">
                    <p className="font-semibold">General Documents</p>
                    <p className="text-muted-foreground">Any supporting PDFs</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-xs">
                    <p className="font-semibold">Site Photos</p>
                    <p className="text-muted-foreground">Image gallery</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            Project Lifecycle
          </h2>

          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
            <div className="flex flex-col items-center min-w-[100px]">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs font-semibold">Created</p>
              <p className="text-xs text-muted-foreground text-center">Project setup</p>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col items-center min-w-[100px]">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs font-semibold">Active</p>
              <p className="text-xs text-muted-foreground text-center">Work in progress</p>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col items-center min-w-[100px]">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-2">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-xs font-semibold">Tracking</p>
              <p className="text-xs text-muted-foreground text-center">Sessions logged</p>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col items-center min-w-[100px]">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs font-semibold">Completed</p>
              <p className="text-xs text-muted-foreground text-center">Marked done</p>
            </div>
          </div>

          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-4 text-sm text-amber-900 dark:text-amber-100">
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                Soft Delete
              </p>
              <p className="mt-1">Projects are never permanently deleted. When "deleted", they are marked with a flag and hidden from normal views but preserved for historical reporting and audit purposes.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Calendar Integration
          </h2>

          <Card>
            <CardContent className="pt-6 text-sm space-y-4">
              <p className="text-muted-foreground">Projects with start and end dates automatically appear on the company calendar. The system supports:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold">Visual Features:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Color-coded project bars</li>
                    <li>Multi-day span visualization</li>
                    <li>Employee assignment indicators</li>
                    <li>Conflict detection highlighting</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Scheduling Actions:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Drag-and-drop date changes</li>
                    <li>Click to view project details</li>
                    <li>Filter by job type or employee</li>
                    <li>Week/month/timeline views</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Quick Reference: Project Fields by Job Type
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left font-semibold">Field</th>
                  <th className="p-3 text-center font-semibold">Drop-Based</th>
                  <th className="p-3 text-center font-semibold">Hours-Based</th>
                  <th className="p-3 text-center font-semibold">Unit-Based</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3">Total Drops (N/E/S/W)</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center">-</td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3">Daily Drop Target</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center">-</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">Estimated Hours</td>
                  <td className="p-3 text-center">Optional</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center">Optional</td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3">Total Units/Stalls</td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">Units Per Day</td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-3">Peace Work Option</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center">-</td>
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
  );
}
