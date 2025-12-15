import { toZonedTime, fromZonedTime, format } from 'date-fns-tz';

const DEFAULT_TIMEZONE = 'America/Vancouver';

export interface DayBounds {
  startOfDay: Date;
  endOfDay: Date;
}

export function getProjectTimezone(project: { timezone?: string | null }, company: { timezone?: string | null }): string {
  return project.timezone || company.timezone || DEFAULT_TIMEZONE;
}

export function getZonedDayBounds(timezone: string, referenceDate?: Date): DayBounds {
  const now = referenceDate || new Date();
  
  const zonedNow = toZonedTime(now, timezone);
  const year = zonedNow.getFullYear();
  const month = zonedNow.getMonth();
  const day = zonedNow.getDate();
  
  const startOfDayString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00`;
  const endOfDayString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T23:59:59.999`;
  
  const startOfDay = fromZonedTime(startOfDayString, timezone);
  const endOfDay = fromZonedTime(endOfDayString, timezone);
  
  return { startOfDay, endOfDay };
}

export function toProjectZonedDate(utcDate: Date, timezone: string): Date {
  return toZonedTime(utcDate, timezone);
}

export function fromProjectZonedDate(zonedDate: Date, timezone: string): Date {
  return fromZonedTime(zonedDate, timezone);
}

export function formatInTimezone(date: Date, timezone: string, formatStr: string): string {
  const zonedDate = toZonedTime(date, timezone);
  return format(zonedDate, formatStr, { timeZone: timezone });
}

export function formatDateTimeInTimezone(date: Date, timezone: string): string {
  return formatInTimezone(date, timezone, 'MMM d, yyyy h:mm a');
}

export function formatTimeInTimezone(date: Date, timezone: string): string {
  return formatInTimezone(date, timezone, 'h:mm a');
}

export function formatDateInTimezone(date: Date, timezone: string): string {
  return formatInTimezone(date, timezone, 'MMM d, yyyy');
}

export const COMMON_TIMEZONES = [
  { value: 'America/Vancouver', label: 'Pacific Time (Vancouver)' },
  { value: 'America/Edmonton', label: 'Mountain Time (Edmonton)' },
  { value: 'America/Winnipeg', label: 'Central Time (Winnipeg)' },
  { value: 'America/Toronto', label: 'Eastern Time (Toronto)' },
  { value: 'America/Halifax', label: 'Atlantic Time (Halifax)' },
  { value: 'America/St_Johns', label: 'Newfoundland Time (St. Johns)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)' },
  { value: 'America/Denver', label: 'Mountain Time (Denver)' },
  { value: 'America/Chicago', label: 'Central Time (Chicago)' },
  { value: 'America/New_York', label: 'Eastern Time (New York)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (London)' },
  { value: 'Europe/Paris', label: 'Central European Time (Paris)' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (Dubai)' },
  { value: 'Asia/Singapore', label: 'Singapore Time' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (Tokyo)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (Sydney)' },
  { value: 'Pacific/Auckland', label: 'New Zealand Time (Auckland)' },
];
