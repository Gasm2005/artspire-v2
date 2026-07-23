// Image optimizer — converts raster images in public/ to WebP (and downsizes
// known-oversized assets to their real display size). Run manually whenever
// you add or change images:
//
//   npm run optimize:images
//
// It writes a .webp next to each .png/.jpg (originals are kept as fallbacks).
// Reference the .webp in your markup (see src/components/site/SiteChrome.tsx).

import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const PUBLIC_DIR = path.resolve("public");
const RASTER = /\.(png|jpe?g)$/i;
const WEBP_QUALITY = 80;

// Skip social-share images — OG/Twitter crawlers need PNG/JPG, not WebP.
const EXCLUDE = new Set(["og-image.jpg", "og-image.png"]);

// Assets displayed much smaller than their intrinsic size — cap width at 2x
// the CSS display width (retina). Everything else converts at native size.
const MAX_WIDTHS = {
  "artspire-logo.png": 500, // displayed ~249px wide
  "hero-lamp.jpg": 700, // hero frame displays ~300px wide; 700px covers 2x retina
  "hero-clay.jpg": 700,
  "hero-cement.jpg": 700,
};

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (RASTER.test(entry.name) && !EXCLUDE.has(entry.name)) out.push(full);
  }
  return out;
}

const files = await walk(PUBLIC_DIR);
if (files.length === 0) {
  console.log("No PNG/JPG images found in public/.");
  process.exit(0);
}

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const name = path.basename(file);
  const outFile = file.replace(RASTER, ".webp");
  const maxWidth = MAX_WIDTHS[name];

  let pipeline = sharp(file);
  const meta = await pipeline.metadata();
  if (maxWidth && meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }
  await pipeline.webp({ quality: WEBP_QUALITY }).toFile(outFile);

  const before = (await stat(file)).size;
  const after = (await stat(outFile)).size;
  totalBefore += before;
  totalAfter += after;

  const rel = path.relative(process.cwd(), outFile);
  console.log(
    `✓ ${rel}  ${(before / 1024).toFixed(1)}KB → ${(after / 1024).toFixed(1)}KB` +
      (maxWidth ? `  (capped at ${maxWidth}px wide)` : ""),
  );
}

const saved = totalBefore > 0 ? (1 - totalAfter / totalBefore) * 100 : 0;
console.log(
  `\nTotal: ${(totalBefore / 1024).toFixed(1)}KB → ${(totalAfter / 1024).toFixed(1)}KB ` +
    `(saved ${saved.toFixed(0)}%)`,
);
