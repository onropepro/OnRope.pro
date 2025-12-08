# OnRopePro: Metrics Dashboard Specification

**Document Type:** Admin Dashboard KPIs  
**Version:** 1.0  
**Date:** December 7, 2025

---

## Dashboard Overview

Simple, real-time visibility into the metrics that matter. Two sections:
1. **Leading Indicators** — Predict future revenue
2. **Lagging Indicators** — Confirm actual results

---

## Section 1: Leading Indicators

### 1.1 Tech Accounts (Free)

**Goal:** 500 tech accounts by June 30, 2026 (6 months post-launch)

| Metric | Display |
|--------|---------|
| Current | `162` |
| Goal | `500` |
| Remaining | `338` |
| Days Left | `87` |
| Required Rate | `3.9/day` |
| Actual Rate (7-day avg) | `2.1/day` |
| Status | 🔴 Behind / 🟡 At Risk / 🟢 On Track |

**Progress Bar:**
```
[████████░░░░░░░░░░░░] 32.4% (162/500)
```

**Triggers:**
- 🟢 On Track: Actual rate ≥ Required rate
- 🟡 At Risk: Actual rate 50-99% of required
- 🔴 Behind: Actual rate <50% of required

---

### 1.2 Tech Referrals (Viral Coefficient)

**Goal:** k ≥ 1.0 by Q2 2026

| Metric | Display |
|--------|---------|
| Referrals This Month | `47` |
| Tech Signups This Month | `52` |
| Viral Coefficient (k) | `0.90` |
| Goal | `1.00` |
| Status | 🟡 At Risk |

**Calculation:** k = Referrals / New Signups

**Triggers:**
- 🟢 On Track: k ≥ 1.0
- 🟡 At Risk: k = 0.7-0.99
- 🔴 Behind: k < 0.7

---

### 1.3 Trial Starts (Employers)

**Goal:** 10 new trials/month by Month 3

| Metric | Display |
|--------|---------|
| Trials Started (MTD) | `6` |
| Goal (Month) | `10` |
| Days Remaining | `12` |
| Required Rate | `0.33/day` |
| Actual Rate (7-day) | `0.29/day` |
| Status | 🟡 At Risk |

**Triggers:**
- 🟢 On Track: ≥80% of monthly goal pace
- 🟡 At Risk: 50-79% of pace
- 🔴 Behind: <50% of pace

---

### 1.4 Trial-to-Paid Conversion

**Goal:** 40% conversion rate

| Metric | Display |
|--------|---------|
| Trials Completed (Last 90 days) | `25` |
| Converted to Paid | `9` |
| Conversion Rate | `36%` |
| Goal | `40%` |
| Status | 🟡 At Risk |

**Triggers:**
- 🟢 On Track: ≥40%
- 🟡 At Risk: 30-39%
- 🔴 Behind: <30%

---

## Section 2: Lagging Indicators

### 2.1 Paying Customers

**Goal:** 25 customers by Dec 31, 2026 (Year 1)

| Metric | Display |
|--------|---------|
| Current Customers | `8` |
| Goal | `25` |
| Remaining | `17` |
| Days Left | `142` |
| Required Rate | `0.12/day` (3.6/mo) |
| Actual Rate (30-day) | `0.10/day` (3.0/mo) |
| Status | 🟡 At Risk |

**Progress Bar:**
```
[██████░░░░░░░░░░░░░░] 32.0% (8/25)
```

---

### 2.2 Monthly Recurring Revenue (MRR)

**Goal:** $19,700 MRR by Dec 31, 2026

| Metric | Display |
|--------|---------|
| Current MRR | `$6,304` |
| Goal | `$19,700` |
| Remaining | `$13,396` |
| Growth Required | `$94/day` |
| Actual Growth (30-day avg) | `$78/day` |
| Status | 🟡 At Risk |

**Progress Bar:**
```
[██████░░░░░░░░░░░░░░] 32.0% ($6,304/$19,700)
```

---

### 2.3 Average Revenue Per User (ARPU)

**Goal:** $788/month (weighted target)

| Metric | Display |
|--------|---------|
| Current ARPU | `$788` |
| Goal | `$788` |
| Variance | `$0 (0%)` |
| Status | 🟢 On Track |

**Triggers:**
- 🟢 On Track: Within ±5% of goal
- 🟡 At Risk: 5-15% below goal
- 🔴 Behind: >15% below goal

---

### 2.4 Churn Rate (Monthly)

**Goal:** <0.83% monthly (<10% annual)

| Metric | Display |
|--------|---------|
| Customers Lost (MTD) | `0` |
| Starting Customers | `8` |
| Monthly Churn | `0.0%` |
| Goal | `<0.83%` |
| Status | 🟢 On Track |

**Triggers:**
- 🟢 On Track: ≤0.83%
- 🟡 At Risk: 0.84-1.5%
- 🔴 Behind: >1.5%

---

### 2.5 Net Revenue Retention (NRR)

**Goal:** ≥115%

| Metric | Display |
|--------|---------|
| Starting ARR (Cohort) | `$45,000` |
| Current ARR (Same Cohort) | `$51,750` |
| NRR | `115%` |
| Goal | `115%` |
| Status | 🟢 On Track |

**Calculation:** (Starting ARR + Expansion - Contraction - Churn) / Starting ARR

**Triggers:**
- 🟢 On Track: ≥115%
- 🟡 At Risk: 100-114%
- 🔴 Behind: <100%

---

## Section 3: Geographic Expansion

### 3.1 Buildings by Location

| Level | Count | Goal | Status |
|-------|-------|------|--------|
| **Total** | 0 | — | — |
| **By Country** | | | |
| Canada | 0 | — | — |
| USA | 0 | — | — |
| **By Province/State** | | | |
| British Columbia | 0 | — | — |
| Alberta | 0 | — | — |
| Ontario | 0 | — | — |
| California | 0 | — | — |
| Washington | 0 | — | — |
| **By City (Top 10)** | | | |
| Vancouver | 0 | — | — |
| ... | | | |

### 3.2 Tech Accounts by Location

| Level | Count | Goal | Status |
|-------|-------|------|--------|
| **Total** | 0 | 500 | — |
| **By Country** | | | |
| Canada | 0 | 400 | — |
| USA | 0 | 100 | — |
| **By Province/State** | | | |
| British Columbia | 0 | — | — |
| Alberta | 0 | — | — |
| Ontario | 0 | — | — |
| **By City (Top 10)** | | | |
| Vancouver | 0 | — | — |
| ... | | | |

### 3.3 Employer Accounts by Location

| Level | Count | Goal | Status |
|-------|-------|------|--------|
| **Total** | 0 | 25 | — |
| **By Country** | | | |
| Canada | 0 | 25 | — |
| USA | 0 | 0 | — |
| **By Province/State** | | | |
| British Columbia | 0 | — | — |
| Alberta | 0 | — | — |
| Ontario | 0 | — | — |
| **By City (Top 10)** | | | |
| Vancouver | 0 | — | — |
| ... | | | |

### 3.4 Property Manager Accounts by Location

| Level | Count | Goal | Status |
|-------|-------|------|--------|
| **Total** | 0 | — | — |
| **By Country** | | | |
| Canada | 0 | — | — |
| USA | 0 | — | — |
| **By Province/State** | | | |
| British Columbia | 0 | — | — |
| **By City (Top 10)** | | | |
| Vancouver | 0 | — | — |
| ... | | | |

---

## Section 4: Unit Economics (Valuation Metrics)

### 4.1 Customer Acquisition Cost (CAC)

| Metric | Value |
|--------|-------|
| Total S&M Spend (Period) | $0 |
| New Customers (Period) | 0 |
| **CAC** | $0 |
| Goal | <$1,500 |
| Status | — |

### 4.2 Lifetime Value (LTV)

| Metric | Value |
|--------|-------|
| ARPU (Monthly) | $788 |
| Gross Margin | 95% |
| Avg Customer Lifespan | 10 years |
| **LTV** | $89,866 |

### 4.3 LTV:CAC Ratio

| Metric | Value |
|--------|-------|
| LTV | $89,866 |
| CAC | $0 |
| **LTV:CAC** | — |
| Goal | >3x (target: 60x+) |
| Status | — |

### 4.4 CAC Payback

| Metric | Value |
|--------|-------|
| CAC | $0 |
| Monthly Contribution | $749 |
| **Payback Period** | — months |
| Goal | <12 months |
| Status | — |

---

## Section 5: Account Engagement

### 5.1 Employer Engagement (Last 30 Days)

| Metric | Value | Goal | Status |
|--------|-------|------|--------|
| DAU / MAU Ratio | 0% | >20% | — |
| Avg Sessions/User/Week | 0 | >3 | — |
| Projects Created | 0 | — | — |
| Photos Uploaded | 0 | — | — |
| Time Entries Logged | 0 | — | — |

### 5.2 Tech Engagement (Last 30 Days)

| Metric | Value | Goal | Status |
|--------|-------|------|--------|
| Active Techs (logged in) | 0 | — | — |
| % of Techs Active | 0% | >50% | — |
| Avg Sessions/Tech/Week | 0 | >2 | — |
| Profile Completeness | 0% | >80% | — |

### 5.3 Property Manager Engagement (Last 30 Days)

| Metric | Value | Goal | Status |
|--------|-------|------|--------|
| Active PMs | 0 | — | — |
| Portal Logins | 0 | — | — |
| Reports Viewed | 0 | — | — |

### 5.4 Engagement Health Score

| Score | Range | Status |
|-------|-------|--------|
| 0-40 | Low engagement | 🔴 Churn risk |
| 41-70 | Moderate | 🟡 Monitor |
| 71-100 | High | 🟢 Healthy |

**Current Score:** — / 100

---

## Section 6: Summary Dashboard

### At-a-Glance View

| Metric | Goal | Actual | Status |
|--------|------|--------|--------|
| Tech Accounts | 500 | 162 | 🔴 |
| Viral Coefficient | 1.0 | 0.90 | 🟡 |
| Trial Starts/Mo | 10 | 6 | 🟡 |
| Trial Conversion | 40% | 36% | 🟡 |
| Paying Customers | 25 | 8 | 🟡 |
| MRR | $19.7K | $6.3K | 🟡 |
| ARPU | $788 | $788 | 🟢 |
| Churn | <0.83% | 0.0% | 🟢 |
| NRR | 115% | 115% | 🟢 |

**Overall Health:** 🟡 At Risk (4/9 metrics on track)

---

## Section 7: SMART Goal Definitions

### Year 1 Goals (Launch → Dec 31, 2026)

| Goal | Specific | Measurable | Achievable | Relevant | Time-bound |
|------|----------|------------|------------|----------|------------|
| Tech Accounts | 500 free tech accounts | Dashboard count | Industry size supports | Drives employer adoption | Jun 30, 2026 |
| Viral Coefficient | k ≥ 1.0 | Referrals/Signups | Referral program in place | Self-sustaining growth | Q2 2026 |
| Customers | 25 paying employers | Subscription count | Market validation | Revenue foundation | Dec 31, 2026 |
| MRR | $19,700 | Stripe revenue | 25 × $788 ARPU | Break-even path | Dec 31, 2026 |
| Churn | <10% annual | Lost/Starting | Industry benchmark | LTV protection | Ongoing |
| NRR | ≥115% | Cohort analysis | Seat expansion trend | Growth efficiency | Ongoing |

---

## Section 8: Trigger Escalations

### Automated Alerts

| Condition | Alert | Action |
|-----------|-------|--------|
| Any metric 🔴 for 7+ days | Slack + Email | Immediate review |
| 3+ metrics 🟡 | Weekly summary | Strategy adjustment |
| Tech signups <1/day for 3 days | Slack alert | Marketing push |
| Trial starts = 0 for 7 days | Urgent alert | Outreach review |
| Any churn event | Instant alert | Exit interview |
| MRR decline MoM | Weekly alert | Churn analysis |

### Review Cadence

| Frequency | Review |
|-----------|--------|
| Daily | Tech signups, trial starts |
| Weekly | All leading indicators |
| Monthly | All metrics, goal adjustment |
| Quarterly | Strategic review, goal reset |

---

## Section 9: Data Sources

| Metric | Source | Update Frequency |
|--------|--------|------------------|
| **Account Metrics** | | |
| Tech Accounts | Database: users (role=tech) | Real-time |
| Employer Accounts | Database: subscriptions | Real-time |
| PM Accounts | Database: users (role=pm) | Real-time |
| Buildings | Database: buildings table | Real-time |
| **Geographic** | | |
| Location data | User profile (city, province, country) | Real-time |
| **Revenue** | | |
| MRR | Stripe API | Daily sync |
| ARPU | MRR / Customer count | Calculated |
| Churn | Stripe cancellations | Real-time |
| NRR | Cohort calculation | Monthly |
| **Unit Economics** | | |
| CAC | S&M spend / New customers | Monthly calc |
| LTV | ARPU × GM × Lifespan | Monthly calc |
| LTV:CAC | LTV / CAC | Monthly calc |
| **Engagement** | | |
| Sessions | Analytics events | Real-time |
| Feature usage | Analytics events | Real-time |
| DAU/MAU | Analytics aggregation | Daily calc |
| **Funnel** | | |
| Referrals | Database: referrals table | Real-time |
| Trials | Database: subscriptions (status=trial) | Real-time |
| Conversions | Trial → Active status change | Real-time |

---

## Implementation Notes

### UI Display Format

Each metric card shows:
```
┌─────────────────────────────────────┐
│ TECH ACCOUNTS                    🔴 │
│                                     │
│ 162 of 500                          │
│ [████████░░░░░░░░░░░░] 32.4%       │
│                                     │
│ 338 remaining · 87 days left        │
│ Need: 3.9/day · Actual: 2.1/day     │
└─────────────────────────────────────┘
```

### Status Colors

- 🟢 Green: On track or ahead
- 🟡 Yellow: At risk, needs attention
- 🔴 Red: Behind, requires immediate action

---

*End of Document*
