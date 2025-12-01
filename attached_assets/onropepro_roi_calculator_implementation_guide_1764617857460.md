# OnRopePro ROI Calculator - Implementation Guide
## Guided Pain Point Calculator for Landing Page

**Document Type:** Replit Implementation Prompt  
**Version:** 1.0  
**Date:** December 1, 2025  
**Target:** React/TypeScript on Replit.com

---

## Business Context

**Company:** OnRopePro - SaaS platform for rope access and building maintenance companies  
**Product:** All-in-one platform replacing 6-8 scattered tools  
**Pricing:** $499/month (Tier 2 Professional - most popular)  
**Target Users:** Building maintenance companies with 5-50 employees currently using multiple disconnected tools

**Value Proposition:** Replace time tracking + project management + CRM + scheduling + field service + document storage + safety compliance + employee database + support tickets + manual spreadsheets with ONE platform at $499/month.

---

## Calculator Objective

Build a **guided pain point calculator** that:
1. Asks 5-7 strategic questions about current processes
2. Reveals hidden costs users don't realize they're paying
3. Quantifies both direct tool costs AND indirect admin time waste
4. Shows dramatic ROI in real-time
5. Captures leads when savings are significant
6. Takes 60-90 seconds to complete (not too long to discourage engagement)

---

## Calculator Flow & Questions

### Question 1: Company Size
**Question:** "How many employees work in the field or office?"

**Input Type:** Slider (5-50 employees, default 12)

**Why This Matters:** Per-user pricing scales with team size. Most tools charge per seat.

**Calculation Impact:** Affects per-user tool costs

---

### Question 2: Time Tracking Method
**Question:** "How do you currently track employee hours for payroll?"

**Options:**
- Paper timesheets → **Hidden cost: $173/month** (7 hrs/month admin @ $50/hr × 26 pay periods / 12 months)
- Excel spreadsheets → **Hidden cost: $217/month** (manual entry + error correction)
- Time tracking software (ClockShark, TSheets, etc.) → **Direct cost: $60-96/month** for 12 users
- We don't track precisely → **Hidden cost: $350/month** (payroll errors averaging 15-25%)

**Reveal Message (for paper/Excel):**  
"Manual payroll processing costs **7 hours per pay period** (26 per year). That's **182 hours annually** worth **$9,100** in admin time alone—plus payroll errors averaging **$1,200-3,600/year**."

---

### Question 3: Project Management
**Question:** "How do you track which buildings/projects your teams are working on?"

**Options:**
- Whiteboard or paper → **Hidden cost: $278/month** (10 hrs/month coordination @ $50/hr)
- Excel/Google Sheets → **Hidden cost: $208/month** (7.5 hrs/month updates)
- Project management software (Asana, Monday.com, etc.) → **Direct cost: $120-192/month** for 12 users
- Group texts and phone calls → **Hidden cost: $347/month** (constant interruptions, no records)

**Reveal Message (for whiteboard/paper):**  
"Without centralized project tracking, managers spend **10+ hours weekly** coordinating teams, finding project details, and answering 'where should I go?' questions. That's **520 hours/year** worth **$26,000** in wasted coordination time."

---

### Question 4: Client Communication
**Question:** "How do you manage client relationships and track communication history?"

**Options:**
- Email inbox only → **Hidden cost: $417/month** (lost opportunities, 15 hrs/month searching)
- Spreadsheet of contacts → **Hidden cost: $278/month** (10 hrs/month maintaining)
- CRM software (Pipedrive, HubSpot, etc.) → **Direct cost: $180-600/month** for 12 users
- Memory and paper notes → **Hidden cost: $556/month** (missed follow-ups, lost contracts)

**Reveal Message (for email/spreadsheet):**  
"Without CRM, you're losing **3-5 contracts per year** to missed follow-ups and poor contact management. That's **$25,000-40,000** in annual lost revenue opportunity."

---

### Question 5: Safety Compliance Documentation
**Question:** "How do you document daily harness inspections and safety meetings (IRATA/SPRAT compliance)?"

**Options:**
- Paper forms filed in office → **Hidden cost: $125/month** (4.5 hrs/month filing + retrieval)
- Nothing formal (risk!) → **Hidden cost: $208/month** (insurance premium increase 10-20% = ~$2,500/year)
- Digital safety app (SafetyCulture, etc.) → **Direct cost: $29-99/month**
- Photos on phones → **Hidden cost: $139/month** (lost documentation, 5 hrs/month organizing)

**Reveal Message (for paper forms):**  
"Paper safety forms get lost, damaged, or are unavailable during audits. Companies with digital compliance save **10-20% on insurance premiums** (average **$2,500/year**) and avoid **$15,625 OSHA penalties** for missing documentation."

---

### Question 6: Scheduling & Coordination
**Question:** "How do you schedule which technicians work on which projects each day?"

**Options:**
- Phone calls each morning → **Hidden cost: $347/month** (12.5 hrs/month @ $50/hr)
- Excel schedule updated daily → **Hidden cost: $278/month** (10 hrs/month)
- Scheduling software (Deputy, When I Work, etc.) → **Direct cost: $60-96/month** for 12 users
- Verbal assignments day-by-day → **Hidden cost: $417/month** (15 hrs/month + missed assignments)

**Reveal Message (for manual methods):**  
"Manual scheduling creates **double-booking conflicts, missed job assignments, and constant phone interruptions**. You're spending **5+ hours per week** just coordinating who goes where. That's **260 hours/year** worth **$13,000**."

---

### Question 7: Document Storage & Retrieval
**Question:** "Where do you store project photos, rope access plans, and client contracts?"

**Options:**
- Filing cabinets and desk drawers → **Hidden cost: $156/month** (5.5 hrs/month finding documents)
- Personal computer folders → **Hidden cost: $208/month** (lost files, no backup, 7.5 hrs/month)
- Cloud storage (Dropbox, Google Drive, etc.) → **Direct cost: $10-20/month**
- Mix of physical and digital → **Hidden cost: $278/month** (10 hrs/month searching multiple places)

**Reveal Message (for physical storage):**  
"When insurance auditors or clients ask for documents, can you find them in **5 minutes or 45 minutes**? Lost time searching for rope access plans, safety certificates, and project photos costs **6.5 hours/month** (**78 hours/year = $3,900**)."

---

## Calculation Logic

### Direct Tool Costs (Monthly)
```
timeTrackingCost = selectedOption === 'software' ? (employeeCount * $6) : $0
projectManagementCost = selectedOption === 'software' ? (employeeCount * $12) : $0
crmCost = selectedOption === 'software' ? (employeeCount * $20) : $0
safetyComplianceCost = selectedOption === 'software' ? $65 : $0
schedulingCost = selectedOption === 'software' ? (employeeCount * $6) : $0
documentStorageCost = selectedOption === 'software' ? $15 : $0

totalDirectToolCosts = sum of above
```

### Hidden Admin Costs (Monthly)
```
timeTrackingHiddenCost = based on selected option (paper: $173, Excel: $217, none: $350, software: $0)
projectManagementHiddenCost = based on selection (whiteboard: $278, Excel: $208, texts: $347, software: $0)
crmHiddenCost = based on selection (email: $417, spreadsheet: $278, memory: $556, software: $0)
safetyComplianceHiddenCost = based on selection (paper: $125, none: $208, photos: $139, software: $0)
schedulingHiddenCost = based on selection (calls: $347, Excel: $278, verbal: $417, software: $0)
documentStorageHiddenCost = based on selection (filing: $156, computer: $208, mix: $278, cloud: $0)

totalHiddenCosts = sum of above
```

### Total Current Spending
```
totalCurrentSpending = totalDirectToolCosts + totalHiddenCosts
```

### OnRopePro Cost
```
onropeproCost = $499/month (fixed - Tier 2 Professional)
```

### Savings Calculation
```
monthlySavings = totalCurrentSpending - onropeproCost
annualSavings = monthlySavings × 12
roi = (monthlySavings / onropeproCost) × 100
```

### Time Savings Calculation
```
hoursRecoveredMonthly = sum of all hidden cost hours from selections
hoursRecoveredAnnually = hoursRecoveredMonthly × 12
valueOfTimeRecovered = hoursRecoveredAnnually × $50/hr
```

---

## UI/UX Requirements

### Visual Design Principles

1. **Progressive Disclosure:** Show one question at a time with smooth transitions
2. **Real-Time Preview:** Small sidebar/card showing "Current Waste" updating as they answer
3. **Color Psychology:**
   - Red for waste/costs
   - Yellow/orange for warnings
   - Green for savings
   - Blue for OnRopePro solution
4. **Celebration Moments:** Confetti or animation when savings exceed $10,000/year
5. **Mobile-First:** Must work perfectly on smartphones (rope access owners often on-site)

### Question Screen Layout

```
[Progress Bar: Question 3 of 7]

[Large Question Text]
"How do you track which buildings/projects your teams are working on?"

[Radio Buttons with Icons]
○ Whiteboard or paper
○ Excel/Google Sheets  
○ Project management software (Asana, Monday.com, etc.)
○ Group texts and phone calls

[Next Button - only enabled after selection]

[Small Preview Card - Bottom Right]
Current Monthly Waste: $847
OnRopePro: $499
Potential Savings: $348/mo
```

### Results Screen Layout

```
[Large Headline]
You're Wasting $1,847 Per Month

[Three-Column Comparison]

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│   Current Costs     │  │   OnRopePro         │  │   Your Savings      │
│   (RED BACKGROUND)  │  │   (BLUE BACKGROUND) │  │   (GREEN BACKGROUND)│
├─────────────────────┤  ├─────────────────────┤  ├─────────────────────┤
│ Direct Tool Costs:  │  │ All-in-One Platform │  │ Monthly: $1,348     │
│ $612/month          │  │ $499/month          │  │                     │
│                     │  │                     │  │ Annually: $16,176   │
│ Hidden Admin Waste: │  │ Includes:           │  │                     │
│ $1,235/month        │  │ • Time Tracking     │  │ ROI: 270%           │
│                     │  │ • Project Mgmt      │  │                     │
│ Total: $1,847/month │  │ • CRM               │  │ Time Recovered:     │
│                     │  │ • Safety Compliance │  │ 32 hours/month      │
│                     │  │ • Scheduling        │  │ (384 hrs/year)      │
│                     │  │ • Document Storage  │  │                     │
│                     │  │ • Payroll Export    │  │ Value: $19,200/year │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘

[Breakdown Section - Expandable]
"Show me the detailed breakdown ▼"

When expanded, shows question-by-question costs:
- Time Tracking (Paper timesheets): $173/month hidden cost
- Project Management (Whiteboard): $278/month hidden cost
- Client Communication (Email only): $417/month hidden cost
- Safety Compliance (Paper forms): $125/month hidden cost
- Scheduling (Phone calls): $347/month hidden cost
- Document Storage (Filing cabinets): $156/month hidden cost

[Two CTAs]
[Start Free Trial - 90 Days] [Email Me This Analysis]
```

---

## Technical Implementation Notes

### React Component Structure

```
ROICalculator/
├── ROICalculator.tsx (main container)
├── QuestionFlow.tsx (question progression logic)
├── Question.tsx (individual question component)
├── ResultsDisplay.tsx (final savings calculation)
├── BreakdownTable.tsx (detailed cost breakdown)
├── ProgressBar.tsx (7-step progress indicator)
└── types.ts (TypeScript interfaces)
```

### Key State Management

```typescript
interface CalculatorState {
  currentStep: number; // 1-7 for questions, 8 for results
  employeeCount: number; // default 12
  answers: {
    timeTracking: 'paper' | 'excel' | 'software' | 'none';
    projectManagement: 'whiteboard' | 'excel' | 'software' | 'texts';
    crm: 'email' | 'spreadsheet' | 'software' | 'memory';
    safetyCompliance: 'paper' | 'none' | 'software' | 'photos';
    scheduling: 'calls' | 'excel' | 'software' | 'verbal';
    documentStorage: 'filing' | 'computer' | 'cloud' | 'mix';
  };
  calculations: {
    totalDirectCosts: number;
    totalHiddenCosts: number;
    totalCurrentSpending: number;
    monthlySavings: number;
    annualSavings: number;
    roi: number;
    hoursRecovered: number;
    valueOfTimeRecovered: number;
  };
}
```

### Animation Requirements

- Smooth question transitions (slide left/right, fade)
- Number count-up animations on results screen
- Progress bar fills smoothly
- "Reveal message" fades in when hidden costs are selected
- Confetti effect when annual savings > $10,000

---

## Cost Database (Placeholder - Update with Research)

```typescript
const TOOL_COSTS = {
  timeTracking: {
    software: { perUser: 6, base: 0 }, // ClockShark, TSheets
    paper: { hidden: 173 },
    excel: { hidden: 217 },
    none: { hidden: 350 }
  },
  projectManagement: {
    software: { perUser: 12, base: 0 }, // Monday.com, Asana
    whiteboard: { hidden: 278 },
    excel: { hidden: 208 },
    texts: { hidden: 347 }
  },
  crm: {
    software: { perUser: 20, base: 0 }, // Pipedrive, HubSpot
    email: { hidden: 417 },
    spreadsheet: { hidden: 278 },
    memory: { hidden: 556 }
  },
  safetyCompliance: {
    software: { perUser: 0, base: 65 }, // SafetyCulture
    paper: { hidden: 125 },
    none: { hidden: 208 },
    photos: { hidden: 139 }
  },
  scheduling: {
    software: { perUser: 6, base: 0 }, // Deputy, When I Work
    calls: { hidden: 347 },
    excel: { hidden: 278 },
    verbal: { hidden: 417 }
  },
  documentStorage: {
    cloud: { perUser: 0, base: 15 }, // Dropbox Business
    filing: { hidden: 156 },
    computer: { hidden: 208 },
    mix: { hidden: 278 }
  }
};
```

---

## Lead Capture Integration

When user completes calculator and savings > $5,000/year:

**Modal appears:**

```
🎉 You could save $16,176 per year!

[Email input field]
"Email me this analysis + free OnRopePro demo"

[Send My Analysis Button]

Small print: "We'll send your personalized ROI report and show you 
how companies like yours eliminate 32+ hours of admin work monthly."
```

**Email sent should include:**
- PDF summary of their specific answers and costs
- Link to book 15-minute demo
- 3 case study examples from similar-sized companies
- Direct contact info for sales team

---

## Embedded Location on Landing Page

**Placement:** Homepage, above the fold (or as second section after hero)

**Context Setup:**

```
[Hero Section]
"Stop Losing Money on Scattered Tools"

[ROI Calculator Section]
"Calculate Your Hidden Costs in 60 Seconds"

Most rope access companies waste $15,000-25,000 per year on 
scattered tools, manual processes, and hidden admin time.

[Calculator Launches Here - Either inline or modal]

[Below Calculator]
"Join 35+ rope access companies who recovered 20+ hours/week 
and $1,000+/month by consolidating to OnRopePro."
```

---

## Success Metrics to Track

1. **Completion Rate:** What % of users who start finish all 7 questions?
2. **Average Savings Shown:** Median savings amount calculated
3. **Email Capture Rate:** What % submit email on results screen?
4. **Trial Conversions:** Do calculator users convert better than non-calculator visitors?
5. **Drop-Off Points:** Which question has highest abandonment?

---

## Edge Cases to Handle

1. **Zero savings scenario:** If selections result in OnRopePro costing MORE
   - Message: "Based on your current setup, OnRopePro may not provide immediate cost savings. However, you'd gain: [list non-cost benefits like safety compliance, professionalism, scalability]"

2. **All software selections:** If they already use all software tools
   - Message: "You're already investing in digital tools ($X/month). OnRopePro consolidates these 6-8 separate systems into ONE platform for $499/month, eliminating tool-switching friction and data silos."

3. **Very small teams (<8 employees):** 
   - Recommend Tier 1 ($299/month) instead of Tier 2
   - Recalculate savings accordingly

---

## Final Implementation Checklist

- [ ] Build 7-question flow with state management
- [ ] Implement calculation engine with all cost formulas
- [ ] Create results visualization (3-column comparison)
- [ ] Add expandable breakdown table
- [ ] Implement progress bar (1 of 7, 2 of 7, etc.)
- [ ] Add "reveal message" tooltips for hidden costs
- [ ] Build email capture modal
- [ ] Add count-up number animations
- [ ] Test on mobile (touch-friendly, fast loading)
- [ ] Add confetti effect for high savings
- [ ] Integrate with email service (SendGrid, Mailchimp)
- [ ] Add analytics tracking (Google Analytics events)
- [ ] Test edge cases (zero savings, all software, small teams)
- [ ] Optimize load time (<2 seconds)
- [ ] A/B test placement (inline vs. modal)

---

**END OF IMPLEMENTATION GUIDE**

**Next Step:** Import this document into Replit and begin building the React/TypeScript calculator component. Update TOOL_COSTS object with actual competitor pricing once research is complete.
