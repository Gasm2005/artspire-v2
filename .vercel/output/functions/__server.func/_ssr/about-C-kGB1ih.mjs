import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Layout, w as waLink } from "./Layout-BvY1gIZf.mjs";
import { I as ImageWithFallback } from "./ImageWithFallback-PVHgcxD1.mjs";
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
import "../_libs/lucide-react.mjs";
const IMG = {
  sketch: "https://picsum.photos/seed/artspire-about1/600/400",
  studio: "https://picsum.photos/seed/artspire-studio/600/400"
};
const beliefs = ["I believe in authenticity. Every piece is made by hand — never printed, never machine-made.", "I believe in personal connection. From your first message to delivery, you speak directly to me.", "I believe in quality over convenience. If it doesn't feel right, I start over."];
const trust = ["11+ Years", "1000+ Memories Created", "One Pair of Hands", "Handcrafted"];
const milestones = [{
  num: "11+",
  label: "Years of Experience"
}, {
  num: "1000+",
  label: "Artworks Created"
}, {
  num: "500+",
  label: "Happy Clients"
}, {
  num: "4.9",
  label: "Star Rating"
}];
function AboutPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-cream text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[11px] md:text-[12px] font-semibold text-gold mb-4 uppercase tracking-[0.25em]", children: "The Artist Behind Artspire" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-[32px] md:text-[42px] leading-[1.1] text-forest font-medium mb-6", children: "Every Artwork Begins With a Story. Yours." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-body text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-stone", children: trust.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-3", children: [
        t,
        i < trust.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold", children: "·" })
      ] }, t)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pb-12 md:pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-main", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:gap-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden mb-8 lg:mb-0 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageWithFallback, { alt: "Himangi working in her studio", className: "w-full h-full object-cover img-zoom", src: IMG.sketch }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-1/2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[24px] md:text-[28px] text-forest font-medium mb-4", children: "Why Artspire Exists" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] md:text-[15px] leading-relaxed text-stone mb-8", children: "Think about the last time you wanted to give someone something truly original. Not something pulled from a shelf. Not a name stamped on a mug. Something that captured them — the way they laugh, the memory that still makes your chest ache. That gap — between wanting something deeply personal and finding a way to create it — is exactly where Artspire was born." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[24px] md:text-[28px] text-forest font-medium mb-4", children: "What I Believe" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", children: beliefs.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-cream-dark border-l-4 border-gold rounded-r-xl p-4 md:p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[13px] md:text-[14px] leading-relaxed text-charcoal", children: b }) }, i)) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pb-12 md:pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-main", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4", children: milestones.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl border border-border/60 p-5 md:p-6 text-center hover-lift", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[32px] md:text-[40px] text-gold font-bold leading-none mb-2", children: m.num }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[12px] md:text-[13px] text-stone uppercase tracking-wider", children: m.label })
    ] }, m.label)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pb-12 md:pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-main", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row-reverse lg:items-center lg:gap-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden mb-8 lg:mb-0 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageWithFallback, { alt: "Artwork in progress", className: "w-full h-full object-cover img-zoom", src: IMG.studio }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-1/2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[24px] md:text-[28px] text-forest font-medium mb-4", children: "The Night I Started Over" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] md:text-[15px] leading-relaxed text-stone mb-8", children: `A client needed a portrait — a birthday gift for a local MLA. Timeline: seven days. By day six, the portrait was nearly finished. But something felt wrong. Not wrong in a way a client would notice. Wrong in a way only the artist can feel. I faced a choice: deliver what I had, or admit it wasn't good enough. I chose to start over. Entirely. When he saw the final portrait, he held it — and handed me an additional ₹1,000. Voluntarily. "This," he said, "is what I wanted."` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[24px] md:text-[28px] text-forest font-medium mb-4", children: "Why Clients Return" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] md:text-[15px] leading-relaxed text-stone", children: "Trust is not built through marketing. When you describe the way your father's eyes crinkle when he laughs, I hear it from you directly. Over 1,000 completed artworks have taught me what lasts." })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-cream text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[26px] md:text-[32px] text-forest font-medium mb-3", children: "Tell Me Your Idea" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] md:text-[16px] text-stone mb-8 leading-relaxed", children: "You don't need a plan. Just a memory that matters." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: waLink("Hi Himangi, I have an idea I'd love to share with you."), target: "_blank", rel: "noreferrer", className: "inline-flex h-[52px] px-10 bg-forest text-white font-body font-bold text-[14px] tracking-wide rounded-full btn-primary hover:bg-forest-dark transition-colors active-scale", children: "Start Your Conversation" })
    ] }) })
  ] });
}
export {
  AboutPage as component
};
