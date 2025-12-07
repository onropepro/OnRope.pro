import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts";
import { 
  Users, Target, Building2, Globe, Zap, CreditCard, Rocket, 
  ArrowRight, TrendingUp, CheckCircle2, Clock, AlertTriangle, DollarSign,
  Activity, Percent, Calculator
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

const TIPPING_POINTS = [
  {
    id: "tech-premium",
    part: 1,
    title: "Tech Premium Launch",
    subtitle: "$14.99/mo per tech",
    target: "Q4 Year 2",
    revenueImpact: "$22K → $270K ARR (Y5)",
    primaryTrigger: "2,500 tech accounts",
    icon: Users,
    color: "blue",
    bgColor: "bg-blue-50 dark:bg-blue-500/10",
    textColor: "text-blue-500",
    currentKey: "totalEmployees",
    targetValue: 2500,
  },
  {
    id: "pm-premium",
    part: 2,
    title: "PM Premium Launch",
    subtitle: "$49/building/mo",
    target: "After 150 PMs + 50% engagement",
    revenueImpact: "$9K → $94K → $150K ARR",
    primaryTrigger: "150 PMs + 50% engagement",
    icon: Target,
    color: "purple",
    bgColor: "bg-purple-50 dark:bg-purple-500/10",
    textColor: "text-purple-500",
    currentKey: "totalClients",
    targetValue: 150,
  },
  {
    id: "pm-feature-definition",
    part: 3,
    title: "PM Premium Feature Definition",
    subtitle: "Research & define features",
    target: "Q1 Year 2",
    revenueImpact: "Enables PM Premium launch",
    primaryTrigger: "100+ PM accounts",
    icon: Building2,
    color: "emerald",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    textColor: "text-emerald-500",
    currentKey: "totalClients",
    targetValue: 100,
  },
  {
    id: "us-west",
    part: 4,
    title: "US West Coast Launch",
    subtitle: "Seattle, SF, LA, San Diego",
    target: "Q1 Year 3",
    revenueImpact: "+55 customers, $635K ARR",
    primaryTrigger: "40% Canada penetration",
    icon: Globe,
    color: "orange",
    bgColor: "bg-orange-50 dark:bg-orange-500/10",
    textColor: "text-orange-500",
    currentKey: "active",
    targetValue: 35,
  },
  {
    id: "us-east",
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
    currentKey: null,
    targetValue: 75,
  },
  {
    id: "unlimited-tier",
    part: 6,
    title: "Unlimited Tier Push",
    subtitle: "$1,999/mo unlimited tier",
    target: "Q3 Year 2",
    revenueImpact: "$24K → $2.38M ARR (Y5)",
    primaryTrigger: "10 Enterprise customers",
    icon: Zap,
    color: "amber",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    textColor: "text-amber-500",
    currentKey: null,
    targetValue: 10,
  },
  {
    id: "transaction-fees",
    part: 7,
    title: "Transaction Fees",
    subtitle: "1.5% platform fees",
    target: "Year 4+",
    revenueImpact: "+$150K revenue",
    primaryTrigger: "50K platform transactions/yr",
    icon: CreditCard,
    color: "cyan",
    bgColor: "bg-cyan-50 dark:bg-cyan-500/10",
    textColor: "text-cyan-500",
    currentKey: null,
    targetValue: 50000,
  },
];

const arrTrajectory = [
  { year: "Y1", arr: 124000, employers: 15, arpu: 639, label: "$124K" },
  { year: "Y2", arr: 533000, employers: 55, arpu: 689, label: "$533K" },
  { year: "Y3", arr: 1880000, employers: 150, arpu: 856, label: "$1.88M" },
  { year: "Y4", arr: 3900000, employers: 320, arpu: 932, label: "$3.9M" },
  { year: "Y5", arr: 6900000, employers: 500, arpu: 1022, label: "$6.9M" },
];

const tierMixEvolution = [
  { year: "Y1", Starter: 27, Professional: 53, Enterprise: 13, Unlimited: 7 },
  { year: "Y2", Starter: 25, Professional: 45, Enterprise: 22, Unlimited: 8 },
  { year: "Y3", Starter: 20, Professional: 40, Enterprise: 28, Unlimited: 12 },
  { year: "Y4", Starter: 18, Professional: 35, Enterprise: 32, Unlimited: 15 },
  { year: "Y5", Starter: 15, Professional: 32, Enterprise: 35, Unlimited: 18 },
];

const revenueStreamsY5 = [
  { name: "Employer Subs", value: 6130500, fill: "#10b981" },
  { name: "Employer Add-ons", value: 350000, fill: "#3b82f6" },
  { name: "Tech Premium", value: 270000, fill: "#8b5cf6" },
  { name: "PM Premium", value: 150000, fill: "#f97316" },
];

const leadingMetricsWeekly = [
  { metric: "Tech Signups", target: "25+", redFlag: "<10", status: "track" },
  { metric: "Trial Starts", target: "1+", redFlag: "0 for 2 weeks", status: "track" },
  { metric: "Buildings Added", target: "15+", redFlag: "<5", status: "track" },
  { metric: "Weekly Active Employers", target: "80%+", redFlag: "<60%", status: "track" },
];

const unitEconomics = [
  { year: "Y1", ltv: 82000, cac: 1193, ratio: 69, payback: 1.9 },
  { year: "Y2", ltv: 114000, cac: 720, ratio: 158, payback: 1.0 },
  { year: "Y3", ltv: 223000, cac: 519, ratio: 430, payback: 0.6 },
  { year: "Y5", ltv: 270000, cac: 300, ratio: 900, payback: 0.3 },
];

export default function SuperUserGoalsOverview() {
  const { data: metrics, isLoading } = useQuery<MetricsSummary>({
    queryKey: ["/api/superuser/metrics/summary"],
  });

  const currentTechAccounts = metrics?.usage?.totalEmployees || 0;
  const currentBuildings = metrics?.usage?.totalBuildings || 0;
  const currentPropertyManagers = metrics?.usage?.totalClients || 0;
  const currentEmployers = metrics?.customers?.active || 0;
  const currentARR = metrics?.arr || 0;

  const getProgress = (tp: typeof TIPPING_POINTS[0]) => {
    let current = 0;
    if (tp.currentKey === "totalEmployees") current = currentTechAccounts;
    else if (tp.currentKey === "totalClients") current = currentPropertyManagers;
    else if (tp.currentKey === "totalBuildings") current = currentBuildings;
    else if (tp.currentKey === "active") current = currentEmployers;
    return Math.min((current / tp.targetValue) * 100, 100);
  };

  const getStatus = (progress: number) => {
    if (progress >= 100) return { label: "Complete", icon: CheckCircle2, color: "text-emerald-500" };
    if (progress >= 50) return { label: "On Track", icon: TrendingUp, color: "text-blue-500" };
    if (progress >= 25) return { label: "In Progress", icon: Clock, color: "text-amber-500" };
    return { label: "Not Started", icon: AlertTriangle, color: "text-gray-400" };
  };

  const overallProgress = TIPPING_POINTS.reduce((acc, tp) => acc + getProgress(tp), 0) / TIPPING_POINTS.length;

  if (isLoading) {
    return (
      <SuperUserLayout title="Goals & KPIs Overview">
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </SuperUserLayout>
    );
  }

  return (
    <SuperUserLayout title="Goals & KPIs Overview">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Path to $100M Valuation</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Target: $6.7M ARR at 15x = $100M valuation. <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Projected Y5: $6.9M ARR (exceeds target)</span>
            </p>
          </div>

          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="su-metric-card">
              <div className="flex items-center gap-3">
                <div className="su-metric-icon bg-emerald-50 dark:bg-emerald-500/10">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="su-metric-label">Current ARR</p>
                  <p className="su-metric-value text-emerald-600 dark:text-emerald-400">
                    ${currentARR.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">/ $124K Y1 target</p>
                </div>
              </div>
            </div>

            <div className="su-metric-card">
              <div className="flex items-center gap-3">
                <div className="su-metric-icon bg-blue-50 dark:bg-blue-500/10">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="su-metric-label">Employers</p>
                  <p className="su-metric-value">{currentEmployers}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">/ 15 Y1 target</p>
                </div>
              </div>
            </div>

            <div className="su-metric-card">
              <div className="flex items-center gap-3">
                <div className="su-metric-icon bg-purple-50 dark:bg-purple-500/10">
                  <Activity className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="su-metric-label">Tech Accounts</p>
                  <p className="su-metric-value">{currentTechAccounts.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">/ 500 Y1 target</p>
                </div>
              </div>
            </div>

            <div className="su-metric-card">
              <div className="flex items-center gap-3">
                <div className="su-metric-icon bg-amber-50 dark:bg-amber-500/10">
                  <Building2 className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="su-metric-label">Buildings</p>
                  <p className="su-metric-value">{currentBuildings.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">/ 800 Y1 target</p>
                </div>
              </div>
            </div>

            <div className="su-metric-card">
              <div className="flex items-center gap-3">
                <div className="su-metric-icon bg-teal-50 dark:bg-teal-500/10">
                  <TrendingUp className="h-5 w-5 text-teal-500" />
                </div>
                <div>
                  <p className="su-metric-label">Milestone Progress</p>
                  <p className="su-metric-value">{Math.round(overallProgress)}%</p>
                </div>
              </div>
              <Progress value={overallProgress} className="h-1.5 mt-2" />
            </div>
          </div>

          {/* ARR Trajectory & Valuation Path */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">5-Year ARR Trajectory</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Path from $124K to $6.7M ARR</p>
              </div>
              <div className="su-card-body">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={arrTrajectory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="year" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                        tickFormatter={(value) => value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : `$${value / 1000}K`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'ARR']}
                        labelFormatter={(label) => `Year ${label.replace('Y', '')}`}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="arr" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.3}
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-5 gap-2 text-center">
                  {arrTrajectory.map((d) => (
                    <div key={d.year} className="text-xs">
                      <p className="font-semibold text-gray-800 dark:text-white/90">{d.label}</p>
                      <p className="text-gray-500">{d.employers} employers</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tier Mix Evolution */}
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Tier Mix Evolution</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shift from 20% to 53% Enterprise/Unlimited</p>
              </div>
              <div className="su-card-body">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tierMixEvolution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="year" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, '']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="Starter" stackId="a" fill="#94a3b8" />
                      <Bar dataKey="Professional" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="Enterprise" stackId="a" fill="#8b5cf6" />
                      <Bar dataKey="Unlimited" stackId="a" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                  ARPU grows from $639/mo (Y1) to $1,022/mo (Y5) as tier mix shifts upward
                </p>
              </div>
            </div>
          </div>

          {/* Revenue Streams & Unit Economics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Y5 Revenue Streams */}
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Y5 Revenue Streams</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">$6.9M total ARR breakdown</p>
              </div>
              <div className="su-card-body">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueStreamsY5}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {revenueStreamsY5.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, '']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 mt-2">
                  {revenueStreamsY5.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.fill }} />
                        <span className="text-gray-600 dark:text-gray-300">{s.name}</span>
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white/90">${(s.value / 1000000).toFixed(2)}M</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Unit Economics */}
            <div className="su-card lg:col-span-2">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Unit Economics Evolution</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">LTV:CAC improves from 69:1 to 900:1</p>
              </div>
              <div className="su-card-body">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">Year</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-600 dark:text-gray-400">LTV</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-600 dark:text-gray-400">CAC</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-600 dark:text-gray-400">LTV:CAC</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-600 dark:text-gray-400">Payback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unitEconomics.map((row) => (
                        <tr key={row.year} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-2.5 px-3 font-medium text-gray-800 dark:text-white/90">{row.year}</td>
                          <td className="py-2.5 px-3 text-right text-gray-600 dark:text-gray-300">${(row.ltv / 1000).toFixed(0)}K</td>
                          <td className="py-2.5 px-3 text-right text-gray-600 dark:text-gray-300">${row.cac.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right">
                            <Badge variant="outline" className="text-emerald-600 border-emerald-300 dark:border-emerald-700">{row.ratio}:1</Badge>
                          </td>
                          <td className="py-2.5 px-3 text-right text-gray-600 dark:text-gray-300">{row.payback} mo</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Benchmark: 3:1 is healthy, 5:1 is excellent. Network effects create exceptional ratios.
                </p>
              </div>
            </div>
          </div>

          {/* Leading Metrics Quick View */}
          <div className="su-card">
            <div className="su-card-header flex flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Weekly Leading Metrics</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Predictive indicators that drive future results</p>
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-300">Live Tracking</Badge>
            </div>
            <div className="su-card-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {leadingMetricsWeekly.map((m) => (
                  <div key={m.metric} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800 dark:text-white/90">{m.metric}</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{m.target}</p>
                    <p className="text-xs text-red-500 mt-1">Red flag: {m.redFlag}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* The 7 Tipping Points */}
          <div className="su-card">
            <div className="su-card-header flex flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white/90">The 7 Tipping Points</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Click any milestone for detailed metrics, SMART goals, and KPIs</p>
              </div>
            </div>
            <div className="su-card-body">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {TIPPING_POINTS.map((tp) => {
                  const progress = getProgress(tp);
                  const status = getStatus(progress);
                  const IconComponent = tp.icon;
                  const StatusIcon = status.icon;

                  return (
                    <Link key={tp.id} href={`/superuser/goals/${tp.id}`}>
                      <div 
                        className="su-card hover-elevate cursor-pointer group border border-gray-200 dark:border-gray-800"
                        data-testid={`link-goal-${tp.id}`}
                      >
                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${tp.bgColor}`}>
                              <IconComponent className={`h-5 w-5 ${tp.textColor}`} />
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Part {tp.part}
                            </Badge>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white/90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {tp.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{tp.subtitle}</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400">{tp.target}</span>
                              <span className={`flex items-center gap-1 ${status.color}`}>
                                <StatusIcon className="h-3 w-3" />
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <Progress value={progress} className="h-1.5" />
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              {tp.revenueImpact}
                            </span>
                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Milestone Progress Bar Chart */}
          <div className="su-card">
            <div className="su-card-header">
              <h3 className="font-semibold text-gray-800 dark:text-white/90">Progress by Milestone</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completion percentage for each tipping point</p>
            </div>
            <div className="su-card-body">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={TIPPING_POINTS.map(tp => ({ 
                    name: tp.title.split(' ')[0], 
                    progress: Math.round(getProgress(tp)),
                    color: tp.color 
                  }))} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Progress']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="progress" radius={[0, 4, 4, 0]}>
                      {TIPPING_POINTS.map((tp, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            tp.color === 'blue' ? '#3b82f6' :
                            tp.color === 'purple' ? '#8b5cf6' :
                            tp.color === 'emerald' ? '#10b981' :
                            tp.color === 'orange' ? '#f97316' :
                            tp.color === 'pink' ? '#ec4899' :
                            tp.color === 'amber' ? '#f59e0b' :
                            '#06b6d4'
                          } 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/superuser/goals/north-star">
              <div className="su-card hover-elevate cursor-pointer p-4 border border-gray-200 dark:border-gray-800" data-testid="link-north-star">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white/90">North Star Metrics</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">3-year strategic targets</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </div>
            </Link>

            <Link href="/superuser/goals/tracking">
              <div className="su-card hover-elevate cursor-pointer p-4 border border-gray-200 dark:border-gray-800" data-testid="link-tracking">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-teal-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white/90">Weekly/Monthly Tracking</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Operational KPIs</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </div>
            </Link>

            <Link href="/superuser/goals/risk-triggers">
              <div className="su-card hover-elevate cursor-pointer p-4 border border-gray-200 dark:border-gray-800" data-testid="link-risk-triggers">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white/90">Risk Triggers</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Warning signs & responses</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </SuperUserLayout>
  );
}
