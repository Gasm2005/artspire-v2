import { supabase } from "@/integrations/supabase/client";

export interface ShopCategory {
  id: string;
  slug: string;
  name: string;
  short_summary: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type ShopCategoryInsert = Partial<Omit<ShopCategory, "id" | "created_at" | "updated_at">> & {
  slug: string;
  name: string;
};

export type ShopCategoryUpdate = Partial<Omit<ShopCategory, "id" | "created_at">>;

// ─── READ ───────────────────────────────────────────────────

export async function getShopCategories(opts?: { activeOnly?: boolean }) {
  let query = supabase
    .from("shop_categories")
    .select("*")
    .is("deleted_at", null)
    .order("display_order", { ascending: true });

  if (opts?.activeOnly !== false) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ShopCategory[];
}

export async function getShopCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from("shop_categories")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data as ShopCategory;
}

export async function getShopCategoryById(id: string) {
  const { data, error } = await supabase
    .from("shop_categories")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data as ShopCategory;
}

// ─── SLUG ───────────────────────────────────────────────────

export function generateShopCategorySlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── CREATE / UPDATE / DELETE ─────────────────────────────────

export async function createShopCategory(values: ShopCategoryInsert): Promise<ShopCategory> {
  const { data, error } = await supabase
    .from("shop_categories")
    .insert(values)
    .select()
    .single();

  if (error) throw error;
  return data as ShopCategory;
}

export async function updateShopCategory(id: string, values: ShopCategoryUpdate): Promise<ShopCategory> {
  const { data, error } = await supabase
    .from("shop_categories")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as ShopCategory;
}

export async function softDeleteShopCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from("shop_categories")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", id);

  if (error) throw error;
}
