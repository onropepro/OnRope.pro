# OnRopePro Design Guidelines

> **Single Source of Truth** — Reference this document before building ANY new page or component.

---

## Font Configuration

### Primary Font: Outfit

Add to `index.html` head:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

Update `tailwind.config.js`:

```js
theme: {
  extend: {
    fontFamily: {
      sans: ['Outfit', 'system-ui', 'sans-serif'],
    },
  },
}
```

### Typography Scale (Flowbite-aligned)

| Element | Class | Weight | Size |
|---------|-------|--------|------|
| H1 (Hero) | `text-4xl md:text-5xl lg:text-6xl font-extrabold` | 800 | 36/48/60px |
| H2 (Section) | `text-3xl md:text-4xl font-bold` | 700 | 30/36px |
| H3 (Card title) | `text-xl md:text-2xl font-semibold` | 600 | 20/24px |
| H4 (Subsection) | `text-lg font-semibold` | 600 | 18px |
| Body | `text-base font-normal` | 400 | 16px |
| Small | `text-sm font-normal` | 400 | 14px |
| Caption | `text-xs font-medium` | 500 | 12px |

---

## Color System

### Brand Palette

Define in `tailwind.config.js` under `theme.extend.colors`:

```js
colors: {
  // Primary Navy (backgrounds, headers, nav)
  navy: {
    950: '#0F1629',  // Darkest - primary bg, sidebar
    900: '#141C33',  // Slightly lighter
    800: '#193A63',  // Secondary surfaces, cards on dark
  },
  
  // Action Blue (buttons, links, interactive)
  action: {
    600: '#0B64A3',  // Primary buttons, links
    500: '#0369A1',  // Hover states, focus rings
    400: '#0C7DC2',  // Light hover
  },
  
  // Neutral Gray
  neutral: {
    400: '#989C94',  // Disabled, placeholders, borders
    200: '#D1D5DB',  // Light borders
    100: '#F3F3F3',  // Page backgrounds, light surfaces
    50: '#FAFAFA',   // Subtle backgrounds
  },
  
  // Accent Rust (destructive, alerts)
  rust: {
    600: '#AB4521',  // Delete buttons, error states
    500: '#C14E25',  // Hover destructive
    100: '#FEE2E2',  // Error backgrounds
  },
  
  // Semantic (success/warning)
  success: {
    600: '#059669',
    100: '#D1FAE5',
  },
  warning: {
    600: '#D97706',
    100: '#FEF3C7',
  },
}
```

### Color Usage Rules

| Context | Light Mode | Dark Mode |
|---------|------------|-----------|
| Page background | `bg-neutral-100` | `bg-navy-950` |
| Card surface | `bg-white` | `bg-navy-800` |
| Primary text | `text-gray-900` | `text-white` |
| Secondary text | `text-gray-600` | `text-gray-400` |
| Primary button | `bg-action-600 hover:bg-action-500 text-white` | Same |
| Destructive button | `bg-rust-600 hover:bg-rust-500 text-white` | Same |
| Borders | `border-neutral-200` | `border-navy-800` |
| Focus ring | `focus:ring-action-500` | Same |

---

## Flowbite Component Patterns

### Buttons

```html
<!-- Primary -->
<button class="text-white bg-action-600 hover:bg-action-500 focus:ring-4 focus:ring-action-500/50 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none transition-colors">
  Primary Action
</button>

<!-- Secondary/Outline -->
<button class="text-action-600 bg-transparent border border-action-600 hover:bg-action-600 hover:text-white focus:ring-4 focus:ring-action-500/50 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors">
  Secondary
</button>

<!-- Destructive -->
<button class="text-white bg-rust-600 hover:bg-rust-500 focus:ring-4 focus:ring-rust-600/50 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors">
  Delete
</button>

<!-- Ghost -->
<button class="text-gray-600 hover:text-action-600 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors">
  Cancel
</button>
```

### Cards

```html
<div class="bg-white dark:bg-navy-800 rounded-lg shadow-md border border-neutral-200 dark:border-navy-800 p-6">
  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Card Title</h3>
  <p class="text-gray-600 dark:text-gray-400">Card content here.</p>
</div>
```

### Form Inputs

```html
<div class="mb-4">
  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Label</label>
  <input type="text" class="bg-gray-50 border border-neutral-200 text-gray-900 text-sm rounded-lg focus:ring-action-500 focus:border-action-500 block w-full p-2.5 dark:bg-navy-800 dark:border-navy-800 dark:text-white dark:focus:ring-action-500 dark:focus:border-action-500" placeholder="Placeholder">
</div>
```

### Badges/Tags

```html
<!-- Status badges -->
<span class="bg-success-100 text-success-600 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
<span class="bg-warning-100 text-warning-600 text-xs font-medium px-2.5 py-0.5 rounded">Pending</span>
<span class="bg-rust-100 text-rust-600 text-xs font-medium px-2.5 py-0.5 rounded">Expired</span>
<span class="bg-neutral-100 text-neutral-400 text-xs font-medium px-2.5 py-0.5 rounded">Inactive</span>
```

### Navigation (Sidebar)

```html
<aside class="fixed top-0 left-0 z-40 w-64 h-screen bg-navy-950 border-r border-navy-800">
  <div class="h-full px-3 py-4 overflow-y-auto">
    <a href="/" class="flex items-center mb-6 px-2">
      <span class="text-xl font-bold text-white">OnRopePro</span>
    </a>
    <ul class="space-y-2">
      <li>
        <a href="#" class="flex items-center p-2 text-gray-300 rounded-lg hover:bg-navy-800 hover:text-white group">
          <svg class="w-5 h-5 text-gray-400 group-hover:text-white" ...></svg>
          <span class="ml-3">Dashboard</span>
        </a>
      </li>
    </ul>
  </div>
</aside>
```

---

## Spacing System

Use Tailwind's default 4px base with these conventions:

| Context | Spacing |
|---------|---------|
| Section padding | `py-16 md:py-24` (64-96px) |
| Card padding | `p-6` (24px) |
| Component gap | `gap-4` (16px) |
| Stack items | `space-y-4` (16px) |
| Inline items | `space-x-2` (8px) |
| Container max-width | `max-w-7xl mx-auto px-4` |

---

## Shadows & Borders

```js
// tailwind.config.js
boxShadow: {
  'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
},
borderRadius: {
  'sm': '0.25rem',       // 4px - badges
  'DEFAULT': '0.375rem', // 6px - inputs
  'lg': '0.5rem',        // 8px - cards, buttons
  'xl': '0.75rem',       // 12px - modals
  '2xl': '1rem',         // 16px - large cards
}
```

---

## Responsive Breakpoints

Follow Flowbite/Tailwind defaults:

- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)
- `2xl`: 1536px (extra large)

Mobile-first approach: Design for mobile, enhance for larger screens.

---

## Icon System

Use Heroicons (Flowbite default) via `@heroicons/react`:

```bash
npm install @heroicons/react
```

Usage:

```jsx
import { HomeIcon, UserIcon } from '@heroicons/react/24/outline'
// Solid variants for active states
import { HomeIcon as HomeIconSolid } from '@heroicons/react/24/solid'
```

Icon sizing: `w-5 h-5` (20px) for nav, `w-6 h-6` (24px) for features.

---

## Animation & Transitions

Standard transitions:

```css
/* All interactive elements */
transition-colors duration-200

/* Modals/dropdowns */
transition-all duration-300 ease-out

/* Hover scale (buttons, cards) */
hover:scale-[1.02] transition-transform duration-200
```

---

## Accessibility Requirements

1. All interactive elements must have visible focus states (`focus:ring-4`)
2. Color contrast minimum 4.5:1 for text
3. Touch targets minimum 44x44px on mobile
4. Semantic HTML (buttons for actions, links for navigation)
5. aria-labels for icon-only buttons

---

## File Structure

```
/client
  /src
    /components
      /ui          # Base components (Button, Input, Card, Badge)
      /layout      # Navigation, Sidebar, Header, Footer
      /modules     # Module-specific components
    /styles
      globals.css  # Base styles, Tailwind imports
    /lib
      utils.ts     # cn() helper for conditional classes
```

---

## Mandatory Checklist

Before creating ANY new page or component:

- [ ] Uses Outfit font family
- [ ] Colors from defined palette only
- [ ] Follows Flowbite component patterns
- [ ] Responsive (mobile-first)
- [ ] Dark mode compatible
- [ ] Focus states visible
- [ ] Consistent spacing (4px base)

---

**This document is the SINGLE SOURCE OF TRUTH. Any deviation requires explicit approval.**
