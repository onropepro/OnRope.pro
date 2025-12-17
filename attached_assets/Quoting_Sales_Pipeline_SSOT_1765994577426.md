# Module - Quoting & Sales Pipeline Overview

**Version:** 1.0 - Single Source of Truth  
**Last Updated:** December 16, 2025  
**Status:** Validated from Tommy/Glenn Conversation Transcript (Dec 16, 2025)

---

## The Golden Rule

> **Configure Before Pricing: Total Cost = Hours x Rate + Service Fees**

### Pricing Models by Service Type

| Service Type | Pricing Formula | Key Inputs |
|--------------|-----------------|------------|
| Window/Building Wash | Hours x Rate | Drops per elevation, drops/day |
| Parkade Cleaning | Stalls x Rate | Total stalls, price/stall |
| Dryer Vent | Units x Rate OR Hours x Rate | Unit count or hours |
| Ground Work | Hours x Rate | Estimated hours |
| Painting (NEW) | Drops x Rate | Drop count (Lines 32-34) |
| Custom | Configurable | User-defined |

---

## Critical Corrections Required

### 1. Tax Calculation - REMOVE OR MARK PLANNED
**Current claim:** "Automatic HST/GST calculation based on company settings"  
**Reality:** Hardcoded at 13% HST. Tommy: "I just created a quote right now and it's not doing any taxes" (Line 47)

### 2. Email Integration - REMOVE
**Current claim:** "Send quotes directly to clients"  
**Reality:** Tommy: "Email quotes, I would remove that part right now." Quotes must be downloaded. (Lines 126-131)

### 3. Permissions - NOTE AS INCOMPLETE
Quote permissions being added to system. Currently not in official permission categories. (Lines 150-153)

---

## Key Features Summary

| Feature | Description |
|---------|-------------|
| Automatic Cost Calculation | Service-specific formulas eliminate manual errors |
| Kanban Sales Pipeline | Draft > Submitted > Review > Negotiation > Won/Lost |
| Financial Privacy | Techs create quotes without seeing pricing |
| Photo Capture | Techs photograph elevations for owner review |
| One-Click Conversion | Quote to project with all data intact |
| Multi-Building (DEV) | Tower A/B/C support in development |

---

## Problems Solved

### For Company Owners

**Problem 1: Calculation Errors**  
Tommy: "Jeff would review my quote all the time. Be like how does that add up? Like you have 30 drops and you're only charging a thousand dollars." (Lines 79-81)  
**Solution:** Auto-calculation from service-specific formulas

**Problem 2: Lost Sales**  
Glenn: "I've had times in the past where I've just completely forgotten about a sales opportunity." (Lines 43-44)  
**Solution:** Kanban pipeline with visual stage tracking

**Problem 3: Financial Exposure**  
Tommy: "When I started seeing the price that it was charging, that's when I started trying to do my own jobs." (Line 87)  
**Solution:** Permission-based pricing visibility

**Problem 4: Quote-to-Project Friction**  
**Solution:** One-click conversion maintains all pricing data (Lines 92-94)

### For Operations Managers

**Problem 5: Pipeline Visibility**  
**Solution:** Kanban board with value per stage

**Problem 6: Inconsistent Data Capture**  
**Solution:** Structured forms with required fields

### For Technicians

**Problem 7: Quote Tracking**  
"My Quotes" tab shows quotes you created. (Lines 132-134)  
**Solution:** Personal quote visibility with permissions

---

## Service Types

### Window Cleaning
- Drops per elevation (N/E/S/W), daily target, hourly rate
- System calculates: (Total Drops / Drops per Day) x Hours

### Building Wash
- Same structure as window cleaning

### Parkade Cleaning
- Total stalls, price per stall
- Hourly option in development (Line 162)

### Dryer Vent
- Units or hours, flexible pricing

### Ground Windows
- Estimated hours x hourly rate

### Painting (NEW - Lines 32-34)
- Drops x Rate (per drop pricing)

### Custom Service
- User-defined, rope access or ground work

---

## Multi-Building Support (In Development)

Tommy: "When you do window washing, you have multiple building within the complex... Tower A, Tower B, Tower C... toggle a switch that says multiple building." (Lines 9-13)

**Features:**
- Different floor/drop counts per building
- Workers select tower for work sessions
- Residents see their specific tower

---

## Quote Creation Workflow

1. **Select Services** - Choose from grid
2. **Configure Each** - Enter service-specific fields
3. **Building Info** - Name, address, floors, strata/HOA number
4. **Save** - Draft stage, download PDF to send

**Note:** Strata (Canada) = HOA (US). Labels accommodate regional variations. (Lines 119-124)

---

## Pipeline Stages

| Stage | Actions |
|-------|---------|
| Draft | Edit, delete, submit |
| Submitted | Move to Review/Won/Lost |
| Review | Move to Negotiation/Won/Lost |
| Negotiation | Move to Won/Lost |
| Won | Convert to Project |
| Lost | Archive |

---

## FAQs

**Q: Can I email quotes from the system?**  
A: Not currently. Download PDF and email manually. (Lines 95-112)

**Q: How does tax work?**  
A: Hardcoded at 13% HST. Location-based calculation planned. (Lines 47-64)

**Q: Can techs see prices?**  
A: Only with Financial Access permission.

---

## Module Integrations

- Project Management: One-click conversion
- Work Sessions: Multi-building tower selection
- Resident Portal: Tower visibility
- Analytics: Pipeline metrics
- Employee Management: Permission control

---

**Version:** 1.0  
**Last Updated:** December 16, 2025  
**Maintenance:** Glenn (strategic) + Tommy (technical)
