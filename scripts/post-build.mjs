import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const OUTPUT_DIR = join(process.cwd(), ".vercel/output/functions/__server.func");
const LIBS_DIR = join(OUTPUT_DIR, "_libs");
const TSLIB_SRC_DIR = join(process.cwd(), "node_modules/tslib");
const TSLIB_DEST_DIR = join(OUTPUT_DIR, "node_modules/tslib");

const TSLIB_IMPORT_PATTERNS = [
  { regex: /from "tslib"/g, replacement: (relPath) => `from "${relPath}"` },
  { regex: /import "tslib"/g, replacement: (relPath) => `import "${relPath}"` },
];

function copyDirRecursive(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    const stat = statSync(srcPath);
    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else if (stat.isFile()) {
      copyFileSync(srcPath, destPath);
    }
  }
}

function walk(dir, callback) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, callback);
    } else if (stat.isFile() && entry.endsWith(".mjs")) {
      callback(fullPath);
    }
  }
}

function patchFile(filePath) {
  const code = readFileSync(filePath, "utf-8");
  const original = code;
  let patched = code;
  let changed = false;

  const relPath = relative(join(filePath, ".."), join(LIBS_DIR, "tslib.mjs")).replace(/\\/g, "/");

  for (const pattern of TSLIB_IMPORT_PATTERNS) {
    patched = patched.replace(pattern.regex, pattern.replacement(relPath));
  }

  if (patched !== original) {
    writeFileSync(filePath, patched);
    changed = true;
  }

  return changed;
}

function main() {
  console.log("[post-build] Starting tslib fix...");

  if (!existsSync(OUTPUT_DIR)) {
    console.warn("[post-build] Output directory not found:", OUTPUT_DIR);
    process.exit(0);
  }

  if (!existsSync(TSLIB_SRC_DIR)) {
    console.warn("[post-build] tslib source not found:", TSLIB_SRC_DIR);
    process.exit(0);
  }

  // 1. Copy the entire tslib package into output/node_modules/tslib
  copyDirRecursive(TSLIB_SRC_DIR, TSLIB_DEST_DIR);
  console.log("[post-build] Copied entire node_modules/tslib → output/node_modules/tslib");

  // 2. Also copy the ESM entry into _libs for the relative import fallback
  const tslibSrcMjs = join(TSLIB_SRC_DIR, "tslib.es6.mjs");
  const tslibDestMjs = join(LIBS_DIR, "tslib.mjs");
  if (existsSync(tslibSrcMjs)) {
    copyFileSync(tslibSrcMjs, tslibDestMjs);
    console.log("[post-build] Copied tslib.es6.mjs → _libs/tslib.mjs");
  }

  // 3. Recursively patch ALL .mjs files in the output directory
  let patchedCount = 0;
  let scannedCount = 0;

  walk(OUTPUT_DIR, (filePath) => {
    scannedCount++;
    if (patchFile(filePath)) {
      const rel = relative(OUTPUT_DIR, filePath).replace(/\\/g, "/");
      console.log("[post-build] Patched tslib import in", rel);
      patchedCount++;
    }
  });

  console.log(`[post-build] Scanned ${scannedCount} .mjs files, patched ${patchedCount}.`);
  console.log("[post-build] Done.");
}

main();
