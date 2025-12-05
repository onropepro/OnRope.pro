import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import ChangelogLayout from "@/components/ChangelogLayout";
import {
  CheckCircle2,
  Briefcase,
  Calendar,
  Users,
  ChevronRight,
  ArrowRight,
  Building2,
  Target,
  Clock,
  Palette,
  FileText,
  MapPin,
  AlertTriangle,
  ClipboardList,
  Layers,
  TrendingUp,
  PenTool,
  Compass,
  Grid3X3,
  Save,
  Sparkles,
  BarChart3,
  ListChecks,
  Wind,
  Wrench,
  ParkingCircle,
  Search,
  Hammer,
  AppWindow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProjectManagementGuide() {
  const [, navigate] = useLocation();

  return (
    <ChangelogLayout title="Project Management Guide">
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BackButton to="/changelog" />
              <div>
                <h1 className="text-xl font-bold">Project Management System Guide</h1>
                <p className="text-xs text-muted-foreground">Comprehensive project tracking for rope access operations</p>
              </div>
            </div>
            <MainMenuButton />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Project Management Overview
              </h2>
              <p className="text-muted-foreground">
                The Project Management System provides <strong>comprehensive tracking</strong> for all rope access operations. From job type selection to progress visualization, the system handles multiple project types with directional drop tracking, timeline management, and color-coded calendar integration.
              </p>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Job Types
            </h2>
            
            <div className="grid md:grid-cols-2 gap-3">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <AppWindow className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Window Cleaning</p>
                      <p className="text-xs text-muted-foreground">High-rise window washing services</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Wind className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">Dryer Vent</p>
                      <p className="text-xs text-muted-foreground">Dryer vent cleaning and maintenance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium">Building Wash</p>
                      <p className="text-xs text-muted-foreground">Exterior facade cleaning</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <ParkingCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium">Parkade Cleaning</p>
                      <p className="text-xs text-muted-foreground">Parking structure maintenance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Search className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Inspection</p>
                      <p className="text-xs text-muted-foreground">Building envelope inspections</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium">Repairs</p>
                      <p className="text-xs text-muted-foreground">Exterior repair work</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-dashed">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border-2 border-dashed flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Custom Job Types</p>
                    <p className="text-xs text-muted-foreground">Create and save custom job types with icons for reuse across projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Directional Drop Tracking
            </h2>
            
            <Card className="border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950">
              <CardContent className="pt-6 text-emerald-900 dark:text-emerald-100">
                <p className="mb-4">Track progress on each side of a building independently:</p>
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="bg-white dark:bg-emerald-900 rounded-lg p-3">
                    <Compass className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                    <p className="font-bold text-sm">North</p>
                  </div>
                  <div className="bg-white dark:bg-emerald-900 rounded-lg p-3">
                    <Compass className="w-6 h-6 mx-auto mb-1 text-emerald-600 rotate-90" />
                    <p className="font-bold text-sm">East</p>
                  </div>
                  <div className="bg-white dark:bg-emerald-900 rounded-lg p-3">
                    <Compass className="w-6 h-6 mx-auto mb-1 text-emerald-600 rotate-180" />
                    <p className="font-bold text-sm">South</p>
                  </div>
                  <div className="bg-white dark:bg-emerald-900 rounded-lg p-3">
                    <Compass className="w-6 h-6 mx-auto mb-1 text-emerald-600 -rotate-90" />
                    <p className="font-bold text-sm">West</p>
                  </div>
                </div>
                <p className="text-sm mt-4">Each direction tracks its own drop count, completion status, and assigned crew members.</p>
              </CardContent>
            </Card>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              Daily Drop Targets & Progress
            </h2>
            
            <div className="grid gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Visual Progress Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                      <div className="bg-green-500 h-full w-3/4"></div>
                    </div>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Real-time progress bars show completion percentage for each project direction</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ListChecks className="w-4 h-4" />
                    Drop Counting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Set daily drop targets for each project</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Log completed drops in real-time from mobile</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Track daily, weekly, and total drop counts</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Timeline & Calendar Integration
            </h2>
            
            <div className="grid gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Project Timelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Set start and end dates for each project</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Automatic timeline calculations based on scope</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Deadline tracking with overdue alerts</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Color-Coded Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Assign colors to projects for visual identification</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Calendar view shows all active projects</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Filter by job type, status, or assigned crew</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Employee Assignment
            </h2>
            
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">Assign employees to specific projects with role-based visibility:</p>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="border rounded-lg p-3 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="font-medium text-sm">Crew Assignment</p>
                    <p className="text-xs text-muted-foreground">Add/remove team members</p>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <MapPin className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="font-medium text-sm">GPS Tracking</p>
                    <p className="text-xs text-muted-foreground">Verify on-site presence</p>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="font-medium text-sm">Time Logging</p>
                    <p className="text-xs text-muted-foreground">Track hours per project</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Problems Solved
            </h2>
            
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="problem-1" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-medium">No Centralized Project Tracking</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Problem:</p>
                    <p className="text-sm text-red-700 dark:text-red-300">Projects tracked in spreadsheets, whiteboards, or personal notes leading to lost information and miscommunication</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Example:</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">"The crew showed up at the wrong building because the project details were on a sticky note that fell off the board"</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Solution:</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Centralized digital system with all project details, assignments, and progress accessible from any device</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="problem-2" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-medium">Unclear Progress Visibility</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Problem:</p>
                    <p className="text-sm text-red-700 dark:text-red-300">Management couldn't see real-time project status without calling the site supervisor</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Example:</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">"Client called asking about progress but I had to call 3 different supervisors to piece together the current status"</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Solution:</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Real-time progress bars, directional tracking, and daily drop counts visible instantly from the dashboard</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="problem-3" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-medium">Scheduling Conflicts & Overlaps</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Problem:</p>
                    <p className="text-sm text-red-700 dark:text-red-300">Same crew accidentally scheduled at multiple sites, or projects overlapping without resources</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Example:</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">"We promised two clients we'd start on the same day with the same crew - neither was happy"</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Solution:</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Color-coded calendar with employee assignments, conflict detection, and visual timeline management</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="problem-4" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-medium">Custom Job Type Limitations</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Problem:</p>
                    <p className="text-sm text-red-700 dark:text-red-300">System only supported predefined job types, forcing companies to misclassify their work</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Solution:</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Custom job type creation with icon selection and the ability to save for reuse across future projects</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              Benefits
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Real-Time Visibility</p>
                      <p className="text-sm text-muted-foreground">See project progress instantly from anywhere</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Reduced Errors</p>
                      <p className="text-sm text-muted-foreground">Digital tracking eliminates lost paperwork</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Better Client Communication</p>
                      <p className="text-sm text-muted-foreground">Answer client inquiries with accurate data</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Improved Scheduling</p>
                      <p className="text-sm text-muted-foreground">Prevent conflicts and optimize crew allocation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

        </main>
      </div>
    </ChangelogLayout>
  );
}
