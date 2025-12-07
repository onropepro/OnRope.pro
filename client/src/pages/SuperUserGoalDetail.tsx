import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";
import { 
  Users, Target, Building2, Globe, Zap, CreditCard, Rocket, 
  ArrowLeft, TrendingUp, CheckCircle2, Circle, AlertTriangle, Clock
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

const GOAL_CONFIGS: Record<string, any> = {
  "tech-premium": {
    part: 1,
    title: "Tech Premium Launch",
    subtitle: "$14.99/mo per technician",
    target: "Q4 Year 2",
    revenueImpact: "$22K → $108K ARR",
    primaryTrigger: "2,500 tech accounts",
    icon: Users,
    color: "blue",
    bgColor: "bg-blue-50 dark:bg-blue-500/10",
    textColor: "text-blue-500",
    chartColor: "#3b82f6",
    description: "Launch a premium subscription tier for individual rope access technicians, offering portable work history, certification tracking, and multi-employer capabilities.",
    triggers: [
      { name: "Tech Accounts", current: "totalEmployees", target: 2500, unit: "" },
      { name: "Work History Depth", current: null, target: 60, unit: "%", note: "Techs with 12+ months history" },
      { name: "Multi-Employer Rate", current: null, target: 25, unit: "%", note: "Worked for 2+ employers" },
    ],
    kpis: [
      { label: "Employer connections/tech", target: "1.3+", value: null },
      { label: "Profile completion rate", target: "70%+", value: null },
      { label: "Return login rate (30-day)", target: "50%+", value: null },
      { label: "Referral rate (tech → tech)", target: "15%+", value: null },
      { label: "PM profile views/month", target: "100+", value: null },
    ],
    projectedGrowth: [
      { month: "Now", value: 0 },
      { month: "Q1", value: 200 },
      { month: "Q2", value: 600 },
      { month: "Q3", value: 1200 },
      { month: "Q4 Y1", value: 1800 },
      { month: "Q1 Y2", value: 2200 },
      { month: "Q2 Y2", value: 2500 },
    ],
    revenueProjection: [
      { month: "Launch", base: 0, premium: 0 },
      { month: "+3mo", base: 0, premium: 5000 },
      { month: "+6mo", base: 0, premium: 22000 },
      { month: "+9mo", base: 0, premium: 55000 },
      { month: "+12mo", base: 0, premium: 108000 },
    ],
  },
  "pm-premium": {
    part: 2,
    title: "PM Premium Launch",
    subtitle: "$49/building/mo",
    target: "Q2 Year 2",
    revenueImpact: "$9K → $94K ARR",
    primaryTrigger: "150 PMs + 50% engagement",
    icon: Target,
    color: "purple",
    bgColor: "bg-purple-50 dark:bg-purple-500/10",
    textColor: "text-purple-500",
    chartColor: "#8b5cf6",
    description: "Launch premium features for property managers including vendor search, compliance verification, and project visibility across their building portfolio.",
    triggers: [
      { name: "PM Accounts", current: "totalClients", target: 150, unit: "" },
      { name: "Monthly Engagement", current: null, target: 50, unit: "%", note: "Active monthly users" },
      { name: "Buildings Linked/PM", current: null, target: 3, unit: "", note: "Avg buildings per PM" },
    ],
    kpis: [
      { label: "Compliance mandates issued", target: "3+", value: null },
      { label: "Vendor searches/month", target: "200+", value: null },
      { label: "Vendor compliance checks", target: "100+", value: null },
      { label: "Project visibility views", target: "500+", value: null },
      { label: "PM → Vendor mandates", target: "5+", value: null },
    ],
    projectedGrowth: [
      { month: "Now", value: 0 },
      { month: "Q1", value: 20 },
      { month: "Q2", value: 50 },
      { month: "Q3", value: 90 },
      { month: "Q4 Y1", value: 120 },
      { month: "Q1 Y2", value: 150 },
    ],
    revenueProjection: [
      { month: "Launch", base: 0, premium: 0 },
      { month: "+3mo", base: 0, premium: 9000 },
      { month: "+6mo", base: 0, premium: 35000 },
      { month: "+9mo", base: 0, premium: 65000 },
      { month: "+12mo", base: 0, premium: 94000 },
    ],
  },
  "building-portal": {
    part: 3,
    title: "Building Manager Portal",
    subtitle: "Free - PM acquisition funnel",
    target: "Q4 Year 1",
    revenueImpact: "Enables PM network",
    primaryTrigger: "500 buildings in database",
    icon: Building2,
    color: "emerald",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    textColor: "text-emerald-500",
    chartColor: "#10b981",
    description: "Launch free building manager portal with service history visibility to drive property manager adoption and create network effects.",
    triggers: [
      { name: "Buildings in Database", current: "totalBuildings", target: 500, unit: "" },
      { name: "Active Employers", current: "active", target: 10, unit: "", note: "Creating service records" },
      { name: "Service Records", current: null, target: 600, unit: "", note: "Maintenance records" },
      { name: "Vancouver Buildings", current: null, target: 200, unit: "", note: "Geographic density" },
    ],
    kpis: [
      { label: "PM signups from portal", target: "30+", value: null },
      { label: "Buildings claimed by PMs", target: "150+", value: null },
      { label: "Return visits (30-day)", target: "40%+", value: null },
      { label: "Vendor mandates issued", target: "10+", value: null },
      { label: "Avg session duration", target: "5+ min", value: null },
    ],
    projectedGrowth: [
      { month: "Now", value: 0 },
      { month: "Q1", value: 100 },
      { month: "Q2", value: 250 },
      { month: "Q3", value: 400 },
      { month: "Q4", value: 600 },
    ],
    buildingMilestones: [500, 800, 2000, 5000, 10000, 20000],
  },
  "us-west": {
    part: 4,
    title: "US West Coast Launch",
    subtitle: "Seattle, SF, LA, San Diego",
    target: "Q1 Year 3",
    revenueImpact: "+$634K ARR by Y3 end",
    primaryTrigger: "40% Canada penetration",
    icon: Globe,
    color: "orange",
    bgColor: "bg-orange-50 dark:bg-orange-500/10",
    textColor: "text-orange-500",
    chartColor: "#f97316",
    description: "Expand to US West Coast markets after achieving strong Canada market penetration and proven unit economics.",
    triggers: [
      { name: "Canada Penetration", current: "active", target: 35, unit: "", note: "40% of TAM" },
      { name: "Canada ARR", current: "arr", target: 400000, unit: "$", note: "$400K+ ARR" },
      { name: "Net Revenue Retention", current: null, target: 120, unit: "%", note: "Expansion > Churn" },
      { name: "Proven CAC Payback", current: null, target: 9, unit: "mo", note: "<9 months" },
    ],
    kpis: [
      { label: "US employers (Y3 end)", target: "50+", value: null },
      { label: "US ARR (Y3 end)", target: "$634K", value: null },
      { label: "Market share", target: "15%", value: null },
      { label: "US CAC", target: "<$2,000", value: null },
    ],
    projectedGrowth: [
      { month: "Launch", value: 0 },
      { month: "+3mo", value: 8 },
      { month: "+6mo", value: 20 },
      { month: "+9mo", value: 35 },
      { month: "+12mo", value: 50 },
    ],
  },
  "us-east": {
    part: 5,
    title: "US East Coast Expansion",
    subtitle: "NYC, Boston, Philly, DC, Miami",
    target: "Q1 Year 4",
    revenueImpact: "Path to $6.7M ARR",
    primaryTrigger: "75 US customers",
    icon: Rocket,
    color: "pink",
    bgColor: "bg-pink-50 dark:bg-pink-500/10",
    textColor: "text-pink-500",
    chartColor: "#ec4899",
    description: "Scale to East Coast markets with proven US playbook, targeting major metro areas for maximum density.",
    triggers: [
      { name: "US Customers", current: null, target: 75, unit: "", note: "West Coast success proven" },
      { name: "US ARR", current: null, target: 1000000, unit: "$", note: "$1M+ US ARR" },
      { name: "Team Readiness", current: null, target: 3, unit: "", note: "US sales reps" },
    ],
    kpis: [
      { label: "Total US employers (Y4)", target: "125+", value: null },
      { label: "Combined US ARR", target: "$2.5M", value: null },
      { label: "Blended CAC", target: "<$1,200", value: null },
    ],
    projectedGrowth: [
      { month: "Launch", value: 75 },
      { month: "+6mo", value: 100 },
      { month: "+12mo", value: 125 },
    ],
  },
  "unlimited-tier": {
    part: 6,
    title: "Unlimited Tier Push",
    subtitle: "$399/mo enterprise tier",
    target: "Q3 Year 2",
    revenueImpact: "+$200K ARPU lift",
    primaryTrigger: "10 Enterprise customers",
    icon: Zap,
    color: "amber",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    textColor: "text-amber-500",
    chartColor: "#f59e0b",
    description: "Actively push unlimited tier upgrades for employers with proven high usage patterns.",
    triggers: [
      { name: "Enterprise Customers", current: null, target: 10, unit: "", note: "On unlimited tier" },
      { name: "Avg Seats/Enterprise", current: null, target: 25, unit: "", note: "High usage pattern" },
      { name: "Feature Usage", current: null, target: 80, unit: "%", note: "Core feature adoption" },
    ],
    kpis: [
      { label: "Upgrade rate (Premium → Unlimited)", target: "15%", value: null },
      { label: "Enterprise NPS", target: "60+", value: null },
      { label: "Expansion revenue", target: "+$200K", value: null },
    ],
    projectedGrowth: [
      { month: "Launch", value: 0 },
      { month: "+3mo", value: 3 },
      { month: "+6mo", value: 6 },
      { month: "+9mo", value: 10 },
    ],
  },
  "transaction-fees": {
    part: 7,
    title: "Transaction Fees",
    subtitle: "1.5% platform fees",
    target: "Year 4+",
    revenueImpact: "+15-25% revenue",
    primaryTrigger: "50K platform transactions/yr",
    icon: CreditCard,
    color: "cyan",
    bgColor: "bg-cyan-50 dark:bg-cyan-500/10",
    textColor: "text-cyan-500",
    chartColor: "#06b6d4",
    description: "Introduce transaction fees on platform payments once transaction volume reaches critical mass.",
    triggers: [
      { name: "Platform Transactions/yr", current: null, target: 50000, unit: "", note: "Annual transaction volume" },
      { name: "GMV through platform", current: null, target: 10000000, unit: "$", note: "$10M+ GMV" },
      { name: "Payment adoption", current: null, target: 60, unit: "%", note: "Employers using platform payments" },
    ],
    kpis: [
      { label: "Transaction fee revenue", target: "+$150K", value: null },
      { label: "Revenue as % of GMV", target: "1.5%", value: null },
      { label: "Processing margin", target: "0.6%", value: null },
    ],
    projectedGrowth: [
      { month: "Y4 Q1", value: 10000 },
      { month: "Y4 Q2", value: 25000 },
      { month: "Y4 Q3", value: 40000 },
      { month: "Y4 Q4", value: 50000 },
    ],
  },
};

export default function SuperUserGoalDetail() {
  const [, params] = useRoute("/superuser/goals/:goalId");
  const goalId = params?.goalId || "";
  const config = GOAL_CONFIGS[goalId];

  const { data: metrics, isLoading } = useQuery<MetricsSummary>({
    queryKey: ["/api/superuser/metrics/summary"],
  });

  if (!config) {
    return (
      <SuperUserLayout title="Goal Not Found">
        <div className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">Goal configuration not found.</p>
          <Link href="/superuser/goals">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Goals
            </Button>
          </Link>
        </div>
      </SuperUserLayout>
    );
  }

  const IconComponent = config.icon;

  const getCurrentValue = (key: string | null) => {
    if (!key || !metrics) return 0;
    if (key === "totalEmployees") return metrics.usage?.totalEmployees || 0;
    if (key === "totalClients") return metrics.usage?.totalClients || 0;
    if (key === "totalBuildings") return metrics.usage?.totalBuildings || 0;
    if (key === "active") return metrics.customers?.active || 0;
    if (key === "arr") return metrics.arr || 0;
    return 0;
  };

  const getProgressValue = (trigger: any) => {
    if (!trigger.target || trigger.target <= 0) return 0;
    const current = getCurrentValue(trigger.current);
    return Math.min((current / trigger.target) * 100, 100);
  };

  const overallProgress = config.triggers.reduce((acc: number, t: any) => acc + getProgressValue(t), 0) / config.triggers.length;

  if (isLoading) {
    return (
      <SuperUserLayout title={config.title}>
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </SuperUserLayout>
    );
  }

  return (
    <SuperUserLayout title={config.title}>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Back Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/superuser/goals">
              <Button variant="outline" size="icon" data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${config.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${config.textColor}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">{config.title}</h1>
                    <Badge variant="outline">Part {config.part}</Badge>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">{config.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Target</p>
              <p className="font-semibold text-gray-800 dark:text-white/90">{config.target}</p>
            </div>
          </div>

          {/* Description */}
          <div className="su-card bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-800">
            <div className="p-4">
              <p className="text-gray-600 dark:text-gray-300">{config.description}</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                Revenue Impact: {config.revenueImpact}
              </p>
            </div>
          </div>

          {/* Overall Progress Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Overall Progress</h3>
              </div>
              <div className="su-card-body flex flex-col items-center justify-center">
                <div className="relative h-40 w-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="60%" 
                      outerRadius="100%" 
                      data={[{ value: overallProgress, fill: config.chartColor }]}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar
                        dataKey="value"
                        cornerRadius={10}
                        background={{ fill: 'hsl(var(--muted))' }}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800 dark:text-white/90">
                      {Math.round(overallProgress)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {overallProgress >= 100 ? "Complete" : overallProgress >= 50 ? "On Track" : "In Progress"}
                </p>
              </div>
            </div>

            {/* Triggers */}
            <div className="lg:col-span-2 su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Launch Triggers</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Conditions required before launch</p>
              </div>
              <div className="su-card-body space-y-4">
                {config.triggers.map((trigger: any, idx: number) => {
                  const current = getCurrentValue(trigger.current);
                  const progress = getProgressValue(trigger);
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-800 dark:text-white/90">{trigger.name}</span>
                          {trigger.note && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({trigger.note})</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-800 dark:text-white/90">
                            {trigger.unit === "$" ? "$" : ""}{trigger.current ? current.toLocaleString() : "--"}{trigger.unit && trigger.unit !== "$" ? trigger.unit : ""}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400"> / {trigger.unit === "$" ? "$" : ""}{trigger.target.toLocaleString()}{trigger.unit && trigger.unit !== "$" ? trigger.unit : ""}</span>
                        </div>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Growth Projection */}
            {config.projectedGrowth && (
              <div className="su-card">
                <div className="su-card-header">
                  <h3 className="font-semibold text-gray-800 dark:text-white/90">Growth Projection</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Expected growth trajectory</p>
                </div>
                <div className="su-card-body">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={config.projectedGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={config.chartColor} 
                          fill={config.chartColor} 
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Revenue Projection */}
            {config.revenueProjection && (
              <div className="su-card">
                <div className="su-card-header">
                  <h3 className="font-semibold text-gray-800 dark:text-white/90">Revenue Projection</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Expected ARR growth post-launch</p>
                </div>
                <div className="su-card-body">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={config.revenueProjection}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <YAxis 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                          tickFormatter={(v) => `$${v / 1000}K`}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="premium" fill="#10b981" radius={[4, 4, 0, 0]} name="Premium Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Building Milestones (for building-portal) */}
          {config.buildingMilestones && (
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Building Milestones</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Progress through key building count targets</p>
              </div>
              <div className="su-card-body">
                <div className="flex items-center justify-between relative py-4">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
                  {config.buildingMilestones.map((goal: number, index: number) => {
                    const current = getCurrentValue("totalBuildings");
                    const isAchieved = current >= goal;
                    const isCurrent = !isAchieved && (index === 0 || current >= config.buildingMilestones[index - 1]);
                    return (
                      <div key={goal} className="flex flex-col items-center relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isAchieved 
                            ? "bg-emerald-500 text-white" 
                            : isCurrent 
                              ? "bg-blue-500 text-white ring-4 ring-blue-500/20" 
                              : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                        }`}>
                          {isAchieved ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-4 w-4" />}
                        </div>
                        <span className={`mt-2 text-sm font-medium ${
                          isAchieved ? "text-emerald-600 dark:text-emerald-400" : isCurrent ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                        }`}>
                          {goal >= 1000 ? `${goal / 1000}K` : goal}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* KPIs */}
          <div className="su-card">
            <div className="su-card-header">
              <h3 className="font-semibold text-gray-800 dark:text-white/90">Success KPIs</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Key performance indicators to track post-launch</p>
            </div>
            <div className="su-card-body">
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                {config.kpis.map((kpi: any, idx: number) => (
                  <div key={idx} className="su-metric-card bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{kpi.label}</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-white/90">
                      {kpi.value || "--"}
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-normal ml-1">/ {kpi.target}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperUserLayout>
  );
}
