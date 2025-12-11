# OnRopePro Changelog/Guide Document Skeleton

This document serves as the definitive template for all changelog and guide documentation pages. These documents are the **single source of truth** for OnRopePro features. All other pages (landing, knowledgebase, FAQ, marketing) will be built using information from these guides.

**All information must be 100% accurate.**

---

## Document Metadata

```tsx
<ChangelogGuideLayout 
  title="[Module Name] Guide"
  version="X.X"
  lastUpdated="Month DD, YYYY"
>
```

---

## Required Sections (In Order)

### 1. Introduction Paragraph(s)
Brief overview of what the module does and why it matters. 1-2 paragraphs.

**Pattern:**
```tsx
<section className="space-y-4">
  <p className="text-muted-foreground leading-relaxed text-base">
    [Overview of the module's purpose and core functionality]
  </p>
</section>
```

---

### 2. The Golden Rule (Amber Card)
The single most important concept users must understand about this module. Uses amber/gold styling to emphasize importance.

**Pattern:**
```tsx
<Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
  <CardHeader className="pb-2">
    <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
      <Key className="w-5 h-5" />
      The Golden Rule: [Core Principle in 3-6 Words]
    </CardTitle>
  </CardHeader>
  <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
    <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
      <p className="text-xl md:text-2xl font-mono font-bold">
        [Formula or Key Statement]
      </p>
    </div>
    
    <div className="space-y-2 text-base">
      <p><strong>Key Principles:</strong></p>
      <ul className="list-disc list-inside space-y-1 ml-2">
        <li>[Principle 1]</li>
        <li>[Principle 2]</li>
        <li>[Principle 3]</li>
      </ul>
    </div>

    <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
      <p className="font-semibold flex items-center gap-2">
        <Info className="w-4 h-4" />
        [Callout Title]
      </p>
      <p className="mt-1">[Important clarification or edge case]</p>
    </div>
  </CardContent>
</Card>
```

---

### 3. Critical Disclaimer (If Applicable)
Red-styled warning card for legal/compliance disclaimers. Only include if the module has regulatory implications.

**Pattern:**
```tsx
<Card className="border-2 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950">
  <CardContent className="pt-6">
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
      <div className="space-y-2">
        <p className="font-bold text-red-900 dark:text-red-100 text-lg">
          Important: [Warning Title]
        </p>
        <p className="text-red-800 dark:text-red-200 text-sm">
          [Detailed warning explanation]
        </p>
      </div>
    </div>
  </CardContent>
</Card>
```

---

### 4. Key Features (6 Features, 2-Column Grid)
Highlight the 6 most important features with colored icon badges.

**Icon Badge Colors (rotate through):**
- Purple: `bg-purple-100 dark:bg-purple-900` / `text-purple-600 dark:text-purple-400`
- Emerald: `bg-emerald-100 dark:bg-emerald-900` / `text-emerald-600 dark:text-emerald-400`
- Action: `bg-action-100 dark:bg-action-900` / `text-action-600 dark:text-action-400`
- Amber: `bg-amber-100 dark:bg-amber-900` / `text-amber-600 dark:text-amber-400`
- Indigo: `bg-indigo-100 dark:bg-indigo-900` / `text-indigo-600 dark:text-indigo-400`
- Rose: `bg-rose-100 dark:bg-rose-900` / `text-rose-600 dark:text-rose-400`

**Pattern:**
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
            <[Icon] className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold">[Feature Name]</h3>
            <p className="text-sm text-muted-foreground mt-1">
              [Feature description in 1-2 sentences]
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    {/* Repeat for 6 features total */}
  </div>
</section>
```

---

### 5. Problems Solved (Accordion-Based, Stakeholder Segmented)
Real challenges addressed by this module, organized by user type.

**Stakeholder Section Icons:**
- Company Owners: `Crown` (amber-500)
- Operations/Supervisors: `Briefcase` (action-500)
- Building Managers: `Building2` (violet-500)
- Residents: `Home` (rose-500)
- Technicians: `UserCheck` or `HardHat` (purple-500)

**Header Pattern (Title + Expand All on same row):**
```tsx
<section className="space-y-8">
  <div>
    <div className="flex items-center justify-between flex-wrap gap-4">
      <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        Problems Solved
      </h2>
      <Button onClick={toggleAll} variant="outline" data-testid="button-toggle-all-accordions">
        <ChevronsUpDown className="w-4 h-4 mr-2" />
        {allExpanded ? "Collapse All" : "Expand All"}
      </Button>
    </div>
    <p className="text-muted-foreground mt-2">
      [Brief description of who benefits and how]
    </p>
  </div>
```

**Stakeholder Group Pattern:**
```tsx
<div className="space-y-4">
  <div className="flex items-center gap-3 pb-2 border-b">
    <Crown className="w-5 h-5 text-amber-500" />
    <h3 className="text-xl md:text-2xl font-semibold">For [Stakeholder Type]</h3>
  </div>
  
  <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
    <AccordionItem value="[unique-id]" className="border rounded-lg px-4" data-testid="accordion-[id]">
      <AccordionTrigger className="text-left">
        <span className="font-medium">"[Problem statement as quote]"</span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">The Pain:</span> [Emotional/practical problem description]
        </p>
        <div className="bg-muted/50 rounded p-3 border-l-2 border-[stakeholder-color]-300">
          <p className="text-xs text-muted-foreground mb-1">Real Example:</p>
          <p className="italic text-sm">"[Direct quote from user interviews]"</p>
        </div>
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">Solution:</span> [How the feature solves it]
        </p>
        <p className="text-emerald-700 dark:text-emerald-400">
          <span className="font-medium">Benefit:</span> [Quantifiable improvement with metrics when possible]
        </p>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</div>
```

---

### 6. How It Works / Workflow Steps
Step-by-step explanation of the core workflow.

**Pattern:**
```tsx
<section className="space-y-4">
  <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
    <Timer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
    How [Feature] Works
  </h2>

  <div className="space-y-4">
    <Card className="bg-muted/30">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0">
            1
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-semibold">[Step Title]</h3>
            <p className="text-sm text-muted-foreground mt-1">[Step description]</p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <div className="flex justify-center">
      <ArrowRight className="w-5 h-5 text-muted-foreground" />
    </div>
    
    {/* Repeat for each step */}
  </div>
</section>
```

---

### 7. Module-Specific Content Sections
Include any content specific to this module:
- Task types / categories
- Tracking methods
- Role/permission tables
- Terminology definitions
- Visual diagrams

---

### 8. Module Integration Points
How this module connects with other OnRopePro modules.

**Pattern:**
```tsx
<section className="space-y-6">
  <div>
    <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
      <Layers className="w-6 h-6 text-violet-600 dark:text-violet-400" />
      Module Integration Points
    </h2>
    <p className="text-muted-foreground leading-relaxed text-base">
      [Brief description of how this module connects to others]
    </p>
  </div>

  <Card className="bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800 mb-4">
    <CardContent className="pt-6">
      <p className="italic">"[Philosophy quote about integration]"</p>
      <p className="text-sm font-medium mt-2 text-muted-foreground">, [Attribution]</p>
    </CardContent>
  </Card>

  <div className="grid gap-4 md:grid-cols-2">
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <[Icon] className="w-5 h-5 text-violet-600" />
          <CardTitle className="text-base">[Module Name]</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">[Integration description]</p>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="font-medium">[Quantified benefit]</span>
        </div>
      </CardContent>
    </Card>
    {/* Repeat for 6 integrations */}
  </div>
</section>
```

**Common Integration Modules:**
1. Employee Management
2. Payroll & Time Tracking
3. Safety & Compliance
4. Scheduling & Calendar
5. Feedback Management
6. Analytics & Reporting

---

### 9. Best Practices (Do / Don't Cards)

**Pattern:**
```tsx
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
          <span>[Best practice 1]</span>
        </div>
        {/* Repeat for 4-5 items */}
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
          <span>[Anti-pattern 1]</span>
        </div>
        {/* Repeat for 4-5 items */}
      </CardContent>
    </Card>
  </div>
</section>
```

---

### 10. FAQ Section
Common questions and answers.

**Pattern:**
```tsx
<section className="space-y-4">
  <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
    <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
    Frequently Asked Questions
  </h2>

  <div className="space-y-4">
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2">[Question]?</h3>
        <p className="text-sm text-muted-foreground">[Answer]</p>
      </CardContent>
    </Card>
    {/* Repeat for 4-6 questions */}
  </div>
</section>
```

---

### 11. Quick Reference Table
Summary table of key features/access points.

**Pattern:**
```tsx
<section className="space-y-4">
  <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
    Quick Reference
  </h2>

  <Card>
    <CardContent className="pt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-semibold">Feature</th>
              <th className="text-left py-2 font-semibold">Description</th>
              <th className="text-left py-2 font-semibold">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="py-2">[Feature name]</td>
              <td className="py-2 text-muted-foreground">[Brief description]</td>
              <td className="py-2"><Badge variant="outline">[Access point]</Badge></td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</section>
```

---

## Section Checklist

Use this checklist when creating a new guide:

- [ ] Introduction paragraph(s)
- [ ] The Golden Rule (amber card)
- [ ] Critical Disclaimer (if applicable)
- [ ] Key Features (6 features, 2-column grid)
- [ ] Problems Solved (accordion-based, stakeholder segmented)
- [ ] How It Works / Workflow Steps
- [ ] Module-Specific Content
- [ ] Module Integration Points (6 integrations)
- [ ] Best Practices (Do/Don't cards)
- [ ] FAQ Section (4-6 questions)
- [ ] Quick Reference Table

---

## Writing Guidelines

### Content Rules
1. **No em-dashes.** Use commas or natural connectors instead.
2. **No emojis.** Use Lucide icons instead.
3. **Quantify benefits.** Include specific percentages and time savings (e.g., "87-93% error reduction", "5-10 hours/week saved").
4. **Use real quotes.** Problems Solved examples should include direct quotes from user interviews when available.
5. **Be stakeholder-specific.** Segment content by user type (owners, managers, technicians, residents).

### Accuracy Requirements
- These documents are the **single source of truth**
- All feature descriptions must match actual product behavior
- Mark features as "Coming Soon" if not yet implemented
- Never include features that don't exist

### State Management for Accordions
```tsx
const ALL_ACCORDION_ITEMS = [
  "owner-1", "owner-2", // etc
];

const [openItems, setOpenItems] = useState<string[]>([]);
const allExpanded = openItems.length === ALL_ACCORDION_ITEMS.length;

const toggleAll = () => {
  setOpenItems(allExpanded ? [] : [...ALL_ACCORDION_ITEMS]);
};
```

---

## Required Imports

```tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  // Core icons (adjust per module)
  Key,
  Info,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Layers,
  ChevronsUpDown,
  // Stakeholder icons
  Crown,
  Briefcase,
  Building2,
  Home,
  UserCheck,
  HardHat,
  // Module-specific icons as needed
} from "lucide-react";
```
