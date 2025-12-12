import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
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
  LogIn,
  Lock,
  Eye,
  Settings,
  UserPlus,
  Calculator,
  Hash,
  FileText,
  AlertTriangle,
  Info,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function InventoryGuide() {
  return (
    <ChangelogGuideLayout 
      title="Gear Inventory Management Guide"
      version="2.0"
      lastUpdated="December 5, 2025"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The inventory system provides centralized equipment tracking and management for rope access companies. It uses a <strong>slot-based availability model</strong> where equipment availability is calculated as Total Quantity minus Assigned Quantity. Serial numbers are optional metadata for tracking individual units.
          </p>
        </section>

        {/* THE GOLDEN RULE */}
        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Calculator className="w-5 h-5" />
                The Golden Rule: Slot-Based Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Available = Quantity - Assigned
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>This formula is absolute.</strong> Available slots are determined ONLY by:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Quantity</strong>: Total items your company owns (set on the gear item)</li>
                  <li><strong>Assigned</strong>: Sum of all assignment quantities for that item</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Critical Understanding
                </p>
                <p className="mt-1">Serial number registration has <strong>NO EFFECT</strong> on availability. You can have 10 items with quantity=10, only 2 registered serial numbers, and still have 10 available slots (if none are assigned).</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Example Item</p>
                  <p className="font-bold">Harnesses</p>
                  <p className="text-lg font-mono">Qty: 10</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total Assigned</p>
                  <p className="font-bold">To 3 employees</p>
                  <p className="text-lg font-mono">Assigned: 4</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Result</p>
                  <p className="font-bold">For new assignments</p>
                  <p className="text-lg font-mono text-green-700 dark:text-green-300">Available: 6</p>
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
                  <span><strong>Lost equipment tracking:</strong> Know exactly what gear your company owns and who has it at any time</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Over-allocation:</strong> Slot-based system prevents assigning more equipment than you own</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Certification expiry gaps:</strong> Automatic alerts when harnesses and gear approach expiration dates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Accountability issues:</strong> Clear assignment records show who received what equipment and when</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Manual spreadsheet chaos:</strong> Replace error-prone spreadsheets with a real-time database</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Three Tables Architecture */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            System Architecture: Three Tables
          </h2>
          <p className="text-base text-muted-foreground">The inventory system uses three interconnected database tables:</p>

          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="w-4 h-4 text-action-600" />
                  1. Gear Items (Inventory Catalog)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>The master list of equipment your company owns.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Key Fields:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><code>quantity</code> - Total count of this item type (the "slots")</li>
                    <li><code>equipmentType</code> - Category (harness, rope, descender, etc.)</li>
                    <li><code>brand</code>, <code>model</code> - Product identification</li>
                    <li><code>itemPrice</code> - Cost (only visible with financial permissions)</li>
                    <li><code>inService</code> - Whether item is available for use</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  2. Gear Assignments (Who Has What)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>Records of which employees have which equipment. Each assignment "consumes" slots from the gear item's quantity.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Key Fields:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><code>employeeId</code> - Who has the gear</li>
                    <li><code>quantity</code> - How many of this item they have</li>
                    <li><code>serialNumber</code> - Optional: which specific unit</li>
                    <li><code>dateOfManufacture</code>, <code>dateInService</code> - Per-assignment dates</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Barcode className="w-4 h-4 text-purple-600" />
                  3. Gear Serial Numbers (Optional Registry)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>A registry of individual serial numbers for high-value or regulated equipment. <strong>Completely optional</strong> - the system works without any serial numbers.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Key Fields:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><code>serialNumber</code> - Unique identifier for the unit</li>
                    <li><code>dateOfManufacture</code>, <code>dateInService</code> - Per-unit dates</li>
                    <li><code>isRetired</code> - Whether this specific unit is retired</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Permission Hierarchy */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            Permission Hierarchy (Four Levels)
          </h2>
          <p className="text-base text-muted-foreground">Access to inventory features is controlled by four distinct permissions:</p>

          <div className="space-y-3">
            {/* Level 1 */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                    <Eye className="w-4 h-4 text-action-600 dark:text-action-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Level 1: View Inventory</p>
                      <Badge variant="secondary" className="text-xs">canAccessInventory</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">See all gear items, their quantities, and availability. Access the Inventory page.</p>
                    <p className="text-xs mt-2"><strong>Who has it:</strong> All employees (automatically). NOT residents or property managers.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Level 2 */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
                    <Settings className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Level 2: Manage Inventory</p>
                      <Badge variant="secondary" className="text-xs">canManageInventory</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Add new gear items, edit quantities, register serial numbers, delete items.</p>
                    <p className="text-xs mt-2"><strong>Who has it:</strong> Company owners (always), employees with "manage_inventory" permission.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Level 3 */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-2">
                    <UserPlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Level 3: Assign Gear</p>
                      <Badge variant="secondary" className="text-xs">canAssignGear</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Assign equipment to ANY employee, edit or remove assignments for others.</p>
                    <p className="text-xs mt-2"><strong>Who has it:</strong> Company owners (always), employees with "assign_gear" permission.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Level 4 */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 dark:bg-orange-900 rounded-full p-2">
                    <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Level 4: View Team Gear</p>
                      <Badge variant="secondary" className="text-xs">canViewGearAssignments</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">See what gear ALL employees have (Team Gear tab). Without this, employees only see their own gear.</p>
                    <p className="text-xs mt-2"><strong>Who has it:</strong> Company owners (always), employees with "view_gear_assignments" permission.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special: Self-Assign */}
            <Card className="bg-cyan-50 dark:bg-cyan-950">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-cyan-100 dark:bg-cyan-900 rounded-full p-2">
                    <UserCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Special: Self-Assignment</p>
                      <Badge className="text-xs bg-cyan-600">No permission required</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">All employees can assign available gear to THEMSELVES and remove their own assignments. No special permission needed.</p>
                    <p className="text-xs mt-2"><strong>Who has it:</strong> Every employee, automatically.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* DUAL-PATH SERIAL ASSIGNMENT */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Hash className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            Dual-Path Serial Assignment
          </h2>
          <p className="text-base text-muted-foreground">When assigning gear with a serial number, users have two options:</p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Path A: Pick Existing */}
            <Card className="border-2 border-violet-200 dark:border-violet-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge className="bg-violet-600">Path A</Badge>
                  Pick Existing Serial
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <p>Select from a dropdown of <strong>already-registered</strong> serial numbers that aren't currently assigned to anyone.</p>
                
                <div className="bg-violet-50 dark:bg-violet-950 p-3 rounded space-y-2">
                  <p className="font-semibold text-xs">How it works:</p>
                  <ol className="list-decimal list-inside space-y-1 text-base">
                    <li>System shows dropdown of unassigned serials</li>
                    <li>User picks one from the list</li>
                    <li>Assignment is created with that serial</li>
                  </ol>
                </div>

                <p className="text-xs text-muted-foreground">Best when: Serials were pre-registered when the item was added to inventory.</p>
              </CardContent>
            </Card>

            {/* Path B: Enter New */}
            <Card className="border-2 border-emerald-200 dark:border-emerald-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge className="bg-emerald-600">Path B</Badge>
                  Enter New Serial
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <p>Type in a <strong>new serial number</strong> that isn't in the system yet. The system will automatically register it.</p>
                
                <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded space-y-2">
                  <p className="font-semibold text-xs">How it works (Atomic Registration):</p>
                  <ol className="list-decimal list-inside space-y-1 text-base">
                    <li>User types new serial number</li>
                    <li>System checks it doesn't already exist</li>
                    <li>System <strong>automatically registers</strong> the serial</li>
                    <li>System creates the assignment in one operation</li>
                  </ol>
                </div>

                <p className="text-xs text-muted-foreground">Best when: Adding serials on-the-fly as equipment is distributed.</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
            <CardContent className="pt-4 text-base text-blue-900 dark:text-blue-100">
              <p className="flex items-center gap-2 font-semibold">
                <Info className="w-4 h-4" />
                Why This Matters
              </p>
              <p className="mt-1">This dual-path approach means managers don't need to pre-register every serial number before assigning equipment. They can add serials as they go, reducing administrative overhead while maintaining full tracking capability.</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-4 text-base text-amber-900 dark:text-amber-100">
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                Serial Normalization
              </p>
              <p className="mt-1">All serial numbers are automatically <strong>trimmed</strong> (whitespace removed) and converted to <strong>UPPERCASE</strong> before storage. This prevents duplicates like "hr-001", "HR-001", and " HR-001 " from being treated as different serials.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Assignment Methods */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Two Assignment Methods
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Manager Assign */}
            <Card className="border-2 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-semibold text-green-900 dark:text-green-100">
                  Manager Assigns to Others
                </CardTitle>
                <CardDescription className="text-green-800 dark:text-green-200">
                  Requires: canAssignGear permission
                </CardDescription>
              </CardHeader>
              <CardContent className="text-base text-green-900 dark:text-green-100 space-y-3">
                <p><strong>Where:</strong> Inventory page, click gear item, "Assign to Employee" button</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Select target employee from dropdown</li>
                  <li>Choose quantity to assign (limited by availability)</li>
                  <li>Optionally pick/enter serial number</li>
                  <li>Set date of manufacture and in-service dates</li>
                </ul>
                <div className="bg-green-100 dark:bg-green-900 rounded p-2 text-xs">
                  <strong>Use case:</strong> Controlled distribution, new employee onboarding, equipment audits
                </div>
              </CardContent>
            </Card>

            {/* Self-Assign */}
            <Card className="border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-semibold text-action-900 dark:text-action-100">
                  Self-Assignment
                </CardTitle>
                <CardDescription className="text-blue-800 dark:text-blue-200">
                  Available to: All employees (no permission needed)
                </CardDescription>
              </CardHeader>
              <CardContent className="text-base text-blue-900 dark:text-blue-100 space-y-3">
                <p><strong>Where:</strong> My Gear page, "Add Gear from Inventory" button</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Browse available gear items</li>
                  <li>Pick item and quantity</li>
                  <li>Choose specific serial (if available)</li>
                  <li>Equipment appears in personal kit immediately</li>
                </ul>
                <div className="bg-blue-100 dark:bg-blue-900 rounded p-2 text-xs">
                  <strong>Use case:</strong> Employee autonomy, reduces manager workload, field equipment pickup
                </div>
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
            {/* Workflow 1: Add to Inventory */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600">Workflow 1</Badge>
                    <CardTitle>Add New Gear to Inventory</CardTitle>
                  </div>
                  <Badge variant="outline">Requires: canManageInventory</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Navigate to <strong>Inventory</strong> page</li>
                  <li>Click <strong>"Add Item"</strong> button</li>
                  <li>Fill in equipment details:
                    <ul className="list-disc list-inside ml-4 mt-1 text-muted-foreground">
                      <li>Equipment type (harness, rope, etc.)</li>
                      <li>Brand and model</li>
                      <li><strong>Quantity</strong> - How many units you're adding</li>
                      <li>Price (optional, only visible to financial users)</li>
                    </ul>
                  </li>
                  <li>(Optional) Add serial numbers with their manufacture/service dates</li>
                  <li>Click <strong>Save</strong></li>
                </ol>
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Result:</strong> Item appears in inventory with [Quantity] available slots for assignment.
                </div>
              </CardContent>
            </Card>

            {/* Workflow 2: Manager Assign */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">Workflow 2</Badge>
                    <CardTitle>Manager Assigns Gear to Employee</CardTitle>
                  </div>
                  <Badge variant="outline">Requires: canAssignGear</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Navigate to <strong>Inventory</strong> page</li>
                  <li>Find the gear item (shows "X of Y available")</li>
                  <li>Click the item to open details</li>
                  <li>Click <strong>"Assign to Employee"</strong></li>
                  <li>Select target employee from dropdown</li>
                  <li>Enter quantity (cannot exceed available slots)</li>
                  <li>(Optional) Select existing serial or enter new one</li>
                  <li>Click <strong>Assign</strong></li>
                </ol>
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Result:</strong> Assignment created. Available slots decrease. Employee sees gear in their "My Gear" view.
                </div>
              </CardContent>
            </Card>

            {/* Workflow 3: Self-Assign */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600">Workflow 3</Badge>
                    <CardTitle>Employee Self-Assigns Gear</CardTitle>
                  </div>
                  <Badge variant="outline">Any Employee</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Navigate to <strong>My Gear</strong> page (or Inventory)</li>
                  <li>Click <strong>"Add Gear from Inventory"</strong></li>
                  <li>Browse available items</li>
                  <li>Select item, quantity, and optional serial</li>
                  <li>Click <strong>Add to My Kit</strong></li>
                </ol>
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Result:</strong> Gear assigned to yourself. Appears in "My Gear" immediately.
                </div>
              </CardContent>
            </Card>

            {/* Workflow 4: Return Gear */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600">Workflow 4</Badge>
                    <CardTitle>Return / Remove Gear Assignment</CardTitle>
                  </div>
                  <Badge variant="outline">Owner or canAssignGear</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="space-y-2">
                  <p><strong>For your own gear:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Go to <strong>My Gear</strong></li>
                    <li>Find the assignment</li>
                    <li>Click <strong>Remove</strong> / <strong>Return</strong></li>
                    <li>Confirm removal</li>
                  </ol>
                </div>
                <div className="space-y-2">
                  <p><strong>For others' gear (managers):</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Go to <strong>Inventory</strong> or <strong>Team Gear</strong></li>
                    <li>Find the assignment</li>
                    <li>Click <strong>Remove Assignment</strong></li>
                  </ol>
                </div>
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Result:</strong> Assignment deleted. Slot becomes available again for new assignments.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Customer Journeys */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <LogIn className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Customer Journeys
          </h2>

          <div className="space-y-6">
            {/* Manager Journey */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-green-700 dark:text-green-300">Manager Journey</h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Add Gear</p>
                      <p className="text-xs text-muted-foreground">Create inventory items with quantity</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-green-600 dark:text-green-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Assign to Employees</p>
                      <p className="text-xs text-muted-foreground">Distribute with serial tracking</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-green-600 dark:text-green-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Monitor & Track</p>
                      <p className="text-xs text-muted-foreground">View real-time availability</p>
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
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">View Available</p>
                      <p className="text-xs text-muted-foreground">Browse inventory</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-action-600 dark:text-action-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Self-Assign Gear</p>
                      <p className="text-xs text-muted-foreground">Pick equipment you need</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-action-600 dark:text-action-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">View My Gear</p>
                      <p className="text-xs text-muted-foreground">Manage personal kit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Detailed Example */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Complete Example Scenario
          </h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scenario: Managing Harness Equipment</CardTitle>
              <CardDescription>Follow this end-to-end example to understand the complete flow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2 pl-4 bg-green-50 dark:bg-green-950 rounded-lg p-3">
                <p className="font-semibold text-green-700 dark:text-green-300">Day 1: Add to Inventory</p>
                <p>Manager goes to Inventory, clicks "Add Item":</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>Type: Harness</li>
                  <li>Brand: Petzl</li>
                  <li>Model: Avao Bod</li>
                  <li><strong>Quantity: 10</strong></li>
                  <li>Registers 5 serial numbers: HR-001, HR-002, HR-003, HR-004, HR-005</li>
                </ul>
                <p className="text-xs bg-muted p-2 rounded">Status: 10 total, 0 assigned, <strong>10 available</strong></p>
              </div>

              <div className="space-y-2 pl-4 bg-action-50 dark:bg-action-950 rounded-lg p-3">
                <p className="font-semibold text-blue-700 dark:text-blue-300">Day 2: Manager Assigns to Team</p>
                <p>Manager assigns equipment to technicians:</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>Assigns 2 harnesses to Employee A (serials HR-001, HR-002)</li>
                  <li>Assigns 1 harness to Employee B (serial HR-003)</li>
                </ul>
                <p className="text-xs bg-muted p-2 rounded">Status: 10 total, 3 assigned, <strong>7 available</strong></p>
              </div>

              <div className="space-y-2 pl-4 bg-purple-50 dark:bg-purple-950 rounded-lg p-3">
                <p className="font-semibold text-purple-700 dark:text-purple-300">Day 3: Employee Self-Assigns</p>
                <p>Employee C goes to My Gear, clicks "Add from Inventory":</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>Sees Harness item with "7 available"</li>
                  <li>Picks serial HR-004 from dropdown</li>
                  <li>Assigns 1 to themselves</li>
                </ul>
                <p className="text-xs bg-muted p-2 rounded">Status: 10 total, 4 assigned, <strong>6 available</strong></p>
              </div>

              <div className="space-y-2 pl-4 bg-orange-50 dark:bg-orange-950 rounded-lg p-3">
                <p className="font-semibold text-orange-700 dark:text-orange-300">Day 4: New Serial on the Fly</p>
                <p>Manager assigns to Employee D with a new serial:</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>Types new serial: <strong>HR-006</strong> (not pre-registered)</li>
                  <li>System automatically registers HR-006</li>
                  <li>Assignment created in one step</li>
                </ul>
                <p className="text-xs bg-muted p-2 rounded">Status: 10 total, 5 assigned, <strong>5 available</strong>. Serial count: 6 registered.</p>
              </div>

              <div className="space-y-2 pl-4 bg-red-50 dark:bg-red-950 rounded-lg p-3">
                <p className="font-semibold text-red-700 dark:text-red-300">Day 5: Return Equipment</p>
                <p>Employee A returns 1 harness (HR-002):</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>Goes to My Gear</li>
                  <li>Clicks "Remove" on HR-002 assignment</li>
                  <li>Slot becomes available again</li>
                </ul>
                <p className="text-xs bg-muted p-2 rounded">Status: 10 total, 4 assigned, <strong>6 available</strong></p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Key Features */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Key Features Summary
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Slot-Based Availability</p>
                <p className="text-base text-muted-foreground">Available = Quantity - Assigned. Independent of serial registration.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Barcode className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Optional Serial Tracking</p>
                <p className="text-base text-muted-foreground">Track individual units when needed; works without serials too.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Atomic Serial Registration</p>
                <p className="text-base text-muted-foreground">Enter new serials during assignment; auto-registered instantly.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Flexible Assignment</p>
                <p className="text-base text-muted-foreground">Manager-driven or employee self-service based on permissions.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Date Tracking</p>
                <p className="text-base text-muted-foreground">Date of manufacture and in-service dates per assignment.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Financial Protection</p>
                <p className="text-base text-muted-foreground">Item prices only visible to users with financial permissions.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Out of Service</p>
                <p className="text-base text-muted-foreground">Mark items as out of service to prevent new assignments.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Four Permission Levels</p>
                <p className="text-base text-muted-foreground">Granular control: view, manage, assign, view team gear.</p>
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
            <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
              <CardContent className="pt-4 text-base text-amber-900 dark:text-amber-100 space-y-2">
                <p className="font-semibold">Serial Independence from Availability</p>
                <p>You can have 10 items, 0 registered serials, and still have 10 available slots. Serial numbers are metadata, not gatekeepers.</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
              <CardContent className="pt-4 text-base text-blue-900 dark:text-blue-100 space-y-2">
                <p className="font-semibold">Unique Serials Per Item</p>
                <p>Each serial number must be unique within its gear item. The same serial can exist on different item types (e.g., harness HR-001 and rope HR-001 are allowed).</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950">
              <CardContent className="pt-4 text-base text-green-900 dark:text-green-100 space-y-2">
                <p className="font-semibold">Multiple Assignments per Employee</p>
                <p>An employee can have multiple assignments for the same gear item type (e.g., two separate harness assignments with different serials).</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950">
              <CardContent className="pt-4 text-base text-purple-900 dark:text-purple-100 space-y-2">
                <p className="font-semibold">Cannot Delete Assigned Serials</p>
                <p>When editing a gear item, you cannot remove a serial number that is currently assigned to someone. Return the gear first.</p>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
              <CardContent className="pt-4 text-base text-red-900 dark:text-red-100 space-y-2">
                <p className="font-semibold">Quantity Cannot Go Below Assigned</p>
                <p>If 5 items are assigned, you cannot reduce the item quantity to less than 5. Return assignments first.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quick Links */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Quick Links</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/inventory">
              <Button variant="outline" 
              className="w-full justify-between h-auto p-4"
              data-testid="link-inventory">

              <div className="text-left">
                <div className="font-semibold">Go to Inventory</div>
                <div className="text-xs text-muted-foreground">Manage your equipment catalog</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
            </Link>

            <Link href="/my-gear">
              <Button variant="outline" 
              className="w-full justify-between h-auto p-4"
              data-testid="link-my-gear">

              <div className="text-left">
                <div className="font-semibold">My Gear</div>
                <div className="text-xs text-muted-foreground">View your assigned equipment</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <Card className="border-muted bg-muted/50">
          <CardContent className="pt-6 text-base text-muted-foreground">
            <p><strong>Last updated:</strong> December 2, 2024 | <strong>Version:</strong> 3.0</p>
            <p className="mt-1">This document serves as the authoritative reference for the Inventory System. For technical implementation details, see <code>gear-inventory-instructions-v1.0.md</code> in the instructions folder.</p>
          </CardContent>
        </Card>
      </div>
    </ChangelogGuideLayout>
  );
}
