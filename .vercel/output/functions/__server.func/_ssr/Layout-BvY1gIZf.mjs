import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useLocation, L as Link } from "../_libs/tanstack__react-router.mjs";
import { I as Instagram, M as MessageCircle, a as Mail, b as MapPin, C as Clock } from "../_libs/lucide-react.mjs";
const WA_NUMBER = "917408690994";
const waLink = (msg) => `https://wa.me/${WA_NUMBER}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;
const navLinks = [
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" }
];
function Header({ onMenuClick }) {
  const location = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-outline-variant/30 h-[56px] header-shadow md:left-0 md:right-0 md:max-w-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto h-full max-w-[390px] px-4 flex items-center justify-between md:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center shrink-0 active-scale", "aria-label": "Artspire home", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/artspire-Logo.svg",
          alt: "Artspire",
          className: "h-16 w-auto object-contain"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          "aria-label": "Menu",
          className: "p-2 -mr-2 text-on-surface active-scale",
          onClick: onMenuClick,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-2xl", children: "menu" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex container-main h-full items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/artspire-Logo.svg",
          alt: "Artspire",
          className: "h-16 w-auto object-contain"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex items-center gap-8 font-body text-[13px] font-semibold text-charcoal/70", children: navLinks.map((l) => {
        const isActive = location.pathname === l.to;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: l.to,
            className: `transition-colors ${isActive ? "text-gold-accent" : "hover:text-gold-accent"}`,
            children: l.label
          },
          l.to
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: waLink("Hi Artspire! I'd like to chat about a custom artwork."),
          target: "_blank",
          rel: "noreferrer",
          className: "inline-flex items-center gap-2 rounded-full bg-brand-whatsapp px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 max-w-[200px] whitespace-nowrap",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-white rounded-full animate-pulse" }),
            "Chat on WhatsApp"
          ]
        }
      )
    ] })
  ] });
}
const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" }
];
const serviceLinks = [
  { to: "/services", label: "Pencil Sketches" },
  { to: "/services", label: "Colour Portraits" },
  { to: "/services", label: "Paintings" },
  { to: "/services", label: "Mirror Art" },
  { to: "/services", label: "Clay Art" },
  { to: "/services", label: "Personalized Gifts" }
];
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "bg-deep-forest border-t border-white/5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden px-8 pt-16 pb-28 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-[32px] text-white mb-2 tracking-tight", children: "Artspire" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-accent text-[18px] italic text-gold-accent/80 mb-10", children: "Crafting Your Vision" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-8 mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-white/60 active:text-gold-accent", href: "https://www.instagram.com/himusketching_gallery?igsh=MXhzZzY1YjIzcDNxOQ==", target: "_blank", rel: "noopener noreferrer", "aria-label": "Instagram", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 26 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-white/60 active:text-gold-accent", href: "https://wa.me/917408690994", "aria-label": "WhatsApp", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 26 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-white/60 active:text-gold-accent", href: "mailto:Ajju_pandey@outlook.com", "aria-label": "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 26 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-px bg-gold-accent/30 mx-auto mb-10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[11px] text-white/40 uppercase tracking-[0.2em]", children: "© 2025 Artspire Studio · All Rights Reserved" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block container-main py-12 md:py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-[28px] text-cream font-medium tracking-tight", children: "Artspire" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-accent text-[15px] italic text-gold/80 leading-relaxed", children: "Crafting Your Vision" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[13px] text-cream/60 leading-relaxed", children: "Handcrafted art for life's most meaningful moments. Every piece tells a story." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://www.instagram.com/himusketching_gallery?igsh=MXhzZzY1YjIzcDNxOQ==", target: "_blank", rel: "noopener noreferrer", "aria-label": "Instagram", className: "text-cream/50 hover:text-gold transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 22 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://wa.me/917408690994", "aria-label": "WhatsApp", className: "text-cream/50 hover:text-gold transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 22 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:Ajju_pandey@outlook.com", "aria-label": "Email", className: "text-cream/50 hover:text-gold transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 22 }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-[14px] text-cream font-semibold uppercase tracking-[0.15em] mb-5", children: "Quick Links" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-col gap-2.5", children: quickLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: link.to, className: "font-body text-[13px] text-cream/60 hover:text-gold transition-colors", children: link.label }, link.to + link.label)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-[14px] text-cream font-semibold uppercase tracking-[0.15em] mb-5", children: "Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-col gap-2.5", children: serviceLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: link.to, className: "font-body text-[13px] text-cream/60 hover:text-gold transition-colors", children: link.label }, link.label)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-[14px] text-cream font-semibold uppercase tracking-[0.15em] mb-5", children: "Get in Touch" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:Ajju_pandey@outlook.com", className: "flex items-center gap-2 font-body text-[13px] text-cream/60 hover:text-gold transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 16, className: "shrink-0" }),
            " Ajju_pandey@outlook.com"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-body text-[13px] text-cream/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16, className: "shrink-0" }),
            " India — Shipping Pan India"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-body text-[13px] text-cream/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16, className: "shrink-0" }),
            " Mon–Sat, 9am–9pm"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: waLink("Hi Himangi! I'd love to chat about a custom artwork."), target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 rounded-full bg-brand-whatsapp px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200 mt-3 max-w-[200px] whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-white rounded-full animate-pulse" }),
            "Chat on WhatsApp"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block border-t border-cream/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-main py-5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[12px] text-cream/40 tracking-wide", children: "© 2025 Artspire Studio · All Rights Reserved" }) }) })
  ] });
}
const links = [
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" }
];
function NavDrawer({ open, onClose }) {
  reactExports.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`,
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "nav",
      {
        className: `fixed top-0 right-0 h-full w-[280px] bg-background z-[70] transform transition-transform duration-300 shadow-xl flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`,
        style: { maxWidth: "280px" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              "aria-label": "Close Menu",
              className: "p-2 text-on-surface active-scale",
              onClick: onClose,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-3xl", children: "close" })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col px-8 py-4 gap-8 font-display text-3xl text-on-surface mt-8", children: links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: l.to,
              className: "active:text-gold-accent",
              onClick: onClose,
              children: l.label
            },
            l.to
          )) })
        ]
      }
    )
  ] });
}
function WhatsAppBar() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href: waLink("Hi Himangi! I'd like to chat about a custom artwork."),
      className: "md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-[100] bg-brand-whatsapp text-white h-[64px] flex items-center justify-center gap-3 active-scale cursor-pointer shadow-[0_-4px_12px_rgba(0,0,0,0.1)]",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-[24px]", children: "chat_bubble" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body font-bold text-[15px] tracking-wide", children: "CHAT ON WHATSAPP" })
      ]
    }
  );
}
function Layout({ children }) {
  const [navOpen, setNavOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { onMenuClick: () => setNavOpen(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NavDrawer, { open: navOpen, onClose: () => setNavOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "pt-[56px] pb-20 md:pb-0 md:pt-[68px]", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppBar, {})
  ] });
}
export {
  Layout as L,
  waLink as w
};
