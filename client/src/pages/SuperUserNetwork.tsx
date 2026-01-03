import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { 
  Network, Users, Building2, TrendingUp, TrendingDown, Share2,
  Target, AlertCircle, CheckCircle2, Clock, Lock, Database,
  BarChart3, ArrowUpRight, ArrowDownRight, Minus, Briefcase,
  UserCheck, FileCheck, Shield, Link2, Layers
} from "lucide-react";

interface NetworkMetrics {
  platformSearches: {
    total: number;
    byType: { contractors: number; buildings: number; technicians: number };
    searchToMatchRate: number;
  };
  vendorVerifications: {
    total: number;
    verified: number;
    pending: number;
    verificationRate: number;
  };
  referrals: {
    total: number;
    successful: number;
    successRate: number;
    viralCoefficient: number;
  };
  notificationEngagement: {
    sent: number;
    interacted: number;
    engagementRate: number;
  };
  crossSideMetrics: {
    techsLinkedToCompanies: number;
    companiesWithLinkedTechs: number;
    buildingsWithMultipleVendors: number;
    avgVendorsPerBuilding: number;
  };
  accountCounts: {
    companies: number;
    technicians: number;
    residents: number;
    propertyManagers: number;
    buildingManagers: number;
    groundCrew: number;
  };
  healthScore: {
    overall: number;
    components: {
      crossSideActivity: number;
      dataDepth: number;
      userEngagement: number;
      viralGrowth: number;
    };
  };
  lockIn: {
    avgProjectsPerCompany: number;
    avgEmployeesPerCompany: number;
    avgCertificationsPerTech: number;
    avgBuildingsPerCompany: number;
    avgWorkSessionsPerCompany: number;
    avgSafetyFormsPerCompany: number;
    companiesWithWhiteLabel: number;
    companiesWithCustomBranding: number;
  };
  cohorts: {
    month: string;
    signups: number;
    retained: number;
    retentionRate: number;
    avgMrr: number;
  }[];
}

const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);
const formatPercent = (num: number) => `${(num * 100).toFixed(1)}%`;
const formatCurrency = (num: number) => new Intl.NumberFormat('en-US', { 
  style: 'currency', 
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).format(num);

function NoDataMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <AlertCircle className="h-12 w-12 mb-4 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function HealthScoreGauge({ score, size = 200 }: { score: number; size?: number }) {
  const getColor = (value: number) => {
    if (value >= 80) return "#22c55e";
    if (value >= 60) return "#eab308";
    if (value >= 40) return "#f97316";
    return "#ef4444";
  };

  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          size: "70%",
        },
        track: {
          background: "hsl(var(--muted))",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "14px",
            color: "hsl(var(--muted-foreground))",
            offsetY: 20,
          },
          value: {
            show: true,
            fontSize: "32px",
            fontWeight: 700,
            color: "hsl(var(--foreground))",
            offsetY: -15,
            formatter: (val: number) => Math.round(val).toString(),
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: [getColor(score)],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Health Score"],
  };

  return (
    <Chart
      options={options}
      series={[score]}
      type="radialBar"
      height={size}
    />
  );
}

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  trendValue,
  variant = "default"
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string; 
  icon: typeof Users; 
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const variantStyles = {
    default: "border-border",
    success: "border-emerald-500/30 dark:border-emerald-500/20",
    warning: "border-amber-500/30 dark:border-amber-500/20",
    danger: "border-red-500/30 dark:border-red-500/20"
  };

  const iconBg = {
    default: "bg-muted",
    success: "bg-emerald-100 dark:bg-emerald-500/20",
    warning: "bg-amber-100 dark:bg-amber-500/20",
    danger: "bg-red-100 dark:bg-red-500/20"
  };

  return (
    <Card className={`${variantStyles[variant]}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className={`flex items-center gap-1 mt-2 text-xs ${
                trend === "up" ? "text-emerald-600 dark:text-emerald-400" : 
                trend === "down" ? "text-red-600 dark:text-red-400" : 
                "text-muted-foreground"
              }`}>
                {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : 
                 trend === "down" ? <ArrowDownRight className="h-3 w-3" /> : 
                 <Minus className="h-3 w-3" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`p-2 rounded-lg ${iconBg[variant]}`}>
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OverviewTab({ data }: { data: NetworkMetrics }) {
  const healthComponents = data.healthScore?.components;
  
  const componentLabels = [
    { key: "crossSideActivity", label: "Cross-Side Activity", icon: Share2 },
    { key: "dataDepth", label: "Data Depth", icon: Database },
    { key: "userEngagement", label: "User Engagement", icon: Users },
    { key: "viralGrowth", label: "Viral Growth", icon: TrendingUp },
  ];

  const accountTypes = [
    { key: "companies", label: "Companies", icon: Briefcase, value: data.accountCounts?.companies || 0 },
    { key: "technicians", label: "Technicians", icon: UserCheck, value: data.accountCounts?.technicians || 0 },
    { key: "groundCrew", label: "Ground Crew", icon: Users, value: data.accountCounts?.groundCrew || 0 },
    { key: "residents", label: "Residents", icon: Building2, value: data.accountCounts?.residents || 0 },
    { key: "propertyManagers", label: "Property Managers", icon: FileCheck, value: data.accountCounts?.propertyManagers || 0 },
    { key: "buildingManagers", label: "Building Managers", icon: Shield, value: data.accountCounts?.buildingManagers || 0 },
  ];

  const hasHealthScore = data.healthScore?.overall > 0;
  const hasAccountData = accountTypes.some(a => a.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Network Health Score
            </CardTitle>
            <CardDescription>
              Composite score measuring platform network strength
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasHealthScore ? (
              <div className="flex flex-col items-center">
                <HealthScoreGauge score={data.healthScore.overall} />
                <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                  {componentLabels.map(({ key, label, icon: CompIcon }) => (
                    <div key={key} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <CompIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground truncate">{label}</p>
                        <p className="text-sm font-medium">
                          {healthComponents?.[key as keyof typeof healthComponents] || 0}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <NoDataMessage message="Health score requires more platform activity" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Account Type Summary
            </CardTitle>
            <CardDescription>
              Distribution of accounts across stakeholder types
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasAccountData ? (
              <div className="space-y-3">
                {accountTypes.map(({ key, label, icon: TypeIcon, value }) => (
                  <div key={key} className="flex items-center justify-between p-2 rounded-lg hover-elevate">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{label}</span>
                    </div>
                    <Badge variant="secondary">{formatNumber(value)}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <NoDataMessage message="No account data available yet" />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Network Growth Trend</CardTitle>
          <CardDescription>Monthly growth across all account types</CardDescription>
        </CardHeader>
        <CardContent>
          {data.cohorts && data.cohorts.length > 0 ? (
            <Chart
              options={{
                chart: {
                  type: "area",
                  toolbar: { show: false },
                  zoom: { enabled: false },
                },
                dataLabels: { enabled: false },
                stroke: { curve: "smooth", width: 2 },
                fill: {
                  type: "gradient",
                  gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.4,
                    opacityTo: 0.1,
                  },
                },
                xaxis: {
                  categories: data.cohorts.map(c => c.month),
                  labels: { style: { colors: "hsl(var(--muted-foreground))" } },
                },
                yaxis: {
                  labels: { 
                    style: { colors: "hsl(var(--muted-foreground))" },
                    formatter: (val) => formatNumber(val),
                  },
                },
                colors: ["hsl(var(--primary))"],
                grid: { borderColor: "hsl(var(--border))" },
                tooltip: {
                  theme: "dark",
                  y: { formatter: (val) => formatNumber(val) + " signups" },
                },
              } as ApexOptions}
              series={[{ name: "Signups", data: data.cohorts.map(c => c.signups) }]}
              type="area"
              height={250}
            />
          ) : (
            <NoDataMessage message="Growth trend data not available yet" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CrossSideTab({ data }: { data: NetworkMetrics }) {
  const crossSide = data.crossSideMetrics;
  const searches = data.platformSearches;
  const verifications = data.vendorVerifications;

  const hasSearchData = searches && searches.total > 0;
  const hasVerificationData = verifications && verifications.total > 0;
  const hasCrossSideData = crossSide && (crossSide.techsLinkedToCompanies > 0 || crossSide.buildingsWithMultipleVendors > 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Techs Linked to Companies"
          value={crossSide?.techsLinkedToCompanies || 0}
          subtitle="Independent contractors working with companies"
          icon={Link2}
          variant={crossSide?.techsLinkedToCompanies > 0 ? "success" : "default"}
        />
        <MetricCard
          title="Companies with Linked Techs"
          value={crossSide?.companiesWithLinkedTechs || 0}
          subtitle="Companies using contractor network"
          icon={Briefcase}
          variant={crossSide?.companiesWithLinkedTechs > 0 ? "success" : "default"}
        />
        <MetricCard
          title="Multi-Vendor Buildings"
          value={crossSide?.buildingsWithMultipleVendors || 0}
          subtitle="Buildings with 2+ service providers"
          icon={Building2}
          variant={crossSide?.buildingsWithMultipleVendors > 0 ? "success" : "default"}
        />
        <MetricCard
          title="Avg Vendors/Building"
          value={(crossSide?.avgVendorsPerBuilding || 0).toFixed(1)}
          subtitle="Average service providers per building"
          icon={Layers}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Search Activity</CardTitle>
            <CardDescription>Cross-side discovery through search</CardDescription>
          </CardHeader>
          <CardContent>
            {hasSearchData ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Search to Match Rate</span>
                  <Badge variant={searches.searchToMatchRate > 0.3 ? "default" : "secondary"}>
                    {formatPercent(searches.searchToMatchRate)}
                  </Badge>
                </div>
                <Chart
                  options={{
                    chart: { type: "bar", toolbar: { show: false } },
                    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
                    dataLabels: { enabled: true },
                    xaxis: { 
                      categories: ["Contractors", "Buildings", "Technicians"],
                      labels: { style: { colors: "hsl(var(--muted-foreground))" } },
                    },
                    colors: ["hsl(var(--primary))"],
                    grid: { borderColor: "hsl(var(--border))" },
                  } as ApexOptions}
                  series={[{
                    name: "Searches",
                    data: [
                      searches.byType?.contractors || 0,
                      searches.byType?.buildings || 0,
                      searches.byType?.technicians || 0,
                    ],
                  }]}
                  type="bar"
                  height={200}
                />
              </>
            ) : (
              <NoDataMessage message="No search activity recorded yet" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Verifications</CardTitle>
            <CardDescription>Trust-building through verification</CardDescription>
          </CardHeader>
          <CardContent>
            {hasVerificationData ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Verification Rate</span>
                  <Badge variant={verifications.verificationRate > 0.5 ? "default" : "secondary"}>
                    {formatPercent(verifications.verificationRate)}
                  </Badge>
                </div>
                <Chart
                  options={{
                    chart: { type: "donut" },
                    labels: ["Verified", "Pending"],
                    colors: ["#22c55e", "#94a3b8"],
                    legend: { 
                      position: "bottom",
                      labels: { colors: "hsl(var(--foreground))" },
                    },
                    dataLabels: { enabled: true },
                    plotOptions: {
                      pie: {
                        donut: { size: "60%" },
                      },
                    },
                  } as ApexOptions}
                  series={[verifications.verified, verifications.pending]}
                  type="donut"
                  height={200}
                />
              </>
            ) : (
              <NoDataMessage message="No verification data yet" />
            )}
          </CardContent>
        </Card>
      </div>

      {!hasCrossSideData && !hasSearchData && !hasVerificationData && (
        <Card className="border-dashed">
          <CardContent className="py-12">
            <NoDataMessage message="Cross-side network effects will appear as users interact across account types" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function LockInTab({ data }: { data: NetworkMetrics }) {
  const lockIn = data.lockIn;
  const hasLockInData = lockIn && (lockIn.avgProjectsPerCompany > 0 || lockIn.avgEmployeesPerCompany > 0);

  const switchingCostMetrics = [
    { 
      label: "Avg Projects/Company", 
      value: lockIn?.avgProjectsPerCompany || 0, 
      icon: Briefcase,
      description: "Historical project data that would be lost on switch"
    },
    { 
      label: "Avg Employees/Company", 
      value: lockIn?.avgEmployeesPerCompany || 0, 
      icon: Users,
      description: "Team member profiles and permissions"
    },
    { 
      label: "Avg Buildings/Company", 
      value: lockIn?.avgBuildingsPerCompany || 0, 
      icon: Building2,
      description: "Building relationships and history"
    },
    { 
      label: "Avg Work Sessions", 
      value: lockIn?.avgWorkSessionsPerCompany || 0, 
      icon: Clock,
      description: "Time tracking and payroll records"
    },
    { 
      label: "Avg Safety Forms", 
      value: lockIn?.avgSafetyFormsPerCompany || 0, 
      icon: Shield,
      description: "Compliance documentation"
    },
    { 
      label: "Avg Certs/Technician", 
      value: (lockIn?.avgCertificationsPerTech || 0).toFixed(1), 
      icon: FileCheck,
      description: "IRATA/SPRAT certifications tracked"
    },
  ];

  const brandingMetrics = [
    { 
      label: "Companies with White Label", 
      value: lockIn?.companiesWithWhiteLabel || 0,
      icon: Target,
    },
    { 
      label: "Companies with Custom Branding", 
      value: lockIn?.companiesWithCustomBranding || 0,
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Switching Cost Metrics
          </CardTitle>
          <CardDescription>
            Data accumulation that increases switching costs over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasLockInData ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {switchingCostMetrics.map(({ label, value, icon: MetricIcon, description }) => (
                <div key={label} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <MetricIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <p className="text-2xl font-bold">{typeof value === 'number' ? formatNumber(value) : value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{description}</p>
                </div>
              ))}
            </div>
          ) : (
            <NoDataMessage message="Lock-in metrics require active company usage" />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Branding Investment</CardTitle>
            <CardDescription>Custom branding increases switching costs</CardDescription>
          </CardHeader>
          <CardContent>
            {brandingMetrics.some(m => m.value > 0) ? (
              <div className="space-y-4">
                {brandingMetrics.map(({ label, value, icon: BrandIcon }) => (
                  <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <BrandIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{label}</span>
                    </div>
                    <Badge>{formatNumber(value)}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <NoDataMessage message="No branding adoption data yet" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Depth Over Time</CardTitle>
            <CardDescription>Accumulated records per company</CardDescription>
          </CardHeader>
          <CardContent>
            {hasLockInData ? (
              <Chart
                options={{
                  chart: { type: "bar", toolbar: { show: false } },
                  plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
                  xaxis: {
                    categories: switchingCostMetrics.slice(0, 5).map(m => m.label.replace("Avg ", "")),
                    labels: { style: { colors: "hsl(var(--muted-foreground))" } },
                  },
                  colors: ["hsl(var(--primary))"],
                  grid: { borderColor: "hsl(var(--border))" },
                  dataLabels: { enabled: true },
                } as ApexOptions}
                series={[{
                  name: "Average",
                  data: switchingCostMetrics.slice(0, 5).map(m => typeof m.value === 'number' ? m.value : parseFloat(m.value as string)),
                }]}
                type="bar"
                height={250}
              />
            ) : (
              <NoDataMessage message="Data depth visualization requires more usage" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DataMoatTab({ data }: { data: NetworkMetrics }) {
  const referrals = data.referrals;
  const engagement = data.notificationEngagement;
  const lockIn = data.lockIn;

  const hasReferralData = referrals && referrals.total > 0;
  const hasEngagementData = engagement && engagement.sent > 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Referrals"
          value={referrals?.total || 0}
          subtitle={`${referrals?.successful || 0} successful`}
          icon={Share2}
          variant={referrals?.total > 0 ? "success" : "default"}
        />
        <MetricCard
          title="Viral Coefficient (K)"
          value={(referrals?.viralCoefficient || 0).toFixed(2)}
          subtitle={referrals?.viralCoefficient >= 1 ? "Viral growth!" : "Sub-viral"}
          icon={TrendingUp}
          variant={referrals?.viralCoefficient >= 1 ? "success" : referrals?.viralCoefficient >= 0.5 ? "warning" : "default"}
        />
        <MetricCard
          title="Notification Engagement"
          value={formatPercent(engagement?.engagementRate || 0)}
          subtitle={`${formatNumber(engagement?.interacted || 0)} of ${formatNumber(engagement?.sent || 0)}`}
          icon={Target}
          variant={engagement?.engagementRate > 0.3 ? "success" : "default"}
        />
        <MetricCard
          title="Referral Success Rate"
          value={formatPercent(referrals?.successRate || 0)}
          subtitle="Referrals that converted"
          icon={CheckCircle2}
          variant={referrals?.successRate > 0.2 ? "success" : "default"}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Referral Funnel</CardTitle>
            <CardDescription>From referral to conversion</CardDescription>
          </CardHeader>
          <CardContent>
            {hasReferralData ? (
              <Chart
                options={{
                  chart: { type: "bar", toolbar: { show: false } },
                  plotOptions: { 
                    bar: { 
                      horizontal: false, 
                      borderRadius: 4,
                      columnWidth: "50%",
                    } 
                  },
                  xaxis: {
                    categories: ["Total Referrals", "Successful"],
                    labels: { style: { colors: "hsl(var(--muted-foreground))" } },
                  },
                  yaxis: {
                    labels: { style: { colors: "hsl(var(--muted-foreground))" } },
                  },
                  colors: ["hsl(var(--primary))", "#22c55e"],
                  grid: { borderColor: "hsl(var(--border))" },
                  dataLabels: { enabled: true },
                } as ApexOptions}
                series={[{
                  name: "Count",
                  data: [referrals.total, referrals.successful],
                }]}
                type="bar"
                height={250}
              />
            ) : (
              <NoDataMessage message="Referral data will appear as users invite others" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Engagement</CardTitle>
            <CardDescription>User interaction with platform notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {hasEngagementData ? (
              <Chart
                options={{
                  chart: { type: "donut" },
                  labels: ["Interacted", "Ignored"],
                  colors: ["#22c55e", "#94a3b8"],
                  legend: { 
                    position: "bottom",
                    labels: { colors: "hsl(var(--foreground))" },
                  },
                  plotOptions: {
                    pie: {
                      donut: { size: "60%" },
                    },
                  },
                } as ApexOptions}
                series={[engagement.interacted, engagement.sent - engagement.interacted]}
                type="donut"
                height={250}
              />
            ) : (
              <NoDataMessage message="No notification engagement data yet" />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Unique Data Assets
          </CardTitle>
          <CardDescription>
            Platform-exclusive data that cannot be easily replicated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="text-sm font-medium mb-1">Work Session Records</p>
              <p className="text-2xl font-bold">{formatNumber(lockIn?.avgWorkSessionsPerCompany * (data.accountCounts?.companies || 1) || 0)}</p>
              <p className="text-xs text-muted-foreground">Historical time tracking data</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="text-sm font-medium mb-1">Safety Compliance Forms</p>
              <p className="text-2xl font-bold">{formatNumber(lockIn?.avgSafetyFormsPerCompany * (data.accountCounts?.companies || 1) || 0)}</p>
              <p className="text-xs text-muted-foreground">Digitized safety documentation</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="text-sm font-medium mb-1">Building Relationships</p>
              <p className="text-2xl font-bold">{formatNumber(lockIn?.avgBuildingsPerCompany * (data.accountCounts?.companies || 1) || 0)}</p>
              <p className="text-xs text-muted-foreground">Client and property connections</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InvestorTab({ data }: { data: NetworkMetrics }) {
  const cohorts = data.cohorts || [];
  const hasCohortData = cohorts.length > 0;

  const summaryMetrics = [
    {
      label: "Network Health",
      value: `${data.healthScore?.overall || 0}%`,
      status: data.healthScore?.overall >= 60 ? "healthy" : data.healthScore?.overall >= 40 ? "building" : "early",
    },
    {
      label: "Viral Coefficient",
      value: (data.referrals?.viralCoefficient || 0).toFixed(2),
      status: data.referrals?.viralCoefficient >= 1 ? "viral" : "sub-viral",
    },
    {
      label: "Cross-Side Linkage",
      value: formatNumber(data.crossSideMetrics?.techsLinkedToCompanies || 0),
      status: "active",
    },
    {
      label: "Avg MRR/Customer",
      value: formatCurrency(cohorts.length > 0 ? cohorts[cohorts.length - 1].avgMrr : 0),
      status: "tracking",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryMetrics.map(({ label, value, status }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold mt-1">{value}</p>
              <Badge variant="secondary" className="mt-2 text-xs">
                {status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cohort Retention Analysis</CardTitle>
          <CardDescription>Monthly cohort performance for investor reporting</CardDescription>
        </CardHeader>
        <CardContent>
          {hasCohortData ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Cohort</th>
                    <th className="text-right py-3 px-2">Signups</th>
                    <th className="text-right py-3 px-2">Retained</th>
                    <th className="text-right py-3 px-2">Retention</th>
                    <th className="text-right py-3 px-2">Avg MRR</th>
                  </tr>
                </thead>
                <tbody>
                  {cohorts.map((cohort, i) => (
                    <tr key={i} className="border-b last:border-0 hover-elevate">
                      <td className="py-3 px-2 font-medium">{cohort.month}</td>
                      <td className="text-right py-3 px-2">{formatNumber(cohort.signups)}</td>
                      <td className="text-right py-3 px-2">{formatNumber(cohort.retained)}</td>
                      <td className="text-right py-3 px-2">
                        <Badge variant={cohort.retentionRate >= 0.8 ? "default" : "secondary"}>
                          {formatPercent(cohort.retentionRate)}
                        </Badge>
                      </td>
                      <td className="text-right py-3 px-2">{formatCurrency(cohort.avgMrr)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <NoDataMessage message="Cohort data will populate as companies subscribe over time" />
          )}
        </CardContent>
      </Card>

      {hasCohortData && (
        <Card>
          <CardHeader>
            <CardTitle>Retention Trend</CardTitle>
            <CardDescription>Monthly retention rates by cohort</CardDescription>
          </CardHeader>
          <CardContent>
            <Chart
              options={{
                chart: {
                  type: "line",
                  toolbar: { show: false },
                  zoom: { enabled: false },
                },
                stroke: { curve: "smooth", width: 3 },
                xaxis: {
                  categories: cohorts.map(c => c.month),
                  labels: { style: { colors: "hsl(var(--muted-foreground))" } },
                },
                yaxis: {
                  min: 0,
                  max: 100,
                  labels: { 
                    style: { colors: "hsl(var(--muted-foreground))" },
                    formatter: (val) => `${val}%`,
                  },
                },
                colors: ["#22c55e"],
                grid: { borderColor: "hsl(var(--border))" },
                markers: { size: 4 },
                tooltip: {
                  theme: "dark",
                  y: { formatter: (val) => `${val.toFixed(1)}%` },
                },
              } as ApexOptions}
              series={[{
                name: "Retention Rate",
                data: cohorts.map(c => Math.round(c.retentionRate * 100)),
              }]}
              type="line"
              height={300}
            />
          </CardContent>
        </Card>
      )}

      <Card className="border-dashed">
        <CardContent className="py-8">
          <div className="text-center">
            <BarChart3 className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-1">Investor-Ready Metrics</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              This dashboard provides the key network effects and lock-in metrics that demonstrate 
              platform value to investors. Export functionality coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuperUserNetwork() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");

  const { data, isLoading, error } = useQuery<NetworkMetrics>({
    queryKey: ["/api/superuser/network-effects"],
  });

  if (error) {
    return (
      <SuperUserLayout>
        <div className="p-6">
          <Card className="border-destructive">
            <CardContent className="py-12">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                <h3 className="font-semibold mb-2">Failed to Load Network Effects Data</h3>
                <p className="text-sm text-muted-foreground">
                  {(error as Error)?.message || "An error occurred while fetching data."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SuperUserLayout>
    );
  }

  return (
    <SuperUserLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Network className="h-6 w-6" />
            Network Effects & Lock-in Metrics
          </h1>
          <p className="text-muted-foreground">
            Measure platform network strength, cross-side effects, and account lock-in for investor reporting.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" data-testid="tab-network-overview">
              Overview
            </TabsTrigger>
            <TabsTrigger value="cross-side" data-testid="tab-network-cross-side">
              Cross-Side Effects
            </TabsTrigger>
            <TabsTrigger value="lock-in" data-testid="tab-network-lock-in">
              Account Lock-in
            </TabsTrigger>
            <TabsTrigger value="data-moat" data-testid="tab-network-data-moat">
              Data Moat
            </TabsTrigger>
            <TabsTrigger value="investor" data-testid="tab-network-investor">
              Investor View
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-8 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardContent className="pt-6">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              <TabsContent value="overview">
                <OverviewTab data={data as NetworkMetrics} />
              </TabsContent>
              <TabsContent value="cross-side">
                <CrossSideTab data={data as NetworkMetrics} />
              </TabsContent>
              <TabsContent value="lock-in">
                <LockInTab data={data as NetworkMetrics} />
              </TabsContent>
              <TabsContent value="data-moat">
                <DataMoatTab data={data as NetworkMetrics} />
              </TabsContent>
              <TabsContent value="investor">
                <InvestorTab data={data as NetworkMetrics} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </SuperUserLayout>
  );
}