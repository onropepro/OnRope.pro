import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import {
  Package,
  Database,
  Users,
  Barcode,
  CheckCircle2,
  AlertCircle,
  Share2,
  Trash2,
  Clock,
  Shield,
  Zap,
  ChevronRight,
  Plus,
  ArrowRight,
  UserCheck,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InventoryGuide() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="text-xl font-bold">Inventory System Guide</h1>
              <p className="text-xs text-muted-foreground">Complete documentation on equipment tracking</p>
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
              <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Inventory System Overview
            </h2>
            <p className="text-muted-foreground">
              The inventory system provides comprehensive equipment tracking and management for rope access companies. It supports both serial-tracked gear and bulk items, enabling real-time availability visibility and seamless assignment workflows.
            </p>
          </div>
        </section>

        <Separator />

        {/* Core Concepts */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Core Concepts
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Inventory Quantity</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>The <strong>total count</strong> of gear items your company owns in inventory.</p>
                <p className="text-muted-foreground">Example: Your company owns 10 harnesses total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Assigned Quantity</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>The <strong>number of items</strong> assigned to employees through the gear assignments system.</p>
                <p className="text-muted-foreground">Example: 2 harnesses are currently assigned</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Available Slots</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><strong>Available = Total - Assigned</strong></p>
                <p className="text-muted-foreground">Example: 10 - 2 = 8 harnesses available for assignment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Serial Numbers</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><strong>Optional unique identifiers</strong> for individual gear pieces (important for high-value items).</p>
                <p className="text-muted-foreground">Example: Track specific harness S/N: HR-2025-001</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* How It Works */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            How It Works
          </h2>

          <div className="space-y-4">
            {/* Step 1 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600">Step 1</Badge>
                    <CardTitle>Add Gear to Inventory</CardTitle>
                  </div>
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p><strong>Who:</strong> Company owners and managers</p>
                <p><strong>What:</strong> Create new inventory items with equipment type, brand, model, and quantity</p>
                <div className="bg-muted p-3 rounded-md space-y-1 text-xs">
                  <p><strong>Optional:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Register serial numbers for tracking high-value gear</li>
                    <li>Set item price for financial tracking</li>
                    <li>Add notes or special information</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">Step 2</Badge>
                    <CardTitle>Manager Assigns to Employees</CardTitle>
                  </div>
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p><strong>Who:</strong> Company owners and managers with assign permissions</p>
                <p><strong>What:</strong> Assign gear to employees using the manager-assign dialog</p>
                <div className="bg-muted p-3 rounded-md space-y-1 text-xs">
                  <p><strong>Options:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Select an employee</li>
                    <li>Choose quantity to assign</li>
                    <li>Optionally assign a specific serial number</li>
                    <li>Set date of manufacture and in-service dates</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600">Step 3</Badge>
                    <CardTitle>Self-Assign (Optional)</CardTitle>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p><strong>Who:</strong> Any employee</p>
                <p><strong>What:</strong> Employees can self-assign available gear from the "My Gear" page</p>
                <div className="bg-muted p-3 rounded-md space-y-1 text-xs">
                  <p><strong>Benefits:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Employees take ownership of gear selection</li>
                    <li>Reduces manager workload</li>
                    <li>Track which specific items (serial numbers) each technician uses</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-600">Step 4</Badge>
                    <CardTitle>Track & Manage</CardTitle>
                  </div>
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p><strong>Who:</strong> All users</p>
                <p><strong>What:</strong> Real-time visibility of assignments and availability</p>
                <div className="bg-muted p-3 rounded-md space-y-1 text-xs">
                  <p><strong>Visibility:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Managers see inventory dashboard with availability metrics</li>
                    <li>Employees see their assigned gear and available items</li>
                    <li>Serial numbers tracked for compliance and auditing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Two Assignment Methods */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Two Assignment Methods
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Manager Assign */}
            <Card className="border-2 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950">
              <CardHeader>
                <CardTitle className="text-lg text-green-900 dark:text-green-100">
                  Manager Assigns
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-green-900 dark:text-green-100 space-y-3">
                <p><strong>Access:</strong> Company owners, managers with permissions</p>
                <p><strong>Where:</strong> Inventory page → Edit item → Manager Assign tab</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Assign to specific employees</li>
                  <li>Set quantities per employee</li>
                  <li>Track serial numbers per person</li>
                  <li>Set item-specific dates</li>
                </ul>
                <p className="text-xs font-semibold">Best for: Controlled distribution by management</p>
              </CardContent>
            </Card>

            {/* Self-Assign */}
            <Card className="border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900 dark:text-blue-100">
                  Self-Assign
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-900 dark:text-blue-100 space-y-3">
                <p><strong>Access:</strong> Any employee</p>
                <p><strong>Where:</strong> My Gear page → Add Gear from Inventory</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Pick available gear items</li>
                  <li>Choose specific serials (if available)</li>
                  <li>Set personal item dates</li>
                  <li>Manage your own equipment kit</li>
                </ul>
                <p className="text-xs font-semibold">Best for: Employee choice and flexibility</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Customer Journey Visualization */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LogIn className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Customer Journey
          </h2>

          <div className="space-y-6">
            {/* Manager Journey */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-green-700 dark:text-green-300">Manager Journey</h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Add Gear</p>
                      <p className="text-xs text-muted-foreground">Create inventory items</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-green-600 dark:text-green-400 md:mx-2 rotate-90 md:rotate-0" />

                  {/* Step 2 */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Assign to Employees</p>
                      <p className="text-xs text-muted-foreground">Distribute with control</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-green-600 dark:text-green-400 md:mx-2 rotate-90 md:rotate-0" />

                  {/* Step 3 */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Monitor & Track</p>
                      <p className="text-xs text-muted-foreground">View real-time status</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Employee Journey */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-300">Employee Journey</h3>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">View Available</p>
                      <p className="text-xs text-muted-foreground">Browse inventory</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 md:mx-2 rotate-90 md:rotate-0" />

                  {/* Step 2 */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Self-Assign Gear</p>
                      <p className="text-xs text-muted-foreground">Pick your equipment</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 md:mx-2 rotate-90 md:rotate-0" />

                  {/* Step 3 */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">View My Gear</p>
                      <p className="text-xs text-muted-foreground">Manage assignments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Key Features */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
            Key Features
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <Barcode className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Serial Number Tracking</p>
                <p className="text-sm text-muted-foreground">Track individual high-value items with unique serial numbers for compliance and auditing</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Real-Time Availability</p>
                <p className="text-sm text-muted-foreground">Available slots = Total Quantity - Assigned Quantity (calculated in real-time)</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Flexible Assignment</p>
                <p className="text-sm text-muted-foreground">Manager-driven or self-service assignment workflows based on permissions</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Date Tracking</p>
                <p className="text-sm text-muted-foreground">Record date of manufacture and in-service dates for maintenance planning</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Remove Assignments</p>
                <p className="text-sm text-muted-foreground">Employees can remove their own assignments; managers can revoke any assignment</p>
              </div>
            </div>

            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Out of Service</p>
                <p className="text-sm text-muted-foreground">Mark items as out of service to prevent them from being assigned</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Workflow Example */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Workflow Example</h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scenario: Company Owner Manages Harness Equipment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2">
                <p className="font-semibold text-green-700 dark:text-green-300">✓ Day 1: Add to Inventory</p>
                <p className="ml-4">Manager goes to Inventory → Creates new "Harness" item with Quantity: 10, Registers 10 serial numbers (HR-001 to HR-010)</p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-green-700 dark:text-green-300">✓ Day 2: Assign to Technicians</p>
                <p className="ml-4">Manager assigns 2 harnesses to "Employee A" with serials HR-001 and HR-002, assigns 1 harness to "Employee B" with serial HR-003</p>
                <p className="ml-4">Status now: 3 assigned, 7 available</p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-green-700 dark:text-green-300">✓ Day 3: Additional Assignment</p>
                <p className="ml-4">Employee C goes to My Gear page, sees Harness with 7 available slots, self-assigns 1 harness (HR-004)</p>
                <p className="ml-4">Status now: 4 assigned, 6 available</p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-green-700 dark:text-green-300">✓ Employee View</p>
                <p className="ml-4">Employee A sees "My Gear" showing 2 harnesses assigned, each with its serial number and any relevant dates</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Important Notes */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Important Notes
          </h2>

          <div className="space-y-3">
            <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
              <CardContent className="pt-6 text-sm text-amber-900 dark:text-amber-100 space-y-2">
                <p><strong>Availability Calculation:</strong> The system uses a slot-based model. Available slots = Total Quantity - Total Assigned (regardless of serial registration status).</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
              <CardContent className="pt-6 text-sm text-blue-900 dark:text-blue-100 space-y-2">
                <p><strong>Serial Numbers:</strong> Optional but recommended for high-value items. Normalization (trim + uppercase) prevents duplicate entries.</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950">
              <CardContent className="pt-6 text-sm text-green-900 dark:text-green-100 space-y-2">
                <p><strong>Multiple Assignments:</strong> An employee can have multiple assignments for the same gear item type (e.g., 2 separate harness assignments).</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950">
              <CardContent className="pt-6 text-sm text-purple-900 dark:text-purple-100 space-y-2">
                <p><strong>Permissions:</strong> View, manage, and assign permissions control who can access and modify inventory. Check your role settings.</p>
              </CardContent>
            </Card>
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
              onClick={() => navigate("/inventory")}
            >
              <div className="text-left">
                <div className="font-semibold">Go to Inventory</div>
                <div className="text-xs text-muted-foreground">Manage your equipment</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline" 
              className="justify-between h-auto p-4"
              onClick={() => navigate("/my-gear")}
            >
              <div className="text-left">
                <div className="font-semibold">My Gear</div>
                <div className="text-xs text-muted-foreground">View your assigned equipment</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <Card className="border-muted bg-muted/50">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            <p>Last updated: December 2, 2025 | Version 2.0</p>
            <p>For questions or issues, contact your operations manager.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
