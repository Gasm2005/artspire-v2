import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as getArtworks } from "./router-BMCUXijp.mjs";
import { s as supabase } from "./client-Um71xJKt.mjs";
import { f as Palette, E as Eye, h as FileText, i as MessageSquare, j as Plus } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
async function getCommissionRequests() {
  const { data, error } = await supabase.from("commission_requests").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
function AdminDashboard() {
  const [stats, setStats] = reactExports.useState({
    total: 0,
    published: 0,
    draft: 0,
    commissions: 0
  });
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    async function load() {
      try {
        const [allArtworks, commissions] = await Promise.all([getArtworks({
          limit: 1e3
        }), getCommissionRequests()]);
        const published = allArtworks.filter((a) => a.status === "published").length;
        const draft = allArtworks.filter((a) => a.status === "draft").length;
        setStats({
          total: allArtworks.length,
          published,
          draft,
          commissions: commissions.length
        });
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  const cards = [{
    label: "Total Artworks",
    value: stats.total,
    icon: Palette,
    color: "bg-forest/10 text-forest"
  }, {
    label: "Published",
    value: stats.published,
    icon: Eye,
    color: "bg-gold/10 text-gold"
  }, {
    label: "Drafts",
    value: stats.draft,
    icon: FileText,
    color: "bg-stone/10 text-stone"
  }, {
    label: "Commissions",
    value: stats.commissions,
    icon: MessageSquare,
    color: "bg-forest/5 text-forest"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-[24px] md:text-[28px] text-forest font-medium", children: "Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[13px] text-stone mt-0.5", children: "Overview of your Artspire content" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/admin/artworks/new", className: "inline-flex items-center gap-2 h-[44px] px-5 bg-forest text-white font-body font-bold text-[13px] rounded-xl btn-primary transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
        "New Artwork"
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-body text-stone text-[13px]", children: "Loading stats…" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4", children: cards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-border p-4 md:p-5 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.color} mb-3`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(card.icon, { size: 18 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-[28px] md:text-[32px] text-forest font-medium leading-none", children: card.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-body text-[11px] text-stone mt-1 uppercase tracking-wider font-semibold", children: card.label })
    ] }, card.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-border p-5 md:p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[18px] text-forest font-medium mb-4", children: "Quick Actions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/admin/artworks/new", className: "inline-flex items-center gap-2 h-[40px] px-4 bg-forest text-white font-body font-semibold text-[12px] rounded-xl btn-primary transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
          "Create New Artwork"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/admin/artworks", className: "inline-flex items-center gap-2 h-[40px] px-4 border border-forest text-forest font-body font-semibold text-[12px] rounded-xl btn-secondary transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 14 }),
          "Manage Artworks"
        ] })
      ] })
    ] })
  ] });
}
export {
  AdminDashboard as component
};
