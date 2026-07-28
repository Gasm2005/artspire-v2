import { supabase } from "@/integrations/supabase/client";

// Uploads a customer's commission reference photos to the PRIVATE
// `reference-images` bucket (anon INSERT is allowed by that bucket's existing
// RLS; anon cannot read, list, or delete — see the 0C policy review). Files
// are compressed client-side first. We return the storage PATHS (never public
// URLs — the bucket is private); the admin Lead Center signs them fresh.
//
// Each submission gets an unguessable UUID folder prefix. This isn't an RLS
// requirement (anon can't read the bucket) but it's a free extra layer given
// the blanket "anyone can upload" INSERT policy.

const BUCKET = "reference-images";
export const MAX_PHOTOS = 5;
export const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB per original file
export const MAX_TOTAL_BYTES = 40 * 1024 * 1024; // 40MB total per submission
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export type PhotoUploadProgress = {
  index: number;
  name: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

export function validatePhotos(files: File[]): string | null {
  if (files.length > MAX_PHOTOS) return `Please attach at most ${MAX_PHOTOS} photos.`;
  let total = 0;
  for (const f of files) {
    if (!f.type.startsWith("image/") && !ACCEPTED.includes(f.type)) {
      return `"${f.name}" is not an image.`;
    }
    if (f.size > MAX_FILE_BYTES) {
      return `"${f.name}" is larger than 15MB. Please use a smaller photo.`;
    }
    total += f.size;
  }
  if (total > MAX_TOTAL_BYTES) return "Those photos add up to more than 40MB in total.";
  return null;
}

async function compress(file: File): Promise<File> {
  try {
    const { default: imageCompression } = await import("browser-image-compression");
    const out = await imageCompression(file, {
      maxWidthOrHeight: 1800,
      maxSizeMB: 0.6,
      initialQuality: 0.8,
      useWebWorker: true,
      fileType: "image/webp",
    });
    return new File([out], "photo.webp", { type: "image/webp" });
  } catch {
    return file; // fall back to the original if compression fails
  }
}

/**
 * Uploads each photo and returns the storage paths of the ones that succeeded.
 * Reports per-file progress via the optional callback. Never throws for a
 * single failed file — the caller decides what to do with partial results.
 */
export async function uploadCommissionPhotos(
  files: File[],
  onProgress?: (p: PhotoUploadProgress) => void,
): Promise<{ paths: string[]; failed: number }> {
  const folder = `commission/${crypto.randomUUID()}`;
  const paths: string[] = [];
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.({ index: i, name: file.name, status: "uploading" });
    try {
      const compressed = await compress(file);
      const path = `${folder}/${i}.webp`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
        upsert: false,
        contentType: "image/webp",
      });
      if (error) throw error;
      paths.push(path);
      onProgress?.({ index: i, name: file.name, status: "done" });
    } catch (err) {
      failed++;
      onProgress?.({
        index: i,
        name: file.name,
        status: "error",
        error: err instanceof Error ? err.message : "Upload failed",
      });
    }
  }

  return { paths, failed };
}
