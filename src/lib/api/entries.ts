// LOGIC FILE: do not change when restyling

import { supabase, type Entry, type EntryType } from '../supabase';
import { isFutureDate } from '../dates';

export interface CreateEntryInput {
  id?: string;
  type: EntryType;
  amount: number;
  category_id?: string | null;
  note?: string | null;
  entry_date: string; // YYYY-MM-DD local
  created_at?: string;
}

export function validateEntryInput(input: CreateEntryInput): void {
  if (!input.amount || input.amount <= 0) {
    throw new Error('Amount must be greater than zero.');
  }
  if (input.type === 'spend' && !input.category_id) {
    throw new Error('Category is required for spending entries.');
  }
  if (input.type === 'save' && input.category_id) {
    throw new Error('Savings entries must not have a category.');
  }
  if (isFutureDate(input.entry_date)) {
    throw new Error('Entry date cannot be in the future.');
  }
  if (input.note && input.note.length > 200) {
    throw new Error('Note must not exceed 200 characters.');
  }
}

export async function upsertEntry(input: CreateEntryInput): Promise<Entry> {
  validateEntryInput(input);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated.');
  }

  const id = input.id || crypto.randomUUID();
  const entryPayload = {
    id,
    user_id: user.id,
    type: input.type,
    amount: Math.round(input.amount * 100) / 100,
    category_id: input.type === 'spend' ? input.category_id : null,
    note: input.note ? input.note.slice(0, 200) : null,
    entry_date: input.entry_date,
    created_at: input.created_at || new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('entries')
    .upsert(entryPayload, { onConflict: 'id', ignoreDuplicates: true })
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as Entry;
}

export async function getEntries(options: {
  from?: string;
  to?: string;
  date?: string;
  limit?: number;
}): Promise<Entry[]> {
  let query = supabase
    .from('entries')
    .select('*')
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (options.date) {
    query = query.eq('entry_date', options.date);
  }
  if (options.from) {
    query = query.gte('entry_date', options.from);
  }
  if (options.to) {
    query = query.lte('entry_date', options.to);
  }
  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return (data || []) as Entry[];
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}
