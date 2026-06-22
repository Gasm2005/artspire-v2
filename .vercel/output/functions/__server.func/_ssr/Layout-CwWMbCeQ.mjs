import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useLocation, L as Link } from "../_libs/tanstack__react-router.mjs";
import { I as Instagram, M as MessageCircle, a as Mail, b as MapPin, C as Clock } from "../_libs/lucide-react.mjs";
const WA_NUMBER = "917408690994";
const waLink = (msg) => `https://wa.me/${WA_NUMBER}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;
const desktopLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" }
];
function Header({ onMenuClick }) {
  const location = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-md border-b border-border/40 header-shadow transition-shadow duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main h-[56px] md:h-[72px] flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: "/artspire-Logo.svg",
        alt: "Artspire",
        className: "h-12 md:h-16 w-auto object-contain"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden md:flex items-center gap-1 lg:gap-2 font-body text-[13px] lg:text-[14px] font-medium text-charcoal/70", children: desktopLinks.map((link) => {
      const isActive = location.pathname === link.to;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: link.to,
          className: `px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? "text-forest font-semibold" : "hover:text-forest hover:bg-cream-dark/50"}`,
          children: link.label
        },
        link.to
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: waLink("Hi Himangi! I'd like to chat about a custom artwork."),
        target: "_blank",
        rel: "noreferrer",
        className: "hidden md:inline-flex items-center gap-2 rounded-full bg-brand-whatsapp px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 max-w-[200px] whitespace-nowrap",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-white rounded-full animate-pulse" }),
          "Chat on WhatsApp"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        "aria-label": "Menu",
        className: "p-2 -mr-2 text-charcoal active-scale md:hidden",
        onClick: onMenuClick,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-2xl", children: "menu" })
      }
    )
  ] }) });
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-cream text-center border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[28px] md:text-[36px] text-forest font-medium mb-4 leading-tight", children: "Ready to Create Something Beautiful?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] md:text-[16px] text-stone mb-8 leading-relaxed", children: "Start your custom commission today. Every piece is handcrafted with care and precision." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: waLink("Hi Artspire! I want to commission artwork"),
          target: "_blank",
          rel: "noreferrer",
          className: "inline-flex items-center gap-2 h-[56px] px-10 bg-forest text-white font-body font-bold text-[14px] uppercase tracking-wide rounded-full btn-primary shadow-lg",
          children: "Start Your Commission"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "bg-forest border-t border-forest-light/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-main py-12 md:py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-[28px] text-cream font-medium tracking-tight", children: "Artspire" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-accent text-[15px] italic text-gold/80 leading-relaxed", children: "Crafting Your Vision" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[13px] text-cream/60 leading-relaxed", children: "Handcrafted art for life's most meaningful moments. Every piece tells a story." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://www.instagram.com/himusketching_gallery?igsh=MXhzZzY1YjIzcDNxOQ==",
                target: "_blank",
                rel: "noopener noreferrer",
                "aria-label": "Instagram",
                className: "text-cream/50 hover:text-gold transition-colors duration-200",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 22 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://wa.me/917408690994",
                "aria-label": "WhatsApp",
                className: "text-cream/50 hover:text-gold transition-colors duration-200",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 22 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "mailto:Ajju_pandey@outlook.com",
                "aria-label": "Email",
                className: "text-cream/50 hover:text-gold transition-colors duration-200",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 22 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-[14px] text-cream font-semibold uppercase tracking-[0.15em] mb-5", children: "Quick Links" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-col gap-2.5", children: quickLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: link.to,
              className: "font-body text-[13px] text-cream/60 hover:text-gold transition-colors duration-200",
              children: link.label
            },
            link.to + link.label
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-[14px] text-cream font-semibold uppercase tracking-[0.15em] mb-5", children: "Services" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-col gap-2.5", children: serviceLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: link.to,
              className: "font-body text-[13px] text-cream/60 hover:text-gold transition-colors duration-200",
              children: link.label
            },
            link.label
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-[14px] text-cream font-semibold uppercase tracking-[0.15em] mb-5", children: "Get in Touch" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: "mailto:Ajju_pandey@outlook.com",
                className: "flex items-center gap-2 font-body text-[13px] text-cream/60 hover:text-gold transition-colors duration-200",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 16, className: "shrink-0" }),
                  "Ajju_pandey@outlook.com"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-body text-[13px] text-cream/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16, className: "shrink-0" }),
              "India — Shipping Pan India"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-body text-[13px] text-cream/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16, className: "shrink-0" }),
              "Mon–Sat, 9am–9pm"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: waLink("Hi Himangi! I'd love to chat about a custom artwork."),
                target: "_blank",
                rel: "noreferrer",
                className: "inline-flex items-center gap-2 rounded-full bg-brand-whatsapp px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200 mt-3 max-w-[200px] whitespace-nowrap btn-whatsapp",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-white rounded-full animate-pulse" }),
                  "Chat on WhatsApp"
                ]
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-cream/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-main py-5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[12px] text-cream/40 tracking-wide", children: "© 2025 Artspire Studio · All Rights Reserved" }) }) })
    ] })
  ] });
}
const links = [
  { to: "/", label: "Home" },
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
  const location = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`,
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "nav",
      {
        className: `fixed top-0 right-0 h-full w-[300px] bg-cream z-[70] transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-[20px] text-forest font-medium", children: "Menu" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                "aria-label": "Close Menu",
                className: "p-2 text-charcoal hover:text-forest transition-colors",
                onClick: onClose,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "material-symbols-outlined text-2xl", children: "close" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col p-6 gap-1", children: links.map((l) => {
            const isActive = location.pathname === l.to;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: l.to,
                className: `font-body text-[15px] px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? "text-forest font-semibold bg-forest/5" : "text-charcoal hover:text-forest hover:bg-cream-dark/30"}`,
                onClick: onClose,
                children: l.label
              },
              l.to
            );
          }) })
        ]
      }
    )
  ] });
}
function Layout({ children }) {
  const [navOpen, setNavOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { onMenuClick: () => setNavOpen(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NavDrawer, { open: navOpen, onClose: () => setNavOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "container-main pt-[56px] md:pt-[68px]", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  Layout as L,
  waLink as w
};
