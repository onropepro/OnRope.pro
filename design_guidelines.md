# Design Guidelines: Rope Access Management Platform

## Design Approach

**Selected System:** Material Design 3
**Rationale:** This mobile-first, data-intensive operations management platform requires a proven design system optimized for productivity applications. Material Design 3 provides excellent mobile patterns, clear information hierarchy, and robust component libraries perfect for role-based dashboards and form-heavy interfaces used by field technicians.

## Core Design Principles

1. **Mobile-First Excellence** - Every interface optimized for one-handed phone operation
2. **Role Clarity** - Immediate visual distinction between user role dashboards
3. **Data Accessibility** - Critical information (daily drop targets, project status) always visible
4. **Touch-Friendly** - Minimum 44px touch targets, generous spacing between interactive elements
5. **Scan-Optimized** - High contrast, clear labels, logical grouping for quick information parsing

## Typography

**Font Family:** Roboto (via Google Fonts CDN)

**Type Scale:**
- H1 (Page Headers): 2rem (32px), font-weight 700
- H2 (Section Headers): 1.5rem (24px), font-weight 600
- H3 (Card Titles): 1.25rem (20px), font-weight 600
- Body Large: 1rem (16px), font-weight 400
- Body Regular: 0.875rem (14px), font-weight 400
- Caption: 0.75rem (12px), font-weight 400
- Button Text: 0.875rem (14px), font-weight 500, uppercase

**Line Heights:** 1.5 for body text, 1.2 for headings

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Micro spacing (within components): p-2, gap-2
- Standard spacing (between elements): p-4, gap-4, mb-4
- Section spacing: p-6, mb-6
- Major section breaks: p-8, mb-8

**Mobile Container:**
- Full width with px-4 horizontal padding
- Max-width: none on mobile
- Safe area padding for notched devices

**Grid System:**
- Single column default for mobile
- Cards stack vertically with gap-4
- Lists use full width

## Component Library

### Navigation

**Top Navigation Bar (Persistent):**
- Fixed position at top, h-16
- Company logo/name (left), user role badge (center), menu icon (right)
- For Rope Techs: Daily drop target displayed prominently in center
- Elevation with shadow-md
- Tap targets minimum 44px

**Bottom Navigation (Role-Based):**
- Fixed at bottom, h-16
- 3-4 primary navigation items with icons and labels
- Active state with filled icon and underline indicator
- Example tabs: Dashboard, Projects, Complaints, Profile

### Dashboard Components

**Project Cards:**
- Elevated cards with rounded-lg borders
- p-4 internal padding, mb-4 between cards
- Header: Project name (H3), Strata plan number (caption)
- Body: Job type badge, floor count, completion percentage
- Footer: Action buttons or status indicator
- Tap to expand for full details

**High-Rise Building Visualization:**
- Custom SVG component (central feature for resident view)
- Dynamic height based on floor count (each floor: 40px height)
- Building width: 200px on mobile
- Windows: 8-12px squares, arranged 4-5 per floor
- Lit windows indicated through opacity or visual treatment
- Building outline with subtle shadow for depth
- Centered on screen with generous margin (my-8)
- Floor number labels on left side (caption text)

**Progress Indicators:**
- Numeric percentage display (H2 size)
- Drops completed / Total drops (body regular)
- Estimated completion date (caption)

### Forms

**Input Fields:**
- Full width on mobile
- h-12 minimum height for text inputs
- Rounded-lg borders
- p-4 internal padding
- mb-4 spacing between fields
- Floating labels with smooth transition
- Required field indicator (*)
- Error states with helper text below (caption, error styling)

**Form Sections:**
- Grouped related fields with mb-6 separation
- Section headers (H3) with mb-4
- Background card elevation for form containers

**Buttons:**
- Primary: h-12, px-6, rounded-lg, font-weight 500, uppercase
- Secondary: h-12, px-6, rounded-lg, outlined variant
- Full width on mobile for primary actions
- Icon + text combination when helpful
- Loading states with spinner
- Disabled state with reduced opacity

### Data Display

**Complaint Cards:**
- Elevated cards with p-4, mb-4
- Header row: Resident name, unit number, status badge
- Date/time stamp (caption)
- Preview of complaint text (2 lines max, truncated)
- Tap to expand to full detail view
- Status badges: Open (outlined), Closed (filled)

**Complaint Detail View:**
- Full screen modal or new page
- Header with back button, status toggle
- Resident info section (name, phone, unit) with icon prefixes
- Full complaint text in readable block (max-w-prose)
- Notes section with accordion/expandable pattern
- Add note button (sticky at bottom)
- Action buttons: Close Complaint, Add Note (h-12 each)

**Employee List:**
- Simple list items, not cards
- Each item: h-16, px-4, flex row
- Name, role badge, email (caption)
- Right-aligned action menu icon
- Dividers between items

**Project Creation/Edit:**
- Multi-step form or single long form with clear sections
- File upload area for PDF: Dashed border, h-32, centered icon and text
- Upload preview: Show filename, file size, remove button
- Job type: Radio button group or segmented control
- Floor count: Number input with +/- steppers
- Daily drop target: Large number input with clear label

### Search & Filters

**Search Bar:**
- Sticky at top of scrollable lists
- h-12, rounded-full, px-4
- Icon prefix (magnifying glass)
- Clear button when text entered
- Placeholder: "Search by Strata Plan Number"

**Date Picker (Historical Drop Entry):**
- Calendar modal on tap
- Quick select options: Today, Yesterday, Last 7 Days
- Custom date selector with month/year navigation
- Selected date highlighted

### Status & Feedback

**Empty States:**
- Centered icon (large, 64px)
- Message text (body large)
- Optional action button
- Generous padding (p-8)

**Loading States:**
- Skeleton screens for cards/lists
- Centered spinner for full-page loads
- Progress indicators for file uploads

**Toast Notifications:**
- Bottom of screen, above nav bar
- Rounded-lg, px-4, py-3
- Icon, message, optional action
- Auto-dismiss after 4 seconds

## Icons

**Icon Library:** Material Icons (via Google Fonts CDN)
**Icon Sizes:**
- Small: 16px (captions, inline)
- Medium: 24px (buttons, list items)
- Large: 32px (headers, empty states)
- XL: 64px (empty states, splash)

**Common Icons:**
- Building/apartment for projects
- Person for employees
- Comment/chat for complaints
- Calendar for date selection
- Upload for file uploads
- Settings for admin
- Check/close for status

## Mobile Optimization

- All interactive elements minimum 44px height
- Generous tap targets with invisible padding extensions
- Bottom sheet modals for selections (easier thumb reach)
- Sticky headers and footers for context retention
- Pull-to-refresh patterns for data lists
- Swipe gestures for secondary actions (archive, delete)
- Safe area insets for modern devices

## Accessibility

- WCAG AA contrast ratios minimum
- Touch targets 44x44px minimum
- Focus indicators on all interactive elements
- Aria labels for icon-only buttons
- Semantic HTML throughout
- Form labels always visible
- Error messages programmatically associated