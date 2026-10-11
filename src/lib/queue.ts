// LOGIC FILE: do not change when restyling

import { upsertEntry, deleteEntry, type CreateEntryInput } from './api/entries';
import { addNoSpendDay, deleteNoSpendDay } from './api/noSpend';

export type QueueOpType = 'add_entry' | 'delete_entry' | 'add_no_spend' | 'delete_no_spend';

export interface QueueItem {
  id: string;
  type: QueueOpType;
  payload: any;
  createdAt: string;
  retryCount: number;
}

export interface QueueErrorRecord {
  id: string;
  itemId: string;
  opType: QueueOpType;
  message: string;
  timestamp: string;
}

const QUEUE_STORAGE_KEY = 'rocash.queue.v1';
const ERRORS_STORAGE_KEY = 'rocash.errors.v1';

type QueueListener = (items: QueueItem[]) => void;
type ErrorListener = (errors: QueueErrorRecord[]) => void;

let listeners: QueueListener[] = [];
let errorListeners: ErrorListener[] = [];
let isFlushing = false;
let flushTimer: any = null;

export function getQueue(): QueueItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(items: QueueItem[]): void {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save offline queue', e);
  }
  listeners.forEach((l) => l(items));
  checkFlushInterval();
}

export function getRecentErrors(): QueueErrorRecord[] {
  try {
    const raw = localStorage.getItem(ERRORS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logError(itemId: string, opType: QueueOpType, message: string): void {
  try {
    const existing = getRecentErrors();
    const updated = [
      {
        id: crypto.randomUUID(),
        itemId,
        opType,
        message,
        timestamp: new Date().toISOString(),
      },
      ...existing,
    ].slice(0, 20); // Keep last 20 errors
    localStorage.setItem(ERRORS_STORAGE_KEY, JSON.stringify(updated));
    errorListeners.forEach((l) => l(updated));
  } catch (e) {
    console.error('Failed to log error', e);
  }
}

export function subscribeQueue(listener: QueueListener): () => void {
  listeners.push(listener);
  listener(getQueue());
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function subscribeErrors(listener: ErrorListener): () => void {
  errorListeners.push(listener);
  listener(getRecentErrors());
  return () => {
    errorListeners = errorListeners.filter((l) => l !== listener);
  };
}

/**
 * Enqueue an operation
 */
export function enqueueOperation(type: QueueOpType, payload: any): QueueItem {
  const item: QueueItem = {
    id: crypto.randomUUID(),
    type,
    payload,
    createdAt: new Date().toISOString(),
    retryCount: 0,
  };

  const queue = getQueue();
  queue.push(item);
  saveQueue(queue);

  // Trigger flush attempt
  flushQueue().catch(() => {});
  return item;
}

function isClientError(error: any): boolean {
  if (!error) return false;
  // Supabase error codes or HTTP status 4xx
  const status = error.status || error.statusCode || (error.code && parseInt(error.code, 10));
  if (typeof status === 'number' && status >= 400 && status < 500) {
    return true;
  }
  const msg = String(error.message || '').toLowerCase();
  if (
    msg.includes('invalid') ||
    msg.includes('violates') ||
    msg.includes('cannot be added') ||
    msg.includes('must not') ||
    msg.includes('not authenticated')
  ) {
    return true;
  }
  return false;
}

/**
 * Flush all pending queue operations
 */
export async function flushQueue(): Promise<{ processed: number; failed: number }> {
  if (isFlushing) {
    return { processed: 0, failed: 0 };
  }
  if (!navigator.onLine) {
    return { processed: 0, failed: 0 };
  }

  const queue = getQueue();
  if (queue.length === 0) {
    return { processed: 0, failed: 0 };
  }

  isFlushing = true;
  let processed = 0;
  let failed = 0;
  const remaining: QueueItem[] = [];

  for (const item of queue) {
    try {
      if (item.type === 'add_entry') {
        await upsertEntry(item.payload as CreateEntryInput);
      } else if (item.type === 'delete_entry') {
        await deleteEntry(item.payload.id);
      } else if (item.type === 'add_no_spend') {
        await addNoSpendDay(item.payload.log_date);
      } else if (item.type === 'delete_no_spend') {
        await deleteNoSpendDay(item.payload.log_date);
      }
      processed++;
    } catch (err: any) {
      console.warn(`Queue item ${item.id} failed:`, err);
      if (isClientError(err)) {
        // Validation / client error (4xx): drop item and record error
        logError(item.id, item.type, err?.message || 'Client validation error (4xx)');
        failed++;
      } else {
        // Network or server error: keep item for retry
        item.retryCount = (item.retryCount || 0) + 1;
        remaining.push(item);
        failed++;
      }
    }
  }

  saveQueue(remaining);
  isFlushing = false;
  return { processed, failed };
}

function checkFlushInterval() {
  const queue = getQueue();
  if (queue.length > 0 && !flushTimer) {
    flushTimer = setInterval(() => {
      flushQueue().catch(() => {});
    }, 30000);
  } else if (queue.length === 0 && flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
}

// Set up listeners for online events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushQueue().catch(() => {});
  });
  checkFlushInterval();
}

/**
 * Offline local storage caching helpers for profile, categories, and entries
 */
export const LocalCache = {
  getProfile(userId: string) {
    try {
      const data = localStorage.getItem(`rocash.cache.profile.${userId}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setProfile(userId: string, profile: any) {
    try {
      localStorage.setItem(`rocash.cache.profile.${userId}`, JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalCache profile write error', e);
    }
  },
  getCategories(userId: string) {
    try {
      const data = localStorage.getItem(`rocash.cache.categories.${userId}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setCategories(userId: string, categories: any) {
    try {
      localStorage.setItem(`rocash.cache.categories.${userId}`, JSON.stringify(categories));
    } catch (e) {
      console.warn('LocalCache categories write error', e);
    }
  },
  getCurrentMonthEntries(userId: string, monthKey: string) {
    try {
      const data = localStorage.getItem(`rocash.cache.entries.${userId}.${monthKey}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setCurrentMonthEntries(userId: string, monthKey: string, entries: any) {
    try {
      localStorage.setItem(`rocash.cache.entries.${userId}.${monthKey}`, JSON.stringify(entries));
    } catch (e) {
      console.warn('LocalCache entries write error', e);
    }
  },
};
