# Design Guidelines: Premium Enterprise Rope Access SaaS Platform

## Resources

- **Brand Palette Visual:** `attached_assets/OnRopePro-Brand-Palette.pdf` — High-resolution color swatches and hex values for all primary, accent, and surface colors

## Design Approach

**Reference Systems:** Linear (clean hierarchy, refined spacing), Notion (sophisticated neutrals, data density), Monday.com (vibrant accents, dashboard polish)  
**Core Aesthetic:** Premium SaaS with Material Design 3 influence, glass-morphism cards, subtle gradients, ocean-inspired palette, professional data visualization, illustrated building graphics

## Color Palette

**Primary System:**
- Navy Dark: #0F1629 (dark backgrounds, depth)
- Navy Blue: #193A63 (secondary backgrounds, subtle contrast)
- Ocean Blue: #0B64A3 (primary actions, links, active states)
- Deep Ocean: #0369A1 (hover states, depth accents)
- Neutral Gray: #989C94 (secondary text, borders, disabled states)
- Light Gray: #F3F3F3 (page backgrounds, light surfaces)
- Rust Brown: #AB4521 (call-to-action buttons, emphasis)

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
- Glass Dark: rgba(15, 22, 41, 0.6) with 20px blur

**Gradients:**
- Primary (Hero): linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)
- Accent: linear-gradient(135deg, #0369A1 0%, #0B64A3 100%)
- Subtle: linear-gradient(180deg, #F3F3F3 0%, #FFFFFF 100%)

## Typography (Inter via Google Fonts)

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

**Reference Implementation:** `/modules/safety-compliance` (SafetyComplianceLanding.tsx)

All module landing pages MUST follow this exact hero structure for consistency:

**Container & Background:**
```
<section className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-sky-700 to-blue-900 text-white">
  <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
```

**Badge (Module Label):**
```
<Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1">
  [Module Name] Module
</Badge>
```

**Headline Typography:**
- Size: `text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight`
- Main text: White (default)
- Emphasis phrase: `text-sky-200` (#BAE6FD) - subtle but obvious offset color

**Subtitle:**
- Size: `text-xl md:text-2xl text-sky-100`
- Max width: `max-w-3xl mx-auto`
- Use `<strong>` for key phrases

**CTA Buttons:**
- Primary: `<Button size="lg" className="bg-white text-sky-700 hover:bg-sky-50">`
- Secondary: `<Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">`

**Stats Panel - Unified Floating Design (All Module Pages):**
- Section: `className="relative bg-white dark:bg-slate-950 -mt-px overflow-visible"`
- Container: `className="max-w-4xl mx-auto px-4 pt-4 pb-12"`
- Card: `className="shadow-xl border-0 relative z-20 -mt-20"`
- CardContent: `className="p-8"`
- Grid: 2 columns mobile, 4 columns desktop
- Spacing: Gap-6 md:gap-8 between stat columns
- Float Effect: `-mt-20` pulls card 80px into hero area; `overflow-visible` + `z-20` prevents clipping and ensures card floats above all layers
- Result: Stats card visually floats between blue hero and white content section, creating smooth visual connector

**Hero Emphasis Color Palette:**
- Primary emphasis: `text-sky-200` (#BAE6FD) - approved for all module hero headlines
- Secondary text: `text-sky-100` - for subtitles and descriptions

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