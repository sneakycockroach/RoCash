// LOGIC FILE: do not change when restyling

import { supabase, type NoSpendDay } from '../supabase';
import { isFutureDate } from '../dates';

export async function addNoSpendDay(logDate: string): Promise<NoSpendDay> {
  if (isFutureDate(logDate)) {
    throw new Error('Cannot log no-spend for a future date.');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated.');
  }

  // Contract check: Cannot be added for a day that already has a spend entry
  const { data: spends, error: spendError } = await supabase
    .from('entries')
    .select('id')
    .eq('entry_date', logDate)
    .eq('type', 'spend')
    .limit(1);

  if (spendError) {
    throw spendError;
  }
  if (spends && spends.length > 0) {
    throw new Error('Cannot mark a no-spend day when spending is already logged.');
  }

  const { data, error } = await supabase
    .from('no_spend_days')
    .insert({
      user_id: user.id,
      log_date: logDate,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as NoSpendDay;
}

export async function deleteNoSpendDay(logDate: string): Promise<void> {
  const { error } = await supabase
    .from('no_spend_days')
    .delete()
    .eq('log_date', logDate);

  if (error) {
    throw error;
  }
}

export async function getNoSpendDays(options?: { from?: string; to?: string }): Promise<NoSpendDay[]> {
  let query = supabase
    .from('no_spend_days')
    .select('*')
    .order('log_date', { ascending: false });

  if (options?.from) {
    query = query.gte('log_date', options.from);
  }
  if (options?.to) {
    query = query.lte('log_date', options.to);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return (data || []) as NoSpendDay[];
}
