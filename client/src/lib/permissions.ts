// Centralized permission checking utilities

export interface User {
  id: string;
  role: string;
  permissions?: string[];
  viewFinancialData?: boolean;
  companyId?: string;
  subscriptionStatus?: string; // For company role: Stripe subscription status
  companySubscriptionStatus?: string; // For employees: parent company's subscription status
}

// Management roles that have elevated privileges
export const MANAGEMENT_ROLES = ['company', 'owner_ceo', 'human_resources', 'accounting', 'operations_manager', 'general_supervisor', 'rope_access_supervisor', 'account_manager'];

// Worker roles
export const WORKER_ROLES = ['rope_access_tech', 'manager', 'ground_crew', 'ground_crew_supervisor', 'labourer'];

// All employee roles (management + workers) that should access the dashboard
export const EMPLOYEE_ROLES = [...MANAGEMENT_ROLES, ...WORKER_ROLES];

// Check if user has a management role
export function isManagement(user: User | null | undefined): boolean {
  if (!user) return false;
  return MANAGEMENT_ROLES.includes(user.role);
}

// Check if user has a worker role
export function isWorker(user: User | null | undefined): boolean {
  if (!user) return false;
  return WORKER_ROLES.includes(user.role);
}

// Check if user has financial data access
export function hasFinancialAccess(user: User | null | undefined): boolean {
  if (!user) return false;
  
  // Company role always has financial access
  if (user.role === 'company') return true;
  
  // Check explicit permission flag
  if (user.viewFinancialData === true) return true;
  
  // Check permissions array
  if (user.permissions?.includes('view_financial_data')) return true;
  
  return false;
}

// Check if user can manage employees
export function canManageEmployees(user: User | null | undefined): boolean {
  if (!user) return false;
  
  // Company role always has access
  if (user.role === 'company') return true;
  
  // Check granular permissions - role does NOT automatically grant permissions
  return user.permissions?.includes('view_employees') || false;
}

// Check if user can view performance analytics
export function canViewPerformance(user: User | null | undefined): boolean {
  if (!user) return false;
  
  // Company role always has access
  if (user.role === 'company') return true;
  
  // Check granular permissions - role does NOT automatically grant permissions
  return user.permissions?.includes('view_analytics') || false;
}

// Check if user can access payroll
export function canAccessPayroll(user: User | null | undefined): boolean {
  return hasFinancialAccess(user);
}

// Check if user can view/manage job schedule
export function canViewSchedule(user: User | null | undefined): boolean {
  if (!user) return false;
  
  // Company role always has access
  if (user.role === 'company') return true;
  
  // Check granular permissions - role does NOT automatically grant permissions
  return user.permissions?.includes('view_schedule') || false;
}

// Check if user can view safety documents (incident reports, FLHA forms, rope access plans)
export function canViewSafetyDocuments(user: User | null | undefined): boolean {
  if (!user) return false;
  
  // Company role always has access
  if (user.role === 'company') return true;
  
  // Operations managers always have access to safety documents
  if (user.role === 'operations_manager') return true;
  
  // All supervisor roles always have access to safety documents
  if (user.role === 'supervisor' || user.role === 'general_supervisor' || user.role === 'rope_access_supervisor') return true;
  
  // Check granular permissions - rope_access_tech and other roles need explicit permission
  return user.permissions?.includes('view_safety_documents') || false;
}

// Check if user has specific permission
export function hasPermission(user: User | null | undefined, permission: string): boolean {
  if (!user) return false;
  
  // Company role has all permissions
  if (user.role === 'company') return true;
  
  // Check permissions array - role does NOT automatically grant permissions
  return user.permissions?.includes(permission) || false;
}

// Check if user is in read-only mode
// - For company role: check their Stripe subscription status
// - For employees: check their parent company's subscription status
// - Residents are NEVER in read-only mode
export function isReadOnly(user: User | null | undefined): boolean {
  if (!user) return false;
  
  // Residents are never in read-only mode
  if (user.role === 'resident') {
    return false;
  }
  
  // For company role: check their Stripe subscription status
  if (user.role === 'company') {
    // Allow full access if subscription is active or trialing
    // If no subscription data exists, assume legacy user with full access
    if (!user.subscriptionStatus) return false;
    return !['active', 'trialing'].includes(user.subscriptionStatus);
  }
  
  // For employees: check parent company's subscription status
  // If companySubscriptionStatus is undefined, assume full access
  if (!user.companySubscriptionStatus) return false;
  return !['active', 'trialing'].includes(user.companySubscriptionStatus);
}
