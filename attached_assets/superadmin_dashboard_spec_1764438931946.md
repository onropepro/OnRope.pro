# SuperAdmin Dashboard Specification
## OnRopePro SaaS Business Intelligence System

**Purpose:** Build a comprehensive internal dashboard for managing all financial and operational aspects of the OnRopePro SaaS business. This eliminates the need for external bookkeeping software by capturing all revenue internally and tracking expenses within the platform.

**Location:** `/admin/dashboard` (SuperAdmin only access)

---

## Implementation Phases

### Phase 1: Core SaaS Metrics (Build First)
### Phase 2: Expense Tracking & Cash Management
### Phase 3: Full Financial Reporting (P&L, Balance Sheet)

---

## Phase 1: Core SaaS Metrics Dashboard

### 1.1 Top-Level KPI Cards

Display these metrics prominently at the top of the dashboard:

| Metric | Calculation | Format |
|--------|-------------|--------|
| **MRR** | Sum of all active subscription amounts | $XX,XXX.XX |
| **ARR** | MRR × 12 | $XXX,XXX.XX |
| **Active Customers** | Count of companies with active subscriptions | XX |
| **Monthly Churn** | Churned MRR / Start of Month MRR | X.XX% |
| **LTV/CAC Ratio** | Calculated LTV / Calculated CAC | XX.X:1 |
| **Net Revenue Retention** | (Start + Expansion - Contraction - Churn) / Start | XXX.X% |

Each card should show:
- Current value
- Change from prior period (↑ or ↓ with percentage)
- Trend indicator (green = good, red = bad)

---

### 1.2 MRR Breakdown Component

#### MRR Movement (Waterfall)

Track these MRR components monthly:

```typescript
interface MRRMovement {
  month: Date;
  startingMRR: number;
  newMRR: number;           // From new customers
  expansionMRR: number;     // Upgrades + add-ons
  contractionMRR: number;   // Downgrades (negative)
  churnedMRR: number;       // Cancellations (negative)
  endingMRR: number;        // Calculated
  netNewMRR: number;        // new + expansion - contraction - churned
}
```

#### MRR by Revenue Type

Display breakdown table:

| Revenue Type | MRR | % of Total |
|--------------|-----|------------|
| **Subscription Revenue** | | |
| → Starter ($299/mo) | $X,XXX | XX% |
| → Professional ($549/mo) | $X,XXX | XX% |
| → Enterprise ($999/mo) | $X,XXX | XX% |
| → Unlimited ($1,999/mo) | $X,XXX | XX% |
| **Add-On Revenue** | | |
| → Extra Projects ($49 each) | $XXX | X% |
| → Extra Seats ($19 each) | $XXX | X% |
| → White Label ($49/mo) | $XXX | X% |
| → QuickBooks Integration ($99/mo) | $XXX | X% |
| → Priority Support ($199/mo) | $XXX | X% |
| **Overage Revenue** | | |
| → Project Overages | $XXX | X% |
| → Seat Overages | $XXX | X% |
| → Portal Overages | $XXX | X% |
| **TOTAL MRR** | $XX,XXX | 100% |

Include pie chart visualization.

---

### 1.3 Customer Metrics Component

#### Customer Count Summary

| Metric | Value | Change |
|--------|-------|--------|
| Active Customers | XX | +X this month |
| New Customers (MTD) | X | |
| Churned Customers (MTD) | X | |
| Net Customer Growth | X | |
| Trials in Progress | X | X% conversion rate |

#### Customers by Tier

| Tier | Count | % | MRR | Avg ARPU |
|------|-------|---|-----|----------|
| Starter ($299) | X | XX% | $X,XXX | $XXX |
| Professional ($549) | X | XX% | $X,XXX | $XXX |
| Enterprise ($999) | X | XX% | $X,XXX | $XXX |
| Unlimited ($1,999) | X | XX% | $X,XXX | $XXX |

#### Customer Health Scoring

Calculate health score (0-100) based on:
- **Login Score (25%):** Days since last login (0-7 days = 100, 8-14 = 75, 15-30 = 50, 30+ = 0)
- **Usage Score (25%):** Features used in last 30 days / total features
- **Payment Score (25%):** Current = 100, Past due = 50, Failed = 0
- **Engagement Score (25%):** Projects active, hours logged, photos uploaded

Display customer health distribution:

| Status | Count | % | MRR at Risk |
|--------|-------|---|-------------|
| 🟢 Healthy (score 70-100) | X | XX% | — |
| 🟡 At Risk (score 40-69) | X | XX% | $X,XXX |
| 🔴 Critical (score 0-39) | X | XX% | $X,XXX |

---

### 1.4 Unit Economics Component

#### Customer Acquisition Cost (CAC)

```typescript
interface CACData {
  month: Date;
  totalMarketingSpend: number;
  newCustomers: number;
  cac: number; // totalMarketingSpend / newCustomers
  cacByChannel: {
    channel: string;
    spend: number;
    customers: number;
    cac: number;
  }[];
}
```

Marketing spend categories for CAC:
- Digital Advertising (Google, Meta, LinkedIn)
- Trade Shows & Events
- Content & SEO
- Sales Tools
- Referral Bonuses

Display CAC by channel:

| Channel | Spend | Customers | CAC |
|---------|-------|-----------|-----|
| Organic/SEO | $0 | X | $0 |
| Paid Ads | $XXX | X | $XXX |
| Trade Shows | $XXX | X | $XXX |
| Referrals | $XXX | X | $XX |
| Direct Outreach | $XXX | X | $XXX |
| **Blended** | **$X,XXX** | **X** | **$XXX** |

#### Lifetime Value (LTV)

Formula: `LTV = ARPU × Gross Margin × (1 / Monthly Churn Rate)`

Calculate LTV by tier:

| Tier | Monthly ARPU | Gross Margin | Churn Rate | LTV |
|------|--------------|--------------|------------|-----|
| Starter | $350 | 93% | 1.5% | $21,700 |
| Professional | $650 | 94% | 1.0% | $61,100 |
| Enterprise | $1,200 | 95% | 0.8% | $142,500 |
| Unlimited | $2,200 | 95% | 0.5% | $418,000 |
| **Blended** | $XXX | XX% | X.X% | $XX,XXX |

#### Key Ratios

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| LTV/CAC Ratio | XX.X:1 | >3:1 | 🟢/🟡/🔴 |
| CAC Payback (months) | X.X | <12 | 🟢/🟡/🔴 |
| Magic Number | X.XX | >0.75 | 🟢/🟡/🔴 |
| Rule of 40 | XX% | ≥40% | 🟢/🟡/🔴 |

**CAC Payback Formula:** `CAC / (Monthly ARPU × Gross Margin)`

**Magic Number Formula:** `Net New ARR (quarter) / S&M Spend (prior quarter)`

**Rule of 40 Formula:** `Revenue Growth Rate % + EBITDA Margin %`

---

### 1.5 Churn & Retention Component

#### Churn Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Monthly Customer Churn | X.XX% | <2% | 🟢/🟡/🔴 |
| Monthly Revenue Churn | X.XX% | <1.5% | 🟢/🟡/🔴 |
| Quarterly Churn (rolling) | X.X% | <5% | 🟢/🟡/🔴 |
| Annual Churn (rolling) | XX.X% | <15% | 🟢/🟡/🔴 |

#### Retention Metrics

| Metric | Formula | Value | Target |
|--------|---------|-------|--------|
| Gross Revenue Retention | (Start MRR - Churned) / Start MRR | XX.X% | >90% |
| Net Revenue Retention | (Start + Expansion - Contraction - Churn) / Start | XXX.X% | >100% |
| Logo Retention | Retained Customers / Start Customers | XX.X% | >90% |

#### Churn Reason Tracking

When a customer churns, record reason:

| Reason | Count | % | MRR Lost |
|--------|-------|---|----------|
| Business closed | X | XX% | $XXX |
| Too expensive | X | XX% | $XXX |
| Missing features | X | XX% | $XXX |
| Switched to competitor | X | XX% | $XXX |
| No engagement | X | XX% | $XXX |
| Payment failure (involuntary) | X | XX% | $XXX |
| Unknown | X | XX% | $XXX |

#### Cohort Retention Table

Show retention by signup month:

| Cohort | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|----------|
| Jan 2025 | 100% | XX% | XX% | XX% |
| Feb 2025 | 100% | XX% | XX% | — |
| Mar 2025 | 100% | XX% | — | — |

---

### 1.6 Geographic Distribution Component

#### Vendor Distribution Map

Display heat map showing vendor density by region.

Data table:

| Region | Vendors | % | MRR | Buildings |
|--------|---------|---|-----|-----------|
| BC - Vancouver | X | XX% | $X,XXX | XXX |
| BC - Victoria | X | XX% | $X,XXX | XX |
| BC - Other | X | XX% | $X,XXX | XX |
| Alberta | X | XX% | $X,XXX | XX |
| Ontario | X | XX% | $X,XXX | XX |
| US - California | X | XX% | $X,XXX | XX |
| US - Washington | X | XX% | $X,XXX | XX |
| US - Other | X | XX% | $X,XXX | XX |

#### Network Density Metrics

| Metric | Value | Trend |
|--------|-------|-------|
| Buildings per Vendor (avg) | X.X | ↑/↓ |
| Vendors per Building (avg) | X.X | ↑/↓ |
| Building Managers Active | XXX | ↑/↓ |
| % Buildings with Manager | XX% | ↑/↓ |

---

### 1.7 Payment Status Component

#### Payment Health

| Status | Count | MRR | % |
|--------|-------|-----|---|
| 🟢 Current | XX | $XX,XXX | XX% |
| 🟡 Past Due (1-30 days) | X | $X,XXX | X% |
| 🔴 Past Due (30+ days) | X | $XXX | X% |
| ⚫ Failed (retry pending) | X | $XXX | X% |

#### Billing Metrics

| Metric | Value |
|--------|-------|
| Stripe Processing Fees (MTD) | $XXX.XX |
| Avg Revenue per Transaction | $XXX.XX |
| Failed Payment Recovery Rate | XX% |
| Voluntary vs Involuntary Churn | X:X |

---

### 1.8 Product Usage Component

#### Feature Adoption

| Feature | % Using | Avg Usage/Customer |
|---------|---------|-------------------|
| Projects | XX% | X.X projects |
| Time Tracking | XX% | XXX hours |
| Complaints | XX% | X.X complaints |
| Safety Inspections | XX% | XX inspections |
| Toolbox Meetings | XX% | X.X meetings |
| Photo Uploads | XX% | XXX photos |
| Resident Portal | XX% | XXX logins |
| Building Manager Portal | XX% | XX managers |

#### Engagement Metrics

| Metric | Value | Trend |
|--------|-------|-------|
| Daily Active Users (DAU) | XX | ↑/↓ |
| Weekly Active Users (WAU) | XX | ↑/↓ |
| Monthly Active Users (MAU) | XX | ↑/↓ |
| DAU/MAU Ratio (stickiness) | XX% | ↑/↓ |

---

## Phase 2: Expense Tracking

### 2.1 Chart of Accounts

Create these account categories:

```typescript
const chartOfAccounts = [
  // ASSETS (1000-1999)
  { code: '1010', name: 'Operating Account', type: 'Asset' },
  { code: '1020', name: 'Savings/Reserve', type: 'Asset' },
  { code: '1030', name: 'Stripe Balance', type: 'Asset' },
  { code: '1110', name: 'Accounts Receivable', type: 'Asset' },
  { code: '1210', name: 'Prepaid Insurance', type: 'Asset' },
  { code: '1220', name: 'Prepaid Software', type: 'Asset' },
  
  // LIABILITIES (2000-2999)
  { code: '2000', name: 'Accounts Payable', type: 'Liability' },
  { code: '2100', name: 'Accrued Expenses', type: 'Liability' },
  { code: '2200', name: 'Deferred Revenue', type: 'Liability' },
  { code: '2300', name: 'GST/HST Payable', type: 'Liability' },
  
  // EQUITY (3000-3999)
  { code: '3000', name: 'Common Shares', type: 'Equity' },
  { code: '3100', name: 'Retained Earnings', type: 'Equity' },
  
  // REVENUE (4000-4999)
  { code: '4010', name: 'Subscription - Starter', type: 'Revenue' },
  { code: '4020', name: 'Subscription - Professional', type: 'Revenue' },
  { code: '4030', name: 'Subscription - Enterprise', type: 'Revenue' },
  { code: '4040', name: 'Subscription - Unlimited', type: 'Revenue' },
  { code: '4110', name: 'Add-On - Extra Projects', type: 'Revenue' },
  { code: '4120', name: 'Add-On - Extra Seats', type: 'Revenue' },
  { code: '4130', name: 'Add-On - White Label', type: 'Revenue' },
  { code: '4140', name: 'Add-On - QuickBooks', type: 'Revenue' },
  { code: '4150', name: 'Add-On - Priority Support', type: 'Revenue' },
  { code: '4210', name: 'Overage - Projects', type: 'Revenue' },
  { code: '4220', name: 'Overage - Seats', type: 'Revenue' },
  { code: '4230', name: 'Overage - Portal', type: 'Revenue' },
  { code: '4310', name: 'Transaction Fees', type: 'Revenue' },
  { code: '4320', name: 'Building Manager Premium', type: 'Revenue' },
  
  // COGS (5000-5499)
  { code: '5010', name: 'Hosting - Replit', type: 'COGS' },
  { code: '5020', name: 'Database', type: 'COGS' },
  { code: '5030', name: 'Storage & CDN', type: 'COGS' },
  { code: '5040', name: 'Domain & SSL', type: 'COGS' },
  { code: '5110', name: 'AI Services - Claude API', type: 'COGS' },
  { code: '5210', name: 'Payment Processing - Stripe', type: 'COGS' },
  
  // OPERATING EXPENSES (6000-6999)
  { code: '6010', name: 'Digital Advertising', type: 'OpEx' },
  { code: '6020', name: 'Trade Shows & Events', type: 'OpEx' },
  { code: '6030', name: 'Content & SEO', type: 'OpEx' },
  { code: '6040', name: 'Sales Tools', type: 'OpEx' },
  { code: '6050', name: 'Referral Bonuses', type: 'OpEx' },
  { code: '6110', name: 'Development Tools', type: 'OpEx' },
  { code: '6120', name: 'Analytics Tools', type: 'OpEx' },
  { code: '6130', name: 'Communication - Google Workspace', type: 'OpEx' },
  { code: '6140', name: 'Monitoring Tools', type: 'OpEx' },
  { code: '6210', name: 'Accounting Services', type: 'OpEx' },
  { code: '6220', name: 'Legal Services', type: 'OpEx' },
  { code: '6310', name: 'E&O Insurance', type: 'OpEx' },
  { code: '6320', name: 'Cyber Liability Insurance', type: 'OpEx' },
  { code: '6410', name: 'Corporate Filings', type: 'OpEx' },
  { code: '6420', name: 'Bank Fees', type: 'OpEx' },
  { code: '6510', name: 'Business Travel', type: 'OpEx' },
  { code: '6610', name: 'Founder Compensation - Glenn', type: 'OpEx' },
  { code: '6630', name: 'Founder Compensation - Tommy', type: 'OpEx' },
  { code: '6900', name: 'Miscellaneous', type: 'OpEx' },
];
```

### 2.2 Expense Entry Interface

Create expense entry form with fields:

```typescript
interface Expense {
  id: number;
  date: Date;
  amount: number;
  accountCode: string;       // From chart of accounts
  vendor: string;
  description: string;
  receiptUrl?: string;       // Upload to storage
  isRecurring: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  taxDeductible: boolean;
  createdAt: Date;
  createdBy: number;         // Admin user ID
}
```

**Recurring Expense Templates:**
Pre-populate common recurring expenses:
- Replit Core ($25/month) → 5010
- Google Workspace ($24/month) → 6130
- Insurance ($83/month) → 6310
- Domain ($3/month) → 5040
- Plausible Analytics ($9/month) → 6120

### 2.3 Cash Flow Dashboard

#### Cash Position

| Account | Balance | Last Updated |
|---------|---------|--------------|
| Operating Account | $XX,XXX.XX | [date] |
| Savings/Reserve | $XX,XXX.XX | [date] |
| Stripe Balance | $X,XXX.XX | [date] |
| **Total Cash** | **$XX,XXX.XX** | |

Manual entry for bank balances initially. Future: Plaid integration.

#### Cash Flow Summary (Month to Date)

| Category | Inflows | Outflows | Net |
|----------|---------|----------|-----|
| Subscription Revenue | $XX,XXX | — | $XX,XXX |
| Add-On Revenue | $X,XXX | — | $X,XXX |
| Stripe Fees | — | ($XXX) | ($XXX) |
| Infrastructure | — | ($XXX) | ($XXX) |
| Marketing | — | ($XXX) | ($XXX) |
| Other OpEx | — | ($XXX) | ($XXX) |
| **Net Cash Flow** | | | **$X,XXX** |

#### Runway Calculator

| Scenario | Monthly Burn | Cash | Runway |
|----------|-------------|------|--------|
| Current | $X,XXX | $XX,XXX | XX months |
| No growth | $X,XXX | $XX,XXX | XX months |
| Aggressive | $X,XXX | $XX,XXX | XX months |

---

## Phase 3: Financial Reporting

### 3.1 Income Statement (P&L)

Generate for any period (MTD, QTD, YTD, custom range):

```
REVENUE
  Subscription Revenue                 $XX,XXX
  Add-On Revenue                        $X,XXX
  Overage Revenue                         $XXX
  Network Revenue                         $XXX
────────────────────────────────────────────────
TOTAL REVENUE                         $XX,XXX

COST OF GOODS SOLD
  Infrastructure                          $XXX
  AI Services                             $XXX
  Payment Processing                      $XXX
────────────────────────────────────────────────
TOTAL COGS                              $X,XXX

GROSS PROFIT                          $XX,XXX
GROSS MARGIN                             XX.X%

OPERATING EXPENSES
  Sales & Marketing                     $X,XXX
  Software & Tools                        $XXX
  Professional Services                   $XXX
  Insurance                               $XXX
  Government & Compliance                  $XX
  Founder Compensation                  $X,XXX
  Miscellaneous                           $XXX
────────────────────────────────────────────────
TOTAL OPERATING EXPENSES               $X,XXX

EBITDA                                 $X,XXX
EBITDA MARGIN                            XX.X%

NET INCOME                             $X,XXX
NET MARGIN                               XX.X%
```

### 3.2 GST/HST Tracking

Track for quarterly filing:

| Period | GST Collected | GST Paid (ITCs) | Net Owing |
|--------|---------------|-----------------|-----------|
| Q1 | $X,XXX | $XXX | $X,XXX |
| Q2 | $X,XXX | $XXX | $X,XXX |
| Q3 | $X,XXX | $XXX | $X,XXX |
| Q4 | $X,XXX | $XXX | $X,XXX |

---

## Database Schema

### New Tables Required

```sql
-- Chart of Accounts
CREATE TABLE chart_of_accounts (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Asset', 'Liability', 'Equity', 'Revenue', 'COGS', 'OpEx')),
  parent_code VARCHAR(10),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Expenses
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  account_code VARCHAR(10) NOT NULL REFERENCES chart_of_accounts(code),
  vendor VARCHAR(255),
  description TEXT,
  receipt_url VARCHAR(500),
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency VARCHAR(20),
  tax_deductible BOOLEAN DEFAULT TRUE,
  gst_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER
);

-- Marketing Spend (for CAC calculation)
CREATE TABLE marketing_spend (
  id SERIAL PRIMARY KEY,
  month DATE NOT NULL,
  channel VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  new_customers_attributed INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Churn Events
CREATE TABLE churn_events (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL,
  churn_date DATE NOT NULL,
  final_mrr DECIMAL(10,2),
  reason VARCHAR(100),
  notes TEXT,
  win_back_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Customer Health Scores (calculated daily)
CREATE TABLE customer_health_scores (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL,
  calculated_at TIMESTAMP DEFAULT NOW(),
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  login_score INTEGER,
  usage_score INTEGER,
  payment_score INTEGER,
  engagement_score INTEGER,
  status VARCHAR(20) CHECK (status IN ('healthy', 'at_risk', 'critical'))
);

-- MRR Snapshots (calculated daily)
CREATE TABLE mrr_snapshots (
  id SERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL,
  total_mrr DECIMAL(10,2) NOT NULL,
  subscription_mrr DECIMAL(10,2),
  addon_mrr DECIMAL(10,2),
  overage_mrr DECIMAL(10,2),
  new_mrr DECIMAL(10,2),
  expansion_mrr DECIMAL(10,2),
  contraction_mrr DECIMAL(10,2),
  churned_mrr DECIMAL(10,2),
  customer_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cash Balances (manual entry)
CREATE TABLE cash_balances (
  id SERIAL PRIMARY KEY,
  account_name VARCHAR(100) NOT NULL,
  balance DECIMAL(12,2) NOT NULL,
  as_of_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### Dashboard Data Endpoints

```typescript
// Core metrics
GET /api/admin/metrics/summary
// Returns: MRR, ARR, customers, churn rate, LTV/CAC

GET /api/admin/metrics/mrr
// Returns: MRR breakdown by type, MRR movement history

GET /api/admin/metrics/customers
// Returns: Customer counts by tier, health distribution

GET /api/admin/metrics/unit-economics
// Returns: CAC, LTV, LTV/CAC, payback period

GET /api/admin/metrics/churn
// Returns: Churn rates, retention metrics, reasons

GET /api/admin/metrics/geography
// Returns: Vendor/building distribution by region

GET /api/admin/metrics/usage
// Returns: Feature adoption, engagement metrics

// Expense management
GET /api/admin/expenses
POST /api/admin/expenses
PUT /api/admin/expenses/:id
DELETE /api/admin/expenses/:id

// Marketing spend (for CAC)
GET /api/admin/marketing-spend
POST /api/admin/marketing-spend

// Cash management
GET /api/admin/cash-balances
POST /api/admin/cash-balances

// Reports
GET /api/admin/reports/income-statement?start=&end=
GET /api/admin/reports/cash-flow?start=&end=
GET /api/admin/reports/gst-summary?quarter=
```

---

## UI Components

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  SuperAdmin Dashboard                           [Settings]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐│
│  │   MRR   │ │   ARR   │ │Customers│ │  Churn  │ │LTV/CAC ││
│  │$12,450  │ │$149,400 │ │   27    │ │  0.8%   │ │ 134:1  ││
│  │ ↑ 8.3%  │ │ ↑ 12.1% │ │  ↑ 3    │ │   ↓     │ │   ↑    ││
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └────────┘│
│                                                             │
│  [Tabs: Overview | Revenue | Customers | Geography |        │
│         Expenses | Reports]                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Selected Tab Content Area                          │   │
│  │                                                     │   │
│  │  Charts, tables, and detailed metrics               │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Tab Structure

1. **Overview:** KPI cards + MRR trend chart + customer health summary
2. **Revenue:** MRR breakdown, revenue by type, growth rates
3. **Customers:** Customer list, tier distribution, health scores, cohort analysis
4. **Geography:** Map visualization, regional breakdown tables
5. **Expenses:** Expense list, entry form, recurring expenses, cash flow
6. **Reports:** P&L generator, GST summary, export options

---

## Calculation Logic

### MRR Calculation

```typescript
function calculateMRR(companies: Company[]): MRRBreakdown {
  let subscriptionMRR = 0;
  let addonMRR = 0;
  let overageMRR = 0;
  
  for (const company of companies) {
    if (company.subscriptionStatus !== 'active') continue;
    
    // Base subscription
    subscriptionMRR += company.monthlySubscriptionAmount;
    
    // Add-ons
    addonMRR += company.extraProjects * 49;
    addonMRR += company.extraSeats * 19;
    if (company.hasWhiteLabel) addonMRR += 49;
    if (company.hasQuickBooks) addonMRR += 99;
    if (company.hasPrioritySupport) addonMRR += 199;
    
    // Overages (calculate from usage)
    overageMRR += calculateOverages(company);
  }
  
  return {
    total: subscriptionMRR + addonMRR + overageMRR,
    subscription: subscriptionMRR,
    addon: addonMRR,
    overage: overageMRR
  };
}
```

### LTV Calculation

```typescript
function calculateLTV(arpu: number, grossMargin: number, monthlyChurn: number): number {
  // LTV = ARPU × Gross Margin × (1 / Monthly Churn Rate)
  if (monthlyChurn === 0) return arpu * grossMargin * 60; // Cap at 5 years
  return arpu * grossMargin * (1 / monthlyChurn);
}
```

### Health Score Calculation

```typescript
function calculateHealthScore(company: Company): HealthScore {
  const now = new Date();
  
  // Login score (25%)
  const daysSinceLogin = daysBetween(company.lastLoginAt, now);
  let loginScore = 0;
  if (daysSinceLogin <= 7) loginScore = 100;
  else if (daysSinceLogin <= 14) loginScore = 75;
  else if (daysSinceLogin <= 30) loginScore = 50;
  else loginScore = 0;
  
  // Usage score (25%)
  const featuresUsed = countFeaturesUsed(company, 30); // last 30 days
  const usageScore = Math.min(100, (featuresUsed / 8) * 100); // 8 core features
  
  // Payment score (25%)
  let paymentScore = 100;
  if (company.paymentStatus === 'past_due') paymentScore = 50;
  if (company.paymentStatus === 'failed') paymentScore = 0;
  
  // Engagement score (25%)
  const recentActivity = getRecentActivity(company, 30);
  const engagementScore = Math.min(100, recentActivity * 10);
  
  const overall = Math.round(
    (loginScore * 0.25) + 
    (usageScore * 0.25) + 
    (paymentScore * 0.25) + 
    (engagementScore * 0.25)
  );
  
  return {
    overall,
    login: loginScore,
    usage: usageScore,
    payment: paymentScore,
    engagement: engagementScore,
    status: overall >= 70 ? 'healthy' : overall >= 40 ? 'at_risk' : 'critical'
  };
}
```

---

## Implementation Priority

### Week 1-2: Core Metrics
- [ ] MRR/ARR calculation and display
- [ ] Customer count and tier breakdown
- [ ] Basic KPI cards
- [ ] MRR trend chart (12 months)

### Week 3-4: Unit Economics
- [ ] Marketing spend entry
- [ ] CAC calculation
- [ ] LTV calculation
- [ ] LTV/CAC ratio display
- [ ] Churn tracking

### Week 5-6: Customer Health
- [ ] Health score calculation (daily job)
- [ ] Health distribution display
- [ ] At-risk customer alerts
- [ ] Cohort retention table

### Week 7-8: Geography & Usage
- [ ] Geographic distribution tables
- [ ] Map visualization (optional)
- [ ] Feature adoption tracking
- [ ] Engagement metrics

### Week 9-10: Expense Tracking
- [ ] Chart of accounts setup
- [ ] Expense entry form
- [ ] Recurring expense templates
- [ ] Cash balance tracking

### Week 11-12: Reporting
- [ ] Income statement generator
- [ ] Cash flow summary
- [ ] GST/HST tracking
- [ ] Export functionality

---

## Success Metrics

After implementation, the dashboard should enable:

1. **Real-time MRR visibility** - Know exact revenue within seconds
2. **Churn detection** - Identify at-risk customers before they leave
3. **CAC optimization** - See which channels deliver best ROI
4. **Cash flow clarity** - Know runway without external tools
5. **Eliminate bookkeeping** - All financial data in one place
6. **Investor-ready metrics** - Standard SaaS KPIs on demand

---

## Notes

- All monetary values should display as $XX,XXX.XX (2 decimal places)
- All percentages should display as XX.X% (1 decimal place)
- Use green/yellow/red indicators for metric health
- Include date range selectors for all time-based metrics
- Cache expensive calculations (refresh hourly or daily)
- Log all admin actions for audit trail
