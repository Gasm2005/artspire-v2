import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Layout, w as waLink } from "./Layout-BvY1gIZf.mjs";
import { R as Route } from "./router-BuXjcpZ8.mjs";
import { f as Palette, R as Ruler, h as IndianRupee, T as Tag, M as MessageCircle, d as ChevronDown } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
function ArtworkPage() {
  const {
    artwork,
    tags,
    related,
    faqs
  } = Route.useLoaderData();
  const [openFaq, setOpenFaq] = reactExports.useState(null);
  const storyHtml = parseStoryContent(artwork.story_content);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative w-full h-[50vh] md:h-[60vh] overflow-hidden", children: [
      artwork.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: artwork.image_url, alt: artwork.title, className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-forest to-deep-forest" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 p-6 md:p-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main", children: [
        artwork.categories?.name && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-3 py-1 bg-gold/90 text-white font-body text-[10px] font-bold uppercase tracking-wider rounded-full mb-3", children: artwork.categories.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-[28px] md:text-[48px] text-white font-medium leading-tight", children: artwork.title })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-cream", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[22px] md:text-[28px] text-forest font-medium mb-4", children: "About this Piece" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] md:text-[16px] text-stone leading-relaxed mb-6", children: artwork.summary }),
        storyHtml && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-body text-[14px] md:text-[16px] text-stone leading-relaxed prose prose-stone max-w-none", dangerouslySetInnerHTML: {
          __html: storyHtml
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-[18px] text-forest font-medium mb-4", children: "Artwork Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "space-y-3", children: [
          artwork.medium && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 16, className: "text-gold shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-body text-[11px] text-stone/60 uppercase tracking-wider", children: "Medium" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-body text-[14px] text-forest font-medium", children: artwork.medium })
            ] })
          ] }),
          artwork.size && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Ruler, { size: 16, className: "text-gold shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-body text-[11px] text-stone/60 uppercase tracking-wider", children: "Size" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-body text-[14px] text-forest font-medium", children: artwork.size })
            ] })
          ] }),
          artwork.price != null && artwork.price > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { size: 16, className: "text-gold shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-body text-[11px] text-stone/60 uppercase tracking-wider", children: "Price" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "font-body text-[14px] text-forest font-medium", children: [
                "₹",
                artwork.price.toLocaleString("en-IN")
              ] })
            ] })
          ] }),
          tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 16, className: "text-gold shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-body text-[11px] text-stone/60 uppercase tracking-wider mb-1", children: "Tags" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "flex flex-wrap gap-2", children: tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 bg-forest/5 text-forest font-body text-[11px] rounded-full", children: tag.name }, tag.id)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 pt-6 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: waLink(`Hi Artspire, I'm interested in "${artwork.title}". Can you tell me more?`), target: "_blank", rel: "noreferrer", className: "flex items-center justify-center gap-2 w-full h-[48px] bg-gold text-forest font-body font-bold text-[13px] rounded-xl btn-gold transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 16 }),
          "Enquire on WhatsApp"
        ] }) })
      ] }) })
    ] }) }),
    faqs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[22px] md:text-[28px] text-forest font-medium mb-8 text-center", children: "Frequently Asked Questions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: faqs.map((faq) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border rounded-xl overflow-hidden transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpenFaq(openFaq === faq.id ? null : faq.id), className: "flex items-center justify-between w-full p-4 md:p-5 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-[14px] md:text-[15px] text-forest font-medium pr-4", children: faq.question }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 18, className: `shrink-0 text-stone transition-transform duration-200 ${openFaq === faq.id ? "rotate-180" : ""}` })
        ] }),
        openFaq === faq.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 md:px-5 pb-4 md:pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[13px] md:text-[14px] text-stone leading-relaxed", children: faq.answer }) })
      ] }, faq.id)) })
    ] }) }),
    related.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-cream", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[22px] md:text-[28px] text-forest font-medium mb-8 text-center", children: "You May Also Like" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5", children: related.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `/artwork/${item.slug}`, className: "group block rounded-xl overflow-hidden shadow-sm bg-white hover-lift", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[220px] md:h-[260px] overflow-hidden", children: [
        item.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.image_url, alt: item.title, className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-forest/10 to-gold/10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-[15px] text-white font-medium", children: item.title }),
          item.price != null && item.price > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-[12px] text-gold font-semibold mt-1", children: [
            "₹",
            item.price.toLocaleString("en-IN")
          ] })
        ] })
      ] }) }, item.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-forest text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[24px] md:text-[32px] text-white font-medium mb-3", children: "Want Something Similar?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] md:text-[16px] text-cream/70 mb-8 leading-relaxed", children: "Every piece is custom made. Share your idea and I'll bring it to life." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: waLink("Hi Artspire, I'd like to commission a custom piece similar to what I just saw."), target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 h-[52px] px-8 bg-gold text-forest font-body font-bold text-[14px] tracking-wide rounded-full btn-gold transition-colors active-scale", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 18 }),
        "Start a Commission"
      ] })
    ] }) })
  ] });
}
function parseStoryContent(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") return parsed;
    if (parsed && typeof parsed === "object") {
      if (parsed.type === "doc" && Array.isArray(parsed.content)) {
        return convertTipTapToHtml(parsed);
      }
      return JSON.stringify(parsed);
    }
    return String(parsed);
  } catch {
    return raw;
  }
}
function convertTipTapToHtml(node) {
  if (!node || typeof node !== "object") return "";
  if (node.type === "text") {
    const text = String(node.text ?? "");
    const marks = node.marks;
    if (!marks) return escapeHtml(text);
    return marks.reduce((acc, mark) => {
      switch (mark.type) {
        case "bold":
          return `<strong>${acc}</strong>`;
        case "italic":
          return `<em>${acc}</em>`;
        case "link":
          return `<a href="${escapeHtml(String(mark.attrs?.href ?? "#"))}" target="_blank" rel="noopener noreferrer">${acc}</a>`;
        default:
          return acc;
      }
    }, escapeHtml(text));
  }
  if (node.type === "paragraph") {
    const content = node.content ?? [];
    return `<p>${content.map(convertTipTapToHtml).join("")}</p>`;
  }
  if (node.type === "heading") {
    const level = Math.min(Math.max(Number(node.level ?? 1), 1), 6);
    const content = node.content ?? [];
    return `<h${level}>${content.map(convertTipTapToHtml).join("")}</h${level}>`;
  }
  if (node.type === "bulletList") {
    const content = node.content ?? [];
    return `<ul>${content.map(convertTipTapToHtml).join("")}</ul>`;
  }
  if (node.type === "orderedList") {
    const content = node.content ?? [];
    return `<ol>${content.map(convertTipTapToHtml).join("")}</ol>`;
  }
  if (node.type === "listItem") {
    const content = node.content ?? [];
    return `<li>${content.map(convertTipTapToHtml).join("")}</li>`;
  }
  if (node.type === "doc" || Array.isArray(node.content)) {
    const content = node.content ?? [];
    return content.map(convertTipTapToHtml).join("");
  }
  return "";
}
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
export {
  ArtworkPage as component
};
