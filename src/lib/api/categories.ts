// LOGIC FILE: do not change when restyling

import { supabase, type Category } from '../supabase';

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('archived', false)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }
  return (data || []) as Category[];
}

export async function createCategory(
  category: {
    name: string;
    icon: string;
    color: string;
    sort_order?: number;
  }
): Promise<Category> {
  const id = crypto.randomUUID();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('categories')
    .insert({
      id,
      user_id: user?.id,
      name: category.name.trim(),
      icon: category.icon,
      color: category.color,
      sort_order: category.sort_order ?? 99,
      archived: false,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as Category;
}

export async function updateCategory(
  id: string,
  updates: Partial<Pick<Category, 'name' | 'icon' | 'color' | 'sort_order' | 'archived'>>
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as Category;
}

/**
 * Never delete a category that has entries: set archived = true.
 */
export async function archiveCategory(id: string): Promise<Category> {
  return updateCategory(id, { archived: true });
}
