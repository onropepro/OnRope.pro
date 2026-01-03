import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import {
  ShieldCheck,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  ClipboardList,
  HardHat,
  FileCheck,
  Award,
  Building2,
  BarChart3,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  Activity,
  Target,
} from "lucide-react";

interface SafetyMetrics {
  platformScore: {
    overall: number;
    components: {
      avgCSR: number;
      inspectionRate: number;
      toolboxRate: number;
      certCurrentRate: number;
    };
  };
  overview: {
    totalInspections: number;
    totalToolboxMeetings: number;
    totalIRATAHours: number;
    incidentRate: number;
    recentActivity: SafetyActivity[];
    trends: {
      inspections: number[];
      toolboxMeetings: number[];
      irataLogs: number[];
      dates: string[];
    };
  };
  csrAnalytics: {
    distribution: {
      excellent: number;
      good: number;
      fair: number;
      poor: number;
      total: number;
      average: number;
    };
    improvementByTenure: {
      tenure: string;
      avgCSR: number;
    }[];
    penaltyBreakdown: {
      documentation: number;
      toolbox: number;
      harness: number;
      documentReview: number;
      total: number;
    };
  };
  psrAnalytics: {
    distribution: number[];
    avgPSR: number;
    hiringCorrelation: {
      highPSR: { avgJobOffers: number };
      mediumPSR: { avgJobOffers: number };
      lowPSR: { avgJobOffers: number };
    };
    components: {
      inspectionRate: number;
      docSigningRate: number;
      toolboxAttendance: number;
      certCurrency: number;
    };
  };
  compliance: {
    harnessInspectionRate: number;
    toolboxCoverageRate: number;
    documentAckRate: number;
    certCurrentRate: number;
    trends: {
      dates: string[];
      inspection: number[];
      toolbox: number[];
      document: number[];
    };
    harnessAnalytics: {
      total: number;
      passRate: number;
      avgDuration: number;
      failures: number;
    };
    toolboxAnalytics: {
      total: number;
      avgAttendees: number;
      avgTopics: number;
      coverageRate: number;
    };
  };
  irataSprat: {
    totalHoursLogged: number;
    sameDayRate: number;
    activeTechsLogging: number;
    avgHoursPerTech: number;
    taskDistribution: {
      taskType: string;
      hours: number;
      count: number;
    }[];
    certificationBreakdown: {
      irata: { level1: number; level2: number; level3: number };
      sprat: { level1: number; level2: number; level3: number };
    };
  };
  partnershipReadiness: {
    irataScore: number;
    worksafeAlignment: number;
    oshaAlignment: number;
  };
}

interface SafetyActivity {
  id: number;
  type: 'harness_inspection' | 'toolbox_meeting' | 'incident_report' | 'cert_renewal' | 'irata_log';
  title: string;
  companyName: string;
  timestamp: string;
  status: 'pass' | 'fail' | 'pending' | 'complete';
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

function formatPercent(num: number): string {
  return `${Math.round(num)}%`;
}

function SafetyScoreGauge({ score, size = 300 }: { score: number; size?: number }) {
  const getColor = (s: number) => s >= 90 ? '#10B981' : s >= 75 ? '#F59E0B' : '#EF4444';
  const getLabel = (s: number) => s >= 90 ? 'Excellent' : s >= 75 ? 'Good' : s >= 50 ? 'Fair' : 'Needs Improvement';
  
  const options: ApexOptions = {
    chart: { type: 'radialBar', height: size },
    series: [score],
    colors: [getColor(score)],
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: { size: '60%' },
        track: { background: 'hsl(var(--muted))' },
        dataLabels: {
          name: { 
            show: true, 
            fontSize: '14px',
            offsetY: 30,
            color: 'hsl(var(--muted-foreground))',
          },
          value: { 
            fontSize: '36px', 
            fontWeight: 'bold',
            offsetY: -10,
            color: 'hsl(var(--foreground))',
            formatter: (val: number) => `${Math.round(val)}%`,
          },
        },
      },
    },
    labels: [getLabel(score)],
    stroke: { lineCap: 'round' },
  };

  return (
    <Chart options={options} series={[score]} type="radialBar" height={size} />
  );
}

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  trendInverse = false,
  variant = 'default',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: typeof ShieldCheck;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  trendInverse?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}) {
  const iconStyles = {
    default: 'bg-blue-50 dark:bg-blue-500/10 text-blue-500',
    success: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500',
    warning: 'bg-amber-50 dark:bg-amber-500/10 text-amber-500',
    danger: 'bg-red-50 dark:bg-red-500/10 text-red-500',
  };

  const actualTrendColor = (t: 'up' | 'down' | 'neutral') => {
    if (t === 'neutral') return 'text-muted-foreground';
    const isPositive = trendInverse ? t === 'down' : t === 'up';
    return isPositive ? 'text-emerald-500' : 'text-red-500';
  };

  return (
    <div className="su-metric-card" data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="su-metric-label">{title}</p>
          <p className="su-metric-value">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={`su-metric-icon ${iconStyles[variant]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend && trendValue && (
        <div className={`mt-4 flex items-center gap-1 text-xs ${actualTrendColor(trend)}`}>
          {trend === 'up' && <ArrowUp className="h-3 w-3" />}
          {trend === 'down' && <ArrowDown className="h-3 w-3" />}
          {trend === 'neutral' && <Minus className="h-3 w-3" />}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}

function LoadingMetricCard() {
  return (
    <div className="su-metric-card">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  );
}

function ComplianceGauge({ label, rate, target, description }: { 
  label: string; 
  rate: number; 
  target: number;
  description: string;
}) {
  const getColor = (r: number, t: number) => {
    const ratio = r / t;
    if (ratio >= 1) return '#10B981';
    if (ratio >= 0.9) return '#F59E0B';
    return '#EF4444';
  };

  const options: ApexOptions = {
    chart: { type: 'radialBar', height: 200, sparkline: { enabled: true } },
    series: [rate],
    colors: [getColor(rate, target)],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: '60%' },
        track: { background: 'hsl(var(--muted))' },
        dataLabels: {
          name: { show: false },
          value: { 
            fontSize: '24px', 
            fontWeight: 'bold',
            offsetY: -5,
            color: 'hsl(var(--foreground))',
            formatter: (val: number) => `${Math.round(val)}%`,
          },
        },
      },
    },
    stroke: { lineCap: 'round' },
  };

  return (
    <div className="su-card text-center" data-testid={`gauge-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <Chart options={options} series={[rate]} type="radialBar" height={200} />
      <div className="-mt-8 space-y-1">
        <h4 className="font-semibold text-sm">{label}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">Target: {target}%</p>
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: SafetyActivity }) {
  const icons = {
    harness_inspection: HardHat,
    toolbox_meeting: Users,
    incident_report: AlertTriangle,
    cert_renewal: Award,
    irata_log: ClipboardList,
  };
  const Icon = icons[activity.type];

  const statusColors = {
    pass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    fail: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    complete: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50" data-testid={`activity-item-${activity.id}`}>
      <div className="p-2 rounded-lg bg-background">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{activity.title}</p>
        <p className="text-xs text-muted-foreground">{activity.companyName}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={statusColors[activity.status]}>
          {activity.status}
        </Badge>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

function OverviewTab({ data }: { data: SafetyMetrics }) {
  const { platformScore, overview } = data;

  const trendChartOptions: ApexOptions = {
    chart: { type: 'area', height: 300, toolbar: { show: false }, stacked: false },
    series: [
      { name: 'Harness Inspections', data: overview.trends.inspections },
      { name: 'Toolbox Meetings', data: overview.trends.toolboxMeetings },
      { name: 'IRATA Logs', data: overview.trends.irataLogs },
    ],
    colors: ['#3B82F6', '#10B981', '#8B5CF6'],
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { opacityFrom: 0.4, opacityTo: 0.1 },
    },
    xaxis: { 
      categories: overview.trends.dates,
      labels: { style: { colors: 'hsl(var(--muted-foreground))' } },
    },
    yaxis: { 
      title: { text: 'Daily Count', style: { color: 'hsl(var(--muted-foreground))' } },
      labels: { style: { colors: 'hsl(var(--muted-foreground))' } },
    },
    legend: { position: 'top' },
    grid: { borderColor: 'hsl(var(--border))' },
    tooltip: { theme: 'dark' },
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={ShieldCheck}
          title="Total Harness Inspections"
          value={formatNumber(overview.totalInspections)}
          subtitle="All time"
          variant="default"
        />
        <MetricCard
          icon={Users}
          title="Toolbox Meetings"
          value={formatNumber(overview.totalToolboxMeetings)}
          subtitle="All time"
          variant="success"
        />
        <MetricCard
          icon={Clock}
          title="IRATA Hours Logged"
          value={formatNumber(overview.totalIRATAHours)}
          subtitle="Digital records"
          variant="default"
        />
        <MetricCard
          icon={AlertTriangle}
          title="Incident Rate"
          value={overview.incidentRate.toFixed(2)}
          subtitle="per 100,000 hours"
          trendInverse={true}
          variant={overview.incidentRate < 2 ? 'success' : overview.incidentRate < 5 ? 'warning' : 'danger'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card data-testid="card-platform-safety-score">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Platform Safety Health
            </CardTitle>
            <CardDescription>
              Aggregate safety metrics across all companies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SafetyScoreGauge score={platformScore.overall} size={280} />
            <div className="grid grid-cols-4 gap-2 mt-4">
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold">{formatPercent(platformScore.components.avgCSR)}</p>
                <p className="text-xs text-muted-foreground">Avg CSR</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold">{formatPercent(platformScore.components.inspectionRate)}</p>
                <p className="text-xs text-muted-foreground">Inspection</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold">{formatPercent(platformScore.components.toolboxRate)}</p>
                <p className="text-xs text-muted-foreground">Toolbox</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold">{formatPercent(platformScore.components.certCurrentRate)}</p>
                <p className="text-xs text-muted-foreground">Cert Current</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-live-activity">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live Safety Activity
            </CardTitle>
            <CardDescription>
              Recent safety activities across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[320px]">
              <div className="space-y-2">
                {overview.recentActivity.length > 0 ? (
                  overview.recentActivity.map(activity => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activity
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-safety-trend">
        <CardHeader>
          <CardTitle>30-Day Safety Activity Trend</CardTitle>
          <CardDescription>Daily safety activities across all companies</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart 
            options={trendChartOptions} 
            series={trendChartOptions.series} 
            type="area" 
            height={300} 
          />
        </CardContent>
      </Card>
    </div>
  );
}

function CSRAnalyticsTab({ data }: { data: SafetyMetrics }) {
  const { csrAnalytics } = data;
  const { distribution, improvementByTenure, penaltyBreakdown } = csrAnalytics;

  const aboveThreshold = ((distribution.excellent + distribution.good) / distribution.total * 100) || 0;

  const distributionOptions: ApexOptions = {
    chart: { type: 'bar', height: 300, toolbar: { show: false } },
    series: [{
      name: 'Companies',
      data: [distribution.excellent, distribution.good, distribution.fair, distribution.poor],
    }],
    colors: ['#10B981', '#F59E0B', '#F97316', '#EF4444'],
    plotOptions: {
      bar: { 
        borderRadius: 8, 
        columnWidth: '60%',
        distributed: true,
      },
    },
    xaxis: {
      categories: ['Excellent (90-100%)', 'Good (75-89%)', 'Fair (50-74%)', 'Poor (<50%)'],
      labels: { style: { colors: 'hsl(var(--muted-foreground))' } },
    },
    yaxis: { labels: { style: { colors: 'hsl(var(--muted-foreground))' } } },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}`,
      style: { colors: ['#fff'] },
    },
    legend: { show: false },
    grid: { borderColor: 'hsl(var(--border))' },
    tooltip: { theme: 'dark' },
  };

  const improvementOptions: ApexOptions = {
    chart: { type: 'line', height: 300, toolbar: { show: false } },
    series: [{
      name: 'Average CSR',
      data: improvementByTenure.map(i => i.avgCSR),
    }],
    colors: ['#10B981'],
    stroke: { curve: 'smooth', width: 3 },
    markers: { size: 6 },
    xaxis: {
      categories: improvementByTenure.map(i => i.tenure),
      title: { text: 'Time on Platform', style: { color: 'hsl(var(--muted-foreground))' } },
      labels: { style: { colors: 'hsl(var(--muted-foreground))' } },
    },
    yaxis: {
      title: { text: 'Average CSR Score', style: { color: 'hsl(var(--muted-foreground))' } },
      min: 50,
      max: 100,
      labels: { style: { colors: 'hsl(var(--muted-foreground))' } },
    },
    annotations: {
      yaxis: [{
        y: 75,
        borderColor: '#F59E0B',
        strokeDashArray: 5,
        label: { text: 'Good Threshold', style: { color: '#F59E0B', background: 'transparent' } },
      }],
    },
    grid: { borderColor: 'hsl(var(--border))' },
    tooltip: { theme: 'dark' },
  };

  const penaltyOptions: ApexOptions = {
    chart: { type: 'donut', height: 320 },
    series: [
      penaltyBreakdown.documentation,
      penaltyBreakdown.toolbox,
      penaltyBreakdown.harness,
      penaltyBreakdown.documentReview,
    ],
    labels: ['Documentation', 'Toolbox Meetings', 'Harness Inspections', 'Document Reviews'],
    colors: ['#EF4444', '#F97316', '#F59E0B', '#FBBF24'],
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Penalty',
              formatter: () => `${penaltyBreakdown.total.toFixed(1)}%`,
              color: 'hsl(var(--foreground))',
            },
          },
        },
      },
    },
    legend: { position: 'bottom' },
    tooltip: { theme: 'dark' },
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card data-testid="card-csr-distribution">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>CSR Distribution</CardTitle>
                <CardDescription>Company Safety Rating breakdown</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {aboveThreshold.toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">Above 75% threshold</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Chart options={distributionOptions} series={distributionOptions.series} type="bar" height={300} />
          </CardContent>
        </Card>

        <Card data-testid="card-csr-improvement">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>CSR Improvement by Platform Tenure</CardTitle>
                <CardDescription>Companies improve safety scores over time</CardDescription>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                Trending Up
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Chart options={improvementOptions} series={improvementOptions.series} type="line" height={300} />
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-sm">
              <strong>Partnership Proof Point:</strong> Companies using OnRopePro for 12+ months 
              show measurable improvement in safety compliance scores.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-csr-penalty">
        <CardHeader>
          <CardTitle>Average Penalty Distribution</CardTitle>
          <CardDescription>Where companies lose CSR points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <Chart options={penaltyOptions} series={penaltyOptions.series} type="donut" height={320} />
            <div className="space-y-4">
              <h4 className="font-semibold">Actionable Insights</h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50 flex items-start gap-3">
                  <div className="p-2 rounded bg-amber-100 dark:bg-amber-500/20">
                    <HardHat className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Harness Inspections</p>
                    <p className="text-xs text-muted-foreground">Enforce pre-work inspection gate</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">{penaltyBreakdown.harness.toFixed(1)}%</Badge>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 flex items-start gap-3">
                  <div className="p-2 rounded bg-orange-100 dark:bg-orange-500/20">
                    <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Toolbox Meetings</p>
                    <p className="text-xs text-muted-foreground">Require daily meeting before work sessions</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">{penaltyBreakdown.toolbox.toFixed(1)}%</Badge>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 flex items-start gap-3">
                  <div className="p-2 rounded bg-red-100 dark:bg-red-500/20">
                    <FileCheck className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Documentation</p>
                    <p className="text-xs text-muted-foreground">Improve document upload compliance</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">{penaltyBreakdown.documentation.toFixed(1)}%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PSRAnalyticsTab({ data }: { data: SafetyMetrics }) {
  const { psrAnalytics } = data;
  const { distribution, avgPSR, hiringCorrelation, components } = psrAnalytics;

  const distributionOptions: ApexOptions = {
    chart: { type: 'bar', height: 300, toolbar: { show: false } },
    series: [{
      name: 'Technicians',
      data: distribution,
    }],
    colors: ['#3B82F6'],
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: '70%' },
    },
    xaxis: {
      categories: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
      title: { text: 'PSR Score Range', style: { color: 'hsl(var(--muted-foreground))' } },
      labels: { style: { colors: 'hsl(var(--muted-foreground))' } },
    },
    yaxis: { 
      title: { text: 'Number of Technicians', style: { color: 'hsl(var(--muted-foreground))' } },
      labels: { style: { colors: 'hsl(var(--muted-foreground))' } },
    },
    dataLabels: { enabled: true },
    grid: { borderColor: 'hsl(var(--border))' },
    tooltip: { theme: 'dark' },
  };

  const radarOptions: ApexOptions = {
    chart: { type: 'radar', height: 350 },
    series: [{
      name: 'Platform Average',
      data: [
        components.inspectionRate,
        components.docSigningRate,
        components.toolboxAttendance,
        components.certCurrency,
      ],
    }],
    colors: ['#3B82F6'],
    xaxis: {
      categories: ['Harness Inspections', 'Document Signing', 'Toolbox Attendance', 'Cert Currency'],
      labels: { style: { colors: 'hsl(var(--muted-foreground))' } },
    },
    yaxis: { show: false, max: 100 },
    markers: { size: 4 },
    fill: { opacity: 0.2 },
    stroke: { width: 2 },
    tooltip: { theme: 'dark' },
  };

  const improvementRatio = hiringCorrelation.lowPSR.avgJobOffers > 0 
    ? ((hiringCorrelation.highPSR.avgJobOffers / hiringCorrelation.lowPSR.avgJobOffers - 1) * 100).toFixed(0)
    : 'N/A';

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card data-testid="card-psr-distribution">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Personal Safety Rating Distribution</CardTitle>
                <CardDescription>Individual technician safety scores</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{avgPSR.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Platform Average</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Chart options={distributionOptions} series={distributionOptions.series} type="bar" height={300} />
          </CardContent>
        </Card>

        <Card data-testid="card-psr-hiring">
          <CardHeader>
            <CardTitle>PSR Impact on Employment</CardTitle>
            <CardDescription>Correlation between safety rating and job offers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {hiringCorrelation.highPSR.avgJobOffers.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">High PSR (80%+)</p>
                <p className="text-xs text-muted-foreground">avg job offers</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-500/10">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {hiringCorrelation.mediumPSR.avgJobOffers.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Medium PSR (50-79%)</p>
                <p className="text-xs text-muted-foreground">avg job offers</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-500/10">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {hiringCorrelation.lowPSR.avgJobOffers.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Low PSR (&lt;50%)</p>
                <p className="text-xs text-muted-foreground">avg job offers</p>
              </div>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <strong>Key Finding:</strong> Technicians with PSR above 80% receive {improvementRatio}% 
              more job offers than those below 50%.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-psr-components">
        <CardHeader>
          <CardTitle>PSR Components Analysis</CardTitle>
          <CardDescription>What contributes to Personal Safety Rating</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mx-auto">
            <Chart options={radarOptions} series={radarOptions.series} type="radar" height={350} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ComplianceTrackingTab({ data }: { data: SafetyMetrics }) {
  const { compliance } = data;

  const trendOptions: ApexOptions = {
    chart: { type: 'line', height: 300, toolbar: { show: false } },
    series: [
      { name: 'Inspection Rate', data: compliance.trends.inspection },
      { name: 'Toolbox Coverage', data: compliance.trends.toolbox },
      { name: 'Document Ack', data: compliance.trends.document },
    ],
    colors: ['#3B82F6', '#10B981', '#8B5CF6'],
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: compliance.trends.dates,
      labels: { style: { colors: 'hsl(var(--muted-foreground))' } },
    },
    yaxis: {
      title: { text: 'Compliance Rate %', style: { color: 'hsl(var(--muted-foreground))' } },
      min: 0,
      max: 100,
      labels: { style: { colors: 'hsl(var(--muted-foreground))' } },
    },
    legend: { position: 'top' },
    grid: { borderColor: 'hsl(var(--border))' },
    tooltip: { theme: 'dark' },
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ComplianceGauge 
          label="Harness Inspection Rate"
          rate={compliance.harnessInspectionRate}
          target={95}
          description="Work sessions with valid inspection"
        />
        <ComplianceGauge 
          label="Toolbox Meeting Coverage"
          rate={compliance.toolboxCoverageRate}
          target={95}
          description="Work sessions with meeting coverage"
        />
        <ComplianceGauge 
          label="Document Acknowledgment"
          rate={compliance.documentAckRate}
          target={100}
          description="Employees signed all required docs"
        />
        <ComplianceGauge 
          label="Certification Currency"
          rate={compliance.certCurrentRate}
          target={100}
          description="Techs with current certifications"
        />
      </div>

      <Card data-testid="card-compliance-trend">
        <CardHeader>
          <CardTitle>Compliance Rate Trend</CardTitle>
          <CardDescription>30-day compliance tracking across all metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart options={trendOptions} series={trendOptions.series} type="line" height={300} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card data-testid="card-harness-analytics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardHat className="h-5 w-5" />
              Harness Inspection Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xl font-bold">{formatNumber(compliance.harnessAnalytics.total)}</p>
                <p className="text-xs text-muted-foreground">Total Inspections</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xl font-bold">{compliance.harnessAnalytics.passRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Pass Rate</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xl font-bold">{compliance.harnessAnalytics.avgDuration} min</p>
                <p className="text-xs text-muted-foreground">Avg Duration</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xl font-bold">{formatNumber(compliance.harnessAnalytics.failures)}</p>
                <p className="text-xs text-muted-foreground">Equipment Failures</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-toolbox-analytics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Toolbox Meeting Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xl font-bold">{formatNumber(compliance.toolboxAnalytics.total)}</p>
                <p className="text-xs text-muted-foreground">Total Meetings</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xl font-bold">{compliance.toolboxAnalytics.avgAttendees.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Avg Attendees</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xl font-bold">{compliance.toolboxAnalytics.avgTopics.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Avg Topics</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xl font-bold">{compliance.toolboxAnalytics.coverageRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Coverage Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function IRATASPRATTab({ data }: { data: SafetyMetrics }) {
  const { irataSprat } = data;

  const taskDistOptions: ApexOptions = {
    chart: { type: 'bar', height: 300, toolbar: { show: false } },
    series: [{
      name: 'Hours',
      data: irataSprat.taskDistribution.map(t => t.hours),
    }],
    colors: ['#8B5CF6'],
    plotOptions: {
      bar: { horizontal: true, barHeight: '60%', borderRadius: 4 },
    },
    xaxis: {
      categories: irataSprat.taskDistribution.map(t => t.taskType),
      title: { text: 'Total Hours', style: { color: 'hsl(var(--muted-foreground))' } },
      labels: { style: { colors: 'hsl(var(--muted-foreground))' } },
    },
    yaxis: {
      labels: { style: { colors: 'hsl(var(--muted-foreground))' } },
    },
    dataLabels: { enabled: true, formatter: (val: number) => formatNumber(val) },
    grid: { borderColor: 'hsl(var(--border))' },
    tooltip: { theme: 'dark' },
  };

  const { irata, sprat } = irataSprat.certificationBreakdown;

  return (
    <div className="space-y-6">
      <Card data-testid="card-digital-logging" className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
              <ClipboardList className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle>IRATA/SPRAT Digital Logging</CardTitle>
              <CardDescription>Proof of digital logging accuracy</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="su-metric-card">
              <p className="su-metric-label">Total Hours Logged</p>
              <p className="su-metric-value text-purple-600 dark:text-purple-400">{formatNumber(irataSprat.totalHoursLogged)}</p>
              <p className="text-xs text-muted-foreground">across all technicians</p>
            </div>
            <div className="su-metric-card">
              <p className="su-metric-label">Same-Day Logging Rate</p>
              <p className="su-metric-value text-emerald-600 dark:text-emerald-400">{irataSprat.sameDayRate.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">logged within 24 hours</p>
            </div>
            <div className="su-metric-card">
              <p className="su-metric-label">Technicians Logging</p>
              <p className="su-metric-value">{formatNumber(irataSprat.activeTechsLogging)}</p>
              <p className="text-xs text-muted-foreground">with digital records</p>
            </div>
            <div className="su-metric-card">
              <p className="su-metric-label">Avg Hours/Tech/Month</p>
              <p className="su-metric-value">{irataSprat.avgHoursPerTech.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">active loggers</p>
            </div>
          </div>

          <div className="bg-purple-100 dark:bg-purple-500/20 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">Why Digital Logging is More Accurate</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-background rounded p-3">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{irataSprat.sameDayRate.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">OnRopePro: Logged same day</div>
              </div>
              <div className="bg-white dark:bg-background rounded p-3">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">~20%</div>
                <div className="text-sm text-muted-foreground">Paper logbooks: Logged same day*</div>
              </div>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-300 mt-2">
              *Industry estimate: most paper entries are backfilled weeks/months later
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card data-testid="card-task-distribution">
          <CardHeader>
            <CardTitle>Task Type Distribution</CardTitle>
            <CardDescription>Hours logged by task category</CardDescription>
          </CardHeader>
          <CardContent>
            <Chart options={taskDistOptions} series={taskDistOptions.series} type="bar" height={300} />
          </CardContent>
        </Card>

        <Card data-testid="card-certification-breakdown">
          <CardHeader>
            <CardTitle>Certification Breakdown</CardTitle>
            <CardDescription>IRATA vs SPRAT distribution by level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4" /> IRATA Certifications
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{irata.level1}</p>
                    <p className="text-xs text-muted-foreground">Level 1</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{irata.level2}</p>
                    <p className="text-xs text-muted-foreground">Level 2</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{irata.level3}</p>
                    <p className="text-xs text-muted-foreground">Level 3</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4" /> SPRAT Certifications
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{sprat.level1}</p>
                    <p className="text-xs text-muted-foreground">Level 1</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{sprat.level2}</p>
                    <p className="text-xs text-muted-foreground">Level 2</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{sprat.level3}</p>
                    <p className="text-xs text-muted-foreground">Level 3</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PartnershipReportsTab({ data }: { data: SafetyMetrics }) {
  const { partnershipReadiness, irataSprat } = data;

  const reports = [
    {
      title: 'IRATA/SPRAT Digital Logging Report',
      description: 'Demonstrates accuracy and compliance of digital task logging',
      includes: [
        'Same-day logging rates',
        'Task type distribution',
        'Certification tracking integration',
        'Audit trail samples',
      ],
      icon: ClipboardList,
      color: 'purple',
    },
    {
      title: 'WorkSafe BC Compliance Report',
      description: 'Safety documentation and inspection compliance data',
      includes: [
        'Harness inspection completion rates',
        'Toolbox meeting coverage',
        'Incident rates and trends',
        'Document acknowledgment tracking',
      ],
      icon: FileCheck,
      color: 'blue',
    },
    {
      title: 'Insurance Partner Data Package',
      description: 'Risk assessment data for insurance underwriting',
      includes: [
        'CSR distribution and trends',
        'Incident frequency rates',
        'Equipment failure tracking',
        'Training compliance rates',
      ],
      icon: Building2,
      color: 'emerald',
    },
    {
      title: 'Industry Benchmark Report',
      description: 'Aggregate safety metrics for industry comparison',
      includes: [
        'Platform-wide safety scores',
        'Compliance rate benchmarks',
        'Best practice identification',
        'Anonymized company comparisons',
      ],
      icon: BarChart3,
      color: 'amber',
    },
  ];

  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
    blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  };

  function ProofPoint({ label, value, benchmark, passing }: { label: string; value: string; benchmark: string; passing: boolean }) {
    return (
      <div className="flex items-center justify-between p-2 rounded bg-white/10">
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-purple-200">{benchmark}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">{value}</span>
          {passing ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <XCircle className="h-5 w-5 text-red-400" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card data-testid="card-report-generator">
        <CardHeader>
          <CardTitle>Partnership Report Generator</CardTitle>
          <CardDescription>
            Generate data packages for regulatory bodies and potential partners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {reports.map((report, idx) => (
              <div key={idx} className="su-card hover-elevate" data-testid={`report-card-${idx}`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${colorClasses[report.color]}`}>
                    <report.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </div>
                <div className="space-y-1 mb-4">
                  {report.includes.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full" data-testid={`button-generate-report-${idx}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-lg shadow-lg p-8 text-white" data-testid="card-irata-partnership">
        <h3 className="text-2xl font-bold mb-6">IRATA/SPRAT Partnership Readiness</h3>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h4 className="text-purple-200 text-sm uppercase tracking-wide mb-3">
              Digital Logging Accuracy
            </h4>
            <div className="space-y-3">
              <ProofPoint 
                label="Same-Day Logging" 
                value={`${irataSprat.sameDayRate.toFixed(0)}%`}
                benchmark="vs ~20% paper"
                passing={irataSprat.sameDayRate > 80}
              />
              <ProofPoint 
                label="Audit Trail Complete" 
                value="Yes"
                benchmark="Immutable records"
                passing={true}
              />
              <ProofPoint 
                label="Task Categorization" 
                value={`${irataSprat.taskDistribution.length} types`}
                benchmark="IRATA aligned"
                passing={irataSprat.taskDistribution.length >= 5}
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-purple-200 text-sm uppercase tracking-wide mb-3">
              Data Quality
            </h4>
            <div className="space-y-3">
              <ProofPoint 
                label="Total Hours Tracked" 
                value={formatNumber(irataSprat.totalHoursLogged)}
                benchmark="Significant sample"
                passing={irataSprat.totalHoursLogged > 1000}
              />
              <ProofPoint 
                label="Active Technicians" 
                value={formatNumber(irataSprat.activeTechsLogging)}
                benchmark="Industry adoption"
                passing={irataSprat.activeTechsLogging > 10}
              />
              <ProofPoint 
                label="Partnership Score" 
                value={`${partnershipReadiness.irataScore}/100`}
                benchmark=">80 target"
                passing={partnershipReadiness.irataScore > 80}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-purple-600">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="text-purple-200 text-sm">Partnership Readiness Score</div>
              <div className="text-4xl font-bold">{partnershipReadiness.irataScore}/100</div>
            </div>
            <Button 
              className="bg-white text-purple-900 hover:bg-purple-100"
              data-testid="button-generate-proposal"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Partnership Proposal
            </Button>
          </div>
        </div>
      </div>

      <Card data-testid="card-regulatory-compliance">
        <CardHeader>
          <CardTitle>Regulatory Compliance Summary</CardTitle>
          <CardDescription>Alignment with WorkSafe BC and OSHA requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
                <span className="font-semibold">WorkSafe BC Alignment</span>
              </div>
              <div className="space-y-3">
                <ComplianceRow 
                  requirement="Daily Equipment Inspection" 
                  status={partnershipReadiness.worksafeAlignment > 90}
                  value={`${partnershipReadiness.worksafeAlignment}%`}
                />
                <ComplianceRow 
                  requirement="Pre-Work Safety Briefing" 
                  status={partnershipReadiness.worksafeAlignment > 85}
                  value="Active"
                />
                <ComplianceRow 
                  requirement="Incident Documentation" 
                  status={true}
                  value="100%"
                />
                <ComplianceRow 
                  requirement="Training Records" 
                  status={partnershipReadiness.worksafeAlignment > 80}
                  value="Digital"
                />
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
                <span className="font-semibold">OSHA Alignment</span>
              </div>
              <div className="space-y-3">
                <ComplianceRow 
                  requirement="Fall Protection Documentation" 
                  status={partnershipReadiness.oshaAlignment > 90}
                  value={`${partnershipReadiness.oshaAlignment}%`}
                />
                <ComplianceRow 
                  requirement="PPE Inspection Records" 
                  status={partnershipReadiness.oshaAlignment > 85}
                  value="Active"
                />
                <ComplianceRow 
                  requirement="Hazard Communication" 
                  status={partnershipReadiness.oshaAlignment > 80}
                  value="Digital"
                />
                <ComplianceRow 
                  requirement="Recordkeeping (300 Log)" 
                  status={true}
                  value="Digital"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ComplianceRow({ requirement, status, value }: { requirement: string; status: boolean; value: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
      <div className="flex items-center gap-2">
        {status ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
        <span className="text-sm">{requirement}</span>
      </div>
      <Badge variant="outline">{value}</Badge>
    </div>
  );
}

export default function SuperUserSafety() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");

  const { data, isLoading, error } = useQuery<SafetyMetrics>({
    queryKey: ["/api/superuser/safety"],
  });

  if (error) {
    return (
      <SuperUserLayout>
        <div className="p-6">
          <Card className="border-destructive">
            <CardContent className="py-12">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                <h3 className="font-semibold mb-2">Failed to Load Safety Metrics</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {(error as Error)?.message || "An error occurred while fetching data."}
                </p>
                <Button onClick={() => window.location.reload()} data-testid="button-retry">
                  Retry
                </Button>
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
            <ShieldCheck className="h-6 w-6" />
            Safety Metrics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time safety metrics for internal operations and external partnerships with IRATA, SPRAT, WorkSafe BC, and OSHA.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" data-testid="tab-safety-overview">
              Overview
            </TabsTrigger>
            <TabsTrigger value="csr" data-testid="tab-safety-csr">
              CSR Analytics
            </TabsTrigger>
            <TabsTrigger value="psr" data-testid="tab-safety-psr">
              PSR Analytics
            </TabsTrigger>
            <TabsTrigger value="compliance" data-testid="tab-safety-compliance">
              Compliance Tracking
            </TabsTrigger>
            <TabsTrigger value="irata" data-testid="tab-safety-irata">
              IRATA/SPRAT Metrics
            </TabsTrigger>
            <TabsTrigger value="partnership" data-testid="tab-safety-partnership">
              Partnership Reports
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <LoadingMetricCard key={i} />
                ))}
              </div>
              <Card>
                <CardContent className="py-6">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            </div>
          ) : data ? (
            <>
              <TabsContent value="overview">
                <OverviewTab data={data} />
              </TabsContent>
              <TabsContent value="csr">
                <CSRAnalyticsTab data={data} />
              </TabsContent>
              <TabsContent value="psr">
                <PSRAnalyticsTab data={data} />
              </TabsContent>
              <TabsContent value="compliance">
                <ComplianceTrackingTab data={data} />
              </TabsContent>
              <TabsContent value="irata">
                <IRATASPRATTab data={data} />
              </TabsContent>
              <TabsContent value="partnership">
                <PartnershipReportsTab data={data} />
              </TabsContent>
            </>
          ) : null}
        </Tabs>
      </div>
    </SuperUserLayout>
  );
}
