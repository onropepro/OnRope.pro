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
import { users, projects, scheduledJobs, scheduledJobAssignments, gearItems, workSessions } from '@shared/schema';
import { eq, and, ilike, or, sql, gte, lte, desc } from 'drizzle-orm';
import { queryRAG } from './ragService';
import { generateChatResponse } from '../gemini';
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
  type: 'employee' | 'project' | 'schedule' | 'equipment' | 'safety';
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
  const assignments = await db.select({
    jobId: scheduledJobAssignments.scheduledJobId,
    startDate: scheduledJobAssignments.startDate,
    endDate: scheduledJobAssignments.endDate,
    projectId: scheduledJobs.projectId,
    projectName: projects.name,
    projectAddress: projects.buildingAddress,
  })
  .from(scheduledJobAssignments)
  .innerJoin(scheduledJobs, eq(scheduledJobAssignments.scheduledJobId, scheduledJobs.id))
  .innerJoin(projects, eq(scheduledJobs.projectId, projects.id))
  .where(
    and(
      eq(scheduledJobAssignments.employeeId, employeeId),
      eq(projects.companyId, companyId),
      gte(scheduledJobAssignments.endDate, format(dateRange.start, 'yyyy-MM-dd')),
      lte(scheduledJobAssignments.startDate, format(dateRange.end, 'yyyy-MM-dd'))
    )
  );
  
  return assignments.map(a => ({
    type: 'schedule' as const,
    title: a.projectName || 'Unnamed Project',
    subtitle: a.projectAddress || undefined,
    details: {
      'Start': a.startDate || '',
      'End': a.endDate || '',
    },
    link: `/projects/${a.projectId}`,
  }));
}

// Query active projects
async function queryActiveProjects(companyId: string, searchTerm?: string): Promise<DataResult[]> {
  let query = db.select({
    id: projects.id,
    name: projects.name,
    address: projects.buildingAddress,
    status: projects.status,
    jobType: projects.jobType,
  })
  .from(projects)
  .where(
    and(
      eq(projects.companyId, companyId),
      eq(projects.status, 'In Progress'),
      searchTerm ? ilike(projects.name, `%${searchTerm}%`) : undefined
    )
  )
  .orderBy(desc(projects.createdAt))
  .limit(10);
  
  const results = await query;
  
  return results.map(p => ({
    type: 'project' as const,
    title: p.name || 'Unnamed Project',
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
    projectName: projects.name,
    clockIn: workSessions.clockIn,
    clockOut: workSessions.clockOut,
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
  .orderBy(desc(workSessions.clockIn))
  .limit(20);
  
  return sessions.map(s => ({
    type: 'employee' as const,
    title: `${s.firstName} ${s.lastName}`,
    subtitle: s.projectName || 'Unknown project',
    details: {
      'Clocked In': s.clockIn ? format(new Date(s.clockIn), 'h:mm a') : 'N/A',
      'Status': s.clockOut ? 'Clocked out' : 'Working',
    },
    link: `/employees/${s.employeeId}`,
  }));
}

// Main query function
export async function queryAssistant(
  query: string,
  user: UserContext
): Promise<AssistantResult> {
  const companyId = user.companyId;
  if (!companyId) {
    return {
      type: 'no_results',
      answer: 'Unable to process your request. Please try again.',
      confidence: 'low',
    };
  }
  
  const intent = classifyIntent(query);
  const dateRange = parseDateReference(query);
  const extractedName = extractNameFromQuery(query);
  const lowerQuery = query.toLowerCase();
  
  // Handle knowledge-only queries
  if (intent === 'knowledge') {
    try {
      const ragResult = await queryRAG(query, []);
      return {
        type: 'knowledge',
        answer: ragResult.message,
        knowledgeSource: ragResult.sources[0] || undefined,
        actionLink: ragResult.sources[0] ? { 
          label: `Read ${ragResult.sources[0].title}`, 
          path: `/help/${ragResult.sources[0].slug}` 
        } : undefined,
        confidence: ragResult.sources.length > 0 ? 'high' : 'medium',
      };
    } catch (error) {
      console.error('[Assistant] RAG query failed:', error);
      return {
        type: 'no_results',
        answer: 'I couldn\'t find information about that. Try rephrasing your question.',
        confidence: 'low',
      };
    }
  }
  
  // Handle data lookup queries
  if (intent === 'data_lookup' || intent === 'hybrid') {
    let dataResults: DataResult[] = [];
    let answerText = '';
    
    // Employee schedule lookup
    if (extractedName && dateRange && hasDataAccess(user, 'schedule')) {
      const employee = await findEmployeeByName(companyId, extractedName);
      if (employee) {
        dataResults = await queryEmployeeSchedule(companyId, employee.id, dateRange);
        if (dataResults.length > 0) {
          const dateDesc = format(dateRange.start, 'EEEE, MMMM d');
          answerText = `${employee.firstName} ${employee.lastName} is scheduled for ${dataResults.length} project${dataResults.length > 1 ? 's' : ''} on ${dateDesc}.`;
        } else {
          answerText = `${employee.firstName} ${employee.lastName} has no scheduled work on ${format(dateRange.start, 'EEEE, MMMM d')}.`;
        }
      } else {
        answerText = `I couldn't find an employee named "${extractedName}" in your company.`;
      }
    }
    
    // Who's working today
    else if ((lowerQuery.includes('who') && (lowerQuery.includes('working') || lowerQuery.includes('clocked'))) ||
             lowerQuery.includes('on site') || lowerQuery.includes('active')) {
      if (hasDataAccess(user, 'employees')) {
        dataResults = await queryWorkingToday(companyId);
        if (dataResults.length > 0) {
          answerText = `${dataResults.length} employee${dataResults.length > 1 ? 's are' : ' is'} working today.`;
        } else {
          answerText = 'No employees have clocked in today yet.';
        }
      } else {
        answerText = 'You don\'t have permission to view employee work status.';
      }
    }
    
    // Active projects lookup
    else if (lowerQuery.includes('project') && (lowerQuery.includes('active') || lowerQuery.includes('current') || lowerQuery.includes('in progress'))) {
      dataResults = await queryActiveProjects(companyId);
      if (dataResults.length > 0) {
        answerText = `You have ${dataResults.length} active project${dataResults.length > 1 ? 's' : ''}.`;
      } else {
        answerText = 'You have no active projects at the moment.';
      }
    }
    
    // Hybrid: Data + knowledge
    if (intent === 'hybrid' && dataResults.length > 0) {
      try {
        const ragResult = await queryRAG(query, []);
        return {
          type: 'hybrid',
          answer: answerText,
          data: dataResults,
          knowledgeSource: ragResult.sources[0] || undefined,
          actionLink: ragResult.sources[0] ? { 
            label: `Learn more`, 
            path: `/help/${ragResult.sources[0].slug}` 
          } : undefined,
          confidence: 'high',
        };
      } catch (error) {
        // Continue with just data results
      }
    }
    
    if (answerText || dataResults.length > 0) {
      return {
        type: 'data',
        answer: answerText || 'Here\'s what I found.',
        data: dataResults.length > 0 ? dataResults : undefined,
        confidence: dataResults.length > 0 ? 'high' : 'medium',
      };
    }
  }
  
  // Navigation queries
  if (intent === 'navigation') {
    const navigationMap: Record<string, { path: string; label: string }> = {
      'schedule': { path: '/schedule', label: 'Open Schedule' },
      'calendar': { path: '/schedule', label: 'Open Calendar' },
      'project': { path: '/projects', label: 'View Projects' },
      'employee': { path: '/employees', label: 'View Employees' },
      'team': { path: '/employees', label: 'View Team' },
      'gear': { path: '/gear', label: 'View Gear Inventory' },
      'equipment': { path: '/gear', label: 'View Equipment' },
      'inventory': { path: '/gear', label: 'View Inventory' },
      'safety': { path: '/safety', label: 'View Safety' },
      'payroll': { path: '/payroll', label: 'View Payroll' },
      'timesheet': { path: '/timesheets', label: 'View Timesheets' },
      'quote': { path: '/quotes', label: 'View Quotes' },
      'client': { path: '/clients', label: 'View Clients' },
      'building': { path: '/buildings', label: 'View Buildings' },
      'help': { path: '/help', label: 'Open Help Center' },
      'settings': { path: '/settings', label: 'Open Settings' },
    };
    
    for (const [keyword, nav] of Object.entries(navigationMap)) {
      if (lowerQuery.includes(keyword)) {
        return {
          type: 'navigation',
          answer: `I can take you to the ${keyword} section.`,
          actionLink: nav,
          confidence: 'high',
        };
      }
    }
  }
  
  // Fallback to RAG if no data results
  try {
    const ragResult = await queryRAG(query, []);
    if (ragResult.sources.length > 0) {
      return {
        type: 'knowledge',
        answer: ragResult.message,
        knowledgeSource: ragResult.sources[0],
        actionLink: { 
          label: `Read ${ragResult.sources[0].title}`, 
          path: `/help/${ragResult.sources[0].slug}` 
        },
        confidence: 'medium',
      };
    }
  } catch (error) {
    console.error('[Assistant] Fallback RAG query failed:', error);
  }
  
  return {
    type: 'no_results',
    answer: 'I couldn\'t find specific information for that query. Try asking about your projects, schedule, employees, or type "help" to see what I can help with.',
    confidence: 'low',
  };
}
