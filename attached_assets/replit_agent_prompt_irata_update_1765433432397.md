# Replit Agent Prompt: Update IRATALoggingGuide.tsx

## Context
You are updating the IRATA/SPRAT Task Logging Guide page (`IRATALoggingGuide.tsx`) to fix factual errors and add missing content. This page documents a feature that helps rope access technicians track their certification hours.

## File Location
`client/src/pages/changelog/IRATALoggingGuide.tsx`

---

## PART 1: CRITICAL FIXES (Must Do First)

### Fix 1: Remove "Assessment preparation" from Problems Solved
**Current (WRONG):**
```tsx
<li className="flex items-start gap-2">
  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
  <span><strong>Assessment preparation:</strong> Complete hour history available instantly for IRATA / SPRAT level assessments</span>
</li>
```
**Action:** DELETE this entire `<li>` element. This feature doesn't exist and was explicitly flagged for removal.

---

### Fix 2: Update "Certification progression tracking" to show it's coming soon
**Current (MISLEADING):**
```tsx
<span><strong>Certification progression tracking:</strong> Automatic hour accumulation shows progress toward next IRATA / SPRAT level</span>
```
**Change to:**
```tsx
<span><strong>Certification progression tracking:</strong> View your accumulated hours toward next IRATA / SPRAT level <Badge variant="outline" className="ml-1 text-xs">Plus Feature - Coming Soon</Badge></span>
```
You'll need to import Badge if not already: `import { Badge } from "@/components/ui/badge";`

---

### Fix 3: Fix "Date range filtering" to "Date range export"
**Current (WRONG):** In the "History Features" Card:
```tsx
<div className="flex items-center gap-2">
  <Calendar className="w-4 h-4 text-purple-500" />
  <span>Date range filtering</span>
</div>
```
**Change to:**
```tsx
<div className="flex items-center gap-2">
  <FileText className="w-4 h-4 text-purple-500" />
  <span>Date range export (PDF)</span>
</div>
```

---

### Fix 4: Remove duplicate "Rope to Rope Transfer" from task types
In the "Movement & Positioning" Card, there are two similar items:
- "Rope Transfer"
- "Rope to Rope Transfer"

These are duplicates in the database. **Remove "Rope to Rope Transfer"** and keep only "Rope Transfer".

---

### Fix 5: Add missing workflow step (5 steps, not 4)
The "How Task Logging Works" section currently shows 4 steps. It's missing step 2.

**Current order:** Complete Session → Task Selection → Allocate Hours → Portfolio
**Correct order:** Complete Session → **Confirm Logging** → Task Selection → Allocate Hours → Portfolio

Insert this new card after step 1 and renumber subsequent steps (2→3, 3→4, 4→5):

```tsx
<Card className="bg-muted/30">
  <CardContent className="pt-6">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-action-600 dark:text-action-400 font-bold shrink-0">
        2
      </div>
      <div>
        <h3 className="text-xl md:text-2xl font-semibold">Confirm IRATA / SPRAT Logging</h3>
        <p className="text-sm text-muted-foreground mt-1">
          A prompt asks if you want to log these hours to your IRATA / SPRAT portfolio. This only appears for certified technicians.
        </p>
      </div>
    </div>
  </CardContent>
</Card>

<div className="flex justify-center">
  <ArrowRight className="w-5 h-5 text-muted-foreground" />
</div>
```

---

## PART 2: ADD CRITICAL DISCLAIMER

Add this warning card immediately after the Golden Rule section (after the first `<Separator />`):

```tsx
<section className="space-y-4">
  <Card className="border-2 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950">
    <CardContent className="pt-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
        <div className="space-y-2">
          <p className="font-bold text-red-900 dark:text-red-100 text-lg">
            Important: This Does NOT Replace Your Physical Logbook
          </p>
          <p className="text-red-800 dark:text-red-200 text-sm">
            IRATA and SPRAT still require you to maintain a physical logbook. WorkSafeBC and other regulatory bodies may request to see your written logbook on-site. OnRopePro's digital logging is a <strong>supplement</strong> that helps you maintain accurate records—not a replacement for your official certification documentation.
          </p>
          <p className="text-red-800 dark:text-red-200 text-sm">
            <strong>Note:</strong> If you have no logged rope time for 6 months, your certification may be considered invalid until recertification. Consistent logging protects your credentials.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</section>

<Separator />
```

---

## PART 3: ADD KEY FEATURES SUMMARY

Add this section immediately after the disclaimer (before Problems Solved):

```tsx
<section className="space-y-4">
  <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
    <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
    Key Features
  </h2>
  
  <div className="grid md:grid-cols-2 gap-4">
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold">OCR Logbook Scanning</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Photograph your existing paper logbook pages. AI extracts hours and task data automatically—no manual entry required.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold">Automatic Session Capture</h3>
            <p className="text-sm text-muted-foreground mt-1">
              When connected to an employer, your work hours are captured automatically from clock in/out. No timesheets needed.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-action-100 dark:bg-action-900 flex items-center justify-center shrink-0">
            <ListChecks className="w-5 h-5 text-action-600 dark:text-action-400" />
          </div>
          <div>
            <h3 className="font-semibold">20+ Task Categories</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Industry-standard IRATA/SPRAT task types ensure your hours are properly categorized for certification assessments.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold">PDF Export</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Export your complete hour history for any date range. Perfect for certification renewals and job applications.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold">Works Connected or Independent</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Log hours whether you're employed through the platform or working independently. Your portable profile goes with you.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h3 className="font-semibold">Career Statistics</h3>
            <p className="text-sm text-muted-foreground mt-1">
              View hours by week, month, or year. Track task diversity to ensure you're building well-rounded experience.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</section>

<Separator />
```

**Add this import at the top:**
```tsx
import { Camera } from "lucide-react";
```

---

## PART 4: ADD HOURS ALLOCATION WARNING

In the "How Task Logging Works" section, add this warning card after step 3 (Select Tasks & Allocate Hours):

```tsx
<Card className="border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/50">
  <CardContent className="pt-6">
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
      <div className="space-y-1">
        <p className="font-semibold text-amber-900 dark:text-amber-100">
          Important: Task Hours ≠ Shift Hours
        </p>
        <p className="text-sm text-amber-800 dark:text-amber-200">
          An 8-hour shift doesn't mean 8 hours of rope access tasks. Deduct lunch breaks, travel time, ground-level prep, and non-rope work. IRATA assessors review your logged tasks carefully—accuracy matters for your certification progression.
        </p>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## PART 5: UPDATE BASELINE HOURS SECTION

Replace the existing Baseline Hours Entry section content to include OCR scanning:

```tsx
<section className="space-y-4">
  <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
    <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
    Baseline Hours Entry
  </h2>

  <Card className="bg-action-50 dark:bg-action-950 border-action-200 dark:border-action-800">
    <CardContent className="pt-6">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-action-600 dark:text-action-400 mt-0.5 shrink-0" />
        <div className="space-y-3 text-sm">
          <p className="font-semibold text-action-900 dark:text-action-100">
            Already Have IRATA / SPRAT Experience?
          </p>
          <p className="text-action-800 dark:text-action-200">
            If you have pre-existing hours in your physical logbook from previous employment, you have two options to import them:
          </p>
          <div className="space-y-2 ml-4">
            <div className="flex items-start gap-2">
              <Camera className="w-4 h-4 text-action-600 dark:text-action-400 mt-0.5 shrink-0" />
              <span className="text-action-800 dark:text-action-200">
                <strong>Scan Your Logbook:</strong> Take photos of each page. Our OCR system extracts dates, hours, and task types automatically.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Plus className="w-4 h-4 text-action-600 dark:text-action-400 mt-0.5 shrink-0" />
              <span className="text-action-800 dark:text-action-200">
                <strong>Manual Entry:</strong> Enter your total baseline hours directly if you prefer not to scan individual pages.
              </span>
            </div>
          </div>
          <p className="text-action-800 dark:text-action-200">
            Access baseline hour entry from the "My Logged Hours" page. Once entered, these hours combine with your new logged sessions for accurate certification tracking.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</section>
```

---

## PART 6: ADD BEST PRACTICES SECTION

Add this section after Baseline Hours Entry:

```tsx
<Separator />

<section className="space-y-4">
  <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
    Best Practices
  </h2>

  <div className="grid md:grid-cols-2 gap-4">
    <Card className="border-emerald-200 dark:border-emerald-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Do
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <span>Log your hours the same day while tasks are fresh in memory</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <span>Deduct lunch, breaks, and non-rope time from your task hours</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <span>Build diverse task experience (rope transfers, rigging, rescue) for Level 3</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <span>Keep your physical logbook updated alongside digital records</span>
        </div>
      </CardContent>
    </Card>

    <Card className="border-red-200 dark:border-red-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-red-900 dark:text-red-100 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Don't
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <span>Log full shift hours as task hours (8hr shift ≠ 8hrs of tasks)</span>
        </div>
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <span>Wait weeks or months to catch up on logging</span>
        </div>
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <span>Log only "descending" if you're preparing for Level 3 assessment</span>
        </div>
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <span>Assume digital records replace your official paper logbook</span>
        </div>
      </CardContent>
    </Card>
  </div>
</section>
```

---

## PART 7: ADD FAQ SECTION

Add this section after Best Practices:

```tsx
<Separator />

<section className="space-y-4">
  <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
    <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
    Frequently Asked Questions
  </h2>

  <div className="space-y-4">
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2">Does this replace my physical IRATA/SPRAT logbook?</h3>
        <p className="text-sm text-muted-foreground">
          No. IRATA and SPRAT still require physical logbooks, and regulatory bodies like WorkSafeBC may request to see your written records. OnRopePro is a digital supplement that helps you maintain accurate records and never lose your hour history.
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2">What happens to my hours if I change employers?</h3>
        <p className="text-sm text-muted-foreground">
          Your IRATA/SPRAT hours belong to your technician profile, not your employer. When you move to a new company, your complete hour history comes with you—no re-entry required.
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2">Can I log hours if I'm not connected to an employer on the platform?</h3>
        <p className="text-sm text-muted-foreground">
          Yes. Independent technicians can manually log their hours and tasks. You can also scan your existing paper logbook to import historical data.
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2">How do I log training hours from external courses?</h3>
        <p className="text-sm text-muted-foreground">
          Training at IRATA/SPRAT schools counts as rope time. Use the manual entry feature to add training hours, specifying the training provider and skills practiced.
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2">What's the difference between shift hours and task hours?</h3>
        <p className="text-sm text-muted-foreground">
          Shift hours are your total time at work. Task hours are the actual time performing rope access activities. An 8-hour shift might only include 6-7 hours of actual rope work after breaks, travel, and ground prep. Log task hours, not shift hours.
        </p>
      </CardContent>
    </Card>
  </div>
</section>
```

---

## PART 8: UPDATE VERSION AND DATE

Change the version and date in the component props:

```tsx
<ChangelogGuideLayout 
  title="IRATA / SPRAT Task Logging Guide"
  version="3.0"
  lastUpdated="December 10, 2025"
>
```

---

## SUMMARY OF CHANGES

1. ✅ Removed "Assessment preparation" (didn't exist)
2. ✅ Updated "Certification progression tracking" to show it's coming soon
3. ✅ Fixed "Date range filtering" → "Date range export (PDF)"
4. ✅ Removed duplicate "Rope to Rope Transfer"
5. ✅ Added missing workflow step 2 (Confirm Logging)
6. ✅ Added critical disclaimer about physical logbook requirement
7. ✅ Added Key Features Summary section with OCR scanning highlight
8. ✅ Added hours allocation warning (task hours ≠ shift hours)
9. ✅ Updated Baseline Hours section to include OCR scanning option
10. ✅ Added Best Practices section (Do's and Don'ts)
11. ✅ Added FAQ section (5 questions)
12. ✅ Updated version to 3.0 and date to December 10, 2025

---

## IMPORTS NEEDED

Make sure these are all imported at the top:

```tsx
import { 
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  UserCheck,
  Award,
  Timer,
  ListChecks,
  FileText,
  TrendingUp,
  Calendar,
  Plus,
  History,
  Target,
  AlertTriangle,
  Info,
  BookOpen,
  Camera  // ADD THIS
} from "lucide-react";
```
