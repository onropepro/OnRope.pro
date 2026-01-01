# Shared Dashboard Components Instructions v1.0
**System**: OnRopePro - Rope Access Management Platform  
**Domain**: Unified Dashboard Architecture  
**Version**: 1.0  
**Last Updated**: January 1, 2026  
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
  // Core required props
  currentUser: User | null | undefined;
  activeTab: string;
  onTabChange: (tab: string) => void;
  
  // Variant-based theming (defaults to "employer" if not specified)
  variant?: DashboardVariant;  // 'employer' | 'technician' | 'property-manager' | 'resident' | 'building-manager' | 'ground-crew'
  customNavigationGroups?: NavGroup[];  // Override default navigation
  showDashboardLink?: boolean;  // Whether to show link back to main dashboard
  
  // Mobile sidebar external control (optional)
  // When these props are provided, the parent component controls the mobile sidebar state
  // and the built-in hamburger menu button is hidden
  mobileOpen?: boolean;  // External control of mobile sidebar visibility
  onMobileOpenChange?: (open: boolean) => void;  // Callback when mobile sidebar should open/close
  
  // Optional branding and display props
  brandingLogoUrl?: string | null;
  whitelabelBrandingActive?: boolean;
  companyName?: string;
  employeeCount?: number;
  alertCounts?: {
    expiringCerts?: number;
    overdueInspections?: number;
    pendingTimesheets?: number;
    unsignedDocs?: number;
    jobApplications?: number;
    quoteNotifications?: number;
  };
  customBrandColor?: string;
  dashboardLinkLabel?: string;
  headerContent?: React.ReactNode;
}
```

**Note**: The `variant` prop is optional and defaults to `"employer"` in the function implementation:
```typescript
variant = "employer"  // Default in function destructuring
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

#### Technician Portal (with external mobile control)
```tsx
// In TechnicianPortal.tsx
const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

// Sidebar component with external mobile control
<DashboardSidebar
  currentUser={user}
  activeTab={activeTab}
  onTabChange={(tab) => setActiveTab(tab as TabType)}
  variant="technician"
  customNavigationGroups={technicianNavGroups}
  showDashboardLink={false}
  mobileOpen={mobileSidebarOpen}
  onMobileOpenChange={setMobileSidebarOpen}
/>

// Header with hamburger menu button (when using external control)
<header className="sticky top-0 z-[100] h-14 ...">
  <Button
    variant="ghost"
    size="icon"
    className="lg:hidden"
    onClick={() => setMobileSidebarOpen(true)}
  >
    <Menu className="h-5 w-5" />
  </Button>
  {/* ... other header content */}
</header>
```

**Note**: When using external control (`mobileOpen`/`onMobileOpenChange`), the built-in hamburger button is hidden. The parent component must provide its own trigger button.

### Variant-Based Styling

Each variant applies stakeholder-specific brand colors via the exported `STAKEHOLDER_COLORS` constant:

```typescript
// From DashboardSidebar.tsx - This is the actual implementation
export type DashboardVariant = "employer" | "technician" | "property-manager" | "resident" | "building-manager" | "ground-crew";

export const STAKEHOLDER_COLORS: Record<DashboardVariant, string> = {
  employer: "#0B64A3",          // Blue
  technician: "#5C7A84",        // Blue-gray
  "property-manager": "#6E9075", // Sage
  resident: "#86A59C",          // Teal
  "building-manager": "#B89685", // Taupe
  "ground-crew": "#5D7B6F",     // Forest green
};
```

The sidebar determines brand color at runtime:

```typescript
// Inside DashboardSidebar component
const BRAND_COLOR = customBrandColor || STAKEHOLDER_COLORS[variant];
```

This allows:
1. **Variant-based defaults**: Each stakeholder type gets its predefined color
2. **Custom overrides**: Pass `customBrandColor` prop to override the variant default
3. **White-label support**: Companies can customize with their own brand colors

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
  isVisible: (user: User | null | undefined) => boolean;  // Receives user context
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

### Collapsible Navigation Groups

Navigation groups can be collapsed/expanded by clicking the group header. The collapse state is persisted per dashboard variant in localStorage.

**Behavior:**
- Each group header includes a chevron icon indicating collapse state
- Clicking the header toggles the group's visibility
- Collapsed state is saved independently for each dashboard variant
- When switching between dashboards (e.g., employer to technician), each variant loads its own collapse preferences

**Storage Key Pattern:**
```
sidebar-collapsed-${variant}
// Examples:
// sidebar-collapsed-employer
// sidebar-collapsed-technician
// sidebar-collapsed-property-manager
```

**Implementation Details:**
- Uses Radix UI `Collapsible` component for accessible expand/collapse
- `loadedVariant` state prevents cross-contamination between variants
- Write effect only persists after state is loaded for current variant
- ChevronDown icon rotates -90deg when group is collapsed

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
| Technician | `#5C7A84` | Light (white) | Light (white) |
| Ground Crew | `#5D7B6F` | Light (white) | Light (white) |
| Resident | `#86A59C` | Dark (slate-900) | Light (white) |
| Property Manager | `#6E9075` | Dark (slate-900) | Light (white) |
| Building Manager | `#B89685` | Dark (slate-900) | Light (white) |
| SuperUser | `#6B21A8` | Light (white) | Light (white) |
| CSR | `#0B64A3` | Light (white) | Light (white) |

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

## UnifiedDashboardHeader Component

### Overview

The `UnifiedDashboardHeader` component (`client/src/components/UnifiedDashboardHeader.tsx`, ~639 lines) provides a consistent header experience across all dashboard types. Unlike `DashboardSidebar` which has 6 variants, the header supports **8 variants** including superuser and CSR roles.

### Header Variants

```typescript
export type HeaderVariant = 'employer' | 'technician' | 'ground-crew' | 'resident' | 'property-manager' | 'building-manager' | 'superuser' | 'csr';

const AVATAR_COLORS: Record<HeaderVariant, string> = {
  employer: '#0B64A3',
  technician: '#5C7A84',       // Blue-gray (matches sidebar)
  'ground-crew': '#5D7B6F',    // Forest green
  resident: '#86A59C',         // Teal
  'property-manager': '#6E9075', // Sage
  'building-manager': '#B89685', // Taupe
  superuser: '#6B21A8',        // Purple
  csr: '#0B64A3',              // Blue (same as employer)
};
```

### Safe Variant Resolution

The header includes runtime type validation to handle invalid or undefined variants:

```typescript
export function isValidVariant(variant: string): variant is HeaderVariant {
  return ['employer', 'technician', 'ground-crew', 'resident', 'property-manager', 'building-manager', 'superuser', 'csr'].includes(variant);
}

export function getSafeVariant(variant: string | undefined): HeaderVariant {
  if (!variant) return 'employer';
  return isValidVariant(variant) ? variant : 'employer';
}
```

**Usage Pattern**: Always use `getSafeVariant()` when passing variant props from external sources.

### Header Features

The header includes:
- **Profile dropdown**: User avatar with role display, logout
- **Notification bell**: `NotificationBell` component
- **Language selection**: `LanguageDropdown` component
- **PWA install**: `InstallPWAButton` component
- **License expiry warnings**: `LicenseExpiryWarningBanner` for employer variant
- **Subscription renewal**: `SubscriptionRenewalBadge` component

### useInlineActions Hook Pattern

TechnicianPortal and GroundCrewPortal use the `useInlineActions` hook for tab-based navigation within the header:

```typescript
// From TechnicianPortal.tsx
const { inlineActions } = useInlineActions({
  onProfileClick: () => setActiveTab('profile'),
  onSettingsClick: () => setActiveTab('more'),
  // ... other handlers
});

<UnifiedDashboardHeader
  variant="technician"
  inlineActions={inlineActions}
/>
```

This pattern allows the header's profile dropdown to navigate to tabs within the portal rather than external routes.

### Intentional Exceptions

**ResidentDashboard and PropertyManagerDashboard** do NOT use `UnifiedDashboardHeader`. They implement custom headers that show:
- Project/building context for residents
- Vendor connection context for property managers

These are **intentional architectural decisions** documented here as SSOT.

---

## Related Documentation

- [employer-dashboard-instructions-v1.0.md](./employer-dashboard-instructions-v1.0.md) - Uses these components
- [technician-passport-instructions-v1.0.md](./technician-passport-instructions-v1.0.md) - Uses these components
- [resident-dashboard-instructions-v1.0.md](./resident-dashboard-instructions-v1.0.md) - Uses these components
- `design_guidelines.md` - Visual design standards

---

## Version History

- **v1.0** (December 25, 2024): Initial documentation
- **v1.1** (January 1, 2026): Updated technician color (#AB4521 → #5C7A84), added UnifiedDashboardHeader documentation with 8 variants, documented useInlineActions pattern
