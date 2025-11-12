# Design Guidelines: Premium Enterprise Rope Access SaaS Platform

## Design Approach

**Reference Systems:** Linear (clean hierarchy, refined spacing), Notion (sophisticated neutrals, data density), Monday.com (vibrant accents, dashboard polish)  
**Core Aesthetic:** Premium SaaS with Material Design 3 influence, glass-morphism cards, subtle gradients, ocean-inspired palette, professional data visualization, illustrated building graphics

## Color Palette

**Primary System:**
- Ocean Blue: #0EA5E9 (primary actions, links, active states)
- Deep Ocean: #0369A1 (hover states, depth)
- Midnight: #0F172A (headers, primary text)
- Slate: #64748B (secondary text, captions)

**Accent Palette:**
- Emerald: #10B981 (success, completed tasks)
- Amber: #F59E0B (warnings, in-progress)
- Rose: #F43F5E (urgent, critical alerts)
- Violet: #8B5CF6 (analytics, secondary highlights)

**Surfaces & Glass:**
- Pure White: #FFFFFF (primary cards)
- Cloud: #F8FAFC (page backgrounds)
- Mist: #E2E8F0 (subtle borders, dividers)
- Glass White: rgba(255, 255, 255, 0.7) with 20px blur
- Glass Dark: rgba(15, 23, 42, 0.6) with 20px blur

**Gradients:**
- Primary: linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)
- Accent: linear-gradient(135deg, #8B5CF6 0%, #0EA5E9 100%)
- Subtle: linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)

## Typography (Inter via Google Fonts)

Display: 3rem/800/1.1/-0.025em  
H1: 2rem/700/1.25/-0.02em  
H2: 1.5rem/600/1.3/-0.01em  
H3: 1.125rem/600/1.4  
Body Large: 1.0625rem/400/1.6  
Body: 0.9375rem/400/1.5  
Caption: 0.8125rem/500/1.4  
Label: 0.75rem/600/1.3/0.025em (uppercase)

## Layout & Spacing

**Tailwind Units:** 2, 4, 8, 12, 16  
**Containers:** Mobile px-4, Desktop max-w-7xl mx-auto px-8  
**Grid Patterns:** 12-col responsive, gap-8 cards, gap-4 tight groups  
**Section Padding:** py-12 mobile, py-20 desktop, py-24 hero areas

## Elevation & Glass-Morphism

**Shadow Hierarchy:**
```
xs: 0 1px 2px rgba(15, 23, 42, 0.04)
sm: 0 2px 8px rgba(15, 23, 42, 0.06)
md: 0 4px 16px rgba(15, 23, 42, 0.08)
lg: 0 8px 24px rgba(15, 23, 42, 0.1)
xl: 0 16px 48px rgba(15, 23, 42, 0.12)
```

**Card Treatment:**  
White background, rounded-2xl (16px), shadow-md, 1px Mist border, p-6 standard. Hover: shadow-lg with 200ms transition. Glass variants: backdrop-blur-xl with rgba backgrounds.

**Premium Cards:**  
White bg, rounded-3xl (24px), shadow-xl, gradient border (1px), p-8, subtle gradient overlay, inner shadow for depth.

## Navigation

**Desktop Header (h-16):**  
Glass-white background with backdrop-blur-xl, shadow-sm, sticky top-0, logo 36px, Ocean Blue active nav items with 2px bottom accent, 32px avatar with gradient ring.

**Mobile Bottom Nav (h-16):**  
Glass-dark background with backdrop-blur-xl, shadow-xl, Ocean Blue active (icon + label), safe-area-inset-bottom, 8px indicator dot.

**Sidebar (w-64):**  
Cloud background, active: white card with shadow-md + Ocean Blue 3px left accent + gradient icon, section dividers (Mist 1px), collapse to w-20 icons-only.

## Hero Section

**Layout:**  
Full-width hero (min-h-screen on desktop, 70vh mobile), gradient background (Primary gradient), geometric pattern overlay (subtle), illustrated high-rise buildings (isometric style, Ocean Blue accents), Display white text, dual CTAs with glass-white background blur (backdrop-blur-xl), py-24 spacing.

**Stats Panel:**  
White card, shadow-xl, rounded-3xl, -mt-20 overlap, p-12, 4-col grid (2×2 mobile), Display metrics with gradient text, Label captions, Violet accent icons 48px, vertical Mist dividers.

## Core Components

**Project Cards:**  
White bg, rounded-2xl, shadow-md, p-6, illustrated building graphic (120×120px, Ocean Blue/Emerald palette, clean vector style), H3 title, gradient status badge (rounded-full, px-4 py-1.5, white text), metadata row (Slate, 18px icons), progress ring chart (Ocean Blue fill, 60px), hover: shadow-lg + scale(1.02).

**Building Visualization:**  
Illustrated SVG isometric buildings, clean lines, Ocean Blue primary, Emerald completed floors, Amber in-progress, Mist pending, floor labels, gradient sky background, shadow-lg for depth, interactive floor highlighting.

**Dashboard Widgets:**  
White cards, rounded-2xl, shadow-md, p-6, H2 headers with icon (24px Ocean Blue), integrated charts (Chart.js/Recharts with Ocean Blue/Violet/Emerald), gradient accent bars, minimal gridlines (Mist), Legend with rounded chips.

**Data Tables:**  
White bg, rounded-xl, shadow-sm, sticky header (Cloud bg, shadow-xs), alternating row backgrounds (subtle Cloud on even), Ocean Blue link text, sortable headers with icons, pagination controls (Ocean Blue active).

## Forms

**Input Fields:**  
h-12, rounded-lg, white bg, Mist border (1.5px), Ocean Blue focus ring (2px), floating label (Caption size, Slate color, 200ms animation), icon prefix (20px Slate), error: Rose border + text.

**Multi-Step Forms:**  
Horizontal progress stepper, 40px numbered circles (Ocean Blue active/complete, Mist pending), 2px connector lines, white section cards with shadow-md, gradient progress bar (h-1.5), sticky action bar (glass-white blur, shadow-xl).

**File Upload:**  
h-40, rounded-xl, Mist dashed border (2px), white bg, Ocean Blue hover border, 48px upload icon with gradient, thumbnail grid (rounded-lg, shadow-xs, 80×80px), Rose remove icon overlay.

## Buttons

**Primary:** h-11 px-6 rounded-lg Ocean Blue bg white text shadow-md  
**Secondary:** h-11 px-6 rounded-lg white bg Ocean Blue text Mist border (1.5px) shadow-sm  
**Glass (on images):** h-11 px-6 rounded-lg glass-white backdrop-blur-xl white text shadow-lg  
**Icon:** 44×44px white bg shadow-sm rounded-lg 20px icon  
**FAB:** 56×56px Ocean Blue shadow-xl white icon rounded-full gradient background

## Status System

Rounded-full, px-3 py-1, white text, shadow-xs, 16px icon: Emerald (completed), Amber (progress), Rose (urgent), Ocean Blue (active), Violet (review).

## Data Visualization

**Chart Palette:** Ocean Blue primary, Violet secondary, Emerald positive, Rose negative, gradient fills (20% opacity)  
**Progress Rings:** 8px stroke, Ocean Blue active, Mist track, percentage Label in center  
**Bar Charts:** rounded-t-lg bars, gradient fills, Mist grid, Slate axis labels  
**Line Charts:** smooth curves, 3px stroke, gradient area fills, interactive tooltips (white card, shadow-lg)

## Images

**Hero Background:**  
Custom illustrated cityscape with modern high-rise buildings in isometric view, Ocean Blue and gradient accents, clean geometric style, subtle texture, 1920×1080px minimum, overlaid geometric patterns for depth.

**Dashboard Graphics:**  
Illustrated building elevations (vector style, Ocean Blue palette), professional photography of rope access work (overlaid with gradients for text contrast), abstract geometric patterns for section backgrounds.

**Empty States:**  
Illustrated graphics (simple line art, Ocean Blue accents, 200×200px), encouraging messages with gradient text.

## Animations

Page transitions 200ms ease-out, card hover 250ms, button press 150ms, chart render 600ms ease-in-out, loading shimmer gradients. Respect prefers-reduced-motion.

## Premium Details

**Glass Cards:** Backdrop-blur-xl with rgba backgrounds for floating panels over gradients  
**Gradient Borders:** 1px border with gradient overlay on premium cards  
**Micro-interactions:** Subtle scale (1.02) on hover, shadow expansion, gradient shift on active  
**Loading States:** Skeleton screens with gradient shimmer animation  
**Toasts:** Glass-white, rounded-xl, shadow-xl, 48px status icon, auto-dismiss  
**Modals:** Glass-dark backdrop, white content card, rounded-2xl, shadow-2xl, max-w-2xl

## Accessibility

WCAG AA minimum, 2px Ocean Blue focus rings, semantic HTML, 44px touch targets, keyboard navigation, screen reader labels, haptic feedback mobile.