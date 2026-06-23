import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as getArtworks, p as publishArtwork, u as unpublishArtwork, a as archiveArtwork, b as softDeleteArtwork } from "./router-BMCUXijp.mjs";
import { j as Plus, l as LoaderCircle, E as Eye, m as EyeOff, n as SquarePen, o as Archive, p as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
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
function AdminArtworksPage() {
  const [artworks, setArtworks] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [actionId, setActionId] = reactExports.useState(null);
  const [filter, setFilter] = reactExports.useState("all");
  async function load() {
    setLoading(true);
    try {
      const data = await getArtworks({
        limit: 500,
        orderBy: "created_at",
        ascending: false
      });
      setArtworks(data);
    } catch (err) {
      console.error("Load artworks error:", err);
    } finally {
      setLoading(false);
    }
  }
  reactExports.useEffect(() => {
    load();
  }, []);
  const filtered = artworks.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });
  async function handlePublish(id) {
    setActionId(id);
    try {
      await publishArtwork(id);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  }
  async function handleUnpublish(id) {
    setActionId(id);
    try {
      await unpublishArtwork(id);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  }
  async function handleArchive(id) {
    if (!confirm("Archive this artwork? It will be hidden from the public.")) return;
    setActionId(id);
    try {
      await archiveArtwork(id);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  }
  async function handleDelete(id) {
    if (!confirm("Delete this artwork permanently? This cannot be undone.")) return;
    setActionId(id);
    try {
      await softDeleteArtwork(id);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  }
  const statusBadge = (status) => {
    const map = {
      published: "bg-green-50 text-green-700",
      draft: "bg-amber-50 text-amber-700",
      archived: "bg-stone-100 text-stone-500"
    };
    return map[status] || "bg-gray-50 text-gray-600";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-[24px] md:text-[28px] text-forest font-medium", children: "Artworks" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[13px] text-stone mt-0.5", children: "Manage and publish your artworks" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/admin/artworks/new", className: "inline-flex items-center gap-2 h-[44px] px-5 bg-forest text-white font-body font-bold text-[13px] rounded-xl btn-primary transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
        "New Artwork"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto no-scrollbar", children: ["all", "published", "draft", "archived"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilter(f), className: `shrink-0 px-3 py-1.5 rounded-lg font-body text-[12px] font-semibold transition-colors ${filter === f ? "bg-forest text-white" : "bg-white border border-border text-stone hover:border-forest/40"}`, children: f.charAt(0).toUpperCase() + f.slice(1) }, f)) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-body text-stone text-[13px]", children: "Loading artworks…" }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-border p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-stone text-[14px]", children: "No artworks found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/admin/artworks/new", className: "inline-flex items-center gap-2 h-[40px] px-4 mt-4 bg-forest text-white font-body font-semibold text-[12px] rounded-xl btn-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
        "Create your first artwork"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-2xl border border-border shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-body text-[10px] font-bold text-stone uppercase tracking-wider", children: "Artwork" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-body text-[10px] font-bold text-stone uppercase tracking-wider hidden md:table-cell", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-body text-[10px] font-bold text-stone uppercase tracking-wider", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-body text-[10px] font-bold text-stone uppercase tracking-wider text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((artwork) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border last:border-b-0 hover:bg-cream/30 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-forest/5 overflow-hidden shrink-0", children: artwork.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: artwork.image_url, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-stone/30 text-[10px]", children: "No img" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-body text-[13px] font-semibold text-forest", children: artwork.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-body text-[11px] text-stone/60", children: artwork.slug })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-[12px] text-stone", children: artwork.categories?.name ?? "—" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2 py-0.5 rounded-full font-body text-[10px] font-bold uppercase tracking-wider ${statusBadge(artwork.status)}`, children: artwork.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end gap-1", children: actionId === artwork.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin text-stone" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          artwork.status === "draft" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handlePublish(artwork.id), title: "Publish", className: "p-2 rounded-lg hover:bg-green-50 text-stone hover:text-green-600 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 }) }),
          artwork.status === "published" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleUnpublish(artwork.id), title: "Unpublish", className: "p-2 rounded-lg hover:bg-amber-50 text-stone hover:text-amber-600 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `/admin/artworks/edit/${artwork.id}`, title: "Edit", className: "p-2 rounded-lg hover:bg-forest/5 text-stone hover:text-forest transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleArchive(artwork.id), title: "Archive", className: "p-2 rounded-lg hover:bg-stone/10 text-stone hover:text-stone-700 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(artwork.id), title: "Delete", className: "p-2 rounded-lg hover:bg-red-50 text-stone hover:text-red-600 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) })
        ] }) }) })
      ] }, artwork.id)) })
    ] }) }) })
  ] });
}
export {
  AdminArtworksPage as component
};
