import {
  readFileSync,
  writeFileSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "fs";
import { join, relative, dirname } from "path";

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

  const relPath = relative(
    dirname(filePath),
    join(LIBS_DIR, "tslib.mjs")
  ).replace(/\\/g, "/");

  for (const pattern of TSLIB_IMPORT_PATTERNS) {
    patched = patched.replace(pattern.regex, pattern.replacement(relPath));
  }

  if (patched !== original) {
    writeFileSync(filePath, patched);
    changed = true;
  }

  return changed;
}

function overridePackageJson() {
  const pkgPath = join(TSLIB_DEST_DIR, "package.json");
  if (!existsSync(pkgPath)) {
    console.warn("[post-build] tslib package.json not found in output, skipping override");
    return;
  }

  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

  // Root cause fix: remove the "node" condition from exports.import.
  // The "node" condition points to modules/index.js which is a CJS file
  // that does require('../tslib.js'). Nitro's nft tracer copies the entry
  // point but does not trace the internal CJS require chain, so tslib.js
  // is missing at runtime. By removing the "node" condition, Node.js falls
  // through to the "default" which is tslib.es6.mjs — a pure, self-contained
  // ESM file with no transitive dependencies.
  if (pkg.exports && pkg.exports["."] && pkg.exports["."].import) {
    const originalImport = pkg.exports["."].import;

    // If there's a "node" sub-condition, flatten it to use the default
    if (typeof originalImport === "object" && originalImport.node) {
      pkg.exports["."].import = {
        types: originalImport.types || originalImport.default?.types || "./modules/index.d.ts",
        default: originalImport.default?.default || "./tslib.es6.mjs",
      };
      console.log("[post-build] Removed 'node' condition from tslib exports.import");
    }
  }

  // Also ensure the main/module fields point to the ESM version for consistency
  pkg.module = pkg.module || "tslib.es6.mjs";

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log("[post-build] Wrote patched package.json to node_modules/tslib/package.json");
}

function verifyRequiredFiles() {
  const required = [
    join(TSLIB_DEST_DIR, "tslib.es6.mjs"),
    join(TSLIB_DEST_DIR, "package.json"),
  ];
  const missing = required.filter((f) => !existsSync(f));
  if (missing.length > 0) {
    throw new Error(`[post-build] CRITICAL: Missing files in output: ${missing.join(", ")}`);
  }
  console.log("[post-build] Verified all required tslib files present in output");
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
  //    This ensures ALL files are present, including fallback CJS files.
  copyDirRecursive(TSLIB_SRC_DIR, TSLIB_DEST_DIR);
  console.log("[post-build] Copied entire node_modules/tslib → output/node_modules/tslib");

  // 2. ROOT CAUSE FIX: Override package.json to remove the "node" condition
  //    from exports.import. This forces Node.js to use tslib.es6.mjs (pure ESM)
  //    instead of modules/index.js (CJS with require('../tslib.js')).
  //    Nitro's nft tracer cannot trace the internal CJS require chain, so
  //    copying more files is chasing symptoms. Removing the "node" condition
  //    fixes the root cause.
  overridePackageJson();

  // 3. Also copy the ESM entry into _libs for the relative import fallback
  const tslibSrcMjs = join(TSLIB_SRC_DIR, "tslib.es6.mjs");
  const tslibDestMjs = join(LIBS_DIR, "tslib.mjs");
  if (existsSync(tslibSrcMjs)) {
    copyFileSync(tslibSrcMjs, tslibDestMjs);
    console.log("[post-build] Copied tslib.es6.mjs → _libs/tslib.mjs");
  }

  // 4. Verify critical files exist before patching
  verifyRequiredFiles();

  // 5. Recursively patch ALL .mjs files in the output directory
  //    This is a safety net for any bare "tslib" imports the override misses.
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

  console.log(
    `[post-build] Scanned ${scannedCount} .mjs files, patched ${patchedCount}.`
  );
  console.log("[post-build] Done.");
}

main();
