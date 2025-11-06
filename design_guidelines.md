# Design Guidelines: Rope Access Management Platform (Premium Edition)

## System & Principles

**Design System:** Material Design 3 with Premium Glass-Morphism Enhancements  
**Core Principles:** Mobile-first (44px touch targets), sophisticated visual depth through layered glass effects and gradients, premium SaaS aesthetic, professional trustworthiness, data clarity with refined color coding.

## Color Palette

**Primary Blues:**
- Deep Navy: #0F172A (headers, primary text)
- Ocean Blue: #1E40AF (primary actions, active states)
- Sky Blue: #3B82F6 (secondary actions, links)
- Ice Blue: #DBEAFE (light backgrounds, hover states)

**Accents:**
- Amber: #F59E0B (warnings, progress highlights)
- Emerald: #10B981 (success, completed states)
- Rose: #F43F5E (urgent, errors)
- Violet: #8B5CF6 (premium features, pro badges)

**Neutrals:**
- Slate-50: #F8FAFC (backgrounds)
- Slate-100: #F1F5F9 (card backgrounds)
- Slate-200: #E2E8F0 (borders)
- Slate-600: #475569 (secondary text)
- Slate-900: #0F172A (primary text)

**Gradients:**
- Hero: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)
- Card Accent: linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.05) 100%)
- Stats Highlight: linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)

## Typography (Roboto via Google Fonts)

```
Display: 3rem/700/1.1/-0.02em
H1: 2rem/700/1.2
H2: 1.5rem/600/1.3
H3: 1.25rem/600/1.4
Body Large: 1rem/400/1.6
Body: 0.875rem/400/1.5
Caption: 0.75rem/400/1.4/+0.4px
Button: 0.875rem/500/uppercase/+0.5px
```

## Layout & Spacing

**Tailwind Units:** 2, 4, 6, 8  
**Containers:** Mobile px-4 full-width, Desktop max-w-7xl centered, 240px fixed sidebar  
**Grid Systems:** 2-col cards (md:), 4-col stats (lg:), gap-6 standard

## Visual Treatments

**Glass-Morphism Cards:**
```
Background: rgba(255, 255, 255, 0.8)
Backdrop Filter: blur(12px) saturate(180%)
Border: 1px solid rgba(255, 255, 255, 0.3)
Shadow: 0 8px 32px rgba(30, 64, 175, 0.08)
Radius: 16px (rounded-2xl)
```

**Elevation System:**
- Level 1 (Cards): shadow-lg + glass effect
- Level 2 (Modals): shadow-2xl + darker glass (0.85 opacity)
- Level 3 (Dropdowns): shadow-xl + border glow

**Depth Techniques:**
- Layered shadows (multi-layer rgba with different spreads)
- Gradient overlays on sections
- Subtle inner shadows on inputs
- Border gradients on premium elements

## Navigation

**Top App Bar** (h-16):  
Glass-morphism treatment with gradient underline (h-0.5), backdrop-blur-md, logo 48px with subtle glow, breadcrumbs with chevron separators, avatar with status indicator ring.

**Bottom Nav** (Mobile, h-16):  
Glass background, gradient active indicator (h-1), 24px icons with 8px dot badges, smooth 200ms transitions, safe-area padding.

**Desktop Sidebar** (w-60):  
Deep navy gradient background, glass-effect active states, 4px gradient left accent, grouped sections with gradient dividers, collapse animation 300ms.

## Core Components

### Hero Section
Full-width gradient background (1920×600px image + 70% overlay), glass-morphism CTAs with backdrop-blur-sm, Display white text with subtle text-shadow, h-12 buttons with glass treatment, 96px icon with gradient fill.

### Hero Stats Panel
Glass card (p-8, rounded-2xl), gradient border (1px), Display metric with gradient text fill, 2×2 grid stats (H1 + caption + gradient icons 32px), animated progress bar with gradient fill, floating effect on hover.

### Project Cards
Glass-morphism elevated cards (p-6, rounded-2xl), 80×80px thumbnail with gradient border, H3 title (Navy), gradient status badge, metadata row with icon-text pairs, H2 percentage with gradient text, gradient progress bar (h-3), glass CTA button with blur, hover lift + glow effect.

### High-Rise Visualization
SVG building (floor_count × 45px, max 600px), gradient fill, window states with color-coded fills, floor labels with glass backgrounds, rooftop detail with gradient, subtle drop shadow, animated completion states.

### Complaint Cards
Glass cards (p-4, rounded-xl), urgency badge with gradient, H3 name (Navy), icon-text metadata, 2-line preview, gradient status bar on left edge, swipe actions with glass backgrounds.

## Forms

**Text Inputs:**  
Glass backgrounds, h-12, rounded-xl, gradient focus ring (2px), floating labels with smooth 200ms animation, icon prefixes with gradient fills, error states with rose gradient glow.

**Multi-Step Forms:**  
Gradient progress stepper (connecting lines), glass step circles (40px), active step with gradient fill, p-6 sections with glass dividers, sticky bottom nav with glass background.

**File Upload:**  
Glass dashed border (2px), h-40, gradient hover state, 48px gradient icon, thumbnail previews with glass frames, remove button with blur effect.

**Date Pickers:**  
Glass modal (mobile) / floating dropdown (desktop), gradient quick chips, calendar grid with glass cells, gradient selected state.

## Data Display

**Employee Directory:**  
Glass list items (h-20), 40px avatars with gradient rings, role badges with gradient backgrounds, hover states with subtle glow, sticky glass search bar with blur.

**Manager Stats:**  
Glass cards (p-6) with gradient accent borders, Display numbers with gradient fills, trend indicators with colored icons, integrated gradient charts, chip tabs with glass active states.

**Complaint Detail:**  
Glass hero card with gradient header, timeline with gradient connector lines, accordion sections with glass backgrounds, 56px FAB with gradient fill + shadow-2xl, sticky glass action bar.

## Interactive Elements

**Buttons:**
```
Primary: h-12 px-8 rounded-xl gradient fill shadow-lg
Secondary: h-12 px-8 rounded-xl glass outlined gradient border
Text: h-12 px-4 gradient text on hover
Icon: 44×44px glass background 24px icon
FAB: 56px gradient fill shadow-2xl glow effect
```

**Status Badges:**  
Glass backgrounds, gradient borders, px-3 py-1.5 rounded-full, 16px gradient icon prefix, specific color coding per state.

**Search:**  
h-12 rounded-full glass background, 20px gradient icon, X clear with hover glow, gradient focus ring.

**Filters:**  
Glass sheet/sidebar, gradient section headers, multi-select chips with glass + gradient active states, gradient Apply button.

## Images

**Hero Image (Dashboard):**  
1920×600px professional rope access technicians on modern high-rise, gradient overlay (70% #1E40AF to transparent), glass-morphism CTAs with backdrop-blur-sm positioned over image, subtle vignette effect.

**Project Thumbnails:**  
80×80px building/work photos, gradient border frames, rounded-xl, fallback gradient backgrounds with building silhouette icons.

**Background Textures:**  
Subtle dot patterns (2px opacity 5%) on glass cards for depth, gradient mesh overlays on major sections.

## Animations

Page transitions 200ms, glass hover effects 150ms, gradient shifts 300ms, success checkmark 500ms scale-bounce, progress fills with gradient animation 400ms. Avoid scroll-triggered or parallax effects.

## Accessibility

WCAG AA contrast on all glass backgrounds, 2px gradient focus rings, semantic HTML, 44×44px touch targets, haptic feedback on critical actions, reduced motion support, safe-area insets for notched devices.