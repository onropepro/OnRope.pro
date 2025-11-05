# Design Guidelines: Rope Access Management Platform

## System & Principles

**Design System:** Material Design 3 with Premium Enhancements  
**Core Principles:** Mobile-first (44px touch targets), enterprise polish (layered elevations), clear visual hierarchy, data clarity (high-contrast), professional safety-conscious aesthetic.

## Typography (Roboto via Google Fonts)

```css
Display (Hero): 3rem/700/1.1/-0.02em
H1 (Dashboard): 2rem/700/1.2
H2 (Sections): 1.5rem/600/1.3
H3 (Cards): 1.25rem/600/1.4
Body Large: 1rem/400/1.6
Body: 0.875rem/400/1.5
Caption: 0.75rem/400/1.4/+0.4px
Button: 0.875rem/500/uppercase/+0.5px
```

**Rules:** Dashboard headers use Display, card titles max H3, body text 1.5-1.6 line-height, captions for metadata only.

## Layout & Spacing

**Tailwind Units:** 2(8px), 4(16px), 6(24px), 8(32px)  
- Micro (gap-2, p-2): Icon-label pairs  
- Standard (gap-4, p-4, mb-4): Card internals, form fields  
- Section (p-6, mb-6): Card padding, breaks  
- Major (p-8, mb-8): Dashboard sections  

**Containers:**  
- Mobile: Full width, px-4, single column, gap-4  
- Desktop (md:): max-w-7xl centered, 2-col grids (gap-6), 240px fixed sidebar  

**Polish:** 4px radius (rounded-lg) cards, 8px (rounded-xl) modals, layered shadows (base elevation-1, modals elevation-3), min 24px between major sections.

## Navigation

**Top App Bar** (h-16, shadow-lg):  
- Desktop: Logo 48px | Breadcrumbs | Avatar menu  
- Mobile: Logo 40px | Role badge | Hamburger (44px)  
- Backdrop-blur-sm on scroll

**Bottom Nav** (Mobile, h-16, fixed):  
4 tabs (Dashboard/Projects/Complaints/Profile), 56px tap width, icon 24px + caption stacked, 3px active indicator, 150ms transitions.

**Desktop Sidebar** (w-60, fixed):  
Logo header (h-20, p-6), grouped nav (caption headers), items h-12/px-4/rounded-lg, 4px left accent on active, hover backgrounds.

## Core Components

### Hero Stats Panel
Full-width card (p-8, mb-8, rounded-xl), Display metric + 2×2 grid (mobile) / 1×4 (desktop) secondary metrics (H1 numbers + caption labels + 24px icons), h-2 rounded progress bar, role-specific messaging.

### Project Cards
```
- Elevated, rounded-xl, p-6, mb-4
- 80×80px thumbnail (rounded-lg, float left desktop)
- H3 title (weight 700) + status badge
- Metadata: plan • type • floors (body, dot separators)
- H2 percentage + h-3 progress bar
- Footer CTA: h-12 (w-full mobile, w-auto px-8 desktop)
- 200ms expand transition, hover shadow-xl
```

### High-Rise Visualization (SVG)
- Height: floor_count × 45px, cap 300px mobile/600px desktop  
- Width: 240px mobile/320px desktop  
- 5 windows/floor (12×12px, gap-2), state-coded completion  
- Floor numbers (-ml-8, caption), 20px rooftop detail  
- Multi-layer shadows, responsive scaling

### Complaint Cards
List style (p-4, mb-3, rounded-lg): H3 name + urgency badge, unit/date row (16px icons, caption), 2-line description preview, status indicator. Mobile: swipe-left 44px actions. Desktop: hover inline actions.

## Forms

**Text Inputs** (h-12, rounded-lg, px-4 py-3):  
Floating labels (150ms), focus shadow + label animation, error messages (caption + icon), asterisk for required, mb-4 spacing.

**Multi-Step Forms:**  
Progress stepper (32px circles, icons/numbers, connecting lines), step labels, p-6 sections, sticky bottom nav (Back text + Continue primary h-12).

**File Upload** (border-2 dashed, h-40, rounded-xl):  
48px icon + body instruction + caption formats, drag-active solid border, thumbnails 40×40px + remove button 32px.

**Date Pickers:**  
Bottom sheet (mobile) / dropdown (desktop), quick chips (Today/Yesterday/7 Days), calendar 7-col grid 40px cells.

## Data Display

**Employee Directory:**  
h-20 items, 40px avatar + body large name (weight 500) + role badge, caption email row (16px icon), 44px overflow menu, sticky h-12 rounded-full search (mb-4).

**Manager Stats:**  
2×2 mobile / 4×1 desktop grid, elevated p-6 cards: Display number, caption uppercase label, 16px trend icon + percentage, integrated charts, chip time tabs.

**Complaint Detail:**  
Full-screen, hero card with contact CTA (h-12), vertical timeline (caption timestamps + body events + 24px icons), accordion sections, 56px FAB (bottom-right, shadow-xl), sticky action bar (h-12 buttons).

## Interactive Elements

**Search:** h-12 rounded-full px-4, 20px prefix icon, X clear button, 200ms debounce filtering.

**Filters:** Bottom sheet/sidebar, H3 categories, multi-select chips with checkmarks, date pickers, Apply (primary) + Reset (text) buttons.

**Status Badges:** px-3 py-1.5 rounded-full caption, 16px icon prefix, filled (active) / outlined (inactive). States: Open, In Progress, Completed, Overdue, Urgent.

**Buttons:**
```
Primary: h-12 px-8 rounded-lg shadow-md weight-500
Secondary: h-12 px-8 rounded-lg outlined no-shadow
Text: h-12 px-4 no-background
Icon: 44×44px minimum, 24px centered icon
FAB: 56px circle shadow-xl 24px icon
```

## Feedback States

**Empty:** Centered p-12, 96px icon, H2 title + body description (max-w-md) + primary CTA.

**Loading:** Skeleton shimmer (2s loop) or 48px spinner + caption.

**Toasts:** Bottom (16px above nav mobile / 24px desktop), rounded-lg px-4 py-3 shadow-xl, 24px icon + body message + optional action, 4s auto-dismiss.

**Success:** Full-screen modal, 96px animated checkmark, H2 title + body large detail, primary action h-12 px-8.

## Media Assets

**Hero Images** (Desktop dashboards only):  
1920×600px WebP, rope access techs on high-rises, gradient overlay (60% dark-to-transparent top), backdrop-blur-md CTAs.

**Thumbnails:**  
Projects: 80×80px rounded-lg object-cover, fallback 32px building silhouette.  
Avatars: 40px lists / 96px profile, initials fallback.

**Icons (Material Icons):**  
16px inline, 20px sidebar, 24px buttons/cards, 32px headers, 48px uploads, 96px empty states.  
Core set: apartment, domain, upload, calendar_today, add_circle, edit, delete, check_circle, error, pending, menu, arrow_back, more_vert, person, admin_panel_settings, support_agent, priority_high, analytics.

## Animations (Minimal)

```
Page transitions: 200ms ease-out
Card expand: 200ms ease-in-out
Skeleton shimmer: 2s loop
Success checkmark: 500ms scale-bounce
Progress fill: 300ms
Modal fade: 150ms
```
**Avoid:** Scroll-triggered, parallax, hover micro-interactions, decorative motion.

## Accessibility

- WCAG AA contrast  
- 2px focus rings with offset  
- Semantic HTML + aria-labels on icon buttons  
- 44×44px touch targets (invisible padding)  
- Pull-to-refresh on lists  
- Haptic feedback (iOS critical actions)  
- Safe area insets (notched devices)  
- Reduced motion support