// LOGIC FILE: do not change when restyling

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  'https://wmbijvhbzfyzikbzasoc.supabase.co';

const SUPABASE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  'sb_publishable_GsZb2IgIXmznPFjcsBT9Qg_Qz3zsCdO';

export type AvatarStyle = 'lorelei' | 'notionists' | 'thumbs';
export type AppTheme = 'system' | 'light' | 'dark';

export interface Profile {
  id: string;
  display_name: string | null;
  currency_code: string;
  daily_budget: number;
  daily_saving_goal: number;
  theme: AppTheme;
  onboarded: boolean;
  avatar_style: AvatarStyle;
  avatar_seed: string;
  avatar_bg: string; // 6 hex, no #
  // Read-only server fields
  current_streak: number;
  longest_streak: number;
  last_entry_date: string | null; // YYYY-MM-DD
  days_logged: number;
}

export type ProfileUpdate = Partial<
  Omit<
    Profile,
    'id' | 'current_streak' | 'longest_streak' | 'last_entry_date' | 'days_logged'
  >
>;

export interface Category {
  id: string;
  user_id: string | null; // null = default
  name: string;
  icon: string;
  color: string;
  sort_order: number;
  archived: boolean;
}

export type EntryType = 'spend' | 'save';

export interface Entry {
  id: string; // client-generated UUID
  user_id: string;
  type: EntryType;
  amount: number; // numeric(14,2) > 0
  category_id: string | null; // required for spend, null for save
  note: string | null; // max 200
  entry_date: string; // user's LOCAL date YYYY-MM-DD
  created_at: string;
}

export interface NoSpendDay {
  user_id: string;
  log_date: string; // YYYY-MM-DD
}

export interface Badge {
  code: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  sort_order: number;
}

export interface UserBadge {
  user_id: string;
  badge_code: string;
  earned_at: string;
}

export interface MyStats {
  current_streak: number;
  longest_streak: number;
  last_entry_date: string | null;
  days_logged: number;
  xp: number;
}

export interface CategoryTotal {
  category_id: string;
  category_name: string;
  icon: string;
  color: string;
  total_amount: number;
  entry_count: number;
}

export interface PeriodTotal {
  period_label: string; // e.g. date / week / month
  spent_amount: number;
  saved_amount: number;
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
