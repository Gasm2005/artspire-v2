import { supabase } from "@/integrations/supabase/client";

export type UploadResult = {
  path: string;
  publicUrl: string;
};

/**
 * Upload an image to the Supabase Storage artwork-images bucket.
 * Returns the stored path and public URL.
 */
export async function uploadArtworkImage(
  file: File,
  slug: string
): Promise<UploadResult> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const path = `${slug}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("artwork-images")
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from("artwork-images")
    .getPublicUrl(data.path);

  return {
    path: data.path,
    publicUrl: publicUrlData.publicUrl,
  };
}

/**
 * Delete an image from the artwork-images bucket.
 */
export async function deleteArtworkImage(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from("artwork-images")
    .remove([path]);

  if (error) throw error;
}

/**
 * Get the public URL for an image path.
 */
export function getImageUrl(path: string): string {
  const { data } = supabase.storage
    .from("artwork-images")
    .getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload a profile avatar to the avatars bucket.
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<UploadResult> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const path = `${userId}/avatar.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(data.path);

  return {
    path: data.path,
    publicUrl: publicUrlData.publicUrl,
  };
}
