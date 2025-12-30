# OnRopePro Color Palette Report

Generated: December 24, 2025

This report documents where each color from the design system is used across the codebase.

---

## Primary System Colors (7 Colors)

### 1. Ocean Blue - #0B64A3
**Role:** Primary brand color, actions, links, active states

**Usage Locations:**

| File | Context |
|------|---------|
| `DashboardSidebar.tsx` | Employer variant brand color |
| `PublicHeader.tsx` | Employer stakeholder color mapping |
| `TechnicianPortal.tsx` | Progress bars, accent text, hover states, CTAs |
| `TechnicianPSR.tsx` | Icon accents, checkmarks |
| `Dashboard.tsx` | Avatar backgrounds |
| `Employer.tsx` | Hero gradients, buttons, icons, feature cards |
| `HomePage.tsx` | Hero gradient, CTAs, module icons, pricing cards |
| `TechnicianLogin.tsx` | Hero gradients, buttons |
| `HelpCenter.tsx` | Hero gradient, stakeholder colors |
| `QuizSection.tsx` | Submit buttons |
| `DashboardSearch.tsx` | Focus ring colors |
| Multiple dashboard cards | Default accent color fallback (`branding?.primaryColor \|\| "#0B64A3"`) |
| All module landing pages | Hero gradients (`linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)`) |

**Tailwind Equivalents Used:**
- `text-blue-600`, `text-blue-700` - Stats, metrics, links
- `bg-blue-50`, `bg-blue-100` - Light backgrounds, badges
- Found in 75+ files for stats panels and feature highlights

---

### 2. Deep Ocean - #0369A1
**Role:** Hover states, gradient endpoints, depth accents

**Usage Locations:**

| File | Context |
|------|---------|
| `Employer.tsx` | Hero gradient endpoint |
| `HomePage.tsx` | Button hover state, gradient endpoint |
| `TechnicianLogin.tsx` | Hero gradient endpoint |
| All module landing pages | Gradient endpoint in hero sections |

**Pattern:** Always paired with #0B64A3 in gradients: `linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)`

---

### 3. Navy Dark - #0F1629
**Role:** Dark backgrounds, depth (defined in design system but not directly used as hex)

**Usage:** Implemented through CSS variables and dark mode backgrounds rather than direct hex usage.

---

### 4. Navy Blue - #193A63
**Role:** Secondary backgrounds, subtle contrast (defined in design system but not directly used as hex)

**Usage:** Not directly used as hex in current codebase. Consider adopting for dark mode enhancements.

---

### 5. Neutral Gray - #989C94
**Role:** Secondary text, borders, disabled states (defined in design system)

**Usage:** Not directly used as hex. Implemented through Tailwind grays and `text-muted-foreground`.

---

### 6. Light Gray - #F3F3F3
**Role:** Page backgrounds, light surfaces (defined in design system)

**Usage:** Implemented through CSS variable `--background: 218 27% 98%` in index.css rather than direct hex.

---

### 7. Rust Brown - #AB4521
**Role:** Call-to-action buttons, emphasis, Technician brand color

**Usage Locations:**

| File | Context |
|------|---------|
| `DashboardSidebar.tsx` | Technician variant brand color |
| `PublicHeader.tsx` | Technician stakeholder color mapping |
| `TechnicianRegistration.tsx` | Side panel, step indicators, buttons, selection states |
| `TechnicianHeader.tsx` | Avatar backgrounds |
| `TechnicianLanding.tsx` | Hero gradient, CTAs, feature icons, numbered steps |
| `ForTechnicians.tsx` | Hero gradient, article cards, icons |
| `HelpCenter.tsx` | Technician stakeholder color |
| `ConnectionsGuide.tsx` | Technician section styling |
| Multiple landing pages | Technician-specific cards and accents |

**Gradient Pattern:** `linear-gradient(135deg, #AB4521 0%, #8B371A 100%)`

---

## Stakeholder Colors (5 Colors)

### 1. Employers - #0B64A3 (Ocean Blue)
See Primary System Colors above.

---

### 2. Property Manager - #6E9075 (Sage Green)
**Role:** PM landing pages, cards, accents

**Usage Locations:**

| File | Context |
|------|---------|
| `DashboardSidebar.tsx` | Property-manager variant brand color |
| `PublicHeader.tsx` | Property manager stakeholder mapping, dropdown icons |
| `PropertyManagerRegistration.tsx` | `SAGE_GREEN` constant |
| `CSRPropertyManagerLanding.tsx` | `SAGE_GREEN` constant, buttons |
| `ForPropertyManagers.tsx` | Hero gradient, article cards |
| `HelpCenter.tsx` | Property manager stakeholder color |
| `ConnectionsGuide.tsx` | PM section styling |

**Gradient Pattern:** `linear-gradient(135deg, #6E9075 0%, #5A7A60 100%)`

---

### 3. Resident - #86A59C (Mint Green)
**Role:** Resident portal, feedback, cards

**Usage Locations:**

| File | Context |
|------|---------|
| `DashboardSidebar.tsx` | Resident variant brand color |
| `PublicHeader.tsx` | Resident stakeholder color mapping |
| `ResidentSlidingSignup.tsx` | `RESIDENT_COLOR` constant, buttons |
| `ForResidents.tsx` | Hero gradient, article cards |
| `ResidentLanding.tsx` | Hero and accent elements |
| `HelpCenter.tsx` | Resident stakeholder color |
| `ConnectionsGuide.tsx` | Resident section styling |

**Gradient Pattern:** `linear-gradient(135deg, #86A59C 0%, #6B8A80 100%)`

---

### 4. Building Manager - #B89685 (Warm Taupe)
**Role:** BM landing pages, cards

**Usage Locations:**

| File | Context |
|------|---------|
| `DashboardSidebar.tsx` | Building-manager variant brand color |
| `ForBuildingManagers.tsx` | Hero gradient, article cards |
| `HelpCenter.tsx` | Building manager stakeholder color |
| `ConnectionsGuide.tsx` | Building manager section styling |

**Gradient Pattern:** `linear-gradient(135deg, #B89685 0%, #9A7B6C 100%)`

---

### 5. Technician - #AB4521 (Rust Brown)
See Primary System Colors above.

---

### 6. Ground Crew - #5D7B6F (Added Extension)
**Role:** Ground crew portal branding

**Usage Locations:**

| File | Context |
|------|---------|
| `DashboardSidebar.tsx` | Ground-crew variant brand color |

**Note:** Newly added color for ground crew portal. Consider expanding usage to landing pages when created.

---

## Accent Palette (Status & Feedback)

### 1. Emerald - #10B981
**Role:** Success, completed tasks

**Direct Hex Usage:** Not directly used as hex in codebase.

**Tailwind Implementation:**
- `text-emerald-500`, `text-emerald-600` - Success text, checkmarks
- `bg-emerald-50`, `bg-emerald-100`, `bg-emerald-500` - Success badges, backgrounds
- Found in 68+ files for success states, completion indicators, positive metrics

**CSS Variable:** `--success: 160 84% 39%` in index.css

---

### 2. Amber - #F59E0B
**Role:** Warnings, in-progress states

**Direct Hex Usage:** Not directly used as hex in codebase.

**Tailwind Implementation:**
- `text-amber-500`, `text-amber-600` - Warning text
- `bg-amber-50`, `bg-amber-100`, `bg-amber-500` - Warning badges
- Found in 42+ files for pending states, caution indicators

**CSS Variable:** `--warning: 38 92% 50%` in index.css

---

### 3. Rose - #F43F5E
**Role:** Urgent, critical alerts

**Direct Hex Usage:** Not directly used as hex in codebase.

**Tailwind Implementation:**
- `text-rose-500`, `text-rose-600` - Error text, alerts
- `bg-rose-50`, `bg-rose-100`, `bg-rose-500` - Error badges
- Found in 42+ files for destructive actions, critical alerts

**CSS Variable:** `--destructive: 347 77% 60%` in index.css

---

### 4. Violet - #8B5CF6
**Role:** Analytics, secondary highlights

**Direct Hex Usage:** Not directly used as hex in codebase.

**Tailwind Implementation:**
- `text-violet-500`, `text-violet-600` - Analytics metrics, highlights
- `bg-violet-50`, `bg-violet-100`, `bg-violet-500` - Feature badges
- Found in 48+ files for stats panels (4th stat position), secondary features

---

## Surface Colors

### Pure White - #FFFFFF
**CSS Variable:** `--card: 0 0% 100%`
**Usage:** Primary card surfaces throughout the application

### Cloud - #F8FAFC
**CSS Variable:** `--background: 218 27% 98%`
**Usage:** Page backgrounds (slightly tinted cloud rather than pure #F8FAFC)

### Mist - #E2E8F0
**CSS Variable:** `--border: 214 32% 91%`
**Usage:** Subtle borders, dividers

---

## Stats Panel Color Pattern

Per design guidelines, stats panels use a consistent 4-color sequence regardless of page:

| Position | Color | Tailwind Class | Purpose |
|----------|-------|----------------|---------|
| 1st Stat | Ocean Blue | `text-blue-700` | Primary metric |
| 2nd Stat | Emerald | `text-emerald-600` | Success/financial |
| 3rd Stat | Orange | `text-orange-600` | Quantity/volume |
| 4th Stat | Violet | `text-violet-600` | Secondary benefit |

**Files using this pattern:** All module landing pages, stakeholder pages with stats panels.

---

## Orange (#EA580C family)
**Role:** Third stat in stats panels, quantity metrics

**Tailwind Implementation:**
- `text-orange-500`, `text-orange-600` - Metrics, counts
- `bg-orange-50`, `bg-orange-100` - Highlight backgrounds
- Found in 48+ files primarily for stats and status indicators

---

## Summary Statistics

| Color Category | Colors Defined | Colors Actively Used |
|----------------|----------------|---------------------|
| Primary System | 7 | 4 (via direct hex or CSS vars) |
| Stakeholder | 5 (+1 ground crew) | 6 |
| Accent/Status | 4 | 4 (via Tailwind classes) |
| Surfaces | 3 | 3 (via CSS variables) |

---

## Recommendations

1. **Navy Dark (#0F1629) and Navy Blue (#193A63):** Consider implementing for dark mode depth layers or header backgrounds.

2. **Neutral Gray (#989C94):** Currently handled by Tailwind grays. Could be standardized for brand consistency.

3. **Ground Crew (#5D7B6F):** Expand usage to include landing page hero gradients when ground crew public-facing content is created.

4. **Consistency:** All stakeholder colors have gradient patterns defined. Ensure all new stakeholder pages follow the established gradient formula.

---

## Color Variable Locations

| Variable | File | Value |
|----------|------|-------|
| `--primary` | `index.css` | `199 89% 48%` (Ocean Blue) |
| `--destructive` | `index.css` | `347 77% 60%` (Rose) |
| `--warning` | `index.css` | `38 92% 50%` (Amber) |
| `--success` | `index.css` | `160 84% 39%` (Emerald) |
| Stakeholder colors | `DashboardSidebar.tsx` | Direct hex values |
| Stakeholder colors | `PublicHeader.tsx` | Direct hex values |
