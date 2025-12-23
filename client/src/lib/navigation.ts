export const DASHBOARD_TABS = [
  'overview',
  'projects',
  'employees',
  'clients',
  'performance',
  'complaints',
] as const;

export type DashboardTab = typeof DASHBOARD_TABS[number];

export const STANDALONE_ROUTES = {
  schedule: '/schedule',
  profile: '/profile',
  inventory: '/inventory',
  payroll: '/payroll',
  quotes: '/quotes',
  activeWorkers: '/active-workers',
  nonBillableHours: '/non-billable-hours',
  hoursAnalytics: '/hours-analytics',
  residents: '/residents',
  documents: '/documents',
  myLoggedHours: '/my-logged-hours',
  harnessInspection: '/harness-inspection',
  safetyForms: '/safety-forms',
  toolboxMeeting: '/toolbox-meeting',
  flhaForm: '/flha-form',
  incidentReport: '/incident-report',
  methodStatement: '/method-statement',
  manageSubscription: '/manage-subscription',
  jobBoard: '/job-board',
  talentBrowser: '/talent-browser',
} as const;

export type StandaloneRoute = keyof typeof STANDALONE_ROUTES;

export function getDashboardUrl(tab?: DashboardTab): string {
  if (!tab || tab === 'overview') {
    return '/dashboard';
  }
  return `/dashboard?tab=${tab}`;
}

export function getRouteUrl(route: StandaloneRoute): string {
  return STANDALONE_ROUTES[route];
}

export function getProjectUrl(projectId: string): string {
  return `/projects/${projectId}`;
}

export function getProjectWorkSessionsUrl(projectId: string): string {
  return `/projects/${projectId}/work-sessions`;
}

export function getComplaintUrl(complaintId: string): string {
  return `/complaints/${complaintId}`;
}

export function isValidDashboardTab(tab: string | null | undefined): tab is DashboardTab {
  if (!tab) return false;
  return DASHBOARD_TABS.includes(tab as DashboardTab);
}

export function parseDashboardTab(searchParams: string): DashboardTab {
  const params = new URLSearchParams(searchParams);
  const tab = params.get('tab');
  if (isValidDashboardTab(tab)) {
    return tab;
  }
  return 'overview';
}
