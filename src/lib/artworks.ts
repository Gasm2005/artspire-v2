import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Artwork = Database["public"]["Tables"]["artworks"]["Row"];
export type ArtworkInsert = Database["public"]["Tables"]["artworks"]["Insert"];
export type ArtworkUpdate = Database["public"]["Tables"]["artworks"]["Update"];
export type ArtworkStatus = Database["public"]["Enums"]["artwork_status"];
export type ArtworkType = Database["public"]["Enums"]["artwork_type"];
export type CommissionStatus = Database["public"]["Enums"]["commission_status"];

export type ArtworkWithCategory = Artwork & {
  categories: Database["public"]["Tables"]["categories"]["Row"] | null;
};

export type ArtworkWithTags = Artwork & {
  tags: Database["public"]["Tables"]["tags"]["Row"][];
};

export type ArtworkWithRelations = ArtworkWithCategory & {
  tags: Database["public"]["Tables"]["tags"]["Row"][];
};

// ─── READ ───────────────────────────────────────────────────

export async function getArtworks(opts?: {
  status?: ArtworkStatus;
  featured?: boolean;
  homepage?: boolean;
  categorySlug?: string;
  limit?: number;
  offset?: number;
  orderBy?: "display_order" | "published_at" | "created_at";
  ascending?: boolean;
}) {
  let query = supabase
    .from("artworks")
    .select("*, categories(*)")
    .is("deleted_at", null);

  if (opts?.status) query = query.eq("status", opts.status);
  if (opts?.featured) query = query.eq("featured", true);
  if (opts?.homepage) query = query.eq("show_on_homepage", true);
  if (opts?.categorySlug) {
    query = query.eq("categories.slug", opts.categorySlug);
  }

  const orderCol = opts?.orderBy ?? "display_order";
  query = query.order(orderCol, { ascending: opts?.ascending ?? true });

  if (opts?.limit) query = query.limit(opts.limit);
  if (opts?.offset) query = query.range(opts.offset, opts.offset + (opts.limit ?? 10) - 1);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ArtworkWithCategory[];
}

export async function getArtworkBySlug(slug: string) {
  const { data, error } = await supabase
    .from("artworks")
    .select("*, categories(*)")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  return data as ArtworkWithCategory | null;
}

export async function getArtworkById(id: string) {
  const { data, error } = await supabase
    .from("artworks")
    .select("*, categories(*)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  return data as ArtworkWithCategory | null;
}

export async function getPublishedArtworkBySlug(slug: string) {
  const { data, error } = await supabase
    .from("artworks")
    .select("*, categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  return data as ArtworkWithCategory | null;
}

export async function getFeaturedArtworks(limit = 6) {
  return getArtworks({ featured: true, status: "published", limit, orderBy: "display_order" });
}

export async function getHomepageArtworks(limit = 6) {
  return getArtworks({ homepage: true, status: "published", limit, orderBy: "display_order" });
}

export async function getRelatedArtworks(artworkId: string, categoryId: string | null, limit = 4) {
  let query = supabase
    .from("artworks")
    .select("*, categories(*)")
    .eq("status", "published")
    .is("deleted_at", null)
    .neq("id", artworkId)
    .limit(limit);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ArtworkWithCategory[];
}

export async function getArtworkTags(artworkId: string) {
  const { data, error } = await supabase
    .from("artwork_tags")
    .select("tags(*)")
    .eq("artwork_id", artworkId);

  if (error) throw error;
  return (data ?? []).map((d) => d.tags) as Database["public"]["Tables"]["tags"]["Row"][];
}

export async function getAllArtworkTags(artworkId: string) {
  const { data, error } = await supabase
    .from("artwork_tags")
    .select("tag_id")
    .eq("artwork_id", artworkId);

  if (error) throw error;
  return (data ?? []).map((d) => d.tag_id);
}

// ─── SLUG GENERATION ────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function ensureUniqueSlug(title: string, currentId?: string): Promise<string> {
  let slug = generateSlug(title);
  let counter = 2;
  let isUnique = false;

  while (!isUnique) {
    const { data, error } = await supabase
      .from("artworks")
      .select("id")
      .eq("slug", slug)
      .is("deleted_at", null)
      .single();

    if (error || !data || data.id === currentId) {
      isUnique = true;
    } else {
      slug = `${generateSlug(title)}-${counter}`;
      counter++;
    }
  }

  return slug;
}

// ─── CREATE ─────────────────────────────────────────────────

export async function createArtwork(values: ArtworkInsert): Promise<Artwork> {
  const { data, error } = await supabase
    .from("artworks")
    .insert(values)
    .select()
    .single();

  if (error) throw error;
  return data as Artwork;
}

// ─── UPDATE ─────────────────────────────────────────────────

export async function updateArtwork(id: string, values: ArtworkUpdate): Promise<Artwork> {
  const { data, error } = await supabase
    .from("artworks")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Artwork;
}

// ─── DELETE ─────────────────────────────────────────────────

export async function softDeleteArtwork(id: string): Promise<void> {
  const { error } = await supabase
    .from("artworks")
    .update({ deleted_at: new Date().toISOString(), status: "archived" })
    .eq("id", id);

  if (error) throw error;
}

export async function hardDeleteArtwork(id: string): Promise<void> {
  const { error } = await supabase
    .from("artworks")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// ─── TAGS ───────────────────────────────────────────────────

export async function setArtworkTags(artworkId: string, tagIds: string[]): Promise<void> {
  // First delete existing
  const { error: delError } = await supabase
    .from("artwork_tags")
    .delete()
    .eq("artwork_id", artworkId);

  if (delError) throw delError;

  if (tagIds.length === 0) return;

  // Insert new
  const inserts = tagIds.map((tagId) => ({ artwork_id: artworkId, tag_id: tagId }));
  const { error: insError } = await supabase
    .from("artwork_tags")
    .insert(inserts);

  if (insError) throw insError;
}

// ─── PUBLISH ────────────────────────────────────────────────

export async function publishArtwork(id: string): Promise<Artwork> {
  return updateArtwork(id, { status: "published", published_at: new Date().toISOString() });
}

export async function unpublishArtwork(id: string): Promise<Artwork> {
  return updateArtwork(id, { status: "draft", published_at: null });
}

export async function archiveArtwork(id: string): Promise<Artwork> {
  return updateArtwork(id, { status: "archived", deleted_at: new Date().toISOString() });
}
