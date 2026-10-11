// LOGIC FILE: do not change when restyling

/**
 * Returns today's local date formatted as YYYY-MM-DD.
 * Note: Never use .toISOString().slice(0, 10) as it converts to UTC and breaks around midnight.
 */
export function getLocalToday(): string {
  const now = new Date();
  return formatLocalDate(now);
}

/**
 * Format a Date object into local YYYY-MM-DD
 */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns yesterday's local date formatted as YYYY-MM-DD
 */
export function getLocalYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatLocalDate(d);
}

/**
 * Checks if a given YYYY-MM-DD is in the future relative to user's local date
 */
export function isFutureDate(dateStr: string): boolean {
  const today = getLocalToday();
  return dateStr > today;
}

/**
 * Parse YYYY-MM-DD into a local Date object (at 00:00:00 local time)
 */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/**
 * Returns the first and last day of a given month in YYYY-MM-DD
 * month is 0-indexed (0 = Jan, 11 = Dec)
 */
export function getMonthRange(year: number, month: number): { from: string; to: string } {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0); // last day of current month
  return {
    from: formatLocalDate(start),
    to: formatLocalDate(end),
  };
}

/**
 * Returns current month's start and end date in YYYY-MM-DD
 */
export function getCurrentMonthRange(): { from: string; to: string } {
  const now = new Date();
  return getMonthRange(now.getFullYear(), now.getMonth());
}

/**
 * Streak logic rule:
 * Streak is ALIVE only if last_entry_date >= (local today minus 1 day), otherwise show 0.
 */
export function isStreakAlive(lastEntryDate: string | null | undefined): boolean {
  if (!lastEntryDate) return false;
  const yesterday = getLocalYesterday();
  return lastEntryDate >= yesterday;
}
