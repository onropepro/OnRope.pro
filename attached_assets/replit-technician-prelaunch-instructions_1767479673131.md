# Replit Instructions: Technician Pre-Launch Landing Page

**Page URL:** `/technician-coming-soon` or `/technician-prelaunch`  
**Reference:** Use existing `/technician` page styling and the main pre-launch page structure  
**Purpose:** Pre-launch signup page targeting rope access technicians (not employers)

---

## Design Requirements

- Match the visual style of the main pre-launch landing page (dark hero, orange accents, white content sections)
- Mobile-first, responsive design
- Use existing OnRopePro design system (colors, typography, spacing)
- Reuse component patterns from existing technician page where possible

---

## Page Structure

### 1. Hero Section (Dark Background)

**Badge:**
```
LAUNCHING JANUARY 2026
```

**Headline:**
```
2026: The year your work history finally belongs to you.
```

**Subtitle:**
```
Every drop. Every certification. Every employer. One portable profile that follows your career, not theirs.
```

**Form Fields:**
- Full name (text, required)
- Email address (email, required)
- Current IRATA/SPRAT Level (dropdown: Level 1, Level 2, Level 3, Not Yet Certified)

**CTA Button:** `Join the Waitlist`

**Micro-copy below form:**
```
Free for technicians. Always.
```

**Social Proof (below form):**
```
500+ rope access techs across North America. The ones who join early build their verified history first.
```

---

### 2. Answer Section (White Background)

**Headline:**
```
Your career, finally documented.
```

**Body:**
```
IRATA/SPRAT hours logged automatically. Performance data that proves your value. A professional profile that moves when you move. No more starting from zero with every new employer.
```

**Three Feature Cards (grid layout):**

| Card | Icon | Title | Description |
|------|------|-------|-------------|
| 1 | 🪪 | Technician Passport | Your certifications, work history, and safety record in one portable profile. Switch employers without losing your professional identity. |
| 2 | ⭐ | Personal Safety Rating | A score that follows you across employers and proves your professionalism. High performers stand out. |
| 3 | ⏱️ | Verified Hours | Same-day IRATA/SPRAT logging with OCR import from existing logbooks. Your hours, always current, always verified. |

---

### 3. Problems Solved Section (Dark Background)

**Headline:**
```
Problems You Won't Have Anymore
```

**Subhead:**
```
Every feature exists because a rope access tech told us about a real frustration.
```

**Problem/Solution Cards (grid layout):**

| Before | After |
|--------|-------|
| "I switched companies and had to prove my experience all over again" | Your Technician Passport travels with you. New employer sees your verified history instantly. |
| "My paper logbook got damaged and I lost years of hours" | Digital backup of every hour logged. OCR import for existing logbooks. Never lose your records again. |
| "I have no idea if I'm performing well compared to other techs" | Personal performance dashboard shows your drops per day, efficiency trends, and growth over time. |
| "Payroll disputes because my hours don't match what they have" | Every work session timestamped and recorded. Your data matches theirs. Zero disputes. |
| "I don't know my schedule until the night before" | See your upcoming assignments in the app. Plan your life around your work, not the other way around. |
| "When I apply for jobs, I have no way to prove my track record" | Shareable profile link shows verified certifications, hours, and performance data to prospective employers. |

---

### 4. How It Works Section (White Background)

**Headline:**
```
One Account. Every Employer. Your Entire Career.
```

**Subhead:**
```
Your OnRopePro account belongs to you, not your employer.
```

**Steps (vertical timeline or numbered cards):**

**Step 1: Create Your Free Account**
```
Sign up with your email. Add your IRATA/SPRAT certifications. Import your existing logbook hours via OCR.
```

**Step 2: Connect to Your Employer**
```
When your company uses OnRopePro, link your account. Your profile pre-populates their system. No re-entering your info.
```

**Step 3: Log Your Work**
```
Clock in, log drops, upload photos. 10 seconds per entry. Your hours automatically sync to your permanent record.
```

**Step 4: Build Your Reputation**
```
Performance data accumulates. Personal Safety Rating builds. Your professional identity grows with every job.
```

**Step 5: Take It With You**
```
Switch employers? Your account stays yours. New company sees your verified history. No starting over.
```

---

### 5. What's Free vs Plus Section (White Background)

**Headline:**
```
Free Forever. Upgrade If You Want.
```

**Two-column comparison:**

**Standard (Free)**
- Technician Passport (portable profile)
- IRATA/SPRAT hour logging
- Certification tracking
- Work history across employers
- Basic performance stats
- Mobile app access

**Plus ($X/month) - Coming Soon**
- Personal Safety Rating badge
- Advanced performance analytics
- Priority job board visibility
- Shareable verified profile link
- Historical trend reports
- Early access to new features

**Note below comparison:**
```
Plus pricing announced at launch. Early waitlist members get founding member rates.
```

---

### 6. FAQ Section (White Background)

**Headline:**
```
Frequently Asked Questions
```

**Q: Is this really free for technicians?**
```
Yes. Technicians never pay for Standard accounts. Employers pay for the platform. Your career data belongs to you.
```

**Q: What if my employer doesn't use OnRopePro?**
```
You can still create your account and log your hours manually. When they join (or you switch to an employer who uses it), your history is already there.
```

**Q: Can I import my existing IRATA/SPRAT logbook?**
```
Yes. Our OCR import lets you photograph your existing logbook pages and digitize your hours automatically.
```

**Q: What happens to my data if I leave an employer?**
```
Your Technician Passport stays with you. Your work history, certifications, and performance data are yours permanently. Employers only see data from the time you worked for them.
```

**Q: Can employers see my data without permission?**
```
No. You control who sees your profile. Employers can only see data from projects you worked on for them. Your complete history is only visible to you (and anyone you choose to share it with).
```

**Q: When does this launch?**
```
January 2026. Early waitlist members get priority onboarding and founding member benefits.
```

---

### 7. Final CTA Section (Orange Background)

**Headline:**
```
Your hours are your proof. Start documenting them.
```

**Subhead:**
```
Join the waitlist. Be first to claim your Technician Passport.
```

**Form Fields:**
- Full name (text, required)
- Email address (email, required)

**CTA Button:** `Join the Waitlist`

**Footer line:**
```
Free for technicians. Built by rope access professionals.
```

---

## Form Handling

- Forms should submit to the same backend/database as the main pre-launch form
- Add a field to distinguish technician signups from employer signups (e.g., `signup_type: 'technician'`)
- Store IRATA/SPRAT level selection for technician signups
- Show success message on submit: "You're on the list. We'll reach out before launch."

---

## Technical Notes

- Page should be statically renderable (no auth required)
- Add to sitemap
- Meta tags for SEO:
  - Title: "OnRopePro for Technicians | Your Hours. Your Proof. Forever."
  - Description: "Free portable profile for rope access technicians. Track IRATA/SPRAT hours, build your safety rating, and own your career data. Launching January 2026."
- Open Graph image: Create or reuse existing OG image with technician focus

---

## Component Reuse

From existing codebase:
- Hero section pattern (dark gradient background)
- Form input components
- Card grid layouts
- FAQ accordion (if exists) or simple Q&A list
- Footer component
- Badge component (LAUNCHING JANUARY 2026)

---

## Success Metrics

Track:
- Form submissions (technician waitlist signups)
- IRATA/SPRAT level distribution of signups
- Page scroll depth
- Time on page
- Conversion rate (visitors to signups)

---

## Content Validation

All copy in this document is approved. Implement as written. Do not modify headlines or body copy without explicit approval.

---

**Document Version:** 1.0  
**Created:** January 3, 2026  
**Status:** Ready for implementation
