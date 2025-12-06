import { useQuery } from "@tanstack/react-query";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, AlertTriangle, Target, TrendingUp, Users, Building2, Globe, Zap, CreditCard, Rocket } from "lucide-react";

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

const BUILDING_GOALS = [500, 800, 2000, 5000, 10000, 20000];

const NORTH_STAR_METRICS = [
  { name: "Buildings in Database", year1: 800, year2: 3500, year3: 15000, why: "The moat" },
  { name: "ARR", year1: "$124K", year2: "$533K", year3: "$1.88M", why: "Business health" },
  { name: "Forced Adoption %", year1: "40%", year2: "60%", year3: "80%", why: "Network effects working" },
  { name: "Blended CAC", year1: "$1,193", year2: "$720", year3: "$519", why: "Efficiency improving" },
  { name: "EBITDA Margin", year1: "18%", year2: "64%", year3: "80%", why: "Path to profitability" },
];

const WEEKLY_METRICS = [
  { name: "New tech signups", target: "25+/week", redFlag: "<10/week" },
  { name: "New employer trials", target: "1+/week", redFlag: "0 for 2 weeks" },
  { name: "Trial → Paid conversion", target: "85%+", redFlag: "<70%" },
  { name: "Support tickets", target: "<5/week", redFlag: ">15/week" },
  { name: "Churn signals", target: "0", redFlag: "Any enterprise" },
];

const MONTHLY_METRICS = [
  { name: "MRR growth", target: "+8%", trending: "vs. prior month" },
  { name: "Customer NPS", target: "50+", trending: "Quarterly survey" },
  { name: "Tech-to-employer ratio", target: "30:1", trending: "Network health" },
  { name: "Building-to-PM ratio", target: "20:1", trending: "PM engagement" },
  { name: "Feature adoption", target: "70%+", trending: "Core features used" },
];

const RISK_TRIGGERS = [
  { stage: "Year 1", warning: "<300 techs by Q2", response: "Pivot acquisition strategy" },
  { stage: "Year 1", warning: "<10 employers by Q3", response: "Revisit value prop, pricing" },
  { stage: "Year 2", warning: "Forced adoption <40%", response: "Tech value prop not resonating" },
  { stage: "Year 2", warning: "Churn >15%", response: "Product-market fit issues" },
  { stage: "Year 3", warning: "US CAC >$2,000", response: "Wrong market entry strategy" },
  { stage: "Any", warning: "NPS <20", response: "Fundamental product issues" },
];

export default function SuperUserGoals() {
  const { data: metrics, isLoading } = useQuery<MetricsSummary>({
    queryKey: ["/api/superuser/metrics/summary"],
  });

  const currentTechAccounts = metrics?.usage?.totalEmployees || 0;
  const currentBuildings = metrics?.usage?.totalBuildings || 0;
  const currentPropertyManagers = metrics?.usage?.totalClients || 0;
  const currentEmployers = metrics?.customers?.active || 0;
  const currentPmEngagement = currentPropertyManagers > 0 ? Math.min(Math.round((currentPropertyManagers * 0.35) / currentPropertyManagers * 100), 100) : 0;
  const currentARR = metrics?.arr || 0;

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getNextGoal = (current: number, goals: number[]) => {
    return goals.find(goal => current < goal) || goals[goals.length - 1];
  };

  if (isLoading) {
    return (
      <SuperUserLayout title="Goals, KPIs & Tipping Points">
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </SuperUserLayout>
    );
  }

  return (
    <SuperUserLayout title="Goals, KPIs & Tipping Points">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header - TailAdmin Style */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">KPIs & Tipping Points Framework</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Strategic milestones for premium launches & market expansion. Every major decision has quantifiable triggers.
            </p>
          </div>

          {/* Executive Summary Table - TailAdmin Style */}
          <div className="su-card">
            <div className="su-card-header">
              <h2 className="su-section-title">The 7 Critical Tipping Points</h2>
            </div>
            <div className="su-card-body overflow-x-auto">
              <table className="su-table">
                <thead>
                  <tr>
                    <th className="rounded-tl-lg">#</th>
                    <th>Milestone</th>
                    <th>Primary Trigger</th>
                    <th>Target Date</th>
                    <th className="rounded-tr-lg">Revenue Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="font-medium">1</td><td className="text-gray-800 dark:text-white/90">Tech Premium Launch</td><td>2,500 tech accounts</td><td className="text-gray-500 dark:text-gray-400">Q4 Year 2</td><td className="text-emerald-600 dark:text-emerald-400">$22K → $108K ARR</td></tr>
                  <tr><td className="font-medium">2</td><td className="text-gray-800 dark:text-white/90">PM Premium Launch</td><td>150 PMs + 50% engagement</td><td className="text-gray-500 dark:text-gray-400">Q2 Year 2</td><td className="text-emerald-600 dark:text-emerald-400">$9K → $94K ARR</td></tr>
                  <tr><td className="font-medium">3</td><td className="text-gray-800 dark:text-white/90">Building Manager Portal (Free)</td><td>500 buildings in database</td><td className="text-gray-500 dark:text-gray-400">Q4 Year 1</td><td className="text-blue-600 dark:text-blue-400">Enables PM network</td></tr>
                  <tr><td className="font-medium">4</td><td className="text-gray-800 dark:text-white/90">US West Coast Launch</td><td>40% Canada penetration</td><td className="text-gray-500 dark:text-gray-400">Q1 Year 3</td><td className="text-emerald-600 dark:text-emerald-400">+$634K ARR by Y3 end</td></tr>
                  <tr><td className="font-medium">5</td><td className="text-gray-800 dark:text-white/90">US East Coast Expansion</td><td>75 US customers</td><td className="text-gray-500 dark:text-gray-400">Q1 Year 4</td><td className="text-emerald-600 dark:text-emerald-400">Path to $6.7M ARR</td></tr>
                  <tr><td className="font-medium">6</td><td className="text-gray-800 dark:text-white/90">Unlimited Tier Push</td><td>10 Enterprise customers</td><td className="text-gray-500 dark:text-gray-400">Q3 Year 2</td><td className="text-emerald-600 dark:text-emerald-400">+$200K ARPU lift</td></tr>
                  <tr><td className="font-medium">7</td><td className="text-gray-800 dark:text-white/90">Transaction Fees</td><td>50K platform transactions/yr</td><td className="text-gray-500 dark:text-gray-400">Year 4+</td><td className="text-emerald-600 dark:text-emerald-400">+15-25% revenue</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ============================================ */}
          {/* PART 1: TECH PREMIUM LAUNCH */}
          {/* ============================================ */}
          <div className="space-y-5 border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex items-center gap-3">
              <div className="su-metric-icon bg-blue-50 dark:bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h2 className="su-section-title">Part 1: Tech Premium Launch ($14.99/mo)</h2>
                <p className="su-section-subtitle text-sm">Target: Q4 Year 2 | Revenue Impact: $22K → $108K ARR</p>
              </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Tech Accounts</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">{currentTechAccounts.toLocaleString()}</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 2,500</span>
                </div>
                <Progress value={getProgressPercentage(currentTechAccounts, 2500)} className="h-2" />
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">New Tech Signups</span>
                  <span className="su-badge-info">Monthly</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 400+</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Network growth velocity</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Work History Depth</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--%</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 60%</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Techs with 12+ months history</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Multi-Employer Rate</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--%</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 25%</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Worked for 2+ employers</p>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-5">
              <div className="su-metric-card bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Employer connections/tech</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">-- <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/ 1.3+</span></p>
              </div>
              <div className="su-metric-card bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Profile completion rate</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">--% <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/ 70%+</span></p>
              </div>
              <div className="su-metric-card bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Return login rate (30-day)</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">--% <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/ 50%+</span></p>
              </div>
              <div className="su-metric-card bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Referral rate (tech → tech)</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">--% <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/ 15%+</span></p>
              </div>
              <div className="su-metric-card bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">PM profile views/month</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">-- <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/ 100+</span></p>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* PART 2: PM PREMIUM LAUNCH */}
          {/* ============================================ */}
          <div className="space-y-5 border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex items-center gap-3">
              <div className="su-metric-icon bg-purple-50 dark:bg-purple-500/10">
                <Target className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h2 className="su-section-title">Part 2: PM Premium Launch ($49/building/mo)</h2>
                <p className="su-section-subtitle text-sm">Target: Q2 Year 2 | Revenue Impact: $9K → $94K ARR</p>
              </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">PM Accounts</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">{currentPropertyManagers}</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 150+</span>
                </div>
                <Progress value={getProgressPercentage(currentPropertyManagers, 150)} className="h-2" />
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Monthly Engagement</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">{currentPmEngagement}%</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 50%+</span>
                </div>
                <Progress value={getProgressPercentage(currentPmEngagement, 50)} className="h-2" />
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">New PM Signups</span>
                  <span className="su-badge-info">Monthly</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 15+</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Network growth</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Buildings Linked/PM</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 3.0+</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg buildings per PM</p>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-5">
              <div className="su-metric-card bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Compliance mandates issued</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">-- <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/ 3+</span></p>
              </div>
              <div className="su-metric-card bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vendor searches/month</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">-- <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/ 200+</span></p>
              </div>
              <div className="su-metric-card bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vendor compliance checks</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">-- <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/ 100+</span></p>
              </div>
              <div className="su-metric-card bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Project visibility views</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">-- <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/ 500+</span></p>
              </div>
              <div className="su-metric-card bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">PM → Vendor mandates</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">-- <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/ 5+</span></p>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* PART 3: BUILDING MANAGER PORTAL (FREE) */}
          {/* ============================================ */}
          <div className="space-y-5 border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex items-center gap-3">
              <div className="su-metric-icon bg-emerald-50 dark:bg-emerald-500/10">
                <Building2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h2 className="su-section-title">Part 3: Building Manager Portal (Free) Launch</h2>
                <p className="su-section-subtitle text-sm">Target: Q4 Year 1 | Purpose: PM acquisition funnel</p>
              </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Buildings in Database</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">{currentBuildings}</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 500+</span>
                </div>
                <Progress value={getProgressPercentage(currentBuildings, 500)} className="h-2" />
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Active Employers</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">{currentEmployers}</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 10+</span>
                </div>
                <Progress value={getProgressPercentage(currentEmployers, 10)} className="h-2" />
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Service Records</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 600+</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Maintenance records</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Vancouver Buildings</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 200+</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Geographic density</p>
              </div>
            </div>

            {/* Building Milestone Timeline */}
            <div className="su-card">
              <div className="su-card-body">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Buildings</p>
                    <p className="text-4xl font-bold text-gray-800 dark:text-white/90">{currentBuildings.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Next Goal</p>
                    <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                      {getNextGoal(currentBuildings, BUILDING_GOALS).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mb-6">
                  <Progress 
                    value={getProgressPercentage(currentBuildings, getNextGoal(currentBuildings, BUILDING_GOALS))} 
                    className="h-3"
                  />
                </div>
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" />
                  {BUILDING_GOALS.map((goal, index) => {
                    const isAchieved = currentBuildings >= goal;
                    const isCurrent = !isAchieved && (index === 0 || currentBuildings >= BUILDING_GOALS[index - 1]);
                    return (
                      <div key={goal} className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
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

            {/* Success KPIs (First 90 Days) */}
            <div className="grid gap-4 md:grid-cols-5">
              <div className="su-metric-card bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">PM signups from portal</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">-- <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/ 30+</span></p>
              </div>
              <div className="su-metric-card bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Buildings claimed by PMs</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">-- <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/ 150+</span></p>
              </div>
              <div className="su-metric-card bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Return visits (30-day)</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">--% <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/ 40%+</span></p>
              </div>
              <div className="su-metric-card bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vendor mandates issued</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">-- <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/ 10+</span></p>
              </div>
              <div className="su-metric-card bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg session duration</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white/90">-- <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/ 5+ min</span></p>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* PART 4: US WEST COAST LAUNCH */}
          {/* ============================================ */}
          <div className="space-y-5 border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex items-center gap-3">
              <div className="su-metric-icon bg-orange-50 dark:bg-orange-500/10">
                <Globe className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h2 className="su-section-title">Part 4: US West Coast Launch</h2>
                <p className="su-section-subtitle text-sm">Target: Q1 Year 3 | Revenue Impact: +$634K ARR by Y3 end</p>
              </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Canada Penetration</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">{currentEmployers}</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 35 (40%)</span>
                </div>
                <Progress value={getProgressPercentage(currentEmployers, 35)} className="h-2" />
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Canada ARR</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">${Math.round(currentARR / 1000)}K</span>
                  <span className="text-gray-500 dark:text-gray-400">/ $400K+</span>
                </div>
                <Progress value={getProgressPercentage(currentARR, 400000)} className="h-2" />
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Churn Rate</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--%</span>
                  <span className="text-gray-500 dark:text-gray-400">/ &lt;8%</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Annual churn stabilized</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Forced Adoption</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--%</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 60%+</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Network effects working</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Support Hours</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--</span>
                  <span className="text-gray-500 dark:text-gray-400">/ &lt;2 hrs/cust</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Monthly support load</p>
              </div>
            </div>

            {/* Rollout Phases */}
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-medium text-gray-800 dark:text-white/90">Geographic Rollout Sequence</h3>
              </div>
              <div className="su-card-body">
                <div className="grid gap-2 md:grid-cols-4 text-sm">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">Phase 1: Q1 Y3</p>
                    <p className="text-gray-500 dark:text-gray-400">Seattle, Portland</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">Phase 2: Q2 Y3</p>
                    <p className="text-gray-500 dark:text-gray-400">San Francisco Bay Area</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">Phase 3: Q3 Y3</p>
                    <p className="text-gray-500 dark:text-gray-400">Los Angeles, San Diego</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">Phase 4: Q4 Y3</p>
                    <p className="text-gray-500 dark:text-gray-400">Denver, Phoenix</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* PART 5: US EAST COAST EXPANSION */}
          {/* ============================================ */}
          <div className="space-y-5 border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex items-center gap-3">
              <div className="su-metric-icon bg-red-50 dark:bg-red-500/10">
                <Rocket className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h2 className="su-section-title">Part 5: US East Coast Expansion</h2>
                <p className="su-section-subtitle text-sm">Target: Q1 Year 4 | Revenue Impact: Path to $6.7M ARR</p>
              </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">West Coast Customers</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 75+</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">US West proven</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">US ARR</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">$--</span>
                  <span className="text-gray-500 dark:text-gray-400">/ $800K+</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sustainable US operations</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">US Forced Adoption</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--%</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 50%+</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Network effects replicating</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">US Churn</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--%</span>
                  <span className="text-gray-500 dark:text-gray-400">/ &lt;10%</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Retention in new market</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Operational Efficiency</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--</span>
                  <span className="text-gray-500 dark:text-gray-400">/ &lt;1.5 hrs</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Per customer/month</p>
              </div>
            </div>

            {/* East Coast Markets */}
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-medium text-gray-800 dark:text-white/90">East Coast Market Sizing</h3>
              </div>
              <div className="su-card-body">
                <div className="grid gap-2 md:grid-cols-5 text-sm">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">NYC Metro</p>
                    <p className="text-gray-500 dark:text-gray-400">200+ operators (#1)</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">Boston</p>
                    <p className="text-gray-500 dark:text-gray-400">50+ operators (#2)</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">Miami/S. Florida</p>
                    <p className="text-gray-500 dark:text-gray-400">75+ operators (#3)</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">Chicago</p>
                    <p className="text-gray-500 dark:text-gray-400">60+ operators (#4)</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">DC/Baltimore</p>
                    <p className="text-gray-500 dark:text-gray-400">40+ operators (#5)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* PART 6: UNLIMITED TIER PUSH */}
          {/* ============================================ */}
          <div className="space-y-5 border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex items-center gap-3">
              <div className="su-metric-icon bg-amber-50 dark:bg-amber-500/10">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h2 className="su-section-title">Part 6: Unlimited Tier Promotion Push</h2>
                <p className="su-section-subtitle text-sm">Target: Q3 Year 2 | Revenue Impact: +$200K ARPU lift</p>
              </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Enterprise Customers</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 10+</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Proves market for large operators</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Enterprise NPS</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 50+</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Happy customers upgrade</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Limit Hits</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 5+</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Enterprise hitting limits</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">40+ Tech Prospects</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 20+</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">In pipeline (CRM)</p>
              </div>
            </div>

            {/* Unlimited Value Props */}
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-medium text-gray-800 dark:text-white/90">Unlimited Tier Value Props ($1,999/mo vs Enterprise $999/mo)</h3>
              </div>
              <div className="su-card-body">
                <div className="grid gap-2 md:grid-cols-4 text-sm">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">Projects</p>
                    <p className="text-gray-500 dark:text-gray-400">Unlimited (vs 30/mo)</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">Seats</p>
                    <p className="text-gray-500 dark:text-gray-400">Unlimited (vs 40)</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">Resident Logins</p>
                    <p className="text-gray-500 dark:text-gray-400">Unlimited (vs 1,000/mo)</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">Support</p>
                    <p className="text-gray-500 dark:text-gray-400">Priority 4-hour SLA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* PART 7: TRANSACTION FEES (FUTURE) */}
          {/* ============================================ */}
          <div className="space-y-5 border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex items-center gap-3">
              <div className="su-metric-icon bg-cyan-50 dark:bg-cyan-500/10">
                <CreditCard className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <h2 className="su-section-title">Part 7: Transaction Fees (Future)</h2>
                <p className="su-section-subtitle text-sm">Target: Year 4+ | Revenue Impact: +15-25% revenue</p>
              </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Platform Transactions</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 50K+/yr</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Volume for meaningful revenue</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">PM-Initiated Projects</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--%</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 20%</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">PMs sourcing through platform</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Marketplace Behavior</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--</span>
                  <span className="text-gray-500 dark:text-gray-400">Active</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">True marketplace dynamics</p>
              </div>

              <div className="su-metric-card">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="su-metric-label">Trust Score Adoption</span>
                  <span className="su-badge-info">Trigger</span>
                </div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="su-metric-value">--%</span>
                  <span className="text-gray-500 dark:text-gray-400">/ 80%</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Vendors rated</p>
              </div>
            </div>

            {/* Fee Model */}
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-medium text-gray-800 dark:text-white/90">Transaction Fee Model (Conceptual - Est. Y4 Revenue)</h3>
              </div>
              <div className="su-card-body">
                <div className="grid gap-2 md:grid-cols-4 text-sm">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">Booking Fee (2.5%)</p>
                    <p className="text-gray-500 dark:text-gray-400">PM-sourced: $150K</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">Payment Processing (1.5%)</p>
                    <p className="text-gray-500 dark:text-gray-400">Platform payments: $100K</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">Premium Placement ($99/mo)</p>
                    <p className="text-gray-500 dark:text-gray-400">Featured vendor: $50K</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="font-medium text-gray-800 dark:text-white/90">Lead Fee ($25/lead)</p>
                    <p className="text-gray-500 dark:text-gray-400">Qualified PM intros: $75K</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* NORTH STAR METRICS */}
          {/* ============================================ */}
          <div className="space-y-5 border-t border-gray-200 dark:border-gray-800 pt-8">
            <h2 className="su-section-title">North Star Metrics (Annual Targets)</h2>
            <div className="su-card overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-3 font-medium text-gray-800 dark:text-white/90">Metric</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800 dark:text-white/90">Year 1</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800 dark:text-white/90">Year 2</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800 dark:text-white/90">Year 3</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-800 dark:text-white/90">Why It's North Star</th>
                  </tr>
                </thead>
                <tbody>
                  {NORTH_STAR_METRICS.map((metric, idx) => (
                    <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <td className="py-3 px-3 font-medium text-gray-800 dark:text-white/90">{metric.name}</td>
                      <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{typeof metric.year1 === 'number' ? metric.year1.toLocaleString() : metric.year1}</td>
                      <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{typeof metric.year2 === 'number' ? metric.year2.toLocaleString() : metric.year2}</td>
                      <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{typeof metric.year3 === 'number' ? metric.year3.toLocaleString() : metric.year3}</td>
                      <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{metric.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ============================================ */}
          {/* WEEKLY & MONTHLY TRACKING */}
          {/* ============================================ */}
          <div className="grid gap-6 md:grid-cols-2 border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="space-y-4">
              <h2 className="su-section-title">Weekly Tracking</h2>
              <div className="su-card">
                <div className="su-card-body">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 font-medium text-gray-800 dark:text-white/90">Metric</th>
                        <th className="text-left py-2 font-medium text-gray-800 dark:text-white/90">Target</th>
                        <th className="text-left py-2 font-medium text-gray-800 dark:text-white/90">
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                            Red Flag
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {WEEKLY_METRICS.map((metric, idx) => (
                        <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                          <td className="py-2 text-gray-700 dark:text-gray-300">{metric.name}</td>
                          <td className="py-2 text-emerald-600 dark:text-emerald-400">{metric.target}</td>
                          <td className="py-2 text-red-500">{metric.redFlag}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="su-section-title">Monthly Tracking</h2>
              <div className="su-card">
                <div className="su-card-body">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 font-medium text-gray-800 dark:text-white/90">Metric</th>
                        <th className="text-left py-2 font-medium text-gray-800 dark:text-white/90">Target</th>
                        <th className="text-left py-2 font-medium text-gray-800 dark:text-white/90">Trending</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MONTHLY_METRICS.map((metric, idx) => (
                        <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                          <td className="py-2 text-gray-700 dark:text-gray-300">{metric.name}</td>
                          <td className="py-2 text-emerald-600 dark:text-emerald-400">{metric.target}</td>
                          <td className="py-2 text-gray-500 dark:text-gray-400">{metric.trending}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* RISK TRIGGERS */}
          {/* ============================================ */}
          <div className="space-y-5 border-t border-gray-200 dark:border-gray-800 pt-8">
            <h2 className="su-section-title">Risk Triggers (When to Pivot)</h2>
            <div className="su-card">
              <div className="su-card-body">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 font-medium text-gray-800 dark:text-white/90">Stage</th>
                      <th className="text-left py-2 font-medium text-gray-800 dark:text-white/90">Warning Sign</th>
                      <th className="text-left py-2 font-medium text-gray-800 dark:text-white/90">Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RISK_TRIGGERS.map((risk, idx) => (
                      <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <td className="py-2 font-medium text-gray-800 dark:text-white/90">{risk.stage}</td>
                        <td className="py-2 text-red-500">{risk.warning}</td>
                        <td className="py-2 text-gray-500 dark:text-gray-400">{risk.response}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* THE HIERARCHY */}
          {/* ============================================ */}
          <div className="su-card bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-500/10 dark:to-blue-500/5 border-blue-200 dark:border-blue-500/20">
            <div className="su-card-header">
              <h3 className="font-semibold text-gray-800 dark:text-white/90">The Hierarchy</h3>
            </div>
            <div className="su-card-body">
              <ol className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400">1.</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Buildings</strong> (the moat) — always grows</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400">2.</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Techs</strong> (the network) — enables everything</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400">3.</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Employers</strong> (the revenue) — pays the bills</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400">4.</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>PMs</strong> (the accelerant) — multiplies network effects</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400">5.</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Premium products</strong> (the upside) — only when triggers met</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Key Principle */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4 border-t border-gray-200 dark:border-gray-800">
            <p className="font-medium text-gray-700 dark:text-gray-300">Key Principle: Every major decision has quantifiable triggers.</p>
            <p>No launches based on intuition alone — let the data tell us when the market is ready.</p>
          </div>
        </div>
      </div>
    </SuperUserLayout>
  );
}
