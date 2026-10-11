// LOGIC FILE: do not change when restyling

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthProvider';
import type { Category, Entry, MyStats, Badge, UserBadge, NoSpendDay } from '../lib/supabase';
import { getCategories } from '../lib/api/categories';
import { getEntries, type CreateEntryInput } from '../lib/api/entries';
import { getMyStats } from '../lib/api/profiles';
import { getAllBadges, getUserBadges, claimBadge as claimBadgeApi } from '../lib/api/badges';
import { getNoSpendDays } from '../lib/api/noSpend';
import {
  enqueueOperation,
  flushQueue,
  getQueue,
  subscribeQueue,
  LocalCache,
  type QueueItem,
} from '../lib/queue';
import { getCurrentMonthRange, isStreakAlive, getLocalToday } from '../lib/dates';

export interface DataContextType {
  categories: Category[];
  entries: Entry[];
  recentEntries: Entry[];
  todayEntries: Entry[];
  stats: MyStats | null;
  badges: Badge[];
  userBadges: UserBadge[];
  noSpendDays: NoSpendDay[];
  isTodayNoSpend: boolean;
  activeStreak: number;
  loading: boolean;
  queueCount: number;
  queue: QueueItem[];
  addEntry: (input: Omit<CreateEntryInput, 'id'>) => Promise<Entry>;
  removeEntry: (id: string) => Promise<void>;
  markNoSpendToday: () => Promise<void>;
  removeNoSpendToday: () => Promise<void>;
  claimUserBadge: (code: string) => Promise<boolean>;
  refreshAll: () => Promise<void>;
  refreshEntries: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshBadges: () => Promise<void>;
  flushNow: () => Promise<{ processed: number; failed: number }>;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [stats, setStats] = useState<MyStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [noSpendDays, setNoSpendDays] = useState<NoSpendDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [queue, setQueue] = useState<QueueItem[]>(getQueue());

  // Subscribe to offline queue changes
  useEffect(() => {
    const unsub = subscribeQueue((items) => {
      setQueue([...items]);
    });
    return unsub;
  }, []);

  const monthRange = useMemo(() => getCurrentMonthRange(), []);
  const monthKey = monthRange.from.slice(0, 7);

  // Load initial data with optimistic cache support
  const loadCategoriesData = useCallback(async () => {
    if (!user) return;
    const cached = LocalCache.getCategories(user.id);
    if (cached) setCategories(cached);

    try {
      const live = await getCategories();
      setCategories(live);
      LocalCache.setCategories(user.id, live);
    } catch (e) {
      console.warn('Error loading categories:', e);
    }
  }, [user]);

  const loadEntriesData = useCallback(async () => {
    if (!user) return;
    const cached = LocalCache.getCurrentMonthEntries(user.id, monthKey);
    if (cached) setEntries(cached);

    try {
      const live = await getEntries({ from: monthRange.from, to: monthRange.to });
      setEntries(live);
      LocalCache.setCurrentMonthEntries(user.id, monthKey, live);
    } catch (e) {
      console.warn('Error loading entries:', e);
    }
  }, [user, monthKey, monthRange]);

  const loadStatsData = useCallback(async () => {
    if (!user) return;
    try {
      const s = await getMyStats();
      if (s) setStats(s);
    } catch (e) {
      console.warn('Error loading my_stats:', e);
    }
  }, [user]);

  const loadBadgesData = useCallback(async () => {
    if (!user) return;
    try {
      const [allB, userB] = await Promise.all([getAllBadges(), getUserBadges()]);
      setBadges(allB);
      setUserBadges(userB);
    } catch (e) {
      console.warn('Error loading badges:', e);
    }
  }, [user]);

  const loadNoSpendData = useCallback(async () => {
    if (!user) return;
    try {
      const days = await getNoSpendDays({ from: monthRange.from, to: monthRange.to });
      setNoSpendDays(days);
    } catch (e) {
      console.warn('Error loading no_spend_days:', e);
    }
  }, [user, monthRange]);

  const refreshAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    await Promise.all([
      loadCategoriesData(),
      loadEntriesData(),
      loadStatsData(),
      loadBadgesData(),
      loadNoSpendData(),
    ]);
    setLoading(false);
  }, [user, loadCategoriesData, loadEntriesData, loadStatsData, loadBadgesData, loadNoSpendData]);

  useEffect(() => {
    if (user) {
      refreshAll();
    } else {
      setCategories([]);
      setEntries([]);
      setStats(null);
      setUserBadges([]);
      setNoSpendDays([]);
      setLoading(false);
    }
  }, [user, refreshAll]);

  // Derived values
  const todayStr = getLocalToday();

  const todayEntries = useMemo(() => {
    return entries.filter((e) => e.entry_date === todayStr);
  }, [entries, todayStr]);

  const recentEntries = useMemo(() => {
    return [...entries].slice(0, 10);
  }, [entries]);

  const isTodayNoSpend = useMemo(() => {
    return noSpendDays.some((d) => d.log_date === todayStr);
  }, [noSpendDays, todayStr]);

  // Streak logic rule: A streak is ALIVE only if last_entry_date >= (local today minus 1 day), otherwise show 0.
  const activeStreak = useMemo(() => {
    if (!stats) return 0;
    if (isStreakAlive(stats.last_entry_date)) {
      return stats.current_streak || 0;
    }
    return 0;
  }, [stats]);

  // Optimistic add entry
  const addEntry = async (input: Omit<CreateEntryInput, 'id'>): Promise<Entry> => {
    if (!user) throw new Error('Not authenticated.');
    const id = crypto.randomUUID();
    const newEntry: Entry = {
      id,
      user_id: user.id,
      type: input.type,
      amount: Math.round(input.amount * 100) / 100,
      category_id: input.type === 'spend' ? input.category_id || null : null,
      note: input.note || null,
      entry_date: input.entry_date,
      created_at: new Date().toISOString(),
    };

    // 1. Optimistic state update
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    LocalCache.setCurrentMonthEntries(user.id, monthKey, updatedEntries);

    // 2. Enqueue offline operation
    enqueueOperation('add_entry', newEntry);

    return newEntry;
  };

  // Optimistic delete entry
  const removeEntry = async (id: string): Promise<void> => {
    if (!user) throw new Error('Not authenticated.');

    // 1. Optimistic state update
    const updatedEntries = entries.filter((e) => e.id !== id);
    setEntries(updatedEntries);
    LocalCache.setCurrentMonthEntries(user.id, monthKey, updatedEntries);

    // 2. Enqueue offline operation
    enqueueOperation('delete_entry', { id });
  };

  // Optimistic mark no-spend today
  const markNoSpendToday = async (): Promise<void> => {
    if (!user) throw new Error('Not authenticated.');
    const today = getLocalToday();

    // Check if spend already exists today
    const spendsToday = entries.filter((e) => e.entry_date === today && e.type === 'spend');
    if (spendsToday.length > 0) {
      throw new Error('Cannot mark a no-spend day when spending is already logged.');
    }

    const newRecord: NoSpendDay = { user_id: user.id, log_date: today };
    setNoSpendDays([newRecord, ...noSpendDays]);

    enqueueOperation('add_no_spend', newRecord);
  };

  // Optimistic remove no-spend today
  const removeNoSpendToday = async (): Promise<void> => {
    if (!user) throw new Error('Not authenticated.');
    const today = getLocalToday();

    setNoSpendDays(noSpendDays.filter((d) => d.log_date !== today));
    enqueueOperation('delete_no_spend', { log_date: today });
  };

  const claimUserBadge = async (code: string): Promise<boolean> => {
    const claimed = await claimBadgeApi(code);
    if (claimed) {
      await loadBadgesData();
      await loadStatsData();
    }
    return claimed;
  };

  const flushNow = async () => {
    const result = await flushQueue();
    await refreshAll();
    return result;
  };

  return (
    <DataContext.Provider
      value={{
        categories,
        entries,
        recentEntries,
        todayEntries,
        stats,
        badges,
        userBadges,
        noSpendDays,
        isTodayNoSpend,
        activeStreak,
        loading,
        queueCount: queue.length,
        queue,
        addEntry,
        removeEntry,
        markNoSpendToday,
        removeNoSpendToday,
        claimUserBadge,
        refreshAll,
        refreshEntries: loadEntriesData,
        refreshStats: loadStatsData,
        refreshCategories: loadCategoriesData,
        refreshBadges: loadBadgesData,
        flushNow,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
