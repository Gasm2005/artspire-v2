// One-time optimizer for images ALREADY in Supabase storage.
//
// What it does (NON-destructive):
//   1. Reads every row in media_library (id, storage_path, mime_type).
//   2. Downloads each file and saves the ORIGINAL to scripts/_image-backup/
//      (your free local safety net — no Supabase backup needed).
//   3. Re-encodes with sharp to WebP (resized to max 1600px, ~80 quality).
//      The storage path/extension is unchanged (URLs stay valid) but the
//      bytes + stored content-type become WebP. Only re-uploads if smaller.
//   4. Overwrites the SAME storage path (upsert) so every public_url and all
//      references keep working — nothing is deleted, nothing breaks.
//   5. Updates media_library.file_size to the new size.
//
// Run (Node 20+, reads .env for the keys):
//   node --env-file=.env scripts/optimize-existing-images.mjs
//
// Requires in .env: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.

import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "media-library";
const MAX_EDGE = 1600;
const BACKUP_DIR = path.resolve("scripts/_image-backup");

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "Missing env. Run with:\n  node --env-file=.env scripts/optimize-existing-images.mjs\n" +
      "and make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in .env",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// Always output WebP — biggest savings. The file keeps its original storage
// path/extension (so every public_url stays valid), but its bytes + the
// stored content-type become WebP; browsers render by content-type, not by
// the ".png"/".jpg" in the URL.
async function reencode(buffer) {
  const img = sharp(buffer, { failOn: "none" }).rotate(); // rotate() respects EXIF orientation
  const meta = await img.metadata();
  if (meta.width && meta.width > MAX_EDGE)
    img.resize({ width: MAX_EDGE, withoutEnlargement: true });
  else if (meta.height && meta.height > MAX_EDGE)
    img.resize({ height: MAX_EDGE, withoutEnlargement: true });

  return { data: await img.webp({ quality: 80 }).toBuffer(), contentType: "image/webp" };
}

const RASTER = new Set(["image/jpeg", "image/png", "image/webp"]);

const { data: rows, error } = await supabase
  .from("media_library")
  .select("id, storage_path, mime_type, file_size, filename");
if (error) {
  console.error("Failed to read media_library:", error.message);
  process.exit(1);
}

await mkdir(BACKUP_DIR, { recursive: true });
console.log(`Found ${rows.length} media rows. Backing up originals to ${BACKUP_DIR}\n`);

let before = 0;
let after = 0;
let optimized = 0;
let skipped = 0;

for (const row of rows) {
  const label = row.storage_path;
  if (!RASTER.has(row.mime_type)) {
    skipped++;
    continue;
  }
  try {
    const { data: blob, error: dlErr } = await supabase.storage
      .from(BUCKET)
      .download(row.storage_path);
    if (dlErr || !blob) {
      console.warn(`  skip (download failed): ${label}`);
      skipped++;
      continue;
    }
    const original = Buffer.from(await blob.arrayBuffer());

    // Local backup of the TRUE original — only if not already backed up, so a
    // re-run never overwrites the first backup with an already-processed file.
    const backupPath = path.join(BACKUP_DIR, row.storage_path.replace(/[\\/]/g, "__"));
    if (!existsSync(backupPath)) await writeFile(backupPath, original);

    const { data: newData, contentType } = await reencode(original);

    // Only replace if we actually saved meaningful bytes.
    if (newData.length >= original.length * 0.9) {
      console.log(`  keep (already lean): ${label}  ${(original.length / 1024).toFixed(0)}KB`);
      before += original.length;
      after += original.length;
      skipped++;
      continue;
    }

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(row.storage_path, newData, { upsert: true, contentType });
    if (upErr) {
      console.warn(`  skip (upload failed): ${label} — ${upErr.message}`);
      skipped++;
      continue;
    }
    await supabase
      .from("media_library")
      .update({ file_size: newData.length, mime_type: "image/webp" })
      .eq("id", row.id);

    before += original.length;
    after += newData.length;
    optimized++;
    console.log(
      `✓ ${label}  ${(original.length / 1024).toFixed(0)}KB → ${(newData.length / 1024).toFixed(0)}KB`,
    );
  } catch (e) {
    console.warn(`  skip (error): ${label} — ${e.message}`);
    skipped++;
  }
}

console.log(
  `\nDone. Optimized ${optimized}, skipped ${skipped}.\n` +
    `Total: ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(1)}MB` +
    (before > 0 ? `  (saved ${((1 - after / before) * 100).toFixed(0)}%)` : ""),
);
console.log(`Originals backed up in ${BACKUP_DIR} (delete that folder once you're happy).`);
