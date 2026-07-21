import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type CollectionsDbInsert = Database["public"]["Tables"]["collections"]["Insert"];
type CollectionsDbUpdate = Database["public"]["Tables"]["collections"]["Update"];

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  hero_image_id: string | null;
  hero_image_url?: string | null; // resolved via join
  is_seasonal: boolean;
  starts_at: string | null;
  ends_at: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type CollectionInsert = Partial<Omit<Collection, "id" | "created_at" | "updated_at">> & {
  slug: string;
  title: string;
};

export type CollectionUpdate = Partial<Omit<Collection, "id" | "created_at">>;

// ─── READ ───────────────────────────────────────────────────

export async function getCollections(opts?: { activeOnly?: boolean }) {
  let query = supabase
    .from("collections")
    .select("*, hero_media:media_library!hero_image_id(public_url)")
    .is("deleted_at", null)
    .order("display_order", { ascending: true });

  if (opts?.activeOnly !== false) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((c: any) => ({
    ...c,
    hero_image_url: c.hero_media?.public_url ?? null,
  })) as Collection[];
}

export async function getCollectionBySlug(slug: string) {
  const { data, error } = await supabase
    .from("collections")
    .select("*, hero_media:media_library!hero_image_id(public_url)")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return { ...data, hero_image_url: (data as any).hero_media?.public_url ?? null } as Collection;
}

export async function getCollectionById(id: string) {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data as Collection;
}

// ─── PRODUCT ↔ COLLECTION LINKS ───────────────────────────────

export async function getProductsInCollection(collectionId: string) {
  const { data, error } = await supabase
    .from("product_collections")
    .select("product_id, display_order, products(*, categories(*))")
    .eq("collection_id", collectionId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row: any) => row.products).filter(Boolean);
}

export async function setProductCollections(productId: string, collectionIds: string[]): Promise<void> {
  const { error: delError } = await supabase
    .from("product_collections")
    .delete()
    .eq("product_id", productId);
  if (delError) throw delError;

  if (collectionIds.length === 0) return;

  const { error } = await supabase
    .from("product_collections")
    .insert(collectionIds.map((collection_id, i) => ({ product_id: productId, collection_id, display_order: i })));
  if (error) throw error;
}

// ─── SLUG ───────────────────────────────────────────────────

export function generateCollectionSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── CREATE / UPDATE / DELETE ─────────────────────────────────

export async function createCollection(values: CollectionInsert): Promise<Collection> {
  const { data, error } = await supabase
    .from("collections")
    .insert(values as CollectionsDbInsert)
    .select()
    .single();

  if (error) throw error;
  return data as Collection;
}

export async function updateCollection(id: string, values: CollectionUpdate): Promise<Collection> {
  const { data, error } = await supabase
    .from("collections")
    .update({ ...values, updated_at: new Date().toISOString() } as CollectionsDbUpdate)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Collection;
}

export async function softDeleteCollection(id: string): Promise<void> {
  const { error } = await supabase
    .from("collections")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", id);

  if (error) throw error;
}

// ─── MEDIUM CRAFT CONTENT ─────────────────────────────────────
// "About Clay Work", "About Mirror Art" etc — reused across every
// product of that medium.

export interface MediumCraftContent {
  id: string;
  medium: string;
  title: string;
  content: string;
  image_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function getMediumCraftContent(medium: string): Promise<MediumCraftContent | null> {
  const { data, error } = await supabase
    .from("medium_craft_content")
    .select("*")
    .eq("medium", medium)
    .single();

  if (error) return null;
  return data as MediumCraftContent;
}

export async function getAllMediumCraftContent(): Promise<MediumCraftContent[]> {
  const { data, error } = await supabase
    .from("medium_craft_content")
    .select("*")
    .order("medium", { ascending: true });

  if (error) throw error;
  return (data ?? []) as MediumCraftContent[];
}

export async function updateMediumCraftContent(medium: string, values: Partial<MediumCraftContent>): Promise<MediumCraftContent> {
  const { data, error } = await supabase
    .from("medium_craft_content")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("medium", medium)
    .select()
    .single();

  if (error) throw error;
  return data as MediumCraftContent;
}
