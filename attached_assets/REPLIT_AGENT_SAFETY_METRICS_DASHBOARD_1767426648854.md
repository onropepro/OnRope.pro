# Safety Metrics Dashboard

## Overview

Build a fourth superuser dashboard at `/superuser/safety` focused on real-time safety metrics that demonstrate OnRopePro's value as a digital safety management system. This dashboard serves two purposes:

1. **Internal Operations:** Track safety compliance across all platform users
2. **External Partnerships:** Generate proof points for IRATA, SPRAT, WorkSafe BC, OSHA, and insurance partners

**Strategic Goal:** Become the first approved method of digital IRATA/SPRAT task logging by demonstrating that our approach measurably improves safety outcomes.

**Reference for chart styling:** https://flowbite.com/docs/plugins/charts/

---

## Design Consistency Requirements

**CRITICAL:** This dashboard must match the existing design patterns in `/superuser/metrics` (Platform Metrics) and `/superuser/goals` (Goals & KPIs). Review those pages before building.

### Existing Dashboard Reference

| Element | Pattern to Follow |
|---------|-------------------|
| Page Layout | Same header structure, "← Back to Dashboard" link, subtitle text |
| Card Styling | `bg-white rounded-lg shadow p-6` with consistent spacing |
| Section Headers | `text-lg font-semibold text-gray-900 mb-2` with `text-sm text-gray-500 mb-4` subtitle |
| Color Palette | Blue (#1C64F2), Green (#10B981), Purple (#8B5CF6), Orange (#F59E0B), Cyan (#16BDCA) |
| Chart Heights | Gauges: 250-350px, Area/Line charts: 300px, Bar charts: 300px |
| Metric Cards | 4-column grid with icon, value, label, trend indicator |

### Shared Components to Reuse

Import and reuse these components already built for Platform Metrics and Goals & KPIs:

```typescript
// From existing superuser components
import { MetricCard } from '@/components/superuser/MetricCard';
import { GoalProgressGauge } from '@/components/charts/GoalProgress';
import { TrendIndicator } from '@/components/superuser/TrendIndicator';

// If these don't exist as separate components, extract them from:
// - /superuser/metrics page (MRR Breakdown donut, Customer Distribution radial)
// - /superuser/goals page (Summary tab gauges, Leading tab progress bars)
```

### Flowbite + ApexCharts Setup

Ensure these are already installed (should be from previous dashboard work):

```bash
npm install apexcharts flowbite flowbite-react
```

Import pattern for chart components:

```tsx
import Chart from 'react-apexcharts';
import { Card } from 'flowbite-react';
```

### Chart Configuration Standards

Match the existing chart configurations from Platform Metrics:

```typescript
// Standard chart config base
const baseChartConfig = {
  chart: {
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
  },
  stroke: { curve: 'smooth' },
  dataLabels: { enabled: false },
  legend: { 
    position: 'bottom',
    fontFamily: 'Inter, sans-serif',
  },
};

// Standard color sequences
const chartColors = {
  primary: ['#1C64F2', '#16BDCA', '#F59E0B', '#8B5CF6'],
  status: {
    excellent: '#10B981',
    good: '#F59E0B', 
    fair: '#F97316',
    poor: '#EF4444',
  },
  gradient: {
    from: 0.7,
    to: 0.2,
  },
};
```

### Tab Navigation Pattern

Match the Goals & KPIs tab structure:

```tsx
// Use the same tab component pattern from /superuser/goals
<Tabs aria-label="Safety metrics tabs" style="underline">
  <Tabs.Item active title="Overview" icon={ChartBarIcon}>
    <OverviewTab />
  </Tabs.Item>
  <Tabs.Item title="CSR Analytics" icon={BuildingOfficeIcon}>
    <CSRAnalyticsTab />
  </Tabs.Item>
  {/* ... etc */}
</Tabs>
```

---

## Why This Dashboard Matters

Currently, IRATA and SPRAT require physical logbooks. No digital platform has been approved for official certification logging. OnRopePro aims to change this by:

1. **Proving Digital Accuracy:** Showing that digital records are more accurate than paper (same-day logging vs. months-later catch-up)
2. **Demonstrating Compliance Improvement:** Aggregate data showing companies using the platform have better safety records
3. **Creating Industry Benchmarks:** Establishing CSR and PSR as industry-standard safety metrics
4. **Building Regulatory Relationships:** Providing data packages for WorkSafe BC, OSHA, and insurance companies

---

## Database Tables Reference

### Existing Tables (Core Safety Data)

```typescript
// Safety inspections
harness_inspections (
  id,
  tech_id,
  company_id,
  project_id,
  inspection_date,
  status,              // 'pass', 'fail', 'partial'
  equipment_items,     // JSON array of checked items
  notes,
  signature,
  created_at
)

// Toolbox meetings
toolbox_meetings (
  id,
  company_id,
  project_id,
  meeting_date,
  topic,
  safety_topics,       // Array of topics discussed
  attendees,           // Array of tech IDs
  signatures,          // JSON of attendee signatures
  created_at
)

// Work sessions (for compliance rate calculation)
work_sessions (
  id,
  tech_id,
  company_id,
  project_id,
  building_id,
  start_time,
  end_time,
  has_harness_inspection,
  has_toolbox_meeting,
  created_at
)

// IRATA/SPRAT task logging
irata_task_logs (
  id,
  tech_id,
  work_session_id,
  task_type,           // 'ascending', 'descending', 'rope_transfer', 'rigging', 'rescue', etc.
  hours,
  notes,
  logged_at,           // When the entry was created (same-day = more accurate)
  work_date,           // The actual work date
  created_at
)

// Certifications
certifications (
  id,
  tech_id,
  type,                // 'irata', 'sprat', 'first_aid', etc.
  level,               // 1, 2, 3 for IRATA/SPRAT
  cert_number,
  issue_date,
  expiry_date,
  status,              // 'active', 'expired', 'pending_renewal'
  created_at
)

// Incident reports
incident_reports (
  id,
  company_id,
  project_id,
  building_id,
  incident_type,       // 'injury', 'near_miss', 'property_damage', 'equipment_failure'
  severity,            // 'minor', 'moderate', 'serious', 'critical'
  description,
  injured_persons,
  witnesses,
  root_cause,
  corrective_actions,
  reported_by,
  reported_at,
  created_at
)

// CSR history
csr_rating_history (
  id,
  company_id,
  rating,
  documentation_penalty,
  toolbox_penalty,
  harness_penalty,
  document_review_penalty,
  calculated_at
)

// Company documents (for compliance tracking)
company_documents (
  id,
  company_id,
  document_type,       // 'coi', 'health_safety_manual', 'company_policy', 'swp', etc.
  uploaded_at,
  expires_at,
  status
)

// Employee document signatures
document_signatures (
  id,
  document_id,
  employee_id,
  signed_at,
  signature_data
)
```

### Tables That May Need Enhancement

```typescript
// PSR (Personal Safety Rating) tracking - may need dedicated table
psr_history (
  id,
  tech_id,
  rating,
  inspection_rate,
  document_signing_rate,
  calculated_at
)

// FLHA (Field Level Hazard Assessment)
flha_forms (
  id,
  company_id,
  project_id,
  building_id,
  tech_id,
  hazards_identified,  // JSON array
  control_measures,    // JSON array
  signature,
  created_at
)

// Anchor inspections
anchor_inspections (
  id,
  building_id,
  inspector_id,
  inspection_date,
  anchor_points,       // JSON array of anchor details
  status,              // 'pass', 'fail', 'needs_attention'
  next_inspection_due,
  created_at
)

// Equipment failures (from harness inspections)
equipment_failures (
  id,
  harness_inspection_id,
  equipment_type,
  equipment_id,        // Link to inventory
  failure_reason,
  action_taken,        // 'retired', 'repaired', 'replaced'
  created_at
)
```

---

## Part 1: Dashboard Layout Structure

The dashboard should have 6 main tabs:

1. **Overview** - Platform-wide safety health summary
2. **CSR Analytics** - Company Safety Rating trends and benchmarks
3. **PSR Analytics** - Personal Safety Rating distribution and trends
4. **Compliance Tracking** - Real-time compliance rates across all activities
5. **IRATA/SPRAT Metrics** - Digital logging statistics for certification bodies
6. **Partnership Reports** - Exportable reports for regulatory bodies

---

## Part 2: Overview Tab

### 2.1 Platform Safety Health Score

Composite score showing overall platform safety health:

```tsx
const PlatformSafetyScore = ({ score, components }) => {
  const getColor = (s) => s >= 90 ? '#10B981' : s >= 75 ? '#F59E0B' : '#EF4444';
  
  const options = {
    chart: { type: 'radialBar', height: 350 },
    series: [score],
    colors: [getColor(score)],
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: { size: '60%' },
        track: { background: '#E5E7EB' },
        dataLabels: {
          name: { 
            show: true, 
            fontSize: '16px',
            offsetY: 30,
            color: '#6B7280',
          },
          value: { 
            fontSize: '48px', 
            fontWeight: 'bold',
            offsetY: -10,
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    labels: ['Platform Safety Score'],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Platform Safety Health</h3>
      <p className="text-sm text-gray-500 mb-4">Aggregate safety metrics across all companies</p>
      <Chart options={options} series={options.series} type="radialBar" height={350} />
      
      {/* Component Breakdown */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        <ComponentCard label="Avg CSR" value={components.avgCSR} target={90} />
        <ComponentCard label="Inspection Rate" value={components.inspectionRate} target={95} />
        <ComponentCard label="Toolbox Rate" value={components.toolboxRate} target={95} />
        <ComponentCard label="Cert Current" value={components.certCurrentRate} target={100} />
      </div>
    </div>
  );
};
```

**Score Calculation:**
```typescript
function calculatePlatformSafetyScore() {
  const avgCSR = await getAverageCSR();
  const inspectionRate = await getHarnessInspectionComplianceRate();
  const toolboxRate = await getToolboxMeetingComplianceRate();
  const certCurrentRate = await getCertificationCurrentRate();
  
  // Weighted average
  return (
    (avgCSR * 0.30) +           // 30% weight
    (inspectionRate * 0.30) +   // 30% weight
    (toolboxRate * 0.25) +      // 25% weight
    (certCurrentRate * 0.15)    // 15% weight
  );
}
```

### 2.2 Key Safety Metrics Cards

```tsx
const SafetyMetricsGrid = ({ metrics }) => (
  <div className="grid grid-cols-4 gap-4">
    <MetricCard
      icon={<ShieldCheckIcon />}
      label="Total Harness Inspections"
      value={metrics.totalInspections.toLocaleString()}
      subtext="All time"
      trend={metrics.inspectionTrend}
      color="blue"
    />
    <MetricCard
      icon={<UsersIcon />}
      label="Toolbox Meetings"
      value={metrics.totalToolboxMeetings.toLocaleString()}
      subtext="All time"
      trend={metrics.toolboxTrend}
      color="green"
    />
    <MetricCard
      icon={<ClockIcon />}
      label="IRATA Hours Logged"
      value={metrics.totalIRATAHours.toLocaleString()}
      subtext="Digital records"
      trend={metrics.irataHoursTrend}
      color="purple"
    />
    <MetricCard
      icon={<ExclamationTriangleIcon />}
      label="Incident Rate"
      value={`${metrics.incidentRate.toFixed(2)}`}
      subtext="per 100,000 hours"
      trend={metrics.incidentTrend}
      trendInverse={true} // Lower is better
      color="orange"
    />
  </div>
);
```

**Data Queries:**

```sql
-- Total harness inspections
SELECT COUNT(*) as total_inspections,
       COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as last_30_days
FROM harness_inspections;

-- Total toolbox meetings
SELECT COUNT(*) as total_meetings,
       COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as last_30_days
FROM toolbox_meetings;

-- Total IRATA hours logged
SELECT SUM(hours) as total_hours,
       SUM(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN hours ELSE 0 END) as last_30_days
FROM irata_task_logs;

-- Incident rate calculation
SELECT 
  COUNT(ir.id) as incident_count,
  SUM(ws.total_hours) as total_work_hours,
  (COUNT(ir.id)::float / NULLIF(SUM(ws.total_hours), 0)) * 100000 as incident_rate_per_100k
FROM incident_reports ir
CROSS JOIN (
  SELECT SUM(EXTRACT(EPOCH FROM (end_time - start_time)) / 3600) as total_hours
  FROM work_sessions
  WHERE end_time IS NOT NULL
) ws;
```

### 2.3 Safety Activity Timeline

Real-time feed of safety activities across the platform:

```tsx
const SafetyActivityTimeline = ({ activities }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Live Safety Activity</h3>
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {activities.map(activity => (
        <ActivityItem 
          key={activity.id}
          icon={getActivityIcon(activity.type)}
          title={activity.title}
          company={activity.companyName}
          time={activity.timestamp}
          status={activity.status}
        />
      ))}
    </div>
  </div>
);

// Activity types: 'harness_inspection', 'toolbox_meeting', 'incident_report', 'cert_renewal', 'irata_log'
```

### 2.4 30-Day Safety Trend

```tsx
const SafetyTrendChart = ({ data }) => {
  const options = {
    chart: { type: 'area', height: 300, stacked: false, toolbar: { show: false } },
    series: [
      { name: 'Harness Inspections', data: data.inspections },
      { name: 'Toolbox Meetings', data: data.toolboxMeetings },
      { name: 'IRATA Logs', data: data.irataLogs },
    ],
    colors: ['#3B82F6', '#10B981', '#8B5CF6'],
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { opacityFrom: 0.4, opacityTo: 0.1 },
    },
    xaxis: { categories: data.dates, type: 'datetime' },
    yaxis: { title: { text: 'Daily Count' } },
    legend: { position: 'top' },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">30-Day Safety Activity Trend</h3>
      <Chart options={options} series={options.series} type="area" height={300} />
    </div>
  );
};
```

---

## Part 3: CSR Analytics Tab

### 3.1 CSR Distribution Chart

Shows distribution of all company CSR scores:

```tsx
const CSRDistributionChart = ({ distribution }) => {
  const options = {
    chart: { type: 'bar', height: 300, toolbar: { show: false } },
    series: [{
      name: 'Companies',
      data: [
        distribution.excellent,  // 90-100%
        distribution.good,       // 75-89%
        distribution.fair,       // 50-74%
        distribution.poor,       // Below 50%
      ],
    }],
    colors: ['#10B981', '#F59E0B', '#F97316', '#EF4444'],
    plotOptions: {
      bar: { 
        borderRadius: 8, 
        columnWidth: '60%',
        distributed: true,
      },
    },
    xaxis: {
      categories: ['Excellent (90-100%)', 'Good (75-89%)', 'Fair (50-74%)', 'Poor (<50%)'],
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val} companies`,
    },
    legend: { show: false },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">CSR Distribution</h3>
          <p className="text-sm text-gray-500">Company Safety Rating breakdown</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {((distribution.excellent + distribution.good) / distribution.total * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-gray-500">Above 75% threshold</div>
        </div>
      </div>
      <Chart options={options} series={options.series} type="bar" height={300} />
    </div>
  );
};
```

**Data Query:**

```sql
SELECT 
  COUNT(CASE WHEN rating >= 90 THEN 1 END) as excellent,
  COUNT(CASE WHEN rating >= 75 AND rating < 90 THEN 1 END) as good,
  COUNT(CASE WHEN rating >= 50 AND rating < 75 THEN 1 END) as fair,
  COUNT(CASE WHEN rating < 50 THEN 1 END) as poor,
  COUNT(*) as total,
  AVG(rating) as average_csr
FROM (
  SELECT DISTINCT ON (company_id) company_id, rating
  FROM csr_rating_history
  ORDER BY company_id, calculated_at DESC
) latest_csr;
```

### 3.2 CSR Improvement Over Time

Shows how CSR scores improve with platform usage:

```tsx
const CSRImprovementChart = ({ data }) => {
  const options = {
    chart: { type: 'line', height: 300, toolbar: { show: false } },
    series: [{
      name: 'Average CSR',
      data: data.avgCSRByTenure,
    }],
    colors: ['#10B981'],
    stroke: { curve: 'smooth', width: 3 },
    markers: { size: 6 },
    xaxis: {
      categories: ['Month 1', 'Month 2', 'Month 3', 'Month 6', 'Month 12', 'Month 18+'],
      title: { text: 'Time on Platform' },
    },
    yaxis: {
      title: { text: 'Average CSR Score' },
      min: 50,
      max: 100,
    },
    annotations: {
      yaxis: [{
        y: 75,
        borderColor: '#F59E0B',
        strokeDashArray: 5,
        label: { text: 'Good Threshold', style: { color: '#F59E0B' } },
      }],
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">CSR Improvement by Platform Tenure</h3>
          <p className="text-sm text-gray-500">Companies improve safety scores over time</p>
        </div>
        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          +{data.avgImprovement.toFixed(0)}% avg improvement
        </div>
      </div>
      <Chart options={options} series={options.series} type="line" height={300} />
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
        <strong>Partnership Proof Point:</strong> Companies using OnRopePro for 12+ months 
        show an average {data.avgImprovement.toFixed(0)}% improvement in safety compliance scores.
      </div>
    </div>
  );
};
```

**Data Query:**

```sql
WITH company_tenure AS (
  SELECT 
    c.id,
    EXTRACT(MONTH FROM AGE(NOW(), c.created_at)) as months_on_platform,
    first_csr.rating as initial_csr,
    latest_csr.rating as current_csr
  FROM companies c
  LEFT JOIN LATERAL (
    SELECT rating FROM csr_rating_history 
    WHERE company_id = c.id ORDER BY calculated_at ASC LIMIT 1
  ) first_csr ON true
  LEFT JOIN LATERAL (
    SELECT rating FROM csr_rating_history 
    WHERE company_id = c.id ORDER BY calculated_at DESC LIMIT 1
  ) latest_csr ON true
)
SELECT 
  CASE 
    WHEN months_on_platform < 1 THEN 'Month 1'
    WHEN months_on_platform < 2 THEN 'Month 2'
    WHEN months_on_platform < 3 THEN 'Month 3'
    WHEN months_on_platform < 6 THEN 'Month 6'
    WHEN months_on_platform < 12 THEN 'Month 12'
    ELSE 'Month 18+'
  END as tenure_band,
  AVG(current_csr) as avg_csr,
  AVG(current_csr - initial_csr) as avg_improvement
FROM company_tenure
GROUP BY 1
ORDER BY MIN(months_on_platform);
```

### 3.3 CSR Penalty Breakdown

Shows which areas companies struggle with most:

```tsx
const CSRPenaltyBreakdown = ({ data }) => {
  const options = {
    chart: { type: 'donut', height: 320 },
    series: [
      data.documentationPenalty,
      data.toolboxPenalty,
      data.harnessPenalty,
      data.documentReviewPenalty,
    ],
    labels: ['Documentation', 'Toolbox Meetings', 'Harness Inspections', 'Document Reviews'],
    colors: ['#EF4444', '#F97316', '#F59E0B', '#FBBF24'],
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Penalty',
              formatter: () => `${data.totalAvgPenalty.toFixed(1)}%`,
            },
          },
        },
      },
    },
    legend: { position: 'bottom' },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Average Penalty Distribution</h3>
      <p className="text-sm text-gray-500 mb-4">Where companies lose CSR points</p>
      <Chart options={options} series={options.series} type="donut" height={320} />
      
      {/* Actionable Insights */}
      <div className="mt-4 space-y-2">
        <InsightRow 
          area="Harness Inspections"
          penalty={data.harnessPenalty}
          action="Enforce pre-work inspection gate"
        />
        <InsightRow 
          area="Toolbox Meetings"
          penalty={data.toolboxPenalty}
          action="Require daily meeting before work sessions"
        />
      </div>
    </div>
  );
};
```

---

## Part 4: PSR Analytics Tab

### 4.1 PSR Distribution

Personal Safety Rating distribution across all technicians:

```tsx
const PSRDistributionChart = ({ data }) => {
  const options = {
    chart: { type: 'bar', height: 300, toolbar: { show: false } },
    series: [{
      name: 'Technicians',
      data: data.distribution,
    }],
    colors: ['#3B82F6'],
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: '70%' },
    },
    xaxis: {
      categories: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
      title: { text: 'PSR Score Range' },
    },
    yaxis: { title: { text: 'Number of Technicians' } },
    dataLabels: { enabled: true },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Personal Safety Rating Distribution</h3>
          <p className="text-sm text-gray-500">Individual technician safety scores</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{data.avgPSR.toFixed(0)}%</div>
          <div className="text-sm text-gray-500">Platform Average</div>
        </div>
      </div>
      <Chart options={options} series={options.series} type="bar" height={300} />
    </div>
  );
};
```

**Data Query:**

```sql
-- PSR Calculation per technician
WITH tech_psr AS (
  SELECT 
    t.id as tech_id,
    -- Inspection rate (across all employers)
    COALESCE(
      (SELECT COUNT(*) FILTER (WHERE hi.status = 'pass')::float / NULLIF(COUNT(*), 0) * 100
       FROM harness_inspections hi WHERE hi.tech_id = t.id), 0
    ) as inspection_rate,
    -- Document signing rate
    COALESCE(
      (SELECT COUNT(ds.id)::float / NULLIF(COUNT(d.id), 0) * 100
       FROM company_documents d
       LEFT JOIN document_signatures ds ON d.id = ds.document_id AND ds.employee_id = t.id
       WHERE d.company_id IN (SELECT company_id FROM employees WHERE tech_id = t.id)),
      0
    ) as signing_rate
  FROM tech_accounts t
)
SELECT 
  CASE 
    WHEN (inspection_rate * 0.6 + signing_rate * 0.4) < 20 THEN '0-20%'
    WHEN (inspection_rate * 0.6 + signing_rate * 0.4) < 40 THEN '20-40%'
    WHEN (inspection_rate * 0.6 + signing_rate * 0.4) < 60 THEN '40-60%'
    WHEN (inspection_rate * 0.6 + signing_rate * 0.4) < 80 THEN '60-80%'
    ELSE '80-100%'
  END as psr_band,
  COUNT(*) as tech_count,
  AVG(inspection_rate * 0.6 + signing_rate * 0.4) as avg_psr
FROM tech_psr
GROUP BY 1
ORDER BY 1;
```

### 4.2 PSR Impact on Hiring

Shows correlation between PSR and employment:

```tsx
const PSRHiringCorrelation = ({ data }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">PSR Impact on Employment</h3>
    
    <div className="grid grid-cols-3 gap-4 mb-6">
      <StatCard 
        label="High PSR (80%+)" 
        value={`${data.highPSR.avgJobOffers.toFixed(1)}`}
        subtext="avg job offers received"
        color="green"
      />
      <StatCard 
        label="Medium PSR (50-79%)" 
        value={`${data.mediumPSR.avgJobOffers.toFixed(1)}`}
        subtext="avg job offers received"
        color="yellow"
      />
      <StatCard 
        label="Low PSR (<50%)" 
        value={`${data.lowPSR.avgJobOffers.toFixed(1)}`}
        subtext="avg job offers received"
        color="red"
      />
    </div>
    
    <div className="p-4 bg-green-50 rounded-lg">
      <strong>Key Finding:</strong> Technicians with PSR above 80% receive 
      {((data.highPSR.avgJobOffers / data.lowPSR.avgJobOffers - 1) * 100).toFixed(0)}% 
      more job offers than those below 50%.
    </div>
  </div>
);
```

### 4.3 PSR Components Breakdown

```tsx
const PSRComponentsChart = ({ data }) => {
  const options = {
    chart: { type: 'radar', height: 350 },
    series: [{
      name: 'Platform Average',
      data: [
        data.avgInspectionRate,
        data.avgDocSigningRate,
        data.avgToolboxAttendance,
        data.avgCertCurrency,
      ],
    }],
    colors: ['#3B82F6'],
    xaxis: {
      categories: ['Harness Inspections', 'Document Signing', 'Toolbox Attendance', 'Cert Currency'],
    },
    yaxis: { show: false, max: 100 },
    markers: { size: 4 },
    fill: { opacity: 0.2 },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">PSR Components Analysis</h3>
      <p className="text-sm text-gray-500 mb-4">What contributes to Personal Safety Rating</p>
      <Chart options={options} series={options.series} type="radar" height={350} />
    </div>
  );
};
```

---

## Part 5: Compliance Tracking Tab

### 5.1 Real-Time Compliance Dashboard

```tsx
const ComplianceDashboard = ({ metrics }) => (
  <div className="space-y-6">
    {/* Compliance Rate Gauges */}
    <div className="grid grid-cols-4 gap-4">
      <ComplianceGauge 
        label="Harness Inspection Rate"
        rate={metrics.harnessInspectionRate}
        target={95}
        description="Work sessions with valid inspection"
      />
      <ComplianceGauge 
        label="Toolbox Meeting Coverage"
        rate={metrics.toolboxCoverageRate}
        target={95}
        description="Work sessions with meeting coverage"
      />
      <ComplianceGauge 
        label="Document Acknowledgment"
        rate={metrics.documentAckRate}
        target={100}
        description="Employees signed all required docs"
      />
      <ComplianceGauge 
        label="Certification Currency"
        rate={metrics.certCurrentRate}
        target={100}
        description="Techs with current certifications"
      />
    </div>
    
    {/* Compliance Trend */}
    <ComplianceTrendChart data={metrics.trendData} />
    
    {/* Non-Compliance Alerts */}
    <NonComplianceAlerts alerts={metrics.alerts} />
  </div>
);
```

### 5.2 Harness Inspection Analytics

```tsx
const HarnessInspectionAnalytics = ({ data }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Harness Inspection Analytics</h3>
    
    <div className="grid grid-cols-4 gap-4 mb-6">
      <MetricBox label="Total Inspections" value={data.total.toLocaleString()} />
      <MetricBox label="Pass Rate" value={`${data.passRate.toFixed(1)}%`} />
      <MetricBox label="Avg Time to Complete" value={`${data.avgDuration} min`} />
      <MetricBox label="Equipment Failures" value={data.failures.toLocaleString()} />
    </div>
    
    {/* Equipment Failure Breakdown */}
    <div className="mb-6">
      <h4 className="text-sm font-medium mb-3">Equipment Failure by Type</h4>
      <EquipmentFailureChart data={data.failuresByType} />
    </div>
    
    {/* Time of Day Analysis */}
    <div>
      <h4 className="text-sm font-medium mb-3">Inspection Time Distribution</h4>
      <TimeOfDayChart data={data.byTimeOfDay} />
    </div>
  </div>
);
```

**Data Query:**

```sql
-- Harness inspection analytics
SELECT 
  COUNT(*) as total_inspections,
  COUNT(CASE WHEN status = 'pass' THEN 1 END)::float / COUNT(*) * 100 as pass_rate,
  AVG(EXTRACT(EPOCH FROM (created_at - inspection_start_time)) / 60) as avg_duration_minutes,
  COUNT(CASE WHEN status = 'fail' THEN 1 END) as total_failures
FROM harness_inspections
WHERE created_at > NOW() - INTERVAL '90 days';

-- Equipment failure breakdown
SELECT 
  equipment_type,
  COUNT(*) as failure_count,
  COUNT(*)::float / SUM(COUNT(*)) OVER() * 100 as percentage
FROM equipment_failures
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY equipment_type
ORDER BY failure_count DESC;

-- Time of day distribution
SELECT 
  EXTRACT(HOUR FROM created_at) as hour,
  COUNT(*) as inspection_count
FROM harness_inspections
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY 1
ORDER BY 1;
```

### 5.3 Toolbox Meeting Analytics

```tsx
const ToolboxMeetingAnalytics = ({ data }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Toolbox Meeting Analytics</h3>
    
    <div className="grid grid-cols-4 gap-4 mb-6">
      <MetricBox label="Total Meetings" value={data.total.toLocaleString()} />
      <MetricBox label="Avg Attendees" value={data.avgAttendees.toFixed(1)} />
      <MetricBox label="Avg Topics/Meeting" value={data.avgTopics.toFixed(1)} />
      <MetricBox label="Coverage Rate" value={`${data.coverageRate.toFixed(1)}%`} />
    </div>
    
    {/* Most Discussed Topics */}
    <div className="mb-6">
      <h4 className="text-sm font-medium mb-3">Most Discussed Safety Topics</h4>
      <TopicFrequencyChart data={data.topicFrequency} />
    </div>
    
    {/* Meeting Duration Trend */}
    <div>
      <h4 className="text-sm font-medium mb-3">Average Meeting Duration Trend</h4>
      <MeetingDurationTrend data={data.durationTrend} />
    </div>
  </div>
);
```

---

## Part 6: IRATA/SPRAT Metrics Tab

### 6.1 Digital Logging Statistics

Key metrics to demonstrate to IRATA/SPRAT that digital logging is accurate:

```tsx
const DigitalLoggingStats = ({ data }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-purple-100 rounded-lg">
        <ClipboardDocumentListIcon className="w-6 h-6 text-purple-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">IRATA/SPRAT Digital Logging</h3>
        <p className="text-sm text-gray-500">Proof of digital logging accuracy</p>
      </div>
    </div>
    
    {/* Key Stats Grid */}
    <div className="grid grid-cols-4 gap-4 mb-6">
      <StatCard 
        label="Total Hours Logged"
        value={data.totalHours.toLocaleString()}
        subtext="across all technicians"
        color="purple"
      />
      <StatCard 
        label="Same-Day Logging Rate"
        value={`${data.sameDayRate.toFixed(1)}%`}
        subtext="logged within 24 hours"
        color="green"
      />
      <StatCard 
        label="Technicians Logging"
        value={data.activeTechsLogging.toLocaleString()}
        subtext="with digital records"
        color="blue"
      />
      <StatCard 
        label="Avg Hours/Tech/Month"
        value={data.avgHoursPerTech.toFixed(1)}
        subtext="active loggers"
        color="cyan"
      />
    </div>
    
    {/* Same-Day vs Delayed Logging Comparison */}
    <div className="bg-purple-50 rounded-lg p-4 mb-6">
      <h4 className="font-semibold text-purple-800 mb-3">Why Digital Logging is More Accurate</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded p-3">
          <div className="text-2xl font-bold text-green-600">{data.sameDayRate.toFixed(0)}%</div>
          <div className="text-sm text-gray-600">OnRopePro: Logged same day</div>
        </div>
        <div className="bg-white rounded p-3">
          <div className="text-2xl font-bold text-red-600">~20%</div>
          <div className="text-sm text-gray-600">Paper logbooks: Logged same day*</div>
        </div>
      </div>
      <p className="text-xs text-purple-600 mt-2">
        *Industry estimate: most paper entries are backfilled weeks/months later
      </p>
    </div>
    
    {/* Task Type Distribution */}
    <TaskTypeDistributionChart data={data.taskDistribution} />
  </div>
);
```

**Data Query:**

```sql
-- IRATA logging statistics
SELECT 
  SUM(hours) as total_hours,
  COUNT(DISTINCT tech_id) as active_techs_logging,
  AVG(hours) as avg_hours_per_entry,
  
  -- Same-day logging rate
  COUNT(CASE WHEN DATE(logged_at) = work_date THEN 1 END)::float / 
  NULLIF(COUNT(*), 0) * 100 as same_day_rate,
  
  -- Next-day logging rate
  COUNT(CASE WHEN DATE(logged_at) = work_date + INTERVAL '1 day' THEN 1 END)::float / 
  NULLIF(COUNT(*), 0) * 100 as next_day_rate,
  
  -- Delayed logging (>7 days)
  COUNT(CASE WHEN DATE(logged_at) > work_date + INTERVAL '7 days' THEN 1 END)::float / 
  NULLIF(COUNT(*), 0) * 100 as delayed_rate

FROM irata_task_logs;

-- Task type distribution
SELECT 
  task_type,
  SUM(hours) as total_hours,
  COUNT(*) as entry_count,
  COUNT(DISTINCT tech_id) as techs_logging
FROM irata_task_logs
GROUP BY task_type
ORDER BY total_hours DESC;
```

### 6.2 Certification Tracking

```tsx
const CertificationTracking = ({ data }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Certification Analytics</h3>
    
    {/* Certification Breakdown by Level */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      <CertLevelCard level={1} count={data.level1} current={data.level1Current} />
      <CertLevelCard level={2} count={data.level2} current={data.level2Current} />
      <CertLevelCard level={3} count={data.level3} current={data.level3Current} />
    </div>
    
    {/* Expiring Soon Alert */}
    <div className="mb-6">
      <h4 className="text-sm font-medium mb-3">Certifications Expiring Soon</h4>
      <ExpiringCertsTable data={data.expiringSoon} />
    </div>
    
    {/* IRATA vs SPRAT Distribution */}
    <div className="grid grid-cols-2 gap-4">
      <CertTypeChart type="IRATA" data={data.irata} />
      <CertTypeChart type="SPRAT" data={data.sprat} />
    </div>
  </div>
);
```

### 6.3 Level 3 Progression Tracking

Track technicians progressing toward Level 3:

```tsx
const Level3ProgressionChart = ({ data }) => {
  const options = {
    chart: { type: 'bar', height: 300, stacked: true, toolbar: { show: false } },
    series: [
      { name: 'Ascending/Descending', data: data.basicHours },
      { name: 'Rigging', data: data.riggingHours },
      { name: 'Rescue', data: data.rescueHours },
    ],
    colors: ['#3B82F6', '#10B981', '#F59E0B'],
    plotOptions: {
      bar: { horizontal: true, barHeight: '60%' },
    },
    xaxis: {
      title: { text: 'Logged Hours' },
    },
    yaxis: {
      categories: data.techNames,
    },
    annotations: {
      xaxis: [{
        x: 1000,
        borderColor: '#EF4444',
        strokeDashArray: 5,
        label: { text: 'Level 3 Threshold', style: { color: '#EF4444' } },
      }],
    },
    legend: { position: 'top' },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Level 3 Progression Tracking</h3>
      <p className="text-sm text-gray-500 mb-4">
        Technicians approaching Level 3 certification eligibility
      </p>
      <Chart options={options} series={options.series} type="bar" height={300} />
    </div>
  );
};
```

---

## Part 7: Partnership Reports Tab

### 7.1 Report Generator

Generate exportable reports for regulatory bodies:

```tsx
const PartnershipReports = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Partnership Report Generator</h3>
      <p className="text-sm text-gray-500 mb-6">
        Generate data packages for regulatory bodies and potential partners
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        <ReportCard
          title="IRATA/SPRAT Digital Logging Report"
          description="Demonstrates accuracy and compliance of digital task logging"
          includes={[
            'Same-day logging rates',
            'Task type distribution',
            'Certification tracking integration',
            'Audit trail samples',
          ]}
          onGenerate={() => generateIRATAReport()}
        />
        
        <ReportCard
          title="WorkSafe BC Compliance Report"
          description="Safety documentation and inspection compliance data"
          includes={[
            'Harness inspection completion rates',
            'Toolbox meeting coverage',
            'Incident rates and trends',
            'Document acknowledgment tracking',
          ]}
          onGenerate={() => generateWorkSafeReport()}
        />
        
        <ReportCard
          title="Insurance Partner Data Package"
          description="Risk assessment data for insurance underwriting"
          includes={[
            'CSR distribution and trends',
            'Incident frequency rates',
            'Equipment failure tracking',
            'Training compliance rates',
          ]}
          onGenerate={() => generateInsuranceReport()}
        />
        
        <ReportCard
          title="Industry Benchmark Report"
          description="Aggregate safety metrics for industry comparison"
          includes={[
            'Platform-wide safety scores',
            'Compliance rate benchmarks',
            'Best practice identification',
            'Anonymized company comparisons',
          ]}
          onGenerate={() => generateBenchmarkReport()}
        />
      </div>
    </div>
    
    {/* Recent Reports */}
    <RecentReportsTable reports={recentReports} />
  </div>
);
```

### 7.2 IRATA/SPRAT Partnership Proof Points

```tsx
const IRATAPartnershipCard = ({ metrics }) => (
  <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-lg shadow-lg p-8 text-white">
    <h3 className="text-2xl font-bold mb-6">IRATA/SPRAT Partnership Readiness</h3>
    
    <div className="grid grid-cols-2 gap-8">
      <div>
        <h4 className="text-purple-200 text-sm uppercase tracking-wide mb-3">
          Digital Logging Accuracy
        </h4>
        <div className="space-y-3">
          <ProofPoint 
            label="Same-Day Logging" 
            value={`${metrics.sameDayRate.toFixed(0)}%`}
            benchmark="vs ~20% paper"
            passing={metrics.sameDayRate > 80}
          />
          <ProofPoint 
            label="Audit Trail Complete" 
            value={metrics.auditTrailComplete ? 'Yes' : 'No'}
            benchmark="Immutable records"
            passing={metrics.auditTrailComplete}
          />
          <ProofPoint 
            label="Task Categorization" 
            value={`${metrics.taskCategories} types`}
            benchmark="IRATA aligned"
            passing={metrics.taskCategories >= 10}
          />
        </div>
      </div>
      
      <div>
        <h4 className="text-purple-200 text-sm uppercase tracking-wide mb-3">
          Data Quality
        </h4>
        <div className="space-y-3">
          <ProofPoint 
            label="Total Hours Tracked" 
            value={metrics.totalHours.toLocaleString()}
            benchmark="Significant sample"
            passing={metrics.totalHours > 10000}
          />
          <ProofPoint 
            label="Active Technicians" 
            value={metrics.activeTechs.toLocaleString()}
            benchmark="Industry adoption"
            passing={metrics.activeTechs > 100}
          />
          <ProofPoint 
            label="Employer Verification" 
            value={`${metrics.employerVerificationRate.toFixed(0)}%`}
            benchmark=">90% target"
            passing={metrics.employerVerificationRate > 90}
          />
        </div>
      </div>
    </div>
    
    <div className="mt-8 pt-6 border-t border-purple-600">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-purple-200 text-sm">Partnership Readiness Score</div>
          <div className="text-4xl font-bold">{metrics.readinessScore}/100</div>
        </div>
        <button 
          onClick={() => generateIRATAProposal()}
          className="px-6 py-3 bg-white text-purple-900 rounded-lg font-semibold hover:bg-purple-100"
        >
          Generate Partnership Proposal
        </button>
      </div>
    </div>
  </div>
);
```

### 7.3 WorkSafe BC / OSHA Compliance Summary

```tsx
const RegulatoryComplianceCard = ({ metrics }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Regulatory Compliance Summary</h3>
    
    <div className="grid grid-cols-2 gap-6">
      {/* WorkSafe BC */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <img src="/worksafe-logo.png" alt="WorkSafe BC" className="h-8" />
          <span className="font-semibold">WorkSafe BC Alignment</span>
        </div>
        <div className="space-y-3">
          <ComplianceRow 
            requirement="Daily Equipment Inspection" 
            status={metrics.dailyInspectionRate > 95}
            value={`${metrics.dailyInspectionRate.toFixed(0)}%`}
          />
          <ComplianceRow 
            requirement="Pre-Work Safety Briefing" 
            status={metrics.toolboxRate > 95}
            value={`${metrics.toolboxRate.toFixed(0)}%`}
          />
          <ComplianceRow 
            requirement="Incident Documentation" 
            status={metrics.incidentDocRate === 100}
            value={`${metrics.incidentDocRate.toFixed(0)}%`}
          />
          <ComplianceRow 
            requirement="Training Records" 
            status={metrics.trainingRecordRate > 90}
            value={`${metrics.trainingRecordRate.toFixed(0)}%`}
          />
        </div>
      </div>
      
      {/* OSHA */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <img src="/osha-logo.png" alt="OSHA" className="h-8" />
          <span className="font-semibold">OSHA Alignment</span>
        </div>
        <div className="space-y-3">
          <ComplianceRow 
            requirement="Fall Protection Documentation" 
            status={metrics.fallProtectionRate > 95}
            value={`${metrics.fallProtectionRate.toFixed(0)}%`}
          />
          <ComplianceRow 
            requirement="PPE Inspection Records" 
            status={metrics.ppeInspectionRate > 95}
            value={`${metrics.ppeInspectionRate.toFixed(0)}%`}
          />
          <ComplianceRow 
            requirement="Hazard Communication" 
            status={metrics.hazCommRate > 90}
            value={`${metrics.hazCommRate.toFixed(0)}%`}
          />
          <ComplianceRow 
            requirement="Recordkeeping (300 Log)" 
            status={true}
            value="Digital"
          />
        </div>
      </div>
    </div>
  </div>
);
```

---

## Part 8: Component Reuse Checklist

Before building new components, check if these already exist in the codebase:

### From Platform Metrics (`/superuser/metrics`)

| Component | Reuse For |
|-----------|-----------|
| Top KPI Cards layout | Overview tab metric cards |
| MRR Breakdown Donut | CSR Penalty Breakdown donut |
| Customer Distribution Radial | PSR Distribution radial |
| MRR Growth Area Chart | Safety Activity Trend area chart |
| Geographic Bar Chart | Any horizontal bar charts |
| Platform Averages Card | Compliance rate summary cards |

### From Goals & KPIs (`/superuser/goals`)

| Component | Reuse For |
|-----------|-----------|
| GoalProgressGauge | Platform Safety Score gauge, Compliance rate gauges |
| LeadingMetricCard | CSR/PSR metric cards with trends |
| Progress bars with trajectory | Compliance tracking progress |
| SMART Goals timeline | Partnership readiness timeline |
| Tabs structure | All 6 tab navigation |

### New Components Needed

Only create these if they don't exist:

| Component | Purpose |
|-----------|---------|
| `SafetyActivityTimeline` | Real-time feed of safety events |
| `ComplianceGauge` | Variant of GoalProgressGauge for compliance % |
| `PartnershipReportCard` | Report generator card with checklist |
| `ProofPointRow` | Green/red indicator for partnership readiness |

### Style Matching Verification

After implementation, verify:

- [ ] Card shadows match existing dashboards (`shadow` not `shadow-lg`)
- [ ] Font sizes match (headers `text-lg`, subtitles `text-sm`)
- [ ] Color usage matches existing palette
- [ ] Chart heights are consistent
- [ ] Spacing/padding matches (`p-6` for cards, `gap-4` for grids)
- [ ] Tab styling matches Goals & KPIs page
- [ ] Mobile responsiveness matches existing pages

---

## Part 9: API Endpoints

### GET /api/superuser/safety

```typescript
export async function GET() {
  return Response.json({
    platformScore: await calculatePlatformSafetyScore(),
    
    overview: {
      totalInspections: await countTotalInspections(),
      totalToolboxMeetings: await countTotalToolboxMeetings(),
      totalIRATAHours: await sumIRATAHours(),
      incidentRate: await calculateIncidentRate(),
      recentActivity: await getRecentSafetyActivity(20),
    },
    
    csrAnalytics: {
      distribution: await getCSRDistribution(),
      improvementByTenure: await getCSRImprovementByTenure(),
      penaltyBreakdown: await getAveragePenaltyBreakdown(),
    },
    
    psrAnalytics: {
      distribution: await getPSRDistribution(),
      avgPSR: await getAveragePSR(),
      hiringCorrelation: await getPSRHiringCorrelation(),
      components: await getPSRComponentsBreakdown(),
    },
    
    compliance: {
      harnessInspectionRate: await getHarnessInspectionRate(),
      toolboxCoverageRate: await getToolboxCoverageRate(),
      documentAckRate: await getDocumentAckRate(),
      certCurrentRate: await getCertificationCurrentRate(),
      trends: await getComplianceTrends(30),
    },
    
    irataSprat: {
      totalHoursLogged: await sumIRATAHours(),
      sameDayRate: await getSameDayLoggingRate(),
      activeTechsLogging: await countActiveTechsLogging(),
      taskDistribution: await getTaskTypeDistribution(),
      certificationBreakdown: await getCertificationBreakdown(),
    },
    
    partnershipReadiness: {
      irataScore: await calculateIRATAReadinessScore(),
      worksafeAlignment: await calculateWorksafeAlignment(),
      oshaAlignment: await calculateOSHAAlignment(),
    },
  });
}
```

---

## Part 10: Tracking Gaps Report

After reviewing the database schema, create a report listing any metrics that cannot be calculated:

```markdown
# Safety Tracking Gaps Report

## Missing Tables

### 1. psr_history
**Purpose:** Track Personal Safety Rating over time
**Required Fields:**
- tech_id, rating, inspection_rate, document_signing_rate, calculated_at

**Metrics Blocked:**
- PSR trend analysis
- PSR improvement tracking

### 2. flha_forms
**Purpose:** Track Field Level Hazard Assessments
**Required Fields:**
- company_id, project_id, building_id, tech_id, hazards_identified, control_measures, signature, created_at

**Metrics Blocked:**
- FLHA compliance rate
- Hazard identification patterns

### 3. anchor_inspections
**Purpose:** Track anchor point inspections
**Required Fields:**
- building_id, inspector_id, inspection_date, anchor_points, status, next_inspection_due

**Metrics Blocked:**
- Anchor inspection compliance
- Building anchor health

### 4. equipment_failures
**Purpose:** Track equipment failures from inspections
**Required Fields:**
- harness_inspection_id, equipment_type, equipment_id, failure_reason, action_taken

**Metrics Blocked:**
- Equipment failure patterns
- Predictive maintenance signals

## Missing Fields on Existing Tables

### irata_task_logs
- logged_at: When the entry was created (vs work_date)
  - Required for same-day logging rate calculation

### harness_inspections
- inspection_start_time: When inspection began
  - Required for duration calculation
- equipment_items: JSON of each item checked
  - Required for equipment failure breakdown

### incident_reports
- severity: Severity classification
- root_cause: Root cause analysis
- corrective_actions: Actions taken

## Tracking Events Needed

### Employer Hour Verification
Track when employers verify/sign off on logged hours
- Required for IRATA partnership (supervisor signatures)

### Document Version Tracking
Track which version of document each employee signed
- Required for compliance audit trail
```

---

## Summary

This Safety Metrics Dashboard provides:

1. **Platform-Wide Safety Health** - Aggregate metrics across all companies
2. **CSR Analytics** - Company Safety Rating trends and improvement tracking
3. **PSR Analytics** - Personal Safety Rating distribution and hiring impact
4. **Real-Time Compliance** - Live tracking of inspection and meeting compliance
5. **IRATA/SPRAT Proof Points** - Data proving digital logging accuracy
6. **Partnership Reports** - Exportable packages for regulatory bodies

**Strategic Value:**
- Prove to IRATA/SPRAT that digital logging is more accurate than paper
- Demonstrate to WorkSafe BC/OSHA that OnRopePro improves safety outcomes
- Provide insurance partners with risk assessment data
- Establish CSR/PSR as industry-standard safety metrics
