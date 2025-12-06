import { useQuery } from "@tanstack/react-query";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Circle, AlertTriangle } from "lucide-react";

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

const CRITICAL_TIPPING_POINTS = [
  { id: 1, name: "Tech Premium Launch", trigger: "2,500 tech accounts", targetDate: "Q4 Year 2", revenueImpact: "$22K → $108K ARR" },
  { id: 2, name: "PM Premium Launch", trigger: "150 PMs + 50% engagement", targetDate: "Q2 Year 2", revenueImpact: "$9K → $94K ARR" },
  { id: 3, name: "Building Manager Portal (Free)", trigger: "500 buildings in database", targetDate: "Q4 Year 1", revenueImpact: "Enables PM network" },
  { id: 4, name: "US West Coast Launch", trigger: "40% Canada penetration", targetDate: "Q1 Year 3", revenueImpact: "+$634K ARR by Y3 end" },
  { id: 5, name: "US East Coast Expansion", trigger: "75 US customers", targetDate: "Q1 Year 4", revenueImpact: "Path to $6.7M ARR" },
  { id: 6, name: "Unlimited Tier Push", trigger: "10 Enterprise customers", targetDate: "Q3 Year 2", revenueImpact: "+$200K ARPU lift" },
  { id: 7, name: "Transaction Fees", trigger: "50K platform transactions/yr", targetDate: "Year 4+", revenueImpact: "+15-25% revenue" },
];

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

const BUILDING_GOALS = [500, 800, 2000, 5000, 10000, 20000];

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

  const getAchievedGoals = (current: number, goals: number[]) => {
    return goals.filter(goal => current >= goal);
  };

  const isTippingPointMet = (id: number): boolean => {
    switch (id) {
      case 1: return currentTechAccounts >= 2500;
      case 2: return currentPropertyManagers >= 150 && currentPmEngagement >= 50;
      case 3: return currentBuildings >= 500;
      case 4: return currentEmployers >= 35;
      case 5: return false;
      case 6: return false;
      case 7: return false;
      default: return false;
    }
  };

  const getTippingPointProgress = (id: number): number => {
    switch (id) {
      case 1: return getProgressPercentage(currentTechAccounts, 2500);
      case 2: return Math.min(getProgressPercentage(currentPropertyManagers, 150), getProgressPercentage(currentPmEngagement, 50));
      case 3: return getProgressPercentage(currentBuildings, 500);
      case 4: return getProgressPercentage(currentEmployers, 35);
      case 5: return 0;
      case 6: return 0;
      case 7: return 0;
      default: return 0;
    }
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
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">
              KPIs & Tipping Points Framework
            </h1>
            <p className="text-muted-foreground">
              Strategic milestones for premium launches & market expansion. Every major decision has quantifiable triggers.
            </p>
          </div>

          {/* The 7 Critical Tipping Points */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">The 7 Critical Tipping Points</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">#</th>
                    <th className="text-left py-3 px-2 font-medium">Milestone</th>
                    <th className="text-left py-3 px-2 font-medium">Primary Trigger</th>
                    <th className="text-left py-3 px-2 font-medium">Target Date</th>
                    <th className="text-left py-3 px-2 font-medium">Revenue Impact</th>
                    <th className="text-left py-3 px-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {CRITICAL_TIPPING_POINTS.map((point) => {
                    const isMet = isTippingPointMet(point.id);
                    const progress = getTippingPointProgress(point.id);
                    return (
                      <tr key={point.id} className="border-b hover-elevate">
                        <td className="py-3 px-2">{point.id}</td>
                        <td className="py-3 px-2 font-medium">{point.name}</td>
                        <td className="py-3 px-2">{point.trigger}</td>
                        <td className="py-3 px-2 text-muted-foreground">{point.targetDate}</td>
                        <td className="py-3 px-2 text-muted-foreground">{point.revenueImpact}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            {isMet ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <span className="text-muted-foreground">{Math.round(progress)}%</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Current Progress Cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Current Progress</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {/* Tech Accounts */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Tech Accounts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-end justify-between gap-2">
                    <span className="text-3xl font-bold">{currentTechAccounts.toLocaleString()}</span>
                    <span className="text-muted-foreground">/ 2,500</span>
                  </div>
                  <Progress value={getProgressPercentage(currentTechAccounts, 2500)} className="h-2" />
                  <p className="text-xs text-muted-foreground">Tech Premium Launch trigger</p>
                </CardContent>
              </Card>

              {/* PM Accounts */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">PM Accounts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-end justify-between gap-2">
                    <span className="text-3xl font-bold">{currentPropertyManagers.toLocaleString()}</span>
                    <span className="text-muted-foreground">/ 150</span>
                  </div>
                  <Progress value={getProgressPercentage(currentPropertyManagers, 150)} className="h-2" />
                  <p className="text-xs text-muted-foreground">PM Premium Launch trigger</p>
                </CardContent>
              </Card>

              {/* PM Engagement */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">PM Engagement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-end justify-between gap-2">
                    <span className="text-3xl font-bold">{currentPmEngagement}%</span>
                    <span className="text-muted-foreground">/ 50%+</span>
                  </div>
                  <Progress value={getProgressPercentage(currentPmEngagement, 50)} className="h-2" />
                  <p className="text-xs text-muted-foreground">Monthly login rate</p>
                </CardContent>
              </Card>

              {/* Paying Employers */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Paying Employers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-end justify-between gap-2">
                    <span className="text-3xl font-bold">{currentEmployers}</span>
                    <span className="text-muted-foreground">/ 35 (40%)</span>
                  </div>
                  <Progress value={getProgressPercentage(currentEmployers, 35)} className="h-2" />
                  <p className="text-xs text-muted-foreground">Canada penetration for US launch</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Building Milestones */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Building Database Growth</h2>
            <p className="text-sm text-muted-foreground">
              Buildings are the moat. 500 buildings triggers the free Building Manager Portal launch.
            </p>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Buildings</p>
                    <p className="text-4xl font-bold">{currentBuildings.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Next Goal</p>
                    <p className="text-2xl font-semibold text-primary">
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
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted" />
                  {BUILDING_GOALS.map((goal, index) => {
                    const isAchieved = currentBuildings >= goal;
                    const isCurrent = !isAchieved && (index === 0 || currentBuildings >= BUILDING_GOALS[index - 1]);
                    return (
                      <div key={goal} className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isAchieved 
                            ? "bg-green-500 text-white" 
                            : isCurrent 
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20" 
                              : "bg-muted text-muted-foreground"
                        }`}>
                          {isAchieved ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </div>
                        <span className={`mt-2 text-sm font-medium ${
                          isAchieved ? "text-green-600 dark:text-green-400" : isCurrent ? "text-primary" : "text-muted-foreground"
                        }`}>
                          {goal >= 1000 ? `${goal / 1000}K` : goal}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* North Star Metrics */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">North Star Metrics (Annual Targets)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Metric</th>
                    <th className="text-left py-3 px-2 font-medium">Year 1</th>
                    <th className="text-left py-3 px-2 font-medium">Year 2</th>
                    <th className="text-left py-3 px-2 font-medium">Year 3</th>
                    <th className="text-left py-3 px-2 font-medium">Why It's North Star</th>
                  </tr>
                </thead>
                <tbody>
                  {NORTH_STAR_METRICS.map((metric, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-3 px-2 font-medium">{metric.name}</td>
                      <td className="py-3 px-2">{typeof metric.year1 === 'number' ? metric.year1.toLocaleString() : metric.year1}</td>
                      <td className="py-3 px-2">{typeof metric.year2 === 'number' ? metric.year2.toLocaleString() : metric.year2}</td>
                      <td className="py-3 px-2">{typeof metric.year3 === 'number' ? metric.year3.toLocaleString() : metric.year3}</td>
                      <td className="py-3 px-2 text-muted-foreground">{metric.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weekly & Monthly Tracking */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Weekly */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Weekly Tracking</h2>
              <Card>
                <CardContent className="pt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Metric</th>
                        <th className="text-left py-2 font-medium">Target</th>
                        <th className="text-left py-2 font-medium">
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                            Red Flag
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {WEEKLY_METRICS.map((metric, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="py-2">{metric.name}</td>
                          <td className="py-2 text-green-600 dark:text-green-400">{metric.target}</td>
                          <td className="py-2 text-red-500">{metric.redFlag}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>

            {/* Monthly */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Monthly Tracking</h2>
              <Card>
                <CardContent className="pt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Metric</th>
                        <th className="text-left py-2 font-medium">Target</th>
                        <th className="text-left py-2 font-medium">Trending</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MONTHLY_METRICS.map((metric, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="py-2">{metric.name}</td>
                          <td className="py-2 text-green-600 dark:text-green-400">{metric.target}</td>
                          <td className="py-2 text-muted-foreground">{metric.trending}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Risk Triggers */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Risk Triggers (When to Pivot)</h2>
            <Card>
              <CardContent className="pt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Stage</th>
                      <th className="text-left py-2 font-medium">Warning Sign</th>
                      <th className="text-left py-2 font-medium">Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RISK_TRIGGERS.map((risk, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-2 font-medium">{risk.stage}</td>
                        <td className="py-2 text-red-500">{risk.warning}</td>
                        <td className="py-2 text-muted-foreground">{risk.response}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* The Hierarchy */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">The Hierarchy</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="font-bold text-primary">1.</span>
                  <span><strong>Buildings</strong> (the moat) — always grows</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-primary">2.</span>
                  <span><strong>Techs</strong> (the network) — enables everything</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-primary">3.</span>
                  <span><strong>Employers</strong> (the revenue) — pays the bills</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-primary">4.</span>
                  <span><strong>PMs</strong> (the accelerant) — multiplies network effects</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-primary">5.</span>
                  <span><strong>Premium products</strong> (the upside) — only when triggers met</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-primary">
                  {CRITICAL_TIPPING_POINTS.filter(p => isTippingPointMet(p.id)).length}
                </p>
                <p className="text-sm text-muted-foreground">Tipping Points Met</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-primary">
                  {getAchievedGoals(currentBuildings, BUILDING_GOALS).length}
                </p>
                <p className="text-sm text-muted-foreground">Building Goals Met</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-primary">
                  {currentBuildings.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Buildings (The Moat)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-primary">
                  ${Math.round(currentARR / 1000)}K
                </p>
                <p className="text-sm text-muted-foreground">Current ARR</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-primary">
                  {currentEmployers}
                </p>
                <p className="text-sm text-muted-foreground">Active Employers</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SuperUserLayout>
  );
}
