import { Link } from "wouter";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { 
  ArrowLeft, TrendingUp, Calendar, CheckCircle2, Clock, 
  Users, Building2, DollarSign, Activity, AlertTriangle
} from "lucide-react";

const weeklyKPIs = [
  { category: "Sales", metric: "New employer signups", target: "1-2/week", current: 0, status: "needs-focus" },
  { category: "Sales", metric: "Demo calls scheduled", target: "3-5/week", current: 0, status: "needs-focus" },
  { category: "Engagement", metric: "Active companies (7-day)", target: ">80%", current: "0%", status: "needs-focus" },
  { category: "Engagement", metric: "Tech logins (7-day)", target: ">50%", current: "0%", status: "needs-focus" },
  { category: "Support", metric: "Tickets resolved", target: "<24hr avg", current: "N/A", status: "on-track" },
  { category: "Support", metric: "NPS responses", target: ">5/week", current: 0, status: "needs-focus" },
];

const monthlyKPIs = [
  { category: "Growth", metric: "Net new employers", target: "3-5/month", current: 0, y1Goal: 15 },
  { category: "Growth", metric: "MRR growth", target: "+8%/month", current: "0%", y1Goal: "$10K" },
  { category: "Retention", metric: "Logo churn", target: "<3%", current: "0%", redFlag: ">5%" },
  { category: "Retention", metric: "Revenue churn", target: "<2%", current: "0%", redFlag: ">4%" },
  { category: "Expansion", metric: "Seat expansion", target: "+10%/month", current: "0%", y1Goal: "+50%" },
  { category: "Efficiency", metric: "CAC payback", target: "<6 months", current: "N/A", redFlag: ">9 mo" },
];

const quarterlyGoals = [
  { quarter: "Q1 Y1", focus: "Foundation", goals: ["10 beta employers", "Core features stable", "Basic analytics"] },
  { quarter: "Q2 Y1", focus: "Product-Market Fit", goals: ["15 paying employers", "NPS > 40", "Tech portal live"] },
  { quarter: "Q3 Y1", focus: "Growth Engine", goals: ["25 employers", "Sales playbook", "US market entry"] },
  { quarter: "Q4 Y1", focus: "Scale", goals: ["40 employers", "Team expansion", "Tech Premium beta"] },
];

const trendData = [
  { week: "W1", employers: 0, mrr: 0, techs: 0 },
  { week: "W2", employers: 0, mrr: 0, techs: 0 },
  { week: "W3", employers: 0, mrr: 0, techs: 0 },
  { week: "W4", employers: 0, mrr: 0, techs: 0 },
];

export default function SuperUserTracking() {
  const getStatusBadge = (status: string) => {
    const configs: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; text: string }> = {
      "on-track": { variant: "default", text: "On Track" },
      "at-risk": { variant: "secondary", text: "At Risk" },
      "needs-focus": { variant: "destructive", text: "Needs Focus" },
    };
    const config = configs[status] || { variant: "outline" as const, text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <SuperUserLayout title="Weekly/Monthly Tracking">
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
                <div className="h-12 w-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Weekly/Monthly Tracking</h1>
                  <p className="text-gray-500 dark:text-gray-400">Operational KPIs and performance metrics</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly KPIs */}
          <div className="su-card" data-testid="card-weekly-kpis">
            <div className="su-card-header">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-500" />
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Weekly KPIs</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track these metrics every week</p>
            </div>
            <div className="su-card-body">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Category</th>
                      <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Metric</th>
                      <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Target</th>
                      <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Current</th>
                      <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyKPIs.map((kpi, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800/50">
                        <td className="py-2 px-3 text-gray-600 dark:text-gray-300">{kpi.category}</td>
                        <td className="py-2 px-3 font-medium text-gray-800 dark:text-white/90">{kpi.metric}</td>
                        <td className="py-2 px-3 text-gray-600 dark:text-gray-300">{kpi.target}</td>
                        <td className="py-2 px-3 text-gray-800 dark:text-white/90">{kpi.current}</td>
                        <td className="py-2 px-3">{getStatusBadge(kpi.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Monthly KPIs */}
          <div className="su-card" data-testid="card-monthly-kpis">
            <div className="su-card-header">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Monthly KPIs</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Review at month-end for strategic decisions</p>
            </div>
            <div className="su-card-body">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Category</th>
                      <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Metric</th>
                      <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Target</th>
                      <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Current</th>
                      <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Y1 Goal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyKPIs.map((kpi, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800/50">
                        <td className="py-2 px-3 text-gray-600 dark:text-gray-300">{kpi.category}</td>
                        <td className="py-2 px-3 font-medium text-gray-800 dark:text-white/90">{kpi.metric}</td>
                        <td className="py-2 px-3 text-gray-600 dark:text-gray-300">{kpi.target}</td>
                        <td className="py-2 px-3 text-gray-800 dark:text-white/90">{kpi.current}</td>
                        <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">{kpi.y1Goal || kpi.redFlag}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Trend Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Weekly Trend</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Employer & MRR progress</p>
              </div>
              <div className="su-card-body">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="employers" stroke="#3b82f6" strokeWidth={2} name="Employers" />
                      <Line type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={2} name="MRR ($)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  Data will populate as actual metrics are tracked
                </p>
              </div>
            </div>

            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Quarterly Roadmap</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Year 1 quarterly focus areas</p>
              </div>
              <div className="su-card-body">
                <div className="space-y-3">
                  {quarterlyGoals.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800 dark:text-white/90">{q.quarter}</span>
                        <Badge variant="outline">{q.focus}</Badge>
                      </div>
                      <ul className="space-y-1">
                        {q.goals.map((goal, gidx) => (
                          <li key={gidx} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Operating Cadence */}
          <div className="su-card bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-teal-200 dark:border-teal-800">
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-500" />
                Recommended Operating Cadence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <h4 className="font-medium text-gray-800 dark:text-white/90 mb-2">Daily</h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                    <li>Check support tickets</li>
                    <li>Monitor active users</li>
                    <li>Review error logs</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <h4 className="font-medium text-gray-800 dark:text-white/90 mb-2">Weekly</h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                    <li>Review weekly KPIs</li>
                    <li>Pipeline review</li>
                    <li>Feature prioritization</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <h4 className="font-medium text-gray-800 dark:text-white/90 mb-2">Monthly</h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                    <li>Full metrics review</li>
                    <li>Strategy adjustment</li>
                    <li>Customer outreach</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperUserLayout>
  );
}
