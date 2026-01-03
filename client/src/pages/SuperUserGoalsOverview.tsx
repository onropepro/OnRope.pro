import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { 
  Users, Target, Building2, TrendingUp, TrendingDown, DollarSign,
  Activity, AlertCircle, CheckCircle2, Clock, Share2, 
  MapPin, BarChart3, Gauge, Bell, Calendar
} from "lucide-react";

interface MetricsSummary {
  mrr: number;
  arr: number;
  customers: {
    total: number;
    active: number;
    trial: number;
    churned: number;
  };
  usage: {
    totalProjects: number;
    totalEmployees: number;
    totalBuildings: number;
    totalClients: number;
  };
}

type MetricStatus = "on-track" | "at-risk" | "behind";

interface LeadingMetric {
  id: string;
  name: string;
  current: number;
  goal: number;
  unit: string;
  daysLeft: number;
  requiredRate: number;
  actualRate: number;
  status: MetricStatus;
  icon: typeof Users;
  goalDate: string;
}

interface LaggingMetric {
  id: string;
  name: string;
  current: number | string;
  goal: number | string;
  unit: string;
  status: MetricStatus;
  icon: typeof DollarSign;
  description: string;
}

const getStatusConfig = (status: MetricStatus) => {
  const configs = {
    "on-track": { 
      label: "On Track", 
      icon: CheckCircle2, 
      color: "text-emerald-500", 
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
    },
    "at-risk": { 
      label: "At Risk", 
      icon: Clock, 
      color: "text-amber-500", 
      bg: "bg-amber-50 dark:bg-amber-500/10",
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
    },
    "behind": { 
      label: "Behind", 
      icon: AlertCircle, 
      color: "text-red-500", 
      bg: "bg-red-50 dark:bg-red-500/10",
      badge: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
    }
  };
  return configs[status];
};

const calculateRateStatus = (actualRate: number, requiredRate: number): MetricStatus => {
  const ratio = actualRate / requiredRate;
  if (ratio >= 1.0) return "on-track";
  if (ratio >= 0.5) return "at-risk";
  return "behind";
};

const calculatePaceStatus = (current: number, goal: number, percentThreshold = 0.8): MetricStatus => {
  const ratio = current / goal;
  if (ratio >= percentThreshold) return "on-track";
  if (ratio >= percentThreshold * 0.625) return "at-risk";
  return "behind";
};

const calculateViralStatus = (k: number): MetricStatus => {
  if (k >= 1.0) return "on-track";
  if (k >= 0.7) return "at-risk";
  return "behind";
};

const calculateConversionStatus = (rate: number, goal: number): MetricStatus => {
  if (rate >= goal) return "on-track";
  if (rate >= goal * 0.75) return "at-risk";
  return "behind";
};

const leadingIndicatorsData = [
  {
    id: "tech-accounts",
    name: "Tech Accounts",
    current: 162,
    goal: 500,
    unit: "accounts",
    daysLeft: 87,
    requiredRate: 3.9,
    actualRate: 2.1,
    icon: Users,
    goalDate: "Jun 30, 2026"
  },
  {
    id: "viral-coefficient",
    name: "Viral Coefficient (k)",
    current: 0.90,
    goal: 1.0,
    unit: "",
    daysLeft: 120,
    requiredRate: 1.0,
    actualRate: 0.90,
    icon: Share2,
    goalDate: "Q2 2026"
  },
  {
    id: "trial-starts",
    name: "Trial Starts",
    current: 6,
    goal: 10,
    unit: "/month",
    daysLeft: 12,
    requiredRate: 0.33,
    actualRate: 0.29,
    icon: Target,
    goalDate: "Month 3"
  },
  {
    id: "trial-conversion",
    name: "Trial-to-Paid Conversion",
    current: 36,
    goal: 40,
    unit: "%",
    daysLeft: 0,
    requiredRate: 40,
    actualRate: 36,
    icon: TrendingUp,
    goalDate: "Ongoing"
  }
];

const leadingIndicators: LeadingMetric[] = leadingIndicatorsData.map(m => {
  let status: MetricStatus;
  if (m.id === "tech-accounts") {
    status = calculateRateStatus(m.actualRate, m.requiredRate);
  } else if (m.id === "viral-coefficient") {
    status = calculateViralStatus(m.current);
  } else if (m.id === "trial-starts") {
    status = calculatePaceStatus(m.current, m.goal, 0.8);
  } else if (m.id === "trial-conversion") {
    status = calculateConversionStatus(m.current, m.goal);
  } else {
    status = "at-risk";
  }
  return { ...m, status };
});

const calculateArpuStatus = (current: number, goal: number): MetricStatus => {
  const variance = Math.abs(current - goal) / goal;
  if (variance <= 0.05) return "on-track";
  if (variance <= 0.15) return "at-risk";
  return "behind";
};

const calculateChurnStatus = (currentPercent: number, goalPercent: number): MetricStatus => {
  if (currentPercent <= goalPercent) return "on-track";
  if (currentPercent <= goalPercent * 1.8) return "at-risk";
  return "behind";
};

const calculateNrrStatus = (current: number, goal: number): MetricStatus => {
  if (current >= goal) return "on-track";
  if (current >= 100) return "at-risk";
  return "behind";
};

const laggingIndicatorsData = [
  {
    id: "paying-customers",
    name: "Paying Customers",
    current: 8,
    goal: 25,
    unit: "customers",
    icon: Users,
    description: "25 customers by Dec 31, 2026",
    requiredRate: 0.12,
    actualRate: 0.10
  },
  {
    id: "mrr",
    name: "Monthly Recurring Revenue",
    current: 6304,
    goal: 19700,
    unit: "$",
    icon: DollarSign,
    description: "$19,700 MRR by Dec 31, 2026",
    requiredRate: 94,
    actualRate: 78
  },
  {
    id: "arpu",
    name: "Average Revenue Per User",
    current: 788,
    goal: 788,
    unit: "$/month",
    icon: BarChart3,
    description: "$99 base + $34.95/employee"
  },
  {
    id: "churn",
    name: "Monthly Churn Rate",
    currentPercent: 0.0,
    goalPercent: 0.83,
    current: "0.0%",
    goal: "<0.83%",
    unit: "",
    icon: TrendingDown,
    description: "<10% annual target"
  },
  {
    id: "nrr",
    name: "Net Revenue Retention",
    currentPercent: 115,
    goalPercent: 115,
    current: "115%",
    goal: "≥115%",
    unit: "",
    icon: Activity,
    description: "Expansion offsets churn"
  }
];

const laggingIndicators: LaggingMetric[] = laggingIndicatorsData.map(m => {
  let status: MetricStatus;
  if (m.id === "paying-customers" || m.id === "mrr") {
    const rate = m.actualRate as number;
    const required = m.requiredRate as number;
    status = calculateRateStatus(rate, required);
  } else if (m.id === "arpu") {
    status = calculateArpuStatus(m.current as number, m.goal as number);
  } else if (m.id === "churn") {
    status = calculateChurnStatus((m as { currentPercent: number }).currentPercent, (m as { goalPercent: number }).goalPercent);
  } else if (m.id === "nrr") {
    status = calculateNrrStatus((m as { currentPercent: number }).currentPercent, (m as { goalPercent: number }).goalPercent);
  } else {
    status = "at-risk";
  }
  return { 
    id: m.id,
    name: m.name,
    current: m.current,
    goal: m.goal,
    unit: m.unit,
    icon: m.icon,
    description: m.description,
    status 
  };
});

const geographicData = {
  buildings: {
    total: 0,
    byCountry: [
      { name: "Canada", count: 0, goal: null },
      { name: "USA", count: 0, goal: null }
    ],
    byProvince: [
      { name: "British Columbia", count: 0 },
      { name: "Alberta", count: 0 },
      { name: "Ontario", count: 0 },
      { name: "California", count: 0 },
      { name: "Washington", count: 0 }
    ]
  },
  techs: {
    total: 0,
    goal: 500,
    byCountry: [
      { name: "Canada", count: 0, goal: 400 },
      { name: "USA", count: 0, goal: 100 }
    ]
  },
  employers: {
    total: 0,
    goal: 25,
    byCountry: [
      { name: "Canada", count: 0, goal: 25 },
      { name: "USA", count: 0, goal: 0 }
    ]
  },
  propertyManagers: {
    total: 0,
    byCountry: [
      { name: "Canada", count: 0 },
      { name: "USA", count: 0 }
    ]
  }
};

const unitEconomics = {
  cac: { value: 0, goal: 1500, status: "on-track" as MetricStatus },
  ltv: { value: 89866, arpu: 788, margin: 0.95, lifespan: 10 },
  ltvCac: { value: null as number | null, goal: 3, target: 60 },
  payback: { value: null as number | null, goal: 12, monthlyContribution: 749 }
};

const engagementMetrics = {
  employers: {
    dauMau: 0,
    sessionsPerWeek: 0,
    projectsCreated: 0,
    photosUploaded: 0,
    timeEntriesLogged: 0
  },
  techs: {
    activeTechs: 0,
    percentActive: 0,
    sessionsPerWeek: 0,
    profileCompleteness: 0
  },
  propertyManagers: {
    activePMs: 0,
    portalLogins: 0,
    reportsViewed: 0
  },
  healthScore: 0
};

const smartGoals = [
  { goal: "Tech Accounts", specific: "500 free tech accounts", measurable: "Dashboard count", achievable: "Industry size supports", relevant: "Drives employer adoption", timeBound: "Jun 30, 2026" },
  { goal: "Viral Coefficient", specific: "k ≥ 1.0", measurable: "Referrals/Signups", achievable: "Referral program in place", relevant: "Self-sustaining growth", timeBound: "Q2 2026" },
  { goal: "Customers", specific: "25 paying employers", measurable: "Subscription count", achievable: "Market validation", relevant: "Revenue foundation", timeBound: "Dec 31, 2026" },
  { goal: "MRR", specific: "$19,700", measurable: "Stripe revenue", achievable: "25 × $788 ARPU", relevant: "Break-even path", timeBound: "Dec 31, 2026" },
  { goal: "Churn", specific: "<10% annual", measurable: "Lost/Starting", achievable: "Industry benchmark", relevant: "LTV protection", timeBound: "Ongoing" },
  { goal: "NRR", specific: "≥115%", measurable: "Cohort analysis", achievable: "Seat expansion trend", relevant: "Growth efficiency", timeBound: "Ongoing" }
];

const triggerEscalations = [
  { condition: "Any metric Behind for 7+ days", alert: "Slack + Email", action: "Immediate review" },
  { condition: "3+ metrics At Risk", alert: "Weekly summary", action: "Strategy adjustment" },
  { condition: "Tech signups <1/day for 3 days", alert: "Slack alert", action: "Marketing push" },
  { condition: "Trial starts = 0 for 7 days", alert: "Urgent alert", action: "Outreach review" },
  { condition: "Any churn event", alert: "Instant alert", action: "Exit interview" },
  { condition: "MRR decline MoM", alert: "Weekly alert", action: "Churn analysis" }
];

const reviewCadence = [
  { frequency: "Daily", review: "Tech signups, trial starts" },
  { frequency: "Weekly", review: "All leading indicators" },
  { frequency: "Monthly", review: "All metrics, goal adjustment" },
  { frequency: "Quarterly", review: "Strategic review, goal reset" }
];

interface GoalGaugeProps {
  label: string;
  actual: number;
  goal: number;
  format?: 'number' | 'currency' | 'percent';
}

function GoalProgressGauge({ label, actual, goal, format = 'number' }: GoalGaugeProps) {
  const percent = Math.min((actual / goal) * 100, 100);
  const status = percent >= 100 ? 'on-track' : percent >= 80 ? 'at-risk' : 'behind';
  const color = status === 'on-track' ? '#10B981' : status === 'at-risk' ? '#F59E0B' : '#EF4444';
  
  const formatValue = (val: number) => {
    if (format === 'currency') return `$${val.toLocaleString()}`;
    if (format === 'percent') return `${val}%`;
    return val.toLocaleString();
  };

  const options: ApexOptions = {
    chart: { 
      type: 'radialBar', 
      height: 200,
      sparkline: { enabled: true },
    },
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

  const statusConfig = getStatusConfig(status);

  return (
    <div className="su-card p-4">
      <div className="flex justify-between items-center mb-2 gap-2 flex-wrap">
        <h4 className="font-medium text-foreground">{label}</h4>
        <Badge className={statusConfig.badge}>
          {statusConfig.label}
        </Badge>
      </div>
      <Chart options={options} series={[Math.round(percent)]} type="radialBar" height={200} />
    </div>
  );
}

const pricingModelData = {
  base: { monthly: 99, annual: 82.17 },
  seat: { standard: 34.95, volume: 29.95 },
  whiteLabel: 49,
  volumeThreshold: 30,
};

export default function SuperUserGoalsOverview() {
  const { data: metrics, isLoading } = useQuery<MetricsSummary>({
    queryKey: ["/api/superuser/metrics/summary"],
  });

  const currentTechAccounts = metrics?.usage?.totalEmployees || 0;
  const currentBuildings = metrics?.usage?.totalBuildings || 0;
  const currentPropertyManagers = metrics?.usage?.totalClients || 0;
  const currentEmployers = metrics?.customers?.active || 0;
  const currentMRR = metrics?.mrr || 0;

  const onTrackCount = [...leadingIndicators, ...laggingIndicators].filter(m => m.status === "on-track").length;
  const totalMetrics = leadingIndicators.length + laggingIndicators.length;
  const overallHealth = onTrackCount >= totalMetrics * 0.6 ? "on-track" : onTrackCount >= totalMetrics * 0.4 ? "at-risk" : "behind";

  if (isLoading) {
    return (
      <SuperUserLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-48" />)}
            </div>
          </div>
        </div>
      </SuperUserLayout>
    );
  }

  return (
    <SuperUserLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground" data-testid="text-page-title">
                  Metrics Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Real-time visibility into the metrics that matter
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusConfig(overallHealth).badge} data-testid="badge-overall-health">
                  {getStatusConfig(overallHealth).label}: {onTrackCount}/{totalMetrics} metrics on track
                </Badge>
              </div>
            </div>
          </div>

          <Tabs defaultValue="summary" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1" data-testid="tabs-metrics">
              <TabsTrigger value="summary" data-testid="tab-summary">Summary</TabsTrigger>
              <TabsTrigger value="leading" data-testid="tab-leading">Leading</TabsTrigger>
              <TabsTrigger value="lagging" data-testid="tab-lagging">Lagging</TabsTrigger>
              <TabsTrigger value="geographic" data-testid="tab-geographic">Geographic</TabsTrigger>
              <TabsTrigger value="economics" data-testid="tab-economics">Unit Economics</TabsTrigger>
              <TabsTrigger value="engagement" data-testid="tab-engagement">Engagement</TabsTrigger>
              <TabsTrigger value="goals" data-testid="tab-goals">SMART Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6">
              {/* Visual Goal Progress Gauges */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" data-testid="goal-gauges">
                <GoalProgressGauge 
                  label="Tech Accounts" 
                  actual={currentTechAccounts} 
                  goal={500} 
                />
                <GoalProgressGauge 
                  label="Viral Coefficient" 
                  actual={0.90} 
                  goal={1.0} 
                />
                <GoalProgressGauge 
                  label="Trial Starts/Mo" 
                  actual={6} 
                  goal={10} 
                />
                <GoalProgressGauge 
                  label="Conversion Rate" 
                  actual={36} 
                  goal={40} 
                  format="percent"
                />
                <GoalProgressGauge 
                  label="Paying Customers" 
                  actual={currentEmployers} 
                  goal={25} 
                />
                <GoalProgressGauge 
                  label="MRR" 
                  actual={currentMRR} 
                  goal={19700} 
                  format="currency"
                />
              </div>

              <div className="su-card" data-testid="card-summary-dashboard">
                <div className="su-card-header">
                  <h3 className="font-semibold text-foreground">At-a-Glance View</h3>
                  <p className="text-sm text-muted-foreground">All key metrics in one place</p>
                </div>
                <div className="su-card-body">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="table-summary">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Metric</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Goal</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actual</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leadingIndicators.map((m) => {
                          const StatusIcon = getStatusConfig(m.status).icon;
                          return (
                            <tr key={m.id} className="border-b border-gray-100 dark:border-gray-800" data-testid={`row-metric-${m.id}`}>
                              <td className="py-3 px-4 font-medium text-foreground">{m.name}</td>
                              <td className="py-3 px-4 text-right text-muted-foreground">
                                {typeof m.goal === 'number' && m.goal >= 1 ? m.goal.toLocaleString() : m.goal}{m.unit}
                              </td>
                              <td className="py-3 px-4 text-right text-muted-foreground">
                                {typeof m.current === 'number' && m.current >= 1 ? m.current.toLocaleString() : m.current}{m.unit}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <StatusIcon className={`h-5 w-5 mx-auto ${getStatusConfig(m.status).color}`} />
                              </td>
                            </tr>
                          );
                        })}
                        {laggingIndicators.map((m) => {
                          const StatusIcon = getStatusConfig(m.status).icon;
                          return (
                            <tr key={m.id} className="border-b border-gray-100 dark:border-gray-800" data-testid={`row-metric-${m.id}`}>
                              <td className="py-3 px-4 font-medium text-foreground">{m.name}</td>
                              <td className="py-3 px-4 text-right text-muted-foreground">
                                {m.unit === '$' ? `$${typeof m.goal === 'number' ? m.goal.toLocaleString() : m.goal}` : m.goal}
                              </td>
                              <td className="py-3 px-4 text-right text-muted-foreground">
                                {m.unit === '$' ? `$${typeof m.current === 'number' ? m.current.toLocaleString() : m.current}` : m.current}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <StatusIcon className={`h-5 w-5 mx-auto ${getStatusConfig(m.status).color}`} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="su-card" data-testid="card-trigger-escalations">
                  <div className="su-card-header">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-amber-500" />
                      <h3 className="font-semibold text-foreground">Trigger Escalations</h3>
                    </div>
                  </div>
                  <div className="su-card-body">
                    <div className="space-y-3">
                      {triggerEscalations.map((t, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50" data-testid={`row-trigger-${idx}`}>
                          <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{t.condition}</p>
                            <p className="text-xs text-muted-foreground">{t.alert} → {t.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="su-card" data-testid="card-review-cadence">
                  <div className="su-card-header">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold text-foreground">Review Cadence</h3>
                    </div>
                  </div>
                  <div className="su-card-body">
                    <div className="space-y-3">
                      {reviewCadence.map((r, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50" data-testid={`row-cadence-${idx}`}>
                          <span className="font-medium text-foreground">{r.frequency}</span>
                          <span className="text-sm text-muted-foreground">{r.review}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="leading" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {leadingIndicators.map((metric) => {
                  const Icon = metric.icon;
                  const statusConfig = getStatusConfig(metric.status);
                  const StatusIcon = statusConfig.icon;
                  const progress = metric.goal > 0 ? (metric.current / metric.goal) * 100 : 0;
                  const remaining = metric.goal - metric.current;

                  return (
                    <div key={metric.id} className="su-card" data-testid={`card-leading-${metric.id}`}>
                      <div className="su-card-header">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                              <Icon className={`h-5 w-5 ${statusConfig.color}`} />
                            </div>
                            <h3 className="font-semibold text-foreground">{metric.name}</h3>
                          </div>
                          <Badge className={statusConfig.badge}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="su-card-body space-y-4">
                        <div className="flex items-baseline justify-between">
                          <span className="text-3xl font-bold text-foreground">
                            {metric.current.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                          </span>
                          <span className="text-muted-foreground">
                            of {metric.goal.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <Progress value={Math.min(progress, 100)} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{progress.toFixed(1)}% complete</span>
                            <span>Goal: {metric.goalDate}</span>
                          </div>
                        </div>

                        {metric.daysLeft > 0 && (
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                            <div>
                              <p className="text-xs text-muted-foreground">Remaining</p>
                              <p className="font-medium text-foreground">
                                {remaining.toLocaleString()} · {metric.daysLeft} days
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Rate (Need vs Actual)</p>
                              <p className="font-medium text-foreground">
                                {metric.requiredRate}/day vs {metric.actualRate}/day
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="lagging" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {laggingIndicators.map((metric) => {
                  const Icon = metric.icon;
                  const statusConfig = getStatusConfig(metric.status);
                  const StatusIcon = statusConfig.icon;
                  const numCurrent = typeof metric.current === 'number' ? metric.current : 0;
                  const numGoal = typeof metric.goal === 'number' ? metric.goal : 0;
                  const progress = numGoal > 0 ? (numCurrent / numGoal) * 100 : (metric.status === 'on-track' ? 100 : 0);

                  return (
                    <div key={metric.id} className="su-card" data-testid={`card-lagging-${metric.id}`}>
                      <div className="su-card-header">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                              <Icon className={`h-5 w-5 ${statusConfig.color}`} />
                            </div>
                            <h3 className="font-semibold text-foreground text-sm">{metric.name}</h3>
                          </div>
                          <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                        </div>
                      </div>
                      <div className="su-card-body space-y-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-bold text-foreground">
                            {metric.unit === '$' ? `$${numCurrent.toLocaleString()}` : metric.current}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Goal: {metric.unit === '$' ? `$${numGoal.toLocaleString()}` : metric.goal}
                          </span>
                        </div>
                        
                        {numGoal > 0 && (
                          <Progress value={Math.min(progress, 100)} className="h-1.5" />
                        )}

                        <p className="text-xs text-muted-foreground">{metric.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="su-card" data-testid="card-pricing-model">
                <div className="su-card-header">
                  <h3 className="font-semibold text-foreground">Pricing Model</h3>
                  <p className="text-sm text-muted-foreground">Current employee-based subscription structure</p>
                </div>
                <div className="su-card-body">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30">
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Base Fee (Monthly)</p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">$99/month</p>
                      <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">Per account</p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30">
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">Base Fee (Annual)</p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">$82.17/month</p>
                      <p className="text-xs text-green-500 dark:text-green-400 mt-1">17% discount</p>
                    </div>
                    <div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30">
                      <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">Per Employee (1-29)</p>
                      <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">$34.95/month</p>
                      <p className="text-xs text-cyan-500 dark:text-cyan-400 mt-1">Standard rate</p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30">
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Per Employee (30+)</p>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">$29.95/month</p>
                      <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">Volume discount</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30">
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">White Label Branding</p>
                      <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">$49/month</p>
                      <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">Custom branding add-on</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-500/10 border border-gray-200 dark:border-gray-500/30">
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Weighted Average ARPU</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$788/month</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Based on customer mix distribution</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="geographic" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="su-card" data-testid="card-geo-buildings">
                  <div className="su-card-header">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-amber-500" />
                      <h3 className="font-semibold text-foreground">Buildings by Location</h3>
                    </div>
                  </div>
                  <div className="su-card-body">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <span className="font-medium text-foreground">Total</span>
                        <span className="text-xl font-bold text-foreground">{geographicData.buildings.total}</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase">By Country</p>
                        {geographicData.buildings.byCountry.map((c) => (
                          <div key={c.name} className="flex items-center justify-between py-2 px-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{c.name}</span>
                            </div>
                            <span className="font-medium text-foreground">{c.count}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase">By Province/State</p>
                        {geographicData.buildings.byProvince.map((p) => (
                          <div key={p.name} className="flex items-center justify-between py-2 px-3">
                            <span className="text-gray-700 dark:text-gray-300">{p.name}</span>
                            <span className="font-medium text-foreground">{p.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="su-card" data-testid="card-geo-techs">
                  <div className="su-card-header">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold text-foreground">Tech Accounts by Location</h3>
                    </div>
                  </div>
                  <div className="su-card-body">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <span className="font-medium text-foreground">Total</span>
                        <div className="text-right">
                          <span className="text-xl font-bold text-foreground">{geographicData.techs.total}</span>
                          <span className="text-sm text-muted-foreground ml-2">/ {geographicData.techs.goal}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase">By Country</p>
                        {geographicData.techs.byCountry.map((c) => (
                          <div key={c.name} className="flex items-center justify-between py-2 px-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{c.name}</span>
                            </div>
                            <div>
                              <span className="font-medium text-foreground">{c.count}</span>
                              <span className="text-sm text-muted-foreground ml-1">/ {c.goal}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="su-card" data-testid="card-geo-employers">
                  <div className="su-card-header">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-500" />
                      <h3 className="font-semibold text-foreground">Employer Accounts by Location</h3>
                    </div>
                  </div>
                  <div className="su-card-body">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <span className="font-medium text-foreground">Total</span>
                        <div className="text-right">
                          <span className="text-xl font-bold text-foreground">{geographicData.employers.total}</span>
                          <span className="text-sm text-muted-foreground ml-2">/ {geographicData.employers.goal}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase">By Country</p>
                        {geographicData.employers.byCountry.map((c) => (
                          <div key={c.name} className="flex items-center justify-between py-2 px-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{c.name}</span>
                            </div>
                            <div>
                              <span className="font-medium text-foreground">{c.count}</span>
                              <span className="text-sm text-muted-foreground ml-1">/ {c.goal}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="su-card" data-testid="card-geo-pms">
                  <div className="su-card-header">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-teal-500" />
                      <h3 className="font-semibold text-foreground">Property Manager Accounts</h3>
                    </div>
                  </div>
                  <div className="su-card-body">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <span className="font-medium text-foreground">Total</span>
                        <span className="text-xl font-bold text-foreground">{geographicData.propertyManagers.total}</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase">By Country</p>
                        {geographicData.propertyManagers.byCountry.map((c) => (
                          <div key={c.name} className="flex items-center justify-between py-2 px-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{c.name}</span>
                            </div>
                            <span className="font-medium text-foreground">{c.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="economics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="su-card" data-testid="card-cac">
                  <div className="su-card-header">
                    <h3 className="font-semibold text-foreground">Customer Acquisition Cost</h3>
                  </div>
                  <div className="su-card-body space-y-3">
                    <div className="text-3xl font-bold text-foreground">
                      ${unitEconomics.cac.value.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Goal: &lt;${unitEconomics.cac.goal.toLocaleString()}
                    </p>
                    <Badge className={getStatusConfig(unitEconomics.cac.status).badge}>
                      {getStatusConfig(unitEconomics.cac.status).label}
                    </Badge>
                  </div>
                </div>

                <div className="su-card" data-testid="card-ltv">
                  <div className="su-card-header">
                    <h3 className="font-semibold text-foreground">Lifetime Value (LTV)</h3>
                  </div>
                  <div className="su-card-body space-y-3">
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${unitEconomics.ltv.value.toLocaleString()}
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>ARPU: ${unitEconomics.ltv.arpu}/mo</p>
                      <p>Gross Margin: {(unitEconomics.ltv.margin * 100).toFixed(0)}%</p>
                      <p>Avg Lifespan: {unitEconomics.ltv.lifespan} years</p>
                    </div>
                  </div>
                </div>

                <div className="su-card" data-testid="card-ltv-cac">
                  <div className="su-card-header">
                    <h3 className="font-semibold text-foreground">LTV:CAC Ratio</h3>
                  </div>
                  <div className="su-card-body space-y-3">
                    <div className="text-3xl font-bold text-foreground">
                      {unitEconomics.ltvCac.value !== null ? `${unitEconomics.ltvCac.value}:1` : '—'}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Goal: &gt;{unitEconomics.ltvCac.goal}x (target: {unitEconomics.ltvCac.target}x+)
                    </p>
                  </div>
                </div>

                <div className="su-card" data-testid="card-payback">
                  <div className="su-card-header">
                    <h3 className="font-semibold text-foreground">CAC Payback</h3>
                  </div>
                  <div className="su-card-body space-y-3">
                    <div className="text-3xl font-bold text-foreground">
                      {unitEconomics.payback.value !== null ? `${unitEconomics.payback.value} mo` : '—'}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Goal: &lt;{unitEconomics.payback.goal} months
                    </p>
                    <p className="text-xs text-gray-400">
                      Monthly Contribution: ${unitEconomics.payback.monthlyContribution}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="su-card" data-testid="card-employer-engagement">
                  <div className="su-card-header">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold text-foreground">Employer Engagement</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                  </div>
                  <div className="su-card-body">
                    <div className="space-y-3">
                      {[
                        { label: "DAU/MAU Ratio", value: `${engagementMetrics.employers.dauMau}%`, goal: ">20%" },
                        { label: "Sessions/User/Week", value: engagementMetrics.employers.sessionsPerWeek, goal: ">3" },
                        { label: "Projects Created", value: engagementMetrics.employers.projectsCreated, goal: "—" },
                        { label: "Photos Uploaded", value: engagementMetrics.employers.photosUploaded, goal: "—" },
                        { label: "Time Entries", value: engagementMetrics.employers.timeEntriesLogged, goal: "—" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-2">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <div className="text-right">
                            <span className="font-medium text-foreground">{item.value}</span>
                            <span className="text-xs text-gray-400 ml-2">({item.goal})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="su-card" data-testid="card-tech-engagement">
                  <div className="su-card-header">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      <h3 className="font-semibold text-foreground">Tech Engagement</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                  </div>
                  <div className="su-card-body">
                    <div className="space-y-3">
                      {[
                        { label: "Active Techs", value: engagementMetrics.techs.activeTechs, goal: "—" },
                        { label: "% Active", value: `${engagementMetrics.techs.percentActive}%`, goal: ">50%" },
                        { label: "Sessions/Tech/Week", value: engagementMetrics.techs.sessionsPerWeek, goal: ">2" },
                        { label: "Profile Completeness", value: `${engagementMetrics.techs.profileCompleteness}%`, goal: ">80%" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-2">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <div className="text-right">
                            <span className="font-medium text-foreground">{item.value}</span>
                            <span className="text-xs text-gray-400 ml-2">({item.goal})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="su-card" data-testid="card-pm-engagement">
                  <div className="su-card-header">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-teal-500" />
                      <h3 className="font-semibold text-foreground">PM Engagement</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                  </div>
                  <div className="su-card-body">
                    <div className="space-y-3">
                      {[
                        { label: "Active PMs", value: engagementMetrics.propertyManagers.activePMs, goal: "—" },
                        { label: "Portal Logins", value: engagementMetrics.propertyManagers.portalLogins, goal: "—" },
                        { label: "Reports Viewed", value: engagementMetrics.propertyManagers.reportsViewed, goal: "—" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-2">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <div className="text-right">
                            <span className="font-medium text-foreground">{item.value}</span>
                            <span className="text-xs text-gray-400 ml-2">({item.goal})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="su-card" data-testid="card-health-score">
                <div className="su-card-header">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-amber-500" />
                    <h3 className="font-semibold text-foreground">Engagement Health Score</h3>
                  </div>
                </div>
                <div className="su-card-body">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-foreground">
                        {engagementMetrics.healthScore}
                      </div>
                      <p className="text-sm text-muted-foreground">/ 100</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm text-muted-foreground">0-40: Low engagement (Churn risk)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm text-muted-foreground">41-70: Moderate (Monitor)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-sm text-muted-foreground">71-100: High (Healthy)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <div className="su-card" data-testid="card-smart-goals">
                <div className="su-card-header">
                  <h3 className="font-semibold text-foreground">Year 1 SMART Goals</h3>
                  <p className="text-sm text-muted-foreground">Launch → Dec 31, 2026</p>
                </div>
                <div className="su-card-body">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="table-smart-goals">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Goal</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Specific</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Measurable</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Achievable</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Relevant</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time-bound</th>
                        </tr>
                      </thead>
                      <tbody>
                        {smartGoals.map((g) => (
                          <tr key={g.goal} className="border-b border-gray-100 dark:border-gray-800" data-testid={`row-goal-${g.goal.toLowerCase().replace(/\s+/g, '-')}`}>
                            <td className="py-3 px-4 font-medium text-foreground">{g.goal}</td>
                            <td className="py-3 px-4 text-muted-foreground">{g.specific}</td>
                            <td className="py-3 px-4 text-muted-foreground">{g.measurable}</td>
                            <td className="py-3 px-4 text-muted-foreground">{g.achievable}</td>
                            <td className="py-3 px-4 text-muted-foreground">{g.relevant}</td>
                            <td className="py-3 px-4 text-muted-foreground">{g.timeBound}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SuperUserLayout>
  );
}
