import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Layout, w as waLink } from "./Layout-CwWMbCeQ.mjs";
import { A as ArrowRight } from "../_libs/lucide-react.mjs";
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
const filters = [{
  key: "all",
  label: "All"
}, {
  key: "sketches",
  label: "Pencil Sketches"
}, {
  key: "portraits",
  label: "Colour Portraits"
}, {
  key: "paintings",
  label: "Paintings"
}, {
  key: "mirror",
  label: "Mirror Art"
}, {
  key: "clay",
  label: "Clay Art"
}, {
  key: "gifts",
  label: "Personalized Gifts"
}];
const items = Array.from({
  length: 12
}).map((_, i) => ({
  id: i,
  cat: filters[i % (filters.length - 1) + 1].key
}));
const workPatterns = ["art-cat-sketches", "art-cat-paintings", "art-cat-portraits", "art-cat-clay", "art-cat-mirror", "art-cat-gifts", "art-cat-sketches", "art-cat-paintings", "art-cat-portraits", "art-cat-clay", "art-cat-mirror", "art-cat-gifts"];
const workTitles = ["Family Portrait", "Sunset Canvas", "Couple Sketch", "Clay Sculpture", "Mirror Mandala", "Gift Set", "Pet Portrait", "Watercolor Landscape", "Anniversary Gift", "Memorial Portrait", "Baby Portrait", "Home Decor Piece"];
const workPrices = ["From ₹999", "From ₹2,999", "From ₹1,999", "From ₹1,799", "From ₹2,499", "From ₹799", "From ₹999", "From ₹2,999", "From ₹1,999", "From ₹999", "From ₹799", "From ₹2,499"];
function PortfolioPage() {
  const [active, setActive] = reactExports.useState("all");
  const visible = items.filter((i) => active === "all" || i.cat === active);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-cream text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[11px] md:text-[12px] font-semibold text-gold mb-4 uppercase tracking-[0.25em]", children: "Our Work" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-[32px] md:text-[42px] leading-[1.1] text-forest font-medium mb-4", children: "Every Piece Tells a Story" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] md:text-[16px] text-stone max-w-xl mx-auto", children: "Handcrafted portraits, paintings, mirror art, clay sculptures and personalized gifts." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-main", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:justify-center md:flex-wrap", children: filters.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActive(f.key), className: `shrink-0 px-4 py-2.5 rounded-full font-body text-[12px] font-semibold border transition-all duration-200 ${active === f.key ? "bg-forest text-white border-forest shadow-sm" : "bg-transparent text-stone border-border hover:border-forest/40 hover:text-forest"}`, children: f.label }, f.key)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pb-12 md:pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-main", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5", children: visible.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${workPatterns[item.id]} work-card portfolio-item relative rounded-xl overflow-hidden flex flex-col h-[300px] md:h-[340px] shadow-sm group cursor-pointer`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-4 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-3 py-1 bg-gold/90 text-white font-body text-[10px] font-bold uppercase tracking-wider rounded-full", children: item.cat }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-5 z-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-[16px] md:text-[18px] text-white font-medium", children: workTitles[item.id] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[13px] text-gold font-semibold mt-1", children: workPrices[item.id] })
      ] })
    ] }, item.id)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pb-12 md:pb-16 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-main", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "inline-flex items-center gap-2 h-[48px] px-8 border-2 border-forest text-forest font-body font-semibold text-[13px] uppercase rounded-xl active-scale btn-secondary", children: [
      "Load More Work ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-forest text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[24px] md:text-[32px] text-white font-medium mb-3", children: "Don't See What You're Looking For?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] md:text-[16px] text-cream/70 mb-8 leading-relaxed", children: "Every piece is custom made. Share your idea and I'll bring it to life." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: waLink("Hi Artspire, I'd like to start a custom commission."), target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 h-[52px] px-8 bg-gold text-forest font-body font-bold text-[14px] tracking-wide rounded-full btn-gold transition-colors active-scale", children: "Start a Custom Commission" })
    ] }) })
  ] });
}
export {
  PortfolioPage as component
};
