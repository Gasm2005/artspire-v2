import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as Layout, w as waLink } from "./Layout-BvY1gIZf.mjs";
import { I as ImageWithFallback } from "./ImageWithFallback-PVHgcxD1.mjs";
import { A as ArrowRight, P as Pencil, f as Palette, F as Frame, g as Sparkles, G as Gift, B as Building2 } from "../_libs/lucide-react.mjs";
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
const FALLBACK_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e7e2db"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="16" fill="#51604d">Artspire Artwork</text></svg>`
)}`;
function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  caption
}) {
  const containerRef = reactExports.useRef(null);
  const [pct, setPct] = reactExports.useState(50);
  const draggingRef = reactExports.useRef(false);
  const [afterError, setAfterError] = reactExports.useState(false);
  const [beforeError, setBeforeError] = reactExports.useState(false);
  const moveTo = (clientX) => {
    const c = containerRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPct(x / rect.width * 100);
  };
  const onPointerDown = (e) => {
    draggingRef.current = true;
    e.target.setPointerCapture?.(e.pointerId);
    moveTo(e.clientX);
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    moveTo(e.clientX);
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: containerRef,
        className: "slider-container",
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel: onPointerUp,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { alt: "Finished Artwork", className: "slider-image", src: afterError ? FALLBACK_SVG : afterSrc, onError: () => setAfterError(true) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "slider-overlay", style: { width: `${pct}%` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { alt: "Original Photo", className: "slider-image", src: beforeError ? FALLBACK_SVG : beforeSrc, onError: () => setBeforeError(true) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "slider-handle-container absolute top-0 bottom-0 z-[10] pointer-events-none -translate-x-1/2",
              style: { left: `${pct}%` },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "slider-handle", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[18px]", children: "unfold_more" }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-4 bg-black/50 text-white font-body text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm z-20", children: "YOUR PHOTO" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4 bg-black/50 text-white font-body text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm z-20", children: "THE ARTWORK" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[12px] font-semibold text-deep-forest/60 text-center mt-4 tracking-widest uppercase", children: caption })
  ] });
}
const IMG = {
  // Hero images
  sketch: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
  portrait: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
  mirror: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80",
  clay: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
  // Before/After images
  sliderA1: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&q=80",
  sliderB1: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
  sliderA2: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
  sliderB2: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  sliderA3: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80",
  sliderB3: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  // Services
  painting: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
  gift: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
  mirror2: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80",
  clay2: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
  portrait2: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
  sketch2: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&q=80"
};
const services = [{
  title: "Pencil Sketches",
  price: "From ₹999",
  img: IMG.sketch,
  icon: Pencil,
  days: "5–7 days"
}, {
  title: "Colour Portraits",
  price: "From ₹1,999",
  img: IMG.portrait,
  icon: Palette,
  days: "7–10 days"
}, {
  title: "Custom Paintings",
  price: "From ₹2,999",
  img: IMG.painting,
  icon: Frame,
  days: "10–14 days"
}, {
  title: "Mirror Art",
  price: "From ₹2,499",
  img: IMG.mirror,
  icon: Sparkles,
  days: "7–12 days"
}, {
  title: "Clay Art",
  price: "From ₹1,799",
  img: IMG.clay,
  icon: Gift,
  days: "7–10 days"
}, {
  title: "Personalized Gifts",
  price: "From ₹799",
  img: IMG.gift,
  icon: Gift,
  days: "5–10 days"
}];
const portfolioCategories = [{
  key: "pencil-sketches",
  label: "Pencil Sketches",
  pattern: "art-cat-sketches",
  subtitle: "Timeless. Precise."
}, {
  key: "colour-portraits",
  label: "Colour Portraits",
  pattern: "art-cat-portraits",
  subtitle: "Vivid. Warm."
}, {
  key: "paintings",
  label: "Paintings",
  pattern: "art-cat-paintings",
  subtitle: "Bold. Textured."
}, {
  key: "mirror-art",
  label: "Mirror Art",
  pattern: "art-cat-mirror",
  subtitle: "Functional. Beautiful."
}, {
  key: "clay-art",
  label: "Clay Art",
  pattern: "art-cat-clay",
  subtitle: "Three-dimensional. Personal."
}, {
  key: "personalized-gifts",
  label: "Personalized Gifts",
  pattern: "art-cat-gifts",
  subtitle: "Made for one person."
}];
const recentWork = [{
  id: 1,
  title: "Family Portrait",
  cat: "sketches",
  price: "From ₹999",
  pattern: "art-cat-sketches"
}, {
  id: 2,
  title: "Sunset Canvas",
  cat: "paintings",
  price: "From ₹2,999",
  pattern: "art-cat-paintings"
}, {
  id: 3,
  title: "Couple Sketch",
  cat: "portraits",
  price: "From ₹1,999",
  pattern: "art-cat-portraits"
}, {
  id: 4,
  title: "Clay Sculpture",
  cat: "clay",
  price: "From ₹1,799",
  pattern: "art-cat-clay"
}, {
  id: 5,
  title: "Mirror Mandala",
  cat: "mirror",
  price: "From ₹2,499",
  pattern: "art-cat-mirror"
}, {
  id: 6,
  title: "Gift Set",
  cat: "gifts",
  price: "From ₹799",
  pattern: "art-cat-gifts"
}];
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
  key: "clay",
  label: "Clay Art"
}, {
  key: "mirror",
  label: "Mirror Art"
}, {
  key: "gifts",
  label: "Personalized Gifts"
}];
function Index() {
  const [activeFilter, setActiveFilter] = reactExports.useState("all");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "min-h-[100dvh] flex flex-col justify-center px-6 pt-16 pb-12 lg:flex-row lg:items-center lg:gap-16 lg:px-8 hero-texture", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-[1.5] flex flex-col items-center text-center lg:items-start lg:text-left max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[11px] md:text-[12px] font-semibold text-gold uppercase tracking-[0.25em] mb-5", children: "Handmade. Personalized. Yours." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-[32px] sm:text-[36px] md:text-[48px] lg:text-[64px] leading-[1.05] text-forest mb-6 font-medium px-2 lg:px-0", children: "Custom Handmade Art for Your Most Treasured Memories" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[15px] md:text-[18px] leading-relaxed text-stone mb-10 max-w-lg", children: "Transform your memories into handcrafted pencil sketches, paintings, and clay masterpieces." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: waLink("Hi Artspire! I want to commission artwork"), target: "_blank", rel: "noreferrer", className: "h-[52px] md:h-[56px] px-8 bg-forest text-white font-body font-semibold text-[13px] md:text-[14px] uppercase rounded-xl flex items-center justify-center gap-2 active-scale btn-primary", children: [
            "Commission Art ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 18 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/portfolio", className: "h-[52px] md:h-[56px] px-8 bg-transparent border-2 border-forest text-forest font-body font-semibold text-[13px] md:text-[14px] uppercase rounded-xl flex items-center justify-center gap-2 active-scale btn-secondary", children: "View Portfolio" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[12px] md:text-[13px] font-medium text-stone", children: "500+ Customers · 1000+ Artworks · 4.9★" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 w-full max-w-lg mt-10 lg:mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 rounded-2xl overflow-hidden shadow-lg", children: [IMG.sketch, IMG.portrait, IMG.mirror, IMG.clay].map((src, i) => {
        const alts = ["Handmade pencil sketch portrait by Artspire", "Custom colour portrait painting by Artspire", "Custom mirror art handcrafted by Artspire", "Clay art sculpture handcrafted by Artspire"];
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square bg-surface-variant overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageWithFallback, { alt: alts[i], className: "w-full h-full object-cover img-zoom", src, loading: i === 0 ? "eager" : "lazy" }) }, i);
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-white py-5 w-full border-y border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main text-center font-body text-[11px] md:text-[12px] font-semibold uppercase tracking-widest text-forest leading-relaxed", children: [
      "11+ Years ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold mx-1 text-[16px] leading-none align-middle", children: "•" }),
      " 1000+ Artworks ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold mx-1 text-[16px] leading-none align-middle", children: "•" }),
      " One Artist ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold mx-1 text-[16px] leading-none align-middle", children: "•" }),
      " Handcrafted"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-cream", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[28px] md:text-[36px] text-center text-forest mb-4 leading-tight", children: "What Would You Like to Create?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] text-stone text-center mb-12 max-w-lg mx-auto", children: "Choose from our signature handcrafted art services, each made with care and precision." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5", children: services.map((s) => {
        const Icon = s.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl overflow-hidden border border-border/60 flex flex-col hover-lift shadow-sm cursor-pointer card-stretch", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[180px] md:h-[200px] overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageWithFallback, { alt: s.title, className: "w-full h-full object-cover img-zoom", src: s.img, loading: "lazy" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-5 flex flex-col flex-grow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16, className: "text-gold" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-[16px] md:text-[19px] text-forest font-medium leading-tight", children: s.title })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[13px] text-gold font-semibold mb-1", children: s.price }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[11px] text-stone mb-3", children: s.days }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/portfolio", className: "font-body text-[12px] font-bold uppercase text-forest/70 flex items-center gap-1 hover:text-gold transition-colors mt-auto", children: [
              "Examples ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-sm", children: "east" })
            ] })
          ] })
        ] }, s.title);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-cream-dark", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[28px] md:text-[36px] text-center text-forest mb-4 leading-tight", children: "Your Photo. Our Masterpiece." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] text-stone text-center mb-12 max-w-lg mx-auto", children: "See the transformation from photo to handcrafted art." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BeforeAfterSlider, { beforeSrc: IMG.sliderB1, afterSrc: IMG.sliderA1, caption: "Pencil Sketch · 5 days" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BeforeAfterSlider, { beforeSrc: IMG.sliderB2, afterSrc: IMG.sliderA2, caption: "Color Portrait · 7 days" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BeforeAfterSlider, { beforeSrc: IMG.sliderB3, afterSrc: IMG.sliderA3, caption: "Custom Painting · 10 days" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-10 md:mt-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: waLink("Hi Artspire! I want to commission artwork"), target: "_blank", rel: "noreferrer", className: "inline-flex h-[52px] bg-forest text-white font-body font-semibold text-[13px] md:text-[14px] uppercase rounded-xl active-scale btn-primary shadow-md items-center justify-center px-10", children: "Commission Your Artwork" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[28px] md:text-[36px] text-center text-forest mb-4 leading-tight", children: "Simple. Personal. Yours." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] text-stone text-center mb-14 max-w-lg mx-auto", children: "Four easy steps from idea to delivered artwork." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8", children: [{
        n: "01",
        t: "Share Your Idea",
        d: "Send us your favorite photo and tell us what makes it special to you."
      }, {
        n: "02",
        t: "We Discuss & Confirm",
        d: "We'll help you choose the best style and size, and share a final quote."
      }, {
        n: "03",
        t: "Watch It Come to Life",
        d: "Receive updates as our artist meticulously crafts your one-of-a-kind piece."
      }, {
        n: "04",
        t: "Delivered to Your Door",
        d: "Safely packaged and shipped right to you, ready to be displayed and cherished."
      }].map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative text-center px-4 py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "process-step-num", children: step.n }),
        i < 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block process-divider" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-[18px] md:text-[20px] text-forest mb-3 font-medium mt-4", children: step.t }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] leading-relaxed text-stone", children: step.d })
        ] })
      ] }, step.n)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-cream-dark", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[28px] md:text-[36px] text-center text-forest mb-4 leading-tight", children: "Explore by Category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] text-stone text-center mb-12 max-w-lg mx-auto", children: "Browse our handcrafted art collections." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4", children: portfolioCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/portfolio?category=${cat.key}`, className: `${cat.pattern} cat-card relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer group`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col items-center justify-end h-full p-5 pb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-[18px] md:text-[22px] text-white font-medium drop-shadow-lg text-center", children: cat.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-[13px] text-gold mt-1 font-medium", children: cat.subtitle })
      ] }) }, cat.key)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-cream", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[28px] md:text-[36px] text-center text-forest mb-4 leading-tight", children: "Recent Work" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] text-stone text-center mb-10 max-w-lg mx-auto", children: "A selection of our latest handcrafted commissions." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex overflow-x-auto no-scrollbar gap-2 mb-10 pb-2 justify-start md:justify-center", children: filters.map((f) => {
        const active = activeFilter === f.key;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveFilter(f.key), className: `px-5 py-2.5 rounded-full font-body text-[12px] md:text-[13px] font-bold whitespace-nowrap active-scale transition-all duration-200 ${active ? "bg-forest text-white shadow-md" : "border border-border text-stone hover:border-forest/40 hover:text-forest"}`, children: f.label }, f.key);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5", children: recentWork.map((w) => {
        const visible = activeFilter === "all" || w.cat === activeFilter;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${w.pattern} work-card portfolio-item rounded-xl overflow-hidden shadow-sm cursor-pointer h-[280px] md:h-[320px] flex flex-col group relative`, style: {
          display: visible ? void 0 : "none"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-4 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-3 py-1 bg-gold/90 text-white font-body text-[10px] font-bold uppercase tracking-wider rounded-full", children: w.cat }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-5 z-20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-[16px] md:text-[18px] text-white font-medium", children: w.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[13px] text-gold font-semibold mt-1", children: w.price })
          ] })
        ] }, w.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/portfolio", className: "inline-flex h-[48px] px-8 border-2 border-forest text-forest font-body font-semibold text-[13px] uppercase rounded-xl items-center justify-center gap-2 active-scale btn-secondary", children: [
        "View All Work ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-cream-dark", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[28px] md:text-[36px] text-center text-forest mb-12 leading-tight", children: "What Our Clients Say" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6", children: [{
        q: "She saw details I never mentioned. It's like she captured his soul, not just his face.",
        a: "— Rajiv M."
      }, {
        q: "The clay sculpture made me cry. It's the most precious thing in our home now.",
        a: "— Sneha K."
      }, {
        q: "She redid the eyes because she wasn't happy with them. That dedication to perfection is rare.",
        a: "— Anjali & Vikram S."
      }].map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-6 md:p-7 rounded-xl border-l-4 border-gold shadow-sm flex flex-col gap-3 hover-lift", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-accent text-[17px] md:text-[19px] italic text-forest leading-relaxed", children: [
          '"',
          t.q,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[13px] md:text-[14px] font-bold text-stone uppercase tracking-wider mt-auto", children: t.a })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[28px] md:text-[36px] text-center text-forest mb-4 leading-tight", children: "Find the Perfect Gift" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] text-stone text-center mb-10 max-w-lg mx-auto", children: "Handcrafted art for every special occasion." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4", children: [{
        label: "For Parents",
        img: IMG.sketch2
      }, {
        label: "For Couples",
        img: IMG.portrait2
      }, {
        label: "New Home",
        img: IMG.mirror2
      }, {
        label: "Memorials",
        img: IMG.clay2
      }].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/portfolio", className: "aspect-square relative rounded-xl overflow-hidden active-scale shadow-sm cursor-pointer group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ImageWithFallback, { alt: g.label, className: "w-full h-full object-cover img-zoom", src: g.img, loading: "lazy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/30 flex items-center justify-center p-2 text-center group-hover:bg-black/40 transition-colors duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-[18px] md:text-[22px] text-white font-medium drop-shadow-md", children: g.label }) })
      ] }, g.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:Ajju_pandey@outlook.com?subject=Corporate%20%26%20Bulk%20Order%20Enquiry&body=Hi%20Artspire%20Team%2C%20I%20am%20interested%20in%20bulk%2Fcorporate%20orders.", className: "aspect-[21/9] relative rounded-xl overflow-hidden active-scale shadow-sm cursor-pointer group block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ImageWithFallback, { alt: "Corporate & Bulk", className: "w-full h-full object-cover img-zoom", src: IMG.painting, loading: "lazy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/30 flex items-center justify-center p-4 group-hover:bg-black/40 transition-colors duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 20, className: "text-white" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-[20px] md:text-[24px] text-white font-medium drop-shadow-md", children: "Corporate & Bulk Orders" })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-cream-dark", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-main", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center lg:flex-row lg:items-center lg:gap-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden mb-8 lg:mb-0 shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageWithFallback, { alt: "Himangi — Artist at Artspire", className: "w-full h-full object-cover img-zoom", src: IMG.sketch, loading: "lazy" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[11px] font-bold text-gold mb-5 uppercase tracking-[0.25em]", children: "The Artist Behind Artspire" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[32px] md:text-[36px] text-forest mb-5 font-medium", children: "Hi, I'm Himangi." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[15px] leading-relaxed text-stone mb-6", children: "For over 11 years, I've been helping people capture their most precious moments through art. Every stroke and detail is infused with passion and precision." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: "font-body text-[14px] font-bold text-gold border-b-2 border-gold/30 pb-1 active-scale hover:border-gold transition-colors", children: "Read My Story →" })
      ] })
    ] }) }) })
  ] });
}
export {
  Index as component
};
