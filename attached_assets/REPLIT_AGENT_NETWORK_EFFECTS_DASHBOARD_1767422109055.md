# Network Effects & Lock-in Metrics Dashboard

## Overview

Build a third superuser dashboard at `/superuser/network` focused on proving network effects and platform lock-in to investors and acquirers. This dashboard tracks metrics across all four account types (Tech, Property Manager, Resident, Building Manager) that demonstrate cross-side network effects, same-side effects, data moat accumulation, and switching costs.

**Reference for chart styling:** https://flowbite.com/docs/plugins/charts/

**Key Investor Questions This Dashboard Answers:**
1. Does the platform become more valuable as more users join? (Network Effects)
2. How difficult is it for users to leave? (Switching Costs / Lock-in)
3. Is user-generated data creating a defensible moat? (Data Assets)
4. Are network effects accelerating or stalling? (Flywheel Health)

---

## Database Tables Reference

### Tables That Should Already Exist

Use these existing tables to pull metrics. Adjust field names to match your actual schema:

```typescript
// Core user/account tables
users / accounts - All user accounts with role field
tech_accounts - Technician-specific data
companies / employers - Employer accounts
buildings - Building profiles
property_managers - PM accounts
residents - Resident accounts
building_managers - Building manager accounts

// Activity tables
projects / jobs - Work projects
work_sessions - Time/work tracking
employees - Tech-to-employer relationships
certifications - Tech certifications
documents / uploads - Uploaded files
inspections - Safety inspections (harness, FLHA, etc.)
toolbox_meetings - Safety meetings

// Transactional
subscriptions - Billing/subscription data
quotes - Sales quotes
```

### Tables/Fields That May Need to Be Added

If these don't exist, add them to the **Tracking Gaps Report** (Section at end of document):

```typescript
// Referral tracking
referrals (
  id,
  referrer_id,        // User who sent referral
  referrer_type,      // 'tech', 'employer', 'pm', 'building_manager'
  referred_email,
  referred_user_id,   // After signup
  status,             // 'pending', 'signed_up', 'converted'
  created_at,
  converted_at
)

// Search/match tracking
searches (
  id,
  searcher_id,
  searcher_type,
  search_type,        // 'tech_search', 'vendor_search', 'building_search'
  query_params,       // JSON of search criteria
  results_count,
  engagement_count,   // How many results were clicked/contacted
  created_at
)

// Vendor verifications (PM compliance checks)
vendor_verifications (
  id,
  property_manager_id,
  vendor_company_id,
  verification_type,  // 'insurance', 'certification', 'safety_record'
  status,             // 'pending', 'verified', 'failed', 'expired'
  verified_at,
  expires_at
)

// Notification interactions
notification_interactions (
  id,
  user_id,
  notification_type,
  action,             // 'viewed', 'clicked', 'dismissed'
  created_at
)

// Connection/relationship tracking
connections (
  id,
  user_a_id,
  user_a_type,
  user_b_id,
  user_b_type,
  connection_type,    // 'worked_together', 'verified', 'endorsed', 'referred'
  strength_score,     // Calculated based on interactions
  created_at
)
```

---

## Part 1: Dashboard Layout Structure

The dashboard should have 5 main tabs:

1. **Overview** - North star metrics and network health summary
2. **Cross-Side Effects** - Metrics proving supply/demand flywheel
3. **Account Lock-in** - Switching cost metrics by account type
4. **Data Moat** - Data accumulation and depth metrics
5. **Investor View** - Board-ready charts and cohort analysis

---

## Part 2: Overview Tab

### 2.1 Network Health Score Card

A single composite score (0-100) with gauge visualization:

```tsx
const NetworkHealthScore = ({ score }) => {
  const color = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444';
  const status = score >= 70 ? 'Strong' : score >= 40 ? 'Building' : 'Weak';
  
  const options = {
    chart: { type: 'radialBar', height: 300 },
    series: [score],
    colors: [color],
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
          },
        },
      },
    },
    labels: [`Network Effects: ${status}`],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Network Health Score</h3>
      <p className="text-sm text-gray-500 mb-4">Composite measure of network effect strength</p>
      <Chart options={options} series={options.series} type="radialBar" height={300} />
      
      {/* Score Components */}
      <div className="grid grid-cols-4 gap-2 mt-4 text-center text-sm">
        <div className="p-2 bg-gray-50 rounded">
          <div className="font-semibold">{components.crossSide}/25</div>
          <div className="text-gray-500">Cross-Side</div>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <div className="font-semibold">{components.sameSide}/25</div>
          <div className="text-gray-500">Same-Side</div>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <div className="font-semibold">{components.lockIn}/25</div>
          <div className="text-gray-500">Lock-in</div>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <div className="font-semibold">{components.dataMoat}/25</div>
          <div className="text-gray-500">Data Moat</div>
        </div>
      </div>
    </div>
  );
};
```

**Score Calculation:**
```typescript
function calculateNetworkHealthScore() {
  // Cross-Side Score (0-25)
  // Based on: match rate, cross-side conversion, time-to-match improvement
  const crossSideScore = (
    (matchRate / 0.5) * 10 +           // 50% match rate = 10 points
    (collaboratorConversion / 0.4) * 10 + // 40% conversion = 10 points
    (timeToMatchImprovement / 0.3) * 5    // 30% improvement = 5 points
  );
  
  // Same-Side Score (0-25)
  // Based on: viral coefficient, referral activity, peer connections
  const sameSideScore = (
    (viralCoefficient / 1.0) * 15 +     // K=1.0 = 15 points
    (avgConnectionsPerUser / 10) * 10    // 10 connections = 10 points
  );
  
  // Lock-in Score (0-25)
  // Based on: profile completeness, data depth, retention correlation
  const lockInScore = (
    (avgProfileCompleteness) * 10 +      // 100% complete = 10 points
    (retentionCorrelation) * 10 +        // Strong correlation = 10 points
    (multiAccountConnections / 5) * 5    // 5+ cross-type connections = 5 points
  );
  
  // Data Moat Score (0-25)
  // Based on: records per building, historical depth, unique data %
  const dataMoatScore = (
    (avgRecordsPerBuilding / 50) * 10 +  // 50 records = 10 points
    (avgHistoricalDepthMonths / 24) * 10 + // 2 years = 10 points
    (uniqueDataPercentage) * 5            // 100% unique = 5 points
  );
  
  return Math.min(100, crossSideScore + sameSideScore + lockInScore + dataMoatScore);
}
```

### 2.2 Account Type Summary Cards

Four cards showing key metrics per account type:

```tsx
const AccountTypeSummary = () => (
  <div className="grid grid-cols-4 gap-4">
    <AccountCard 
      type="Tech"
      icon={<UserIcon />}
      color="blue"
      metrics={{
        total: techCount,
        active: activeTechCount,
        avgCompleteness: avgTechProfileCompleteness,
        avgConnections: avgTechConnections,
      }}
    />
    <AccountCard 
      type="Employer"
      icon={<BuildingOfficeIcon />}
      color="green"
      metrics={{
        total: employerCount,
        active: activeEmployerCount,
        avgEmployees: avgEmployeesPerEmployer,
        fromCollaborators: collaboratorConversionPercent,
      }}
    />
    <AccountCard 
      type="Property Manager"
      icon={<ClipboardDocumentCheckIcon />}
      color="purple"
      metrics={{
        total: pmCount,
        active: activePmCount,
        avgVerifications: avgVerificationsPerPm,
        avgBuildingsManaged: avgBuildingsPerPm,
      }}
    />
    <AccountCard 
      type="Building Manager"
      icon={<BuildingLibraryIcon />}
      color="orange"
      metrics={{
        total: buildingManagerCount,
        active: activeBuildingManagerCount,
        avgBuildings: avgBuildingsPerManager,
        avgRecordsPerBuilding: avgRecordsPerBuilding,
      }}
    />
  </div>
);
```

**Data Queries:**

```typescript
// Tech metrics - FROM EXISTING TABLES
const techMetrics = await db.query(`
  SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN last_active_at > NOW() - INTERVAL '30 days' THEN 1 END) as active,
    AVG(profile_completeness_score) as avg_completeness
  FROM tech_accounts
`);

// Calculate avg connections - MAY NEED connections TABLE
const techConnections = await db.query(`
  SELECT AVG(connection_count) as avg_connections
  FROM (
    SELECT tech_id, COUNT(DISTINCT company_id) as connection_count
    FROM employees
    GROUP BY tech_id
  ) t
`);

// Employer metrics - FROM EXISTING TABLES
const employerMetrics = await db.query(`
  SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN billing_status = 'active' THEN 1 END) as active,
    AVG(employee_count) as avg_employees
  FROM companies
`);

// PM metrics - FROM EXISTING TABLES (if vendor_verifications exists)
const pmMetrics = await db.query(`
  SELECT 
    COUNT(DISTINCT pm.id) as total,
    AVG(v.verification_count) as avg_verifications
  FROM property_managers pm
  LEFT JOIN (
    SELECT property_manager_id, COUNT(*) as verification_count
    FROM vendor_verifications
    GROUP BY property_manager_id
  ) v ON pm.id = v.property_manager_id
`);

// Building metrics - FROM EXISTING TABLES
const buildingMetrics = await db.query(`
  SELECT 
    COUNT(DISTINCT b.id) as total_buildings,
    AVG(record_counts.total_records) as avg_records_per_building
  FROM buildings b
  LEFT JOIN (
    SELECT building_id, 
           COUNT(*) as total_records
    FROM (
      SELECT building_id FROM projects
      UNION ALL
      SELECT building_id FROM inspections
      UNION ALL
      SELECT building_id FROM documents WHERE building_id IS NOT NULL
    ) all_records
    GROUP BY building_id
  ) record_counts ON b.id = record_counts.building_id
`);
```

### 2.3 Network Growth Trend

Area chart showing growth of all account types over time:

```tsx
const NetworkGrowthChart = ({ data }) => {
  const options = {
    chart: { 
      type: 'area', 
      height: 350,
      stacked: true,
      toolbar: { show: false },
    },
    series: [
      { name: 'Techs', data: data.techs },
      { name: 'Employers', data: data.employers },
      { name: 'Property Managers', data: data.pms },
      { name: 'Building Managers', data: data.buildingManagers },
    ],
    colors: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'],
    fill: {
      type: 'gradient',
      gradient: { opacityFrom: 0.6, opacityTo: 0.1 },
    },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { 
      categories: data.months,
      labels: { style: { fontFamily: 'Inter, sans-serif' } },
    },
    yaxis: {
      labels: { formatter: (val) => val.toLocaleString() },
    },
    legend: { position: 'top' },
    tooltip: { shared: true },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Network Growth</h3>
      <p className="text-sm text-gray-500 mb-4">Account growth across all types</p>
      <Chart options={options} series={options.series} type="area" height={350} />
    </div>
  );
};
```

**Data Query:**
```typescript
// Monthly account growth - FROM EXISTING TABLES
const networkGrowth = await db.query(`
  SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(CASE WHEN role = 'tech' THEN 1 END) as techs,
    COUNT(CASE WHEN role = 'employer' THEN 1 END) as employers,
    COUNT(CASE WHEN role = 'property_manager' THEN 1 END) as pms,
    COUNT(CASE WHEN role = 'building_manager' THEN 1 END) as building_managers
  FROM users
  WHERE created_at > NOW() - INTERVAL '12 months'
  GROUP BY DATE_TRUNC('month', created_at)
  ORDER BY month
`);
```

---

## Part 3: Cross-Side Effects Tab

### 3.1 Match Rate Gauge

```tsx
const MatchRateGauge = ({ rate, trend }) => {
  const options = {
    chart: { type: 'radialBar', height: 250 },
    series: [rate * 100],
    colors: [rate >= 0.4 ? '#10B981' : rate >= 0.2 ? '#F59E0B' : '#EF4444'],
    plotOptions: {
      radialBar: {
        hollow: { size: '65%' },
        dataLabels: {
          name: { show: true, fontSize: '14px', offsetY: 25 },
          value: { 
            fontSize: '32px', 
            fontWeight: 'bold',
            offsetY: -15,
            formatter: (val) => `${val.toFixed(1)}%`,
          },
        },
      },
    },
    labels: [`${trend > 0 ? '↑' : '↓'} ${Math.abs(trend).toFixed(1)}% vs last month`],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Match Rate</h3>
      <p className="text-sm text-gray-500 mb-4">
        Employer searches resulting in tech engagement
      </p>
      <Chart options={options} series={options.series} type="radialBar" height={250} />
      <div className="text-center text-sm text-gray-500 mt-2">
        Target: &gt;40% | Industry avg: 25-35%
      </div>
    </div>
  );
};
```

**Data Query - REQUIRES searches TABLE:**
```typescript
// If searches table exists
const matchRate = await db.query(`
  SELECT 
    COUNT(CASE WHEN engagement_count > 0 THEN 1 END)::float / 
    NULLIF(COUNT(*), 0) as match_rate
  FROM searches
  WHERE search_type = 'tech_search'
    AND created_at > NOW() - INTERVAL '30 days'
`);

// FALLBACK if no searches table - use job applications/contacts
const matchRateFallback = await db.query(`
  SELECT 
    COUNT(DISTINCT j.id FILTER (WHERE a.id IS NOT NULL))::float /
    NULLIF(COUNT(DISTINCT j.id), 0) as match_rate
  FROM jobs j
  LEFT JOIN applications a ON j.id = a.job_id
  WHERE j.created_at > NOW() - INTERVAL '30 days'
`);
```

### 3.2 Cross-Side Conversion Funnel

```tsx
const CrossSideFunnel = ({ data }) => {
  const options = {
    chart: { type: 'bar', height: 300, toolbar: { show: false } },
    series: [{
      name: 'Count',
      data: [
        data.techsExposed,      // Techs seen by employers
        data.techsContacted,    // Techs contacted
        data.techsHired,        // Techs hired
        data.employersConverted // Employers who then subscribed
      ],
    }],
    colors: ['#3B82F6'],
    plotOptions: {
      bar: { 
        horizontal: true, 
        barHeight: '60%',
        borderRadius: 4,
        distributed: true,
      },
    },
    xaxis: {
      categories: [
        'Techs Viewed by Employers',
        'Techs Contacted',
        'Techs Hired',
        'Employers Converted from Exposure'
      ],
    },
    colors: ['#93C5FD', '#60A5FA', '#3B82F6', '#1D4ED8'],
    dataLabels: {
      enabled: true,
      formatter: (val, { dataPointIndex }) => {
        if (dataPointIndex === 0) return val.toLocaleString();
        const prevVal = data[Object.keys(data)[dataPointIndex - 1]];
        const convRate = ((val / prevVal) * 100).toFixed(1);
        return `${val.toLocaleString()} (${convRate}%)`;
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Cross-Side Conversion Funnel</h3>
      <p className="text-sm text-gray-500 mb-4">
        Tech exposure → Employer conversion pathway
      </p>
      <Chart options={options} series={options.series} type="bar" height={300} />
    </div>
  );
};
```

**Data Query - PARTIAL FROM EXISTING, MAY NEED TRACKING:**
```typescript
// Techs viewed - NEEDS page_views or profile_views table
// Techs contacted - FROM messages or contact_requests table if exists
// Techs hired - FROM employees table
const crossSideFunnel = await db.query(`
  SELECT
    (SELECT COUNT(DISTINCT tech_id) FROM profile_views 
     WHERE viewer_type = 'employer' 
     AND viewed_at > NOW() - INTERVAL '90 days') as techs_exposed,
    
    (SELECT COUNT(DISTINCT tech_id) FROM messages 
     WHERE sender_type = 'employer' 
     AND created_at > NOW() - INTERVAL '90 days') as techs_contacted,
    
    (SELECT COUNT(*) FROM employees 
     WHERE created_at > NOW() - INTERVAL '90 days') as techs_hired,
    
    (SELECT COUNT(*) FROM companies 
     WHERE referral_source = 'tech_profile' 
     AND created_at > NOW() - INTERVAL '90 days') as employers_converted
`);
```

### 3.3 Collaborator to Customer Rate

Key metric from Procore's playbook - what % of new paying customers came from free exposure:

```tsx
const CollaboratorConversionCard = ({ rate, count, trend }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold">Collaborator → Customer</h3>
        <p className="text-sm text-gray-500">
          New customers from platform exposure
        </p>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        rate >= 0.3 ? 'bg-green-100 text-green-800' : 
        rate >= 0.15 ? 'bg-yellow-100 text-yellow-800' : 
        'bg-red-100 text-red-800'
      }`}>
        {rate >= 0.3 ? 'Strong' : rate >= 0.15 ? 'Building' : 'Weak'}
      </span>
    </div>
    
    <div className="text-5xl font-bold text-blue-600 mb-2">
      {(rate * 100).toFixed(1)}%
    </div>
    <div className="text-sm text-gray-500 mb-4">
      {count} of last 90 days' new customers
    </div>
    
    <div className="flex items-center gap-2 text-sm">
      <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
      </span>
      <span className="text-gray-500">vs previous period</span>
    </div>
    
    <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
      <strong>Investor Signal:</strong> Procore reported 40% of new customers 
      came from free collaborators. This proves network effects are driving 
      organic acquisition.
    </div>
  </div>
);
```

**Data Query - NEEDS referral_source TRACKING:**
```typescript
// Requires tracking HOW customers discovered the platform
const collaboratorConversion = await db.query(`
  SELECT 
    COUNT(CASE WHEN referral_source IN (
      'tech_profile', 'tech_referral', 'pm_verification', 
      'building_lookup', 'invited_by_tech'
    ) THEN 1 END)::float / NULLIF(COUNT(*), 0) as conversion_rate,
    COUNT(CASE WHEN referral_source IN (
      'tech_profile', 'tech_referral', 'pm_verification', 
      'building_lookup', 'invited_by_tech'
    ) THEN 1 END) as converted_count,
    COUNT(*) as total_new
  FROM companies
  WHERE billing_status = 'active'
    AND created_at > NOW() - INTERVAL '90 days'
`);
```

### 3.4 Network Density by Geography

Shows tech density vs employer activity by region - proves network effects are geographic:

```tsx
const GeographicDensityChart = ({ data }) => {
  const options = {
    chart: { type: 'scatter', height: 400, toolbar: { show: false } },
    series: data.regions.map(region => ({
      name: region.name,
      data: [[region.techDensity, region.employerActivity]],
    })),
    xaxis: {
      title: { text: 'Tech Density (per 100 buildings)' },
      min: 0,
    },
    yaxis: {
      title: { text: 'Employer Activity (jobs/month)' },
      min: 0,
    },
    annotations: {
      // Trend line showing correlation
      points: data.regions.map(r => ({
        x: r.techDensity,
        y: r.employerActivity,
        marker: { size: r.totalUsers / 10 }, // Bubble size = market size
      })),
    },
    tooltip: {
      custom: ({ seriesIndex }) => {
        const region = data.regions[seriesIndex];
        return `
          <div class="p-3">
            <div class="font-bold">${region.name}</div>
            <div>Techs: ${region.techCount}</div>
            <div>Employers: ${region.employerCount}</div>
            <div>Jobs/Month: ${region.jobsPerMonth}</div>
          </div>
        `;
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Geographic Network Density</h3>
      <p className="text-sm text-gray-500 mb-4">
        Tech density vs employer activity by region (bubble size = market size)
      </p>
      <Chart options={options} series={options.series} type="scatter" height={400} />
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
        <strong>Correlation: r={data.correlation.toFixed(2)}</strong> — 
        {data.correlation > 0.7 ? 'Strong positive correlation proves cross-side network effects' :
         data.correlation > 0.4 ? 'Moderate correlation indicates emerging network effects' :
         'Weak correlation — network effects not yet proven'}
      </div>
    </div>
  );
};
```

**Data Query - FROM EXISTING TABLES:**
```typescript
const geographicDensity = await db.query(`
  WITH regional_stats AS (
    SELECT 
      COALESCE(u.province, u.state, 'Unknown') as region,
      COUNT(DISTINCT CASE WHEN u.role = 'tech' THEN u.id END) as tech_count,
      COUNT(DISTINCT CASE WHEN u.role = 'employer' THEN u.id END) as employer_count,
      COUNT(DISTINCT b.id) as building_count,
      COUNT(DISTINCT j.id) FILTER (WHERE j.created_at > NOW() - INTERVAL '30 days') as jobs_last_month
    FROM users u
    LEFT JOIN buildings b ON b.region = COALESCE(u.province, u.state)
    LEFT JOIN jobs j ON j.region = COALESCE(u.province, u.state)
    GROUP BY COALESCE(u.province, u.state, 'Unknown')
  )
  SELECT 
    region,
    tech_count,
    employer_count,
    building_count,
    jobs_last_month,
    CASE WHEN building_count > 0 
      THEN (tech_count::float / building_count) * 100 
      ELSE 0 
    END as tech_density,
    jobs_last_month as employer_activity
  FROM regional_stats
  WHERE tech_count > 0 OR employer_count > 0
  ORDER BY tech_count DESC
`);
```

---

## Part 4: Account Lock-in Tab

### 4.1 Tech Account Lock-in Metrics

```tsx
const TechLockInCard = ({ metrics }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 bg-blue-100 rounded-lg">
        <UserIcon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">Tech Account Lock-in</h3>
        <p className="text-sm text-gray-500">Portable identity creates switching costs</p>
      </div>
    </div>
    
    <div className="space-y-4">
      {/* Profile Completeness Distribution */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Avg Profile Completeness</span>
          <span className="font-semibold">{(metrics.avgCompleteness * 100).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-500 h-3 rounded-full" 
            style={{ width: `${metrics.avgCompleteness * 100}%` }}
          />
        </div>
      </div>
      
      {/* Key Lock-in Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricBox 
          label="Avg Certifications" 
          value={metrics.avgCertifications.toFixed(1)}
          subtext="per tech"
          trend={metrics.certTrend}
        />
        <MetricBox 
          label="Cross-Employer History" 
          value={`${(metrics.multiEmployerPercent * 100).toFixed(0)}%`}
          subtext="worked for 2+ employers"
          trend={metrics.multiEmployerTrend}
        />
        <MetricBox 
          label="Avg Work History" 
          value={`${metrics.avgWorkHistoryMonths.toFixed(0)} mo`}
          subtext="documented on platform"
          trend={metrics.historyTrend}
        />
        <MetricBox 
          label="Avg Connections" 
          value={metrics.avgConnections.toFixed(1)}
          subtext="employer relationships"
          trend={metrics.connectionTrend}
        />
      </div>
      
      {/* Retention by Completeness Chart */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Retention by Profile Completeness</h4>
        <RetentionByCompletenessChart data={metrics.retentionByCompleteness} />
      </div>
    </div>
  </div>
);
```

**Data Queries - MOSTLY FROM EXISTING TABLES:**

```typescript
// Profile completeness - NEEDS calculation or stored field
// Calculate based on filled fields / total fields
const profileCompleteness = await db.query(`
  SELECT 
    AVG(
      (CASE WHEN first_name IS NOT NULL THEN 1 ELSE 0 END +
       CASE WHEN last_name IS NOT NULL THEN 1 ELSE 0 END +
       CASE WHEN phone IS NOT NULL THEN 1 ELSE 0 END +
       CASE WHEN email_verified THEN 1 ELSE 0 END +
       CASE WHEN profile_photo IS NOT NULL THEN 1 ELSE 0 END +
       CASE WHEN bio IS NOT NULL THEN 1 ELSE 0 END +
       CASE WHEN certifications_count > 0 THEN 1 ELSE 0 END +
       CASE WHEN work_history_count > 0 THEN 1 ELSE 0 END +
       CASE WHEN skills_count > 0 THEN 1 ELSE 0 END +
       CASE WHEN emergency_contact IS NOT NULL THEN 1 ELSE 0 END
      )::float / 10
    ) as avg_completeness
  FROM tech_accounts
`);

// Certifications - FROM EXISTING certifications TABLE
const certMetrics = await db.query(`
  SELECT AVG(cert_count) as avg_certifications
  FROM (
    SELECT tech_id, COUNT(*) as cert_count
    FROM certifications
    WHERE status = 'active'
    GROUP BY tech_id
  ) t
`);

// Cross-employer history - FROM EXISTING employees TABLE
const crossEmployer = await db.query(`
  SELECT 
    COUNT(CASE WHEN employer_count >= 2 THEN 1 END)::float / 
    NULLIF(COUNT(*), 0) as multi_employer_percent
  FROM (
    SELECT tech_id, COUNT(DISTINCT company_id) as employer_count
    FROM employees
    GROUP BY tech_id
  ) t
`);

// Work history depth - FROM EXISTING work_sessions or employees TABLE
const workHistory = await db.query(`
  SELECT 
    AVG(EXTRACT(EPOCH FROM (NOW() - first_work_date)) / 2592000) as avg_months
  FROM (
    SELECT tech_id, MIN(created_at) as first_work_date
    FROM work_sessions
    GROUP BY tech_id
  ) t
`);

// Retention by completeness - COMPLEX QUERY
const retentionByCompleteness = await db.query(`
  WITH tech_completeness AS (
    SELECT 
      id,
      -- Calculate completeness score (0-100)
      (filled_fields::float / total_fields * 100) as completeness,
      CASE 
        WHEN last_active_at > NOW() - INTERVAL '30 days' THEN true 
        ELSE false 
      END as is_retained
    FROM tech_accounts
    WHERE created_at < NOW() - INTERVAL '90 days' -- Only count mature accounts
  )
  SELECT 
    CASE 
      WHEN completeness < 25 THEN '0-25%'
      WHEN completeness < 50 THEN '25-50%'
      WHEN completeness < 75 THEN '50-75%'
      ELSE '75-100%'
    END as completeness_band,
    AVG(CASE WHEN is_retained THEN 1 ELSE 0 END) as retention_rate
  FROM tech_completeness
  GROUP BY 1
  ORDER BY 1
`);
```

### 4.2 Property Manager Lock-in Metrics

```tsx
const PMLockInCard = ({ metrics }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 bg-purple-100 rounded-lg">
        <ClipboardDocumentCheckIcon className="w-6 h-6 text-purple-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">Property Manager Lock-in</h3>
        <p className="text-sm text-gray-500">Compliance history creates switching costs</p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <MetricBox 
        label="Avg Vendor Verifications" 
        value={metrics.avgVerifications.toFixed(0)}
        subtext="per PM account"
      />
      <MetricBox 
        label="Avg Buildings Managed" 
        value={metrics.avgBuildings.toFixed(1)}
        subtext="linked to account"
      />
      <MetricBox 
        label="Compliance Checks/Month" 
        value={metrics.checksPerMonth.toFixed(0)}
        subtext="ongoing activity"
      />
      <MetricBox 
        label="Vendor Relationships" 
        value={metrics.avgVendorRelationships.toFixed(0)}
        subtext="tracked vendors"
      />
    </div>
    
    {/* Data Depth Indicator */}
    <div className="mt-4 p-4 bg-purple-50 rounded-lg">
      <div className="text-sm font-medium text-purple-800 mb-2">
        Compliance Data Depth
      </div>
      <div className="text-3xl font-bold text-purple-600">
        {metrics.totalVerificationRecords.toLocaleString()} records
      </div>
      <div className="text-sm text-purple-600">
        {metrics.avgHistoryMonths.toFixed(0)} months avg history per PM
      </div>
    </div>
  </div>
);
```

**Data Queries - MAY NEED vendor_verifications TABLE:**

```typescript
// If vendor_verifications table exists
const pmMetrics = await db.query(`
  SELECT 
    AVG(verification_count) as avg_verifications,
    AVG(building_count) as avg_buildings,
    SUM(verification_count) as total_verification_records
  FROM (
    SELECT 
      pm.id,
      COUNT(DISTINCT vv.id) as verification_count,
      COUNT(DISTINCT pb.building_id) as building_count
    FROM property_managers pm
    LEFT JOIN vendor_verifications vv ON pm.id = vv.property_manager_id
    LEFT JOIN pm_buildings pb ON pm.id = pb.property_manager_id
    GROUP BY pm.id
  ) t
`);

// FALLBACK if no vendor_verifications - track via document uploads or activity
const pmMetricsFallback = await db.query(`
  SELECT 
    COUNT(DISTINCT pm.id) as total_pms,
    AVG(doc_count) as avg_documents,
    AVG(building_count) as avg_buildings
  FROM property_managers pm
  LEFT JOIN (
    SELECT uploaded_by, COUNT(*) as doc_count
    FROM documents
    WHERE document_type IN ('insurance_cert', 'safety_cert', 'license')
    GROUP BY uploaded_by
  ) d ON pm.user_id = d.uploaded_by
  LEFT JOIN (
    SELECT manager_id, COUNT(*) as building_count
    FROM buildings
    GROUP BY manager_id
  ) b ON pm.id = b.manager_id
`);
```

### 4.3 Building Data Lock-in (Data Moat Visualization)

```tsx
const BuildingDataMoatCard = ({ metrics }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 bg-orange-100 rounded-lg">
        <BuildingLibraryIcon className="w-6 h-6 text-orange-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">Building Data Moat</h3>
        <p className="text-sm text-gray-500">Maintenance history is irreplaceable</p>
      </div>
    </div>
    
    {/* Key Data Moat Metrics */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="text-center p-4 bg-orange-50 rounded-lg">
        <div className="text-3xl font-bold text-orange-600">
          {metrics.totalBuildings.toLocaleString()}
        </div>
        <div className="text-sm text-orange-700">Buildings</div>
      </div>
      <div className="text-center p-4 bg-orange-50 rounded-lg">
        <div className="text-3xl font-bold text-orange-600">
          {metrics.totalRecords.toLocaleString()}
        </div>
        <div className="text-sm text-orange-700">Total Records</div>
      </div>
      <div className="text-center p-4 bg-orange-50 rounded-lg">
        <div className="text-3xl font-bold text-orange-600">
          {metrics.avgRecordsPerBuilding.toFixed(0)}
        </div>
        <div className="text-sm text-orange-700">Avg Records/Building</div>
      </div>
    </div>
    
    {/* Record Type Breakdown */}
    <div className="mb-4">
      <h4 className="text-sm font-medium mb-2">Record Types</h4>
      <div className="space-y-2">
        {metrics.recordTypes.map(type => (
          <div key={type.name} className="flex items-center gap-2">
            <div className="w-24 text-sm text-gray-600">{type.name}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${(type.count / metrics.totalRecords) * 100}%` }}
              />
            </div>
            <div className="w-16 text-sm text-right">{type.count.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
    
    {/* Historical Depth Distribution */}
    <BuildingHistoryDepthChart data={metrics.historyDistribution} />
    
    {/* Investor Callout */}
    <div className="mt-4 p-4 bg-orange-100 rounded-lg border border-orange-200">
      <div className="font-semibold text-orange-800 mb-1">
        Replication Difficulty Index
      </div>
      <div className="text-sm text-orange-700">
        A competitor would need <strong>{metrics.totalRecords.toLocaleString()} records</strong> across 
        <strong> {metrics.totalBuildings.toLocaleString()} buildings</strong> to match this data moat. 
        At current accumulation rate, this represents 
        <strong> {metrics.yearsToReplicate.toFixed(1)} years</strong> of organic data collection.
      </div>
    </div>
  </div>
);
```

**Data Queries - FROM EXISTING TABLES:**

```typescript
// Building record counts - FROM EXISTING TABLES
const buildingDataMoat = await db.query(`
  WITH building_records AS (
    SELECT 
      b.id as building_id,
      b.created_at as building_created,
      COALESCE(p.project_count, 0) as projects,
      COALESCE(i.inspection_count, 0) as inspections,
      COALESCE(d.document_count, 0) as documents,
      COALESCE(w.work_session_count, 0) as work_sessions
    FROM buildings b
    LEFT JOIN (
      SELECT building_id, COUNT(*) as project_count 
      FROM projects GROUP BY building_id
    ) p ON b.id = p.building_id
    LEFT JOIN (
      SELECT building_id, COUNT(*) as inspection_count 
      FROM inspections GROUP BY building_id
    ) i ON b.id = i.building_id
    LEFT JOIN (
      SELECT building_id, COUNT(*) as document_count 
      FROM documents WHERE building_id IS NOT NULL GROUP BY building_id
    ) d ON b.id = d.building_id
    LEFT JOIN (
      SELECT building_id, COUNT(*) as work_session_count 
      FROM work_sessions GROUP BY building_id
    ) w ON b.id = w.building_id
  )
  SELECT 
    COUNT(*) as total_buildings,
    SUM(projects + inspections + documents + work_sessions) as total_records,
    AVG(projects + inspections + documents + work_sessions) as avg_records_per_building,
    SUM(projects) as total_projects,
    SUM(inspections) as total_inspections,
    SUM(documents) as total_documents,
    SUM(work_sessions) as total_work_sessions,
    AVG(EXTRACT(EPOCH FROM (NOW() - building_created)) / 2592000) as avg_building_age_months
  FROM building_records
`);

// Historical depth distribution
const historyDistribution = await db.query(`
  SELECT 
    CASE 
      WHEN age_months < 3 THEN '0-3 months'
      WHEN age_months < 6 THEN '3-6 months'
      WHEN age_months < 12 THEN '6-12 months'
      WHEN age_months < 24 THEN '1-2 years'
      ELSE '2+ years'
    END as history_band,
    COUNT(*) as building_count,
    AVG(record_count) as avg_records
  FROM (
    SELECT 
      b.id,
      EXTRACT(EPOCH FROM (NOW() - MIN(r.created_at))) / 2592000 as age_months,
      COUNT(r.id) as record_count
    FROM buildings b
    LEFT JOIN (
      SELECT building_id, created_at, id FROM projects
      UNION ALL
      SELECT building_id, created_at, id FROM inspections
      UNION ALL
      SELECT building_id, created_at, id FROM documents WHERE building_id IS NOT NULL
    ) r ON b.id = r.building_id
    GROUP BY b.id
  ) building_ages
  GROUP BY 1
  ORDER BY 1
`);
```

### 4.4 Retention by Connection Count

Critical investor metric - proves network effects drive retention:

```tsx
const RetentionByConnectionsChart = ({ data }) => {
  const options = {
    chart: { type: 'bar', height: 300, toolbar: { show: false } },
    series: [{
      name: '90-Day Retention',
      data: data.map(d => d.retention * 100),
    }],
    colors: ['#10B981'],
    plotOptions: {
      bar: { borderRadius: 6, columnWidth: '60%' },
    },
    xaxis: {
      categories: data.map(d => d.connectionBand),
      title: { text: 'Connection Count' },
    },
    yaxis: {
      title: { text: 'Retention Rate' },
      labels: { formatter: (val) => `${val.toFixed(0)}%` },
      max: 100,
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(0)}%`,
    },
    annotations: {
      yaxis: [{
        y: data[0]?.retention * 100 || 0,
        borderColor: '#9CA3AF',
        strokeDashArray: 5,
        label: { text: 'Baseline', style: { color: '#6B7280' } },
      }],
    },
  };

  // Calculate lift from lowest to highest band
  const retentionLift = data.length > 1 
    ? ((data[data.length - 1].retention - data[0].retention) / data[0].retention * 100).toFixed(0)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Retention by Connection Count</h3>
          <p className="text-sm text-gray-500">More connections = higher retention</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">+{retentionLift}%</div>
          <div className="text-sm text-gray-500">retention lift</div>
        </div>
      </div>
      <Chart options={options} series={options.series} type="bar" height={300} />
      <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm">
        <strong>Investor Signal:</strong> Users with 10+ connections retain at 
        {(data.find(d => d.connectionBand === '10+')?.retention * 100 || 0).toFixed(0)}% 
        vs {(data.find(d => d.connectionBand === '1-2')?.retention * 100 || 0).toFixed(0)}% 
        for users with 1-2 connections. This proves network effects drive retention.
      </div>
    </div>
  );
};
```

**Data Query - FROM EXISTING TABLES:**

```typescript
const retentionByConnections = await db.query(`
  WITH user_connections AS (
    SELECT 
      u.id,
      u.role,
      u.created_at,
      CASE WHEN u.last_active_at > NOW() - INTERVAL '90 days' THEN true ELSE false END as retained,
      COALESCE(conn.connection_count, 0) as connections
    FROM users u
    LEFT JOIN (
      -- Count connections based on role
      SELECT user_id, COUNT(DISTINCT other_party_id) as connection_count
      FROM (
        -- Tech connections = employers worked for
        SELECT tech_id as user_id, company_id as other_party_id FROM employees
        UNION
        -- Employer connections = techs employed
        SELECT company_id as user_id, tech_id as other_party_id FROM employees
        UNION
        -- PM connections = verified vendors
        SELECT property_manager_id as user_id, vendor_company_id as other_party_id 
        FROM vendor_verifications WHERE vendor_verifications EXISTS
        UNION
        -- Building manager connections = managed buildings
        SELECT manager_id as user_id, id as other_party_id FROM buildings
      ) all_connections
      GROUP BY user_id
    ) conn ON u.id = conn.user_id
    WHERE u.created_at < NOW() - INTERVAL '90 days' -- Mature accounts only
  )
  SELECT 
    CASE 
      WHEN connections = 0 THEN '0'
      WHEN connections BETWEEN 1 AND 2 THEN '1-2'
      WHEN connections BETWEEN 3 AND 5 THEN '3-5'
      WHEN connections BETWEEN 6 AND 10 THEN '6-10'
      ELSE '10+'
    END as connection_band,
    AVG(CASE WHEN retained THEN 1 ELSE 0 END) as retention,
    COUNT(*) as user_count
  FROM user_connections
  GROUP BY 1
  ORDER BY MIN(connections)
`);
```

---

## Part 5: Investor View Tab

### 5.1 Cohort Retention Comparison

The most important investor chart - newer cohorts should retain better:

```tsx
const CohortRetentionChart = ({ cohorts }) => {
  const options = {
    chart: { type: 'line', height: 400, toolbar: { show: false } },
    series: cohorts.map(cohort => ({
      name: cohort.name,
      data: cohort.retentionCurve,
    })),
    colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'], // Older to newer
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'],
      title: { text: 'Months Since Signup' },
    },
    yaxis: {
      title: { text: 'Retention Rate' },
      labels: { formatter: (val) => `${val}%` },
      max: 100,
      min: 0,
    },
    legend: { position: 'top' },
    annotations: {
      texts: [{
        x: 'M12',
        y: cohorts[cohorts.length - 1]?.retentionCurve[12] || 0,
        text: 'Newest cohort retains better →',
        textAnchor: 'end',
      }],
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Cohort Retention Comparison</h3>
          <p className="text-sm text-gray-500">
            Newer cohorts joining a larger network should retain better
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          cohorts[cohorts.length - 1]?.retentionCurve[6] > cohorts[0]?.retentionCurve[6]
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {cohorts[cohorts.length - 1]?.retentionCurve[6] > cohorts[0]?.retentionCurve[6]
            ? '✓ Network Effects Proven'
            : '⚠ Network Effects Unproven'}
        </div>
      </div>
      <Chart options={options} series={options.series} type="line" height={400} />
    </div>
  );
};
```

**Data Query - FROM EXISTING TABLES:**

```typescript
const cohortRetention = await db.query(`
  WITH cohorts AS (
    SELECT 
      id,
      DATE_TRUNC('quarter', created_at) as cohort,
      created_at,
      last_active_at
    FROM users
    WHERE created_at > NOW() - INTERVAL '2 years'
  ),
  retention_by_month AS (
    SELECT 
      cohort,
      EXTRACT(MONTH FROM AGE(check_date, created_at)) as months_since_signup,
      COUNT(CASE WHEN last_active_at >= check_date THEN 1 END)::float / COUNT(*) as retention
    FROM cohorts
    CROSS JOIN generate_series(
      (SELECT MIN(created_at) FROM cohorts),
      NOW(),
      '1 month'::interval
    ) as check_date
    WHERE check_date >= created_at
    GROUP BY cohort, months_since_signup
  )
  SELECT 
    TO_CHAR(cohort, 'YYYY-Q') as cohort_name,
    ARRAY_AGG(retention * 100 ORDER BY months_since_signup) as retention_curve
  FROM retention_by_month
  WHERE months_since_signup <= 12
  GROUP BY cohort
  ORDER BY cohort
`);
```

### 5.2 Network Effect Summary for Investors

```tsx
const InvestorSummaryCard = ({ metrics }) => (
  <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg shadow-lg p-8 text-white">
    <h3 className="text-2xl font-bold mb-6">Network Effect Summary</h3>
    
    <div className="grid grid-cols-2 gap-8">
      {/* Cross-Side Proof */}
      <div>
        <h4 className="text-blue-200 text-sm uppercase tracking-wide mb-3">
          Cross-Side Network Effects
        </h4>
        <div className="space-y-3">
          <ProofPoint 
            label="Collaborator → Customer Rate" 
            value={`${(metrics.collaboratorConversion * 100).toFixed(0)}%`}
            benchmark="Procore: 40%"
            passing={metrics.collaboratorConversion >= 0.2}
          />
          <ProofPoint 
            label="Match Rate" 
            value={`${(metrics.matchRate * 100).toFixed(0)}%`}
            benchmark="Target: >40%"
            passing={metrics.matchRate >= 0.4}
          />
          <ProofPoint 
            label="Geographic Correlation" 
            value={`r=${metrics.geoCorrelation.toFixed(2)}`}
            benchmark="Target: >0.7"
            passing={metrics.geoCorrelation >= 0.7}
          />
        </div>
      </div>
      
      {/* Retention Proof */}
      <div>
        <h4 className="text-blue-200 text-sm uppercase tracking-wide mb-3">
          Retention & Lock-in
        </h4>
        <div className="space-y-3">
          <ProofPoint 
            label="Net Revenue Retention" 
            value={`${(metrics.nrr * 100).toFixed(0)}%`}
            benchmark="Target: >110%"
            passing={metrics.nrr >= 1.1}
          />
          <ProofPoint 
            label="Cohort Improvement" 
            value={metrics.cohortImprovement > 0 ? 'Yes' : 'No'}
            benchmark="Newer > Older"
            passing={metrics.cohortImprovement > 0}
          />
          <ProofPoint 
            label="Retention by Connections" 
            value={`+${metrics.connectionRetentionLift}%`}
            benchmark="Positive correlation"
            passing={metrics.connectionRetentionLift > 0}
          />
        </div>
      </div>
      
      {/* Data Moat */}
      <div>
        <h4 className="text-blue-200 text-sm uppercase tracking-wide mb-3">
          Data Moat
        </h4>
        <div className="space-y-3">
          <ProofPoint 
            label="Building Records" 
            value={metrics.totalBuildingRecords.toLocaleString()}
            benchmark="Accumulating"
            passing={true}
          />
          <ProofPoint 
            label="Avg Data Depth" 
            value={`${metrics.avgDataDepthMonths.toFixed(0)} months`}
            benchmark="Growing"
            passing={metrics.avgDataDepthMonths > 6}
          />
          <ProofPoint 
            label="Replication Time" 
            value={`${metrics.yearsToReplicate.toFixed(1)} years`}
            benchmark=">2 years"
            passing={metrics.yearsToReplicate >= 2}
          />
        </div>
      </div>
      
      {/* Viral Growth */}
      <div>
        <h4 className="text-blue-200 text-sm uppercase tracking-wide mb-3">
          Viral Growth
        </h4>
        <div className="space-y-3">
          <ProofPoint 
            label="Viral Coefficient (K)" 
            value={metrics.viralCoefficient.toFixed(2)}
            benchmark="Target: >0.4"
            passing={metrics.viralCoefficient >= 0.4}
          />
          <ProofPoint 
            label="Organic Acquisition" 
            value={`${(metrics.organicPercent * 100).toFixed(0)}%`}
            benchmark="Target: >50%"
            passing={metrics.organicPercent >= 0.5}
          />
          <ProofPoint 
            label="CAC Trend" 
            value={metrics.cacTrend < 0 ? 'Declining' : 'Flat/Rising'}
            benchmark="Declining"
            passing={metrics.cacTrend < 0}
          />
        </div>
      </div>
    </div>
    
    {/* Bottom Line */}
    <div className="mt-8 pt-6 border-t border-blue-600">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-blue-200 text-sm">Overall Network Effect Grade</div>
          <div className="text-4xl font-bold">{metrics.overallGrade}</div>
        </div>
        <div className="text-right">
          <div className="text-blue-200 text-sm">Passing Proof Points</div>
          <div className="text-4xl font-bold">{metrics.passingCount}/12</div>
        </div>
      </div>
    </div>
  </div>
);
```

---

## Part 6: API Endpoints

### GET /api/superuser/network

```typescript
export async function GET() {
  return Response.json({
    healthScore: await calculateNetworkHealthScore(),
    
    accountSummary: {
      techs: await getTechMetrics(),
      employers: await getEmployerMetrics(),
      propertyManagers: await getPMMetrics(),
      buildingManagers: await getBuildingManagerMetrics(),
    },
    
    crossSideMetrics: {
      matchRate: await calculateMatchRate(),
      collaboratorConversion: await calculateCollaboratorConversion(),
      geographicDensity: await getGeographicDensity(),
      crossSideFunnel: await getCrossSideFunnel(),
    },
    
    lockInMetrics: {
      techLockIn: await getTechLockInMetrics(),
      pmLockIn: await getPMLockInMetrics(),
      buildingDataMoat: await getBuildingDataMoatMetrics(),
      retentionByConnections: await getRetentionByConnections(),
    },
    
    investorMetrics: {
      cohortRetention: await getCohortRetentionComparison(),
      nrr: await calculateNRR(),
      viralCoefficient: await calculateViralCoefficient(),
      organicAcquisition: await calculateOrganicPercent(),
    },
  });
}
```

---

## Part 7: Tracking Gaps Report

**IMPORTANT:** After reviewing the database schema, create a report listing any metrics that cannot be calculated from existing data. Format as follows:

```markdown
# Tracking Gaps Report

## Missing Tables

### 1. referrals
**Purpose:** Track user referrals for viral coefficient calculation
**Required Fields:**
- referrer_id, referrer_type
- referred_email, referred_user_id
- status (pending/signed_up/converted)
- created_at, converted_at

**Metrics Blocked:**
- Viral Coefficient (K-factor)
- Same-side network effects
- Referral attribution

### 2. searches
**Purpose:** Track search activity and engagement for match rate
**Required Fields:**
- searcher_id, searcher_type
- search_type, query_params
- results_count, engagement_count
- created_at

**Metrics Blocked:**
- Match Rate
- Time-to-Match
- Search-to-hire funnel

### 3. vendor_verifications
**Purpose:** Track PM compliance checks on vendors
**Required Fields:**
- property_manager_id, vendor_company_id
- verification_type, status
- verified_at, expires_at

**Metrics Blocked:**
- PM lock-in metrics
- Compliance data depth
- Vendor relationship tracking

## Missing Fields on Existing Tables

### users table
- referral_source: How did this user discover the platform?
- referred_by_user_id: Who referred them?

### companies table
- referral_source: Attribution for collaborator conversion metric
- first_exposure_date: When did they first see the platform?

### tech_accounts table
- profile_completeness_score: Pre-calculated completeness (or calculate on-the-fly)

## Tracking Events Needed

### Profile Views
Track when employers view tech profiles for cross-side funnel

### Contact/Message Events
Track when employers contact techs for match rate

### Feature Usage
Track which features each account type uses for engagement scoring
```

---

## Summary

This dashboard proves to investors that OnRopePro has:

1. **Cross-Side Network Effects** - More techs → more employers → more techs
2. **Same-Side Network Effects** - Referrals and peer connections
3. **Data Moat** - Building maintenance history that compounds over time
4. **Lock-in** - Switching costs increase with platform usage
5. **Improving Unit Economics** - CAC decreases as network grows

The metrics follow frameworks from Procore (collaborator conversion), ServiceTitan (outcome correlation), and a16z (marketplace health indicators).
