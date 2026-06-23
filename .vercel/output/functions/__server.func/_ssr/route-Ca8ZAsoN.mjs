import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { u as useAdmin } from "./useAdmin-N4biffV1.mjs";
import { s as supabase } from "./client-Um71xJKt.mjs";
import { L as LogOut } from "../_libs/lucide-react.mjs";
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
async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
function AdminLayout() {
  const {
    isAdmin,
    isLoading
  } = useAdmin();
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const isLoginPage = pathname === "/admin/login";
  reactExports.useEffect(() => {
    if (!isLoading && !isAdmin && !isLoginPage) {
      router.navigate({
        to: "/admin/login"
      });
    }
  }, [isLoading, isAdmin, isLoginPage, router]);
  if (isLoginPage) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-screen items-center justify-center bg-cream", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-body text-stone", children: "Loading admin panel…" }) });
  }
  if (!isAdmin) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cream", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-50 bg-white border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between h-[56px] px-4 md:px-6 max-w-[390px] mx-auto md:max-w-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-[18px] text-forest font-medium", children: "Artspire Admin" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AdminNavLink, { to: "/admin", label: "Dashboard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AdminNavLink, { to: "/admin/artworks", label: "Artworks" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
          await signOut();
          router.navigate({
            to: "/admin/login"
          });
        }, className: "flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-body font-semibold text-stone hover:text-forest transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 14 }),
          "Logout"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto no-scrollbar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminNavLink, { to: "/admin", label: "Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminNavLink, { to: "/admin/artworks", label: "Artworks" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "p-4 md:p-6 max-w-[390px] mx-auto md:max-w-6xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}
function AdminNavLink({
  to,
  label
}) {
  const router = useRouter();
  const active = router.state.location.pathname === to;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: to, className: `px-3 py-1.5 rounded-lg font-body text-[12px] font-semibold transition-colors ${active ? "bg-forest/10 text-forest" : "text-stone hover:text-forest"}`, children: label });
}
export {
  AdminLayout as component
};
