import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Building,
  Users,
  Briefcase,
  FileText,
  Activity,
  Shield,
  Clock,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  HardHat,
  ClipboardList,
} from "lucide-react";
import { formatTimestampDate, formatTime, formatLocalDate } from "@/lib/dateUtils";

interface DashboardData {
  company: any;
  projects: any[];
  employees: any[];
  clients: any[];
  stats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalEmployees: number;
    activeWorkers: number;
    totalClients: number;
    totalQuotes: number;
    pendingQuotes: number;
  };
  activeWorkSessions: any[];
  quotes: any[];
}

interface SafetyData {
  harnessInspections: any[];
  toolboxMeetings: any[];
  flhaForms: any[];
  incidentReports: any[];
  counts: {
    harnessInspections: number;
    toolboxMeetings: number;
    flhaForms: number;
    incidentReports: number;
  };
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend,
}: { 
  title: string; 
  value: string | number; 
  icon: typeof Building;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{description}</p>
            )}
          </div>
          <div className="p-2 rounded-md bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ViewAsCompany() {
  const [, params] = useRoute("/superuser/view-as/:companyId");
  const [, setLocation] = useLocation();
  const companyId = params?.companyId;

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery<DashboardData>({
    queryKey: ["/api/superuser/impersonate", companyId, "dashboard"],
    enabled: !!companyId && userData?.user?.role === 'superuser',
  });

  const { data: safetyData, isLoading: safetyLoading } = useQuery<SafetyData>({
    queryKey: ["/api/superuser/impersonate", companyId, "safety"],
    enabled: !!companyId && userData?.user?.role === 'superuser',
  });

  useEffect(() => {
    if (userData && userData.user?.role !== 'superuser') {
      setLocation('/');
    }
  }, [userData, setLocation]);

  if (!userData || userData.user?.role !== 'superuser') {
    return null;
  }

  if (dashboardLoading) {
    return (
      <div className="min-h-screen page-gradient">
        <div className="bg-amber-500/10 border-b border-amber-500/20 p-3">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Eye className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">Loading company view...</span>
          </div>
        </div>
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen page-gradient p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Company Not Found</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load company data. The company may not exist.
              </p>
              <Link href="/superuser/companies">
                <Button variant="outline" data-testid="button-back-to-companies">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Companies
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { company, projects, employees, stats, activeWorkSessions, quotes, clients } = dashboardData;
  const safetyStats = safetyData?.counts || { harnessInspections: 0, toolboxMeetings: 0, flhaForms: 0, incidentReports: 0 };

  return (
    <div className="min-h-screen page-gradient">
      <div className="bg-amber-500/10 border-b border-amber-500/20 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-amber-600" />
            <div>
              <span className="text-sm font-semibold text-amber-700">
                Viewing as: {company.companyName || 'Unnamed Company'}
              </span>
              <Badge variant="outline" className="ml-2 text-xs border-amber-500/30 text-amber-700">
                Read-Only Mode
              </Badge>
            </div>
          </div>
          <Link href={`/superuser/companies/${companyId}`}>
            <Button variant="outline" size="sm" data-testid="button-exit-view">
              <EyeOff className="mr-2 h-4 w-4" />
              Exit View Mode
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">{company.companyName || 'Company Dashboard'}</h1>
            <p className="text-muted-foreground mt-1">
              {company.email} | Plan: OnRopePro
            </p>
          </div>
          <Badge 
            className={company.subscriptionStatus === 'active' || company.subscriptionStatus === 'trialing' 
              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
              : 'bg-red-500/10 text-red-600 border-red-500/20'}
          >
            {company.subscriptionStatus === 'active' ? (
              <><CheckCircle className="mr-1 h-3 w-3" /> Active</>
            ) : company.subscriptionStatus === 'trialing' ? (
              <><Clock className="mr-1 h-3 w-3" /> Trial</>
            ) : (
              <><XCircle className="mr-1 h-3 w-3" /> {company.subscriptionStatus || 'Inactive'}</>
            )}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={Briefcase}
            description={`${stats.completedProjects} completed`}
          />
          <StatCard
            title="Employees"
            value={stats.totalEmployees}
            icon={Users}
            description={`${stats.activeWorkers} currently working`}
          />
          <StatCard
            title="Clients"
            value={stats.totalClients}
            icon={Building}
          />
          <StatCard
            title="Quote/Pipeline"
            value={stats.totalQuotes}
            icon={FileText}
            description={`${stats.pendingQuotes} pending`}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <Activity className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">
              <Briefcase className="mr-2 h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="employees" data-testid="tab-employees">
              <Users className="mr-2 h-4 w-4" />
              Employees
            </TabsTrigger>
            <TabsTrigger value="safety" data-testid="tab-safety">
              <Shield className="mr-2 h-4 w-4" />
              Safety
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Active Work Sessions
                  </CardTitle>
                  <CardDescription>
                    Workers currently clocked in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeWorkSessions.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No active work sessions</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeWorkSessions.slice(0, 5).map((session: any) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{session.employeeName}</p>
                            <p className="text-xs text-muted-foreground">
                              Started: {formatTime(session.clockInTime)}
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">
                            Active
                          </Badge>
                        </div>
                      ))}
                      {activeWorkSessions.length > 5 && (
                        <p className="text-xs text-center text-muted-foreground">
                          +{activeWorkSessions.length - 5} more active sessions
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Recent Quotes
                  </CardTitle>
                  <CardDescription>
                    Latest quote activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {quotes.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No quotes found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {quotes.slice(0, 5).map((quote: any) => (
                        <div key={quote.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium truncate max-w-[200px]">
                              {quote.buildingName || quote.clientName || 'Unnamed Quote'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {quote.createdAt ? formatTimestampDate(quote.createdAt) : 'N/A'}
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {quote.status || 'Draft'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Safety Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <HardHat className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">{safetyStats.harnessInspections}</p>
                    <p className="text-xs text-muted-foreground">Harness Inspections</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <ClipboardList className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold">{safetyStats.toolboxMeetings}</p>
                    <p className="text-xs text-muted-foreground">Toolbox Meetings</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <FileText className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                    <p className="text-2xl font-bold">{safetyStats.flhaForms}</p>
                    <p className="text-xs text-muted-foreground">FLHA Forms</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-500" />
                    <p className="text-2xl font-bold">{safetyStats.incidentReports}</p>
                    <p className="text-xs text-muted-foreground">Incident Reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  All Projects ({projects.length})
                </CardTitle>
                <CardDescription>
                  {stats.activeProjects} active, {stats.completedProjects} completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No projects found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.map((project: any) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{project.buildingName || project.buildingAddress || 'Unnamed Project'}</p>
                            {project.calendarColor && (
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: project.calendarColor }}
                              />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {project.jobType?.replace(/_/g, ' ') || 'No job type'} | 
                            {project.startDate ? ` Started: ${formatLocalDate(project.startDate)}` : ' No start date'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {project.totalDrops > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {project.completedDrops || 0}/{project.totalDrops} drops
                            </Badge>
                          )}
                          <Badge 
                            variant={project.status === 'active' ? 'default' : project.status === 'completed' ? 'secondary' : 'outline'}
                            className="capitalize"
                          >
                            {project.status || 'Draft'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Employees ({employees.length})
                </CardTitle>
                <CardDescription>
                  {stats.activeWorkers} currently working
                </CardDescription>
              </CardHeader>
              <CardContent>
                {employees.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No employees found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {employees.map((employee: any) => {
                      const isActive = activeWorkSessions.some((s: any) => s.userId === employee.id);
                      return (
                        <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{employee.name || 'Unnamed Employee'}</p>
                              {isActive && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {employee.email} | {employee.role?.replace(/_/g, ' ') || 'No role'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {employee.hourlyRate && (
                              <Badge variant="outline" className="text-xs">
                                ${employee.hourlyRate}/hr
                              </Badge>
                            )}
                            <Badge 
                              variant={employee.employmentStatus === 'active' ? 'default' : 'secondary'}
                              className="capitalize"
                            >
                              {employee.employmentStatus || 'Active'}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safety" className="space-y-4">
            {safetyLoading ? (
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                    <span>Loading safety data...</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <HardHat className="h-5 w-5 text-blue-500" />
                      Harness Inspections
                    </CardTitle>
                    <CardDescription>
                      {safetyStats.harnessInspections} total inspections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {safetyData?.harnessInspections?.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">No harness inspections</p>
                    ) : (
                      <div className="space-y-2">
                        {safetyData?.harnessInspections?.slice(0, 5).map((inspection: any) => (
                          <div key={inspection.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="text-sm truncate">{inspection.inspectorName || 'Unknown'}</span>
                            <span className="text-xs text-muted-foreground">
                              {inspection.inspectionDate ? formatLocalDate(inspection.inspectionDate) : 'N/A'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-green-500" />
                      Toolbox Meetings
                    </CardTitle>
                    <CardDescription>
                      {safetyStats.toolboxMeetings} total meetings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {safetyData?.toolboxMeetings?.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">No toolbox meetings</p>
                    ) : (
                      <div className="space-y-2">
                        {safetyData?.toolboxMeetings?.slice(0, 5).map((meeting: any) => (
                          <div key={meeting.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="text-sm truncate">{meeting.topic || meeting.projectName || 'Meeting'}</span>
                            <span className="text-xs text-muted-foreground">
                              {meeting.meetingDate ? formatLocalDate(meeting.meetingDate) : 'N/A'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-500" />
                      FLHA Forms
                    </CardTitle>
                    <CardDescription>
                      {safetyStats.flhaForms} total forms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {safetyData?.flhaForms?.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">No FLHA forms</p>
                    ) : (
                      <div className="space-y-2">
                        {safetyData?.flhaForms?.slice(0, 5).map((form: any) => (
                          <div key={form.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="text-sm truncate">{form.createdByName || 'Unknown'}</span>
                            <span className="text-xs text-muted-foreground">
                              {form.assessmentDate ? formatLocalDate(form.assessmentDate) : 'N/A'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Incident Reports
                    </CardTitle>
                    <CardDescription>
                      {safetyStats.incidentReports} total reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {safetyData?.incidentReports?.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">No incident reports</p>
                    ) : (
                      <div className="space-y-2">
                        {safetyData?.incidentReports?.slice(0, 5).map((report: any) => (
                          <div key={report.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="text-sm truncate">{report.incidentType || 'Incident'}</span>
                            <Badge variant={report.severity === 'critical' ? 'destructive' : 'outline'} className="text-xs">
                              {report.severity || 'Unknown'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
