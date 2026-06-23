// Post-build script: Fix tslib bundling for Vercel serverless functions.
//
// Root cause: Nitro's vercel preset traces @supabase/auth-js and
// @supabase/functions-js as external dependencies, but the tslib helper
// library (which both import from) is not bundled into the output.
//
// The _libs/tslib.mjs file is either missing or 0 bytes, causing
// ERR_MODULE_NOT_FOUND at runtime.
//
// This script:
// 1. Rewrites bare "tslib" imports to relative "./tslib.mjs" in all affected files
// 2. Copies the real tslib.es6.mjs into the output directory

// Post-build script: Fix tslib bundling for Vercel serverless functions.

import {
  readFileSync,
  writeFileSync,
  copyFileSync,
  existsSync,
  cpSync,
} from "fs";
import { join } from "path";

const OUTPUT_DIR = join(process.cwd(), ".vercel/output/functions/__server.func");
const LIBS_DIR = join(OUTPUT_DIR, "_libs");
const TSLIB_SRC = join(process.cwd(), "node_modules/tslib/tslib.es6.mjs");

const FILES_TO_PATCH = [
  "supabase__auth-js.mjs",
  "supabase__functions-js.mjs",
  "supabase__supabase-js.mjs",
];

function main() {
  console.log("[post-build] Starting tslib fix...");

  if (!existsSync(OUTPUT_DIR)) {
    console.warn("[post-build] Output directory not found:", OUTPUT_DIR);
    process.exit(0);
  }

  if (!existsSync(TSLIB_SRC)) {
    console.warn("[post-build] tslib source not found:", TSLIB_SRC);
    process.exit(0);
  }

  // Copy tslib.mjs
  const tslibDest = join(LIBS_DIR, "tslib.mjs");
  copyFileSync(TSLIB_SRC, tslibDest);
  console.log("[post-build] Copied tslib.es6.mjs -> _libs/tslib.mjs");

  // Copy tslib/modules directory
  const TSLIB_MODULES_SRC = join(
    process.cwd(),
    "node_modules/tslib/modules"
  );

  const TSLIB_MODULES_DEST = join(
    OUTPUT_DIR,
    "node_modules/tslib/modules"
  );

  if (existsSync(TSLIB_MODULES_SRC)) {
    cpSync(TSLIB_MODULES_SRC, TSLIB_MODULES_DEST, {
      recursive: true,
    });

    console.log("[post-build] Copied tslib/modules");
  }

  // Patch imports
  for (const file of FILES_TO_PATCH) {
    const filePath = join(LIBS_DIR, file);

    if (!existsSync(filePath)) {
      console.warn("[post-build] File not found, skipping:", file);
      continue;
    }

    let code = readFileSync(filePath, "utf-8");
    const original = code;

    code = code.replace(/from "tslib"/g, 'from "./tslib.mjs"');
    code = code.replace(/import "tslib"/g, 'import "./tslib.mjs"');

    if (code !== original) {
      writeFileSync(filePath, code);
      console.log("[post-build] Patched import in _libs/" + file);
    } else {
      console.log("[post-build] No tslib import in _libs/" + file);
    }
  }

  console.log("[post-build] Done.");
}

main();
