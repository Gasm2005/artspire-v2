import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as sections } from "./router-BuXjcpZ8.mjs";
import { L as Layout, w as waLink } from "./Layout-BvY1gIZf.mjs";
import { M as MessageCircle, d as ChevronDown } from "../_libs/lucide-react.mjs";
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
import "./client-e7dr843k.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function AccordionItem({
  item,
  isOpen,
  onToggle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/50 last:border-b-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onToggle, className: "w-full flex items-start justify-between gap-4 py-5 text-left group", "aria-expanded": isOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-[14px] md:text-[15px] font-medium text-forest leading-snug group-hover:text-gold transition-colors", children: item.question }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `mt-0.5 flex-shrink-0 text-forest transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 18 }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[13px] md:text-[14px] text-stone leading-relaxed pb-5", children: item.answer }) }) })
  ] });
}
function FaqPage() {
  const [openKey, setOpenKey] = reactExports.useState(null);
  const toggle = (key) => setOpenKey((prev) => prev === key ? null : key);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-cream text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[11px] md:text-[12px] font-semibold text-gold mb-4 uppercase tracking-[0.25em]", children: "Support" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-[32px] md:text-[42px] leading-[1.1] text-forest font-medium", children: "Frequently Asked Questions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] md:text-[16px] text-stone mt-4 max-w-lg mx-auto", children: "Everything you need to know before ordering your custom artwork." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pb-12 md:pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-main max-w-[800px]", children: sections.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 md:mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[20px] md:text-[22px] text-forest font-medium mb-4", children: section.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-xl border border-border/40 px-5 md:px-6", children: section.items.map((item) => {
        const key = `${section.title}::${item.question}`;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionItem, { item, isOpen: openKey === key, onToggle: () => toggle(key) }, key);
      }) })
    ] }, section.title)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-forest text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[24px] md:text-[28px] text-white font-medium mb-3", children: "Still have a question?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] md:text-[16px] text-cream/70 mb-8", children: "We reply within 2 hours on WhatsApp." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: waLink("Hi Artspire! I have a question about ordering a custom artwork."), target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 bg-brand-whatsapp text-white font-body font-bold text-[14px] tracking-wide px-8 py-3.5 rounded-full hover:shadow-lg transition-shadow active-scale btn-whatsapp", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 18 }),
        "Chat With Us on WhatsApp"
      ] })
    ] }) })
  ] });
}
export {
  FaqPage as component
};
