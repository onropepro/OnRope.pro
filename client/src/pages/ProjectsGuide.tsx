import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
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
  MoreHorizontal,
  Key,
  Brain,
  DollarSign,
  Eye,
  CalendarCheck,
  History,
  MessageSquare,
  Sparkles,
  ParkingCircle,
  Wrench,
  AppWindow,
  Brush,
  ClipboardCheck,
  Warehouse,
  SprayCan,
  ChevronsUpDown,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLocation } from "wouter";

const ALL_ACCORDION_ITEMS = [
  "owner-1", "owner-2", "owner-3", "owner-4", "owner-5", "owner-6", "owner-7", "owner-8",
  "manager-1", "manager-2",
  "resident-1",
  "tech-1", "tech-2", "tech-3",
  "add-1", "add-2", "add-3", "add-4", "add-5"
];

export default function ProjectsGuide() {
  const [, navigate] = useLocation();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const allExpanded = openItems.length === ALL_ACCORDION_ITEMS.length;

  const toggleAll = () => {
    if (allExpanded) {
      setOpenItems([]);
    } else {
      setOpenItems([...ALL_ACCORDION_ITEMS]);
    }
  };

  return (
    <ChangelogGuideLayout 
      title="Project Management Guide"
      version="2.0"
      lastUpdated="December 5, 2025"
    >
      <div className="space-y-8">
        
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            Projects represent individual building maintenance jobs. Each project tracks a specific type of work at a specific location, with progress measured differently depending on the job type. Projects are the central hub connecting <strong>employees, scheduling, safety documentation, and financial tracking</strong>.
          </p>
        </section>

        <section className="space-y-6">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Key className="w-5 h-5" />
                The Golden Rule: Job Type Determines Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Progress Method = f(Job Type)
                </p>
              </div>
              
              <div className="space-y-2 text-base">
                <p><strong>Key Principles:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Drop-based</strong>: Count "drops" (vertical passes) per building elevation. Used for window cleaning, building wash, facade work.</li>
                  <li><strong>Hours-based</strong>: Track time spent with manual completion percentage. Used for general maintenance, repairs, investigative work.</li>
                  <li><strong>Unit-based</strong>: Count individual units (suites) or stalls completed. Used for in-suite services, parkade cleaning.</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Why This Matters
                </p>
                <p className="mt-1">The form you see when ending a work session changes based on job type. Drop-based jobs ask for N/E/S/W drop counts. Hours-based jobs ask for completion percentage. The system adapts to each work type, ensuring accurate progress tracking and payroll calculation.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Services Managed - Exact match with Changelog.tsx */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-warning-100 dark:bg-warning-600/20 ring-1 ring-warning-600/20">
                <Wrench className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Services Managed</CardTitle>
                <CardDescription>
                  Building maintenance focus with 11 specialized service types
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              {/* Building Maintenance Category */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-base">Building Maintenance</h3>
                  <Badge variant="secondary" className="text-xs">10</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">High-rise building cleaning and maintenance services</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-lg bg-background ring-1 ring-border/50 flex-shrink-0">
                      <span className="material-icons text-lg text-muted-foreground">window</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-base">Window Cleaning</span>
                        <Badge variant="secondary" className="text-xs">Drop-based (N/E/S/W)</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Rope access high-rise window cleaning with directional drop tracking
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-lg bg-background ring-1 ring-border/50 flex-shrink-0">
                      <span className="material-icons text-lg text-muted-foreground">air</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-base">Exterior Dryer Vent Cleaning</span>
                        <Badge variant="secondary" className="text-xs">Drop-based (N/E/S/W)</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        High-rise exterior dryer vent cleaning and maintenance
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-lg bg-background ring-1 ring-border/50 flex-shrink-0">
                      <span className="material-icons text-lg text-muted-foreground">water_drop</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-base">Building Wash / Pressure Washing</span>
                        <Badge variant="secondary" className="text-xs">Drop-based (N/E/S/W)</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Building exterior cleaning and pressure washing services
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-lg bg-background ring-1 ring-border/50 flex-shrink-0">
                      <span className="material-icons text-lg text-muted-foreground">cleaning_services</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-base">General Pressure Washing</span>
                        <Badge variant="secondary" className="text-xs">Hours-based</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Ground-level and general pressure washing services
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-lg bg-background ring-1 ring-border/50 flex-shrink-0">
                      <span className="material-icons text-lg text-muted-foreground">home_repair_service</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-base">Gutter Cleaning</span>
                        <Badge variant="secondary" className="text-xs">Hours-based</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Gutter cleaning, maintenance, and debris removal
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-lg bg-background ring-1 ring-border/50 flex-shrink-0">
                      <span className="material-icons text-lg text-muted-foreground">meeting_room</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-base">In-Suite Dryer Vent Cleaning</span>
                        <Badge variant="secondary" className="text-xs">Unit-based</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Individual unit dryer vent cleaning with unit tracking
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-lg bg-background ring-1 ring-border/50 flex-shrink-0">
                      <span className="material-icons text-lg text-muted-foreground">local_parking</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-base">Parkade Pressure Cleaning</span>
                        <Badge variant="secondary" className="text-xs">Stall-based</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Parking structure pressure washing with stall tracking
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-lg bg-background ring-1 ring-border/50 flex-shrink-0">
                      <span className="material-icons text-lg text-muted-foreground">storefront</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-base">Ground Window Cleaning</span>
                        <Badge variant="secondary" className="text-xs">Hours-based</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Ground-level and low-rise window cleaning
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-lg bg-background ring-1 ring-border/50 flex-shrink-0">
                      <span className="material-icons text-lg text-muted-foreground">format_paint</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-base">Painting</span>
                        <Badge variant="secondary" className="text-xs">Hours-based</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Rope access painting and coating services
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-lg bg-background ring-1 ring-border/50 flex-shrink-0">
                      <span className="material-icons text-lg text-muted-foreground">fact_check</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-base">Inspection</span>
                        <Badge variant="secondary" className="text-xs">Hours-based</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Building facade inspection and assessment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Custom Services Category */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-base">Custom Services</h3>
                  <Badge variant="secondary" className="text-xs">1</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Create and save custom job types for your company</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-lg bg-background ring-1 ring-border/50 flex-shrink-0">
                      <span className="material-icons text-lg text-muted-foreground">more_horiz</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-base">Custom Job Types</span>
                        <Badge variant="secondary" className="text-xs">Configurable</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Define your own specialized services with configurable tracking
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Directional Drop Tracking Visual */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
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
              <p className="text-sm mt-4">Each direction tracks its own drop count, completion status, and assigned crew members. This allows precise scheduling when different elevations have different access requirements or completion timelines.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Key Features Section */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Key Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Directional Drop Tracking</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track progress on each building elevation (N/E/S/W) independently. Perfect for high-rise window cleaning with different access requirements per side.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Real-Time Progress Dashboard</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      See every project's completion percentage, days remaining, and assigned crew. Updates automatically as work sessions are logged.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-action-100 dark:bg-action-900 flex items-center justify-center shrink-0">
                    <Grid3X3 className="w-5 h-5 text-action-600 dark:text-action-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Flexible Tracking Methods</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Drop-based, hours-based, or unit-based tracking. The system adapts to each job type for accurate progress and payroll calculation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Crew Assignment & Scheduling</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Assign technicians to specific projects and elevations. See who's working where and prevent double-booking your best crew.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Client & Resident Visibility</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Property managers and residents check progress themselves. Photo galleries and completion status reduce status calls by 60-70%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Performance Analytics</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track drops/units completed per shift by technician. Identify top performers and coach underperformers with objective data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Problems Solved */}
        <section className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Problems Solved</h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                Real challenges addressed by OnRopePro's Project Management module.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={toggleAll}
              data-testid="button-toggle-all-accordions"
            >
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          {/* For Rope Access Company Owners Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Rope Access Company Owners</h3>
            </div>
            
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="owner-1" className={`border rounded-lg px-4 ${openItems.includes("owner-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">"I have no idea where my 6 active projects actually stand"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You're juggling window washing at Tower A, caulking at Building B, and anchor inspections at Complex C. When a client calls asking for a status update, you're guessing based on what you remember from yesterday's phone call with your supervisor. You drive site-to-site taking notes, wasting 10-15 hours per week just figuring out what's happening.</p>
                    <p><span className="font-medium text-foreground">Real Example:</span> You bid a new project for next week, but you're not sure if your current jobs will finish on time. You don't know if Tommy is overloaded or if Sarah has capacity. You commit anyway and hope it works out, then discover you've double-booked your best crew.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Real-time dashboard showing every project's progress percentage, days remaining, assigned crew, and completion forecast. Filter by status, building, or technician. Updates automatically as work sessions are logged.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Instant oversight without site visits. Confidently quote new work based on real crew availability. Make data-driven prioritization decisions in seconds, not hours.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className={`border rounded-lg px-4 ${openItems.includes("owner-2") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">"One tech is crushing it while another coasts, and I can't prove it"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>Your gut says Tommy completes 5 drops per day while another employee barely does 1, but they work the same hours. Without hard data, you can't have the coaching conversation. You suspect someone's on their phone half the day, but proving it means physical surveillance, awkward and time-consuming.</p>
                    <p><span className="font-medium text-foreground">Real Example:</span> Two techs worked the same 8-hour shift at the same building. Your client complains progress is slow. You pay both techs full wages, but you're only getting one tech's worth of productivity. The high performer feels demoralized; the underperformer coasts undetected.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Per-employee performance tracking showing drops/units completed per shift, target achievement rates (e.g., "Meeting target 87% of time"), and historical trends. Outlier detection automatically flags significant deviations from team averages.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Objective performance data for coaching conversations. High performers feel recognized (lower turnover). Underperformers either improve or self-select out. Clients see 20-30% faster project completion.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className={`border rounded-lg px-4 ${openItems.includes("owner-3") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">"Residents bombard the property manager with 'When will you be done?' questions"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>The property manager receives 15-30 status calls per week during your project. Residents assume the worst because they have no visibility. The property manager becomes frustrated playing telephone between you and 40 units. Your professional reputation suffers even though your crew is working efficiently.</p>
                    <p><span className="font-medium text-foreground">Real Example:</span> Unit 402 has a birthday party on Sunday and demands you not work near their windows that day. The property manager calls you at 8 PM on Friday with this restriction. You scramble to reschedule your crew, move equipment, and adjust the timeline, 2 hours of chaos that could have been avoided.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Resident-facing portal showing real-time progress (4-elevation visual system), upcoming work schedules ("We'll be near your unit Wednesday 9am-3pm"), photo galleries of completed work, and expected completion dates. Residents submit feedback directly without property manager middleman.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Property manager time saved (20+ hours/month per active project). Resident complaints drop 60-70%. Your company looks professional and transparent. Contract renewals increase 15-25%. Building managers refer you to other properties.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-4" className={`border rounded-lg px-4 ${openItems.includes("owner-4") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">"I create a project, then manually re-enter everything into my calendar"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You win a new contract. You create the project in your system (or Excel). Then you open Google Calendar and manually block off dates. Then you text your supervisor the crew assignments. Then you update your whiteboard. Same information, four different places, wasting 30-45 minutes per project.</p>
                    <p><span className="font-medium text-foreground">Real Example:</span> You forget to add Project #3 to the calendar. Your supervisor doesn't see it on the schedule. The client calls on the scheduled start date asking where your crew is. Embarrassing scramble ensues, you send whoever's available, not the optimal crew. Client perceives you as disorganized.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Creating a project with date range + assigned employees automatically populates calendar entries. Color-coded project bars show scheduling conflicts instantly. Drag-and-drop editing syncs back to project assignments in real-time.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Zero redundant data entry. Impossible to forget calendar entries. Schedule automatically reflects project reality. 5-10 hours/week saved. No more "Oh shit, I forgot to schedule that" emergencies.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-5" className={`border rounded-lg px-4 ${openItems.includes("owner-5") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">"I'm guessing which techs are available next week"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You need to quote a new project starting Monday. You think Tommy is finishing Tower A on Friday, but you're not certain. Sarah might be on vacation? You're not sure if you have enough crew capacity, so you either: (A) Decline the work (lost revenue) or (B) Commit and hope (risk overcommitting and disappointing clients).</p>
                    <p><span className="font-medium text-foreground">Real Example:</span> You confidently quote a project for next week, then realize you double-booked Tommy on two simultaneous jobs 40 km apart. You either pull him off one project (angry client A) or scramble to find last-minute coverage at premium rates (angry client B + unexpected labor costs).</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Calendar view with employee availability filters, color-coded project bars spanning multiple days, and automatic conflict detection. System flags when techs are double-booked or when projects lack assigned crew. "Tommy: Available Dec 10-15, Assigned Dec 16-20, Vacation Dec 21-23."</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Confidently commit to new work based on real availability. Optimize crew utilization (eliminate idle time). Prevent double-booking disasters that cost $2,000-$5,000 in emergency coverage.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-6" className={`border rounded-lg px-4 ${openItems.includes("owner-6") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">"I have no idea how long this type of job should take"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>A client asks you to quote a 15-story window wash. How many days? How many techs? You completed a similar job six months ago, but you can't remember if it took 9 days or 14 days. You can't find your notes. You guess conservatively (overbid, lose contract) or aggressively (underbid, lose money).</p>
                    <p><span className="font-medium text-foreground">Real Example:</span> You quote 12 days for a building wash based on gut feel. Historical data would have shown you averaged 8 days for similar buildings (4.2 drops/day average). You overbid by 50%, client goes with competitor. You leave $18,000 on the table.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Searchable project archive with filters (date range, building type, job type, completion status). Analytics dashboard showing average drops/day by job type, labor hours per elevation, and project duration trends. "Similar Projects: 15-20 story window washes averaged 9.3 days, 2.4 techs, 4.1 drops/day."</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Data-driven quoting (15-20% more accurate pricing). Faster quote preparation (75% time saved, from 45 minutes to 10 minutes). Win more contracts with competitive pricing while protecting margins. Prevent 3-5 underbids/year = $6,000-$10,000 saved.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-7" className={`border rounded-lg px-4 ${openItems.includes("owner-7") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">"My brain is my business, and it's exhausted"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You're mentally tracking: Which projects are behind schedule and need attention. Who's assigned to which building tomorrow. Which clients owe invoices and when to follow up. Which technicians are approaching overtime thresholds. Which buildings need safety documentation before work can start. When equipment inspections are due. Resident complaints that need responses.</p>
                    <p>This cognitive overload leads to: Forgetting important details (missed deadlines, forgotten promises). Making errors under pressure (scheduling conflicts, billing mistakes). Burnout and decision fatigue (can't think strategically by 2 PM). Inability to take vacation (business collapses without your mental database).</p>
                    <p><span className="font-medium text-foreground">Real Example:</span> You wake up at 3 AM wondering if you remembered to schedule Tommy for the Tower B project starting tomorrow. You check your phone. You didn't. You can't fall back asleep. This happens 3x per week. Your partner is frustrated. Your health suffers.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Unified system externalizes your mental database. Projects, schedules, payroll, safety docs, and client communications live in one place with automated reminders for critical tasks. "Tommy scheduled Tower B Dec 5-8" + "COI expires Dec 12, renew now" + "Unit 507 feedback awaiting response (2 days)."</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Psychological load reduced by 60-70%. Mental bandwidth freed for strategic thinking (business growth, marketing, relationship building, not firefighting). Confidence to delegate operations to supervisors. Ability to take actual vacations without midnight panic attacks. Better sleep. Happier family.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-8" className={`border rounded-lg px-4 ${openItems.includes("owner-8") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">"Building managers call me constantly asking 'How's it going?'"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>Your building manager client has no visibility into project progress. They're fielding resident questions ("When will you finish my elevation?") and have no answers. They call/text you 5-10 times per week asking for updates. You spend 3-4 hours per week on status calls instead of productive work, and you still sound vague because you don't have instant access to current progress either.</p>
                    <p><span className="font-medium text-foreground">Real Example:</span> Building manager calls Tuesday morning: "Mrs. Johnson in Unit 802 wants to know when you'll finish her elevation. She's having family visit this weekend." You don't have the answer immediately, you're at another job site. You have to check with your crew, call back later. Building manager perceives you as disorganized. Mrs. Johnson complains to strata council. Relationship strained.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Building manager portal with identical visibility to your internal dashboard. They log in anytime, see real-time progress by elevation, review before/after photo galleries, check upcoming schedules, and download safety documentation, without calling you. "South Elevation: 73% complete. Expected completion: Dec 8. View 47 progress photos."</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Status call volume drops 80% (from 8 calls/week to 1-2). Building managers perceive you as tech-savvy and professional, "most organized contractor we work with." Stronger client relationships. 15-25% higher contract renewal rates. Referrals to other buildings they manage.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Building Managers & Property Managers Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Building2 className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Building Managers & Property Managers</h3>
            </div>
            
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="manager-1" className={`border rounded-lg px-4 ${openItems.includes("manager-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">"Residents bombard me with 'When will you be done?' questions"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You receive 15-30 status calls per week during building maintenance projects. Residents assume the worst because they have no visibility. You become frustrated playing telephone between the contractor and 40 units. Your professional reputation suffers even though the crew is working efficiently.</p>
                    <p><span className="font-medium text-foreground">Real Example:</span> Unit 402 has a birthday party on Sunday and demands the crew not work near their windows that day. They call you at 8 PM on Friday with this restriction. You scramble to contact the contractor, who then reschedules their crew, 2 hours of chaos that could have been avoided.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Resident-facing portal showing real-time progress (4-elevation visual system), upcoming work schedules ("We'll be near your unit Wednesday 9am-3pm"), and expected completion dates. Residents submit feedback directly without you as middleman.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Your time saved (20+ hours/month per active project). Resident complaints drop 60-70%. The contractor looks professional and transparent. Contract renewals increase 15-25%.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="manager-2" className={`border rounded-lg px-4 ${openItems.includes("manager-2") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">"I have no direct visibility into contractor progress"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You've hired a rope access company to complete window washing. You have no way to verify they're actually working efficiently or meeting timeline commitments without physically visiting the building or constantly calling the company owner. When residents or building owners ask for updates, you're reliant on the contractor's word.</p>
                    <p><span className="font-medium text-foreground">Real Example:</span> Building owner asks: "How's the window washing project going? Are they on track to finish by month-end?" You have to say "I'll call them and find out" instead of "Let me check the portal, they're 68% complete, ahead of schedule."</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Self-service portal access showing the exact same dashboard the rope access company sees. Real-time progress, crew assignments, safety documentation, photo documentation, all at your fingertips.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Answer resident and owner questions instantly without contractor contact. Verify contractor performance objectively. Build confidence in your vendor selection. Demonstrate professional property management through technology adoption.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Building Residents Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <HomeIcon className="w-5 h-5 text-teal-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Building Residents</h3>
            </div>
            
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="resident-1" className={`border rounded-lg px-4 ${openItems.includes("resident-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">"I have no idea when they'll finish MY elevation"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>There are workers hanging on ropes outside your building. You don't know when they'll be near your unit. You don't know if they're behind schedule or ahead. You're planning a family gathering this weekend but don't know if there will be strangers outside your windows. Your only option is to call the property manager repeatedly.</p>
                    <p><span className="font-medium text-foreground">Real Example:</span> You have a birthday party on Sunday. You want to make sure the rope access crew won't be working outside your unit that day (south elevation, 8th floor). You call the property manager. They don't know. They call the rope access company. It takes 2 days to get an answer. By then, you've already worried for 48 hours.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Resident portal showing progress specific to YOUR elevation. "South Elevation: 45% complete. Expected to reach your floor (8th) on Thursday Dec 12. Entire elevation complete by Dec 15." Schedule shows they won't be working Sunday.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Peace of mind through transparency. Plan your life around construction schedules. Submit feedback directly if issues arise. No need to bother property manager for basic status updates.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Rope Access Technicians Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Wrench className="w-5 h-5 text-orange-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Rope Access Technicians</h3>
            </div>
            
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="tech-1" className={`border rounded-lg px-4 ${openItems.includes("tech-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">"I don't know what my daily target is"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You show up to the job site. You start working. You're not sure if you're working fast enough or too slow. Are you meeting expectations? Will the boss be disappointed? You have no benchmark to measure yourself against.</p>
                    <p><span className="font-medium text-foreground">Real Example:</span> You complete 3 drops in a day. You think that's good. Your supervisor seems frustrated when reviewing progress. Later you find out the target was 5 drops/day. Nobody told you. You feel blindsided.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Mobile app shows your assigned projects with clear daily targets. "Marina Towers - Window Cleaning. Your target: 5 drops/day. Yesterday you completed: 4 drops."</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Clear expectations. Self-manage your pace. Know if you're on track before supervisor feedback. Feel confident you're meeting standards.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className={`border rounded-lg px-4 ${openItems.includes("tech-2") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">"I have no visibility into my own performance"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You're working hard, but you have no idea how you compare to other technicians or to your own past performance. Are you improving? Are you falling behind? You get vague feedback from supervisors ("doing good" or "need to pick up the pace") but no concrete data.</p>
                    <p><span className="font-medium text-foreground">Real Example:</span> Annual review time. Supervisor says "Your performance has been inconsistent this year." You're confused, you felt like you worked hard. No objective data to reference. You don't know what to improve.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Performance dashboard showing your drops/day average, target achievement rate, historical trends. "This month: 4.8 drops/day average, 86% target achievement. Last month: 4.1 drops/day, 72% target achievement. You're improving!"</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Objective self-assessment. Recognition for improvement. Clear areas for growth. Fair performance reviews based on data, not perception.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-3" className={`border rounded-lg px-4 ${openItems.includes("tech-3") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">"I don't know where I'm working tomorrow"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>You finish work today. You ask your supervisor "Where am I working tomorrow?" They say "I'll text you tonight." 9 PM rolls around, no text. You text them. They're busy. You go to bed not knowing where to show up in the morning. 6 AM you get a text: "Marina Towers, be there by 7:30."</p>
                    <p><span className="font-medium text-foreground">Real Example:</span> You show up to the wrong building because you misunderstood yesterday's hurried verbal instructions. You waste 45 minutes driving to the correct site. You start late. Your supervisor is frustrated. Your day is off to a bad start.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Mobile app shows your upcoming assignments. "Tomorrow: Marina Towers - Window Cleaning, 8:00 AM - 4:00 PM. Thursday: Ocean View Apartments - Caulking, 8:00 AM - 4:00 PM."</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Plan your commute the night before. Know what equipment to bring. No confusion or miscommunication. Professional clarity about your schedule.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Additional Problems Solved Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl md:text-2xl font-semibold">Additional Problems Solved</h3>
            </div>
            
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="add-1" className={`border rounded-lg px-4 ${openItems.includes("add-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Inconsistent Project Tracking</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>Manual progress tracking leads to guesswork and outdated information. Different people have different versions of project status.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> OnRopePro provides automatic, real-time progress measurement based on work session entries. Everyone (company, employees, clients, residents) sees the same accurate data.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Single source of truth for all stakeholders.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="add-2" className={`border rounded-lg px-4 ${openItems.includes("add-2") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Missing Project Schedules</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>Without calendar integration, project timelines exist only in your head or scattered across multiple tools.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> OnRopePro automatically generates visual schedules showing project duration, crew assignments, and conflicts, all synchronized with actual project data.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Automatic calendar sync eliminates manual scheduling.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="add-3" className={`border rounded-lg px-4 ${openItems.includes("add-3") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Disconnected Safety Documentation</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>Safety docs, schedules, and worker assignments scattered across emails, Google Drive, and paper files.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> OnRopePro links all safety documentation (Rope Access Plans, Toolbox Meetings, Anchor Inspections) directly to the relevant project. Property managers access compliance documents instantly through their portal.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Project-linked safety docs accessible to all stakeholders.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="add-4" className={`border rounded-lg px-4 ${openItems.includes("add-4") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Manual Payroll Data Entry</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>Transcribing timesheets and drop counts from paper or texts into payroll software wastes hours and introduces errors.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> Technicians log work sessions with project-specific tracking (drops, hours, units). This data automatically feeds payroll calculations, no manual timesheet transcription.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Eliminates 87-93% of payroll errors. Saves 15-25 hours/week for 10-15 person crews.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="add-5" className={`border rounded-lg px-4 ${openItems.includes("add-5") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-left font-medium text-base">Unclear Project Status</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                    <p>"How's the project going?" shouldn't require a phone call, site visit, or guesswork.</p>
                    <p><span className="font-medium text-foreground">Solution:</span> OnRopePro's visual progress system (4-elevation tracking for multi-sided buildings) shows completion percentage, photos, and remaining work at a glance. Accessible to company owners, supervisors, building managers, and residents, each with appropriate permission levels.</p>
                    <p><span className="font-medium text-foreground">Benefit:</span> Role-based visibility for all stakeholders.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator />

        {/* Performance & Productivity Gains */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              Performance & Productivity Gains
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              Measurable improvements that directly impact your bottom line.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-base">Employee Productivity Visibility</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600 mb-2">15-25%</div>
                <p className="text-sm text-muted-foreground">Improvement through performance tracking. See who's crushing it and who needs coaching, backed by objective data, not gut feeling.</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-base">Crew Utilization Optimization</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600 mb-2">10-15%</div>
                <p className="text-sm text-muted-foreground">Reduction in idle time through better scheduling. No more techs sitting around waiting for assignments or showing up to the wrong site.</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-base">Project Completion Speed</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600 mb-2">20-30%</div>
                <p className="text-sm text-muted-foreground">Faster completion through coordination and accountability. Clear targets, real-time tracking, and visible performance create natural motivation.</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-base">Quote-to-Project Cycle Time</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600 mb-2">75%</div>
                <p className="text-sm text-muted-foreground">Reduction in quote preparation time, from 45 minutes to 10 minutes. Historical data makes estimating fast and accurate.</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Annual Revenue Impact
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-white dark:bg-emerald-900 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Additional Revenue (More Projects/Year)</p>
                  <p className="text-2xl font-bold text-emerald-600">$100K - $200K</p>
                  <p className="text-xs text-muted-foreground mt-1">20-25% more projects completed annually</p>
                </div>
                <div className="p-4 bg-white dark:bg-emerald-900 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Labor Cost Reduction</p>
                  <p className="text-2xl font-bold text-emerald-600">$50K - $75K</p>
                  <p className="text-xs text-muted-foreground mt-1">Better crew utilization eliminates waste</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Client Relationship Benefits */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Client Relationship Benefits
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              Build trust and retain clients through professional transparency.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">60-70%</div>
                <p className="font-medium text-sm">Resident Complaint Reduction</p>
                <p className="text-xs text-muted-foreground mt-1">Self-service portal eliminates "When will you be done?" calls</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">15-25%</div>
                <p className="font-medium text-sm">Contract Renewal Increase</p>
                <p className="text-xs text-muted-foreground mt-1">Professional transparency builds lasting relationships</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">30-40%</div>
                <p className="font-medium text-sm">More Referrals</p>
                <p className="text-xs text-muted-foreground mt-1">Happy building managers tell their colleagues</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">20+ hrs</div>
                <p className="font-medium text-sm">Manager Time Saved</p>
                <p className="text-xs text-muted-foreground mt-1">Per month per active project</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3">Contract Retention Value</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Lost Contract Impact</p>
                    <p className="text-sm text-muted-foreground">Each lost contract = $30K-$50K annual revenue loss</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Protected Revenue</p>
                    <p className="text-sm text-muted-foreground">15-25% higher retention = 4-6 additional renewals/year = <span className="font-bold text-blue-600">$200K protected revenue</span></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <p className="italic text-muted-foreground">"Most professional contractor we work with"</p>
              <p className="text-sm font-medium mt-2">,  What building managers say about OnRopePro users</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Module Integration Points */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
              <Layers className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              Module Integration Points
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              Projects are the operational orchestration hub connecting multiple OnRopePro modules. Everything is linked with everything.
            </p>
          </div>

          <Card className="bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800 mb-4">
            <CardContent className="pt-6">
              <p className="italic">"Everything is linked with everything. If you do one thing, it does something else for you somewhere else. Like the guys work, but it fills the payroll."</p>
              <p className="text-sm font-medium mt-2 text-muted-foreground">,  Core OnRopePro design philosophy</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-600" />
                  <CardTitle className="text-base">Employee Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Crew assignments pull from employee directory with qualification filtering (IRATA Level, certifications). Performance metrics generated from project work sessions.</p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Ensure qualified crew assigned for safety + client confidence</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-violet-600" />
                  <CardTitle className="text-base">Payroll & Time Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Work sessions auto-populate payroll timesheets. Drop counts, hours, or units convert to wages automatically. Piece-work rates calculated.</p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">87-93% payroll error reduction</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-violet-600" />
                  <CardTitle className="text-base">Safety & Compliance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Project-specific Rope Access Plans, Toolbox Meetings, and Anchor Inspections linked directly. Building managers download safety docs instantly.</p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>10-20% insurance premium discount potential</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-violet-600" />
                  <CardTitle className="text-base">Scheduling & Calendar</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Project creation automatically generates calendar entries. Drag-and-drop editing syncs back to projects. Conflict detection across all assignments.</p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">5-10 hours/week saved on scheduling</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-violet-600" />
                  <CardTitle className="text-base">Feedback Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Residents submit feedback tied to specific projects. Building managers see feedback in project context. Company responses visible to all stakeholders.</p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">60-70% reduction in complaint volume</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-violet-600" />
                  <CardTitle className="text-base">Analytics & Reporting</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Historical project data feeds quote accuracy models. Performance trends identify training opportunities. Profitability analysis per project type.</p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">15-20% more accurate quoting</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Job Types and Their Tracking Methods
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base">The platform supports multiple job types, each optimized for specific building maintenance work:</p>

          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-action-600">Drop-Based</Badge>
                  <CardTitle className="text-base">Elevation Tracking Jobs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <p className="text-muted-foreground">Progress is tracked by counting "drops" (vertical passes down the building) for each compass direction.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="material-icons text-action-600 text-lg">window</span>
                    <div>
                      <p className="font-medium text-xs">Window Cleaning</p>
                      <p className="text-xs text-muted-foreground">High-rise windows</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Wind className="w-4 h-4 text-action-600" />
                    <div>
                      <p className="font-medium text-xs">Ext. Dryer Vent</p>
                      <p className="text-xs text-muted-foreground">Exterior cleaning</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Droplets className="w-4 h-4 text-action-600" />
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

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">Hours-Based</Badge>
                  <CardTitle className="text-base">Time Tracking Jobs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
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

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-600">Unit-Based</Badge>
                  <CardTitle className="text-base">Unit/Stall Tracking Jobs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
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

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-violet-600">Custom</Badge>
                  <CardTitle className="text-base">Custom Job Types</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
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
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
            Creating a New Project
          </h2>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <CardTitle>Step-by-Step Project Creation</CardTitle>
                <Badge variant="outline">Requires: Company or Ops Manager</Badge>
              </div>
            </CardHeader>
            <CardContent className="text-base space-y-4">
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
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-action-600 dark:text-action-400" />
            Progress Tracking Deep Dive
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-2 border-blue-200 dark:border-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Compass className="w-4 h-4 text-action-600" />
                  Drop-Based Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded space-y-2">
                  <p className="font-semibold text-xs">Example Calculation:</p>
                  <div className="text-xs space-y-1">
                    <p>North: 8/12 drops = 67%</p>
                    <p>East: 6/8 drops = 75%</p>
                    <p>South: 4/12 drops = 33%</p>
                    <p>West: 8/8 drops = 100%</p>
                  </div>
                  <div className="border-t pt-2">
                    <p className="font-bold text-xs">Overall: 26/40 drops = 65%</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">Progress is weighted by the total drops on each elevation. Larger elevations contribute more to overall percentage.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  Hours-Based Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded space-y-2">
                  <p className="font-semibold text-xs">End-of-Session Entry:</p>
                  <div className="text-xs space-y-1">
                    <p>Hours worked: 6.5 hours</p>
                    <p>Completion estimate: 45%</p>
                  </div>
                  <div className="border-t pt-2">
                    <p className="font-bold text-xs">Project: 45% complete</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">Worker manually enters completion percentage. Hours are tracked for payroll but don't determine progress.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 dark:border-amber-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <HomeIcon className="w-4 h-4 text-amber-600" />
                  Unit-Based Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded space-y-2">
                  <p className="font-semibold text-xs">Example: Dryer Vent Cleaning</p>
                  <div className="text-xs space-y-1">
                    <p>Total suites: 120</p>
                    <p>Completed today: 15</p>
                    <p>Cumulative: 45 suites</p>
                  </div>
                  <div className="border-t pt-2">
                    <p className="font-bold text-xs">Progress: 45/120 = 37.5%</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">Simple count-based tracking. Daily target helps measure productivity.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-violet-200 dark:border-violet-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-violet-600" />
                  Target Achievement
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="bg-violet-50 dark:bg-violet-950 p-3 rounded space-y-2">
                  <p className="font-semibold text-xs">Performance Tracking:</p>
                  <div className="text-xs space-y-1">
                    <p>Daily target: 10 drops</p>
                    <p>Actual: 12 drops</p>
                    <p>Achievement: 120%</p>
                  </div>
                  <div className="border-t pt-2">
                    <p className="font-bold text-xs">Status: Above Target</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">Targets help identify high performers and flag when projects are falling behind schedule.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-action-600 dark:text-action-400" />
            Calendar Integration
          </h2>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-action-600" />
                    Automatic Scheduling
                  </h4>
                  <p className="text-base text-muted-foreground">When you create a project with start/end dates, it automatically appears on the company calendar as a colored bar spanning those days.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-action-600" />
                    Crew Visibility
                  </h4>
                  <p className="text-base text-muted-foreground">Assigned employees see their scheduled projects on their personal calendar view. No more texting to ask "Where am I working tomorrow?"</p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Calendar Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    Multi-day project bars with color coding by job type
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    Filter by employee to see individual workload
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    Drag-and-drop rescheduling (coming soon)
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    Conflict detection when employees are double-booked
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-action-600 dark:text-action-400" />
            Linked Documentation
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Safety Documents</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground space-y-2">
                <p>Each project can have linked safety documentation:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Rope Access Plans (RAP)</li>
                  <li>Job Safety Analyses (JSA)</li>
                  <li>Toolbox Meeting records</li>
                  <li>Anchor inspection reports</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Work Session Logs</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground space-y-2">
                <p>Complete history of work performed:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Date, time, duration of each session</li>
                  <li>Employee who performed the work</li>
                  <li>Progress recorded (drops, percentage, units)</li>
                  <li>Notes and observations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-action-600 dark:text-action-400" />
            Project Settings & Management
          </h2>

          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Status Transitions</CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">Draft</Badge>
                  <ArrowRight className="w-4 h-4" />
                  <Badge className="bg-action-600">Active</Badge>
                  <ArrowRight className="w-4 h-4" />
                  <Badge className="bg-amber-600">On Hold</Badge>
                  <span className="text-muted-foreground">or</span>
                  <Badge className="bg-green-600">Completed</Badge>
                  <ArrowRight className="w-4 h-4" />
                  <Badge variant="secondary">Archived</Badge>
                </div>
                <p className="text-muted-foreground mt-3">Projects can be paused (On Hold) for weather, client requests, or scheduling conflicts. Completed projects are automatically archived after 30 days.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Editing Projects</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                <p>After creation, you can modify:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Schedule dates (affects calendar)</li>
                  <li>Assigned employees</li>
                  <li>Targets and scope (drops, hours, units)</li>
                  <li>Building details</li>
                </ul>
                <p className="mt-2">Note: Changing job type after work has been logged is not recommended as it changes how progress is calculated.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Soft Delete
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                <p>Deleted projects are soft-deleted (marked as inactive) rather than permanently removed. This preserves historical data for reporting and payroll. Admins can restore accidentally deleted projects.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-action-600 dark:text-action-400" />
            Project Archive & Analytics
          </h2>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground">Completed projects are automatically archived but remain searchable for future reference and analytics.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Search & Filter</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>By building name or address</li>
                    <li>By job type</li>
                    <li>By date range</li>
                    <li>By assigned employees</li>
                    <li>By completion status</li>
                  </ul>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Analytics</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Average drops/day by job type</li>
                    <li>Employee productivity comparisons</li>
                    <li>Project duration trends</li>
                    <li>Target achievement rates</li>
                    <li>Labor hours per building type</li>
                  </ul>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-action-50 dark:bg-action-950">
                <p className="font-semibold flex items-center gap-2 text-action-900 dark:text-action-100">
                  <Brain className="w-4 h-4" />
                  Historical Data = Better Quotes
                </p>
                <p className="text-sm mt-2 text-action-900 dark:text-action-100">Use archived project data to estimate future jobs more accurately. "Last time we did a 20-story window wash, it took 14 days with 2 techs averaging 8 drops/day."</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Eye className="w-5 h-5 text-action-600 dark:text-action-400" />
            Resident & Building Manager Portal
          </h2>

          <Card className="border-2 border-action-500">
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground">Building managers and residents can access a read-only view of project progress without needing to log in to the main system.</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-action-600" />
                  <p className="font-semibold">Live Progress</p>
                  <p className="text-base text-muted-foreground">4-direction completion visualization</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-action-600" />
                  <p className="font-semibold">Schedule View</p>
                  <p className="text-base text-muted-foreground">Upcoming work dates</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-action-600" />
                  <p className="font-semibold">Feedback</p>
                  <p className="text-base text-muted-foreground">Submit comments directly</p>
                </div>
              </div>

              <p className="text-base text-muted-foreground">This transparency reduces status calls by 80% and improves client satisfaction scores significantly.</p>
            </CardContent>
          </Card>
        </section>

        <div className="pt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">Need help with project management?</p>
          <Link href="/changelog">
              <Button  className="w-full ">

            View All Documentation
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
            </Link>
        </div>

      </div>
    </ChangelogGuideLayout>
  );
}
