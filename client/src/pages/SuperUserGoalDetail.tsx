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
  ArrowLeft, TrendingUp, CheckCircle2, Circle, AlertTriangle, Clock,
  Activity, DollarSign, Percent, Calculator, BarChart3
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
    subtitle: "$14.99/mo per technician ($180/yr)",
    target: "Q4 Year 2",
    revenueImpact: "$22K (Y2) → $108K (Y3) → $270K (Y5) ARR",
    primaryTrigger: "2,500 tech accounts",
    icon: Users,
    color: "blue",
    bgColor: "bg-blue-50 dark:bg-blue-500/10",
    textColor: "text-blue-500",
    chartColor: "#3b82f6",
    description: "Launch a premium subscription tier for individual rope access technicians, offering portable work history, certification tracking, and multi-employer capabilities. Technicians pay $14.99/mo for premium features that follow them across jobs.",
    smartGoal: {
      specific: "Launch premium tech subscription at $14.99/mo with portable work history, certification tracking, and multi-employer profile features",
      measurable: "1,500 premium subscribers by Y5 = $270K ARR (at $180/yr each)",
      achievable: "Target 7.5% conversion of 20,000 tech accounts by Y5",
      relevant: "Creates individual revenue stream independent of employer subscriptions, increases platform stickiness",
      timeBound: "Launch in Q4 Year 2 after reaching 2,500 tech account threshold",
    },
    triggers: [
      { name: "Tech Accounts", current: "totalEmployees", target: 2500, unit: "", note: "Critical mass for launch" },
      { name: "Work History Depth", current: null, target: 60, unit: "%", note: "Techs with 12+ months history" },
      { name: "Multi-Employer Rate", current: null, target: 25, unit: "%", note: "Worked for 2+ employers" },
      { name: "Profile Completion", current: null, target: 70, unit: "%", note: "Complete tech profiles" },
    ],
    leadingMetrics: [
      { metric: "Weekly tech signups", target: "25+", redFlag: "<10", category: "Acquisition" },
      { metric: "Profile completion rate", target: "70%+", redFlag: "<50%", category: "Engagement" },
      { metric: "Return login rate (30-day)", target: "50%+", redFlag: "<30%", category: "Retention" },
      { metric: "Multi-employer connections", target: "1.3+ avg", redFlag: "<1.1", category: "Network" },
    ],
    laggingMetrics: [
      { metric: "Premium subscribers", y2: "100", y3: "600", y5: "1,500" },
      { metric: "Tech Premium ARR", y2: "$22K", y3: "$108K", y5: "$270K" },
      { metric: "Conversion rate", y2: "4%", y3: "6%", y5: "7.5%" },
    ],
    projectedGrowth: [
      { month: "Now", value: 0 },
      { month: "Q1 Y1", value: 125 },
      { month: "Q2 Y1", value: 250 },
      { month: "Q3 Y1", value: 375 },
      { month: "Q4 Y1", value: 500 },
      { month: "Q2 Y2", value: 1500 },
      { month: "Q4 Y2", value: 2500 },
    ],
    revenueProjection: [
      { month: "Launch", premium: 0 },
      { month: "+3mo", premium: 5000 },
      { month: "+6mo", premium: 22000 },
      { month: "+12mo", premium: 55000 },
      { month: "+24mo", premium: 108000 },
      { month: "Y5", premium: 270000 },
    ],
  },
  "pm-premium": {
    part: 2,
    title: "PM Premium Launch",
    subtitle: "$49/building/mo",
    target: "After 150 PMs + 50% engagement",
    revenueImpact: "$9K (Y2) → $94K (Y3) → $150K (Y5) ARR",
    primaryTrigger: "150 PMs + 50% engagement",
    icon: Target,
    color: "purple",
    bgColor: "bg-purple-50 dark:bg-purple-500/10",
    textColor: "text-purple-500",
    chartColor: "#8b5cf6",
    description: "Launch premium features for property managers including vendor search, compliance verification, and project visibility across their building portfolio. PM accounts are currently FREE. Premium tier launches after understanding usage patterns.",
    smartGoal: {
      specific: "Launch PM Premium at $49/bldg/mo with vendor search, compliance dashboard, and portfolio analytics",
      measurable: "250 PMs × 5 bldgs avg × $49 × 12 = $150K ARR by Y5",
      achievable: "Target 30% premium conversion of 800 PM accounts by Y5",
      relevant: "Monetizes PM network effect, creates recurring revenue from building portfolio managers",
      timeBound: "Launch after hitting 150 PM accounts with 50%+ monthly engagement",
    },
    triggers: [
      { name: "PM Accounts", current: "totalClients", target: 150, unit: "", note: "Critical mass" },
      { name: "Monthly Engagement", current: null, target: 50, unit: "%", note: "Active monthly users" },
      { name: "Avg Buildings/PM", current: null, target: 3, unit: "", note: "Portfolio size indicator" },
      { name: "Feature Research Complete", current: null, target: 100, unit: "%", note: "Part 3 dependency" },
    ],
    leadingMetrics: [
      { metric: "PM account signups", target: "10+/mo", redFlag: "<5", category: "Acquisition" },
      { metric: "Monthly active PMs", target: "50%+", redFlag: "<30%", category: "Engagement" },
      { metric: "Vendor searches/month", target: "200+", redFlag: "<50", category: "Usage" },
      { metric: "Compliance checks/month", target: "100+", redFlag: "<25", category: "Value" },
    ],
    laggingMetrics: [
      { metric: "Premium PM subscribers", y2: "15", y3: "60", y5: "250" },
      { metric: "PM Premium ARR", y2: "$9K", y3: "$94K", y5: "$150K" },
      { metric: "Avg bldgs per premium PM", y2: "3", y3: "4", y5: "5" },
    ],
    projectedGrowth: [
      { month: "Now", value: 0 },
      { month: "Q2 Y1", value: 10 },
      { month: "Q4 Y1", value: 50 },
      { month: "Q2 Y2", value: 100 },
      { month: "Q4 Y2", value: 200 },
    ],
    revenueProjection: [
      { month: "Launch", premium: 0 },
      { month: "+6mo", premium: 9000 },
      { month: "+12mo", premium: 35000 },
      { month: "+24mo", premium: 94000 },
      { month: "Y5", premium: 150000 },
    ],
  },
  "pm-feature-definition": {
    part: 3,
    title: "PM Premium Feature Definition",
    subtitle: "Research & define premium features",
    target: "Q1 Year 2",
    revenueImpact: "Enables PM Premium launch (Part 2)",
    primaryTrigger: "100+ PM accounts",
    icon: Building2,
    color: "emerald",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    textColor: "text-emerald-500",
    chartColor: "#10b981",
    description: "Research and define which PM features should be premium vs free based on actual usage patterns and user feedback. Building Manager (BM) accounts remain FREE FOREVER as they are single-building scope. PM Premium features TBD based on this research phase.",
    smartGoal: {
      specific: "Complete comprehensive research to identify top 5 premium features for Property Managers based on usage data and direct feedback",
      measurable: "25+ PM surveys completed, usage analytics in place, competitive analysis documented, value quantification for 3+ features",
      achievable: "PM account growth provides research population; analytics already tracking usage patterns",
      relevant: "Data-driven feature definition ensures PM Premium launch success and optimal pricing",
      timeBound: "Complete research by Q1 Year 2 (triggers when 100+ PM accounts reached)",
    },
    keyDistinction: {
      bm: { title: "Building Manager (BM)", scope: "Single building", price: "FREE FOREVER", description: "Lives at building, handles day-to-day maintenance" },
      pm: { title: "Property Manager (PM)", scope: "Multi-building portfolio (50+)", price: "Premium TBD", description: "Manages many properties with different BMs at each" },
    },
    triggers: [
      { name: "PM Accounts", current: "totalClients", target: 100, unit: "", note: "Minimum for research" },
      { name: "Usage Analytics Active", current: null, target: 100, unit: "%", note: "Tracking in place" },
      { name: "PM Surveys Completed", current: null, target: 25, unit: "", note: "Direct feedback" },
      { name: "Competitive Analysis", current: null, target: 100, unit: "%", note: "Market research done" },
    ],
    researchOutputs: [
      { output: "Top 5 most-used PM features identified", status: "pending" },
      { output: "Pain points documented (10+ items)", status: "pending" },
      { output: "Competitive analysis complete", status: "pending" },
      { output: "Value quantification for 3+ features", status: "pending" },
      { output: "Premium feature set finalized", status: "pending" },
    ],
    featureCategories: [
      { category: "Analytics", examples: "Portfolio compliance dashboard, vendor benchmarking, cost comparison", potentialValue: "High" },
      { category: "Workflow", examples: "RFP/bid management, multi-vendor comparison, scheduling recommendations", potentialValue: "High" },
      { category: "Reporting", examples: "Custom reports, board-ready exports, trend analysis", potentialValue: "Medium" },
      { category: "Support", examples: "Priority support, dedicated account manager", potentialValue: "Medium" },
      { category: "Integration", examples: "API access, property management software integration", potentialValue: "High" },
    ],
    projectedGrowth: [
      { month: "Now", value: 0 },
      { month: "25 PMs", value: 25 },
      { month: "50 PMs", value: 50 },
      { month: "75 PMs", value: 75 },
      { month: "100 PMs", value: 100 },
    ],
  },
  "us-west": {
    part: 4,
    title: "US West Coast Launch",
    subtitle: "Seattle, SF, LA, San Diego",
    target: "Q1 Year 3",
    revenueImpact: "+55 customers, $635K ARR by Y3 end",
    primaryTrigger: "40% Canada penetration",
    icon: Globe,
    color: "orange",
    bgColor: "bg-orange-50 dark:bg-orange-500/10",
    textColor: "text-orange-500",
    chartColor: "#f97316",
    description: "Expand to US West Coast markets (Seattle, San Francisco, Los Angeles, San Diego) after achieving strong Canada market penetration and proven unit economics. USD pricing: Starter $349, Professional $649, Enterprise $1,199, Unlimited $2,399.",
    smartGoal: {
      specific: "Launch in 4 US West Coast metros: Seattle, San Francisco, Los Angeles, San Diego",
      measurable: "55 US customers generating $635K ARR by end of Year 3",
      achievable: "Proven playbook from Canada expansion; similar market dynamics",
      relevant: "US market is 10x larger than Canada; West Coast has highest rope access density",
      timeBound: "Launch Q1 Year 3 after Canada hits 40% TAM penetration (~35 employers)",
    },
    triggers: [
      { name: "Canada Employers", current: "active", target: 35, unit: "", note: "40% of Canada TAM" },
      { name: "Canada ARR", current: "arr", target: 400000, unit: "$", note: "$400K+ proves model" },
      { name: "Net Revenue Retention", current: null, target: 120, unit: "%", note: "Expansion > churn" },
      { name: "CAC Payback", current: null, target: 9, unit: "mo", note: "<9 months" },
    ],
    leadingMetrics: [
      { metric: "US demo requests", target: "5+/mo", redFlag: "<2", category: "Demand" },
      { metric: "US trial starts", target: "3+/mo", redFlag: "<1", category: "Pipeline" },
      { metric: "US forced adoption rate", target: "60%+", redFlag: "<40%", category: "Network" },
      { metric: "Canada NRR", target: "120%+", redFlag: "<100%", category: "Health" },
    ],
    laggingMetrics: [
      { metric: "US West employers", y3: "55", y4: "100", y5: "150" },
      { metric: "US West ARR", y3: "$635K", y4: "$1.2M", y5: "$1.8M" },
      { metric: "US CAC", y3: "$2,000", y4: "$1,500", y5: "$1,200" },
    ],
    tierBreakdownY3: [
      { tier: "Starter", customers: 11, pct: "20%", mrr: "$3,839", arr: "$46K" },
      { tier: "Professional", customers: 22, pct: "40%", mrr: "$14,278", arr: "$171K" },
      { tier: "Enterprise", customers: 15, pct: "27%", mrr: "$17,985", arr: "$216K" },
      { tier: "Unlimited", customers: 7, pct: "13%", mrr: "$16,793", arr: "$202K" },
    ],
    projectedGrowth: [
      { month: "Launch", value: 0 },
      { month: "+3mo", value: 8 },
      { month: "+6mo", value: 20 },
      { month: "+9mo", value: 35 },
      { month: "+12mo", value: 55 },
    ],
  },
  "us-east": {
    part: 5,
    title: "US East Coast Expansion",
    subtitle: "NYC, Boston, Philly, DC, Miami",
    target: "Q1 Year 4",
    revenueImpact: "Path to $6.7M ARR and $100M valuation",
    primaryTrigger: "75 US customers (West Coast success)",
    icon: Rocket,
    color: "pink",
    bgColor: "bg-pink-50 dark:bg-pink-500/10",
    textColor: "text-pink-500",
    chartColor: "#ec4899",
    description: "Scale to East Coast markets with proven US playbook, targeting major metro areas (NYC, Boston, Philadelphia, DC, Miami) for maximum density. This expansion enables path to $6.7M ARR and $100M valuation at 15x multiple.",
    smartGoal: {
      specific: "Expand to 5 East Coast metros: NYC, Boston, Philadelphia, DC, Miami",
      measurable: "120+ East Coast customers contributing to 500 total employers by Y5",
      achievable: "Proven US West playbook, established brand recognition, network effects",
      relevant: "East Coast represents 40% of US rope access market; essential for $100M valuation",
      timeBound: "Launch Q1 Year 4 after US West Coast reaches 75 customers",
    },
    triggers: [
      { name: "US West Customers", current: null, target: 75, unit: "", note: "West Coast proven" },
      { name: "US West ARR", current: null, target: 1000000, unit: "$", note: "$1M+ US ARR" },
      { name: "US Sales Team", current: null, target: 3, unit: "", note: "Reps in place" },
      { name: "US West NPS", current: null, target: 50, unit: "", note: "Customer satisfaction" },
    ],
    laggingMetrics: [
      { metric: "Total US employers", y4: "150", y5: "270" },
      { metric: "Combined US ARR", y4: "$2.5M", y5: "$4.0M" },
      { metric: "East Coast employers", y4: "50", y5: "120" },
      { metric: "Blended US CAC", y4: "$1,200", y5: "$800" },
    ],
    projectedGrowth: [
      { month: "Launch", value: 75 },
      { month: "+6mo", value: 100 },
      { month: "+12mo", value: 150 },
      { month: "+18mo", value: 200 },
      { month: "Y5", value: 270 },
    ],
  },
  "unlimited-tier": {
    part: 6,
    title: "Unlimited Tier Push",
    subtitle: "$1,999/mo CAD ($2,399/mo USD)",
    target: "Q3 Year 2",
    revenueImpact: "$24K (Y1) → $96K (Y2) → $2.38M (Y5) ARR",
    primaryTrigger: "10 Enterprise customers",
    icon: Zap,
    color: "amber",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    textColor: "text-amber-500",
    chartColor: "#f59e0b",
    description: "Push unlimited tier upgrades for large operators (40+ techs). Value prop: ~$50/tech vs $100+/tech on Enterprise. Unlimited includes infinite projects, seats, resident logins, and 4-hour priority support SLA.",
    smartGoal: {
      specific: "Acquire and upgrade 90 Unlimited tier customers ($1,999-$2,399/mo) by Year 5",
      measurable: "90 Unlimited × $2,200 avg × 12 = $2.38M ARR from Unlimited tier alone",
      achievable: "18% of 500 employers by Y5; upgrade path from Enterprise tier",
      relevant: "Highest ARPU tier ($26K/yr); drives overall ARPU from $639 to $1,022/mo",
      timeBound: "Begin active push Q3 Year 2 after 10 Enterprise customers validate large operator demand",
    },
    triggers: [
      { name: "Enterprise Customers", current: null, target: 10, unit: "", note: "Proves large operator market" },
      { name: "Enterprise NPS", current: null, target: 50, unit: "", note: "Satisfaction for upsell" },
      { name: "Limit Hits/Month", current: null, target: 5, unit: "", note: "Enterprise users hitting caps" },
      { name: "40+ Tech Prospects", current: null, target: 20, unit: "", note: "Pipeline for Unlimited" },
    ],
    leadingMetrics: [
      { metric: "Enterprise at 90% seat limit", target: "Track", redFlag: "Missing", category: "Upgrade Signal" },
      { metric: "Enterprise overage costs", target: ">$300/mo", redFlag: "N/A", category: "Upgrade Signal" },
      { metric: "40+ tech operator pipeline", target: "20+", redFlag: "<10", category: "Pipeline" },
      { metric: "Enterprise support tickets", target: "<5/mo", redFlag: ">10", category: "Satisfaction" },
    ],
    laggingMetrics: [
      { metric: "Unlimited subscribers", y1: "1", y2: "4", y3: "18", y5: "90" },
      { metric: "Unlimited ARR", y1: "$24K", y2: "$96K", y3: "$465K", y5: "$2.38M" },
      { metric: "% of Enterprise", y1: "7%", y2: "8%", y3: "12%", y5: "18%" },
    ],
    upgradeSignals: [
      { signal: "Enterprise at 35+ techs", action: "Proactive Unlimited outreach", timing: "Within 1 week" },
      { signal: "Overage >$500/mo for 2+ months", action: "ROI comparison call", timing: "Immediate" },
      { signal: "Support ticket asking about limits", action: "Upgrade discussion", timing: "Same day" },
    ],
    projectedGrowth: [
      { month: "Y1", value: 1 },
      { month: "Y2", value: 4 },
      { month: "Y3", value: 18 },
      { month: "Y4", value: 48 },
      { month: "Y5", value: 90 },
    ],
    revenueProjection: [
      { month: "Y1", premium: 24000 },
      { month: "Y2", premium: 96000 },
      { month: "Y3", premium: 465000 },
      { month: "Y4", premium: 1238000 },
      { month: "Y5", premium: 2380000 },
    ],
  },
  "transaction-fees": {
    part: 7,
    title: "Transaction Fees",
    subtitle: "1.5% platform fees on payments",
    target: "Year 4+",
    revenueImpact: "+$150K+ revenue (15-25% of subs)",
    primaryTrigger: "50K platform transactions/yr",
    icon: CreditCard,
    color: "cyan",
    bgColor: "bg-cyan-50 dark:bg-cyan-500/10",
    textColor: "text-cyan-500",
    chartColor: "#06b6d4",
    description: "Introduce 1.5% transaction fees on platform payments once transaction volume reaches critical mass. At $10M+ GMV, this generates $150K+ in additional high-margin revenue. Processing margin after Stripe fees: ~0.6%.",
    smartGoal: {
      specific: "Implement 1.5% transaction fee on all payments processed through OnRopePro platform",
      measurable: "$10M+ GMV × 1.5% = $150K+ transaction fee revenue annually",
      achievable: "60%+ payment adoption by employers; natural progression as platform becomes workflow hub",
      relevant: "High-margin revenue stream with minimal incremental cost; increases platform stickiness",
      timeBound: "Launch Year 4 after reaching 50K platform transactions/year threshold",
    },
    triggers: [
      { name: "Platform Transactions/yr", current: null, target: 50000, unit: "", note: "Annual volume" },
      { name: "GMV Through Platform", current: null, target: 10000000, unit: "$", note: "$10M+ GMV" },
      { name: "Payment Adoption Rate", current: null, target: 60, unit: "%", note: "Employers using payments" },
      { name: "Avg Transaction Size", current: null, target: 200, unit: "$", note: "Healthy transaction value" },
    ],
    leadingMetrics: [
      { metric: "Payment feature adoption", target: "60%+", redFlag: "<40%", category: "Adoption" },
      { metric: "Transactions per employer/mo", target: "15+", redFlag: "<8", category: "Volume" },
      { metric: "Avg transaction value", target: "$200+", redFlag: "<$100", category: "Value" },
      { metric: "Payment NPS", target: "70+", redFlag: "<50", category: "Satisfaction" },
    ],
    laggingMetrics: [
      { metric: "Annual transactions", y3: "20K", y4: "50K", y5: "100K" },
      { metric: "GMV", y3: "$4M", y4: "$10M", y5: "$20M" },
      { metric: "Transaction fee revenue", y3: "$0", y4: "$150K", y5: "$300K" },
      { metric: "Processing margin", y3: "N/A", y4: "0.6%", y5: "0.6%" },
    ],
    projectedGrowth: [
      { month: "Y3 Q4", value: 15000 },
      { month: "Y4 Q1", value: 25000 },
      { month: "Y4 Q2", value: 35000 },
      { month: "Y4 Q3", value: 45000 },
      { month: "Y4 Q4", value: 55000 },
      { month: "Y5", value: 100000 },
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

          {/* Description & Revenue Impact */}
          <div className="su-card bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-800">
            <div className="p-4">
              <p className="text-gray-600 dark:text-gray-300">{config.description}</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                Revenue Impact: {config.revenueImpact}
              </p>
            </div>
          </div>

          {/* SMART Goal Breakdown */}
          {config.smartGoal && (
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">SMART Goal Framework</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Specific, Measurable, Achievable, Relevant, Time-bound</p>
              </div>
              <div className="su-card-body">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Specific</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{config.smartGoal.specific}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">Measurable</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{config.smartGoal.measurable}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Achievable</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{config.smartGoal.achievable}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">Relevant</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{config.smartGoal.relevant}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-pink-500" />
                      <span className="text-sm font-semibold text-pink-700 dark:text-pink-400">Time-bound</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{config.smartGoal.timeBound}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BM vs PM Distinction (for Part 3) */}
          {config.keyDistinction && (
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Key Distinction: BM vs PM Accounts</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">These are fundamentally different account types for different roles</p>
              </div>
              <div className="su-card-body">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-emerald-700 dark:text-emerald-400">{config.keyDistinction.bm.title}</h4>
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">{config.keyDistinction.bm.price}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{config.keyDistinction.bm.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Scope: {config.keyDistinction.bm.scope}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-purple-700 dark:text-purple-400">{config.keyDistinction.pm.title}</h4>
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">{config.keyDistinction.pm.price}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{config.keyDistinction.pm.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Scope: {config.keyDistinction.pm.scope}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overall Progress & Triggers */}
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

          {/* Leading & Lagging Metrics */}
          {(config.leadingMetrics || config.laggingMetrics) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {config.leadingMetrics && (
                <div className="su-card">
                  <div className="su-card-header">
                    <h3 className="font-semibold text-gray-800 dark:text-white/90">Leading Metrics</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Predictive indicators (controllable)</p>
                  </div>
                  <div className="su-card-body">
                    <div className="space-y-3">
                      {config.leadingMetrics.map((m: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{m.metric}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{m.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{m.target}</p>
                            <p className="text-xs text-red-500">Red: {m.redFlag}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {config.laggingMetrics && (
                <div className="su-card">
                  <div className="su-card-header">
                    <h3 className="font-semibold text-gray-800 dark:text-white/90">Lagging Metrics</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Outcome indicators by year</p>
                  </div>
                  <div className="su-card-body">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-2 px-2 font-medium text-gray-600 dark:text-gray-400">Metric</th>
                            {config.laggingMetrics[0].y1 && <th className="text-right py-2 px-2 font-medium text-gray-600 dark:text-gray-400">Y1</th>}
                            {config.laggingMetrics[0].y2 && <th className="text-right py-2 px-2 font-medium text-gray-600 dark:text-gray-400">Y2</th>}
                            {config.laggingMetrics[0].y3 && <th className="text-right py-2 px-2 font-medium text-gray-600 dark:text-gray-400">Y3</th>}
                            {config.laggingMetrics[0].y4 && <th className="text-right py-2 px-2 font-medium text-gray-600 dark:text-gray-400">Y4</th>}
                            {config.laggingMetrics[0].y5 && <th className="text-right py-2 px-2 font-medium text-gray-600 dark:text-gray-400">Y5</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {config.laggingMetrics.map((row: any, idx: number) => (
                            <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                              <td className="py-2.5 px-2 text-gray-800 dark:text-white/90">{row.metric}</td>
                              {row.y1 && <td className="py-2.5 px-2 text-right text-gray-600 dark:text-gray-300">{row.y1}</td>}
                              {row.y2 && <td className="py-2.5 px-2 text-right text-gray-600 dark:text-gray-300">{row.y2}</td>}
                              {row.y3 && <td className="py-2.5 px-2 text-right text-gray-600 dark:text-gray-300">{row.y3}</td>}
                              {row.y4 && <td className="py-2.5 px-2 text-right text-gray-600 dark:text-gray-300">{row.y4}</td>}
                              {row.y5 && <td className="py-2.5 px-2 text-right font-semibold text-emerald-600 dark:text-emerald-400">{row.y5}</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tier Breakdown (for US West) */}
          {config.tierBreakdownY3 && (
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Y3 US West Coast Tier Breakdown</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">55 customers generating $635K ARR</p>
              </div>
              <div className="su-card-body">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">Tier</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-600 dark:text-gray-400">Customers</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-600 dark:text-gray-400">%</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-600 dark:text-gray-400">MRR</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-600 dark:text-gray-400">ARR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {config.tierBreakdownY3.map((row: any, idx: number) => (
                        <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-2.5 px-3 font-medium text-gray-800 dark:text-white/90">{row.tier}</td>
                          <td className="py-2.5 px-3 text-right text-gray-600 dark:text-gray-300">{row.customers}</td>
                          <td className="py-2.5 px-3 text-right text-gray-600 dark:text-gray-300">{row.pct}</td>
                          <td className="py-2.5 px-3 text-right text-gray-600 dark:text-gray-300">{row.mrr}</td>
                          <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">{row.arr}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Upgrade Signals (for Unlimited Tier) */}
          {config.upgradeSignals && (
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Upgrade Trigger Signals</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">When to initiate Unlimited tier conversations</p>
              </div>
              <div className="su-card-body">
                <div className="space-y-3">
                  {config.upgradeSignals.map((s: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-800">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{s.signal}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Action: {s.action}</p>
                      </div>
                      <Badge variant="outline" className="text-amber-600 border-amber-300">{s.timing}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Feature Categories (for PM Feature Definition) */}
          {config.featureCategories && (
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Feature Categories to Evaluate</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Research areas for PM Premium features</p>
              </div>
              <div className="su-card-body">
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {config.featureCategories.map((f: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800 dark:text-white/90">{f.category}</h4>
                        <Badge variant={f.potentialValue === "High" ? "default" : "secondary"} className="text-xs">
                          {f.potentialValue} Value
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{f.examples}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Research Outputs (for PM Feature Definition) */}
          {config.researchOutputs && (
            <div className="su-card">
              <div className="su-card-header">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Research Outputs Checklist</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Deliverables required before PM Premium launch</p>
              </div>
              <div className="su-card-body">
                <div className="space-y-2">
                  {config.researchOutputs.map((o: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      {o.status === "complete" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                      )}
                      <span className={`text-sm ${o.status === "complete" ? "text-gray-500 line-through" : "text-gray-800 dark:text-white/90"}`}>
                        {o.output}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {config.projectedGrowth && (
              <div className="su-card">
                <div className="su-card-header">
                  <h3 className="font-semibold text-gray-800 dark:text-white/90">Growth Projection</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Expected trajectory</p>
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

            {config.revenueProjection && (
              <div className="su-card">
                <div className="su-card-header">
                  <h3 className="font-semibold text-gray-800 dark:text-white/90">Revenue Projection</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Expected ARR growth</p>
                </div>
                <div className="su-card-body">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={config.revenueProjection}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <YAxis 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                          tickFormatter={(v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${v / 1000}K`}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="premium" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SuperUserLayout>
  );
}
