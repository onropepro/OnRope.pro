# Module - Property Manager Interface Overview

**Version:** 2.0 - Single Source of Truth  
**Last Updated:** December 17, 2025  
**Status:** ✅ Validated from Conversation Transcript (Tommy/Glenn, Dec 17 2025)  
**Purpose:** Authoritative reference for all Property Manager Interface documentation, marketing, and development  
**Module Type:** CORE MODULE

---

## 📋 Document Purpose

This is THE definitive source of truth for OnRopePro's Property Manager Interface module. All other materials (website pages, marketing copy, sales decks, support documentation) should derive from this document. Any discrepancies between this document and other materials indicate those materials need updating.

**Validated Sources:**
- Conversation transcript: Tommy/Glenn - OnRopePro - Module - Property Manager Interface (December 17, 2025)
- Live implementation review during conversation
- Fireflies AI summary with validated problems solved

---

## 🔍 Critical Writing Guidelines

**NO em-dashes anywhere in content** (breaks TSX rendering)

**Writing Style:**
- Active voice: "Property managers view CSR scores" not "CSR scores are viewed by property managers"
- Present tense: "The dashboard displays" not "The dashboard will display"
- Specific numbers when available
- Conversational but professional

---

## 🎯 The Golden Rule

> **Property managers have read-only access to vendor data, EXCEPT for one write capability: uploading annual anchor inspection certificates per building.**

### Key Access Formula

```
Property Manager Access = READ(all vendor data) + WRITE(anchor inspection certificates only)
```

**Why This Matters:** This balance gives property managers full transparency into vendor safety and performance while maintaining data integrity. They can verify compliance without risk of accidentally modifying operational records. The single write permission for anchor inspections acknowledges that building owners, not vendors, often receive these third-party inspection certificates.

**Validated Quote (Lines 21-29):**
> "They just go inside a project but that's the one thing they can do is upload... So they're not view only. They do have write capabilities but only one document."

---

## ✅ Key Features Summary

**Quick overview of what makes this module powerful:**

| Feature | Description |
|---------|-------------|
| 🏠 **My Vendors Dashboard** | Central hub displaying all contracted rope access companies with CSR scores |
| 📊 **CSR Visibility** | Three compliance percentages: documentation, toolbox meetings, harness inspections |
| 📄 **Anchor Inspection Upload** | One write permission for annual anchor inspection certificates per building |
| ⏱️ **Response Time Metrics** | Average resolution time and feedback response rates per vendor |
| 🔐 **Property Manager Code** | Secure access system, similar to resident code, with building-level permissions |
| 📈 **CSR Trend Tracking** | Historical improvement/decline visibility (being added) |
| 💬 **Feedback History** | Per-building complaint and response tracking |
| 🛡️ **Risk Mitigation** | Documented safety due diligence for insurance and liability protection |

---

## ⚠️ Critical Disclaimer

> ⚠️ **Important: Liability and Insurance Context**
>
> The Property Manager Interface provides transparency into vendor safety compliance, but **OnRopePro does not guarantee vendor safety practices.** Property managers remain responsible for:
>
> - Independent vendor verification beyond CSR scores
> - Contract-level safety requirements
> - Insurance verification and coverage confirmation
> - Compliance with local building codes and regulations
>
> **CSR scores provide visibility, not liability transfer.** Consult with qualified insurance and legal professionals regarding vendor management responsibilities.

---

## ✅ Problems Solved (Stakeholder-Segmented)

**The Property Manager Interface module solves different problems for property managers, building owners, and indirectly for rope access companies.**

---

## 🏢 For Property Managers

### Problem 1: "I need to know if my vendors are actually following safety protocols"

**The Pain:**
Property managers contract rope access companies for building maintenance but have zero visibility into whether those companies are following safety procedures. When accidents happen, property managers face liability questions: "Did you verify your contractor's safety compliance?"

**Real Example:**
A property manager hires a rope access company based on lowest bid. Six months later, a technician falls. Insurance company asks: "What due diligence did you perform on this vendor's safety record?" The property manager has nothing documented.

**The Solution:**
Company Safety Rating (CSR) displays three compliance percentages: documentation completeness, toolbox meeting frequency, and harness inspection rates. Property managers see exactly where each vendor stands on safety.

**The Benefit:**
Documented evidence of vendor safety due diligence. Clear comparison between vendors. Protection in liability situations.

**Validated Quote (Lines 52-54):**
> "So this is huge for insurance purposes. You know you can see specifically... the company that is working on our building has a terrible safety rating or they have an amazing safety rating."

---

### Problem 2: "I manage dozens of buildings with different vendors. I need one place to see everything."

**The Pain:**
Property managers often manage 50-70+ buildings serviced by multiple rope access companies. Finding which company services which building requires digging through contracts, emails, or calling around.

**Real Example:**
A strata manager receives a resident complaint about rope access work. Which company is working on that building? They spend 20 minutes searching emails before finding the answer.

**The Solution:**
My Vendors Dashboard centralizes all contracted rope access companies. View all vendors, see their buildings, access project details, and check safety ratings from one screen.

**The Benefit:**
Instant visibility into all vendor relationships. Quick access to contact information and project status.

**Validated Quote (Line 55):**
> "Scattered vendor information centralized. My vendor's dashboard aggregate all contractors details."

---

### Problem 3: "I need to compare vendor safety ratings to make informed decisions"

**The Pain:**
When selecting between rope access vendors, property managers typically have only price to compare. Safety record comparison requires manually calling references or accepting vendor claims at face value.

**Real Example:**
Two vendors submit bids within $200 of each other. Without safety data, the property manager picks the lower bid. That vendor has poor safety practices the property manager couldn't verify.

**The Solution:**
CSR scores visible on vendor cards allow instant safety comparison. An 86% CSR vendor versus a 23% CSR vendor becomes an obvious choice.

**The Benefit:**
Objective vendor comparison beyond price. Risk mitigation through data-driven vendor selection.

**Validated Quote (Lines 53-54):**
> "It's an easy choice if you have two company that have the same price range on the bid. I'm gonna go with the 86 CSR instead of the 23."

---

### Problem 4: "Vendors don't respond to complaints and I have no way to track it"

**The Pain:**
When residents complain about rope access work (streaks, missed windows, equipment noise), property managers relay complaints to vendors. Without tracking, there's no way to know if complaints are addressed or how long resolution takes.

**Real Example:**
A resident reports streaky windows three times. The property manager forwards each complaint but has no visibility into whether the vendor responded or fixed the issue.

**The Solution:**
Feedback history per building shows all complaints and responses. Average resolution time metric reveals how responsive each vendor actually is.

**The Benefit:**
Accountability for vendor responsiveness. Data to support vendor performance conversations or contract decisions.

**Validated Quote (Lines 48-51, 203-206):**
> "They can also see the feedback... for a specific building. And they can also see the feedback response rate of the company."
> 
> "This is a big factor for property manager. Sadly, this will be a bigger factor than the CSR."

---

### Problem 5: "I need to upload anchor inspection certificates but don't want vendors editing them"

**The Pain:**
Annual anchor inspections are required for rope access work. The certificate needs to be on file per building, but who uploads it? Giving vendors full edit access creates data integrity risks.

**Real Example:**
Property manager receives annual anchor inspection certificate from third-party inspector. Needs to attach it to the building record. Doesn't want to give the inspection document to the vendor to upload.

**The Solution:**
Property managers have ONE write permission: uploading anchor inspection certificates per building. All other data remains read-only.

**The Benefit:**
Secure document management. Property managers control inspection documentation. Audit trail maintained.

**Validated Quote (Lines 21-29):**
> "They just go inside a project but that's the one thing they can do is upload."

---

### Problem 6: "I need controlled access, but only to my specific buildings and vendors"

**The Pain:**
Different property managers handle different portfolios. They shouldn't see each other's vendors or buildings. But setting up individual access for each property manager is administratively complex.

**Real Example:**
A strata management company has 5 property managers each handling different portfolios. Each needs access only to their specific buildings and the vendors servicing them.

**The Solution:**
Property Manager Code system allows controlled access. Company provides one code to each property manager. Property manager creates account and specifies which buildings they manage.

**The Benefit:**
Clean access separation. Simple onboarding. Company knows who has access.

**Validated Quote (Lines 43-46):**
> "There's one code. The company has one code that they can give to every property manager and then the property manager creates their account and they enter the building they manage."

---

## 💼 For Rope Access Company Owners

### Problem 7: "I want to show property managers our safety record without giving them system access"

**The Pain:**
Rope access companies invest heavily in safety compliance but have no way to demonstrate this to property managers without manually creating reports or giving inappropriate system access.

**Real Example:**
A company owner wants to win a contract based on their excellent safety record. They create a PowerPoint presentation with screenshots of their safety documentation. It looks unprofessional and takes hours.

**The Solution:**
Property Manager Interface gives clients read-only access to your CSR score and compliance breakdown. They see your professionalism without accessing operational data.

**The Benefit:**
Professional presentation of safety compliance. Competitive differentiation. Time saved on manual reporting.

---

### Problem 8: "Property managers keep asking for safety documentation updates"

**The Pain:**
Property managers periodically request proof of safety compliance. Responding to these requests takes administrative time and creates version control issues.

**Real Example:**
Three different property managers ask for current insurance and safety documentation in the same week. Office staff spends hours gathering, formatting, and emailing documents.

**The Solution:**
CSR scores update automatically. Property managers can check compliance status anytime without requesting documents. Self-serve transparency eliminates administrative requests.

**The Benefit:**
Eliminated repetitive documentation requests. Property managers have 24/7 access to compliance visibility.

---

## 🏗️ System Architecture

The Property Manager Interface consists of three primary components:

### 1. My Vendors Dashboard

Central hub displaying all contracted rope access companies.

**Dashboard Features:**
- Company cards with summary information
- CSR score display on vendor cards (being added per Line 196)
- Quick access to company details
- Search and filter vendors

---

### 2. Company Safety Rating (CSR) Display

Rating system showing compliance status through percentage breakdowns.

**CSR Categories Visible (Lines 59-60, 100):**
1. **Documentation Percentage** (e.g., 100%): Safety forms and certificates completeness
2. **Toolbox Meeting Percentage** (e.g., 67%): Pre-work safety meetings conducted
3. **Harness Inspection Percentage** (e.g., 57%): Equipment inspection compliance

**Important:** Property managers see percentages only, not the underlying calculation formula or individual documents.

---

### 3. Read-Only Company View

Detailed company information accessible without edit capabilities (except anchor inspection upload).

**Viewable Information (Validated Lines 119):**
- CSR score and breakdown
- Average resolution/response time
- Resident access code
- Property manager code
- Buildings for active projects with:
  - Feedback history
  - Building progress
  - Building instructions/information
- Past completed projects

**NOT Viewable:**
- Individual employee details or certifications (Line 117-118)
- Safety documents (just indicators)
- Financial data
- Employee personal information

---

## 🔐 Access Control

### Property Manager Code System

**How It Works (Lines 43-46):**
1. Company owner generates Property Manager Code (one code per company)
2. Company provides code to property manager
3. Property manager creates account using the code
4. Property manager enters which buildings they manage
5. Company can see who has linked via their code

**Code Mechanics:**
- Similar to Resident Code system
- One code covers all property managers for that company
- Building-level access determined by property manager during setup
- Company retains visibility into who has access

---

### Permissions Matrix

| Action | Permission |
|--------|------------|
| View vendor list | ✅ Allowed |
| View CSR scores | ✅ Allowed |
| View feedback history | ✅ Allowed |
| View response times | ✅ Allowed |
| Upload anchor inspection certificates | ✅ Allowed |
| Edit company information | ❌ Blocked |
| View employee personal details | ❌ Blocked |
| View financial data | ❌ Blocked |
| Modify safety records | ❌ Blocked |
| View individual safety documents | ❌ Blocked |

---

## 📊 Step-by-Step Usage Workflows

### Workflow 1: View Vendor CSR

1. **Navigate to My Vendors** - Access from dashboard or sidebar
2. **Select vendor company** - Click on company card to view details
3. **View CSR breakdown** - See overall score
4. **Review compliance categories** - View documentation, toolbox meeting, and harness inspection percentages

---

### Workflow 2: Compare Vendors

1. **View all vendors** - My Vendors dashboard shows all contracted companies
2. **Compare CSR scores** - Scores visible on each vendor card
3. **Review individual details** - Click into companies for detailed breakdown

**Note:** "Sort by rating" feature does not currently exist (Line 182)

---

### Workflow 3: Upload Anchor Inspection Certificate

1. **Navigate to specific building** - Find the building in vendor's project list
2. **Access project details** - Enter the project view
3. **Upload certificate** - Attach the annual anchor inspection certificate
4. **Confirm upload** - Document is now on file for that building

---

### Workflow 4: Review Feedback History

1. **Select vendor company** - From My Vendors dashboard
2. **View building list** - See all buildings serviced by this vendor
3. **Select specific building** - Access building details
4. **Review feedback** - See complaint history and responses
5. **Check response time** - View average resolution metrics

---

## 👥 Customer Journey

**Property Manager Journey:**

```
Login → My Vendors → Check CSR → Compare Vendors → Make Decision
  ↓         ↓           ↓             ↓              ↓
Property  View all    Review      Objective      Informed
Manager   contracted  safety      comparison     vendor
account   vendors     ratings     data           selection
```

---

## 📈 Quantified Business Impact

### For Property Managers

| Metric | Current State | With OnRopePro | Improvement |
|--------|---------------|----------------|-------------|
| Time to find vendor safety info | 20-30 min | 30 seconds | 98% reduction |
| Vendor comparison data points | Price only | Price + CSR + Response Time | 3x more data |
| Liability documentation | None | Always current | Infinite improvement |
| Response time visibility | Unknown | Real-time metrics | Full transparency |

### For Rope Access Companies

| Metric | Current State | With OnRopePro | Improvement |
|--------|---------------|----------------|-------------|
| Safety report requests/month | 5-10 | 0 | 100% elimination |
| Time spent on compliance reports | 2-4 hours/month | 0 | Full automation |
| Competitive differentiation | Hard to prove | Visible CSR | Quantified advantage |

---

## 🔗 Module Integration Points

The Property Manager Interface connects to:

1. **Company Safety Rating (CSR)** → Pulls compliance percentages and scores
2. **Project Management** → Shows active and completed projects per building
3. **Resident Portal** → Parallel access model using similar code system
4. **Document Management** → Anchor inspection certificate storage
5. **Feedback System** → Complaint history and response tracking

---

## ❓ Frequently Asked Questions

### "Can property managers see individual safety documents?"

**Answer:** No. Property managers see CSR percentages indicating compliance levels, not individual safety documents. This provides transparency without exposing operational details.

**Validated Quote (Line 57):**
> "They don't see documents. They don't see like anchor inspection or stuff like that."

---

### "What's the only thing property managers can edit?"

**Answer:** Anchor inspection certificates. Property managers can upload the annual anchor inspection certificate for each building they manage. Everything else is read-only.

---

### "How does the Property Manager Code work?"

**Answer:** Companies generate one code that can be given to all property managers. Each property manager creates their account using this code, then specifies which buildings they manage. The company knows who has linked because they provided the code.

---

### "Can property managers see which technicians work on their buildings?"

**Answer:** No. Property managers do not see individual employee information or certifications. They see CSR scores (aggregate safety compliance), project progress, and building-specific information.

---

### "Is response time really more important than CSR?"

**Answer:** For many property managers, yes. Tommy noted (Line 203-206): "This is a big factor for property manager. Sadly, this will be a bigger factor than the CSR." Both metrics provide valuable vendor evaluation data.

---

## 🎯 Summary: Why Property Manager Interface Is Different

**Most vendor management tools treat property managers as afterthoughts.** OnRopePro recognizes that property managers are a critical node in the rope access ecosystem, connecting:

1. **Buildings** → The permanent assets requiring maintenance
2. **Vendors** → The companies performing the work
3. **Residents** → The people affected by maintenance activities
4. **Insurance** → The documentation needed for liability protection
5. **Compliance** → The safety standards everyone must meet

**When you give property managers visibility, you're not just providing a dashboard. You're creating transparent accountability that benefits everyone: safer work for technicians, better vendor selection for property managers, and documented compliance for companies.**

---

## 📞 Support & Questions

**For Property Managers:**
- **Access Issues:** Contact your vendor for Property Manager Code
- **Feature Questions:** support@onropepro.com
- **Feedback:** Use in-app feedback submission

**For Rope Access Company Owners:**
- **Generating Property Manager Codes:** Settings → Access Codes → Property Manager
- **Managing Property Manager Access:** View linked property managers in Settings

---

**Document Version:** 2.0  
**Last Major Update:** December 17, 2025 - Complete rewrite based on conversation validation  
**Next Review:** After Property Manager Code implementation verification  
**Word Count:** ~3,200  
**Maintenance Owner:** Glenn (strategic) + Tommy (technical)

---

**END OF SINGLE SOURCE OF TRUTH DOCUMENT**
