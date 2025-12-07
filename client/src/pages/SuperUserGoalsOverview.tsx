import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";
import { 
  Users, Target, Building2, Globe, Zap, CreditCard, Rocket, 
  ArrowRight, TrendingUp, CheckCircle2, Clock, AlertTriangle, DollarSign
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
    revenueImpact: "$22K → $108K ARR",
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
    target: "Q2 Year 2",
    revenueImpact: "$9K → $94K ARR",
    primaryTrigger: "150 PMs + 50% engagement",
    icon: Target,
    color: "purple",
    bgColor: "bg-purple-50 dark:bg-purple-500/10",
    textColor: "text-purple-500",
    currentKey: "totalClients",
    targetValue: 150,
  },
  {
    id: "building-portal",
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
    currentKey: "totalBuildings",
    targetValue: 500,
  },
  {
    id: "us-west",
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
    subtitle: "$399/mo enterprise tier",
    target: "Q3 Year 2",
    revenueImpact: "+$200K ARPU lift",
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
    revenueImpact: "+15-25% revenue",
    primaryTrigger: "50K platform transactions/yr",
    icon: CreditCard,
    color: "cyan",
    bgColor: "bg-cyan-50 dark:bg-cyan-500/10",
    textColor: "text-cyan-500",
    currentKey: null,
    targetValue: 50000,
  },
];

const projectedGrowthData = [
  { month: "Now", buildings: 0, techs: 0, employers: 0 },
  { month: "Q1", buildings: 100, techs: 200, employers: 3 },
  { month: "Q2", buildings: 250, techs: 600, employers: 8 },
  { month: "Q3", buildings: 400, techs: 1200, employers: 15 },
  { month: "Q4 Y1", buildings: 600, techs: 1800, employers: 22 },
  { month: "Q1 Y2", buildings: 900, techs: 2200, employers: 30 },
  { month: "Q2 Y2", buildings: 1400, techs: 2800, employers: 40 },
];

const arrProjection = [
  { month: "Q1 Y1", arr: 12000 },
  { month: "Q2 Y1", arr: 32000 },
  { month: "Q3 Y1", arr: 68000 },
  { month: "Q4 Y1", arr: 124000 },
  { month: "Q1 Y2", arr: 220000 },
  { month: "Q2 Y2", arr: 350000 },
  { month: "Q3 Y2", arr: 480000 },
  { month: "Q4 Y2", arr: 633000 },
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

  const funnelData = TIPPING_POINTS.map((tp, idx) => ({
    name: `Part ${tp.part}`,
    value: getProgress(tp),
    fill: tp.color,
  }));

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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Goals, KPIs & Tipping Points</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Strategic milestones for premium launches and market expansion. Click any milestone for detailed metrics.
            </p>
          </div>

          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="su-metric-card">
              <div className="flex items-center gap-4">
                <div className="su-metric-icon bg-emerald-50 dark:bg-emerald-500/10">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="su-metric-label">Overall Progress</p>
                  <p className="su-metric-value">{Math.round(overallProgress)}%</p>
                </div>
              </div>
              <Progress value={overallProgress} className="h-2 mt-3" />
            </div>

            <div className="su-metric-card">
              <div className="flex items-center gap-4">
                <div className="su-metric-icon bg-blue-50 dark:bg-blue-500/10">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="su-metric-label">Tech Accounts</p>
                  <p className="su-metric-value">{currentTechAccounts.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">/ 2,500 target</p>
                </div>
              </div>
            </div>

            <div className="su-metric-card">
              <div className="flex items-center gap-4">
                <div className="su-metric-icon bg-emerald-50 dark:bg-emerald-500/10">
                  <Building2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="su-metric-label">Buildings</p>
                  <p className="su-metric-value">{currentBuildings.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">/ 500 target</p>
                </div>
              </div>
            </div>

            <div className="su-metric-card">
              <div className="flex items-center gap-4">
                <div className="su-metric-icon bg-amber-50 dark:bg-amber-500/10">
                  <DollarSign className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="su-metric-label">Current ARR</p>
                  <p className="su-metric-value text-emerald-600 dark:text-emerald-400">
                    ${currentARR.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">/ $124K Year 1 target</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Growth Projection Chart */}
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Projected Growth</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Buildings, techs & employers over time</p>
              </div>
              <div className="su-card-body">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectedGrowthData}>
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
                      <Area type="monotone" dataKey="buildings" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Buildings" />
                      <Area type="monotone" dataKey="techs" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Techs" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ARR Projection Chart */}
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">ARR Projection</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Annual recurring revenue trajectory</p>
              </div>
              <div className="su-card-body">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={arrProjection}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                        tickFormatter={(value) => `$${value / 1000}K`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'ARR']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="arr" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Tipping Points Progress */}
          <div className="su-card">
            <div className="su-card-header flex flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white/90">The 7 Tipping Points</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Click any milestone to view detailed metrics and KPIs</p>
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
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${tp.bgColor}`}>
                              <IconComponent className={`h-5 w-5 ${tp.textColor}`} />
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Part {tp.part}
                            </Badge>
                          </div>

                          {/* Title */}
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white/90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {tp.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{tp.subtitle}</p>
                          </div>

                          {/* Progress */}
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

                          {/* Revenue Impact */}
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

          {/* Milestone Timeline Bar Chart */}
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

          {/* Quick Links to Additional Sections */}
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
