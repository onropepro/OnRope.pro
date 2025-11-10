// Centralized permission checking utilities

export interface User {
  id: string;
  role: string;
  permissions?: string[];
  viewFinancialData?: boolean;
  companyId?: string;
}

// Management roles that have elevated privileges
export const MANAGEMENT_ROLES = ['company', 'operations_manager', 'supervisor'];

// Worker roles
export const WORKER_ROLES = ['rope_access_tech', 'manager', 'ground_crew', 'ground_crew_supervisor'];

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
  
  // Management always has financial access
  if (isManagement(user)) return true;
  
  // Check explicit permission flag
  if (user.viewFinancialData === true) return true;
  
  // Check permissions array
  if (user.permissions?.includes('view_financial_data')) return true;
  
  return false;
}

// Check if user can manage employees
export function canManageEmployees(user: User | null | undefined): boolean {
  if (!user) return false;
  return MANAGEMENT_ROLES.includes(user.role);
}

// Check if user can view performance analytics
export function canViewPerformance(user: User | null | undefined): boolean {
  if (!user) return false;
  return MANAGEMENT_ROLES.includes(user.role);
}

// Check if user can access payroll
export function canAccessPayroll(user: User | null | undefined): boolean {
  return hasFinancialAccess(user);
}

// Check if user has specific permission
export function hasPermission(user: User | null | undefined, permission: string): boolean {
  if (!user) return false;
  
  // Management has all permissions
  if (isManagement(user)) return true;
  
  // Check permissions array
  return user.permissions?.includes(permission) || false;
}
