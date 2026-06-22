import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Layout, w as waLink } from "./Layout-BvY1gIZf.mjs";
import { M as MessageCircle, S as Send, b as MapPin, C as Clock, e as Star, I as Instagram, a as Mail } from "../_libs/lucide-react.mjs";
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
function ContactPage() {
  const [form, setForm] = reactExports.useState({
    name: "",
    phone: "",
    email: "",
    idea: ""
  });
  const onSubmit = (e) => {
    e.preventDefault();
    const msg = `Hi Himangi, I'm ${form.name} (${form.phone}). Email: ${form.email}. ${form.idea}`;
    window.location.href = waLink(msg);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-padding bg-cream text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[11px] md:text-[12px] font-semibold text-gold mb-4 uppercase tracking-[0.25em]", children: "Get in Touch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-[32px] md:text-[42px] leading-[1.1] text-forest font-medium mb-4", children: "Let's Create Something Meaningful" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-[14px] md:text-[16px] leading-relaxed text-stone", children: "The fastest way to reach me is WhatsApp. I reply within 2 hours." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pb-10 md:pb-14", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-main max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: waLink("Hi Himangi! I want to commission artwork"), target: "_blank", rel: "noreferrer", className: "flex items-center justify-center gap-3 w-full h-[56px] rounded-xl bg-brand-whatsapp text-white font-body font-bold text-[14px] md:text-[15px] tracking-wide active-scale btn-whatsapp shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 22 }),
      "Chat With Himangi on WhatsApp"
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-main max-w-2xl pb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-[12px] uppercase tracking-[0.2em] text-stone", children: "or send a message" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pb-10 md:pb-14", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-main max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "contact-name", className: "block font-body text-[12px] font-semibold text-forest uppercase tracking-wider mb-2", children: "Your Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "contact-name", required: true, type: "text", placeholder: "John Doe", value: form.name, onChange: (e) => setForm({
            ...form,
            name: e.target.value
          }), className: "w-full px-4 py-3.5 rounded-xl bg-cream-dark border border-border/60 font-body text-[14px] text-charcoal placeholder:text-stone/60 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "contact-phone", className: "block font-body text-[12px] font-semibold text-forest uppercase tracking-wider mb-2", children: "Phone Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "contact-phone", required: true, type: "tel", pattern: "[6-9][0-9]{9}", minLength: 10, maxLength: 10, placeholder: "9876543210", value: form.phone, onChange: (e) => setForm({
            ...form,
            phone: e.target.value
          }), className: "w-full px-4 py-3.5 rounded-xl bg-cream-dark border border-border/60 font-body text-[14px] text-charcoal placeholder:text-stone/60 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "contact-email", className: "block font-body text-[12px] font-semibold text-forest uppercase tracking-wider mb-2", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "contact-email", required: true, type: "email", placeholder: "john@example.com", value: form.email, onChange: (e) => setForm({
          ...form,
          email: e.target.value
        }), className: "w-full px-4 py-3.5 rounded-xl bg-cream-dark border border-border/60 font-body text-[14px] text-charcoal placeholder:text-stone/60 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "contact-idea", className: "block font-body text-[12px] font-semibold text-forest uppercase tracking-wider mb-2", children: "Your Idea" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { id: "contact-idea", required: true, rows: 5, placeholder: "What would you like to create?", value: form.idea, onChange: (e) => setForm({
          ...form,
          idea: e.target.value
        }), className: "w-full px-4 py-3.5 rounded-xl bg-cream-dark border border-border/60 font-body text-[14px] text-charcoal placeholder:text-stone/60 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all resize-none" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "inline-flex items-center gap-2 h-[52px] px-10 bg-forest text-white font-body font-bold text-[14px] tracking-wide rounded-xl active-scale btn-primary hover:bg-forest-dark transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 16 }),
        "Send Message"
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pb-16 md:pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-main max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [{
      icon: MapPin,
      text: "Based in India · Shipping Pan India"
    }, {
      icon: Clock,
      text: "Replies within 2 hours · Mon–Sat 9am–9pm"
    }, {
      icon: Star,
      text: "500+ Happy Clients · 4.9 Star Rating"
    }].map(({
      icon: Icon,
      text
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-cream-dark rounded-xl px-4 py-4 border border-border/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 20, className: "text-gold shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-[12px] text-charcoal leading-snug", children: text })
    ] }, text)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pb-16 md:pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-main max-w-2xl flex items-center justify-center gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://www.instagram.com/himusketching_gallery?igsh=MXhzZzY1YjIzcDNxOQ==", target: "_blank", rel: "noopener noreferrer", "aria-label": "Instagram", className: "flex items-center gap-2 text-forest hover:text-gold transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 22 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-[13px] font-semibold", children: "Instagram" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: waLink("Hi Himangi! I want to commission artwork"), target: "_blank", rel: "noreferrer", "aria-label": "WhatsApp", className: "flex items-center gap-2 text-forest hover:text-gold transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 22 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-[13px] font-semibold", children: "WhatsApp" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:Ajju_pandey@outlook.com", "aria-label": "Email", className: "flex items-center gap-2 text-forest hover:text-gold transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 22 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-[13px] font-semibold", children: "Email" })
      ] })
    ] }) })
  ] });
}
export {
  ContactPage as component
};
