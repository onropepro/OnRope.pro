import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import type { CrmActivity } from "@shared/schema";

type DashboardStats = {
  totalCompanies: number;
  totalContacts: number;
  pipeline: Record<string, number>;
  pendingTasks: number;
  recentActivities: CrmActivity[];
};

const PIPELINE_STAGES = [
  { key: "lead_captured", label: "Lead Captured", color: "bg-blue-500" },
  { key: "contacted", label: "Contacted", color: "bg-orange-500" },
  { key: "demo_scheduled", label: "Demo Scheduled", color: "bg-violet-500" },
  { key: "trial", label: "Trial", color: "bg-cyan-500" },
  { key: "paid_subscriber", label: "Paid Subscriber", color: "bg-emerald-500" },
  { key: "churned", label: "Churned", color: "bg-gray-500" },
  { key: "lost", label: "Lost", color: "bg-red-500" },
];

const ACTIVITY_ICONS: Record<string, string> = {
  email_sent: "send",
  email_received: "inbox",
  email_opened: "drafts",
  email_clicked: "mouse",
  call_made: "phone",
  call_received: "phone_callback",
  note: "sticky_note_2",
  demo_completed: "slideshow",
  stage_change: "swap_horiz",
  task_completed: "task_alt",
};

function StatCard({
  title,
  value,
  icon,
  colorClass,
  href,
}: {
  title: string;
  value: number | string;
  icon: string;
  colorClass: string;
  href?: string;
}) {
  const content = (
    <Card className="shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClass}`}>
            <span className="material-icons text-white text-2xl">{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} data-testid={`link-stat-${title.toLowerCase().replace(/\s+/g, "-")}`}>
        {content}
      </Link>
    );
  }

  return content;
}

function PipelineOverview({ pipeline }: { pipeline: Record<string, number> }) {
  const total = Object.values(pipeline).reduce((sum, count) => sum + count, 0);

  return (
    <Card data-testid="card-pipeline-overview">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
        <CardTitle className="text-lg">Pipeline Overview</CardTitle>
        <Link href="/superuser/crm/pipeline">
          <Button variant="outline" size="sm" data-testid="button-view-pipeline">
            View Pipeline
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="text-muted-foreground text-sm">No contacts in pipeline yet.</p>
        ) : (
          <div className="space-y-4">
            {PIPELINE_STAGES.map((stage) => {
              const count = pipeline[stage.key] || 0;
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={stage.key} className="space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium">{stage.label}</span>
                    <span className="text-sm text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stage.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentActivity({ activities }: { activities: CrmActivity[] }) {
  return (
    <Card data-testid="card-recent-activity">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-sm">No recent activity.</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                data-testid={`activity-item-${activity.id}`}
              >
                <div className="p-2 rounded-lg bg-muted flex-shrink-0">
                  <span className="material-icons text-lg text-muted-foreground">
                    {ACTIVITY_ICONS[activity.type] || "event"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.subject || activity.type.replace(/_/g, " ")}</p>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.createdAt ? format(new Date(activity.createdAt), "MMM d, h:mm a") : ""}
                  </p>
                </div>
                <Badge variant="secondary" className="flex-shrink-0 text-xs capitalize">
                  {activity.type.replace(/_/g, " ")}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card data-testid="card-quick-actions">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/superuser/crm/contacts">
            <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-add-contact">
              <span className="material-icons text-lg">person_add</span>
              Add Contact
            </Button>
          </Link>
          <Link href="/superuser/crm/companies">
            <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-add-company">
              <span className="material-icons text-lg">domain_add</span>
              Add Company
            </Button>
          </Link>
          <Link href="/superuser/crm/tasks">
            <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-view-tasks">
              <span className="material-icons text-lg">task</span>
              View Tasks
            </Button>
          </Link>
          <Link href="/superuser/crm/templates">
            <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-email-templates">
              <span className="material-icons text-lg">mail</span>
              Email Templates
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CrmDashboard() {
  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["/api/crm/dashboard/stats"],
  });

  return (
    <SuperUserLayout title="Sales CRM">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Sales CRM Dashboard</h1>
            <p className="text-muted-foreground">
              Track and manage leads through the conversion pipeline
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center text-destructive">
              Failed to load dashboard data. Please try again.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Companies"
                value={data?.totalCompanies || 0}
                icon="domain"
                colorClass="bg-blue-500"
                href="/superuser/crm/companies"
              />
              <StatCard
                title="Total Contacts"
                value={data?.totalContacts || 0}
                icon="contacts"
                colorClass="bg-emerald-500"
                href="/superuser/crm/contacts"
              />
              <StatCard
                title="In Pipeline"
                value={(data?.pipeline?.lead_captured || 0) + (data?.pipeline?.contacted || 0) + (data?.pipeline?.demo_scheduled || 0) + (data?.pipeline?.trial || 0)}
                icon="filter_alt"
                colorClass="bg-orange-500"
                href="/superuser/crm/pipeline"
              />
              <StatCard
                title="Pending Tasks"
                value={data?.pendingTasks || 0}
                icon="task_alt"
                colorClass="bg-violet-500"
                href="/superuser/crm/tasks"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PipelineOverview pipeline={data?.pipeline || {}} />
              </div>
              <div>
                <QuickActions />
              </div>
            </div>

            <RecentActivity activities={data?.recentActivities || []} />
          </>
        )}
      </div>
    </SuperUserLayout>
  );
}
