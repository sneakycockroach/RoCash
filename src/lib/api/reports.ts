// LOGIC FILE: do not change when restyling

import { supabase, type CategoryTotal, type PeriodTotal } from '../supabase';

export async function getCategoryTotals(from: string, to: string): Promise<CategoryTotal[]> {
  const { data, error } = await supabase.rpc('category_totals', {
    p_from: from,
    p_to: to,
  });

  if (error) {
    throw error;
  }
  return (data || []) as CategoryTotal[];
}

export async function getPeriodTotals(
  from: string,
  to: string,
  bucket: 'day' | 'week' | 'month'
): Promise<PeriodTotal[]> {
  const { data, error } = await supabase.rpc('period_totals', {
    p_from: from,
    p_to: to,
    p_bucket: bucket,
  });

  if (error) {
    throw error;
  }
  return (data || []) as PeriodTotal[];
}
