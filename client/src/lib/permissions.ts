/**
 * Centralized Permission System
 * 
 * This file contains all permission-related utilities organized by category:
 * - Types & Constants: User interface and role definitions
 * - Role Helpers: Functions to check user role categories
 * - Financial Permissions: Access to financial data, payroll, quotes
 * - Operations Permissions: Employees, scheduling, analytics
 * - Safety Permissions: Safety documents, CSR, inspections
 * - Inventory Permissions: Gear and equipment management
 * - Subscription: Read-only mode based on subscription status
 */

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

export interface User {
  id: string;
  role: string;
  permissions?: string[];
  viewFinancialData?: boolean;
  companyId?: string;
  subscriptionStatus?: string;
  companySubscriptionStatus?: string;
}

/** Management roles with elevated privileges */
export const MANAGEMENT_ROLES = [
  'company',
  'owner_ceo',
  'human_resources',
  'accounting',
  'operations_manager',
  'general_supervisor',
  'rope_access_supervisor',
  'account_manager'
];

/** Worker/field roles */
export const WORKER_ROLES = [
  'rope_access_tech',
  'manager',
  'ground_crew',
  'ground_crew_supervisor',
  'labourer',
  'supervisor'  // Generic supervisor role
];

/** All employee roles that should access the dashboard */
export const EMPLOYEE_ROLES = [...MANAGEMENT_ROLES, ...WORKER_ROLES];

/** Supervisor roles for safety and inventory access */
const SUPERVISOR_ROLES = ['supervisor', 'general_supervisor', 'rope_access_supervisor'];

// ============================================================================
// BASE HELPERS (Internal)
// ============================================================================

/** Check if user exists and has company role (full access) */
function isCompanyOwner(user: User | null | undefined): boolean {
  return user?.role === 'company';
}

/** Check if user has a specific permission in their permissions array */
function checkPermission(user: User | null | undefined, permission: string): boolean {
  return user?.permissions?.includes(permission) || false;
}

/** Check if user has one of the specified roles */
function hasRole(user: User | null | undefined, roles: string[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

// ============================================================================
// ROLE HELPERS
// ============================================================================

/** Check if user has a management role */
export function isManagement(user: User | null | undefined): boolean {
  if (!user) return false;
  return MANAGEMENT_ROLES.includes(user.role);
}

/** Check if user has a worker role */
export function isWorker(user: User | null | undefined): boolean {
  if (!user) return false;
  return WORKER_ROLES.includes(user.role);
}

/** Check if user has a specific permission (company role has all permissions) */
export function hasPermission(user: User | null | undefined, permission: string): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  return checkPermission(user, permission);
}

// ============================================================================
// FINANCIAL PERMISSIONS
// ============================================================================

/** Check if user has financial data access */
export function hasFinancialAccess(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  if (user.viewFinancialData === true) return true;
  return checkPermission(user, 'view_financial_data');
}

/** Check if user can access payroll (delegates to financial access) */
export function canAccessPayroll(user: User | null | undefined): boolean {
  return hasFinancialAccess(user);
}

// ============================================================================
// OPERATIONS PERMISSIONS
// ============================================================================

/** Check if user can manage employees */
export function canManageEmployees(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  return checkPermission(user, 'view_employees');
}

/** Check if user can view performance analytics */
export function canViewPerformance(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  return checkPermission(user, 'view_analytics');
}

/** Check if user can view/manage job schedule */
export function canViewSchedule(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  return checkPermission(user, 'view_schedule');
}

// ============================================================================
// SAFETY PERMISSIONS
// ============================================================================

/** 
 * Check if user can view safety documents (incident reports, FLHA forms, rope access plans)
 * - Company owners always have access
 * - All other roles need explicit 'view_safety_documents' permission
 */
export function canViewSafetyDocuments(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  return checkPermission(user, 'view_safety_documents');
}

/**
 * Check if user can view Company Safety Rating (CSR)
 * - Company owners always have access
 * - Property managers always have access
 * - All other roles need explicit 'view_csr' permission
 */
export function canViewCSR(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  if (user.role === 'property_manager') return true;
  return checkPermission(user, 'view_csr');
}

/**
 * Check if user can view sensitive documents (Incident Reports, Damage Reports, COI, Equipment Inspections)
 * - Company owners always have access
 * - All other roles need explicit 'view_sensitive_documents' permission
 */
export function canViewSensitiveDocuments(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  return checkPermission(user, 'view_sensitive_documents');
}

// ============================================================================
// INVENTORY PERMISSIONS
// ============================================================================

/**
 * Check if user can access inventory/gear management (view)
 * - All employees can access the inventory page
 * - This allows employees to view gear and manage their own "My Kit"
 * - Residents and property managers are NOT allowed access
 * - Note: Adding/editing gear items still requires manage_inventory permission
 * - Note: Assigning gear to others still requires assign_gear permission
 */
export function canAccessInventory(user: User | null | undefined): boolean {
  if (!user) return false;
  // Only employees (including all worker and management roles) can view inventory
  // Explicitly exclude resident and property_manager roles
  if (user.role === 'resident' || user.role === 'property_manager') return false;
  // All other authenticated users (employees) can access inventory
  return EMPLOYEE_ROLES.includes(user.role);
}

/**
 * Check if user can manage inventory (add/edit/delete gear items)
 * - Company owners always have access
 * - All other roles need explicit 'manage_inventory' permission
 */
export function canManageInventory(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  return checkPermission(user, 'manage_inventory');
}

/**
 * Check if user can assign gear to employees
 * - Company owners always have access
 * - All other roles need explicit 'assign_gear' permission
 */
export function canAssignGear(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  return checkPermission(user, 'assign_gear');
}

/**
 * Check if user can view all gear assignments (team gear tab)
 * - Company owners always have access
 * - All other roles need explicit 'view_gear_assignments' permission
 */
export function canViewGearAssignments(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  return checkPermission(user, 'view_gear_assignments');
}

// ============================================================================
// SUBSCRIPTION / READ-ONLY MODE
// ============================================================================

/**
 * Check if user is in read-only mode based on subscription status
 * - Company role: check their Stripe subscription status
 * - Employees: check their parent company's subscription status
 * - Residents are NEVER in read-only mode
 */
export function isReadOnly(user: User | null | undefined): boolean {
  if (!user) return false;
  
  if (user.role === 'resident') {
    return false;
  }
  
  if (user.role === 'company') {
    if (!user.subscriptionStatus) return false;
    return !['active', 'trialing'].includes(user.subscriptionStatus);
  }
  
  if (!user.companySubscriptionStatus) return false;
  return !['active', 'trialing'].includes(user.companySubscriptionStatus);
}

// ============================================================================
// GROUPED PERMISSION OBJECTS (Alternative API)
// ============================================================================

/** 
 * Grouped permission checks for cleaner imports
 * Usage: permissions.financial.hasAccess(user) 
 */
export const permissions = {
  roles: {
    isManagement,
    isWorker,
    hasPermission,
  },
  financial: {
    hasAccess: hasFinancialAccess,
    canAccessPayroll,
  },
  operations: {
    canManageEmployees,
    canViewPerformance,
    canViewSchedule,
  },
  safety: {
    canViewDocuments: canViewSafetyDocuments,
    canViewCSR,
    canViewSensitiveDocuments,
  },
  inventory: {
    canAccess: canAccessInventory,
    canManage: canManageInventory,
    canAssignGear,
    canViewAssignments: canViewGearAssignments,
  },
  subscription: {
    isReadOnly,
  },
};
