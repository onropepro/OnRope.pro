# Gear Inventory

Track equipment, manage assignments, and monitor availability across your rope access operations.

## Overview

The Gear Inventory module provides centralized equipment tracking using a slot-based availability model. Know exactly what equipment you own, who has it, and what's available for new assignments. Eliminate the guesswork of spreadsheets that are always out of date.

## The Golden Rule: Slot-Based Availability

```
Available = Quantity - Assigned
```

This formula is absolute. Available slots are determined ONLY by:
- **Quantity**: Total items your company owns (set on the gear item)
- **Assigned**: Sum of all assignment quantities for that item

Serial number registration has NO EFFECT on availability. You can have 10 items with quantity=10, only 2 registered serial numbers, and still have 10 available slots (if none are assigned).

### Example
- Item: Harnesses
- Quantity: 10
- Assigned to 3 employees: 4 total
- Available for new assignments: 6

## Key Features

### Equipment Catalog
- Pre-populated list of industry-standard equipment
- Popular descender models from Petzl, CMC, Rock Exotica, Skylotec, ISC, Kong
- "Other" option adds custom gear to shared database
- All companies benefit from expanded catalog

### Assignment Tracking
- Assign equipment to employees
- Track assignment dates
- View assignment history
- Automatic availability calculation

### Serial Number Management
- Optional metadata for individual units
- Track specific items when needed
- Not required for availability calculations
- Useful for warranty and inspection tracking

### Service Life Guidelines
- Manufacturer recommendations tracked
- Typical: 5 years hard gear, 10 years soft gear
- Reminders before service life ends
- Not a substitute for professional inspection

## How It Works

### Adding Equipment
1. Navigate to Gear Inventory
2. Click "Add Equipment"
3. Select from catalog or enter custom item
4. Set total quantity owned
5. Add optional serial numbers for tracking

### Assigning Equipment
1. Select the equipment item
2. Click "Assign"
3. Choose employee
4. Enter quantity
5. System updates available count automatically

### Checking Availability
1. View the inventory dashboard
2. Each item shows Available / Total
3. Color coding indicates status (green = available, red = fully assigned)

## Integration Points

- **Employee Management**: Assignments linked to employee profiles
- **Project Management**: Equipment needs per project
- **Safety**: Inspection status tracked with equipment

## Safety Disclaimer

OnRopePro's Gear Inventory helps track equipment and assignments, but is not a substitute for professional safety consultation. You are responsible for ensuring compliance with:
- IRATA/SPRAT equipment inspection requirements
- OSHA/WorkSafeBC safety equipment standards
- Manufacturer service life recommendations
- Insurance documentation requirements
- Local workplace safety regulations

Equipment service life calculations are guidelines only. Actual replacement timing depends on usage intensity, environmental conditions, manufacturer specifications, and professional inspection results.

## Common Questions

**Q: Do I need to enter serial numbers for all equipment?**
A: No, serial numbers are optional metadata. Availability is based on quantity, not serial numbers.

**Q: What if an employee leaves with equipment?**
A: The assignment history provides proof of what was issued and when.

**Q: Can I track equipment at multiple locations?**
A: Yes, use location tags to track where equipment is stored or assigned.

## Related Modules

- [Employee Management](/help/modules/employee-management)
- [Safety and Compliance](/help/modules/safety-compliance)
