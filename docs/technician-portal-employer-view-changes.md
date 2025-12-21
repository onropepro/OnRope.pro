# Technician Portal Employer View - Style Changes Documentation

**Date:** December 21, 2025  
**File:** `client/src/pages/TechnicianPortal.tsx`  
**Lines:** ~2629-2996

## Purpose
This document captures all styling changes made to the Employer View tab in the Technician Portal, allowing for easy revert if needed.

## Overview
The Employer View tab was redesigned with a glass-morphism aesthetic and section-based layout to match modern SaaS design patterns.

---

## Key Styling Changes

### 1. Main Container (Line ~2645)
**Changed From:** Standard Card component  
**Changed To:** Glass-morphism container

```tsx
// NEW STYLE:
<div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6">
```

### 2. Header Section (Lines ~2647-2675)
- Added icon in circle: `h-12 w-12 rounded-full bg-primary/20`
- Eye icon inside: `w-6 h-6 text-primary`
- Title and description stacked vertically
- Edit/Cancel buttons aligned right with `flex-wrap`

```tsx
<div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
  <div className="flex items-center gap-3">
    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
      <Eye className="w-6 h-6 text-primary" />
    </div>
    <div>
      <h2 className="text-xl font-bold">{t.employerProfileTitle}</h2>
      <p className="text-sm text-muted-foreground">{t.employerProfileDesc}</p>
    </div>
  </div>
  {/* Edit button */}
</div>
```

### 3. Visibility Status Card (Lines ~2678-2718)
**NEW Component:** Inline status card with colored background

```tsx
<div className={`flex items-center justify-between p-4 rounded-lg mb-6 ${
  user.isVisibleToEmployers 
    ? "bg-green-500/10 border border-green-500/20" 
    : "bg-amber-500/10 border border-amber-500/20"
}`}>
  <div className="flex items-center gap-3">
    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
      user.isVisibleToEmployers ? "bg-green-500/20" : "bg-amber-500/20"
    }`}>
      {user.isVisibleToEmployers ? (
        <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
      ) : (
        <EyeOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      )}
    </div>
    <div>
      <p className="font-medium">{t.visibilityStatus}</p>
      <p className="text-sm text-muted-foreground">...</p>
    </div>
  </div>
  <Switch ... />
</div>
```

### 4. Section Headers Pattern
All section headers use this consistent styling:

```tsx
<h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
  <IconComponent className="w-4 h-4" />
  Section Title
</h3>
```

### 5. Profile Preview Section (Lines ~2720-2768)
- Avatar: `w-20 h-20 border-2 border-primary/20`
- Avatar fallback: `text-2xl bg-primary/10 text-primary`
- Name with PLUS badge inline
- Location and experience with icons

### 6. Certifications Section (Lines ~2771-2818)
- Border separator: `pt-6 border-t`
- Award icon in header
- Each certification has:
  - Small label: `text-xs text-muted-foreground`
  - Value: `font-medium`
  - Badge aligned right

### 7. Specialties Section (Lines ~2820-2973)
- Border separator: `pt-6 border-t`
- HardHat icon in header
- Edit mode: dropdowns for category/job type selection
- View mode: badges with icons

### 8. Resumes Section (Lines ~2975-2991)
- Border separator: `pt-6 border-t`
- FileText icon in header
- Badge list for resume documents

---

## To Revert

To revert these changes, replace the Employer View content (lines ~2629-2996) with the original Card-based layout:

```tsx
{/* EMPLOYER VIEW TAB - What employers see */}
{activeTab === 'employer' && user && (
  <>
    <Button variant="ghost" onClick={() => setActiveTab('home')} className="gap-2 -mt-2 mb-2">
      <ArrowLeft className="w-4 h-4" />
      {t.backToHome}
    </Button>

    <Card>
      <CardHeader>
        <CardTitle>{t.employerProfileTitle}</CardTitle>
        <CardDescription>{t.employerProfileDesc}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Original content structure without glass-morphism */}
      </CardContent>
    </Card>
  </>
)}
```

---

## Design Pattern Reference

**Glass-morphism container:**
```
bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6
```

**Section header:**
```
font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2
```

**Section separator:**
```
pt-6 border-t
```
