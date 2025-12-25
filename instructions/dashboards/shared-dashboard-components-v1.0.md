# Shared Dashboard Components Instructions v1.0
**System**: OnRopePro - Rope Access Management Platform  
**Domain**: Unified Dashboard Architecture  
**Version**: 1.0  
**Last Updated**: December 25, 2024  
**Status**: PRODUCTION-READY  
**Safety Critical**: No - UI infrastructure components

---

## Purpose and Goal

### Primary Objective
This document defines the shared components used across all stakeholder dashboards in OnRopePro. These components provide consistent layout, navigation, and branding while supporting stakeholder-specific customization through variants and configuration.

### Key Goals
- **Consistency**: Unified look and feel across all dashboards
- **Reusability**: Single component implementation serves all stakeholder types
- **Customization**: Variant-based styling and custom navigation groups
- **Accessibility**: WCAG-compliant color contrast and interactions

### Core Business Value
- **Reduced Maintenance**: Changes to shared components apply everywhere
- **Faster Development**: New dashboards use existing infrastructure
- **Brand Cohesion**: Stakeholder-specific colors within consistent framework
- **User Experience**: Familiar patterns across all user types

---

## System Architecture

### Component Hierarchy

```
+-------------------------------------------------------------------------+
|                    SHARED DASHBOARD COMPONENTS                           |
+-------------------------------------------------------------------------+
|                                                                          |
|  +-------------------------------------------------------------------+  |
|  |                    DashboardLayout                                 |  |
|  |  Wrapper component providing sidebar + main content structure      |  |
|  +-------------------------------------------------------------------+  |
|         |                                                                |
|         v                                                                |
|  +-------------------------------------------------------------------+  |
|  |                    DashboardSidebar                                |  |
|  |  Unified sidebar with variant-based styling                        |  |
|  |  Supports: employer | technician | property-manager | resident |  |  |
|  |            building-manager | ground-crew                          |  |
|  +-------------------------------------------------------------------+  |
|         |                                                                |
|         v                                                                |
|  +-------------------------------------------------------------------+  |
|  |                    Navigation Groups                               |  |
|  |  Array of NavGroup[] with permission-based visibility              |  |
|  +-------------------------------------------------------------------+  |
|         |                                                                |
|         v                                                                |
|  +-------------------------------------------------------------------+  |
|  |                    Sidebar Preferences                             |  |
|  |  User-customizable menu ordering (stored in sidebar_preferences)   |  |
|  +-------------------------------------------------------------------+  |
|                                                                          |
+-------------------------------------------------------------------------+
```

### File Locations

| Component | File Path |
|-----------|-----------|
| DashboardLayout | `client/src/components/DashboardLayout.tsx` |
| DashboardSidebar | `client/src/components/DashboardSidebar.tsx` |
| Navigation types | `client/src/types/navigation.ts` (or inline) |

---

## DashboardSidebar Component

### Props Interface

```typescript
interface DashboardSidebarProps {
  currentUser: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  variant: 'employer' | 'technician' | 'property-manager' | 'resident' | 'building-manager' | 'ground-crew';
  customNavigationGroups?: NavGroup[];
  showDashboardLink?: boolean;
}
```

### Usage Examples

#### Employer Dashboard
```tsx
<DashboardSidebar
  currentUser={user}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="employer"
  customNavigationGroups={employerNavGroups}
/>
```

#### Technician Portal
```tsx
<DashboardSidebar
  currentUser={user}
  activeTab={activeTab}
  onTabChange={(tab) => setActiveTab(tab as TabType)}
  variant="technician"
  customNavigationGroups={technicianNavGroups}
  showDashboardLink={false}
/>
```

### Variant-Based Styling

Each variant applies stakeholder-specific brand colors:

```typescript
const variantStyles = {
  employer: {
    brandColor: '#0B64A3',     // Blue
    sidebarBg: 'bg-slate-900',
    accentColor: 'text-blue-400',
  },
  technician: {
    brandColor: '#AB4521',     // Rust
    sidebarBg: 'bg-slate-900',
    accentColor: 'text-amber-400',
  },
  'property-manager': {
    brandColor: '#6E9075',     // Sage
    sidebarBg: 'bg-slate-900',
    accentColor: 'text-green-400',
  },
  resident: {
    brandColor: '#86A59C',     // Teal
    sidebarBg: 'bg-slate-900',
    accentColor: 'text-teal-400',
  },
  'building-manager': {
    brandColor: '#B89685',     // Taupe
    sidebarBg: 'bg-slate-900',
    accentColor: 'text-orange-300',
  },
  'ground-crew': {
    brandColor: '#AB4521',     // Matches technician
    sidebarBg: 'bg-slate-900',
    accentColor: 'text-amber-400',
  },
};
```

---

## Navigation Groups

### Type Definition

```typescript
interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
  badge?: number;
  badgeType?: 'info' | 'alert' | 'success';
  isVisible: () => boolean;
}

interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}
```

### Permission-Based Visibility

Each navigation item includes an `isVisible()` callback that determines whether the item appears:

```typescript
{
  id: "payroll",
  label: "Payroll",
  icon: DollarSign,
  onClick: () => setActiveTab('payroll'),
  isVisible: () => hasFinancialAccess,  // Only shows if user has permission
}
```

### Dynamic Badges

Navigation items can show badge counts for notifications:

```typescript
{
  id: "invitations",
  label: "Team Invitations",
  icon: Mail,
  badge: pendingInvitations.length > 0 ? pendingInvitations.length : undefined,
  badgeType: "alert",
  isVisible: () => true,
}
```

Badge types:
- `info`: Blue/neutral - general notifications
- `alert`: Red/urgent - requires attention
- `success`: Green - positive indicator

---

## Sidebar Preferences (User Customization)

### Database Schema

```typescript
export const sidebarPreferences = pgTable("sidebar_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  variant: varchar("variant").notNull(), // 'employer' | 'technician' | etc.
  groupOrder: text("group_order").array(), // Array of group IDs
  itemOrder: jsonb("item_order"), // { groupId: [itemId, itemId, ...] }
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

### Drag-and-Drop Reordering

Users can reorder menu items within groups:

```typescript
const handleDragEnd = async (result: DropResult) => {
  if (!result.destination) return;
  
  const newOrder = reorder(
    currentOrder,
    result.source.index,
    result.destination.index
  );
  
  // Save to database
  await apiRequest('PATCH', '/api/sidebar-preferences', {
    variant: currentVariant,
    itemOrder: { [result.source.droppableId]: newOrder },
  });
};
```

---

## DashboardLayout Component

### Props Interface

```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}
```

### Usage

```tsx
<DashboardLayout
  sidebar={
    <DashboardSidebar
      currentUser={user}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      variant="employer"
      customNavigationGroups={navGroups}
    />
  }
  header={<DashboardHeader />}
>
  <main className="flex-1 overflow-auto p-6">
    {/* Tab content here */}
  </main>
</DashboardLayout>
```

### Layout Structure

```html
<div class="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
  <!-- Desktop Sidebar -->
  <div class="hidden lg:block">
    {sidebar}
  </div>
  
  <!-- Main Content Wrapper -->
  <div class="lg:pl-60">
    {header}
    <main>
      {children}
    </main>
  </div>
  
  <!-- Mobile Bottom Navigation -->
  <div class="lg:hidden fixed bottom-0 left-0 right-0">
    {mobileNav}
  </div>
</div>
```

---

## Stakeholder Brand Colors

### WCAG Accessibility Compliance

Brand colors are used in different contexts with WCAG-compliant text colors:

| Stakeholder | Brand Color | Light BG Text | Dark BG Text |
|-------------|-------------|---------------|--------------|
| Employer | `#0B64A3` | Light (white) | Light (white) |
| Technician | `#AB4521` | Light (white) | Light (white) |
| Safety | `#8B0000` | Light (white) | Light (white) |
| Resident | `#86A59C` | Dark (slate-900) | Light (white) |
| Property Manager | `#6E9075` | Dark (slate-900) | Light (white) |
| Building Manager | `#B89685` | Dark (slate-900) | Light (white) |

### Implementation Pattern

```typescript
const useDarkText = ['resident', 'property-manager', 'building-manager'].includes(variant);

<header 
  className={cn(
    "h-12 px-4",
    `bg-[${brandColor}]`,
    useDarkText ? "text-slate-900" : "text-white"
  )}
>
```

---

## Design Principle: Unified Components Over Custom Rebuilds

### THE KEY PRINCIPLE

**Use the shared sidebar/layout instead of rebuilding per dashboard.**

When adding a new dashboard or stakeholder type:

1. **DO**: Pass a new `variant` to DashboardSidebar
2. **DO**: Define custom `navigationGroups` with permission checks
3. **DON'T**: Rebuild the sidebar from scratch
4. **DON'T**: Create separate navigation components per stakeholder

### Adding a New Dashboard Type

```typescript
// 1. Add variant to the type
type DashboardVariant = 'employer' | 'technician' | ... | 'new-stakeholder';

// 2. Add styling for the variant
const variantStyles = {
  ...existingStyles,
  'new-stakeholder': {
    brandColor: '#XXXXXX',
    sidebarBg: 'bg-slate-900',
    accentColor: 'text-xxx-400',
  },
};

// 3. Define navigation groups in your dashboard page
const newStakeholderNavGroups: NavGroup[] = [
  {
    id: "main",
    label: "NAVIGATION",
    items: [
      { id: "home", label: "Home", icon: Home, isVisible: () => true },
      // ... more items with permission checks
    ],
  },
];

// 4. Use existing DashboardSidebar
<DashboardSidebar
  currentUser={user}
  variant="new-stakeholder"
  customNavigationGroups={newStakeholderNavGroups}
/>
```

---

## Error Handling

### Missing Navigation Groups

If no `customNavigationGroups` provided, fall back to default:

```typescript
const navGroups = customNavigationGroups ?? defaultNavigationGroups;
```

### Invalid Variant

If variant not recognized, use employer as default:

```typescript
const styles = variantStyles[variant] ?? variantStyles.employer;
```

---

## Testing Requirements

### Component Tests

```typescript
describe('DashboardSidebar', () => {
  test('renders with correct brand color for each variant', () => {
    Object.keys(variantStyles).forEach(variant => {
      render(<DashboardSidebar variant={variant} ... />);
      // Assert brand color is applied
    });
  });
  
  test('hides items when isVisible returns false', () => {
    const groups = [{
      id: "test",
      items: [{ id: "hidden", isVisible: () => false }]
    }];
    render(<DashboardSidebar customNavigationGroups={groups} ... />);
    expect(screen.queryByText("hidden")).not.toBeInTheDocument();
  });
  
  test('shows badge when count > 0', () => {
    const groups = [{
      id: "test",
      items: [{ id: "alerts", badge: 5, isVisible: () => true }]
    }];
    render(<DashboardSidebar customNavigationGroups={groups} ... />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
```

---

## Related Documentation

- [employer-dashboard-instructions-v1.0.md](./employer-dashboard-instructions-v1.0.md) - Uses these components
- [technician-dashboard-instructions-v1.0.md](./technician-dashboard-instructions-v1.0.md) - Uses these components
- [resident-dashboard-instructions-v1.0.md](./resident-dashboard-instructions-v1.0.md) - Uses these components
- `design_guidelines.md` - Visual design standards

---

## Version History

- **v1.0** (December 25, 2024): Initial documentation
