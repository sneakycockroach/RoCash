// LOGIC FILE: do not change when restyling

import { supabase, type Profile, type ProfileUpdate, type MyStats } from '../supabase';

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data as Profile | null;
}

export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as Profile;
}

export async function getMyStats(): Promise<MyStats | null> {
  const { data, error } = await supabase
    .from('my_stats')
    .select('*')
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data as MyStats | null;
}

export async function deleteMyAccount(): Promise<void> {
  const { error } = await supabase.rpc('delete_my_account');
  if (error) {
    throw error;
  }
}
