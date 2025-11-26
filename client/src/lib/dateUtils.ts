/**
 * Timezone-safe date utilities
 * 
 * IMPORTANT: Date-only strings (YYYY-MM-DD) should NEVER be parsed with new Date(string)
 * because JavaScript interprets them as UTC midnight, which shifts back one day in negative timezones.
 * 
 * Instead, use these utilities which handle dates correctly in the user's local timezone.
 */

/**
 * Parse a date-only string (YYYY-MM-DD) into a Date object in LOCAL timezone.
 * This avoids the UTC parsing issue that causes date shifting.
 */
export function parseLocalDate(dateString: string): Date {
  if (!dateString) return new Date();
  const str = String(dateString).split('T')[0]; // Handle if datetime string passed
  const [year, month, day] = str.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Convert a Date object to a date-only string (YYYY-MM-DD) in LOCAL timezone.
 * This avoids the UTC conversion that toISOString() causes.
 */
export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date as a date-only string (YYYY-MM-DD) in LOCAL timezone.
 */
export function getTodayString(): string {
  return toLocalDateString(new Date());
}

/**
 * Add days to a date-only string and return the result as a date-only string.
 * Does all math in local timezone to avoid UTC shifting.
 */
export function addDaysToDateString(dateString: string, days: number): string {
  const date = parseLocalDate(dateString);
  date.setDate(date.getDate() + days);
  return toLocalDateString(date);
}

/**
 * Get the next day from a date-only string.
 * Useful for FullCalendar exclusive end dates.
 */
export function nextDateOnly(dateString: string): string {
  return addDaysToDateString(dateString, 1);
}

/**
 * Get the previous day from a date-only string.
 */
export function prevDateOnly(dateString: string): string {
  return addDaysToDateString(dateString, -1);
}

/**
 * Compare two date-only strings. Returns:
 * - negative if a < b
 * - 0 if a === b
 * - positive if a > b
 */
export function compareDateStrings(a: string, b: string): number {
  return a.localeCompare(b);
}

/**
 * Check if a date-only string falls within a range (inclusive).
 */
export function isDateInRange(dateStr: string, startStr: string, endStr: string): boolean {
  return dateStr >= startStr && dateStr <= endStr;
}

/**
 * Get the start of the week (Sunday or Monday) for a given date string.
 * @param dateString - The date-only string (YYYY-MM-DD)
 * @param weekStartsOn - 0 for Sunday, 1 for Monday (default: 0)
 */
export function getStartOfWeekString(dateString: string, weekStartsOn: 0 | 1 = 0): string {
  const date = parseLocalDate(dateString);
  const day = date.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  date.setDate(date.getDate() - diff);
  return toLocalDateString(date);
}

/**
 * Get the end of the week for a given date string.
 * @param dateString - The date-only string (YYYY-MM-DD)
 * @param weekStartsOn - 0 for Sunday, 1 for Monday (default: 0)
 */
export function getEndOfWeekString(dateString: string, weekStartsOn: 0 | 1 = 0): string {
  const startOfWeek = getStartOfWeekString(dateString, weekStartsOn);
  return addDaysToDateString(startOfWeek, 6);
}

/**
 * Format a date-only string for display using Intl.DateTimeFormat.
 */
export function formatLocalDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = parseLocalDate(dateString);
  return date.toLocaleDateString('en-US', options || { 
    month: 'numeric', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Format a date-only string in long format (e.g., "Monday, January 1, 2025")
 */
export function formatLocalDateLong(dateString: string): string {
  return formatLocalDate(dateString, { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Format a date-only string in medium format (e.g., "January 1, 2025")
 */
export function formatLocalDateMedium(dateString: string): string {
  return formatLocalDate(dateString, { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Format a date-only string in short format (e.g., "Jan 1, 2025")
 */
export function formatLocalDateShort(dateString: string): string {
  return formatLocalDate(dateString, { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Get an array of date-only strings between start and end (inclusive).
 */
export function getDateRangeStrings(startStr: string, endStr: string): string[] {
  const dates: string[] = [];
  let current = startStr;
  while (current <= endStr) {
    dates.push(current);
    current = addDaysToDateString(current, 1);
  }
  return dates;
}

/**
 * Check if a date string is today in local timezone.
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayString();
}

/**
 * Check if a date string is in the past (before today).
 */
export function isPastDate(dateString: string): boolean {
  return dateString < getTodayString();
}

/**
 * Check if a date string is in the future (after today).
 */
export function isFutureDate(dateString: string): boolean {
  return dateString > getTodayString();
}

/**
 * Get the day of week (0-6, Sunday-Saturday) for a date string.
 */
export function getDayOfWeek(dateString: string): number {
  return parseLocalDate(dateString).getDay();
}

/**
 * Format a datetime (ISO string or Date) for display in local timezone.
 */
export function formatDateTime(datetime: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof datetime === 'string' ? new Date(datetime) : datetime;
  return date.toLocaleString('en-US', options || {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format just the time part of a datetime for display.
 */
export function formatTime(datetime: string | Date): string {
  const date = typeof datetime === 'string' ? new Date(datetime) : datetime;
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Extract the date-only string from an ISO datetime string using LOCAL timezone.
 * This is the safe alternative to `isoString.split('T')[0]` which uses UTC.
 */
export function extractLocalDateFromISO(isoString: string): string {
  const date = new Date(isoString);
  return toLocalDateString(date);
}

/**
 * Combine a date-only string with a time string (HH:mm) to create a Date object.
 */
export function combineDateAndTime(dateString: string, timeString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

/**
 * Get the number of days between two date strings.
 */
export function daysBetween(startStr: string, endStr: string): number {
  const start = parseLocalDate(startStr);
  const end = parseLocalDate(endStr);
  const diffTime = end.getTime() - start.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}
