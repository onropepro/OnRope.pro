/**
 * Dashboard AI Assistant Service
 * 
 * Provides intelligent search capabilities combining:
 * 1. Company data queries (employees, projects, schedules, equipment, safety)
 * 2. RAG knowledge base for /help content
 * 
 * Key principles:
 * - Multi-tenant isolation: Always filter by companyId
 * - Permission-aware: Respect user role and permissions
 * - No hallucination: Only return verified data
 * - Fast: Target <1 second response time
 */

import { db } from '../db';
import { users, projects, scheduledJobs, jobAssignments, gearItems, workSessions, companyDocuments } from '@shared/schema';
import { eq, and, ilike, or, sql, gte, lte, desc, count } from 'drizzle-orm';
import { queryRAG } from './ragService';
import { generateChatResponse } from '../gemini';
import { storage } from '../storage';
import { 
  addDays, 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  format, 
  parse,
  nextMonday,
  nextTuesday,
  nextWednesday,
  nextThursday,
  nextFriday,
  nextSaturday,
  nextSunday,
  isValid
} from 'date-fns';

// Result types for structured responses
export interface AssistantResult {
  type: 'data' | 'knowledge' | 'hybrid' | 'navigation' | 'no_results';
  answer: string;
  data?: DataResult[];
  knowledgeSource?: { title: string; slug: string };
  actionLink?: { label: string; path: string };
  confidence: 'high' | 'medium' | 'low';
}

export interface DataResult {
  type: 'employee' | 'project' | 'schedule' | 'equipment' | 'safety' | 'knowledge';
  title: string;
  subtitle?: string;
  details?: Record<string, string>;
  link?: string;
}

interface UserContext {
  id: string;
  companyId: string;
  role: string;
  permissions: string[];
}

// Check if user can view schedules of other employees
function canViewOtherEmployeeSchedules(user: UserContext): boolean {
  if (user.role === 'company') return true;
  return user.permissions.includes('view_full_schedule') || 
         user.permissions.includes('view_employees');
}

// Natural language date parsing
function parseDateReference(query: string): { start: Date; end: Date } | null {
  const lowerQuery = query.toLowerCase();
  const today = new Date();
  
  // Relative day references
  if (lowerQuery.includes('today')) {
    return { start: startOfDay(today), end: endOfDay(today) };
  }
  if (lowerQuery.includes('tomorrow')) {
    const tomorrow = addDays(today, 1);
    return { start: startOfDay(tomorrow), end: endOfDay(tomorrow) };
  }
  if (lowerQuery.includes('yesterday')) {
    const yesterday = addDays(today, -1);
    return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
  }
  
  // Week references
  if (lowerQuery.includes('this week')) {
    return { start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeek(today, { weekStartsOn: 1 }) };
  }
  if (lowerQuery.includes('next week')) {
    const nextWeekStart = addDays(startOfWeek(today, { weekStartsOn: 1 }), 7);
    return { start: nextWeekStart, end: addDays(nextWeekStart, 6) };
  }
  
  // Day of week references (next Tuesday, etc.)
  const dayMatches = lowerQuery.match(/next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
  if (dayMatches) {
    const dayName = dayMatches[1].toLowerCase();
    let targetDate: Date;
    switch (dayName) {
      case 'monday': targetDate = nextMonday(today); break;
      case 'tuesday': targetDate = nextTuesday(today); break;
      case 'wednesday': targetDate = nextWednesday(today); break;
      case 'thursday': targetDate = nextThursday(today); break;
      case 'friday': targetDate = nextFriday(today); break;
      case 'saturday': targetDate = nextSaturday(today); break;
      case 'sunday': targetDate = nextSunday(today); break;
      default: return null;
    }
    return { start: startOfDay(targetDate), end: endOfDay(targetDate) };
  }
  
  // Just day name without "next" - assume this week or next occurrence
  const justDayMatch = lowerQuery.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  if (justDayMatch) {
    const dayName = justDayMatch[1].toLowerCase();
    let targetDate: Date;
    switch (dayName) {
      case 'monday': targetDate = nextMonday(today); break;
      case 'tuesday': targetDate = nextTuesday(today); break;
      case 'wednesday': targetDate = nextWednesday(today); break;
      case 'thursday': targetDate = nextThursday(today); break;
      case 'friday': targetDate = nextFriday(today); break;
      case 'saturday': targetDate = nextSaturday(today); break;
      case 'sunday': targetDate = nextSunday(today); break;
      default: return null;
    }
    return { start: startOfDay(targetDate), end: endOfDay(targetDate) };
  }
  
  return null;
}

// Extract potential employee names from query
function extractNameFromQuery(query: string): string | null {
  // Common patterns: "What is [Name] working on", "Where is [Name]", "[Name]'s schedule"
  const patterns = [
    /what (?:is|are) (\w+(?:\s+\w+)?)\s+(?:working|doing|assigned|scheduled)/i,
    /where (?:is|are) (\w+(?:\s+\w+)?)\s+(?:working|today|tomorrow|this week)/i,
    /(\w+(?:\s+\w+)?)'s?\s+(?:schedule|projects?|assignments?)/i,
    /(?:find|show|get)\s+(\w+(?:\s+\w+)?)'s?\s+/i,
    /(?:who is|what about)\s+(\w+(?:\s+\w+)?)/i,
  ];
  
  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match) {
      const name = match[1].trim();
      // Filter out common words that aren't names
      const stopWords = ['the', 'my', 'our', 'their', 'his', 'her', 'everyone', 'anybody', 'someone'];
      if (!stopWords.includes(name.toLowerCase())) {
        return name;
      }
    }
  }
  
  return null;
}

// Classify the intent of the query
function classifyIntent(query: string): 'data_lookup' | 'knowledge' | 'navigation' | 'hybrid' {
  const lowerQuery = query.toLowerCase();
  
  // Knowledge/how-to queries
  const knowledgePatterns = [
    /how (?:do|can|to|should)/i,
    /what is (?:the|a|an)?\s*(?:csr|company safety|safety rating)/i,
    /improve|increase|boost|raise/i,
    /explain|understand|learn|help/i,
    /best practice|recommendation/i,
    /where (?:do|can) i\s+(?:find|see|access|create)/i,
  ];
  
  // Data lookup queries
  const dataPatterns = [
    /who is|what is \w+ working/i,
    /where is \w+/i,
    /\w+'s? schedule/i,
    /clocked in|working today|on site/i,
    /assigned to|working on/i,
    /how many|count|total/i,
    /list|show me|find all/i,
    /upcoming|scheduled|this week|next week|today|tomorrow/i,
  ];
  
  // Navigation queries
  const navigationPatterns = [
    /where (?:do|can) i (?:go|find|access|see)/i,
    /take me to|go to|open/i,
    /navigate to|show me the/i,
  ];
  
  const hasKnowledge = knowledgePatterns.some(p => p.test(lowerQuery));
  const hasData = dataPatterns.some(p => p.test(lowerQuery));
  const hasNavigation = navigationPatterns.some(p => p.test(lowerQuery));
  
  if (hasNavigation && !hasData && !hasKnowledge) return 'navigation';
  if (hasKnowledge && hasData) return 'hybrid';
  if (hasKnowledge) return 'knowledge';
  return 'data_lookup';
}

// Check if user has permission for specific data type
function hasDataAccess(user: UserContext, dataType: string): boolean {
  if (user.role === 'company') return true;
  
  switch (dataType) {
    case 'employees':
      return user.permissions.includes('view_employees') || user.role === 'company';
    case 'schedule':
      return user.permissions.includes('view_full_schedule') || 
             user.permissions.includes('view_own_schedule') ||
             user.role === 'company';
    case 'financial':
      return user.permissions.includes('view_financial_data') || user.role === 'company';
    case 'safety':
      return user.permissions.includes('view_safety_documents') || user.role === 'company';
    case 'gear':
      return true; // All employees can view gear
    default:
      return false;
  }
}

// Find employee by name (fuzzy match)
async function findEmployeeByName(companyId: string, name: string): Promise<{ id: string; firstName: string; lastName: string } | null> {
  const nameParts = name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;
  
  let query = db.select({
    id: users.id,
    firstName: users.firstName,
    lastName: users.lastName,
  })
  .from(users)
  .where(
    and(
      eq(users.companyId, companyId),
      or(
        ilike(users.firstName, `%${firstName}%`),
        lastName ? ilike(users.lastName, `%${lastName}%`) : undefined,
        ilike(sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`, `%${name}%`)
      )
    )
  )
  .limit(1);
  
  const results = await query;
  return results[0] || null;
}

// Query employee schedule
async function queryEmployeeSchedule(companyId: string, employeeId: string, dateRange: { start: Date; end: Date }): Promise<DataResult[]> {
  try {
    const assignments = await db.select({
      jobId: jobAssignments.jobId,
      startDate: jobAssignments.startDate,
      endDate: jobAssignments.endDate,
      projectId: scheduledJobs.projectId,
      jobTitle: scheduledJobs.title,
      jobLocation: scheduledJobs.location,
      companyId: scheduledJobs.companyId,
    })
    .from(jobAssignments)
    .innerJoin(scheduledJobs, eq(jobAssignments.jobId, scheduledJobs.id))
    .where(
      and(
        eq(jobAssignments.employeeId, employeeId),
        eq(scheduledJobs.companyId, companyId)
      )
    )
    .limit(20);
    
    // Filter by date range in JavaScript to avoid timestamp comparison issues
    const filteredAssignments = assignments.filter(a => {
      if (!a.startDate || !a.endDate) return false;
      const jobStart = new Date(a.startDate);
      const jobEnd = new Date(a.endDate);
      // Job overlaps with date range if: job ends after range starts AND job starts before range ends
      return jobEnd >= dateRange.start && jobStart <= dateRange.end;
    });
    
    return filteredAssignments.map(a => ({
      type: 'schedule' as const,
      title: a.jobTitle || 'Scheduled Work',
      subtitle: a.jobLocation || undefined,
      details: {
        'Start': a.startDate ? format(new Date(a.startDate), 'MMM d') : 'TBD',
        'End': a.endDate ? format(new Date(a.endDate), 'MMM d') : 'TBD',
      },
      link: a.projectId ? `/projects/${a.projectId}` : `/schedule`,
    }));
  } catch (error) {
    console.error('[Assistant] Schedule query error:', error);
    return [];
  }
}

// Query active projects
async function queryActiveProjects(companyId: string, searchTerm?: string): Promise<DataResult[]> {
  let query = db.select({
    id: projects.id,
    buildingName: projects.buildingName,
    address: projects.buildingAddress,
    status: projects.status,
    jobType: projects.jobType,
  })
  .from(projects)
  .where(
    and(
      eq(projects.companyId, companyId),
      eq(projects.status, 'In Progress'),
      searchTerm ? ilike(projects.buildingName, `%${searchTerm}%`) : undefined
    )
  )
  .orderBy(desc(projects.createdAt))
  .limit(10);
  
  const results = await query;
  
  return results.map(p => ({
    type: 'project' as const,
    title: p.buildingName || 'Unnamed Project',
    subtitle: p.address || undefined,
    details: {
      'Status': p.status || 'Unknown',
      'Type': p.jobType || 'Unknown',
    },
    link: `/projects/${p.id}`,
  }));
}

// Query who's working today
async function queryWorkingToday(companyId: string): Promise<DataResult[]> {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const sessions = await db.select({
    employeeId: workSessions.employeeId,
    firstName: users.firstName,
    lastName: users.lastName,
    projectBuildingName: projects.buildingName,
    startTime: workSessions.startTime,
    endTime: workSessions.endTime,
  })
  .from(workSessions)
  .innerJoin(users, eq(workSessions.employeeId, users.id))
  .innerJoin(projects, eq(workSessions.projectId, projects.id))
  .where(
    and(
      eq(workSessions.companyId, companyId),
      eq(workSessions.workDate, today)
    )
  )
  .orderBy(desc(workSessions.startTime))
  .limit(20);
  
  return sessions.map(s => ({
    type: 'employee' as const,
    title: `${s.firstName} ${s.lastName}`,
    subtitle: s.projectBuildingName || 'Unknown project',
    details: {
      'Clocked In': s.startTime ? format(new Date(s.startTime), 'h:mm a') : 'N/A',
      'Status': s.endTime ? 'Clocked out' : 'Working',
    },
    link: `/employees/${s.employeeId}`,
  }));
}

// Query company's actual CSR data - uses same logic as the CSR API endpoint
async function queryCompanyCSR(companyId: string): Promise<{
  score: number;
  label: string;
  missingDocs: string[];
  suggestions: string[];
} | null> {
  try {
    const docs = await storage.getCompanyDocuments(companyId);
    
    const hasHealthSafety = docs.some((d: any) => d.documentType === 'health_safety_manual');
    const hasCompanyPolicy = docs.some((d: any) => d.documentType === 'company_policy');
    const hasInsurance = docs.some((d: any) => d.documentType === 'certificate_of_insurance');
    
    const docsUploaded = (hasHealthSafety ? 1 : 0) + (hasCompanyPolicy ? 1 : 0) + (hasInsurance ? 1 : 0);
    
    // Simplified CSR calculation matching the actual API logic
    // New companies start at 75% and can reach 100% by uploading 3 core documents
    const documentationPoints = Math.round((docsUploaded / 3) * 100) / 100;
    const documentationPenalty = Math.round((1 - documentationPoints) * 25);
    const baseScore = Math.max(0, Math.min(100, 100 - documentationPenalty));
    
    const missingDocs: string[] = [];
    const suggestions: string[] = [];
    
    if (!hasHealthSafety) {
      missingDocs.push('Health & Safety Manual');
      suggestions.push('Upload your Health & Safety Manual in Documents');
    }
    if (!hasCompanyPolicy) {
      missingDocs.push('Company Policy');
      suggestions.push('Upload your Company Policy in Documents');
    }
    if (!hasInsurance) {
      missingDocs.push('Certificate of Insurance (COI)');
      suggestions.push('Upload your Certificate of Insurance in Documents');
    }
    
    // Add project-specific suggestions
    if (missingDocs.length === 0) {
      suggestions.push('Complete Toolbox Meetings for all active projects');
      suggestions.push('Upload FLHA forms for each work session');
    }
    
    let label = 'Critical';
    if (baseScore >= 90) label = 'Excellent';
    else if (baseScore >= 70) label = 'Good';
    else if (baseScore >= 50) label = 'Warning';
    
    console.log(`[Assistant] CSR query for company ${companyId}: score=${baseScore}, docs=${docsUploaded}/3`);
    
    return { score: baseScore, label, missingDocs, suggestions };
  } catch (error) {
    console.error('[Assistant] CSR query error:', error);
    return null;
  }
}

// Main query function - accepts individual parameters for flexibility
export async function queryAssistant(
  query: string,
  companyId: string,
  userId: string,
  role: string,
  permissions: string[]
): Promise<{ response: string; results: DataResult[]; suggestions: string[]; category?: string }> {
  // Validate companyId to ensure multi-tenant isolation
  if (!companyId || typeof companyId !== 'string') {
    return {
      response: 'Unable to process your request.',
      results: [],
      suggestions: ['Try asking about your projects', 'Ask who is working today'],
    };
  }
  
  // Create user context with properly passed role, id, and permissions
  // SECURITY: Never infer role from permissions - always use the authenticated role
  const user: UserContext = {
    id: userId || '',
    companyId,
    role: role || 'employee', // Default to employee (most restrictive) if role is missing
    permissions: Array.isArray(permissions) ? permissions : [],
  };
  
  try {
    const intent = classifyIntent(query);
    const dateRange = parseDateReference(query);
    const extractedName = extractNameFromQuery(query);
    const lowerQuery = query.toLowerCase();
    
    let dataResults: DataResult[] = [];
    let responseText = '';
    const suggestions: string[] = [];
    
    // Handle knowledge-only queries
    if (intent === 'knowledge') {
      // Check if query is about CSR - include company-specific data FIRST
      const isCSRQuery = lowerQuery.includes('csr') || 
                        lowerQuery.includes('safety rating') || 
                        lowerQuery.includes('compliance score') ||
                        lowerQuery.includes('company safety');
      
      let companyContext = '';
      let csrSuggestions: string[] = [];
      
      // Always fetch company CSR data for CSR queries - do this before RAG
      if (isCSRQuery) {
        try {
          const csrData = await queryCompanyCSR(companyId);
          if (csrData) {
            companyContext = `**Your Company's CSR:** ${csrData.score}% (${csrData.label})\n\n`;
            
            if (csrData.missingDocs.length > 0) {
              companyContext += `**Missing Documents:** ${csrData.missingDocs.join(', ')}\n\n`;
              csrSuggestions = csrData.suggestions;
            } else {
              companyContext += `All core company documents are uploaded.\n\n`;
            }
            companyContext += `---\n\n`;
          }
        } catch (csrError) {
          console.error('[Assistant] CSR query failed:', csrError);
        }
      }
      
      // Try RAG query for general help content
      try {
        const ragResult = await queryRAG(query, []);
        const baseResponse = ragResult.message || 'Here\'s what I found in our help center.';
        
        return {
          response: companyContext + baseResponse,
          results: ragResult.sources.map(s => ({
            type: 'knowledge' as const,
            title: s.title,
            subtitle: 'Help Article',
            link: `/help/${s.slug}`,
          })),
          suggestions: csrSuggestions.length > 0 ? csrSuggestions : ['How do I improve CSR?', 'What is IRATA certification?'],
          category: isCSRQuery ? 'hybrid' : 'knowledge',
        };
      } catch (error) {
        console.error('[Assistant] RAG query failed:', error);
        // Even if RAG fails, return company context if we have it
        if (companyContext) {
          return {
            response: companyContext + 'For more details about CSR, visit the Safety & Compliance section in Help.',
            results: [],
            suggestions: csrSuggestions.length > 0 ? csrSuggestions : ['How do I improve CSR?'],
            category: 'hybrid',
          };
        }
        return {
          response: 'I couldn\'t find information about that in our help center.',
          results: [],
          suggestions: ['Try asking about your projects', 'Ask who is working today'],
        };
      }
    }
    
    // Handle data lookup queries - check permissions BEFORE querying
    if (intent === 'data_lookup' || intent === 'hybrid') {
      // Employee schedule lookup - requires appropriate schedule permission
      if (extractedName && dateRange) {
        const employee = await findEmployeeByName(companyId, extractedName);
        if (employee) {
          // SECURITY: Check if user can view this employee's schedule
          // Allow if: 1) They're a company owner/manager, 2) They have full schedule access, OR 3) They're viewing their own schedule
          const isViewingSelf = employee.id === user.id;
          const canView = canViewOtherEmployeeSchedules(user) || isViewingSelf;
          
          if (!canView) {
            return {
              response: 'You don\'t have permission to view other employees\' schedules. You can only view your own schedule.',
              results: [],
              suggestions: ['What is my schedule this week?', 'Show active projects'],
            };
          }
          
          dataResults = await queryEmployeeSchedule(companyId, employee.id, dateRange);
          if (dataResults.length > 0) {
            const dateDesc = format(dateRange.start, 'EEEE, MMMM d');
            responseText = `${employee.firstName} ${employee.lastName} is scheduled for ${dataResults.length} assignment${dataResults.length > 1 ? 's' : ''} on ${dateDesc}.`;
          } else {
            responseText = `${employee.firstName} ${employee.lastName} has no scheduled work on ${format(dateRange.start, 'EEEE, MMMM d')}.`;
          }
        } else {
          responseText = `I couldn't find an employee named "${extractedName}" in your company.`;
        }
        suggestions.push('Who is working today?', 'Show active projects');
      }
      
      // Who's working today - requires employees permission
      else if ((lowerQuery.includes('who') && (lowerQuery.includes('working') || lowerQuery.includes('clocked'))) ||
               lowerQuery.includes('on site') || lowerQuery.includes('active technician')) {
        if (!hasDataAccess(user, 'employees')) {
          return {
            response: 'You don\'t have permission to view employee work status.',
            results: [],
            suggestions: ['Ask about active projects', 'Check the help center'],
          };
        }
        
        dataResults = await queryWorkingToday(companyId);
        if (dataResults.length > 0) {
          responseText = `${dataResults.length} employee${dataResults.length > 1 ? 's are' : ' is'} working today.`;
        } else {
          responseText = 'No employees have clocked in today yet.';
        }
        suggestions.push('Show active projects', 'What is the schedule for this week?');
      }
      
      // Active projects lookup - all authenticated users can view projects they're assigned to
      else if (lowerQuery.includes('project') && (lowerQuery.includes('active') || lowerQuery.includes('current') || lowerQuery.includes('in progress') || lowerQuery.includes('list'))) {
        // Projects are visible to all company members (multi-tenant isolation is handled by companyId filter)
        dataResults = await queryActiveProjects(companyId);
        if (dataResults.length > 0) {
          responseText = `You have ${dataResults.length} active project${dataResults.length > 1 ? 's' : ''}.`;
        } else {
          responseText = 'You have no active projects at the moment.';
        }
        suggestions.push('Who is working today?', 'How do I create a project?');
      }
      
      if (responseText || dataResults.length > 0) {
        return {
          response: responseText || 'Here\'s what I found.',
          results: dataResults,
          suggestions,
          category: 'data',
        };
      }
    }
    
    // Navigation queries
    if (intent === 'navigation') {
      const navigationMap: Record<string, { path: string; label: string }> = {
        'schedule': { path: '/schedule', label: 'Schedule' },
        'calendar': { path: '/schedule', label: 'Calendar' },
        'project': { path: '/projects', label: 'Projects' },
        'employee': { path: '/employees', label: 'Employees' },
        'team': { path: '/employees', label: 'Team' },
        'gear': { path: '/gear', label: 'Gear Inventory' },
        'equipment': { path: '/gear', label: 'Equipment' },
        'safety': { path: '/safety', label: 'Safety' },
        'payroll': { path: '/payroll', label: 'Payroll' },
        'timesheet': { path: '/timesheets', label: 'Timesheets' },
        'quote': { path: '/quotes', label: 'Quotes' },
        'client': { path: '/clients', label: 'Clients' },
        'building': { path: '/buildings', label: 'Buildings' },
        'help': { path: '/help', label: 'Help Center' },
        'settings': { path: '/settings', label: 'Settings' },
      };
      
      for (const [keyword, nav] of Object.entries(navigationMap)) {
        if (lowerQuery.includes(keyword)) {
          return {
            response: `You can access ${nav.label} from here.`,
            results: [{
              type: 'knowledge' as const,
              title: nav.label,
              subtitle: 'Navigation',
              link: nav.path,
            }],
            suggestions: ['Show active projects', 'Who is working today?'],
            category: 'navigation',
          };
        }
      }
    }
    
    // Fallback to RAG if no data results
    try {
      const ragResult = await queryRAG(query, []);
      if (ragResult.sources.length > 0) {
        return {
          response: ragResult.message,
          results: ragResult.sources.map(s => ({
            type: 'knowledge' as const,
            title: s.title,
            subtitle: 'Help Article',
            link: `/help/${s.slug}`,
          })),
          suggestions: ['Who is working today?', 'Show active projects'],
          category: 'knowledge',
        };
      }
    } catch (error) {
      console.error('[Assistant] Fallback RAG query failed:', error);
    }
    
    return {
      response: 'I couldn\'t find specific information for that. Try asking about your projects, schedule, or employees.',
      results: [],
      suggestions: ['Who is working today?', 'Show active projects', 'How do I improve CSR?'],
    };
  } catch (error) {
    console.error('[Assistant] Query processing error:', error);
    return {
      response: 'Something went wrong while processing your question. Please try again.',
      results: [],
      suggestions: ['Who is working today?', 'Show active projects'],
    };
  }
}
