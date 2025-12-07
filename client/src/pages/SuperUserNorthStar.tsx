import { Link } from "wouter";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AreaChart, Area, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { 
  ArrowLeft, Target, Users, Building2, DollarSign, TrendingUp,
  CheckCircle2, Clock, AlertTriangle
} from "lucide-react";

const northStarMetrics = [
  {
    id: "arr",
    name: "Annual Recurring Revenue",
    current: 0,
    y1Target: 124000,
    y3Target: 1880000,
    y5Target: 6900000,
    unit: "$",
    description: "Total recurring revenue from all subscription tiers and add-ons",
    icon: DollarSign,
    color: "emerald",
  },
  {
    id: "employers",
    name: "Employer Accounts",
    current: 0,
    y1Target: 15,
    y3Target: 150,
    y5Target: 500,
    unit: "",
    description: "Rope access companies actively using the platform",
    icon: Building2,
    color: "blue",
  },
  {
    id: "tech-accounts",
    name: "Technician Accounts",
    current: 0,
    y1Target: 500,
    y3Target: 5000,
    y5Target: 15000,
    unit: "",
    description: "Individual rope access technicians with accounts",
    icon: Users,
    color: "purple",
  },
  {
    id: "buildings",
    name: "Buildings Managed",
    current: 0,
    y1Target: 800,
    y3Target: 8000,
    y5Target: 25000,
    unit: "",
    description: "High-rise buildings in the global database",
    icon: Building2,
    color: "amber",
  },
];

const trajectoryData = [
  { period: "Now", arr: 0, employers: 0, techs: 0, buildings: 0 },
  { period: "Y1", arr: 124000, employers: 15, techs: 500, buildings: 800 },
  { period: "Y2", arr: 533000, employers: 55, techs: 1800, buildings: 3000 },
  { period: "Y3", arr: 1880000, employers: 150, techs: 5000, buildings: 8000 },
  { period: "Y4", arr: 3900000, employers: 320, techs: 10000, buildings: 17000 },
  { period: "Y5", arr: 6900000, employers: 500, techs: 15000, buildings: 25000 },
];

const strategicPillars = [
  {
    title: "Market Dominance",
    description: "Become the #1 rope access management platform in North America",
    targets: ["500 employer accounts by Y5", "30% market penetration in Canada", "US expansion by Y3"],
    status: "on-track",
  },
  {
    title: "Network Effects",
    description: "Create compounding value through technician and building networks",
    targets: ["15K tech accounts (3x network multiplier)", "25K buildings in database", "Cross-company referrals"],
    status: "on-track",
  },
  {
    title: "Revenue Diversification",
    description: "Multiple revenue streams beyond core employer subscriptions",
    targets: ["Tech Premium: $270K ARR", "PM Premium: $150K ARR", "Add-ons: $350K ARR"],
    status: "planning",
  },
  {
    title: "Operational Excellence",
    description: "Scalable platform with strong unit economics",
    targets: ["LTV:CAC > 5:1", "CAC payback < 6 months", "Gross margin > 80%"],
    status: "on-track",
  },
];

export default function SuperUserNorthStar() {
  const formatValue = (value: number, unit: string) => {
    if (unit === "$") {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
      return `$${value}`;
    }
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <SuperUserLayout title="North Star Metrics">
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
                <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">North Star Metrics</h1>
                  <p className="text-gray-500 dark:text-gray-400">3-year strategic targets for $100M valuation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Primary North Star Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="grid-north-star-metrics">
            {northStarMetrics.map((metric) => {
              const Icon = metric.icon;
              const progress = metric.y5Target > 0 ? (metric.current / metric.y5Target) * 100 : 0;
              const bgColorMap: Record<string, string> = {
                emerald: "bg-emerald-50 dark:bg-emerald-500/10",
                blue: "bg-blue-50 dark:bg-blue-500/10",
                purple: "bg-purple-50 dark:bg-purple-500/10",
                amber: "bg-amber-50 dark:bg-amber-500/10",
              };
              const textColorMap: Record<string, string> = {
                emerald: "text-emerald-500",
                blue: "text-blue-500",
                purple: "text-purple-500",
                amber: "text-amber-500",
              };

              return (
                <div key={metric.id} className="su-card" data-testid={`metric-${metric.id}`}>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg ${bgColorMap[metric.color]} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${textColorMap[metric.color]}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{metric.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-800 dark:text-white/90">
                          {formatValue(metric.current, metric.unit)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(progress)}%
                        </Badge>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-gray-100 dark:border-gray-800">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Y1</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                          {formatValue(metric.y1Target, metric.unit)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Y3</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                          {formatValue(metric.y3Target, metric.unit)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Y5</p>
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatValue(metric.y5Target, metric.unit)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ARR Trajectory Chart */}
          <div className="su-card">
            <div className="su-card-header">
              <h3 className="font-semibold text-gray-800 dark:text-white/90">5-Year Growth Trajectory</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Target vs actual progress toward $6.9M ARR</p>
            </div>
            <div className="su-card-body">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trajectoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="period" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                      tickFormatter={(value) => value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : `$${value / 1000}K`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'ARR']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="arr" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.2}
                      strokeWidth={2}
                      name="Target ARR"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Strategic Pillars */}
          <div className="su-card" data-testid="card-strategic-pillars">
            <div className="su-card-header">
              <h3 className="font-semibold text-gray-800 dark:text-white/90">Strategic Pillars</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Core focus areas driving toward $100M valuation</p>
            </div>
            <div className="su-card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategicPillars.map((pillar, idx) => {
                  const statusConfig = {
                    "on-track": { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                    "at-risk": { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                    "planning": { icon: Clock, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                  }[pillar.status] || { icon: Clock, color: "text-gray-500", bg: "bg-gray-50 dark:bg-gray-500/10" };
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div key={idx} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-800 dark:text-white/90">{pillar.title}</h4>
                        <div className={`p-1.5 rounded ${statusConfig.bg}`}>
                          <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{pillar.description}</p>
                      <ul className="space-y-1">
                        {pillar.targets.map((target, tidx) => (
                          <li key={tidx} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            {target}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Valuation Math */}
          <div className="su-card bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-500" />
                Path to $100M Valuation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-gray-800 dark:text-white/90">$6.7M</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Target ARR</p>
                </div>
                <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-gray-800 dark:text-white/90">15x</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Revenue Multiple</p>
                </div>
                <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">$6.9M</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Projected ARR</p>
                </div>
                <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">$100M+</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Valuation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperUserLayout>
  );
}
