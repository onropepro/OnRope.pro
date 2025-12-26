# Design Guidelines: Premium Enterprise Rope Access SaaS Platform

## Resources

- **Brand Palette Visual:** `attached_assets/OnRopePro-Brand-Palette.pdf` — High-resolution color swatches and hex values for all primary, accent, and surface colors
- **Official Stakeholder Colors:** `attached_assets/OnRope.Pro_-_Official_colours_of_all_stakeholders_1766080018346.pdf` — Complete 10-color palette including all stakeholder-specific brand colors
- **Color Variations Reference:** `attached_assets/OnRope.Pro_Official_Colour_Variations_1766080072011.pdf` — Extended variations for UI states and gradients

### Color Variation Charts
These charts provide extended color variations for different use cases and accessibility considerations:

- **Shade Variations:** `attached_assets/onropepro_-_colour_palette_-_variations_-_shade_1766263055638.png` — Lightness/darkness variations from +90% to -90% for all brand colors
- **Saturation Variations:** `attached_assets/onropepro_-_colour_palette_-_variations_-_saturation_1766263055638.png` — Saturation adjustments from +90% to -90% for muted/vibrant options
- **Hue Variations:** `attached_assets/onropepro_-_colour_palette_-_variations_-_hue_1766263055638.png` — Hue shifts from +36° to -36° for harmonious color alternatives
- **Color Blindness Reference:** `attached_assets/onropepro_-_colour_palette_-_variations_-_blindness_1766263055638.png` — How brand colors appear under Protanopia, Deuteranopia, Tritanopia, and Achromatopsia
- **Gradient Reference:** `attached_assets/onropepro_-_colour_palette_-_variations_-_gradient_1766263055638.png` — Smooth gradient blends between all brand colors
- **Theme Variations:** `attached_assets/onropepro_-_colour_palette_-_variations_-_theme_1766263055638.png` — Light and dark theme color adaptations

## Design Approach

**Reference Systems:** Linear (clean hierarchy, refined spacing), Notion (sophisticated neutrals, data density), Monday.com (vibrant accents, dashboard polish)  
**Core Aesthetic:** Premium SaaS with Material Design 3 influence, glass-morphism cards, subtle gradients, ocean-inspired palette, professional data visualization, illustrated building graphics

## Color Palette

**Primary System (Core Brand - 7 Colors):**
- Navy Dark: #0F1629 (dark backgrounds, depth)
- Navy Blue: #193A63 (secondary backgrounds, subtle contrast)
- Ocean Blue: #0B64A3 (primary actions, links, active states)
- Deep Ocean: #0369A1 (hover states, depth accents)
- Neutral Gray: #989C94 (secondary text, borders, disabled states)
- Light Gray: #F3F3F3 (page backgrounds, light surfaces)
- Rust Brown: #AB4521 (call-to-action buttons, emphasis)

**Stakeholder Colors (Audience-Specific Branding - 5 Colors):**
- Employers/Company Owners: #0B64A3 (ocean blue - for main site, employer dashboard, cards)
- Property Manager: #6E9075 (sage green - for PM landing pages, cards, accents)
- Resident: #86A59C (mint green - for resident portal, feedback, cards)
- Building Manager: #B89685 (warm taupe - for BM landing pages, cards)
- Technician: #AB4521 (rust brown - same as CTA, for technician portal/cards)

**Usage by Audience:**
| Audience | Primary Color | Hero Gradient | Card Accents |
|----------|---------------|---------------|--------------|
| Employers (Main Site) | #0B64A3 | `#0B64A3 → #0369A1` | Ocean Blue |
| Property Managers | #6E9075 | `#6E9075 → #5A7A60` | Sage Green |
| Residents | #86A59C | `#86A59C → #6B8A80` | Mint Green |
| Building Managers | #B89685 | `#B89685 → #9A7B6C` | Warm Taupe |
| Technicians | #AB4521 | `#AB4521 → #8B371A` | Rust Brown |

**Accent Palette (Status & Feedback):**
- Emerald: #10B981 (success, completed tasks)
- Amber: #F59E0B (warnings, in-progress)
- Rose: #F43F5E (urgent, critical alerts)
- Violet: #8B5CF6 (analytics, secondary highlights)

**Surfaces & Glass:**
- Pure White: #FFFFFF (primary cards)
- Cloud: #F8FAFC (page backgrounds)
- Mist: #E2E8F0 (subtle borders, dividers)
- Glass White: rgba(255, 255, 255, 0.7) with 20px blur
- Glass Dark: rgba(15, 22, 41, 0.6) with 20px blur

**Gradients:**
- Primary (Hero): linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)
- Accent: linear-gradient(135deg, #0369A1 0%, #0B64A3 100%)
- Subtle: linear-gradient(180deg, #F3F3F3 0%, #FFFFFF 100%)

### Color Variation Usage Guide

Reference the color variation charts in the Resources section for extended color options. Below is guidance on when and how to use each variation type:

**Shade Variations (+90% to -90%):**
Use shade variations for:
- Hover states: Use -10% to -20% darker shade for interactive element hover
- Pressed/active states: Use -20% to -30% darker shade
- Disabled states: Use +40% to +60% lighter shade
- Background layering: Use +70% to +90% for subtle background tints
- Text on colored backgrounds: Use -50% to -70% for darker text variants

**Saturation Variations (+90% to -90%):**
Use saturation adjustments for:
- Muted/subtle accents: -20% to -40% saturation for less prominent elements
- Disabled states: -50% to -70% saturation combined with lighter shade
- Emphasis: +10% to +20% for drawing attention (use sparingly)
- Dark mode adaptations: Often reduce saturation by 10-20% in dark themes

**Hue Variations (+36° to -36°):**
Use hue shifts for:
- Harmonious color pairings: Adjacent hues (±4° to ±12°) create subtle variety
- Gradient endpoints: Use ±8° to ±16° hue shift for smooth color transitions
- Seasonal/themed variations: Larger shifts for campaign-specific adaptations

**Theme Variations (Light/Dark):**
The theme chart shows optimized color values for:
- **Light Theme Row:** Original brand colors optimized for light backgrounds
- **Dark Theme Row:** Adjusted colors that maintain vibrancy on dark backgrounds
- Key dark theme hex values from the chart:
  - Navy Dark → #D8DDF0 (inverted for dark bg text)
  - Ocean Blue → #5D85F4 (brighter for dark bg visibility)
  - Rust Brown → #DE7954 (warmer for dark bg contrast)
  - Sage Green → #6F907B (maintained with slight adjustment)

**Accessibility & Color Blindness:**
The blindness variation chart shows how brand colors appear under different color vision conditions:

| Condition | Description | Design Considerations |
|-----------|-------------|----------------------|
| Protanopia | Red-blind (~1% males) | Blues appear preserved; rust/orange may look yellow-brown |
| Deuteranopia | Green-blind (~1% males) | Similar to protanopia; greens shift toward browns |
| Tritanopia | Blue-blind (rare, ~0.01%) | Blues shift toward greens; reds appear more vibrant |
| Achromatopsia | Complete color blindness | All colors appear as grayscale; rely on contrast and patterns |

**Accessibility Guidelines:**
- Never rely solely on color to convey information (use icons, labels, patterns)
- Ensure minimum 4.5:1 contrast ratio for text (7:1 for AAA compliance)
- For status indicators, combine color with shape (checkmarks, X icons, warning triangles)
- Test UI mockups through colorblind simulation tools
- When using Ocean Blue (#0B64A3) with Sage Green (#6E9075), add distinguishing icons since these may be confused under deuteranopia

## Typography (Outfit via Tailwind Config)

**Primary Font:** Outfit (configured in `tailwind.config.ts` as `sans: ["Outfit", "system-ui", "sans-serif"]`)

**Aligned with Tailwind CSS default scale for consistency:**

Display: 3rem/800/1.1/-0.025em → `text-5xl font-extrabold`  
H1: 2.25rem/700/1.25/-0.02em → `text-4xl font-bold`  
H2: 1.5rem/600/1.3/-0.01em → `text-2xl font-semibold`  
H3: 1.25rem/600/1.4 → `text-xl font-semibold`  
Body Large: 1.125rem/400/1.6 → `text-lg`  
Body: 1rem/400/1.5 → `text-base`  
Caption: 0.875rem/500/1.4 → `text-sm font-medium`  
Label: 0.75rem/600/1.3/0.025em (uppercase) → `text-xs font-semibold uppercase tracking-wide`

**Quick Reference:**
| Style | Tailwind Class | Size |
|-------|---------------|------|
| Display | `text-5xl` | 3rem (48px) |
| H1 | `text-4xl` | 2.25rem (36px) |
| H2 | `text-2xl` | 1.5rem (24px) |
| H3 | `text-xl` | 1.25rem (20px) |
| Body Large | `text-lg` | 1.125rem (18px) |
| Body | `text-base` | 1rem (16px) |
| Caption | `text-sm` | 0.875rem (14px) |
| Label | `text-xs` | 0.75rem (12px) |

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

### Top Utility Bar (h-10)

The top utility bar appears above the main navigation on public-facing pages. Its background color MUST match the hero gradient color of the current page to create visual continuity.

**Color Mapping by Page:**
| Page/Route | Utility Bar Color | Hex |
|------------|-------------------|-----|
| Homepage `/` | Ocean Blue | #0B64A3 |
| Employer `/employer` | Ocean Blue | #0B64A3 |
| Modules `/modules/*` | Ocean Blue | #0B64A3 |
| Technician Job Board `/modules/technician-job-board` | Rust Brown | #AB4521 |
| Technician `/technician` | Rust Brown | #AB4521 |
| Property Manager `/property-manager` | Sage Green | #6E9075 |
| Resident `/resident` | Mint Green | #86A59C |
| Building Manager `/building-portal` | Warm Taupe | #B89685 |
| Safety Manifesto `/safety` | Navy Blue | #193A63 |
| Help pages | Matches stakeholder audience | varies |

**Implementation (PublicHeader.tsx):**
- Use `getStakeholderColor()` function to determine the correct color based on current route
- Apply color via inline style: `style={{ backgroundColor: stakeholderColor }}`
- Pass stakeholder color and `useDarkText=false` flag to child components (InstallPWAButton, LanguageDropdown)

**Foreground Text Color:**
Text in the top utility bar should ALWAYS be white (#FFFFFF) regardless of the stakeholder background color:

| Element | Text Color | Class |
|---------|------------|-------|
| All text | White | `text-white` |
| Hover state | White with 10% bg | `hover:bg-white/10` |
| Borders | White at 10% opacity | `border-white/10` |

**Key Principle:** The top utility bar color creates a seamless visual connection with the hero section below, reinforcing stakeholder-specific branding throughout the page. All text in the utility bar is white (#FFFFFF) for consistent branding.

---

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

## Module Landing Page Hero Template

**CANONICAL REFERENCE:** `/modules/user-access-authentication` (UserAccessLanding.tsx)

All module landing pages MUST follow this exact hero structure. Copy from UserAccessLanding.tsx for consistency.

---

### Hero Section Structure

**Section Container (Hero Background):**
```tsx
<section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-30"></div>
```
- `pb-[120px]` - Bottom padding to accommodate wave separator
- Inline style gradient: `linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)`
- Overlay pattern with 30% opacity for visual texture

**Content Container:**
```tsx
<div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
  <div className="text-center space-y-6 pt-16">
```
- `max-w-6xl` - Maximum width constraint
- `py-4 md:py-12` - Compact vertical padding (mobile/desktop)
- `pt-16` - **CRITICAL: 64px top padding above module label badge**
- `space-y-6` - Consistent vertical spacing between hero elements

---

### Module Label Badge

```tsx
<Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1">
  [Module Name] Module
</Badge>
```
- Semi-transparent white background with white text
- Standard format: "[Module Name] Module"

---

### Headline Typography

```tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
  Main headline text<br />
  second line<br />
  <span className="text-blue-100">emphasis phrase.</span>
</h1>
```
- Size: `text-4xl md:text-5xl lg:text-6xl`
- Weight: `font-bold`
- Tracking: `tracking-tight`
- **Emphasis color: `text-blue-100`** - NOT sky-200

---

### Subtitle/Description

```tsx
<p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
  Supporting description text.<br />
  <strong>Bold key phrase for emphasis.</strong>
</p>
```
- Size: `text-xl md:text-2xl`
- Color: `text-blue-100` (softer than white)
- Width: `max-w-3xl mx-auto`
- Line height: `leading-relaxed`
- Use `<strong>` for key takeaway phrases

---

### CTA Button Container

```tsx
<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
```
- `pt-4` - 16px spacing above buttons
- `gap-4` - Consistent spacing between buttons
- Stack vertically on mobile, horizontal on desktop

**Primary CTA Button:**
```tsx
<Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" asChild>
  <Link href="/register">
    Start Your Free 60-Day Trial
    <ArrowRight className="ml-2 w-5 h-5" />
  </Link>
</Button>
```
- White background with Ocean Blue text
- **Standard text: "Start Your Free 60-Day Trial"**
- ArrowRight icon (5×5)

**Secondary CTA Button:**
```tsx
<Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
  <Link href="#knowledgebase">
    Find Answers
    <BookOpen className="ml-2 w-5 h-5" />
  </Link>
</Button>
```
- Outline variant with semi-transparent border
- White text with subtle hover

---

### Wave Separator

```tsx
<div className="absolute bottom-0 left-0 right-0 z-10">
  <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
    <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-white dark:fill-slate-950"/>
  </svg>
</div>
```
- Positioned at bottom of hero section
- z-10 for proper layering
- Fill matches content section background

---

### Stats Panel (Floating Card)

**Stats Section Container:**
```tsx
<section className="relative bg-white dark:bg-slate-950 -mt-px overflow-visible">
  <div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
```
- `-mt-px` - Seamless connection to hero section
- `overflow-visible` - **CRITICAL: Prevents card clipping**
- `max-w-3xl` - Narrower than hero for visual focus

**Floating Stats Card:**
```tsx
<Card className="shadow-xl border-0 relative z-20 -mt-20">
  <CardContent className="p-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
```
- `-mt-20` - **CRITICAL: Pulls card 80px into hero, creating float effect**
- `z-20` - Ensures card renders above wave separator
- `shadow-xl border-0` - Strong shadow, no border
- `p-8` - Generous internal padding
- Grid: 2 columns mobile, 4 columns desktop
- `gap-6 md:gap-8` - Spacing between stat columns

**Individual Stat Items:**
```tsx
<div className="text-center">
  <div className="text-3xl md:text-4xl font-bold text-blue-600">{value}</div>
  <div className="text-sm text-muted-foreground mt-1">Label text</div>
</div>
```
- Value: `text-3xl md:text-4xl font-bold` + accent color
- Label: `text-sm text-muted-foreground mt-1`
- **CRITICAL: Use standard stats colors (see below) - NOT stakeholder colors**

---

### Standard Stats Panel Colors (Universal across all stakeholder pages)

These colors MUST be used on all stats panels, regardless of stakeholder type or page hero color:

| Position | Color | Tailwind Class | Hex Value | Usage |
|----------|-------|---|----------|-------|
| 1st Stat | Ocean Blue | `text-blue-700` | #1D4ED8 | Primary metric, percentage, primary benefit |
| 2nd Stat | Emerald | `text-emerald-600` | #10B981 | Success, financial value, positive outcome |
| 3rd Stat | Orange | `text-orange-600` | #EA580C | Quantity, hours saved, volume metric |
| 4th Stat | Violet | `text-violet-600` | #7C3AED | Secondary benefit, advanced feature, count |

**Implementation Example (Resident Portal):**
```tsx
<div className="grid grid-cols-2 gap-6 md:gap-8">
  {/* Blue - Primary */}
  <div className="text-center">
    <div className="text-2xl md:text-3xl font-bold text-blue-700">1 Submission</div>
    <div className="text-sm text-muted-foreground mt-1">(Not 3 Calls)</div>
  </div>
  {/* Emerald - Success */}
  <div className="text-center">
    <div className="text-2xl md:text-3xl font-bold text-emerald-600">Proof They Saw It</div>
    <div className="text-sm text-muted-foreground mt-1">Viewed Timestamp</div>
  </div>
  {/* Orange - Quantity */}
  <div className="text-center">
    <div className="text-2xl md:text-3xl font-bold text-orange-600">0 Lost</div>
    <div className="text-sm text-muted-foreground mt-1">Complaints</div>
  </div>
  {/* Violet - Secondary */}
  <div className="text-center">
    <div className="text-2xl md:text-3xl font-bold text-violet-600">24hr Resolution</div>
    <div className="text-sm text-muted-foreground mt-1">(Not 5 Days)</div>
  </div>
</div>
```

**Key Principle:** Stats colors are brand-wide and consistent. Hero gradients and page-specific branding can vary by stakeholder, but stats always use this same color sequence.

---

### Module Landing Page Checklist

When creating a new module landing page, verify:

- [ ] Hero section uses `pb-[120px]` bottom padding
- [ ] Content container uses `py-4 md:py-12` and `pt-16` for badge spacing
- [ ] Badge uses `bg-white/20 text-white border-white/30` styling
- [ ] Headline uses `text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight`
- [ ] Emphasis text uses `text-blue-100` (NOT sky-200)
- [ ] Subtitle uses `text-xl md:text-2xl text-blue-100`
- [ ] Primary CTA says "Start Your Free 60-Day Trial" with ArrowRight icon
- [ ] Button container has `pt-4` spacing above buttons
- [ ] Wave separator has `z-10` and positioned at `bottom-0`
- [ ] Stats section has `overflow-visible` on container
- [ ] Stats card has `-mt-20 shadow-xl border-0 relative z-20`
- [ ] Stats card uses `max-w-3xl` container width

---

### Content Width Standards (Below Hero Section)

Module pages follow a width hierarchy to create visual focus and readability:

**Hero Section Container:**
```tsx
<div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
```
- `max-w-6xl` (1152px) - Full width for hero impact

**Stats Panel Container:**
```tsx
<div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
```
- `max-w-3xl` (768px) - Narrow for visual focus on metrics

**Main Content Sections (text, features, benefits):**
```tsx
<section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
```
- `max-w-4xl` (896px) - Narrower width for better readability
- Used for: The Reality/Pain section, What Changes section, Key Features, Module Integration Points

**Image/Media Sections:**
```tsx
<section className="py-12 md:py-20 px-4 md:px-8">
  <div className="max-w-5xl mx-auto">
```
- `max-w-5xl` (1024px) - Slightly wider for visual impact
- Used for: Software showcase images, feature demonstrations

**Why this hierarchy?**
- Widest (6xl): Hero grabs attention with full-screen impact
- Narrower (3xl): Stats are focused and distinct
- Narrow (4xl): Body text is easier to read (60-70 characters per line)
- Medium-wide (5xl): Images have breathing room without overwhelming text
- Maintains visual consistency across all module pages

---

### "Who Benefits From This Module" Section Template

**CANONICAL REFERENCE:** `/modules/user-access-authentication` (UserAccessLanding.tsx) - "Benefits by Stakeholder" section

All module landing pages MUST follow this exact structure for their stakeholder benefits section. This creates visual consistency across all module pages.

---

**Section Container:**
```tsx
<section className="py-16 md:py-20 px-4">
  <div className="max-w-5xl mx-auto">
```
- `max-w-5xl` (1024px) - Wider than body text for card layouts
- `py-16 md:py-20` - Generous vertical padding

**Section Header:**
```tsx
<h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
  Who Benefits From This Module
</h2>
<p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
  [Subtitle describing the benefit promise]
</p>
```

**Stakeholder Cards Container:**
```tsx
<div className="space-y-8">
```
- `space-y-8` - Consistent spacing between stakeholder cards

---

**Individual Stakeholder Card Structure:**
```tsx
<Card className="overflow-hidden">
  <CardHeader className="bg-[color]-50 dark:bg-[color]-950 border-b">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-[color]-100 dark:bg-[color]-900 flex items-center justify-center">
        <[Icon] className="w-5 h-5 text-[color]-600" />
      </div>
      <CardTitle className="text-xl">For [Stakeholder Name]</CardTitle>
    </div>
  </CardHeader>
  <CardContent className="p-6 space-y-4">
    <div className="grid md:grid-cols-[2|3|4] gap-6">
      {/* Benefit items */}
    </div>
  </CardContent>
</Card>
```

**Key styling requirements:**
- Card: `overflow-hidden` (ensures colored header extends to edges)
- CardHeader: `bg-[color]-50 dark:bg-[color]-950 border-b` (colored background with bottom border)
- Icon container: `w-10 h-10 rounded-lg bg-[color]-100 dark:bg-[color]-900`
- Icon: `w-5 h-5 text-[color]-600`
- CardContent: `p-6 space-y-4`
- Grid: Use `md:grid-cols-2`, `md:grid-cols-3`, or `md:grid-cols-4` based on number of benefits

---

**Benefit Item Structure (inside grid):**
```tsx
<div className="space-y-2">
  <h4 className="text-lg font-semibold text-foreground">[Benefit headline]</h4>
  <p className="text-base text-muted-foreground">[Benefit description - 1-2 sentences]</p>
</div>
```
- NO nested Cards - use simple div elements
- Headline: `text-lg font-semibold text-foreground` (18px for visual hierarchy)
- Description: `text-base text-muted-foreground` (16px minimum for readability)
- Keep descriptions concise (1-2 sentences max)

**IMPORTANT - Minimum Font Size Rule:**
Body text on module pages must be at least `text-base` (16px). Never use `text-sm` or smaller for readable paragraph content. The Outfit font family requires larger sizes for comfortable reading.

---

**Stakeholder Color Assignments:**

Use official brand hex colors for stakeholder-specific UI elements. These colors apply to landing pages, card headers, icons, and accent elements.

| Stakeholder | Hex | Header BG | Icon BG | Icon | Icon Color |
|-------------|-----|-----------|---------|------|------------|
| Employers | #0B64A3 | `bg-blue-50` | `bg-blue-100` | Briefcase | `text-blue-600` |
| Property Managers | #6E9075 | `bg-[#6E9075]/10` | `bg-[#6E9075]/20` | Globe or Users | `text-[#6E9075]` |
| Residents | #86A59C | `bg-[#86A59C]/10` | `bg-[#86A59C]/20` | Home | `text-[#86A59C]` |
| Building Managers | #B89685 | `bg-[#B89685]/10` | `bg-[#B89685]/20` | Building2 | `text-[#B89685]` |
| Technicians | #AB4521 | `bg-[#AB4521]/10` | `bg-[#AB4521]/20` | Wrench or HardHat | `text-[#AB4521]` |

**Stakeholder Hero Gradients:**
```css
/* Property Manager Landing */
background: linear-gradient(135deg, #6E9075 0%, #5A7A60 100%);

/* Resident Landing */
background: linear-gradient(135deg, #86A59C 0%, #6B8A80 100%);

/* Building Manager Landing */
background: linear-gradient(135deg, #B89685 0%, #9A7B6C 100%);

/* Technician Landing */
background: linear-gradient(135deg, #AB4521 0%, #8B371A 100%);
```

**Grid Column Guidelines:**
- 4 benefits: Use `md:grid-cols-2 lg:grid-cols-4`
- 3 benefits: Use `md:grid-cols-3`
- 2 benefits: Use `md:grid-cols-2`

---

**Checklist for "Who Benefits" Section:**
- [ ] Section uses `max-w-5xl` container width
- [ ] Section header is centered with `text-center`
- [ ] Subtitle uses `text-muted-foreground text-lg mb-12 max-w-2xl mx-auto`
- [ ] Cards container uses `space-y-8`
- [ ] Each Card has `overflow-hidden` class
- [ ] CardHeader has colored background with `border-b`
- [ ] Icon + title are inside CardHeader (not separate)
- [ ] CardContent uses `p-6 space-y-4`
- [ ] Grid uses simple divs, NOT nested Card components
- [ ] Benefit headlines use `text-lg font-semibold` (18px)
- [ ] Benefit descriptions use `text-base` (16px minimum - never text-sm)
- [ ] Stakeholder colors follow the assigned palette above

---

### Color Reference

| Element | Class | Hex Value |
|---------|-------|-----------|
| Hero gradient start | - | #0B64A3 |
| Hero gradient end | - | #0369A1 |
| Headline emphasis | `text-blue-100` | #DBEAFE |
| Subtitle text | `text-blue-100` | #DBEAFE |
| Primary button bg | `bg-white` | #FFFFFF |
| Primary button text | `text-[#0B64A3]` | #0B64A3 |

## Core Components

**Project Cards:**  
White bg, rounded-2xl, shadow-md, p-6, illustrated building graphic (120×120px, Ocean Blue/Emerald palette, clean vector style), H3 title, gradient status badge (rounded-full, px-4 py-1.5, white text), metadata row (Slate, 18px icons), progress ring chart (Ocean Blue fill, 60px), hover: shadow-lg + scale(1.02).

**Building Visualization:**  
Illustrated SVG isometric buildings, clean lines, Ocean Blue primary, Emerald completed floors, Amber in-progress, Mist pending, floor labels, gradient sky background, shadow-lg for depth, interactive floor highlighting.

**Dashboard Widgets:**  
White cards, rounded-2xl, shadow-md, p-6, H2 headers with icon (24px Ocean Blue), integrated charts (Chart.js/Recharts with Ocean Blue/Violet/Emerald), gradient accent bars, minimal gridlines (Mist), Legend with rounded chips.

**Data Tables:**  
White bg, rounded-xl, shadow-sm, sticky header (Cloud bg, shadow-xs), alternating row backgrounds (subtle Cloud on even), Ocean Blue link text, sortable headers with icons, pagination controls (Ocean Blue active).

---

## Employer Dashboard Design System (Foundation for All Portals)

**CANONICAL REFERENCE:** `client/src/components/DashboardOverview.tsx`, `client/src/components/DashboardSidebar.tsx`

The Employer Dashboard establishes the foundational design patterns that ALL other portal sections (Technician, Resident, Property Manager, Building Manager) must follow. This is the "Operations Command Center" aesthetic - professional, data-dense, and enterprise-grade.

---

### Design Philosophy

**Core Principles:**
- **Data-Dense Professional Design:** Maximize information density without sacrificing readability
- **White-Label Compatible:** All brand colors use CSS variables when branding is active, Deep Blue (#0B64A3) as fallback
- **Mobile-First Responsive:** Full functionality on all screen sizes with optimized layouts
- **Dark Mode Native:** Every element has explicit light/dark mode variants

**Design Aesthetic:**
- Clean, minimal chrome with focus on content
- Subtle shadows and borders for depth hierarchy
- Professional slate color palette for neutral elements
- Brand color accents for interactive elements and status indicators

---

### Typography Standards (MANDATORY)

**Site-Wide Minimum Font Sizes:**
| Content Type | Tailwind Class | Pixel Size | Usage |
|--------------|----------------|------------|-------|
| Primary Content | `text-base` | 16px | Body text, labels, card headers, navigation items, project names |
| Secondary Content | `text-sm` | 14px | Metadata, timestamps, trend labels, client names, group headers, badges |

**CRITICAL:** Never use `text-xs` (12px) or smaller for any readable content. The Outfit font requires larger sizes for comfortable reading.

**Typography Hierarchy:**
```tsx
// Card Headers
<h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">

// Primary Labels/Text
<p className="text-base text-muted-foreground">
<span className="text-base font-medium text-slate-800 dark:text-slate-200">

// Secondary Metadata
<p className="text-sm text-slate-500 dark:text-slate-400">
<span className="text-sm text-muted-foreground">

// Large Metrics (KPI Values)
<span className="text-3xl font-bold text-foreground">

// Navigation Group Headers
<div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
```

---

### Sidebar Design

**CANONICAL REFERENCE:** `client/src/components/DashboardSidebar.tsx`

**Dimensions & Layout:**
- Fixed width: `w-60` (240px)
- Full height: `h-full`
- Background: `bg-white dark:bg-slate-900`
- Border: `border-r border-slate-200/80 dark:border-slate-700/80`
- Desktop: Fixed position, always visible
- Mobile: Slide-in drawer with overlay backdrop

**Brand Header:**
```tsx
// Logo Container
<div className="flex items-center gap-2.5">
  {/* Custom Logo (when white-label active) */}
  <img className="h-7 w-auto max-w-[160px] object-contain" />
  
  {/* Default Logo (Deep Blue fallback) */}
  <div 
    className="flex h-7 w-7 items-center justify-center rounded-md text-white font-semibold text-sm"
    style={{ backgroundColor: '#0B64A3' }}
  >
    OR
  </div>
  <span className="font-medium text-base text-slate-900 dark:text-slate-100">
    CompanyName
  </span>
</div>
```

**Navigation Items:**
```tsx
// Active State (uses brand color)
<button
  className="w-full flex items-center gap-2.5 py-2 px-3 rounded-md text-base font-medium text-white shadow-sm"
  style={{ backgroundColor: getBrandColor() }}
>
  <Icon className="h-4 w-4 shrink-0" />
  <span>Label</span>
</button>

// Inactive State
<button className="w-full flex items-center gap-2.5 py-2 px-3 rounded-md text-base font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors">
```

**Navigation Group Headers:**
```tsx
<div className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
  GROUP NAME
</div>
```

**Alert Badges:**
```tsx
<span className="flex items-center justify-center rounded-full text-sm font-medium h-5 min-w-5 px-1.5 bg-rose-500 text-white">
  {count}
</span>
```

**Mobile Responsiveness:**
- Toggle button: `fixed top-3 left-3 z-30 lg:hidden`
- Overlay: `fixed inset-0 bg-black/50 z-30 lg:hidden`
- Sidebar: `lg:translate-x-0` (visible on desktop), slide transition on mobile
- Content margin: `lg:ml-60` (only on desktop)

---

### Dashboard Card Design

**CANONICAL REFERENCE:** `client/src/components/DashboardOverview.tsx`

**Base Card Structure:**
```tsx
<div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
  {/* Card Header */}
  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between gap-2">
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      Card Title
    </h3>
    <Button variant="ghost" size="sm" className="text-sm text-slate-500 hover:text-slate-700 h-auto py-1 px-2">
      Action
    </Button>
  </div>
  {/* Card Content */}
  <div>
    {/* Content rows */}
  </div>
</div>
```

**Card Header Specifications:**
- Padding: `px-4 py-3`
- Border: `border-b border-slate-100 dark:border-slate-800`
- Background: `bg-slate-50/50 dark:bg-slate-800/50`
- Title: `text-base font-semibold text-slate-800 dark:text-slate-200`
- Actions: Ghost buttons with `h-auto py-1 px-2`

**List Row Design:**
```tsx
<div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-b-0">
  <div className="flex items-start gap-3">
    {/* Status Indicator */}
    <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 shadow-sm shrink-0 mt-1.5" />
    {/* Content */}
    <div className="flex-1 min-w-0">
      <p className="text-base font-medium text-slate-800 dark:text-slate-200 group-hover:text-[#0B64A3] truncate">
        Primary Text
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
        Secondary Text
      </p>
    </div>
  </div>
</div>
```

---

### KPI Metric Cards

**Structure:**
```tsx
<Card className={csrColors?.bg || ''}>
  <CardContent className="p-4">
    <p className="text-base mb-1 text-muted-foreground">{label}</p>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-bold text-foreground">{value}</span>
      <div className="flex items-center gap-1 text-base text-emerald-600">
        <TrendingUp className="w-4 h-4" />
        <span>{trend}%</span>
      </div>
    </div>
    <p className="text-sm mt-1 text-muted-foreground">{trendLabel}</p>
  </CardContent>
</Card>
```

**CSR Rating Color Tiers:**
```tsx
const getCsrColorScheme = (rating: number) => {
  if (rating >= 90) return { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-900 dark:text-green-200', label: 'Excellent' };
  if (rating >= 70) return { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-900 dark:text-yellow-200', label: 'Good' };
  if (rating >= 50) return { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-900 dark:text-orange-200', label: 'Warning' };
  return { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-900 dark:text-red-200', label: 'Critical' };
};
```

---

### Progress Bar Design

**Slim Progress Bars (6px height):**
```tsx
<div className="flex items-center gap-2">
  <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
    <div 
      className="h-full bg-[#0B64A3] rounded-full transition-all"
      style={{ width: `${progress}%` }}
    />
  </div>
  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 w-8 text-right">
    {progress}%
  </span>
</div>
```

**Key Specifications:**
- Track height: `h-1.5` (6px)
- Track background: `bg-slate-100 dark:bg-slate-700`
- Indicator: `bg-[#0B64A3]` (Deep Blue brand color)
- Border radius: `rounded-full`
- Percentage label: `text-sm font-medium w-8 text-right`

---

### Attention/Alert Items

**Alert Card Structure:**
```tsx
<div className="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/30 p-4 rounded-r-lg">
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50">
      <AlertIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
    </div>
    <div className="flex-1">
      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">Title</h4>
      <p className="text-sm text-slate-600 dark:text-slate-400">Description</p>
    </div>
    <span className="text-2xl font-bold text-amber-600">{count}</span>
  </div>
</div>
```

**Alert Color Variants:**
| Type | Border | Background | Icon BG | Icon/Text |
|------|--------|------------|---------|-----------|
| Warning (Certs) | `border-l-amber-500` | `bg-amber-50 dark:bg-amber-950/30` | `bg-amber-100 dark:bg-amber-900/50` | `text-amber-600 dark:text-amber-400` |
| Critical (Inspections) | `border-l-rose-500` | `bg-rose-50 dark:bg-rose-950/30` | `bg-rose-100 dark:bg-rose-900/50` | `text-rose-600 dark:text-rose-400` |
| Info (Timesheets) | `border-l-sky-500` | `bg-sky-50 dark:bg-sky-950/30` | `bg-sky-100 dark:bg-sky-900/50` | `text-sky-600 dark:text-sky-400` |
| Notice (Documents) | `border-l-pink-500` | `bg-pink-50 dark:bg-pink-950/30` | `bg-pink-100 dark:bg-pink-900/50` | `text-pink-600 dark:text-pink-400` |

---

### Schedule List Design

**Time Column Layout:**
```tsx
<div className="flex items-start gap-0">
  {/* Time Column - Fixed Width */}
  <div className="w-12 shrink-0">
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
      {time}
    </span>
  </div>
  {/* Vertical Connector Line */}
  <div className="border-l-2 border-slate-100 dark:border-slate-700 group-hover:border-[#0B64A3]/30 pl-3 flex-1">
    <p className="text-sm font-semibold text-slate-600 tracking-wide">{jobType}</p>
    <p className="text-base font-medium text-slate-500">{title}</p>
    <p className="text-sm text-slate-500">{location}</p>
    {/* Stacked Avatars */}
    <div className="flex items-center mt-2">
      {technicians.map((tech, idx) => (
        <Avatar className="w-6 h-6 border-2 border-white -ml-1.5 first:ml-0">
          <AvatarFallback className={`${tech.color} text-white text-sm font-medium`}>
            {tech.initials}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  </div>
</div>
```

---

### White-Label Branding Compatibility

**Brand Color Logic:**
```tsx
const BRAND_COLOR = "#0B64A3"; // Deep Blue fallback

const getBrandColor = (): string => {
  // When white-label branding active, use CSS variable
  if (whitelabelBrandingActive) {
    return 'var(--brand-primary, #0B64A3)';
  }
  return BRAND_COLOR;
};
```

**White-Label Compatible Elements:**
- Sidebar active state background
- Progress bar indicator color
- Interactive hover states
- Navigation badges (when using brand color)
- Logo display (custom vs default)

---

### Dashboard Layout Grid

**Responsive Grid Structure:**
```tsx
<div className="space-y-6">
  {/* KPI Metrics Row */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {/* 4 KPI cards */}
  </div>
  
  {/* Main Content Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Left: Active Projects (full height) */}
    {/* Right: Schedule + Alerts (stacked) */}
  </div>
</div>
```

**Content Area Margin:**
- Desktop: `lg:ml-60` (accounts for fixed sidebar)
- Mobile: No margin (sidebar slides over)

---

### Dashboard Checklist

When implementing or modifying dashboard sections:

- [ ] All primary content uses `text-base` (16px minimum)
- [ ] All secondary/metadata content uses `text-sm` (14px minimum)
- [ ] No `text-xs` (12px) anywhere in readable content
- [ ] Cards use proper header structure: `px-4 py-3 border-b bg-slate-50/50`
- [ ] Progress bars are 6px height (`h-1.5`) with Deep Blue indicator
- [ ] Alert items use 4px left border with proper color variants
- [ ] All elements have explicit dark mode variants
- [ ] Interactive elements use brand color from `getBrandColor()`
- [ ] Sidebar navigation items are 16px (`text-base`)
- [ ] Badges/counts use 14px (`text-sm`) minimum
- [ ] Avatars have proper fallback with visible initials
- [ ] Mobile responsive with `lg:` breakpoint prefix

---

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

---

# Changelog Pages Design System (Source of Truth for /changelog/*)

All changelog sub-pages (`/changelog/user-access`, `/changelog/projects`, `/changelog/time-tracking`, etc.) follow this unified design system. This is the authoritative styling guide for all documentation pages.

## Page Structure & Layout

**Wrapper Component:** All pages use `ChangelogGuideLayout` component which provides:
- Consistent header with title, version, and last updated date
- Left sidebar navigation with guide links
- Main content area with max-width container
- Page metadata (title, version="X.X", lastUpdated="Month Date, Year")

**Content Organization:**
```
Page Header (title, metadata)
├─ Introduction Section (space-y-4)
├─ Golden Rule Card (amber-themed)
├─ Services/Key Info Card (if applicable)
├─ Separator
├─ Main Content Sections
│  ├─ Problems Solved
│  ├─ Additional Sections (Performance, Benefits, etc.)
│  └─ Additional Details/Resources
└─ Separator + Supporting Content
```

## Color-Coded Sections

**Stakeholder Grouping:** Each stakeholder group has a dedicated color and icon:
- **Company Owners:** Amber/Gold (Crown icon) - for operational leadership perspectives
- **Building Managers:** Violet/Blue (Building2 icon) - for property management perspectives  
- **Residents:** Teal/Rose (Home icon) - for end-user perspectives
- **Technicians:** Orange (Wrench icon) - for worker perspectives
- **Operations/Admin:** Blue (Briefcase icon) - for operational staff

**Golden Rule Cards:** Highlighted information boxes following this pattern:
- Border: `border-2 border-[accent-color]-500`
- Background: `bg-[accent-color]-50 dark:bg-[accent-color]-950`
- Content: `text-[accent-color]-900 dark:text-[accent-color]-100`
- Inner highlight: `bg-white dark:bg-[accent-color]-900`
- Uses monospace code for formula/key insight: `font-mono font-bold`

**Color Mapping:**
- Amber: Golden Rule cards, warnings, foundational principles
- Emerald: Success metrics, positive outcomes, benefits
- Blue: Information, details, secondary highlights
- Violet: Analytics, technical integration, advanced topics

## Accordion Sections

**Problems Solved Pattern:**
- Type: Accordion with multiple/expand capability
- Header with Expand All/Collapse All toggle using `ChevronsUpDown` icon
- Each problem accordion item:
  - Value: unique ID (e.g., "owner-1", "tech-3")
  - Border: `border rounded-lg px-4`
  - Hover background: `bg-white dark:bg-white/10` when expanded
  - Title: Medium font, natural language problem statement in quotes
  - Content structure: "The Pain" → "Real Example" → "Solution" → "Benefit"
  - Use `<span className="font-medium text-foreground">` for section labels
  - Spacing: `space-y-4` between paragraphs, `text-muted-foreground` for body text

**Accordion Content Formula:**
Each problem accordion includes these 4 sections:
1. **The Pain:** Emotional/practical problem statement (1-2 sentences)
2. **Real Example:** Concrete scenario showing the problem in action (1-2 sentences with specific details like names, numbers, time)
3. **Solution:** How the feature solves the problem (1-2 sentences with specific capability details)
4. **Benefit:** Quantifiable improvements and outcomes (metrics, time saved, percentages, quality improvements)

## Metric & Benefit Cards

**Performance Metrics Grid:**
- Layout: `grid gap-4 md:grid-cols-2` or `md:grid-cols-4` depending on card count
- Card: Shadcn `Card` component with colored border and background
- Icon: 20px-24px lucide icon in accent color above or beside metric
- Metric Display: `text-3xl font-bold` in accent color
- Description: `text-sm text-muted-foreground`
- Border accent: `border-[color]-200 dark:border-[color]-800`

**Benefit Breakdown Cards:**
- Type: `Card` with background: `bg-[color]-50 dark:bg-[color]-950`
- Layout: 2-3 column grid for related benefits
- Icon pairing: CheckCircle2 for positive, AlertTriangle for warnings
- Typography: `font-medium` for benefit title, `text-sm text-muted-foreground` for description
- Spacing: `flex items-start gap-3` for icon + text

## Section Headers

**Stakeholder Group Headers:**
```tsx
<div className="flex items-center gap-3 pb-2 border-b">
  <[IconName] className="w-5 h-5 text-[color]-500" />
  <h3 className="text-xl md:text-2xl font-semibold">For [Stakeholder Name]</h3>
</div>
```

**Main Section Headers:**
```tsx
<h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
  <[IconName] className="w-6 h-6 text-[color]-600 dark:text-[color]-400" />
  [Section Title]
</h2>
```

**Descriptive Subtext:** Follow headers with brief context:
```tsx
<p className="text-muted-foreground leading-relaxed text-base">
  [Description of what this section covers]
</p>
```

## Typography & Content

**Default Text Spacing:**
- Section container: `space-y-8` between major sections
- Accordion container: `space-y-3` between items
- Paragraph groups: `space-y-4` between content blocks
- List items: `space-y-1` between items

**Text Styling:**
- Body text: `text-muted-foreground leading-relaxed text-base`
- Headers: Bold, size increases with hierarchy
- Emphasis: `font-medium text-foreground` for inline labels like "Example:", "Solution:", "Benefit:"
- Secondary text: `text-sm text-muted-foreground` for descriptions, captions
- Links in text: Ocean Blue, underlined, from wouter `Link` component

**Paragraph Splitting for Readability:**
Card content with multiple sentences MUST be split into 2 paragraphs for readability:
- First paragraph: Feature/capability description (what it does, how it works)
- Second paragraph: Benefit, real example, or outcome (why it matters)

```tsx
// GOOD: Split for readability
<CardContent className="p-5 space-y-2">
  <h4 className="font-semibold">Card Title</h4>
  <p className="text-base text-muted-foreground">
    Feature description. Additional context about capability.
  </p>
  <p className="text-base text-muted-foreground">
    Benefit statement or real example with specific outcome.
  </p>
</CardContent>

// BAD: Wall of text
<CardContent className="p-5 space-y-2">
  <h4 className="font-semibold">Card Title</h4>
  <p className="text-base text-muted-foreground">
    Feature description. Additional context. Benefit statement. Real example with outcome. More details.
  </p>
</CardContent>
```

This rule applies to:
- Stakeholder benefit cards
- Feature cards
- Integration cards
- Any card with more than 2-3 sentences of body text

**Bullet Points & Lists:**
```tsx
<ul className="list-disc list-inside space-y-1 ml-2">
  <li>[Item text]</li>
</ul>
```

## Separators

**Visual Break Between Sections:**
- Component: Shadcn `Separator`
- Placement: Between major section groups
- Default styling: Subtle gray divider
- Spacing: `py-4` or `py-6` on either side in parent `space-y-8`

## Integration Cards

**Module Connection Cards (e.g., "Module Integration Points"):**
- Grid: `grid gap-4 md:grid-cols-2`
- Card: `Card` with `CardHeader` + `CardContent`
- Header: Icon + title
- Icon: Small (20px) in section color with `text-[color]-600`
- Title: `text-base font-medium`
- Content: 2-3 benefit checkmarks using CheckCircle2 icon
- Benefit: `flex items-center gap-2 text-sm` with green checkmark

## Service/Feature Listing

**Service Catalog Cards:**
- Grid: `grid gap-2 sm:grid-cols-2`
- Item: `flex items-start gap-3 p-3 rounded-lg bg-muted/30`
- Icon wrapper: `p-2 rounded-lg bg-background ring-1 ring-border/50 flex-shrink-0`
- Content: Flex column with title (medium), description (small muted)
- Badge: Shadcn Badge with variant="secondary" for tracking method

## Dark Mode

**Consistent Dark/Light Variant Application:**
- All colored borders: `border-[color]-200 dark:border-[color]-800`
- All colored backgrounds: `bg-[color]-50 dark:bg-[color]-950`
- All colored text: `text-[color]-900 dark:text-[color]-100`
- Icons: Reference dark mode colors explicitly in className
- Card backgrounds: Default white in light, auto-handled in dark mode by Shadcn

## Interaction Patterns

**Expand/Collapse All Toggle:**
- Location: Top-right of "Problems Solved" section header
- Button: Shadcn `Button` with `variant="outline"`
- Icon: `ChevronsUpDown` (20px)
- Label: "Expand All" / "Collapse All" based on state
- Data-testid: `"button-toggle-all-accordions"`

**Accordion Item Interaction:**
- Hover: Subtle visual indicator (built into Shadcn Accordion)
- Expanded state: Background highlight `bg-white dark:bg-white/10`
- Smooth transitions: Accordion handles animation automatically
- Content: Never cut off, full height expansion

## Content Rules for Changelog Pages

1. **Problem Statements:** Use real industry language and pain points from actual user interviews/feedback
2. **Example Scenarios:** Include specific details (unit numbers, names, time periods) to make examples tangible
3. **Quantified Benefits:** Every benefit statement should include metrics when possible (percentages, hours saved, cost savings)
4. **Consistency:** Same problem structure across all stakeholder groups
5. **No AI-like language:** Use commas and natural connectors instead of em-dashes; write in conversational business tone
6. **Emoji-free:** Never use emoji in any changelog content
7. **Data-testid:** Add test IDs to interactive elements (accordions, buttons, toggles)

## Component Imports for Changelog Pages

Standard imports for all /changelog/ pages:
```tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLocation } from "wouter";
// Lucide icons as needed for section colors
```

## Example Structure Template

```tsx
export default function GuideNameGuide() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const allExpanded = openItems.length === ALL_ACCORDION_ITEMS.length;

  const toggleAll = () => {
    setOpenItems(allExpanded ? [] : [...ALL_ACCORDION_ITEMS]);
  };

  return (
    <ChangelogGuideLayout 
      title="[Guide Name]"
      version="X.X"
      lastUpdated="[Month Date, Year]"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            [Introduction paragraph]
          </p>
        </section>

        <section className="space-y-6">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            {/* Golden Rule Card */}
          </Card>
        </section>

        <Separator />

        <section className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-3xl md:text-4xl font-bold">Problems Solved</h2>
            <Button onClick={toggleAll} variant="outline">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          {/* Stakeholder sections with accordions */}
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
```