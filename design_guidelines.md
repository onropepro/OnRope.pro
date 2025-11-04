# Design Guidelines: Rope Access Management Platform

## Design Approach

**Selected System:** Material Design 3  
**Rationale:** Mobile-first industrial operations platform requiring proven productivity patterns. Material Design 3 excels at data-dense interfaces, role-based dashboards, and form-heavy workflows critical for field technicians managing high-rise maintenance operations.

## Core Design Principles

1. **Mobile-First Excellence** - One-handed operation prioritized
2. **Role Clarity** - Immediate visual distinction between dashboards
3. **Safety & Trust** - Industrial-grade professionalism in every interaction
4. **Data Visibility** - Critical metrics (drop targets, completion status) always accessible
5. **Touch-Optimized** - 44px minimum targets, generous spacing
6. **Quick-Scan Design** - High contrast, clear labels, logical grouping

## Typography

**Font Family:** Roboto (Google Fonts CDN)

**Type Scale:**
- Display (Dashboard Headers): 2.5rem (40px), weight 700, tight line-height 1.1
- H1 (Page Titles): 2rem (32px), weight 700
- H2 (Section Headers): 1.5rem (24px), weight 600
- H3 (Card Titles): 1.25rem (20px), weight 600
- Body Large (Primary Content): 1rem (16px), weight 400
- Body (Standard): 0.875rem (14px), weight 400
- Caption (Metadata): 0.75rem (12px), weight 400
- Button: 0.875rem (14px), weight 500, uppercase, letter-spacing 0.5px

**Line Heights:** 1.5 body text, 1.2 headings, 1.1 display

## Layout System

**Spacing Primitives:** Tailwind units 2, 4, 6, 8

- **Component Internal:** p-2, gap-2
- **Standard Spacing:** p-4, gap-4, mb-4
- **Section Spacing:** p-6, mb-6, mt-6
- **Major Breaks:** p-8, mb-8, mt-8

**Mobile Container:**
- Full width, px-4 horizontal padding
- Safe area insets for notched devices
- Single column stacking with gap-4

**Desktop Expansion (md: breakpoint):**
- max-w-7xl centered containers
- Two-column grids for dashboard cards
- Three-column layouts for employee/project lists

## Component Library

### Navigation

**Top App Bar (Persistent):**
- Fixed top, h-16, shadow-md elevation
- Left: Company logo (40px height)
- Center: User role badge + daily drop count for Rope Techs (H3 size)
- Right: Menu icon (32px touch target expanded to 44px)

**Bottom Navigation (Role-Based):**
- Fixed bottom, h-16, elevated
- 4 primary tabs: Dashboard, Projects, Complaints, Profile
- Icon (24px) + label (caption) stacked vertically
- Active state: filled icon, indicator bar above
- 56px minimum touch width per tab

### Dashboard Components

**Hero Statistics Panel:**
- Full-width card, p-6, mb-6, elevated
- Display-size primary metric (today's drops completed)
- Secondary metrics in grid: target drops, completion %, week total
- Progress visualization bar, h-4, rounded-full
- Role-specific messaging (motivational for techs, analytical for managers)

**Project Cards:**
- Elevated, rounded-xl, p-5, mb-4
- Header row: Building name (H3) + status badge (filled or outlined)
- Metadata grid: Strata plan, job type, floor count
- Visual progress: Percentage (H2) + horizontal bar
- Completion estimate with calendar icon
- Footer CTA: "View Details" button (h-12, full width)
- Tap card for expansion with smooth transition

**High-Rise Building Visualization (Resident Dashboard):**
- Custom SVG, centered with my-8 margin
- Dynamic height: floor count × 45px (min 300px, max 600px mobile)
- Building width: 240px mobile, 320px desktop
- Windows: 12px squares, 5 per floor, gap-2 spacing
- Window states: completed (visual treatment), pending (muted)
- Floor numbers: left-aligned, caption size, -ml-8 offset
- Building elevation shadow for depth
- Rooftop detail: 20px cap with equipment silhouettes

**Complaint Summary Cards:**
- p-4, mb-3, rounded-lg, subtle elevation
- Header: Resident name (H3) + urgency badge
- Unit number + date (caption row with icons)
- Preview: 2-line truncated text, body size
- Status indicator: Open (outlined), In Progress (filled), Closed (success state)
- Swipe-left reveals quick actions (archive, escalate)

### Forms & Input

**Standard Input Fields:**
- Full width, h-12, rounded-lg
- p-4 internal, mb-4 vertical spacing
- Floating labels with 200ms transition
- Required asterisk, error messages (caption, below field)
- Focus state with elevated shadow

**Multi-Step Project Creation:**
- Progress stepper at top (4 steps: Details, Schedule, Team, Review)
- Current step highlighted, completed steps with checkmarks
- Step titles (body) below icons
- Each step: full-screen form section with p-6
- Navigation: "Back" (text button) + "Next" (primary, h-12, full width)

**PDF Upload Zone:**
- Dashed border, h-40, rounded-lg
- Centered upload icon (48px) + instruction text (body large)
- Drag-and-drop active state with visual feedback
- Upload preview: filename + size + remove icon (24px)

**Date Pickers:**
- Bottom sheet modal on tap
- Quick actions: Today, Yesterday, Last 7 Days (chip buttons)
- Calendar grid: 7-column, 40px cells
- Selected date: filled state, clear visual distinction

**Number Inputs (Drop Counts):**
- Center-aligned, H2 size display
- Left/right stepper buttons (44px square, icon-only)
- Manual edit on tap with numeric keyboard
- Validation: max daily target warning

### Data Display

**Employee Directory:**
- List items, h-20, px-4, not cards
- Avatar placeholder (40px circle) + name (body large) + role (caption)
- Email with mail icon (caption row)
- Right-aligned overflow menu (vertical dots, 44px touch)
- Dividers between items
- Search bar sticky at top: h-12, rounded-full, icon prefix

**Complaint Detail View:**
- Full-screen with back navigation
- Hero info card: resident details, contact button, unit #
- Timeline visualization: complaint submission → updates → resolution
- Each timeline entry: timestamp (caption) + description (body)
- Accordion sections: Notes (expandable), Attachments, History
- Add note: floating action button (56px circle, bottom-right, elevated)
- Action bar sticky bottom: "Mark Resolved" + "Escalate" (h-12 each)

**Statistics Dashboard (Manager Role):**
- KPI grid: 2×2 on mobile, 4×1 on desktop
- Each metric card: large number (display) + label (caption) + trend indicator
- Chart integration: bar charts for weekly drops, line for completion trends
- Time range selector: tabs for Week, Month, Quarter, Year

### Interactive Elements

**Search Functionality:**
- Persistent search bar on list views
- h-12, rounded-full, px-4, icon prefix (20px)
- Real-time filtering as user types
- Clear button (X icon) when text present
- Placeholder examples: "Search strata plans", "Find employee"

**Filters Panel:**
- Bottom sheet modal, triggered by filter icon
- Section headers (H3) for filter categories
- Chip groups for multi-select options
- Date range picker for temporal filters
- Apply/Reset buttons at bottom (h-12 each)

**Status Badges:**
- Inline, px-3, py-1, rounded-full, caption text
- Icon prefix (16px) for quick recognition
- Variants: Open, In Progress, Completed, Overdue, Urgent
- Filled for active states, outlined for inactive

### Feedback & States

**Empty States:**
- Centered layout, p-12
- Illustration or large icon (96px)
- Title (H2) + description (body) + CTA button
- Examples: "No complaints yet", "Start your first project"

**Loading States:**
- Skeleton screens for cards (shimmer animation)
- Full-page spinner: centered, 48px, with "Loading..." caption
- Progress bars for file uploads with percentage

**Toast Notifications:**
- Bottom of screen, 16px above nav bar
- Rounded-lg, px-4, py-3, shadow-lg
- Icon (24px) + message (body) + action (text button)
- 4-second auto-dismiss, swipe to dismiss

**Success Confirmations:**
- Full-screen modal with checkmark icon (96px)
- Success message (H2) + detail text (body)
- Primary action button: "Done" or "View Project" (h-12)

## Icons

**Library:** Material Icons (Google Fonts)  
**Sizes:** 16px (inline), 24px (standard), 32px (headers), 48px (features), 96px (empty states)

**Icon Set:**
- Buildings: apartment, domain
- Actions: upload_file, calendar_today, add_circle, edit
- Status: check_circle, error, pending, schedule
- Navigation: menu, arrow_back, more_vert
- Roles: person, admin_panel_settings, engineering
- Complaints: comment, support_agent, priority_high

## Images

**Hero Images (Desktop Dashboard Views):**
- Location: Top of Operations Manager and Supervisor dashboards
- Specs: 1920×600px, optimized WebP format
- Content: Professional rope access technicians on high-rise buildings, safety equipment visible, urban skyline backdrop
- Treatment: Subtle gradient overlay (top to bottom) for text legibility
- Buttons on image: Blurred backdrop (backdrop-blur-md), semi-transparent background

**Building Thumbnails (Project Cards):**
- Location: Left side of project cards, 80×80px rounded-lg
- Content: Actual building photos when available, placeholder building icon otherwise
- Fallback: Branded placeholder with building silhouette

**Profile Avatars:**
- 40px circles in lists, 96px in profile view
- Initials fallback when photo unavailable
- Consistent across all role views

## Accessibility & Mobile Optimization

- 44×44px minimum touch targets (invisible padding extensions when needed)
- WCAG AA contrast ratios enforced
- Focus indicators: 2px offset ring
- Semantic HTML structure throughout
- Aria labels for icon-only buttons
- Form labels always visible, never placeholder-only
- Pull-to-refresh on data lists
- Swipe gestures for secondary actions (delete, archive)
- Safe area handling for notched devices
- Haptic feedback on critical actions (iOS)