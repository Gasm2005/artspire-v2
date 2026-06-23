import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { A as ArtworkForm } from "./ArtworkForm-DfBHkWHV.mjs";
import { c as Route } from "./router-BMCUXijp.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./client-Um71xJKt.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
function EditArtworkPage() {
  const {
    artwork
  } = Route.useLoaderData();
  const router = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-[24px] md:text-[28px] text-forest font-medium", children: "Edit Artwork" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-[13px] text-stone mt-0.5", children: [
        'Update "',
        artwork.title,
        '"'
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-2xl border border-border p-5 md:p-8 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArtworkForm, { artwork, onSuccess: () => {
      router.navigate({
        to: "/admin/artworks"
      });
    } }) })
  ] });
}
export {
  EditArtworkPage as component
};
