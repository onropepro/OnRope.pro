/**
 * Analytics utility for Google Tag Manager / GA4 event tracking
 * Events are pushed to the dataLayer and picked up by GTM
 */

// Extend window type to include dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

// Ensure dataLayer exists
function getDataLayer(): Record<string, unknown>[] {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    return window.dataLayer;
  }
  return [];
}

// Push event to dataLayer
function pushEvent(eventName: string, params?: Record<string, unknown>) {
  const dataLayer = getDataLayer();
  dataLayer.push({
    event: eventName,
    ...params,
  });
}

// ============================================
// AUTHENTICATION EVENTS
// ============================================

export function trackLogin(method: string = 'email') {
  pushEvent('login', {
    method,
  });
}

export function trackSignUp(method: string = 'email') {
  pushEvent('sign_up', {
    method,
  });
}

export function trackLogout() {
  pushEvent('logout');
}

// ============================================
// WORK SESSION EVENTS
// ============================================

export function trackWorkSessionStart(params: {
  projectId?: string;
  projectName?: string;
  employeeId?: string;
}) {
  // Only track if we have valid IDs
  if (!params.projectId || !params.employeeId) return;
  
  pushEvent('work_session_start', {
    project_id: params.projectId,
    project_name: params.projectName,
    employee_id: params.employeeId,
  });
}

export function trackWorkSessionEnd(params: {
  projectId?: string;
  projectName?: string;
  employeeId?: string;
  durationMinutes?: number;
}) {
  // Only track if we have valid IDs
  if (!params.projectId || !params.employeeId) return;
  
  pushEvent('work_session_end', {
    project_id: params.projectId,
    project_name: params.projectName,
    employee_id: params.employeeId,
    duration_minutes: params.durationMinutes,
  });
}

// ============================================
// SAFETY & COMPLIANCE EVENTS
// ============================================

export function trackHarnessInspection(params: {
  employeeId?: string;
  result: 'pass' | 'fail';
}) {
  // Only track if we have a valid employee ID
  if (!params.employeeId) return;
  
  pushEvent('harness_inspection_completed', {
    employee_id: params.employeeId,
    result: params.result,
  });
}

export function trackToolboxMeeting(params: {
  projectId?: string;
  attendeeCount: number;
}) {
  pushEvent('toolbox_meeting_created', {
    project_id: params.projectId,
    attendee_count: params.attendeeCount,
  });
}

export function trackFLHASubmission(params: {
  projectId: string;
  hazardCount?: number;
}) {
  pushEvent('flha_submitted', {
    project_id: params.projectId,
    hazard_count: params.hazardCount,
  });
}

export function trackIncidentReport(params: {
  projectId?: string;
  severity?: string;
  incidentType?: string;
}) {
  pushEvent('incident_report_filed', {
    project_id: params.projectId,
    severity: params.severity,
    incident_type: params.incidentType,
  });
}

export function trackMethodStatement(params: {
  projectId?: string;
}) {
  pushEvent('method_statement_created', {
    project_id: params.projectId,
  });
}

// ============================================
// SUBSCRIPTION & REVENUE EVENTS
// ============================================

export function trackPricingPageView(params?: {
  source?: string;
}) {
  pushEvent('pricing_page_view', {
    source: params?.source,
  });
}

export function trackCheckoutStart(params: {
  planTier: string;
  planPrice: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
}) {
  pushEvent('begin_checkout', {
    plan_tier: params.planTier,
    value: params.planPrice,
    currency: params.currency,
    billing_period: params.billingPeriod,
  });
}

export function trackSubscriptionPurchase(params: {
  planTier: string;
  planPrice: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  transactionId?: string;
}) {
  pushEvent('purchase', {
    plan_tier: params.planTier,
    value: params.planPrice,
    currency: params.currency,
    billing_period: params.billingPeriod,
    transaction_id: params.transactionId,
  });
}

export function trackAddOnPurchase(params: {
  addOnName: string;
  addOnPrice: number;
  currency: string;
}) {
  pushEvent('add_on_purchase', {
    add_on_name: params.addOnName,
    value: params.addOnPrice,
    currency: params.currency,
  });
}

// ============================================
// CORE FEATURE EVENTS
// ============================================

export function trackProjectCreated(params: {
  projectType?: string;
  clientId?: string;
}) {
  pushEvent('project_created', {
    project_type: params.projectType,
    client_id: params.clientId,
  });
}

export function trackEmployeeAdded(params: {
  role?: string;
}) {
  pushEvent('employee_added', {
    role: params.role,
  });
}

export function trackClientAdded() {
  pushEvent('client_added');
}

export function trackBuildingAdded(params?: {
  clientId?: string;
}) {
  pushEvent('building_added', {
    client_id: params?.clientId,
  });
}

export function trackQuoteCreated(params: {
  projectId?: string;
  quoteValue?: number;
  currency?: string;
}) {
  pushEvent('quote_created', {
    project_id: params.projectId,
    value: params.quoteValue,
    currency: params.currency,
  });
}

// ============================================
// DOCUMENT EVENTS
// ============================================

export function trackDocumentDownload(params: {
  documentType: string;
  documentId?: string;
}) {
  pushEvent('document_download', {
    document_type: params.documentType,
    document_id: params.documentId,
  });
}

export function trackDocumentSigned(params: {
  documentType: string;
  documentId?: string;
}) {
  pushEvent('document_signed', {
    document_type: params.documentType,
    document_id: params.documentId,
  });
}

// ============================================
// NAVIGATION / ENGAGEMENT EVENTS
// ============================================

export function trackFeaturePageView(params: {
  featureName: string;
  pagePath?: string;
}) {
  pushEvent('feature_page_view', {
    feature_name: params.featureName,
    page_path: params.pagePath,
  });
}

// ============================================
// GENERIC EVENT (for custom tracking)
// ============================================

export function trackCustomEvent(eventName: string, params?: Record<string, unknown>) {
  pushEvent(eventName, params);
}
