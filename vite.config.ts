// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { resolve } from "path";

// Source-map upload only runs when the build has a Sentry auth token (Vercel
// build env). Locally / without it, no maps are generated or uploaded.
const sentryEnabled = !!process.env.SENTRY_AUTH_TOKEN;

export default defineConfig({
  nitro: {
    preset: "vercel",
    // Prevent Nitro from externalizing tslib into a broken 0-byte chunk.
    // The @supabase/auth-js and @supabase/functions-js packages import
    // tslib helpers, but Nitro's vercel preset tracer creates _libs/tslib.mjs
    // as 0 bytes, causing ERR_MODULE_NOT_FOUND at runtime.
    // @ts-expect-error `externals` is a valid Nitro option at runtime but is
    // missing from TanStack Start's narrowed nitro config type.
    externals: {
      inline: ["tslib"],
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    // Generate source maps only when we're going to upload them to Sentry,
    // so production JS maps aren't served publicly by default.
    build: { sourcemap: sentryEnabled },
    plugins: sentryEnabled
      ? [
          sentryVitePlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
            telemetry: false,
            // Upload maps to Sentry, then delete them so they aren't public.
            sourcemaps: { filesToDeleteAfterUpload: ["**/*.map"] },
          }),
        ]
      : [],
    // Force Vite to bundle tslib into the SSR output instead of externalizing it.
    // This prevents the empty _libs/tslib.mjs chunk from being created.
    ssr: {
      noExternal: ["tslib"],
    },
    // Resolve "tslib" bare specifier to the actual ESM file path.
    // This helps bundlers find the correct entry point instead of relying
    // on package.json exports which may confuse the tracer.
    resolve: {
      alias: {
        tslib: resolve(process.cwd(), "node_modules/tslib/tslib.es6.mjs"),
      },
    },
  },
});
