# Design Guidelines: Rope Access Management Platform (Modern SaaS Edition)

## Design System & Approach

**Reference Systems:** Linear (hierarchy, spacing), Stripe (trust, precision), Vercel (contemporary boldness)  
**Core Principles:** Mobile-first (44px touch targets), dramatic depth through shadows and spacing, vibrant contrast, clean white surfaces, premium SaaS aesthetic, cutting-edge professionalism.

## Color Palette

**Primary:**
- Midnight: #0A0A0A (primary text, headers)
- Slate: #71717A (secondary text)
- Electric Blue: #3B82F6 (primary actions, links)
- Indigo: #6366F1 (secondary actions)

**Vibrant Accents:**
- Coral: #FF6B6B (urgent, errors, high alerts)
- Lime: #84CC16 (success, completed)
- Amber: #F59E0B (warnings, progress)
- Cyan: #06B6D4 (info, secondary highlights)

**Surfaces:**
- Pure White: #FFFFFF (card backgrounds, main surface)
- Ghost: #FAFAFA (page backgrounds)
- Smoke: #F4F4F5 (subtle borders, dividers)
- Charcoal: #18181B (dark mode elements, contrast blocks)

## Typography (Inter via Google Fonts)

```
Display: 3.5rem/800/1.05/-0.03em
H1: 2.25rem/700/1.2/-0.02em
H2: 1.75rem/700/1.3/-0.01em
H3: 1.25rem/600/1.4
Body Large: 1.125rem/400/1.6
Body: 1rem/400/1.5
Caption: 0.875rem/500/1.4
Button: 0.9375rem/600/normal
```

## Layout & Spacing

**Tailwind Units:** 2, 4, 8, 12  
**Containers:** Mobile px-4 full-width, Desktop max-w-7xl mx-auto, Sidebar w-64 fixed  
**Grid Systems:** 2-col md:, 3-col lg:, 4-col stats xl:, gap-8 for cards, gap-4 for tight groups

## Elevation & Depth

**Shadow System:**
```
sm: 0 1px 2px rgba(0,0,0,0.05)
md: 0 4px 6px rgba(0,0,0,0.07)
lg: 0 10px 15px rgba(0,0,0,0.08)
xl: 0 20px 25px rgba(0,0,0,0.1)
2xl: 0 25px 50px rgba(0,0,0,0.15)
```

**Card Treatment:**  
White background, rounded-2xl (16px), shadow-lg, 1px border (Smoke), p-6 standard, hover: shadow-xl + slight lift (-2px).

**Critical Depth:**  
Multi-layer shadows for floating elements, generous whitespace (p-8 to p-12 on large sections), border contrast for separation.

## Navigation

**Top Bar (h-16):**  
White background, shadow-sm, logo 40px height, sharp black text nav items, Electric Blue active underline (3px), user avatar 36px with Smoke ring.

**Mobile Bottom Nav (h-16):**  
White background, shadow-2xl, Electric Blue active state (bg + icon), 24px icons, 6px dot badges (Coral/Lime), safe-area-inset-bottom.

**Desktop Sidebar (w-64):**  
Ghost background, active item: white bg + shadow-md + Electric Blue left accent (4px), grouped sections with Smoke dividers (1px), collapsed state w-20.

## Hero Section

**Layout:**  
Full-width image (1920×800px) of rope access technicians on dramatic high-rise, dark gradient overlay (rgba(10,10,10,0.4)), Display white text with strong contrast, two CTAs side-by-side (Electric Blue solid + white outlined with blur backdrop), py-24 vertical spacing.

**Stats Panel (Below Hero):**  
White card, shadow-2xl, rounded-3xl, -mt-16 (overlapping hero), p-8, 2×2 grid stats (Display numbers in Midnight, Caption labels in Slate), vertical Smoke dividers, Cyan accent icons 40px.

## Core Components

**Project Cards:**  
White bg, rounded-2xl, shadow-lg, p-6, 120×120px building thumbnail (rounded-xl, shadow-md), H3 title (Midnight), status badge (rounded-full, vibrant bg, white text, px-3 py-1), metadata row (Slate text, 16px icons), H2 completion percentage (Electric Blue), progress bar (h-2, rounded-full, Ghost bg, vibrant fill), hover: shadow-xl transform.

**High-Rise Visualization:**  
SVG building silhouette (floor_count × 50px), Charcoal outline, window grid (color-coded: Lime completed, Amber in-progress, Smoke pending), floor number labels (Slate), rooftop detail, strong drop shadow.

**Complaint Cards:**  
White bg, rounded-xl, shadow-md, p-4, urgency badge (Coral/Amber/Lime rounded-full), H3 name (Midnight), icon-text metadata (Slate), 2-line preview, left accent bar (4px vibrant color), swipe actions reveal (Coral delete, Electric Blue resolve).

## Forms

**Text Inputs:**  
White bg, h-12, rounded-lg, Smoke border (2px), Electric Blue focus ring (3px), floating label animation (200ms), icon prefix (Slate), error: Coral border + text.

**Multi-Step:**  
Horizontal stepper, numbered circles (44px), Electric Blue active/completed, Smoke connector lines (2px), white section cards, shadow-md, sticky bottom actions bar (white bg, shadow-2xl).

**File Upload:**  
White bg, Smoke dashed border (2px), h-48, rounded-xl, Electric Blue hover state, 56px upload icon, thumbnail grid (rounded-lg, shadow-sm), Coral remove button.

## Data Display

**Employee Directory:**  
White list cards, shadow-sm, h-24, 48px avatars (rounded-full, shadow-md), role badge (Ghost bg, Midnight text), Slate metadata, sticky search bar (white, shadow-md, h-14).

**Manager Dashboard:**  
White cards, shadow-lg, p-8, Display metrics (Midnight), trend arrows (Lime/Coral), integrated charts (vibrant accent colors), tab navigation (Electric Blue active underline 3px).

**Complaint Detail:**  
White hero card, shadow-xl, rounded-3xl, p-8, timeline (Electric Blue connector, 12px dots), accordion sections (white, shadow-sm), 56px FAB (Electric Blue, shadow-2xl, fixed bottom-right).

## Buttons

**Primary:** h-12 px-8 rounded-lg Electric Blue bg white text shadow-md  
**Secondary:** h-12 px-8 rounded-lg white bg Electric Blue text Smoke border (2px)  
**Danger:** h-12 px-8 rounded-lg Coral bg white text  
**Icon:** 44×44px white bg shadow-sm 24px icon  
**FAB:** 56px Electric Blue shadow-2xl white icon

## Status Badges

Rounded-full, vibrant bg, white text, px-4 py-1.5, 18px icon prefix, shadow-sm: Lime (completed), Amber (progress), Coral (urgent), Cyan (info).

## Images

**Hero Image:**  
1920×800px professional photograph: rope access technicians working on modern glass high-rise facade at golden hour, sharp focus, dynamic angles, dramatic sky, dark overlay (40%) for text contrast.

**Project Thumbnails:**  
120×120px building/maintenance photos, rounded-xl, shadow-md, fallback: Charcoal bg with white building icon 48px.

**Section Accents:**  
Minimal use - prefer strong typography and layout over decorative imagery.

## Animations

Page transitions 150ms, card hover 200ms, button interactions 100ms, success states 400ms scale. Disable for prefers-reduced-motion.

## Accessibility

WCAG AA contrast ratios, 3px focus rings (Electric Blue), semantic HTML, 44×44px touch targets, haptic feedback on mobile, safe-area handling.