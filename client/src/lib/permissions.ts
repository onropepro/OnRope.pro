// Centralized permission checking utilities

export interface User {
  id: string;
  role: string;
  permissions?: string[];
  viewFinancialData?: boolean;
  companyId?: string;
  licenseVerified?: boolean;
  companyLicenseVerified?: boolean; // For employees: parent company's verification status
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

// Check if user has specific permission
export function hasPermission(user: User | null | undefined, permission: string): boolean {
  if (!user) return false;
  
  // Company role has all permissions
  if (user.role === 'company') return true;
  
  // Check permissions array - role does NOT automatically grant permissions
  return user.permissions?.includes(permission) || false;
}

// Check if user is in read-only mode
// - For company role: check their own license verification
// - For employees: check their parent company's license verification
// - Residents are NEVER in read-only mode
export function isReadOnly(user: User | null | undefined): boolean {
  if (!user) return false;
  
  // Residents are never in read-only mode
  if (user.role === 'resident') {
    return false;
  }
  
  // For company role: check their own license
  if (user.role === 'company') {
    return user.licenseVerified !== true;
  }
  
  // For employees: check parent company's license
  // If companyLicenseVerified is undefined, assume verified (no restriction)
  return user.companyLicenseVerified === false;
}

// Role label mapping
const ROLE_LABELS: Record<string, string> = {
  company: "Owner/CEO",
  owner_ceo: "Owner/CEO",
  operations_manager: "Operations Manager",
  human_resources: "Human Resources",
  accounting: "Accounting",
  account_manager: "Account Manager",
  general_supervisor: "General Supervisor",
  rope_access_supervisor: "Rope Access Supervisor",
  manager: "Manager",
  rope_access_tech: "Rope Access Technician",
  ground_crew_supervisor: "Ground Crew Supervisor",
  ground_crew: "Ground Crew",
  labourer: "Labourer",
};

// Helper function to get role label
export function getRoleLabel(role: string | undefined | null): string {
  if (!role) return "Staff";
  return ROLE_LABELS[role] || role.replace(/_/g, ' ');
}
