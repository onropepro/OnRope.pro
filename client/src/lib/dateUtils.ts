export function parseLocalDate(dateString: string): Date {
  if (!dateString) return new Date();
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatLocalDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = parseLocalDate(dateString);
  return date.toLocaleDateString('en-US', options || { 
    month: 'numeric', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export function formatLocalDateLong(dateString: string): string {
  return formatLocalDate(dateString, { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export function formatLocalDateMedium(dateString: string): string {
  return formatLocalDate(dateString, { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}
