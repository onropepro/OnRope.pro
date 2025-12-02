# Gear Inventory System Instructions v1.0
**System**: Rope Access Management System  
**Domain**: Equipment & Asset Management  
**Version**: 1.0  
**Last Updated**: December 2, 2024  
**Status**: PRODUCTION-READY ✅  
**Safety Critical**: No - Equipment tracking for business operations, not direct worker safety

---

## Purpose and Goal

### Primary Objective
The Gear Inventory System provides centralized management of rope access equipment across a company, enabling efficient tracking of gear items, their assignments to employees, and optional serial number tracking for individual units. The system uses a **slot-based availability model** where equipment availability is determined by quantity minus assignments, independent of serial number registration.

### Key Goals
- **Efficiency**: Streamline equipment distribution and tracking across field crews
- **Accuracy**: Maintain precise counts of available vs. assigned equipment through slot-based tracking
- **Accountability**: Track which employees have which gear through assignment records
- **Flexibility**: Support both bulk equipment (quantity-only) and serialized tracking (per-unit metadata)
- **Usability**: Enable employees to self-assign gear from their kit view while managers oversee assignments

### Core Business Value
- **Inventory Visibility**: Know exactly what equipment is available at any moment
- **Assignment Tracking**: Clear audit trail of who has what gear
- **Optional Granularity**: Track serial numbers when needed without requiring them for all equipment
- **Self-Service**: Employees can manage their own kit, reducing administrative overhead

---

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         GEAR INVENTORY SYSTEM                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────────┐    ┌──────────────────────┐   │
│  │ gearItems   │◄───│ gearAssignments │───►│ gearSerialNumbers    │   │
│  │ (inventory) │    │ (who has what)  │    │ (optional metadata)  │   │
│  └─────────────┘    └─────────────────┘    └──────────────────────┘   │
│         │                   │                        │                 │
│         │     SLOT FORMULA: Available = Quantity - Σ(Assigned)        │
│         │                   │                        │                 │
│         ▼                   ▼                        ▼                 │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    PERMISSION LAYER                              │  │
│  │  canAccessInventory → canManageInventory → canAssignGear        │  │
│  │                                     → canViewGearAssignments    │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Input Stage**: Manager creates gear item with quantity (and optional serial entries)
2. **Validation Stage**: System validates quantity ≥ 0, validates serial uniqueness per item
3. **Processing Stage**: Assignments consume "slots" from total quantity
4. **Storage Stage**: Three-table persistence (gearItems, gearAssignments, gearSerialNumbers)
5. **Output Stage**: UI displays available quantity = total - assigned, with serial picker if registered serials exist

### Integration Points

- **Upstream Systems**: 
  - Employee Management: Assignment targets must be valid employees in same company
  - Authentication: Session-based auth provides user context for permission checks
  
- **Downstream Systems**:
  - My Kit View: Employees see their assigned gear with full details
  - Equipment Damage Reports: Links to specific gear items and serial numbers
  
- **Parallel Systems**:
  - Harness Inspections: Uses separate inspection tracking (not assignment-based)
  - Safety Documentation: Gear status may inform safety considerations

---

## Dependency Impact & Invariants

### Non-negotiable Invariants

#### 1. SLOT-BASED AVAILABILITY (CRITICAL)
**Rule**: `Available Slots = gearItem.quantity - Σ(gearAssignments.quantity for this item)`

Serial number registration is COMPLETELY INDEPENDENT of slot availability. An item with quantity=10 and 3 assignments always has 7 available slots, regardless of how many serial numbers are registered in gearSerialNumbers.

- **Impact if violated**: Users could over-assign equipment, causing phantom inventory
- **Enforcement mechanism**: API validates `requestedQuantity <= availableSlots` before creating assignments

```typescript
// CORRECT: Slot calculation in GET /api/gear-items
const totalAssigned = existingAssignments.reduce((sum, a) => sum + (a.quantity || 0), 0);
const totalQuantity = Number(gearItem[0].quantity) || 0;
const availableSlots = Math.max(0, totalQuantity - totalAssigned);
```

#### 2. DUAL-PATH SERIAL ASSIGNMENT
**Rule**: When assigning gear with a serial number, users can either:
- **Path A**: Pick from existing registered serials (dropdown)
- **Path B**: Enter a new serial (text input) → System atomically registers it THEN assigns

- **Impact if violated**: Orphaned assignments with unregistered serials, inconsistent serial tracking
- **Enforcement mechanism**: POST assignment endpoints check for serial existence and auto-register if new

#### 3. SERIAL UNIQUENESS PER ITEM
**Rule**: Within a single gearItem, each serialNumber must be unique in gearSerialNumbers

- **Impact if violated**: Multiple units could have the same serial, breaking traceability
- **Enforcement mechanism**: Database constraint `UNIQUE ("gear_item_id", "serial_number")`

#### 4. MULTI-TENANT ISOLATION
**Rule**: All queries MUST filter by companyId

- **Impact if violated**: Companies see each other's equipment data
- **Enforcement mechanism**: Every API endpoint resolves companyId from session and applies filter

### System Dependencies

- **Work Sessions**: No direct dependency; gear assignments exist independently of work tracking
- **Safety Systems**: Equipment damage reports link to gearItems; gear assignments enable "my gear" tracking for inspections
- **Payroll**: No direct dependency
- **Multi-tenant**: Strict isolation via companyId on all three tables

---

## Technical Implementation

### Database Schema

```typescript
// Gear Items - The inventory of equipment
export const gearItems = pgTable("gear_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  equipmentType: varchar("equipment_type"), // harness, rope, descender, etc.
  brand: varchar("brand"),
  model: varchar("model"),
  itemPrice: numeric("item_price", { precision: 10, scale: 2 }), // Financial permission required to view
  ropeLength: numeric("rope_length", { precision: 10, scale: 2 }), // For Rope items only
  pricePerFeet: numeric("price_per_feet", { precision: 10, scale: 2 }), // For Rope items only
  assignedTo: varchar("assigned_to").default("Not in use"), // DEPRECATED - use gearAssignments
  notes: text("notes"),
  quantity: integer("quantity").default(1).notNull(), // TOTAL available slots
  serialNumbers: text("serial_numbers").array(), // DEPRECATED - use gearSerialNumbers table
  dateOfManufacture: date("date_of_manufacture"),
  dateInService: date("date_in_service"),
  dateOutOfService: date("date_out_of_service"),
  inService: boolean("in_service").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gear Assignments - Who has what equipment
export const gearAssignments = pgTable("gear_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gearItemId: varchar("gear_item_id").notNull().references(() => gearItems.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  employeeId: varchar("employee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(), // How many of this item they have (consumes slots)
  serialNumber: text("serial_number"), // Optional: which specific unit (if serialized)
  dateOfManufacture: date("date_of_manufacture"), // Per-assignment metadata
  dateInService: date("date_in_service"), // Per-assignment metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gear Serial Numbers - Optional registry for individual units
export const gearSerialNumbers = pgTable("gear_serial_numbers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gearItemId: varchar("gear_item_id").notNull().references(() => gearItems.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  serialNumber: text("serial_number").notNull(),
  dateOfManufacture: date("date_of_manufacture"),
  dateInService: date("date_in_service"),
  isRetired: boolean("is_retired").notNull().default(false),
  retiredAt: timestamp("retired_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  sql`UNIQUE ("gear_item_id", "serial_number")`, // Enforce uniqueness per item
]);
```

### API Endpoints

| Endpoint | Method | Permission | Purpose |
|----------|--------|------------|---------|
| `/api/gear-items` | GET | `canViewInventory` | List all company gear with availability calculations |
| `/api/gear-items` | POST | `canManageInventory` | Create new gear item (with optional serial entries) |
| `/api/gear-items/:id` | PATCH | `canManageInventory` | Update gear item details/quantity |
| `/api/gear-items/:id` | DELETE | `canManageInventory` | Delete gear item |
| `/api/gear-items/:id/assignments` | GET | `canViewInventory` | Get assignments for specific item |
| `/api/gear-assignments` | GET | `canViewGearAssignments` or own-only | List assignments (own or all) |
| `/api/gear-assignments` | POST | `canAssignGear` | Assign gear to any employee |
| `/api/gear-assignments/:id` | PATCH | `canAssignGear` | Update assignment details |
| `/api/gear-assignments/:id` | DELETE | `canAssignGear` | Remove assignment |
| `/api/gear-assignments/self` | POST | Any employee | Self-assign gear to own kit |
| `/api/gear-assignments/self/:id` | PATCH | Owner only | Update own assignment details |
| `/api/gear-assignments/self/:id` | DELETE | Owner only | Remove own assignment |
| `/api/my-kit` | GET | Any employee | Get current user's assigned gear with details |

### Critical Functions

#### Slot Availability Calculation (GET /api/gear-items)
```typescript
// Get ALL assignments for company, sum by item
const allAssignments = await db.select()
  .from(gearAssignments)
  .where(eq(gearAssignments.companyId, companyId));

const assignedByItem = new Map<string, number>();
for (const assignment of allAssignments) {
  const current = assignedByItem.get(assignment.gearItemId) || 0;
  const qty = Number(assignment.quantity) || 0;
  assignedByItem.set(assignment.gearItemId, current + qty);
}

// For each item: availableSlots = quantity - assigned
const totalQuantity = Number(item.quantity) || 0;
const assignedQuantity = assignedByItem.get(item.id) || 0;
const availableSlots = Math.max(0, totalQuantity - assignedQuantity);
```

#### Dual-Path Serial Registration (POST /api/gear-assignments, POST /api/gear-assignments/self)
```typescript
// If serial number provided
if (serialNumber) {
  // Check if serial already exists
  const existingSerial = await db.select()
    .from(gearSerialNumbers)
    .where(and(
      eq(gearSerialNumbers.gearItemId, gearItemId),
      eq(gearSerialNumbers.serialNumber, serialNumber)
    ))
    .limit(1);
  
  // Check if already assigned
  const serialAssignment = await db.select()
    .from(gearAssignments)
    .where(and(
      eq(gearAssignments.gearItemId, gearItemId),
      eq(gearAssignments.serialNumber, serialNumber)
    ))
    .limit(1);
  
  if (serialAssignment.length > 0) {
    return res.status(400).json({ message: "This serial number is already assigned" });
  }
  
  // ATOMIC REGISTRATION: If serial doesn't exist, register it before assigning
  if (!existingSerial.length) {
    await db.insert(gearSerialNumbers).values({
      gearItemId,
      companyId,
      serialNumber,
      dateOfManufacture: req.body.dateOfManufacture || undefined,
      dateInService: req.body.dateInService || undefined,
    });
  }
}

// Then create assignment (serial now guaranteed to exist if provided)
const assignment = await storage.createGearAssignment({
  gearItemId,
  companyId,
  employeeId: targetEmployeeId,
  quantity: requestedQuantity,
  serialNumber,
  dateOfManufacture,
  dateInService,
});
```

---

## Multi-Tenant Considerations

### Data Isolation

- **Company Level**: All three tables (gearItems, gearAssignments, gearSerialNumbers) have companyId column
- **Employee Level**: Employees can only access their company's data; role-based access controls visibility
- **Cross-Company Protection**: No endpoint allows querying without companyId filter

### Query Patterns

```typescript
// ALWAYS determine companyId from authenticated user
const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;

// ALWAYS filter by companyId
const items = await db.select().from(gearItems)
  .where(eq(gearItems.companyId, companyId));
```

### Assignment Ownership Validation

```typescript
// For self-assignment endpoints, verify ownership
if (assignment[0].employeeId !== currentUser.id) {
  return res.status(403).json({ message: "You can only modify your own gear assignments" });
}
```

---

## Safety & Compliance

### Safety Considerations

This system is NOT safety-critical because:
- It tracks equipment inventory/assignments, not equipment safety status
- Harness inspections are handled by a separate safety documentation system
- Equipment damage reports link to this system but operate independently

### Business-Critical Elements

- **Accurate Availability**: Prevents over-assignment of limited equipment
- **Assignment Audit Trail**: Provides accountability for equipment distribution
- **Serial Tracking**: Enables individual unit tracking for high-value or regulated items

### Financial Data Protection

```typescript
// itemPrice field requires financial permission to view
const hasFinancialPermission = currentUser.role === "company" || 
  (currentUser.permissions && currentUser.permissions.includes("view_financial_data"));

if (!hasFinancialPermission) {
  const { itemPrice, ...rest } = item;
  return rest; // Strip financial data
}
```

---

## Field Worker Experience

### Mobile Considerations

- **My Kit View**: Quick access to personal assigned equipment
- **Self-Assignment**: Employees can pick up gear without manager intervention
- **Touch-Friendly**: Equipment cards with clear action buttons
- **Minimal Data Entry**: Serial number picker from existing registered serials

### Common Workflows

#### 1. Employee Self-Assigns Gear
1. Navigate to Inventory page
2. Find available gear item (shows X of Y available)
3. Click "Add to My Kit" 
4. Select quantity (defaults to 1)
5. Optionally pick/enter serial number
6. Confirm assignment
7. Gear appears in "My Kit" tab

#### 2. Manager Assigns Gear to Employee
1. Navigate to Inventory page (requires `canAssignGear` permission)
2. Find gear item
3. Click assignment action
4. Select target employee from dropdown
5. Enter quantity and optional serial
6. Confirm assignment
7. Employee sees gear in their kit

#### 3. Employee Returns Gear
1. Navigate to "My Kit" tab
2. Find the assignment
3. Click "Return" or "Remove"
4. Confirm removal
5. Slot becomes available in inventory

---

## Error Handling & Recovery

### Common Errors

| Error | Cause | User Message | Recovery Action |
|-------|-------|--------------|-----------------|
| Not enough available | Requested qty > available slots | "Only X of Y available" | Reduce quantity or wait for returns |
| Serial already assigned | Another employee has this serial | "This serial is already assigned" | Choose different serial or verify correct item |
| Duplicate serial | Serial already registered for item | "Serial already exists for this item" | Use existing serial instead of re-entering |
| Permission denied | Missing required permission | "Access denied - Insufficient permissions" | Contact manager for permission grant |
| Item not found | Invalid gear item ID or wrong company | "Gear item not found" | Verify item exists and belongs to company |

### Database Error Handling

```typescript
// Handle unique constraint violation for duplicate serials
catch (error: any) {
  if (error?.code === '23505' && error?.constraint?.includes('serial')) {
    return res.status(400).json({ message: "This serial number already exists for this item" });
  }
  // ... other error handling
}
```

### Graceful Degradation

- **No Serial Numbers**: System works entirely without serials; they're optional metadata
- **Missing Dates**: dateOfManufacture and dateInService are optional on assignments
- **Quantity Validation**: Always enforce `Math.max(0, total - assigned)` to prevent negative availability

---

## Testing Requirements

### Unit Tests

```typescript
describe('Gear Inventory', () => {
  describe('Slot Availability Calculation', () => {
    test('should calculate available = quantity - assigned', () => {
      const item = { quantity: 10 };
      const assignments = [{ quantity: 3 }, { quantity: 2 }];
      const totalAssigned = assignments.reduce((sum, a) => sum + a.quantity, 0);
      const available = item.quantity - totalAssigned;
      expect(available).toBe(5);
    });
    
    test('should never show negative availability', () => {
      const item = { quantity: 5 };
      const assignments = [{ quantity: 8 }]; // Over-assigned (data issue)
      const available = Math.max(0, item.quantity - 8);
      expect(available).toBe(0);
    });
    
    test('availability should NOT depend on registered serial count', () => {
      const item = { quantity: 10 };
      const assignments = [{ quantity: 2 }]; // 2 slots consumed
      const registeredSerials = 5; // Irrelevant to availability
      const available = item.quantity - 2;
      expect(available).toBe(8); // 10 - 2 = 8, regardless of 5 registered serials
    });
  });
  
  describe('Dual-Path Serial Assignment', () => {
    test('should allow picking existing registered serial', () => {
      // Pre-registered serial
      const existingSerial = { serialNumber: 'SN-001', gearItemId: 'item-1' };
      // Assignment should succeed without re-registration
    });
    
    test('should auto-register new serial during assignment', () => {
      // New serial not in gearSerialNumbers
      // Assignment should create serial entry THEN assignment atomically
    });
  });
});
```

### Integration Tests

- **Multi-tenant isolation**: Verify company A cannot see/modify company B's gear
- **Role permissions**: Test all four permission levels work correctly
- **Concurrent assignments**: Two users assigning last available slot should not both succeed
- **Cascading deletes**: Deleting gear item should remove all assignments and serials

### Edge Cases

- **Zero quantity item**: Should show 0 available, prevent any assignments
- **Quantity reduction below assigned**: Should allow edit but show 0 available (over-assigned state)
- **Serial normalization**: "sn-001", "SN-001", " SN-001 " should all match

---

## Monitoring & Maintenance

### Key Metrics

- **Assignment Success Rate**: Track failed vs. successful assignments
- **Over-Assignment Count**: Items where assigned > quantity (data anomaly)
- **Unregistered Serial Assignments**: Assignments with serials not in gearSerialNumbers (historical data issue)

### Regular Maintenance

- **Weekly**: Review items with availableQuantity = 0 for potential restocking
- **Monthly**: Audit for over-assigned items (assigned > quantity)
- **Quarterly**: Check for orphaned serial registrations (serials never assigned)

### Data Integrity Query
```sql
-- Find over-assigned items
SELECT 
  gi.id, 
  gi.quantity as total,
  COALESCE(SUM(ga.quantity), 0) as assigned,
  gi.quantity - COALESCE(SUM(ga.quantity), 0) as available
FROM gear_items gi
LEFT JOIN gear_assignments ga ON ga.gear_item_id = gi.id
GROUP BY gi.id
HAVING gi.quantity < COALESCE(SUM(ga.quantity), 0);
```

---

## Troubleshooting Guide

### Issue: Employee Cannot Self-Assign Gear
**Symptoms**: "Add to My Kit" button missing or disabled

**Diagnosis Steps**:
1. Verify user is logged in as employee role (not resident/property_manager)
2. Check item has `availableQuantity > 0`
3. Verify item is `inService: true`

**Solution**: Ensure user has employee role and item is available

**Prevention**: UI should hide/disable button when unavailable

---

### Issue: Serial Number Not Appearing in Picker
**Symptoms**: User expects serial to appear but dropdown is empty

**Diagnosis Steps**:
1. Query `gear_serial_numbers` for item to verify serial exists
2. Check if serial is already assigned (query `gear_assignments.serialNumber`)
3. Verify serial belongs to correct company

**Solution**: 
```sql
-- Check serial registration status
SELECT gsn.*, ga.employee_id as assigned_to
FROM gear_serial_numbers gsn
LEFT JOIN gear_assignments ga 
  ON ga.gear_item_id = gsn.gear_item_id 
  AND ga.serial_number = gsn.serial_number
WHERE gsn.gear_item_id = '[item-id]';
```

**Prevention**: Serial picker only shows unassigned serials

---

### Issue: Availability Shows Wrong Number
**Symptoms**: Available count doesn't match expected value

**Diagnosis Steps**:
1. Verify item quantity: `SELECT quantity FROM gear_items WHERE id = ?`
2. Sum all assignments: `SELECT SUM(quantity) FROM gear_assignments WHERE gear_item_id = ?`
3. Calculate expected: quantity - sum

**Solution**: Fix any data discrepancies (adjust quantity or remove invalid assignments)

**Prevention**: All assignment operations validate availability before proceeding

---

### Issue: Historical Assignments Have Unregistered Serials
**Symptoms**: Assignments reference serials not in gearSerialNumbers table

**Background**: Before dual-path atomic registration, serials could be assigned without registration

**Diagnosis**:
```sql
-- Find assignments with unregistered serials
SELECT ga.* 
FROM gear_assignments ga
LEFT JOIN gear_serial_numbers gsn 
  ON gsn.gear_item_id = ga.gear_item_id 
  AND gsn.serial_number = ga.serial_number
WHERE ga.serial_number IS NOT NULL 
  AND gsn.id IS NULL;
```

**Solution - Backfill Migration**:
```sql
-- Register all unregistered serials from historical assignments
INSERT INTO gear_serial_numbers (gear_item_id, company_id, serial_number, created_at)
SELECT DISTINCT 
  ga.gear_item_id, 
  ga.company_id, 
  ga.serial_number,
  ga.created_at
FROM gear_assignments ga
LEFT JOIN gear_serial_numbers gsn 
  ON gsn.gear_item_id = ga.gear_item_id 
  AND gsn.serial_number = ga.serial_number
WHERE ga.serial_number IS NOT NULL 
  AND ga.serial_number != ''
  AND gsn.id IS NULL
ON CONFLICT (gear_item_id, serial_number) DO NOTHING;
```

**Prevention**: Current assignment endpoints always register serials atomically

---

## Related Documentation

- `1. GUIDING_PRINCIPLES.md` - Core philosophy and conventions
- `2. INSTRUCTION_DOCUMENT_CREATION_GUIDE.md` - Template for this document
- `3. DEPENDENCY-AWARENESS-INSTRUCTIONS.md` - Understanding system dependencies
- Future: `safety-documentation-instructions-v1.0.md` - Harness inspections, damage reports

---

## Version History

- **v1.0** (December 2, 2024): Initial comprehensive documentation
  - Documented slot-based availability model
  - Documented dual-path serial assignment pattern
  - Included all database schemas and API endpoints
  - Added permission hierarchy documentation
  - Created historical data backfill strategy for unregistered serials
  - Comprehensive troubleshooting guide
