# Replit Agent Prompt: Safety & Compliance Guide Changelog Updates

## Task Overview
Update the Safety & Compliance Guide changelog page (`SafetyGuide.tsx`) to fix inaccuracies discovered during technical review with the developer. Several sections contain fabricated features or incorrect information that must be corrected.

---

## CRITICAL CHANGES REQUIRED

### 1. DELETE the "7-Day Toolbox Meeting Coverage Window" Section

**Location:** The entire section starting with `{/* 7-Day Coverage Window */}` (approximately lines 233-278)

**Why:** This feature does not exist in the codebase. The 7-day retroactive/forward coverage concept was invented documentation with no implementation. Developer confirmed: "That is not... it doesn't cover any more days."

**Replace with this new section titled "Toolbox Meetings: Daily Safety Briefings":**

Content for the replacement section:
- Toolbox meetings are available in every project
- Can be created as many times as needed per day  
- Should be completed at least once daily for every active job
- Must be redone whenever conditions change (weather shift, location change, new hazards, equipment changes)
- Different safety topics can be covered each day (PPE, rope inspection, weather precautions, emergency procedures, etc.)
- Anyone with project access can create a toolbox meeting
- All selected attendees must sign before submission
- Each meeting is timestamped and tied to the specific project

Use a blue-themed card similar to the existing documentation styling.

---

### 2. UPDATE the Golden Rule Section

**Location:** The section starting with `{/* THE GOLDEN RULE */}` (approximately lines 54-104)

**Current Problem:** The Golden Rule focuses only on harness inspection, but this Safety & Compliance page needs a broader safety-focused golden rule. 

**Replace with new Golden Rule:**

**Title:** "The Golden Rule: Complete Safety Documentation"

**Banner/Subtitle:** "No Documentation Gaps"

**Content:**
- Every work session requires supporting safety documentation
- System tracks compliance across three key areas:
  1. **Harness Inspections** - Daily equipment verification before work begins
  2. **Toolbox Meetings** - Daily team safety briefings for each project
  3. **Company Documentation** - Health & Safety Manual, Company Policy, Certificate of Insurance
- Missing documentation creates gaps visible in your Company Safety Rating
- Property managers can view your compliance status

**Keep the visual styling** (amber/warning themed card) but update the messaging to be about complete safety documentation rather than just harness inspection.

---

### 3. REMOVE "7-Day Coverage Window" from Key Features Summary

**Location:** In the Key Features Summary section, find the item with Calendar icon showing "7-Day Coverage Window"

**Action:** Delete this feature entirely from the summary grid. Do not replace it - just remove it.

---

### 4. FIX the Client Audit Requests in Problems Solved

**Location:** Problems Solved section, the item about "Client audit requests"

**Current text mentions:** "IRATA, OSHA, and insurance requirements"

**Change to:** "OSHA and insurance requirements"

**Why:** IRATA does not request operational safety documentation - they only review logbooks during certification exams. Remove IRATA from this line.

---

### 5. UPDATE White-Label Branding Feature

**Location:** Key Features Summary section, the item about "White-Label Branding"

**Current text:** "Company name appears on PDF headers when branding active."

**Change to:** Add "(Coming Soon)" badge or indicator. The feature is planned but not yet implemented.

**New text:** "Company logo and name on PDF headers when white-label branding is active. *(Coming Soon)*"

---

### 6. ADD Equipment Auto-Retirement Note to Harness Inspection Section

**Location:** In the Five Safety Document Types section, under "1. Harness Inspection"

**Add this information** (can be a small info callout or added to the content):

"When equipment is marked as FAIL during inspection, it is automatically tagged as retired in the Inventory module. Failed equipment cannot be selected for future inspections until reviewed and cleared."

---

### 7. ADD Speed Clarification to Harness Inspection

**Location:** Same section - Harness Inspection under Five Safety Document Types

**Add this note** to address employer concerns about time:

"For routine passing inspections, completion takes seconds - the form defaults to PASS and technicians simply scroll and submit. Only failed items require detailed notes."

---

### 8. UPDATE FLHA Status (Mark as Upcoming Change)

**Location:** Five Safety Document Types section, "3. FLHA (Field Level Hazard Assessment)"

**Current:** Shows "Optional" badge and "Does not directly impact CSR"

**Add a note or secondary badge:** "(Daily requirement coming soon)"

This signals that FLHA will become mandatory and impact CSR in a future update.

---

### 9. UPDATE Toolbox Meeting Description in Five Safety Document Types

**Location:** Five Safety Document Types section, "2. Toolbox Meeting"

**Remove:** The badge showing "7-Day Coverage" 

**Replace badge with:** "Daily Required" or "Per Project Daily"

**Update the content** to reflect:
- One meeting should be held daily per active project
- Additional meetings required when conditions change
- Covers safety topics relevant to that day's work

---

## SUMMARY CHECKLIST

- [ ] Delete 7-Day Coverage Window section entirely
- [ ] Replace with "Toolbox Meetings: Daily Safety Briefings" section
- [ ] Update Golden Rule to focus on complete safety documentation (not just harness)
- [ ] Remove 7-Day Coverage from Key Features Summary
- [ ] Remove "IRATA" from client audit requests text
- [ ] Add "Coming Soon" to White-Label Branding feature
- [ ] Add auto-retirement note to Harness Inspection
- [ ] Add speed clarification to Harness Inspection  
- [ ] Add "coming soon" note to FLHA about becoming mandatory
- [ ] Update Toolbox Meeting badges (remove 7-day, add daily required)

---

## IMPORTANT NOTES

- Maintain existing visual styling and component structure
- Keep all imports and layout components unchanged
- Only modify content as specified above
- The CSR (Company Safety Rating) breakdown can remain - we have a separate dedicated page but overview here is fine
- Test that all links in Quick Links section still work after changes
