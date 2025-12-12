import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  Users,
  Building2,
  Database,
  FileText,
  ArrowRight,
  Lock,
  Eye,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Info,
  Zap,
  Phone,
  Mail,
  MapPin,
  Hash,
  Layers,
  UserPlus,
  Briefcase,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CRMGuide() {
  return (
    <ChangelogGuideLayout 
      title="Client Relationship Management Guide"
      version="2.0"
      lastUpdated="December 5, 2025"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The CRM system provides centralized management of property managers, strata companies, and building owners. Each client can have multiple <strong>LMS (Land Management System) numbers</strong> representing different buildings they manage. Access it from the Clients section in your dashboard.
          </p>
        </section>

        {/* THE GOLDEN RULE */}
        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Database className="w-5 h-5" />
                The Golden Rule: Clients Carry Building Data
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  One Client = Multiple Buildings
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>The client-building relationship is hierarchical.</strong> Each client stores:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Contact Information</strong>: Name, phone, email, address</li>
                  <li><strong>LMS Numbers</strong>: Array of buildings with strata plans, addresses, and specs</li>
                  <li><strong>Billing Details</strong>: Separate billing address if different</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Autofill Intelligence
                </p>
                <p className="mt-1">When creating a new project, select a client from your CRM to <strong>auto-populate</strong> building details like strata plan number, address, floor count, and daily drop targets.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Client Record</p>
                  <p className="font-bold">Strata Corp Ltd</p>
                  <p className="text-lg font-mono">3 buildings</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Building 1</p>
                  <p className="font-bold">LMS 1234</p>
                  <p className="text-lg font-mono">25 floors</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Create Project</p>
                  <p className="font-bold">Auto-fills</p>
                  <p className="text-lg font-mono text-green-700 dark:text-green-300">All fields</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

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
                  <span><strong>Repeated data entry:</strong> Building specs auto-fill into new projects from client LMS records</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Scattered client information:</strong> Centralized database of clients with multiple building portfolios</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Lost building specifications:</strong> Floor counts, strata plans, and drop targets stored permanently</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Billing address confusion:</strong> Separate billing vs. service addresses per client</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Inconsistent project setup:</strong> Client selection populates correct building data automatically</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Client Data Structure */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Client Data Structure
          </h2>
          <p className="text-base text-muted-foreground">Each client record contains contact information and building portfolio:</p>

          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-action-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>Primary contact details for the client relationship.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Fields:</strong></p>
                  <div className="grid md:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      <span>First Name, Last Name</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3 h-3" />
                      <span>Company Name</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      <span>Phone Number</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>Address, Billing Address</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-green-600" />
                  LMS Numbers (Building Portfolio)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>Each LMS number represents a building the client manages. Store detailed building specs for autofill.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Per-Building Fields:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><code>number</code> - Strata plan / LMS number</li>
                    <li><code>buildingName</code> - Display name for the building</li>
                    <li><code>address</code> - Full street address</li>
                    <li><code>stories</code> - Total floor count</li>
                    <li><code>units</code> - Number of residential/commercial units</li>
                    <li><code>parkingStalls</code> - Parkade stall count</li>
                    <li><code>dailyDropTarget</code> - Expected drops per day</li>
                    <li><code>totalDropsNorth/East/South/West</code> - Elevation drop counts</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Client Creation Workflow */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Adding a New Client
          </h2>

          <div className="space-y-3">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-action-600 dark:text-action-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Enter Contact Details</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add the client's name, company, phone number, and primary address.
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
                  <div className="w-10 h-10 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-action-600 dark:text-action-400 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Add LMS Numbers / Buildings</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click "Add Building" to add each property the client manages. Enter strata plan number, address, floor count, and building specifications.
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
                  <div className="w-10 h-10 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-action-600 dark:text-action-400 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Configure Drop Targets (Optional)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      For rope access buildings, enter daily drop targets and elevation-specific counts. These auto-populate when creating window cleaning projects.
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
                    <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Client Saved</h3>
                    <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                      Client is now available for project creation. Select them when creating a new project to auto-fill building details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Autofill Feature */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            Autofill Intelligence
          </h2>
          <p className="text-base text-muted-foreground">Streamline project creation with automatic field population:</p>

          <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                      How Autofill Works
                    </p>
                    <p className="text-yellow-800 dark:text-yellow-200">
                      When creating a new project, select a client from the dropdown. If the client has LMS numbers configured, you can then select a specific building. The system automatically populates:
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white dark:bg-yellow-900 rounded p-3">
                    <p className="font-semibold text-yellow-900 dark:text-yellow-100">Auto-Filled Fields:</p>
                    <ul className="mt-2 space-y-1 text-yellow-800 dark:text-yellow-200">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        Strata Plan Number
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        Building Name
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        Building Address
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        Floor Count
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white dark:bg-yellow-900 rounded p-3">
                    <p className="font-semibold text-yellow-900 dark:text-yellow-100">For Rope Access Jobs:</p>
                    <ul className="mt-2 space-y-1 text-yellow-800 dark:text-yellow-200">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        Daily Drop Target
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        North/East/South/West Drops
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        Unit Count
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        Parking Stalls
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Permission Hierarchy */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            Permission Requirements
          </h2>
          <p className="text-base text-muted-foreground">Access to CRM features requires specific permissions:</p>

          <div className="space-y-3">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-action-100 dark:bg-action-900 rounded-full p-2">
                    <Eye className="w-4 h-4 text-action-600 dark:text-action-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">View Clients</p>
                      <Badge variant="secondary" className="text-xs">canViewClients</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Can view client list and details</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
                    <UserPlus className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Manage Clients</p>
                      <Badge variant="secondary" className="text-xs">canManageClients</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Can create, edit, and delete client records</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quick Reference */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Info className="w-5 h-5 text-action-600 dark:text-action-400" />
            Quick Reference
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Building Field</th>
                      <th className="text-left py-2 font-semibold">Purpose</th>
                      <th className="text-left py-2 font-semibold">Used For</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Strata Plan Number</td>
                      <td className="py-2">Unique building identifier</td>
                      <td className="py-2">Project creation, resident codes</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Building Name</td>
                      <td className="py-2">Display name</td>
                      <td className="py-2">All project displays</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Address</td>
                      <td className="py-2">Physical location</td>
                      <td className="py-2">Navigation, documentation</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Stories</td>
                      <td className="py-2">Floor count</td>
                      <td className="py-2">Dryer vent scheduling</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Daily Drop Target</td>
                      <td className="py-2">Expected drops/day</td>
                      <td className="py-2">Window cleaning projects</td>
                    </tr>
                    <tr>
                      <td className="py-2">Elevation Drops</td>
                      <td className="py-2">Per-side drop counts</td>
                      <td className="py-2">Progress tracking</td>
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
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Customer Journeys
          </h2>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-300">Manager Journey: Setting Up Client</h3>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Add Client</p>
                      <p className="text-xs text-muted-foreground">Enter contact details</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-action-600 dark:text-action-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Add Buildings</p>
                      <p className="text-xs text-muted-foreground">Configure LMS numbers</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-action-600 dark:text-action-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Set Drop Targets</p>
                      <p className="text-xs text-muted-foreground">Configure building specs</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-action-600 dark:text-action-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Create Projects</p>
                      <p className="text-xs text-muted-foreground">Autofill from client</p>
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
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Key Features Summary
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <Building2 className="w-5 h-5 text-action-600 dark:text-action-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Multi-Building Support</p>
                <p className="text-base text-muted-foreground">One client can manage unlimited buildings.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Autofill Intelligence</p>
                <p className="text-base text-muted-foreground">Auto-populate project details from client.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Hash className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">LMS Tracking</p>
                <p className="text-base text-muted-foreground">Strata plan numbers linked to buildings.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Layers className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Building Specifications</p>
                <p className="text-base text-muted-foreground">Store floors, units, parking stalls.</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Quick Links */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Quick Links</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/clients">
              <Button variant="outline" 
              className="w-full justify-between h-auto p-4"
              data-testid="link-clients">

              <div className="text-left">
                <div className="font-semibold">Go to Clients</div>
                <div className="text-xs text-muted-foreground">Manage client records</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
            </Link>

            <Link href="/changelog/resident-portal">
              <Button variant="outline" 
              className="w-full justify-between h-auto p-4"
              data-testid="link-resident-portal-guide">

              <div className="text-left">
                <div className="font-semibold">Resident Portal Guide</div>
                <div className="text-xs text-muted-foreground">Resident communication docs</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <Card className="border-muted bg-muted/50">
          <CardContent className="pt-6 text-base text-muted-foreground">
            <p><strong>Last updated:</strong> December 3, 2024 | <strong>Version:</strong> 1.0</p>
            <p className="mt-1">This document serves as the authoritative reference for the Client Relationship Management System.</p>
          </CardContent>
        </Card>
      </div>
    </ChangelogGuideLayout>
  );
}
