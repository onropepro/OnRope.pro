import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import {
  MapPin,
  Navigation,
  Clock,
  Users,
  Database,
  ArrowRight,
  Lock,
  Eye,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Building2,
  Smartphone,
  Shield,
  Target,
  Map,
  Compass,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GPSGuide() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton to="/changelog" />
            <div>
              <h1 className="text-xl font-bold">GPS & Location Services Guide</h1>
              <p className="text-xs text-muted-foreground">Location tracking and geofencing features</p>
            </div>
          </div>
          <MainMenuButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
              <MapPin className="w-6 h-6 text-red-600 dark:text-red-400" />
              GPS & Location Services Overview
            </h2>
            <p className="text-muted-foreground">
              GPS tracking provides <strong>verified location data</strong> for time entries and workforce management. When employees clock in or out, their location is captured and stored with the time record, enabling site verification and accurate field work tracking.
            </p>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Shield className="w-5 h-5" />
                The Golden Rule: Location = Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-2xl font-mono font-bold">
                  GPS Data is Non-Editable
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Location data cannot be modified after capture.</strong> Key principles:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Immutable records</strong>: GPS coordinates are stored as-captured</li>
                  <li><strong>Privacy conscious</strong>: Location only captured at clock events</li>
                  <li><strong>Optional feature</strong>: Companies can disable GPS requirements</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Critical Understanding
                </p>
                <p className="mt-1">GPS location is captured ONLY at clock-in and clock-out moments. The system does NOT continuously track employee locations throughout the day.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Clock In</p>
                  <p className="font-bold">Location Captured</p>
                  <p className="text-lg font-mono">49.2827° N, 123.1207° W</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Clock Out</p>
                  <p className="font-bold">Location Captured</p>
                  <p className="text-lg font-mono">49.2827° N, 123.1207° W</p>
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
              <CardTitle className="text-lg flex items-center gap-2 text-green-900 dark:text-green-100">
                <CheckCircle2 className="w-5 h-5" />
                Problems Solved
              </CardTitle>
            </CardHeader>
            <CardContent className="text-green-900 dark:text-green-100">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Timesheet fraud:</strong> GPS coordinates verify employees are on-site when clocking in/out</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Disputed work locations:</strong> Immutable location records provide evidence for billing disputes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Privacy concerns:</strong> Point-in-time capture only at clock events, not continuous tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Map visualization:</strong> Interactive maps show work locations with building markers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Flexible requirements:</strong> Optional GPS feature can be enabled/disabled per company</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            System Architecture
          </h2>
          <p className="text-sm text-muted-foreground">The GPS system consists of these components:</p>

          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  1. Browser Geolocation API
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Uses the device's built-in location services via HTML5 Geolocation.</p>
                <div className="bg-muted p-3 rounded text-xs space-y-1">
                  <p><strong>Technical Details:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>High accuracy mode for precise coordinates</li>
                    <li>Requires user permission on first use</li>
                    <li>Works on mobile and desktop browsers</li>
                    <li>Fallback to IP-based location if GPS unavailable</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="w-4 h-4 text-green-600" />
                  2. Location Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>GPS coordinates stored with time entries in the database.</p>
                <div className="bg-muted p-3 rounded text-xs space-y-1">
                  <p><strong>Stored Data:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><code>clockInLatitude</code>, <code>clockInLongitude</code></li>
                    <li><code>clockOutLatitude</code>, <code>clockOutLongitude</code></li>
                    <li>Accuracy radius in meters</li>
                    <li>Timestamp of location capture</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Map className="w-4 h-4 text-purple-600" />
                  3. Map Visualization (Leaflet)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Interactive maps display employee locations for managers.</p>
                <div className="bg-muted p-3 rounded text-xs space-y-1">
                  <p><strong>Features:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Pin markers for each time entry</li>
                    <li>Building location overlay for reference</li>
                    <li>Click-to-zoom for precise location viewing</li>
                    <li>Mobile-responsive map controls</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            Permission Requirements
          </h2>
          <p className="text-sm text-muted-foreground">GPS feature access is controlled at multiple levels:</p>

          <div className="space-y-3">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                    <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Device Permission</p>
                      <Badge variant="secondary" className="text-xs">Browser Level</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">User must grant location access to the browser/app</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
                    <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">View Locations</p>
                      <Badge variant="secondary" className="text-xs">canViewEmployees</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Required to see other employees' clock-in/out locations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900 rounded-full p-2">
                    <Settings className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Configure GPS Settings</p>
                      <Badge variant="secondary" className="text-xs">isOwner</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Only company owners can enable/disable GPS requirements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Workflows
          </h2>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Workflow 1</Badge>
                  <CardTitle className="text-base">Clock In with GPS</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">Navigate to Clock In</p>
                      <p className="text-sm text-muted-foreground">Access from dashboard or quick action</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">Grant location permission (first time)</p>
                      <p className="text-sm text-muted-foreground">Browser prompts for location access</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">Select project and confirm</p>
                      <p className="text-sm text-muted-foreground">GPS coordinates captured automatically</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="font-medium">Location stored with time entry</p>
                      <p className="text-sm text-muted-foreground">Viewable on time entry details and reports</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Workflow 2</Badge>
                  <CardTitle className="text-base">View Employee Locations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">Navigate to Time Entries</p>
                      <p className="text-sm text-muted-foreground">Access via Dashboard or Time Tracking section</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">Select time entry with GPS data</p>
                      <p className="text-sm text-muted-foreground">Entries with location show map icon</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">View location on map</p>
                      <p className="text-sm text-muted-foreground">Interactive map shows exact clock-in/out positions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Navigation className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Customer Journeys
          </h2>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-red-700 dark:text-red-300">Field Technician Journey</h3>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 rounded-lg p-6 border border-red-200 dark:border-red-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Arrive at Site</p>
                      <p className="text-xs text-muted-foreground">Physical location</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-red-600 dark:text-red-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Clock In</p>
                      <p className="text-xs text-muted-foreground">GPS captured</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-red-600 dark:text-red-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Work</p>
                      <p className="text-xs text-muted-foreground">No tracking</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-red-600 dark:text-red-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Clock Out</p>
                      <p className="text-xs text-muted-foreground">GPS captured</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-300">Manager Review Journey</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Review Entries</p>
                      <p className="text-xs text-muted-foreground">Time tracking page</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Click Map Icon</p>
                      <p className="text-xs text-muted-foreground">View location</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Verify Site</p>
                      <p className="text-xs text-muted-foreground">Compare to building</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Approve/Flag</p>
                      <p className="text-xs text-muted-foreground">Take action</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Key Features Summary
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <Target className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">High Accuracy</p>
                <p className="text-sm text-muted-foreground">Precise GPS coordinates captured.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Privacy Focused</p>
                <p className="text-sm text-muted-foreground">Only captured at clock events.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Map className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Interactive Maps</p>
                <p className="text-sm text-muted-foreground">Visual location verification.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Immutable Records</p>
                <p className="text-sm text-muted-foreground">Location data cannot be edited.</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-bold">Quick Links</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="justify-between h-auto p-4"
              onClick={() => navigate("/time-tracking")}
              data-testid="link-time-tracking"
            >
              <div className="text-left">
                <div className="font-semibold">Time Tracking</div>
                <div className="text-xs text-muted-foreground">Clock in/out with GPS</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline" 
              className="justify-between h-auto p-4"
              onClick={() => navigate("/changelog/property-manager")}
              data-testid="link-property-manager-guide"
            >
              <div className="text-left">
                <div className="font-semibold">Property Manager Guide</div>
                <div className="text-xs text-muted-foreground">Vendor management interface</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>

        <Card className="border-muted bg-muted/50">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            <p><strong>Last updated:</strong> December 3, 2024 | <strong>Version:</strong> 1.0</p>
            <p className="mt-1">This document serves as the authoritative reference for GPS & Location Services.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
