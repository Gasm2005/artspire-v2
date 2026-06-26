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

export type ArtworkGalleryImage = {
  id: string;
  artwork_id: string;
  media_id: string;
  display_order: number;
  caption: string | null;
  alt_text: string | null;
  media?: { public_url: string; original_name: string } | null;
};

export type ArtworkProcessImage = {
  id: string;
  artwork_id: string;
  media_id: string;
  step_number: number;
  step_title: string | null;
  step_description: string | null;
  display_order: number;
  media?: { public_url: string; original_name: string } | null;
};

export type ArtworkWithImages = ArtworkWithCategory & {
  gallery_images: ArtworkGalleryImage[];
  process_images: ArtworkProcessImage[];
  main_image: { public_url: string } | null;
  thumbnail_image: { public_url: string } | null;
  before_image: { public_url: string } | null;
  after_image: { public_url: string } | null;
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

export async function getArtworkWithImages(id: string): Promise<ArtworkWithImages | null> {
  const { data, error } = await supabase
    .from("artworks")
    .select(`
      *,
      categories(*),
      main_image:media_library!main_image_id(public_url),
      thumbnail_image:media_library!thumbnail_image_id(public_url),
      before_image:media_library!before_image_id(public_url),
      after_image:media_library!after_image_id(public_url)
    `)
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  if (!data) return null;

  const [gallery, process] = await Promise.all([
    getArtworkGalleryImages(id),
    getArtworkProcessImages(id),
  ]);

  return {
    ...(data as ArtworkWithCategory),
    gallery_images: gallery,
    process_images: process,
    main_image: (data as any).main_image ?? null,
    thumbnail_image: (data as any).thumbnail_image ?? null,
    before_image: (data as any).before_image ?? null,
    after_image: (data as any).after_image ?? null,
  };
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

// ─── GALLERY IMAGES ───────────────────────────────────────────

export async function getArtworkGalleryImages(artworkId: string): Promise<ArtworkGalleryImage[]> {
  const { data, error } = await supabase
    .from("artwork_gallery_images")
    .select("*, media:media_id(public_url, original_name)")
    .eq("artwork_id", artworkId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((d: any) => ({
    id: d.id,
    artwork_id: d.artwork_id,
    media_id: d.media_id,
    display_order: d.display_order ?? 0,
    caption: d.caption,
    alt_text: d.alt_text,
    media: d.media ?? null,
  })) as ArtworkGalleryImage[];
}

export async function setArtworkGalleryImages(
  artworkId: string,
  images: { media_id: string; caption?: string; alt_text?: string; display_order?: number }[]
): Promise<void> {
  // Delete existing
  const { error: delError } = await supabase
    .from("artwork_gallery_images")
    .delete()
    .eq("artwork_id", artworkId);

  if (delError) throw delError;

  if (images.length === 0) return;

  const inserts = images.map((img, i) => ({
    artwork_id: artworkId,
    media_id: img.media_id,
    caption: img.caption ?? null,
    alt_text: img.alt_text ?? null,
    display_order: img.display_order ?? i,
  }));

  const { error: insError } = await supabase
    .from("artwork_gallery_images")
    .insert(inserts);

  if (insError) throw insError;
}

export async function reorderGalleryImages(artworkId: string, orderedMediaIds: string[]): Promise<void> {
  for (let i = 0; i < orderedMediaIds.length; i++) {
    const { error } = await supabase
      .from("artwork_gallery_images")
      .update({ display_order: i })
      .eq("artwork_id", artworkId)
      .eq("media_id", orderedMediaIds[i]);

    if (error) throw error;
  }
}

// ─── PROCESS IMAGES ───────────────────────────────────────────

export async function getArtworkProcessImages(artworkId: string): Promise<ArtworkProcessImage[]> {
  const { data, error } = await supabase
    .from("artwork_process_images")
    .select("*, media:media_id(public_url, original_name)")
    .eq("artwork_id", artworkId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((d: any) => ({
    id: d.id,
    artwork_id: d.artwork_id,
    media_id: d.media_id,
    step_number: d.step_number ?? 1,
    step_title: d.step_title,
    step_description: d.step_description,
    display_order: d.display_order ?? 0,
    media: d.media ?? null,
  })) as ArtworkProcessImage[];
}

export async function setArtworkProcessImages(
  artworkId: string,
  images: { media_id: string; step_number?: number; step_title?: string; step_description?: string; display_order?: number }[]
): Promise<void> {
  const { error: delError } = await supabase
    .from("artwork_process_images")
    .delete()
    .eq("artwork_id", artworkId);

  if (delError) throw delError;

  if (images.length === 0) return;

  const inserts = images.map((img, i) => ({
    artwork_id: artworkId,
    media_id: img.media_id,
    step_number: img.step_number ?? i + 1,
    step_title: img.step_title ?? null,
    step_description: img.step_description ?? null,
    display_order: img.display_order ?? i,
  }));

  const { error: insError } = await supabase
    .from("artwork_process_images")
    .insert(inserts);

  if (insError) throw insError;
}

export async function reorderProcessImages(artworkId: string, orderedMediaIds: string[]): Promise<void> {
  for (let i = 0; i < orderedMediaIds.length; i++) {
    const { error } = await supabase
      .from("artwork_process_images")
      .update({ display_order: i, step_number: i + 1 })
      .eq("artwork_id", artworkId)
      .eq("media_id", orderedMediaIds[i]);

    if (error) throw error;
  }
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
  const { error: delError } = await supabase
    .from("artwork_tags")
    .delete()
    .eq("artwork_id", artworkId);

  if (delError) throw delError;

  if (tagIds.length === 0) return;

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

// ─── IMAGE STORAGE ──────────────────────────────────────────

export async function uploadArtworkImage(file: File, slug: string): Promise<{ path: string; publicUrl: string }> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const filePath = `artworks/${slug}-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("artwork-images")
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from("artwork-images")
    .getPublicUrl(data.path);

  return { path: data.path, publicUrl: publicUrlData.publicUrl };
}
