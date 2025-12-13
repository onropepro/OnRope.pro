# SCR Rating System

## GOLDEN RULES - MANDATORY FOR ALL DEVELOPMENT

### Rule 1: Complete Testing Before Proceeding
**Every step MUST be tested and working 100% before moving to the next step. No exceptions.**

Before proceeding to the next step of the build, the following must be verified:
- Backend code reviewed and working
- Frontend code reviewed and working
- Database schema correct and all tables created and available
- Routes tested and functional
- No LSP errors
- API wording correct
- API calls returning correct data
- Every endpoint tested

This rule applies between EACH step of the build. No exception will be acceptable.

### Rule 2: Stay Within Scope
- Do NOT wander away doing things that were not asked
- Do NOT freelance or add extra features
- Do NOT assume - ask if unclear
- Do NOT touch code that does not need to be touched
- Do NOT add functions that were not asked to be added
- Do NOT alter any other function or feature of the app unless approved by the user

---

## Harness Inspection Points

1 point will be awarded per project completed for harness inspection completed for every work session.

If there are 10 work sessions and only 8 harness inspections completed for the project, then the SCR is awarded 0.8 points.

Formula: Points = (Completed Harness Inspections / Total Work Sessions) per project

---

## Project Documentation Points

1 point will be awarded per project with all required documents uploaded. Partial credit is proportional.

Example: 2 out of 4 docs uploaded = 0.5 points

### Elevation/Rope Access Projects (4 documents required)
- Rope Access Plan
- Anchor Inspection
- Toolbox Meeting
- FLHA

### Non-Elevation Projects (2 documents required)
- Toolbox Meeting
- FLHA

Note: Projects that do not require anchor use and rope access work do NOT need Rope Access Plan and Anchor Inspection documents. These projects earn 1 point for having Toolbox Meeting and FLHA completed.

Formula: Points = (Uploaded Required Documents / Total Required Documents) per project

---

## Company Documentation Points

1 point will be awarded if all 3 documents are uploaded.

### Required Documents (3 total)
- Health and Safety Manual
- Company Policy
- Certificate of Insurance

Example: 1 out of 3 docs uploaded = 0.33 points

Formula: Points = (Uploaded Documents / 3)

---

## Employee Document Review Points

1 point will be awarded to the SCR for each employee that has viewed and signed company documents, safe work procedures, and safe work practices.

The calculation is based on the documents actually uploaded by the company.

Example: If a company has only 2 out of 3 documents uploaded, and an employee views and signs both documents, that employee has signed 100% of available documents. The SCR is awarded 1 point for that employee.

Formula: SCR Points per employee = (Documents Signed by Employee / Documents Uploaded by Company)

### Document Update Policy

When a company updates or replaces a document:
- Employees have a **14-day grace period** to re-sign the updated document
- During the grace period, existing points are preserved
- After 14 days, if the employee has not signed the updated document, the SCR loses the proportional points for that employee until they sign

### New Document Policy

When a company adds a NEW safe work practice or safe work procedure:
- Employees have a **14-day grace period** to sign the new document
- During the grace period, existing points are preserved (the new document is not counted in the ratio)
- After 14 days, the new document is included in the calculation
- If the employee has not signed the new document, their ratio decreases and the SCR loses proportional points

Example:
- Company had 2 documents, employee signed both = 1 point (2/2)
- Company adds a new document (day 1-14): employee still has 1 point (grace period)
- After 14 days: employee has signed 2 of 3 documents = 0.67 points

---

## Display Format (Percentage-Based Rating)

### The Fairness Problem
Raw point totals are inherently unfair when comparing companies of different sizes:
- A 100-employee company can accumulate 1000+ points
- A 3-employee company might only earn ~10 points
- Raw point comparison would unfairly favor larger companies regardless of actual compliance

### Solution: Percentage-Based Rating
Display CSR as a **percentage** instead of raw points for BOTH:
- **Property Managers** - See vendor safety ratings as percentages
- **Company Owners** - See their own company rating as a percentage

### Calculation Formula
```
CSR Rating (%) = (Points Earned / Maximum Possible Points) × 100
```

### Maximum Possible Points Calculation
For each company, calculate the theoretical maximum points they could earn:

| Category | Max Points Formula |
|----------|-------------------|
| Harness Inspections | 1 point per completed project (assuming 100% inspection compliance) |
| Project Documentation | 1 point per project (assuming all required docs uploaded) |
| Company Documentation | 1 point (all 3 docs uploaded) |
| Employee Document Review | 1 point per employee (assuming all employees signed all docs) |

**Total Max Points = (Completed Projects × 2) + 1 + Employee Count**

### Example Comparison
| Company | Points Earned | Max Possible | CSR Rating |
|---------|---------------|--------------|------------|
| Small Co (3 employees, 2 projects) | 8 | 10 | **80%** |
| Big Corp (100 employees, 50 projects) | 120 | 201 | **60%** |

Despite Small Co having far fewer raw points, their **higher compliance rate** is correctly reflected in the percentage.

### Display Rules
- Round to nearest whole percentage (no decimals)
- Show as "XX%" format
- Include color coding:
  - 90-100%: Green (Excellent)
  - 70-89%: Yellow (Good)
  - 50-69%: Orange (Needs Improvement)
  - Below 50%: Red (Poor)

### API Response Format
Both company owner and property manager endpoints return:
```json
{
  "csrRating": 83,
  "csrLabel": "Good",
  "csrColor": "yellow",
  "breakdown": {
    "harnessInspection": { "earned": 1.8, "max": 2 },
    "projectDocumentation": { "earned": 1.5, "max": 2 },
    "companyDocumentation": { "earned": 1, "max": 1 },
    "employeeDocumentReview": { "earned": 2.5, "max": 3 }
  },
  "totalEarned": 6.8,
  "totalMax": 8
}
```

---

## Implementation Requirements

### Database Schema Updates
- Add version tracking to company documents (track when uploaded/updated)
- Store `graceEndsAt` date (upload date + 14 days) for each document version
- When a document is updated, old signatures are marked obsolete
- All timestamps stored in UTC to avoid timezone issues

### Calculation Safeguards
- Guard against division by zero (0 sessions = 0 points, not an error)
- Handle floating-point precision to avoid rounding issues
- Build reusable calculation functions for each category

### Edge Cases to Handle
- Companies with no projects = 0 points (not an error)
- Companies with no employees = 0 points
- Non-elevation projects receiving extra docs = ignored in calculation
- Terminated employees = excluded from count
- Documents deleted during grace period = remove from requirements

### Testing Strategy
- Test each category separately with different scenarios:
  - Full compliance (100%)
  - Partial compliance (50%)
  - Zero data (no projects/employees)
  - Grace period active vs expired
  - Multiple document updates

### Grace Period Logic
- Automatic daily check using current UTC date
- Documents within 14-day window not counted in denominator
- After 14 days, included automatically in calculation
