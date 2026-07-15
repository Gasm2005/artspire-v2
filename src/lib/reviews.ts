import { supabase } from "@/integrations/supabase/client";

export interface ProductReview {
  id: string;
  product_id: string;
  order_id: string | null;
  customer_name: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
}

// ─── PUBLIC ───────────────────────────────────────────────────

export async function getApprovedReviews(productId: string): Promise<ProductReview[]> {
  const { data, error } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProductReview[];
}

export function getReviewSummary(reviews: ProductReview[]): { average: number; count: number } {
  if (reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return { average: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
}

export async function submitReview(params: {
  productId: string;
  customerName: string;
  rating: number;
  comment?: string;
}): Promise<void> {
  const { error } = await supabase.from("product_reviews").insert({
    product_id: params.productId,
    customer_name: params.customerName,
    rating: params.rating,
    comment: params.comment || null,
    is_approved: false,
  });
  if (error) throw error;
}

// ─── ADMIN ──────────────────────────────────────────────────

export async function getAllReviews(opts?: { pendingOnly?: boolean }): Promise<(ProductReview & { products?: { title: string } | null })[]> {
  let query = supabase
    .from("product_reviews")
    .select("*, products(title)")
    .order("created_at", { ascending: false });

  if (opts?.pendingOnly) query = query.eq("is_approved", false);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as (ProductReview & { products?: { title: string } | null })[];
}

export async function approveReview(id: string): Promise<void> {
  const { error } = await supabase.from("product_reviews").update({ is_approved: true }).eq("id", id);
  if (error) throw error;
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from("product_reviews").delete().eq("id", id);
  if (error) throw error;
}
