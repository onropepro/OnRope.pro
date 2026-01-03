import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import SuperUserLayout from "@/components/SuperUserLayout";
import { BackButton } from "@/components/BackButton";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building,
  Briefcase,
  FileCheck,
  Globe,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
  ClipboardList,
  HardHat,
  FileWarning,
  MessageSquare,
  Database,
} from "lucide-react";

interface DatabaseCostSummary {
  allTime: number;
  thisYear: number;
  thisMonth: number;
  thisWeek: number;
  today: number;
}

interface MetricsSummary {
  mrr: number;
  arr: number;
  byComponent: {
    baseFees: number;
    employeeFees: number;
    whiteLabel: number;
  };
  bySize: {
    solo: number;
    small: number;
    medium: number;
    large: number;
  };
  averages: {
    employeesPerCompany: number;
    mrrPerCustomer: number;
  };
  byTier: {
    basic: number;
    starter: number;
    premium: number;
    enterprise: number;
  };
  byAddon: {
    extraSeats: number;
    whiteLabel: number;
  };
  customerCounts: {
    total: number;
    monthly: number;
    annual: number;
    solo: number;
    small: number;
    medium: number;
    large: number;
    withWhiteLabel: number;
  };
  customers: {
    totalCustomers: number;
    activeCustomers: number;
    trialCustomers: number;
    churned: number;
    byRegion: Record<string, number>;
    recentSignups: { count: number; period: string };
  };
  usage: {
    totalProjects: number;
    activeProjects: number;
    totalWorkSessions: number;
    totalEmployees: number;
    safetyFormsCount: {
      harness: number;
      toolbox: number;
      flha: number;
      incident: number;
    };
    quotesCount: {
      total: number;
      sent: number;
      accepted: number;
    };
    avgProjectsPerCompany: number;
    avgEmployeesPerCompany: number;
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

function KpiCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  variant = 'default',
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: typeof DollarSign;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}) {
  const iconStyles = {
    default: 'bg-blue-50 dark:bg-blue-500/10 text-blue-500',
    success: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500',
    warning: 'bg-amber-50 dark:bg-amber-500/10 text-amber-500',
    danger: 'bg-red-50 dark:bg-red-500/10 text-red-500',
  };

  return (
    <div className="su-metric-card" data-testid={`kpi-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between">
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
        <div className="mt-4 flex items-center gap-1 text-xs">
          {trend === 'up' && <ArrowUp className="h-3 w-3 text-emerald-500" />}
          {trend === 'down' && <ArrowDown className="h-3 w-3 text-red-500" />}
          {trend === 'neutral' && <Minus className="h-3 w-3 text-muted-foreground" />}
          <span className={
            trend === 'up' ? 'text-emerald-500' : 
            trend === 'down' ? 'text-red-500' : 
            'text-muted-foreground'
          }>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}

function LoadingKpiCard() {
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

export default function SuperUserMetrics() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  const { data: metrics, isLoading, error } = useQuery<MetricsSummary>({
    queryKey: ["/api/superuser/metrics/summary"],
  });

  const { data: dbCostsData, isLoading: dbCostsLoading } = useQuery<{ costs: any[], summary: DatabaseCostSummary }>({
    queryKey: ["/api/superuser/database-costs"],
  });

  if (error) {
    return (
      <SuperUserLayout title={t('superuser.metrics.title', 'Platform Metrics')}>
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <BackButton to="/superuser" label={t('common.backToDashboard', 'Back to Dashboard')} />
            <Card className="p-8 text-center">
              <p className="text-destructive">{t('superuser.metrics.error', 'Failed to load metrics. Please try again.')}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                data-testid="button-retry"
              >
                {t('common.retry', 'Retry')}
              </Button>
            </Card>
          </div>
        </div>
      </SuperUserLayout>
    );
  }

  const sizeColors: Record<string, string> = {
    solo: 'bg-blue-500',
    small: 'bg-green-500',
    medium: 'bg-purple-500',
    large: 'bg-amber-500',
  };

  const sizeLabels: Record<string, string> = {
    solo: 'Solo (1-3 employees)',
    small: 'Small (4-9 employees)',
    medium: 'Medium (10-29 employees)',
    large: 'Large (30+ employees)',
  };

  const componentColors = ['#3B82F6', '#10B981', '#F59E0B'];
  const sizeChartColors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

  const mrrDonutOptions: ApexOptions = {
    chart: { type: 'donut', height: 280 },
    labels: ['Base Fees ($99/mo)', 'Employee Fees', 'White Label ($49)'],
    colors: componentColors,
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            name: { show: true },
            value: { 
              show: true, 
              formatter: (val: string) => formatCurrency(parseFloat(val)) 
            },
            total: {
              show: true,
              label: 'Total MRR',
              formatter: () => formatCurrency(metrics?.mrr || 0)
            }
          }
        }
      }
    },
    tooltip: {
      y: { formatter: (val: number) => formatCurrency(val) }
    }
  };

  const customerSizeBarOptions: ApexOptions = {
    chart: { type: 'bar', height: 280, toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: true, barHeight: '60%', borderRadius: 6, distributed: true }
    },
    colors: sizeChartColors,
    xaxis: {
      categories: ['Solo (1-3)', 'Small (4-9)', 'Medium (10-29)', 'Large (30+)'],
      labels: { formatter: (val: string) => formatCurrency(parseFloat(val)) }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => formatCurrency(val),
      style: { fontSize: '12px' }
    },
    legend: { show: false },
    tooltip: {
      y: { formatter: (val: number) => formatCurrency(val) }
    }
  };

  return (
    <SuperUserLayout title={t('superuser.metrics.title', 'Platform Metrics')}>
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Back Button */}
          <BackButton to="/superuser" label={t('common.backToDashboard', 'Back to Dashboard')} />

          {/* Header Description */}
          <p className="text-muted-foreground">
            {t('superuser.metrics.subtitle', 'Real-time business intelligence for OnRopePro')}
          </p>

        {/* Primary KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              <LoadingKpiCard />
              <LoadingKpiCard />
              <LoadingKpiCard />
              <LoadingKpiCard />
            </>
          ) : metrics ? (
            <>
              <KpiCard
                title={t('superuser.metrics.mrr', 'Monthly Recurring Revenue')}
                value={formatCurrency(metrics.mrr)}
                subtitle={t('superuser.metrics.mrrLive', 'Live calculation')}
                icon={DollarSign}
                variant="success"
              />
              <KpiCard
                title={t('superuser.metrics.arr', 'Annual Recurring Revenue')}
                value={formatCurrency(metrics.arr)}
                subtitle={t('superuser.metrics.arrProjected', 'MRR x 12')}
                icon={TrendingUp}
                variant="default"
              />
              <KpiCard
                title={t('superuser.metrics.activeCustomers', 'Active Customers')}
                value={formatNumber(metrics.customers.activeCustomers)}
                subtitle={`${metrics.customers.trialCustomers} ${t('superuser.metrics.onTrial', 'on trial')}`}
                icon={Building}
                variant="default"
              />
              <KpiCard
                title={t('superuser.metrics.recentSignups', 'New Signups')}
                value={formatNumber(metrics.customers.recentSignups.count)}
                subtitle={metrics.customers.recentSignups.period}
                icon={Users}
                variant="success"
              />
            </>
          ) : null}
        </div>

        {/* Revenue Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MRR by Component - Donut Chart */}
          <Card data-testid="card-mrr-by-component">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                {t('superuser.metrics.mrrByComponent', 'MRR Breakdown')}
              </CardTitle>
              <CardDescription>
                {t('superuser.metrics.mrrByComponentDesc', 'Revenue by pricing component')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Skeleton className="h-48 w-48 rounded-full" />
                </div>
              ) : metrics?.byComponent ? (
                <div>
                  <Chart
                    options={mrrDonutOptions}
                    series={[
                      metrics.byComponent.baseFees,
                      metrics.byComponent.employeeFees,
                      metrics.byComponent.whiteLabel
                    ]}
                    type="donut"
                    height={280}
                  />
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-500/10">
                      <div className="font-semibold text-blue-600 dark:text-blue-400">
                        {metrics.customerCounts?.total || 0}
                      </div>
                      <div className="text-muted-foreground">Customers</div>
                    </div>
                    <div className="p-2 rounded-md bg-green-50 dark:bg-green-500/10">
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        {metrics.averages?.employeesPerCompany || 0}
                      </div>
                      <div className="text-muted-foreground">Avg Employees</div>
                    </div>
                    <div className="p-2 rounded-md bg-amber-50 dark:bg-amber-500/10">
                      <div className="font-semibold text-amber-600 dark:text-amber-400">
                        {formatCurrency(metrics.averages?.mrrPerCustomer || 0)}
                      </div>
                      <div className="text-muted-foreground">ARPU</div>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* MRR by Company Size - Horizontal Bar Chart */}
          <Card data-testid="card-mrr-by-size">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                {t('superuser.metrics.mrrBySize', 'MRR by Company Size')}
              </CardTitle>
              <CardDescription>
                {t('superuser.metrics.mrrBySizeDesc', 'Revenue distribution by customer segment')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : metrics?.bySize ? (
                <div>
                  <Chart
                    options={customerSizeBarOptions}
                    series={[{
                      name: 'MRR',
                      data: [
                        metrics.bySize.solo,
                        metrics.bySize.small,
                        metrics.bySize.medium,
                        metrics.bySize.large
                      ]
                    }]}
                    type="bar"
                    height={280}
                  />
                  <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-500/10">
                      <div className="font-semibold">{metrics.customerCounts?.solo || 0}</div>
                      <div className="text-muted-foreground">Solo</div>
                    </div>
                    <div className="p-2 rounded-md bg-green-50 dark:bg-green-500/10">
                      <div className="font-semibold">{metrics.customerCounts?.small || 0}</div>
                      <div className="text-muted-foreground">Small</div>
                    </div>
                    <div className="p-2 rounded-md bg-purple-50 dark:bg-purple-500/10">
                      <div className="font-semibold">{metrics.customerCounts?.medium || 0}</div>
                      <div className="text-muted-foreground">Medium</div>
                    </div>
                    <div className="p-2 rounded-md bg-amber-50 dark:bg-amber-500/10">
                      <div className="font-semibold">{metrics.customerCounts?.large || 0}</div>
                      <div className="text-muted-foreground">Large</div>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Customer & Geographic Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Geographic Distribution */}
          <Card data-testid="card-geographic-distribution">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                {t('superuser.metrics.geoDistribution', 'Geographic Distribution')}
              </CardTitle>
              <CardDescription>
                {t('superuser.metrics.geoDistributionDesc', 'Customer locations by region')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
              ) : metrics ? (
                <div className="space-y-3">
                  {Object.entries(metrics.customers.byRegion)
                    .sort(([, a], [, b]) => b - a)
                    .map(([region, count]) => (
                      <div key={region} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="text-sm">{region}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  {Object.keys(metrics.customers.byRegion).length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      {t('superuser.metrics.noGeoData', 'No geographic data available')}
                    </p>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Customer Size Distribution */}
          <Card data-testid="card-customer-distribution">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                {t('superuser.metrics.customerDistribution', 'Customer Distribution')}
              </CardTitle>
              <CardDescription>
                {t('superuser.metrics.customerDistributionDesc', 'Breakdown by company size')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
              ) : metrics ? (
                <div className="space-y-3">
                  {(['solo', 'small', 'medium', 'large'] as const).map((size) => {
                    const count = metrics.customerCounts[size] || 0;
                    const total = metrics.customerCounts.total || 1;
                    const percentage = Math.round((count / total) * 100);
                    return (
                      <div key={size} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${sizeColors[size]}`} />
                          <span className="text-sm">{sizeLabels[size]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{count}</Badge>
                          <span className="text-xs text-muted-foreground w-12 text-right">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between pt-2 font-medium border-t">
                    <span className="text-sm">{t('superuser.metrics.total', 'Total Customers')}</span>
                    <Badge variant="default">{metrics.customerCounts?.total || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>White Label Active</span>
                    <Badge variant="secondary">{metrics.customerCounts?.withWhiteLabel || 0}</Badge>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Product Usage Metrics */}
        <Card data-testid="card-product-usage">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {t('superuser.metrics.productUsage', 'Product Usage Metrics')}
            </CardTitle>
            <CardDescription>
              {t('superuser.metrics.productUsageDesc', 'Platform-wide feature adoption and engagement')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="text-center p-4 rounded-lg bg-muted/50">
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                ))}
              </div>
            ) : metrics ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Briefcase className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{formatNumber(metrics.usage.totalProjects)}</p>
                  <p className="text-xs text-muted-foreground">{t('superuser.metrics.totalProjects', 'Total Projects')}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <FileCheck className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">{formatNumber(metrics.usage.activeProjects)}</p>
                  <p className="text-xs text-muted-foreground">{t('superuser.metrics.activeProjects', 'Active Projects')}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Users className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">{formatNumber(metrics.usage.totalEmployees)}</p>
                  <p className="text-xs text-muted-foreground">{t('superuser.metrics.totalEmployees', 'Total Employees')}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <ClipboardList className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                  <p className="text-2xl font-bold">{formatNumber(metrics.usage.totalWorkSessions)}</p>
                  <p className="text-xs text-muted-foreground">{t('superuser.metrics.workSessions', 'Work Sessions')}</p>
                </div>

                {/* Safety Forms */}
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <HardHat className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-2xl font-bold">{formatNumber(metrics.usage.safetyFormsCount.harness)}</p>
                  <p className="text-xs text-muted-foreground">{t('superuser.metrics.harnessInspections', 'Harness Inspections')}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <MessageSquare className="h-6 w-6 mx-auto mb-2 text-teal-500" />
                  <p className="text-2xl font-bold">{formatNumber(metrics.usage.safetyFormsCount.toolbox)}</p>
                  <p className="text-xs text-muted-foreground">{t('superuser.metrics.toolboxMeetings', 'Toolbox Meetings')}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <FileCheck className="h-6 w-6 mx-auto mb-2 text-cyan-500" />
                  <p className="text-2xl font-bold">{formatNumber(metrics.usage.safetyFormsCount.flha)}</p>
                  <p className="text-xs text-muted-foreground">{t('superuser.metrics.flhaForms', 'FLHA Forms')}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <FileWarning className="h-6 w-6 mx-auto mb-2 text-red-500" />
                  <p className="text-2xl font-bold">{formatNumber(metrics.usage.safetyFormsCount.incident)}</p>
                  <p className="text-xs text-muted-foreground">{t('superuser.metrics.incidentReports', 'Incident Reports')}</p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Averages & Quotes Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Averages */}
          <Card data-testid="card-averages">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                {t('superuser.metrics.averages', 'Platform Averages')}
              </CardTitle>
              <CardDescription>
                {t('superuser.metrics.averagesDesc', 'Average usage per customer')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : metrics ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-6 rounded-lg border">
                    <p className="text-3xl font-bold text-primary">{metrics.usage.avgProjectsPerCompany}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('superuser.metrics.avgProjects', 'Avg Projects/Company')}
                    </p>
                  </div>
                  <div className="text-center p-6 rounded-lg border">
                    <p className="text-3xl font-bold text-primary">{metrics.usage.avgEmployeesPerCompany}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('superuser.metrics.avgEmployees', 'Avg Employees/Company')}
                    </p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Quotes Metrics */}
          <Card data-testid="card-quotes">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-green-500" />
                {t('superuser.metrics.quotesMetrics', 'Quotes Metrics')}
              </CardTitle>
              <CardDescription>
                {t('superuser.metrics.quotesMetricsDesc', 'Quote pipeline overview')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : metrics ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <span>{t('superuser.metrics.totalQuotes', 'Total Quotes')}</span>
                    <Badge variant="secondary">{metrics.usage.quotesCount.total}</Badge>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <span>{t('superuser.metrics.sentQuotes', 'Sent to Clients')}</span>
                    <Badge variant="outline">{metrics.usage.quotesCount.sent}</Badge>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span>{t('superuser.metrics.acceptedQuotes', 'Accepted')}</span>
                    <Badge variant="default" className="bg-green-500">{metrics.usage.quotesCount.accepted}</Badge>
                  </div>
                  {metrics.usage.quotesCount.sent > 0 && (
                    <div className="pt-2 text-center">
                      <p className="text-sm text-muted-foreground">
                        {t('superuser.metrics.conversionRate', 'Conversion Rate')}: {' '}
                        <span className="font-medium text-foreground">
                          {Math.round((metrics.usage.quotesCount.accepted / metrics.usage.quotesCount.sent) * 100)}%
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Database Costs Section */}
        <Card data-testid="card-database-costs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-orange-500" />
              {t('superuser.metrics.databaseCosts', 'Database Costs')}
            </CardTitle>
            <CardDescription>
              {t('superuser.metrics.databaseCostsDesc', 'Manual tracking of database usage costs by period')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dbCostsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : dbCostsData?.summary ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(dbCostsData.summary.allTime)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('superuser.metrics.allTime', 'All Time')}
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(dbCostsData.summary.thisYear)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('superuser.metrics.thisYear', 'This Year')}
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(dbCostsData.summary.thisMonth)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('superuser.metrics.thisMonth', 'This Month')}
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(dbCostsData.summary.thisWeek)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('superuser.metrics.thisWeek', 'This Week')}
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(dbCostsData.summary.today)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('superuser.metrics.today', 'Today')}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                {t('superuser.metrics.noCostData', 'No cost data recorded yet')}
              </p>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </SuperUserLayout>
  );
}
