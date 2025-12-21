# Technician Portal - Employer View Tab Changes

**Date:** December 21, 2025
**Purpose:** Documentation of styling/layout changes made to the Employer View tab in TechnicianPortal.tsx for potential revert.

## Summary

The Employer View tab (activeTab === 'employer') was redesigned to use a glass-morphism container with section-based layout, inspired by the Resident Profile design pattern.

## Changes Made

### Container Styling (Lines ~2645)

**Before:** Standard Card components with default styling

**After:** Glass-morphism container with the following classes:
```tsx
<div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6">
```

### Header Section (Lines ~2647-2675)

Added a header with:
- Icon circle (h-12 w-12 rounded-full bg-primary/20)
- Eye icon
- Title and description
- Edit/Cancel button with data-testid attributes

### Visibility Status Section (Lines ~2677-2718)

Redesigned visibility toggle with:
- Compact inline layout within the container
- Dynamic background colors based on visibility state:
  - Visible: `bg-green-500/10 border border-green-500/20`
  - Hidden: `bg-amber-500/10 border border-amber-500/20`
- Icon circle with Eye/EyeOff icons
- Switch component with data-testid="switch-employer-visibility"

### Profile Info Section (Lines ~2720-2768)

Unified "Profile Preview" section with:
- Section header: `font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4`
- Avatar with border styling (w-20 h-20 border-2 border-primary/20)
- Name with PLUS badge support
- Location display
- Experience calculation from ropeAccessStartDate

### Certifications Section (Lines ~2771-2818)

Styled with:
- Border separator (pt-6 border-t)
- Section header with Award icon
- IRATA/SPRAT/First Aid items with Badges
- data-testid attributes on all display elements

### Specialties Section (Lines ~2820-2973)

Features:
- Section header with HardHat icon
- Edit mode with specialty selection dropdowns
- View mode with specialty badges
- Add specialty button for empty state
- All interactive elements have data-testid attributes

### Resumes Section (Lines ~2975-2991)

Shows uploaded resume documents as badges with FileText icons.

## Data-Testid Attributes Added

Interactive elements:
- `button-back-to-home-employer`
- `button-edit-employer-profile`
- `button-cancel-employer-edit`
- `switch-employer-visibility`
- `badge-specialty-{index}`
- `button-remove-specialty-{index}`
- `select-specialty-category`
- `select-specialty-job-type`
- `button-add-specialty`
- `button-add-first-specialty`
- `badge-specialty-view-{index}`
- `badge-resume-{index}`

Display elements:
- `text-employer-profile-name`
- `text-employer-profile-location`
- `text-employer-profile-experience`
- `text-employer-profile-irata`
- `text-employer-profile-sprat`
- `text-employer-profile-firstaid`

## Revert Instructions

To revert these changes, restore TechnicianPortal.tsx to the version before the glass-morphism container was added (lines ~2629-2996). The original implementation used standard Card components without the unified container approach.

## Files Affected

- `client/src/pages/TechnicianPortal.tsx` (lines ~2629-2996)
