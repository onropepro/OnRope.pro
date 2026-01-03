# Superuser Dashboard Update: Platform Metrics & Goals/KPIs

## Overview

Update the Platform Metrics and Goals & KPIs pages in `/superuser` to:
1. Reflect our current pricing model (already implemented elsewhere in the app)
2. Replace static displays with dynamic Flowbite/ApexCharts visualizations
3. Ensure all metrics pull from actual database records (no hardcoding)

**Reference for chart styling:** https://flowbite.com/docs/plugins/charts/

---

## Current Pricing Model (Already in App)

The core app already uses this pricing. The superuser dashboards need to match:

| Component | Price | Notes |
|-----------|-------|-------|
| Base Fee (Monthly) | $99/month | Per account |
| Base Fee (Annual) | $82.17/month | 17% discount |
| Per Employee (1-29) | $34.95/month | Standard rate |
| Per Employee (30+) | $29.95/month | Volume discount |
| White Label | $49/month | Branding add-on |

**MRR Calculation Formula:**
```typescript
function calculateCustomerMRR(customer) {
  const isAnnual = customer.billingCycle === 'annual';
  const baseFee = isAnnual ? 82.17 : 99;
  
  const employeeCount = customer.activeEmployees || 0;
  const empRate = employeeCount >= 30 ? 29.95 : 34.95;
  
  const employeeFees = employeeCount * empRate;
  const whiteLabelFee = customer.hasWhiteLabel ? 49 : 0;
  
  return baseFee + employeeFees + whiteLabelFee;
}
```

---

## Financial Model Targets (Year 1 - Dec 31, 2026)

| Metric | Goal | Deadline |
|--------|------|----------|
| Tech Accounts | 500 | Jun 30, 2026 |
| Viral Coefficient | ≥1.0 | Q2 2026 |
| Trial Starts | 10/month | Ongoing |
| Trial-to-Paid Conversion | 40% | Ongoing |
| Paying Customers | 28 | Dec 31, 2026 |
| MRR | $19,964 | Dec 31, 2026 |
| ARPU | $713/month | Target |
| Monthly Churn | <0.83% | Ongoing |
| NRR | ≥115% | Ongoing |
| CAC | <$1,500 | Y1 |
| LTV | $81,330 | At 10% churn |
| LTV:CAC Ratio | >54x | Y1 |

---

## Part 1: Install Dependencies

```bash
npm install apexcharts flowbite flowbite-react
```

---

## Part 2: Platform Metrics Page (`/superuser/metrics`)

### 2.1 Top KPI Cards

Keep the current 4-card layout but ensure all values are dynamically calculated:

```typescript
const topMetrics = {
  mrr: await calculateTotalMRR(), // SUM of all active customer MRRs
  arr: mrr * 12, // Always calculated, never stored
  activeCustomers: await countActiveCustomers(),
  trialCustomers: await countTrialCustomers(),
  newSignups: await countSignups({ days: 30 }),
};
```

### 2.2 REMOVE: Old Tier Breakdown

**Delete the "MRR by Subscription Tier" section** that shows:
- Basic ($79)
- Starter ($299)
- Premium ($499)
- Enterprise ($899)

This pricing model no longer exists.

### 2.3 ADD: MRR Breakdown Donut Chart

Replace the tier breakdown with a donut chart showing MRR components:

```tsx
import Chart from 'react-apexcharts';

const MRRBreakdownChart = ({ baseRevenue, employeeRevenue, whiteLabelRevenue }) => {
  const total = baseRevenue + employeeRevenue + whiteLabelRevenue;
  
  const options = {
    chart: {
      type: 'donut',
      height: 320,
    },
    series: [baseRevenue, employeeRevenue, whiteLabelRevenue],
    labels: ['Base Fees', 'Employee Fees', 'White Label'],
    colors: ['#1C64F2', '#16BDCA', '#F59E0B'],
    legend: {
      position: 'bottom',
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontFamily: 'Inter, sans-serif',
              offsetY: 20,
            },
            total: {
              show: true,
              label: 'Total MRR',
              fontFamily: 'Inter, sans-serif',
              formatter: () => `$${total.toLocaleString()}`,
            },
            value: {
              show: true,
              fontFamily: 'Inter, sans-serif',
              offsetY: -20,
              formatter: (val) => `$${Number(val).toLocaleString()}`,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">MRR Breakdown</h3>
      <p className="text-sm text-gray-500 mb-4">Revenue by pricing component</p>
      <Chart options={options} series={options.series} type="donut" height={320} />
    </div>
  );
};
```

**Data Query:**
```typescript
const mrrBreakdown = await db.query(`
  SELECT 
    SUM(CASE WHEN billing_cycle = 'annual' THEN 82.17 ELSE 99 END) as base_revenue,
    SUM(
      CASE 
        WHEN employee_count >= 30 THEN employee_count * 29.95
        ELSE employee_count * 34.95 
      END
    ) as employee_revenue,
    SUM(CASE WHEN has_white_label = true THEN 49 ELSE 0 END) as white_label_revenue
  FROM customers 
  WHERE billing_status = 'active'
`);
```

### 2.4 UPDATE: Customer Distribution Chart

**Remove** the Basic/Starter/Premium/Enterprise pie chart.

**Replace with** company size distribution (radial bar):

```tsx
const CustomerSizeChart = ({ distribution }) => {
  const { solo, small, medium, large } = distribution;
  const total = solo + small + medium + large;
  
  const options = {
    chart: {
      type: 'radialBar',
      height: 350,
    },
    series: [
      Math.round((solo / total) * 100),
      Math.round((small / total) * 100),
      Math.round((medium / total) * 100),
      Math.round((large / total) * 100),
    ],
    labels: ['Solo (1-3)', 'Small (4-9)', 'Medium (10-29)', 'Large (30+)'],
    colors: ['#16BDCA', '#1C64F2', '#9061F9', '#F59E0B'],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: { fontSize: '14px' },
          value: { fontSize: '16px', formatter: (val) => `${val}%` },
          total: {
            show: true,
            label: 'Total',
            formatter: () => `${total} companies`,
          },
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Distribution</h3>
      <p className="text-sm text-gray-500 mb-4">Breakdown by company size</p>
      <Chart options={options} series={options.series} type="radialBar" height={350} />
    </div>
  );
};
```

**Data Query:**
```typescript
const sizeDistribution = await db.query(`
  SELECT 
    COUNT(CASE WHEN employee_count BETWEEN 1 AND 3 THEN 1 END) as solo,
    COUNT(CASE WHEN employee_count BETWEEN 4 AND 9 THEN 1 END) as small,
    COUNT(CASE WHEN employee_count BETWEEN 10 AND 29 THEN 1 END) as medium,
    COUNT(CASE WHEN employee_count >= 30 THEN 1 END) as large
  FROM customers 
  WHERE billing_status = 'active'
`);
```

### 2.5 ADD: MRR Growth Trend Chart

New area chart showing MRR over time with goal line:

```tsx
const MRRGrowthChart = ({ mrrHistory, goalMRR = 19964 }) => {
  const options = {
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false },
    },
    series: [{
      name: 'MRR',
      data: mrrHistory.map(m => m.value),
    }],
    colors: ['#1C64F2'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      categories: mrrHistory.map(m => m.month),
      labels: { style: { fontFamily: 'Inter, sans-serif' } },
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${val.toLocaleString()}`,
        style: { fontFamily: 'Inter, sans-serif' },
      },
    },
    annotations: {
      yaxis: [{
        y: goalMRR,
        borderColor: '#10B981',
        borderWidth: 2,
        strokeDashArray: 5,
        label: {
          text: `Y1 Goal: $${goalMRR.toLocaleString()}`,
          style: {
            color: '#10B981',
            background: '#D1FAE5',
          },
        },
      }],
    },
    tooltip: {
      y: { formatter: (val) => `$${val.toLocaleString()}` },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">MRR Growth</h3>
      <p className="text-sm text-gray-500 mb-4">Monthly recurring revenue trend</p>
      <Chart options={options} series={options.series} type="area" height={300} />
    </div>
  );
};
```

### 2.6 UPDATE: Geographic Distribution

Convert to horizontal bar chart:

```tsx
const GeographicChart = ({ data }) => {
  const options = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false },
    },
    series: [{
      name: 'Customers',
      data: data.map(d => d.count),
    }],
    colors: ['#1C64F2'],
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: true,
        barHeight: '60%',
      },
    },
    xaxis: {
      categories: data.map(d => d.region),
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val,
      style: { fontSize: '12px' },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
      <p className="text-sm text-gray-500 mb-4">Customer locations by region</p>
      <Chart options={options} series={options.series} type="bar" height={300} />
    </div>
  );
};
```

### 2.7 FIX: Add-on Revenue Card

Fix the $NaN bug and update labels:

```tsx
const AddonRevenueCard = ({ employeeFees, whiteLabelFees }) => {
  const total = (employeeFees || 0) + (whiteLabelFees || 0);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add-on Revenue</h3>
      <p className="text-sm text-gray-500 mb-4">Additional revenue from optional features</p>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b">
          <span className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-blue-500" />
            Employee Fees
          </span>
          <span className="font-semibold">${(employeeFees || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span className="flex items-center gap-2">
            <PaintBrushIcon className="w-4 h-4 text-orange-500" />
            White Label Branding
          </span>
          <span className="font-semibold">${(whiteLabelFees || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center py-2 font-bold">
          <span>Total Add-on Revenue</span>
          <span className="text-green-600">${total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
```

**Remove** the "Extra Projects" row - it's not part of our pricing model.

### 2.8 UPDATE: Platform Averages

Ensure these are calculated from actual data:

```tsx
const PlatformAveragesCard = ({ metrics }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Averages</h3>
      <p className="text-sm text-gray-500 mb-4">Average usage per customer</p>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-cyan-500">
            {metrics.avgProjectsPerCompany.toFixed(1)}
          </div>
          <div className="text-sm text-gray-500">Avg Projects/Company</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-500">
            {metrics.avgEmployeesPerCompany.toFixed(1)}
          </div>
          <div className="text-sm text-gray-500">Avg Employees/Company</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500">
            ${metrics.avgMrrPerCustomer.toFixed(0)}
          </div>
          <div className="text-sm text-gray-500">Actual ARPU</div>
        </div>
      </div>
    </div>
  );
};
```

---

## Part 3: Goals & KPIs Page (`/superuser/goals`)

### 3.1 Summary Tab - Goal Progress Gauges

Replace the table with visual progress indicators:

```tsx
const GoalProgressGauge = ({ label, actual, goal, format = 'number' }) => {
  const percent = Math.min((actual / goal) * 100, 100);
  const status = percent >= 100 ? 'on-track' : percent >= 80 ? 'at-risk' : 'behind';
  const color = status === 'on-track' ? '#10B981' : status === 'at-risk' ? '#F59E0B' : '#EF4444';
  
  const formatValue = (val) => {
    if (format === 'currency') return `$${val.toLocaleString()}`;
    if (format === 'percent') return `${val}%`;
    return val.toLocaleString();
  };

  const options = {
    chart: { 
      type: 'radialBar', 
      height: 200,
      sparkline: { enabled: true },
    },
    series: [Math.round(percent)],
    colors: [color],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: '60%' },
        track: { 
          background: '#E5E7EB',
          strokeWidth: '100%',
        },
        dataLabels: {
          name: { 
            show: true, 
            fontSize: '12px', 
            color: '#6B7280',
            offsetY: 20,
          },
          value: { 
            show: true, 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: '#111827',
            offsetY: -15,
            formatter: () => formatValue(actual),
          },
        },
      },
    },
    labels: [`Goal: ${formatValue(goal)}`],
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-gray-900">{label}</h4>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          status === 'on-track' ? 'bg-green-100 text-green-800' :
          status === 'at-risk' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {status === 'on-track' ? 'On Track' : status === 'at-risk' ? 'At Risk' : 'Behind'}
        </span>
      </div>
      <Chart options={options} series={options.series} type="radialBar" height={200} />
    </div>
  );
};

// Usage in Summary Tab
const SummaryTab = ({ metrics }) => (
  <div className="grid grid-cols-3 gap-4">
    <GoalProgressGauge 
      label="Tech Accounts" 
      actual={metrics.techAccounts} 
      goal={500} 
    />
    <GoalProgressGauge 
      label="Viral Coefficient" 
      actual={metrics.viralCoefficient} 
      goal={1.0} 
    />
    <GoalProgressGauge 
      label="Trial Starts/Mo" 
      actual={metrics.trialStarts} 
      goal={10} 
    />
    <GoalProgressGauge 
      label="Conversion Rate" 
      actual={metrics.trialConversion} 
      goal={40} 
      format="percent"
    />
    <GoalProgressGauge 
      label="Paying Customers" 
      actual={metrics.payingCustomers} 
      goal={28} 
    />
    <GoalProgressGauge 
      label="MRR" 
      actual={metrics.mrr} 
      goal={19964} 
      format="currency"
    />
  </div>
);
```

### 3.2 Leading Tab - Progress Cards with Trajectory

```tsx
const LeadingMetricCard = ({ 
  metric, 
  actual, 
  goal, 
  deadline, 
  startDate,
  historicalData 
}) => {
  const daysRemaining = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.ceil((new Date(deadline) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const daysElapsed = totalDays - daysRemaining;
  
  const neededRate = daysRemaining > 0 ? (goal - actual) / daysRemaining : 0;
  const actualRate = daysElapsed > 0 ? actual / daysElapsed : 0;
  const onTrack = actualRate >= neededRate * 0.9;

  const progressOptions = {
    chart: { 
      type: 'line', 
      height: 80, 
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    series: [
      { name: 'Actual', data: historicalData },
    ],
    colors: [onTrack ? '#10B981' : '#EF4444'],
    stroke: { curve: 'smooth', width: 2 },
    tooltip: { enabled: false },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-gray-900">{metric}</h4>
          <div className="text-3xl font-bold mt-1">
            {actual} <span className="text-lg text-gray-400">of {goal}</span>
          </div>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
          onTrack ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {onTrack ? 'On Track' : 'At Risk'}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className={`h-3 rounded-full ${onTrack ? 'bg-green-500' : 'bg-red-500'}`}
          style={{ width: `${Math.min((actual / goal) * 100, 100)}%` }}
        />
      </div>
      
      {/* Mini Trend Chart */}
      <Chart options={progressOptions} series={progressOptions.series} type="line" height={80} />
      
      {/* Rate Comparison */}
      <div className="flex justify-between text-sm text-gray-500 mt-3">
        <span>Need: {neededRate.toFixed(2)}/day</span>
        <span>Actual: {actualRate.toFixed(2)}/day</span>
        <span>{daysRemaining} days left</span>
      </div>
    </div>
  );
};
```

### 3.3 Lagging Tab - Update Pricing Display

Replace the current pricing display with the correct model:

```tsx
const PricingModelCard = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pricing Model</h3>
    <p className="text-sm text-gray-500 mb-6">Current subscription structure</p>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="text-sm text-blue-600 font-medium">Base Fee (Monthly)</div>
        <div className="text-2xl font-bold text-blue-700">$99/month</div>
        <div className="text-xs text-blue-500">Per account</div>
      </div>
      
      <div className="bg-green-50 rounded-lg p-4">
        <div className="text-sm text-green-600 font-medium">Base Fee (Annual)</div>
        <div className="text-2xl font-bold text-green-700">$82.17/month</div>
        <div className="text-xs text-green-500">17% discount</div>
      </div>
      
      <div className="bg-cyan-50 rounded-lg p-4">
        <div className="text-sm text-cyan-600 font-medium">Per Employee (1-29)</div>
        <div className="text-2xl font-bold text-cyan-700">$34.95/month</div>
        <div className="text-xs text-cyan-500">Standard rate</div>
      </div>
      
      <div className="bg-purple-50 rounded-lg p-4">
        <div className="text-sm text-purple-600 font-medium">Per Employee (30+)</div>
        <div className="text-2xl font-bold text-purple-700">$29.95/month</div>
        <div className="text-xs text-purple-500">Volume discount</div>
      </div>
    </div>
    
    <div className="bg-orange-50 rounded-lg p-4 mb-6">
      <div className="text-sm text-orange-600 font-medium">White Label Branding</div>
      <div className="text-2xl font-bold text-orange-700">$49/month</div>
      <div className="text-xs text-orange-500">Custom branding add-on</div>
    </div>
    
    {/* ARPU Summary */}
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="text-sm text-gray-600 font-medium">Weighted Average ARPU</div>
      <div className="text-3xl font-bold text-gray-900">$713/month</div>
      <div className="text-xs text-gray-500">
        Based on customer mix: 5% solo, 20% small, 40% medium, 25% large, 10% enterprise
      </div>
    </div>
  </div>
);
```

### 3.4 Unit Economics Tab - Visual Comparisons

```tsx
const UnitEconomicsTab = ({ cac, ltv, arpu, churnRate }) => {
  const ltvCacRatio = ltv / cac;
  const monthlyContribution = arpu * 0.95; // 95% gross margin
  const paybackMonths = cac / monthlyContribution;
  
  // LTV vs CAC Bar Chart
  const comparisonOptions = {
    chart: { type: 'bar', height: 200, toolbar: { show: false } },
    series: [{
      name: 'Value',
      data: [cac, ltv],
    }],
    colors: ['#EF4444', '#10B981'],
    plotOptions: {
      bar: { 
        horizontal: true, 
        barHeight: '50%',
        distributed: true,
        borderRadius: 6,
      },
    },
    xaxis: {
      categories: ['CAC', 'LTV'],
      labels: { formatter: (val) => `$${val.toLocaleString()}` },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `$${val.toLocaleString()}`,
      style: { fontSize: '14px', fontWeight: 'bold' },
    },
    legend: { show: false },
  };
  
  // LTV:CAC Ratio Gauge
  const ratioGaugeOptions = {
    chart: { type: 'radialBar', height: 280 },
    series: [Math.min((ltvCacRatio / 60) * 100, 100)], // 60x = 100%
    colors: ['#10B981'],
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: { size: '65%' },
        track: { background: '#E5E7EB', strokeWidth: '100%' },
        dataLabels: {
          name: { 
            show: true, 
            fontSize: '16px', 
            color: '#6B7280',
            offsetY: 30,
          },
          value: { 
            fontSize: '36px', 
            fontWeight: 'bold',
            color: '#111827',
            offsetY: -10,
            formatter: () => `${ltvCacRatio.toFixed(0)}x`,
          },
        },
      },
    },
    labels: ['LTV:CAC Ratio'],
  };
  
  // CAC Payback Chart
  const paybackData = Array.from({ length: 7 }, (_, i) => monthlyContribution * i);
  const paybackOptions = {
    chart: { type: 'area', height: 200, toolbar: { show: false } },
    series: [{ name: 'Cumulative Revenue', data: paybackData }],
    colors: ['#1C64F2'],
    fill: {
      type: 'gradient',
      gradient: { opacityFrom: 0.5, opacityTo: 0.1 },
    },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'] },
    yaxis: { labels: { formatter: (val) => `$${val.toFixed(0)}` } },
    annotations: {
      yaxis: [{
        y: cac,
        borderColor: '#EF4444',
        borderWidth: 2,
        strokeDashArray: 5,
        label: {
          text: `CAC: $${cac.toLocaleString()}`,
          style: { color: '#EF4444', background: '#FEE2E2' },
        },
      }],
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-sm text-gray-500">Customer Acquisition Cost</div>
          <div className="text-3xl font-bold text-red-500">${cac.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Goal: &lt;$1,500</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-sm text-gray-500">Lifetime Value</div>
          <div className="text-3xl font-bold text-green-500">${ltv.toLocaleString()}</div>
          <div className="text-xs text-gray-400">ARPU: ${arpu} | Margin: 95%</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-sm text-gray-500">LTV:CAC Ratio</div>
          <div className="text-3xl font-bold text-blue-500">{ltvCacRatio.toFixed(0)}x</div>
          <div className="text-xs text-gray-400">Goal: &gt;3x (target 60x+)</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-sm text-gray-500">CAC Payback</div>
          <div className="text-3xl font-bold text-purple-500">{paybackMonths.toFixed(1)} mo</div>
          <div className="text-xs text-gray-400">Goal: &lt;12 months</div>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold text-gray-900 mb-4">LTV vs CAC Comparison</h4>
          <Chart options={comparisonOptions} series={comparisonOptions.series} type="bar" height={200} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold text-gray-900 mb-4">LTV:CAC Health</h4>
          <Chart options={ratioGaugeOptions} series={ratioGaugeOptions.series} type="radialBar" height={280} />
        </div>
      </div>
      
      {/* Payback Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-semibold text-gray-900 mb-4">CAC Payback Timeline</h4>
        <p className="text-sm text-gray-500 mb-4">
          Monthly contribution: ${monthlyContribution.toFixed(0)} | 
          Payback period: {paybackMonths.toFixed(1)} months
        </p>
        <Chart options={paybackOptions} series={paybackOptions.series} type="area" height={200} />
      </div>
    </div>
  );
};
```

### 3.5 Engagement Tab - Activity Metrics

```tsx
const EngagementTab = ({ employerEngagement, techEngagement, pmEngagement }) => {
  // Engagement Health Score Gauge
  const healthScore = calculateEngagementScore(employerEngagement, techEngagement, pmEngagement);
  
  const healthGaugeOptions = {
    chart: { type: 'radialBar', height: 300 },
    series: [healthScore],
    colors: [
      healthScore >= 71 ? '#10B981' : 
      healthScore >= 41 ? '#F59E0B' : '#EF4444'
    ],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: '60%' },
        track: { background: '#E5E7EB' },
        dataLabels: {
          name: { show: false },
          value: { 
            fontSize: '48px',
            fontWeight: 'bold',
            offsetY: -20,
            formatter: (val) => val,
          },
        },
      },
    },
  };
  
  return (
    <div className="space-y-6">
      {/* Engagement Cards Grid */}
      <div className="grid grid-cols-3 gap-6">
        <EngagementCard title="Employer Engagement" data={employerEngagement} />
        <EngagementCard title="Tech Engagement" data={techEngagement} />
        <EngagementCard title="PM Engagement" data={pmEngagement} />
      </div>
      
      {/* Health Score */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Engagement Health Score</h4>
        <div className="flex items-center justify-center">
          <Chart options={healthGaugeOptions} series={healthGaugeOptions.series} type="radialBar" height={300} />
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-gray-600">0-40: Low (Churn risk)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm text-gray-600">41-70: Moderate (Monitor)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">71-100: High (Healthy)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 3.6 SMART Goals Tab - Timeline Visualization

```tsx
const SmartGoalsTab = ({ goals }) => {
  const timelineOptions = {
    chart: { 
      type: 'rangeBar', 
      height: 350,
      toolbar: { show: false },
    },
    series: [{
      data: goals.map(g => ({
        x: g.name,
        y: [new Date(g.startDate).getTime(), new Date(g.deadline).getTime()],
        fillColor: g.actual >= g.target ? '#10B981' : 
                   (g.actual / g.target) >= 0.8 ? '#F59E0B' : '#EF4444',
      })),
    }],
    plotOptions: {
      bar: { 
        horizontal: true, 
        barHeight: '50%',
        borderRadius: 4,
      },
    },
    xaxis: { 
      type: 'datetime',
      labels: {
        datetimeFormatter: { month: 'MMM', year: 'yyyy' },
      },
    },
    annotations: {
      xaxis: [{
        x: new Date().getTime(),
        borderColor: '#1C64F2',
        borderWidth: 2,
        label: {
          text: 'Today',
          style: { color: '#1C64F2', background: '#DBEAFE' },
        },
      }],
    },
    tooltip: {
      custom: ({ dataPointIndex }) => {
        const goal = goals[dataPointIndex];
        return `
          <div class="p-3">
            <div class="font-bold">${goal.name}</div>
            <div>Progress: ${goal.actual} / ${goal.target}</div>
            <div>Deadline: ${new Date(goal.deadline).toLocaleDateString()}</div>
          </div>
        `;
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Year 1 SMART Goals</h3>
      <p className="text-sm text-gray-500 mb-6">Launch → Dec 31, 2026</p>
      
      <Chart options={timelineOptions} series={timelineOptions.series} type="rangeBar" height={350} />
      
      {/* Goals Table */}
      <table className="w-full mt-6">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b">
            <th className="pb-3">Goal</th>
            <th className="pb-3">Specific</th>
            <th className="pb-3">Measurable</th>
            <th className="pb-3">Achievable</th>
            <th className="pb-3">Relevant</th>
            <th className="pb-3">Time-bound</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-3 font-medium">Tech Accounts</td>
            <td>500 free tech accounts</td>
            <td>Dashboard count</td>
            <td>Industry size supports</td>
            <td>Drives employer adoption</td>
            <td>Jun 30, 2026</td>
          </tr>
          <tr className="border-b">
            <td className="py-3 font-medium">Viral Coefficient</td>
            <td>k ≥ 1.0</td>
            <td>Referrals/Signups</td>
            <td>Referral program in place</td>
            <td>Self-sustaining growth</td>
            <td>Q2 2026</td>
          </tr>
          <tr className="border-b">
            <td className="py-3 font-medium">Customers</td>
            <td>28 paying employers</td>
            <td>Subscription count</td>
            <td>Market validation</td>
            <td>Revenue foundation</td>
            <td>Dec 31, 2026</td>
          </tr>
          <tr className="border-b">
            <td className="py-3 font-medium">MRR</td>
            <td>$19,964</td>
            <td>Stripe revenue</td>
            <td>28 × $713 ARPU</td>
            <td>Break-even path</td>
            <td>Dec 31, 2026</td>
          </tr>
          <tr className="border-b">
            <td className="py-3 font-medium">Churn</td>
            <td>&lt;10% annual</td>
            <td>Lost/Starting</td>
            <td>Industry benchmark</td>
            <td>LTV protection</td>
            <td>Ongoing</td>
          </tr>
          <tr>
            <td className="py-3 font-medium">NRR</td>
            <td>≥115%</td>
            <td>Cohort analysis</td>
            <td>Seat expansion trend</td>
            <td>Growth efficiency</td>
            <td>Ongoing</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
```

---

## Part 4: API Endpoints

Create/update these endpoints to return live-calculated data:

### GET /api/superuser/metrics

```typescript
export async function GET() {
  const activeCustomers = await db.customer.findMany({
    where: { billingStatus: 'active' },
    include: { employees: true },
  });
  
  const trialCustomers = await db.customer.count({
    where: { billingStatus: 'trial' },
  });
  
  // Calculate MRR for each customer
  const customerMetrics = activeCustomers.map(c => ({
    ...c,
    mrr: calculateCustomerMRR(c),
  }));
  
  const totalMRR = customerMetrics.reduce((sum, c) => sum + c.mrr, 0);
  
  // MRR Breakdown
  const mrrBreakdown = {
    base: activeCustomers.reduce((sum, c) => 
      sum + (c.billingCycle === 'annual' ? 82.17 : 99), 0),
    employees: activeCustomers.reduce((sum, c) => {
      const count = c.employees.filter(e => e.status === 'active').length;
      const rate = count >= 30 ? 29.95 : 34.95;
      return sum + (count * rate);
    }, 0),
    whiteLabel: activeCustomers.filter(c => c.hasWhiteLabel).length * 49,
  };
  
  // Size distribution
  const sizeDistribution = {
    solo: activeCustomers.filter(c => c.employees.length <= 3).length,
    small: activeCustomers.filter(c => c.employees.length >= 4 && c.employees.length <= 9).length,
    medium: activeCustomers.filter(c => c.employees.length >= 10 && c.employees.length <= 29).length,
    large: activeCustomers.filter(c => c.employees.length >= 30).length,
  };
  
  return Response.json({
    mrr: totalMRR,
    arr: totalMRR * 12,
    activeCustomers: activeCustomers.length,
    trialCustomers,
    mrrBreakdown,
    sizeDistribution,
    averages: {
      projectsPerCompany: totalProjects / activeCustomers.length,
      employeesPerCompany: totalEmployees / activeCustomers.length,
      mrrPerCustomer: totalMRR / activeCustomers.length,
    },
  });
}
```

### GET /api/superuser/goals

```typescript
export async function GET() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return Response.json({
    techAccounts: {
      actual: await db.techAccount.count(),
      goal: 500,
    },
    viralCoefficient: {
      actual: await calculateViralCoefficient(),
      goal: 1.0,
    },
    trialStarts: {
      actual: await db.customer.count({
        where: { 
          billingStatus: 'trial',
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      goal: 10,
    },
    trialConversion: {
      actual: await calculateTrialConversionRate(),
      goal: 40,
    },
    payingCustomers: {
      actual: await db.customer.count({ where: { billingStatus: 'active' } }),
      goal: 28,
    },
    mrr: {
      actual: await calculateTotalMRR(),
      goal: 19964,
    },
    arpu: {
      actual: await calculateActualARPU(),
      goal: 713,
    },
    monthlyChurn: {
      actual: await calculateMonthlyChurn(),
      goal: 0.83,
    },
    nrr: {
      actual: await calculateNRR(),
      goal: 115,
    },
  });
}
```

---

## Part 5: Cleanup Tasks

### Remove Old Tier References

Search the codebase and remove all references to:
- `Basic ($79)`
- `Starter ($299)`
- `Premium ($499)`
- `Enterprise ($899)`
- Any `subscriptionTier` enum values for these tiers

### Fix Known Bugs

1. **$NaN in Add-on Revenue**: Add null coalescing (`|| 0`) to all calculations
2. **Geographic mismatch**: Ensure "CA" state code doesn't get confused with Canada
3. **Employee count discrepancy**: Verify employees are properly linked to companies

---

## Part 6: Testing Checklist

After implementation, verify:

- [ ] MRR = SUM of all active customer (base + employee fees + white label)
- [ ] ARR = MRR × 12 (calculated, never stored)
- [ ] ARPU = MRR / active_paid_customer_count
- [ ] Adding an employee to a company increases MRR by $34.95 (or $29.95 if 30+ employees)
- [ ] Annual billing customers show $82.17 base (17% discount)
- [ ] Trial customers excluded from MRR and paying customer count
- [ ] All charts render with live data
- [ ] Goal status indicators update based on actual vs target
- [ ] No hardcoded values in any metric displays
- [ ] Old tier names (Basic/Starter/Premium/Enterprise) completely removed

---

## Summary of Changes

| Page | Section | Action |
|------|---------|--------|
| Platform Metrics | MRR by Tier | REPLACE with MRR Breakdown donut chart |
| Platform Metrics | Customer Distribution | REPLACE with Size Distribution radial chart |
| Platform Metrics | Add-on Revenue | FIX $NaN bug, remove Extra Projects |
| Platform Metrics | - | ADD MRR Growth area chart |
| Platform Metrics | Geographic | CONVERT to horizontal bar chart |
| Goals & KPIs | Summary | ADD radial progress gauges |
| Goals & KPIs | Leading | ADD trajectory charts with progress bars |
| Goals & KPIs | Lagging | UPDATE pricing display to new model |
| Goals & KPIs | Unit Economics | ADD LTV/CAC visualizations |
| Goals & KPIs | Engagement | ADD health score gauge |
| Goals & KPIs | SMART Goals | ADD timeline Gantt chart |
