/**
 * Server-side timezone-safe date utilities
 * 
 * These utilities help handle dates correctly across timezones.
 * The key principle is to work with date-only strings (YYYY-MM-DD) for calendar dates
 * and avoid Date object conversions that can shift dates across timezone boundaries.
 */

/**
 * Get today's date as YYYY-MM-DD string in local timezone
 */
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert a Date object to YYYY-MM-DD string in local timezone
 * This is the safe alternative to date.toISOString().split('T')[0]
 */
export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a date-only string (YYYY-MM-DD) into a Date at local midnight
 * This avoids the UTC parsing issue of new Date('YYYY-MM-DD')
 */
export function parseLocalDate(dateString: string): Date {
  if (!dateString) return new Date();
  const str = String(dateString).split('T')[0];
  const [year, month, day] = str.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Add days to a date-only string and return the result as YYYY-MM-DD
 */
export function addDaysToDateString(dateString: string, days: number): string {
  const date = parseLocalDate(dateString);
  date.setDate(date.getDate() + days);
  return toLocalDateString(date);
}

/**
 * Get the start of the week (Sunday or Monday) for a given date
 * @param date - The Date object
 * @param weekStartsOn - 0 for Sunday, 1 for Monday (default: 0)
 */
export function getStartOfWeek(date: Date, weekStartsOn: 0 | 1 = 0): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  const day = result.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  result.setDate(result.getDate() - diff);
  return result;
}

/**
 * Get the end of the week for a given date
 * @param date - The Date object
 * @param weekStartsOn - 0 for Sunday, 1 for Monday (default: 0)
 */
export function getEndOfWeek(date: Date, weekStartsOn: 0 | 1 = 0): Date {
  const result = getStartOfWeek(date, weekStartsOn);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Extract date-only string from an ISO datetime string
 * This correctly handles the datetime by first parsing it and then 
 * extracting the local date components.
 */
export function extractLocalDateFromISO(isoString: string): string {
  const date = new Date(isoString);
  return toLocalDateString(date);
}

/**
 * Check if two Date objects are the same calendar day in local timezone
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

/**
 * Check if a date-only string is within a range (inclusive)
 */
export function isDateInRange(dateStr: string, startStr: string, endStr: string): boolean {
  return dateStr >= startStr && dateStr <= endStr;
}

/**
 * Get number of days between two date-only strings
 */
export function daysBetween(startStr: string, endStr: string): number {
  const start = parseLocalDate(startStr);
  const end = parseLocalDate(endStr);
  const diffTime = end.getTime() - start.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}
