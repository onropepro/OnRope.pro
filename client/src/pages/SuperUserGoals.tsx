import { useQuery } from "@tanstack/react-query";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">KPIs & Tipping Points Framework</h1>
            <p className="text-muted-foreground">
              Strategic milestones for premium launches & market expansion. Every major decision has quantifiable triggers.
            </p>
          </div>

          {/* Executive Summary Table */}
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
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="py-2 px-2">1</td><td className="py-2 px-2">Tech Premium Launch</td><td className="py-2 px-2">2,500 tech accounts</td><td className="py-2 px-2 text-muted-foreground">Q4 Year 2</td><td className="py-2 px-2 text-muted-foreground">$22K → $108K ARR</td></tr>
                  <tr className="border-b"><td className="py-2 px-2">2</td><td className="py-2 px-2">PM Premium Launch</td><td className="py-2 px-2">150 PMs + 50% engagement</td><td className="py-2 px-2 text-muted-foreground">Q2 Year 2</td><td className="py-2 px-2 text-muted-foreground">$9K → $94K ARR</td></tr>
                  <tr className="border-b"><td className="py-2 px-2">3</td><td className="py-2 px-2">Building Manager Portal (Free)</td><td className="py-2 px-2">500 buildings in database</td><td className="py-2 px-2 text-muted-foreground">Q4 Year 1</td><td className="py-2 px-2 text-muted-foreground">Enables PM network</td></tr>
                  <tr className="border-b"><td className="py-2 px-2">4</td><td className="py-2 px-2">US West Coast Launch</td><td className="py-2 px-2">40% Canada penetration</td><td className="py-2 px-2 text-muted-foreground">Q1 Year 3</td><td className="py-2 px-2 text-muted-foreground">+$634K ARR by Y3 end</td></tr>
                  <tr className="border-b"><td className="py-2 px-2">5</td><td className="py-2 px-2">US East Coast Expansion</td><td className="py-2 px-2">75 US customers</td><td className="py-2 px-2 text-muted-foreground">Q1 Year 4</td><td className="py-2 px-2 text-muted-foreground">Path to $6.7M ARR</td></tr>
                  <tr className="border-b"><td className="py-2 px-2">6</td><td className="py-2 px-2">Unlimited Tier Push</td><td className="py-2 px-2">10 Enterprise customers</td><td className="py-2 px-2 text-muted-foreground">Q3 Year 2</td><td className="py-2 px-2 text-muted-foreground">+$200K ARPU lift</td></tr>
                  <tr className="border-b"><td className="py-2 px-2">7</td><td className="py-2 px-2">Transaction Fees</td><td className="py-2 px-2">50K platform transactions/yr</td><td className="py-2 px-2 text-muted-foreground">Year 4+</td><td className="py-2 px-2 text-muted-foreground">+15-25% revenue</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ============================================ */}
          {/* PART 1: TECH PREMIUM LAUNCH */}
          {/* ============================================ */}
          <div className="space-y-4 border-t pt-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Part 1: Tech Premium Launch ($14.99/mo)</h2>
                <p className="text-sm text-muted-foreground">Target: Q4 Year 2 | Revenue Impact: $22K → $108K ARR</p>
              </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Tech Accounts
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">{currentTechAccounts.toLocaleString()}</span>
                    <span className="text-muted-foreground">/ 2,500</span>
                  </div>
                  <Progress value={getProgressPercentage(currentTechAccounts, 2500)} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    New Tech Signups
                    <Badge variant="outline" className="text-xs">Monthly</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--</span>
                    <span className="text-muted-foreground">/ 400+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Network growth velocity</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Work History Depth
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--%</span>
                    <span className="text-muted-foreground">/ 60%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Techs with 12+ months history</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Multi-Employer Rate
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--%</span>
                    <span className="text-muted-foreground">/ 25%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Worked for 2+ employers</p>
                </CardContent>
              </Card>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-5">
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Employer connections/tech</p>
                  <p className="text-xl font-semibold">-- <span className="text-sm text-muted-foreground font-normal">/ 1.3+</span></p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Profile completion rate</p>
                  <p className="text-xl font-semibold">--% <span className="text-sm text-muted-foreground font-normal">/ 70%+</span></p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Return login rate (30-day)</p>
                  <p className="text-xl font-semibold">--% <span className="text-sm text-muted-foreground font-normal">/ 50%+</span></p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Referral rate (tech → tech)</p>
                  <p className="text-xl font-semibold">--% <span className="text-sm text-muted-foreground font-normal">/ 15%+</span></p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">PM profile views/month</p>
                  <p className="text-xl font-semibold">-- <span className="text-sm text-muted-foreground font-normal">/ 100+</span></p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ============================================ */}
          {/* PART 2: PM PREMIUM LAUNCH */}
          {/* ============================================ */}
          <div className="space-y-4 border-t pt-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-purple-500/10">
                <Target className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Part 2: PM Premium Launch ($49/building/mo)</h2>
                <p className="text-sm text-muted-foreground">Target: Q2 Year 2 | Revenue Impact: $9K → $94K ARR</p>
              </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    PM Accounts
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">{currentPropertyManagers}</span>
                    <span className="text-muted-foreground">/ 150+</span>
                  </div>
                  <Progress value={getProgressPercentage(currentPropertyManagers, 150)} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Monthly Engagement
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">{currentPmEngagement}%</span>
                    <span className="text-muted-foreground">/ 50%+</span>
                  </div>
                  <Progress value={getProgressPercentage(currentPmEngagement, 50)} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    New PM Signups
                    <Badge variant="outline" className="text-xs">Monthly</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--</span>
                    <span className="text-muted-foreground">/ 15+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Network growth</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Buildings Linked/PM
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--</span>
                    <span className="text-muted-foreground">/ 3.0+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Avg buildings per PM</p>
                </CardContent>
              </Card>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-5">
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Compliance mandates issued</p>
                  <p className="text-xl font-semibold">-- <span className="text-sm text-muted-foreground font-normal">/ 3+</span></p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Vendor searches/month</p>
                  <p className="text-xl font-semibold">-- <span className="text-sm text-muted-foreground font-normal">/ 200+</span></p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Vendor compliance checks</p>
                  <p className="text-xl font-semibold">-- <span className="text-sm text-muted-foreground font-normal">/ 100+</span></p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Project visibility views</p>
                  <p className="text-xl font-semibold">-- <span className="text-sm text-muted-foreground font-normal">/ 500+</span></p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">PM → Vendor mandates</p>
                  <p className="text-xl font-semibold">-- <span className="text-sm text-muted-foreground font-normal">/ 5+</span></p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ============================================ */}
          {/* PART 3: BUILDING MANAGER PORTAL (FREE) */}
          {/* ============================================ */}
          <div className="space-y-4 border-t pt-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-green-500/10">
                <Building2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Part 3: Building Manager Portal (Free) Launch</h2>
                <p className="text-sm text-muted-foreground">Target: Q4 Year 1 | Purpose: PM acquisition funnel</p>
              </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Buildings in Database
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">{currentBuildings}</span>
                    <span className="text-muted-foreground">/ 500+</span>
                  </div>
                  <Progress value={getProgressPercentage(currentBuildings, 500)} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Active Employers
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">{currentEmployers}</span>
                    <span className="text-muted-foreground">/ 10+</span>
                  </div>
                  <Progress value={getProgressPercentage(currentEmployers, 10)} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Service Records
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--</span>
                    <span className="text-muted-foreground">/ 600+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Maintenance records</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Vancouver Buildings
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--</span>
                    <span className="text-muted-foreground">/ 200+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Geographic density</p>
                </CardContent>
              </Card>
            </div>

            {/* Building Milestone Timeline */}
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
                          {isAchieved ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-4 w-4" />}
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

            {/* Success KPIs (First 90 Days) */}
            <div className="grid gap-4 md:grid-cols-5">
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">PM signups from portal</p>
                  <p className="text-xl font-semibold">-- <span className="text-sm text-muted-foreground font-normal">/ 30+</span></p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Buildings claimed by PMs</p>
                  <p className="text-xl font-semibold">-- <span className="text-sm text-muted-foreground font-normal">/ 150+</span></p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Return visits (30-day)</p>
                  <p className="text-xl font-semibold">--% <span className="text-sm text-muted-foreground font-normal">/ 40%+</span></p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Vendor mandates issued</p>
                  <p className="text-xl font-semibold">-- <span className="text-sm text-muted-foreground font-normal">/ 10+</span></p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Avg session duration</p>
                  <p className="text-xl font-semibold">-- <span className="text-sm text-muted-foreground font-normal">/ 5+ min</span></p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ============================================ */}
          {/* PART 4: US WEST COAST LAUNCH */}
          {/* ============================================ */}
          <div className="space-y-4 border-t pt-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-orange-500/10">
                <Globe className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Part 4: US West Coast Launch</h2>
                <p className="text-sm text-muted-foreground">Target: Q1 Year 3 | Revenue Impact: +$634K ARR by Y3 end</p>
              </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Canada Penetration
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">{currentEmployers}</span>
                    <span className="text-muted-foreground">/ 35 (40%)</span>
                  </div>
                  <Progress value={getProgressPercentage(currentEmployers, 35)} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Canada ARR
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">${Math.round(currentARR / 1000)}K</span>
                    <span className="text-muted-foreground">/ $400K+</span>
                  </div>
                  <Progress value={getProgressPercentage(currentARR, 400000)} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Churn Rate
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--%</span>
                    <span className="text-muted-foreground">/ &lt;8%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Annual churn stabilized</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Forced Adoption
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--%</span>
                    <span className="text-muted-foreground">/ 60%+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Network effects working</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Support Hours
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--</span>
                    <span className="text-muted-foreground">/ &lt;2 hrs/cust</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Monthly support load</p>
                </CardContent>
              </Card>
            </div>

            {/* Rollout Phases */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Geographic Rollout Sequence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-4 text-sm">
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">Phase 1: Q1 Y3</p>
                    <p className="text-muted-foreground">Seattle, Portland</p>
                  </div>
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">Phase 2: Q2 Y3</p>
                    <p className="text-muted-foreground">San Francisco Bay Area</p>
                  </div>
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">Phase 3: Q3 Y3</p>
                    <p className="text-muted-foreground">Los Angeles, San Diego</p>
                  </div>
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">Phase 4: Q4 Y3</p>
                    <p className="text-muted-foreground">Denver, Phoenix</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ============================================ */}
          {/* PART 5: US EAST COAST EXPANSION */}
          {/* ============================================ */}
          <div className="space-y-4 border-t pt-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-red-500/10">
                <Rocket className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Part 5: US East Coast Expansion</h2>
                <p className="text-sm text-muted-foreground">Target: Q1 Year 4 | Revenue Impact: Path to $6.7M ARR</p>
              </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    West Coast Customers
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--</span>
                    <span className="text-muted-foreground">/ 75+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">US West proven</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    US ARR
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">$--</span>
                    <span className="text-muted-foreground">/ $800K+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Sustainable US operations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    US Forced Adoption
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--%</span>
                    <span className="text-muted-foreground">/ 50%+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Network effects replicating</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    US Churn
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--%</span>
                    <span className="text-muted-foreground">/ &lt;10%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Retention in new market</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Operational Efficiency
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--</span>
                    <span className="text-muted-foreground">/ &lt;1.5 hrs</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Per customer/month</p>
                </CardContent>
              </Card>
            </div>

            {/* East Coast Markets */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">East Coast Market Sizing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-5 text-sm">
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">NYC Metro</p>
                    <p className="text-muted-foreground">200+ operators (#1)</p>
                  </div>
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">Boston</p>
                    <p className="text-muted-foreground">50+ operators (#2)</p>
                  </div>
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">Miami/S. Florida</p>
                    <p className="text-muted-foreground">75+ operators (#3)</p>
                  </div>
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">Chicago</p>
                    <p className="text-muted-foreground">60+ operators (#4)</p>
                  </div>
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">DC/Baltimore</p>
                    <p className="text-muted-foreground">40+ operators (#5)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ============================================ */}
          {/* PART 6: UNLIMITED TIER PUSH */}
          {/* ============================================ */}
          <div className="space-y-4 border-t pt-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-yellow-500/10">
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Part 6: Unlimited Tier Promotion Push</h2>
                <p className="text-sm text-muted-foreground">Target: Q3 Year 2 | Revenue Impact: +$200K ARPU lift</p>
              </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Enterprise Customers
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--</span>
                    <span className="text-muted-foreground">/ 10+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Proves market for large operators</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Enterprise NPS
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--</span>
                    <span className="text-muted-foreground">/ 50+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Happy customers upgrade</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Limit Hits
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--</span>
                    <span className="text-muted-foreground">/ 5+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Enterprise hitting limits</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    40+ Tech Prospects
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--</span>
                    <span className="text-muted-foreground">/ 20+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">In pipeline (CRM)</p>
                </CardContent>
              </Card>
            </div>

            {/* Unlimited Value Props */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Unlimited Tier Value Props ($1,999/mo vs Enterprise $999/mo)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-4 text-sm">
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">Projects</p>
                    <p className="text-muted-foreground">Unlimited (vs 30/mo)</p>
                  </div>
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">Seats</p>
                    <p className="text-muted-foreground">Unlimited (vs 40)</p>
                  </div>
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">Resident Logins</p>
                    <p className="text-muted-foreground">Unlimited (vs 1,000/mo)</p>
                  </div>
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">Support</p>
                    <p className="text-muted-foreground">Priority 4-hour SLA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ============================================ */}
          {/* PART 7: TRANSACTION FEES (FUTURE) */}
          {/* ============================================ */}
          <div className="space-y-4 border-t pt-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-cyan-500/10">
                <CreditCard className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Part 7: Transaction Fees (Future)</h2>
                <p className="text-sm text-muted-foreground">Target: Year 4+ | Revenue Impact: +15-25% revenue</p>
              </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Platform Transactions
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--</span>
                    <span className="text-muted-foreground">/ 50K+/yr</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Volume for meaningful revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    PM-Initiated Projects
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--%</span>
                    <span className="text-muted-foreground">/ 20%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">PMs sourcing through platform</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Marketplace Behavior
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--</span>
                    <span className="text-muted-foreground">Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground">True marketplace dynamics</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    Trust Score Adoption
                    <Badge variant="outline" className="text-xs">Trigger</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 mb-2">
                    <span className="text-3xl font-bold">--%</span>
                    <span className="text-muted-foreground">/ 80%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Vendors rated</p>
                </CardContent>
              </Card>
            </div>

            {/* Fee Model */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Transaction Fee Model (Conceptual - Est. Y4 Revenue)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-4 text-sm">
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">Booking Fee (2.5%)</p>
                    <p className="text-muted-foreground">PM-sourced: $150K</p>
                  </div>
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">Payment Processing (1.5%)</p>
                    <p className="text-muted-foreground">Platform payments: $100K</p>
                  </div>
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">Premium Placement ($99/mo)</p>
                    <p className="text-muted-foreground">Featured vendor: $50K</p>
                  </div>
                  <div className="p-3 rounded-md bg-background">
                    <p className="font-medium">Lead Fee ($25/lead)</p>
                    <p className="text-muted-foreground">Qualified PM intros: $75K</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ============================================ */}
          {/* NORTH STAR METRICS */}
          {/* ============================================ */}
          <div className="space-y-4 border-t pt-8">
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

          {/* ============================================ */}
          {/* WEEKLY & MONTHLY TRACKING */}
          {/* ============================================ */}
          <div className="grid gap-6 md:grid-cols-2 border-t pt-8">
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

          {/* ============================================ */}
          {/* RISK TRIGGERS */}
          {/* ============================================ */}
          <div className="space-y-4 border-t pt-8">
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

          {/* ============================================ */}
          {/* THE HIERARCHY */}
          {/* ============================================ */}
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

          {/* Key Principle */}
          <div className="text-center text-sm text-muted-foreground py-4 border-t">
            <p className="font-medium">Key Principle: Every major decision has quantifiable triggers.</p>
            <p>No launches based on intuition alone — let the data tell us when the market is ready.</p>
          </div>
        </div>
      </div>
    </SuperUserLayout>
  );
}
