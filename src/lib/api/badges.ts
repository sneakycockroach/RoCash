// LOGIC FILE: do not change when restyling

import { supabase, type Badge, type UserBadge } from '../supabase';

export async function getAllBadges(): Promise<Badge[]> {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }
  return (data || []) as Badge[];
}

export async function getUserBadges(): Promise<UserBadge[]> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('*')
    .order('earned_at', { ascending: false });

  if (error) {
    throw error;
  }
  return (data || []) as UserBadge[];
}

/**
 * Calls rpc claim_badge(p_code) - supported for 'report_viewed' and 'app_installed'
 * Returns true the first time it is claimed.
 */
export async function claimBadge(code: 'report_viewed' | 'app_installed' | string): Promise<boolean> {
  const { data, error } = await supabase.rpc('claim_badge', { p_code: code });
  if (error) {
    throw error;
  }
  return Boolean(data);
}
