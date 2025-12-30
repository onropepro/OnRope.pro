// Dashboard Card Registry - Defines all available cards and their permissions

export interface CardDefinition {
  id: string;
  name: string;
  description: string;
  category: 'OPERATIONS' | 'FINANCIAL' | 'SAFETY' | 'SCHEDULING' | 'TEAM' | 'FEEDBACK' | 'PERFORMANCE';
  permission: string | null; // null = always visible
  refreshInterval?: number; // ms - for real-time cards
  size: 'single' | 'double'; // single = standard height, double = 2x height for lists
}

// Full card registry
export const CARD_REGISTRY: CardDefinition[] = [
  // OPERATIONS
  { id: 'proj-active', name: 'Active Projects', description: 'List with progress %', category: 'OPERATIONS', permission: null, size: 'single' },
  { id: 'proj-overdue', name: 'Overdue Projects', description: 'Past due date', category: 'OPERATIONS', permission: 'viewProjects', size: 'single' },
  { id: 'time-active', name: 'Active Workers', description: 'Who\'s clocked in now', category: 'OPERATIONS', permission: 'viewWorkSessions', refreshInterval: 30000, size: 'single' },
  { id: 'time-notclocked', name: 'Not Clocked In', description: 'Scheduled but not started', category: 'OPERATIONS', permission: 'manageEmployees', size: 'single' },
  { id: 'time-today', name: 'Today\'s Hours', description: 'Company-wide total', category: 'OPERATIONS', permission: 'viewWorkSessions', size: 'single' },
  { id: 'time-my', name: 'My Time Today', description: 'Current user\'s status', category: 'OPERATIONS', permission: null, size: 'single' },
  { id: 'ops-weather', name: 'Weather', description: 'Wind & conditions', category: 'OPERATIONS', permission: null, refreshInterval: 300000, size: 'single' },

  // FINANCIAL
  { id: 'pay-period', name: 'Pay Period Summary', description: 'Dates, hours, cost', category: 'FINANCIAL', permission: 'canAccessFinancials', size: 'single' },
  { id: 'pay-overtime', name: 'Overtime Alert', description: 'Approaching/exceeding OT', category: 'FINANCIAL', permission: 'canAccessFinancials', size: 'single' },
  { id: 'pay-pending', name: 'Pending Approvals', description: 'Timesheets to approve', category: 'FINANCIAL', permission: 'canAccessFinancials', size: 'single' },
  { id: 'quote-pending', name: 'Outstanding Quotes', description: 'Awaiting response', category: 'FINANCIAL', permission: 'canAccessFinancials', size: 'single' },
  { id: 'quote-pipeline', name: 'Sales Pipeline', description: 'Counts by stage', category: 'FINANCIAL', permission: 'canAccessFinancials', size: 'single' },
  { id: 'quote-value', name: 'Pipeline Value', description: 'Total $ pending', category: 'FINANCIAL', permission: 'canAccessFinancials', size: 'single' },

  // SAFETY
  { id: 'safe-csr', name: 'Safety Rating', description: 'CSR score + trend', category: 'SAFETY', permission: null, size: 'single' },
  { id: 'safe-harness', name: 'Harness Status', description: 'Due/overdue today', category: 'SAFETY', permission: 'viewSafetyDocuments', size: 'single' },
  { id: 'safe-toolbox', name: 'Toolbox Coverage', description: 'Missing 7-day meeting', category: 'SAFETY', permission: 'viewSafetyDocuments', size: 'single' },
  { id: 'safe-certs', name: 'Expiring Certs', description: 'Within 60 days', category: 'SAFETY', permission: 'viewSafetyDocuments', size: 'single' },

  // SCHEDULING
  { id: 'sched-today', name: 'Today\'s Schedule', description: 'Jobs + crew', category: 'SCHEDULING', permission: 'viewSchedule', size: 'single' },
  { id: 'sched-week', name: 'Week at a Glance', description: '7-day mini view', category: 'SCHEDULING', permission: 'viewSchedule', size: 'single' },
  { id: 'sched-timeoff', name: 'Time-Off Requests', description: 'Pending approvals', category: 'SCHEDULING', permission: 'manageScheduling', size: 'single' },
  { id: 'sched-my', name: 'My Schedule', description: 'User\'s assignments', category: 'SCHEDULING', permission: null, size: 'single' },

  // TEAM
  { id: 'emp-certs', name: 'Certification Alerts', description: 'Expiring IRATA/SPRAT', category: 'TEAM', permission: 'manageEmployees', size: 'single' },
  { id: 'emp-seats', name: 'Subscription Seats', description: 'Used vs available', category: 'TEAM', permission: 'manageEmployees', size: 'single' },

  // FEEDBACK
  { id: 'feed-new', name: 'New Feedback', description: 'Unread count', category: 'FEEDBACK', permission: 'viewFeedback', size: 'single' },
  { id: 'feed-open', name: 'Open Issues', description: 'Not yet closed', category: 'FEEDBACK', permission: 'viewFeedback', size: 'single' },

  // PERFORMANCE
  { id: 'perf-target', name: 'Target Achievement', description: '% of targets hit', category: 'PERFORMANCE', permission: 'viewPerformance', size: 'single' },
  { id: 'perf-my', name: 'My Performance', description: 'User\'s stats', category: 'PERFORMANCE', permission: null, size: 'single' },
];

// Default dashboard layouts by role
export const DEFAULT_LAYOUTS: Record<string, string[]> = {
  company: ['proj-active', 'safe-csr', 'sched-today', 'time-active', 'emp-certs'],
  operations_manager: ['proj-active', 'safe-csr', 'sched-today', 'time-active', 'emp-certs'],
  manager: ['proj-active', 'safe-csr', 'sched-today', 'time-active'],
  supervisor: ['proj-active', 'safe-csr', 'sched-today', 'time-active'],
  rope_access_tech: ['time-my', 'sched-my', 'safe-csr', 'perf-my', 'proj-active'],
  ground_crew: ['time-my', 'sched-my', 'safe-csr', 'perf-my', 'proj-active'],
  ground_crew_supervisor: ['time-my', 'sched-my', 'safe-csr', 'perf-my', 'proj-active'],
};

// Permission mapping for server-side filtering
export const PERMISSION_MAP: Record<string, (user: any) => boolean> = {
  viewProjects: (user) => user.role === 'company' || user.permissions?.includes('view_projects'),
  viewWorkSessions: (user) => user.role === 'company' || user.permissions?.includes('view_work_sessions'),
  manageEmployees: (user) => user.role === 'company' || user.permissions?.includes('manage_employees'),
  canAccessFinancials: (user) => user.role === 'company' || user.permissions?.includes('view_financial_data'),
  viewSafetyDocuments: (user) => user.role === 'company' || user.permissions?.includes('view_safety_documents'),
  viewSchedule: (user) => user.role === 'company' || user.permissions?.includes('view_schedule'),
  manageScheduling: (user) => user.role === 'company' || user.permissions?.includes('manage_scheduling'),
  viewFeedback: (user) => user.role === 'company' || user.permissions?.includes('view_feedback'),
  viewPerformance: (user) => user.role === 'company' || user.permissions?.includes('view_performance'),
};

// Get cards user has permission to see
export function getAvailableCardsForUser(user: any): CardDefinition[] {
  return CARD_REGISTRY.filter(card => {
    if (card.permission === null) return true;
    const permCheck = PERMISSION_MAP[card.permission];
    return permCheck ? permCheck(user) : false;
  });
}

// Get default layout for a user's role
export function getDefaultLayoutForRole(role: string): string[] {
  return DEFAULT_LAYOUTS[role] || DEFAULT_LAYOUTS['rope_access_tech'];
}

// Get card by ID
export function getCardById(cardId: string): CardDefinition | undefined {
  return CARD_REGISTRY.find(c => c.id === cardId);
}

// Group cards by category
export function getCardsByCategory(): Record<string, CardDefinition[]> {
  const grouped: Record<string, CardDefinition[]> = {};
  for (const card of CARD_REGISTRY) {
    if (!grouped[card.category]) {
      grouped[card.category] = [];
    }
    grouped[card.category].push(card);
  }
  return grouped;
}
