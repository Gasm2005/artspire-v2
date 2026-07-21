import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type VisualAssetsInsert = Database["public"]["Tables"]["visual_assets"]["Insert"];

export type VisualAsset = {
  id: string;
  name: string;
  slug: string;
  asset_type: "overlay" | "texture" | "pattern" | "gradient" | "icon" | "background" | "decorative";
  storage_path: string;
  public_url: string;
  preview_url: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  mime_type: string | null;
  description: string | null;
  default_opacity: number | null;
  category_suggestions: string[] | null;
  is_predefined: boolean | null;
  is_active: boolean | null;
  usage_count: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export type VisualAssetInsert = Omit<Partial<VisualAsset>, "id" | "created_at" | "updated_at">;
export type VisualAssetUpdate = Partial<VisualAsset>;
export type VisualAssetType = VisualAsset["asset_type"];

export type VisualAssetUsageLog = {
  id: string;
  asset_id: string | null;
  entity_type: string;
  entity_id: string;
  usage_type: string;
  opacity: number | null;
  created_at: string | null;
};

export type VisualAssetUsage = {
  entityType: string;
  entityId: string;
  entityName: string;
  usageType: string;
  opacity?: number;
};

// ─── READ ───────────────────────────────────────────────────

export async function getVisualAssets(opts?: {
  assetType?: VisualAssetType;
  isActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase.from("visual_assets").select("*").order("created_at", { ascending: false });

  if (opts?.assetType) {
    query = query.eq("asset_type", opts.assetType);
  }
  if (opts?.isActive !== undefined) {
    query = query.eq("is_active", opts.isActive);
  }
  if (opts?.search) {
    query = query.ilike("name", `%${opts.search}%`);
  }

  const limit = opts?.limit ?? 100;
  const offset = opts?.offset ?? 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as VisualAsset[];
}

export async function getVisualAsset(id: string) {
  const { data, error } = await supabase.from("visual_assets").select("*").eq("id", id).single();

  if (error) throw error;
  return data as VisualAsset | null;
}

export async function getVisualAssetBySlug(slug: string) {
  const { data, error } = await supabase
    .from("visual_assets")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as VisualAsset | null;
}

export async function getVisualAssetsForCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from("visual_assets")
    .select("*")
    .eq("is_active", true)
    .contains("category_suggestions", [categorySlug]);

  if (error) throw error;
  return (data ?? []) as VisualAsset[];
}

export async function getVisualAssetUsage(assetId: string): Promise<VisualAssetUsage[]> {
  const { data, error } = await supabase
    .from("visual_asset_usage_log")
    .select("*")
    .eq("asset_id", assetId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const usages = (data ?? []) as VisualAssetUsageLog[];
  const result: VisualAssetUsage[] = [];

  for (const usage of usages) {
    let entityName = "";

    if (usage.entity_type === "category") {
      const { data: category } = await supabase
        .from("categories")
        .select("name")
        .eq("id", usage.entity_id)
        .single();
      entityName = category?.name ?? "Unknown Category";
    } else if (usage.entity_type === "homepage") {
      entityName = "Homepage";
    } else {
      entityName = usage.entity_type;
    }

    result.push({
      entityType: usage.entity_type,
      entityId: usage.entity_id,
      entityName,
      usageType: usage.usage_type,
      opacity: usage.opacity ?? undefined,
    });
  }

  return result;
}

export async function getVisualAssetUsageCount(assetId: string): Promise<number> {
  const { count, error } = await supabase
    .from("visual_asset_usage_log")
    .select("*", { count: "exact", head: true })
    .eq("asset_id", assetId);

  if (error) throw error;
  return count ?? 0;
}

// ─── UPLOAD ─────────────────────────────────────────────────

export type UploadVisualAssetResult = {
  visualAsset: VisualAsset;
  publicUrl: string;
};

export async function uploadVisualAsset(
  file: File,
  meta: {
    name: string;
    slug: string;
    assetType: VisualAssetType;
    description?: string;
    defaultOpacity?: number;
    categorySuggestions?: string[];
  },
): Promise<UploadVisualAssetResult> {
  const fileExt = file.name.split(".").pop() || "png";
  const timestamp = Date.now();
  const path = `${meta.assetType}/${timestamp}-${meta.slug}.${fileExt}`;

  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("visual-assets")
    .upload(path, file, { upsert: true });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("visual-assets")
    .getPublicUrl(uploadData.path);

  const publicUrl = publicUrlData.publicUrl;

  // Create visual_assets record
  const insert: VisualAssetInsert = {
    name: meta.name,
    slug: meta.slug,
    asset_type: meta.assetType,
    storage_path: uploadData.path,
    public_url: publicUrl,
    preview_url: publicUrl,
    file_size: file.size,
    mime_type: file.type,
    description: meta.description ?? null,
    default_opacity: meta.defaultOpacity ?? 25,
    category_suggestions: meta.categorySuggestions ?? null,
  };

  const { data: visualAsset, error: dbError } = await supabase
    .from("visual_assets")
    .insert(insert as VisualAssetsInsert)
    .select()
    .single();

  if (dbError) throw dbError;

  return {
    visualAsset: visualAsset as VisualAsset,
    publicUrl,
  };
}

// ─── CREATE ─────────────────────────────────────────────────

export async function createVisualAsset(values: VisualAssetInsert): Promise<VisualAsset> {
  const { data, error } = await supabase
    .from("visual_assets")
    .insert(values as VisualAssetsInsert)
    .select()
    .single();

  if (error) throw error;
  return data as VisualAsset;
}

// ─── UPDATE ─────────────────────────────────────────────────

export async function updateVisualAsset(
  id: string,
  values: VisualAssetUpdate,
): Promise<VisualAsset> {
  const { data, error } = await supabase
    .from("visual_assets")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as VisualAsset;
}

// ─── DELETE ─────────────────────────────────────────────────

export async function deleteVisualAsset(id: string): Promise<void> {
  // Check if predefined
  const { data: asset } = await supabase
    .from("visual_assets")
    .select("is_predefined, storage_path")
    .eq("id", id)
    .single();

  if (asset?.is_predefined) {
    throw new Error("Predefined assets cannot be deleted.");
  }

  if (asset?.storage_path) {
    await supabase.storage.from("visual-assets").remove([asset.storage_path]);
  }

  const { error } = await supabase.from("visual_assets").delete().eq("id", id);

  if (error) throw error;
}

// ─── USAGE TRACKING ─────────────────────────────────────────

export async function logVisualAssetUsage(
  assetId: string,
  entityType: string,
  entityId: string,
  usageType: string,
  opacity?: number,
): Promise<void> {
  const { error } = await supabase.from("visual_asset_usage_log").insert({
    asset_id: assetId,
    entity_type: entityType,
    entity_id: entityId,
    usage_type: usageType,
    opacity,
  });

  if (error) throw error;

  await recalculateVisualAssetUsageCount(assetId);
}

export async function removeVisualAssetUsage(
  assetId: string,
  entityType: string,
  entityId: string,
): Promise<void> {
  const { error } = await supabase
    .from("visual_asset_usage_log")
    .delete()
    .eq("asset_id", assetId)
    .eq("entity_type", entityType)
    .eq("entity_id", entityId);

  if (error) throw error;

  await recalculateVisualAssetUsageCount(assetId);
}

export async function recalculateVisualAssetUsageCount(assetId: string): Promise<void> {
  const { count, error } = await supabase
    .from("visual_asset_usage_log")
    .select("*", { count: "exact", head: true })
    .eq("asset_id", assetId);

  if (error) throw error;

  await supabase
    .from("visual_assets")
    .update({ usage_count: count ?? 0 })
    .eq("id", assetId);
}

// ─── ASSET TYPES ────────────────────────────────────────────

export const VISUAL_ASSET_TYPES: { value: VisualAssetType; label: string }[] = [
  { value: "overlay", label: "Overlay" },
  { value: "texture", label: "Texture" },
  { value: "pattern", label: "Pattern" },
  { value: "gradient", label: "Gradient" },
  { value: "icon", label: "Icon" },
  { value: "background", label: "Background" },
  { value: "decorative", label: "Decorative" },
];

export function getAssetTypeLabel(type: VisualAssetType): string {
  return VISUAL_ASSET_TYPES.find((t) => t.value === type)?.label ?? type;
}

// ─── SLUG GENERATION ────────────────────────────────────────

export function generateVisualAssetSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function ensureUniqueVisualAssetSlug(
  name: string,
  currentId?: string,
): Promise<string> {
  let slug = generateVisualAssetSlug(name);
  let counter = 2;
  let isUnique = false;

  while (!isUnique) {
    const { data, error } = await supabase
      .from("visual_assets")
      .select("id")
      .eq("slug", slug)
      .single();

    if (error || !data || data.id === currentId) {
      isUnique = true;
    } else {
      slug = `${generateVisualAssetSlug(name)}-${counter}`;
      counter++;
    }
  }

  return slug;
}
