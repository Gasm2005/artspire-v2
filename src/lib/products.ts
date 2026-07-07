import { supabase } from "@/integrations/supabase/client";
import type { Category } from "./categories";

// ─── TYPES ──────────────────────────────────────────────────
// Manually typed since products table isn't in the auto-generated
// Supabase types yet — same approach used for tags.ts.

export type ProductStatus = "draft" | "published" | "sold_out" | "archived";

export interface Product {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  category_id: string | null;
  medium: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  sku: string | null;
  inventory_count: number;
  is_one_of_a_kind: boolean;
  materials_used: string | null;
  dimensions: string | null;
  weight: string | null;
  care_instructions: string | null;
  commission_similar_enabled: boolean;
  main_image_id: string | null;
  image_url: string | null;
  status: ProductStatus;
  featured: boolean;
  show_on_homepage: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  view_count: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  deleted_at: string | null;
}

export type ProductInsert = Partial<Omit<Product, "id" | "created_at" | "updated_at">> & {
  slug: string;
  title: string;
};

export type ProductUpdate = Partial<Omit<Product, "id" | "created_at">>;

export type ProductWithCategory = Product & {
  categories: Category | null;
};

export interface ProductGalleryImage {
  id: string;
  product_id: string;
  media_id: string;
  display_order: number;
  created_at: string;
  media?: { public_url: string; original_name: string } | null;
}

export type ProductWithImages = ProductWithCategory & {
  gallery_images: ProductGalleryImage[];
};

// ─── READ ───────────────────────────────────────────────────

export async function getProducts(opts?: {
  status?: ProductStatus;
  featured?: boolean;
  homepage?: boolean;
  categorySlug?: string;
  categoryId?: string;
  limit?: number;
  offset?: number;
  orderBy?: "display_order" | "published_at" | "created_at" | "price";
  ascending?: boolean;
}) {
  let query = supabase
    .from("products")
    .select("*, categories(*)")
    .is("deleted_at", null);

  if (opts?.status) query = query.eq("status", opts.status);
  if (opts?.featured) query = query.eq("featured", true);
  if (opts?.homepage) query = query.eq("show_on_homepage", true);
  if (opts?.categoryId) query = query.eq("category_id", opts.categoryId);
  if (opts?.categorySlug) query = query.eq("categories.slug", opts.categorySlug);

  const orderCol = opts?.orderBy ?? "display_order";
  query = query.order(orderCol, { ascending: opts?.ascending ?? true });

  if (opts?.limit) query = query.limit(opts.limit);
  if (opts?.offset) query = query.range(opts.offset, opts.offset + (opts.limit ?? 12) - 1);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ProductWithCategory[];
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  return data as ProductWithCategory | null;
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  return data as ProductWithCategory | null;
}

export async function getPublishedProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data as ProductWithCategory | null;
}

export async function getFeaturedProducts(limit = 6) {
  return getProducts({ featured: true, status: "published", limit, orderBy: "display_order" });
}

export async function getHomepageProducts(limit = 6) {
  return getProducts({ homepage: true, status: "published", limit, orderBy: "display_order" });
}

export async function getRelatedProducts(productId: string, categoryId: string | null, limit = 4) {
  let query = supabase
    .from("products")
    .select("id, slug, title, image_url, price, category_id, categories(name, slug)")
    .eq("status", "published")
    .is("deleted_at", null)
    .neq("id", productId)
    .limit(limit);

  if (categoryId) query = query.eq("category_id", categoryId);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ProductWithCategory[];
}

// ─── GALLERY IMAGES ─────────────────────────────────────────

export async function getProductGalleryImages(productId: string): Promise<ProductGalleryImage[]> {
  const { data, error } = await supabase
    .from("product_gallery_images")
    .select("*, media:media_library(public_url, original_name)")
    .eq("product_id", productId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as ProductGalleryImage[];
}

export async function setProductGalleryImages(productId: string, mediaIds: string[]): Promise<void> {
  const { error: delError } = await supabase
    .from("product_gallery_images")
    .delete()
    .eq("product_id", productId);
  if (delError) throw delError;

  if (mediaIds.length === 0) return;

  const { error } = await supabase
    .from("product_gallery_images")
    .insert(mediaIds.map((media_id, i) => ({ product_id: productId, media_id, display_order: i })));
  if (error) throw error;
}

// ─── SLUG GENERATION ────────────────────────────────────────

export function generateProductSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function ensureUniqueProductSlug(title: string, currentId?: string): Promise<string> {
  let slug = generateProductSlug(title);
  let counter = 2;
  let isUnique = false;

  while (!isUnique) {
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .is("deleted_at", null)
      .single();

    if (error || !data || data.id === currentId) {
      isUnique = true;
    } else {
      slug = `${generateProductSlug(title)}-${counter}`;
      counter++;
    }
  }

  return slug;
}

// ─── CREATE ─────────────────────────────────────────────────

export async function createProduct(values: ProductInsert): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert(values)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

// ─── UPDATE ─────────────────────────────────────────────────

export async function updateProduct(id: string, values: ProductUpdate): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function publishProduct(id: string): Promise<Product> {
  return updateProduct(id, { status: "published", published_at: new Date().toISOString() });
}

export async function unpublishProduct(id: string): Promise<Product> {
  return updateProduct(id, { status: "draft", published_at: null });
}

export async function markSoldOut(id: string): Promise<Product> {
  return updateProduct(id, { status: "sold_out" });
}

// ─── DELETE ─────────────────────────────────────────────────

export async function softDeleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString(), status: "archived" })
    .eq("id", id);

  if (error) throw error;
}

export async function hardDeleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
