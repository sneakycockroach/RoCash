// LOGIC FILE: do not change when restyling

// Currencies that do not use minor units (cents/pesewas)
export const ZERO_DECIMAL_CURRENCIES = new Set([
  'UGX', 'JPY', 'KRW', 'RWF', 'BIF', 'CLP', 'GNF', 'KMF', 'MGA', 'PYG', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
]);

/**
 * Checks if currency has no minor units
 */
export function hasNoDecimals(currencyCode = 'UGX'): boolean {
  return ZERO_DECIMAL_CURRENCIES.has(currencyCode.toUpperCase());
}

/**
 * Formats a money amount with currency prefix:
 * e.g. "UGX 12,500" or "USD 12.50"
 */
export function formatMoney(amount: number | string | null | undefined, currencyCode = 'UGX'): string {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(String(amount ?? 0));
  const safeAmount = isNaN(numericAmount) ? 0 : numericAmount;
  const noDecimals = hasNoDecimals(currencyCode);

  const rounded = noDecimals ? Math.round(safeAmount) : Math.round(safeAmount * 100) / 100;

  const formattedNum = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: noDecimals ? 0 : 2,
    maximumFractionDigits: noDecimals ? 0 : 2,
  }).format(rounded);

  return `${currencyCode.toUpperCase()} ${formattedNum}`;
}

/**
 * Format date for header (e.g. "SATURDAY 10 OCTOBER")
 */
export function formatHeaderDate(date: Date = new Date()): string {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  return `${weekday} ${day} ${month}`;
}

/**
 * Format entry time (e.g. "12:40")
 */
export function formatTime(isoString?: string): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * Friendly date text (e.g. "Today", "Yesterday", or "7 Oct")
 */
export function formatFriendlyDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const yestStr = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, '0')}-${String(yest.getDate()).padStart(2, '0')}`;

  if (dateStr === todayStr) return 'Today';
  if (dateStr === yestStr) return 'Yesterday';

  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}
