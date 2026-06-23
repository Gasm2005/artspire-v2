import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
export type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .is("deleted_at", null)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  return data as Category | null;
}

export async function getCategoryById(id: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  return data as Category | null;
}

export function generateCategorySlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function ensureUniqueCategorySlug(name: string, currentId?: string): Promise<string> {
  let slug = generateCategorySlug(name);
  let counter = 2;
  let isUnique = false;

  while (!isUnique) {
    const { data, error } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .is("deleted_at", null)
      .single();

    if (error || !data || data.id === currentId) {
      isUnique = true;
    } else {
      slug = `${generateCategorySlug(name)}-${counter}`;
      counter++;
    }
  }

  return slug;
}

export async function createCategory(values: CategoryInsert): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert(values)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: string, values: CategoryUpdate): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function softDeleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function hardDeleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
