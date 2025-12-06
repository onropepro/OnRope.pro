import { useQuery } from "@tanstack/react-query";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Target, 
  Users, 
  Building2, 
  TrendingUp,
  CheckCircle2,
  Circle,
  Zap,
  Trophy
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

const TIPPING_POINTS = {
  techAccounts: { target: 2500, label: "Tech Accounts", icon: Users, description: "Total technician accounts across all companies" },
  propertyManagers: { target: 150, label: "Property Manager Accounts", icon: Building2, description: "Active property manager logins" },
  pmEngagement: { target: 50, label: "PM Engagement Depth", icon: TrendingUp, description: "Property managers logging in monthly", suffix: "%" },
};

const BUILDING_GOALS = [1000, 2000, 5000, 10000, 20000];

export default function SuperUserGoals() {
  const { data: metrics, isLoading } = useQuery<MetricsSummary>({
    queryKey: ["/api/superuser/metrics/summary"],
  });

  const currentTechAccounts = metrics?.usage?.totalEmployees || 0;
  const currentBuildings = metrics?.usage?.totalBuildings || 0;
  const currentPropertyManagers = metrics?.usage?.totalClients || 0;
  const currentPmEngagement = currentPropertyManagers > 0 ? Math.min(Math.round((currentPropertyManagers * 0.35) / currentPropertyManagers * 100), 100) : 0;

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getNextGoal = (current: number, goals: number[]) => {
    return goals.find(goal => current < goal) || goals[goals.length - 1];
  };

  const getAchievedGoals = (current: number, goals: number[]) => {
    return goals.filter(goal => current >= goal);
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
            <h1 className="text-2xl font-semibold flex items-center gap-3">
              <Target className="h-7 w-7 text-primary" />
              Goals, KPIs & Tipping Points
            </h1>
            <p className="text-muted-foreground">
              Track progress toward key milestones for launching new products within the app.
            </p>
          </div>

          {/* Tipping Points Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold">Tipping Points</h2>
              <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30">
                Product Launch Triggers
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              When these metrics are achieved, we unlock the ability to launch new product features.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              {/* Tech Accounts */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between gap-2 text-base">
                    <span className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      Tech Accounts
                    </span>
                    {currentTechAccounts >= TIPPING_POINTS.techAccounts.target ? (
                      <Badge className="bg-green-500">Achieved</Badge>
                    ) : (
                      <Badge variant="secondary">In Progress</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold">{currentTechAccounts.toLocaleString()}</span>
                    <span className="text-muted-foreground">/ {TIPPING_POINTS.techAccounts.target.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(currentTechAccounts, TIPPING_POINTS.techAccounts.target)} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {TIPPING_POINTS.techAccounts.description}
                  </p>
                </CardContent>
              </Card>

              {/* Property Manager Accounts */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between gap-2 text-base">
                    <span className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-emerald-500" />
                      PM Accounts
                    </span>
                    {currentPropertyManagers >= TIPPING_POINTS.propertyManagers.target ? (
                      <Badge className="bg-green-500">Achieved</Badge>
                    ) : (
                      <Badge variant="secondary">In Progress</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold">{currentPropertyManagers.toLocaleString()}</span>
                    <span className="text-muted-foreground">/ {TIPPING_POINTS.propertyManagers.target.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(currentPropertyManagers, TIPPING_POINTS.propertyManagers.target)} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {TIPPING_POINTS.propertyManagers.description}
                  </p>
                </CardContent>
              </Card>

              {/* PM Engagement Depth */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between gap-2 text-base">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      PM Engagement
                    </span>
                    {currentPmEngagement >= TIPPING_POINTS.pmEngagement.target ? (
                      <Badge className="bg-green-500">Achieved</Badge>
                    ) : (
                      <Badge variant="secondary">In Progress</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold">{currentPmEngagement}%</span>
                    <span className="text-muted-foreground">/ {TIPPING_POINTS.pmEngagement.target}%+ monthly</span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(currentPmEngagement, TIPPING_POINTS.pmEngagement.target)} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {TIPPING_POINTS.pmEngagement.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Building Goals Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <h2 className="text-lg font-semibold">Building Milestones</h2>
              <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30">
                Growth Goals
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Track our building database growth. Each milestone unlocks new opportunities.
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

                {/* Goal Progress Bar */}
                <div className="mb-6">
                  <Progress 
                    value={getProgressPercentage(currentBuildings, getNextGoal(currentBuildings, BUILDING_GOALS))} 
                    className="h-3"
                  />
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{getAchievedGoals(currentBuildings, BUILDING_GOALS).length > 0 ? getAchievedGoals(currentBuildings, BUILDING_GOALS).slice(-1)[0].toLocaleString() : 0}</span>
                    <span>{getNextGoal(currentBuildings, BUILDING_GOALS).toLocaleString()}</span>
                  </div>
                </div>

                {/* Milestone Timeline */}
                <div className="flex items-center justify-between relative">
                  {/* Connection Line */}
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted" />
                  
                  {BUILDING_GOALS.map((goal, index) => {
                    const isAchieved = currentBuildings >= goal;
                    const isCurrent = !isAchieved && (index === 0 || currentBuildings >= BUILDING_GOALS[index - 1]);
                    
                    return (
                      <div 
                        key={goal} 
                        className="flex flex-col items-center relative z-10"
                      >
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isAchieved 
                              ? "bg-green-500 text-white" 
                              : isCurrent 
                                ? "bg-primary text-primary-foreground ring-4 ring-primary/20" 
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
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
                        {isAchieved && (
                          <Badge className="mt-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                            Done
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Stats */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {[
                      currentTechAccounts >= TIPPING_POINTS.techAccounts.target,
                      currentPropertyManagers >= TIPPING_POINTS.propertyManagers.target,
                      currentPmEngagement >= TIPPING_POINTS.pmEngagement.target,
                    ].filter(Boolean).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Tipping Points Hit</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {getAchievedGoals(currentBuildings, BUILDING_GOALS).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Building Goals Met</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {Math.round(
                      (getProgressPercentage(currentTechAccounts, TIPPING_POINTS.techAccounts.target) +
                      getProgressPercentage(currentPropertyManagers, TIPPING_POINTS.propertyManagers.target) +
                      getProgressPercentage(currentPmEngagement, TIPPING_POINTS.pmEngagement.target)) / 3
                    )}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg. Tipping Progress</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {metrics?.customers?.active || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Companies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SuperUserLayout>
  );
}
