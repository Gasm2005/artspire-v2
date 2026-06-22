import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
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
const appCss = "/assets/styles-DQc5Y_SQ.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$7 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Artspire | Handcrafted Custom Art by Himangi Pandey" },
      { name: "description", content: "Commission handcrafted pencil sketches, portraits, clay art and personalized gifts. Made by hand by Himangi Pandey. Ships across India." },
      { name: "author", content: "Himangi Pandey" },
      { property: "og:title", content: "Artspire | Handcrafted Custom Art" },
      { property: "og:description", content: "Commission handcrafted pencil sketches, portraits, clay art and personalized gifts. Ships across India." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://artspire.in/og-image.jpg" },
      { property: "og:url", content: "https://artspire.in" },
      { name: "theme-color", content: "#3E4D3A" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@artspire_in" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=EB+Garamond:wght@400;500;600&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;1,7..72,400&family=Montserrat:wght@400;500;600;700&display=swap"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en-IN", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$7.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const $$splitComponentImporter$6 = () => import("./services-B8TBRtxF.mjs");
const Route$6 = createFileRoute("/services")({
  head: () => ({
    meta: [{
      title: "Custom Handmade Art Services India | Pencil Sketches, Portraits & More | Artspire"
    }, {
      name: "description",
      content: "Commission handmade pencil sketches, colour portraits, paintings, mirror art, clay art and personalized gifts from Artspire India. Every artwork made by hand. Starting from ₹799. WhatsApp to order."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./pricing-CCMKN4-u.mjs");
const Route$5 = createFileRoute("/pricing")({
  head: () => ({
    meta: [{
      title: "Pricing | Artspire"
    }, {
      name: "description",
      content: "Transparent, honest pricing for handcrafted commissions. No hidden charges."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./portfolio-BFRXzqA6.mjs");
const Route$4 = createFileRoute("/portfolio")({
  head: () => ({
    meta: [{
      title: "Portfolio | Artspire"
    }, {
      name: "description",
      content: "Handcrafted portraits, paintings, mirror art, clay sculptures and personalized gifts."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const sections = [{
  title: "Ordering & Process",
  items: [{
    question: "How do I place an order for a custom artwork?",
    answer: "Simply WhatsApp us your photo, tell us the artwork type you want (sketch, portrait, painting, mirror art or clay), your preferred size, and your deadline. We'll confirm the details and send you a quote within 2 hours."
  }, {
    question: "What type of photo should I send?",
    answer: "A clear, well-lit photo with visible facial details works best. Natural daylight photos give the best results. Avoid blurry, pixelated, or heavily filtered photos. If you only have an old photo, send it anyway — we'll let you know if it works."
  }, {
    question: "Can you combine two people from different photos into one portrait?",
    answer: "Yes. We can merge multiple reference photos into a single composition as long as the faces are clearly visible in each photo."
  }, {
    question: "Is the artwork made by hand or is it AI-generated?",
    answer: "Every artwork at Artspire is 100% handmade by the artist. We do not use AI tools, digital filters, or print-on-demand. Each piece is drawn or painted from scratch using traditional art materials."
  }, {
    question: "Can I see the artwork before it is shipped?",
    answer: "Yes. We share a preview photo or video of the completed artwork before dispatch. You can request changes at this stage — we will not ship until you are happy."
  }]
}, {
  title: "Pricing & Payment",
  items: [{
    question: "How much does a custom artwork cost?",
    answer: "Pricing depends on the artwork type, size, number of faces, and complexity. Pencil sketches start from Rs 999. Colour portraits start from Rs 1,999. Paintings start from Rs 2,999. WhatsApp us your photo for an exact quote."
  }, {
    question: "How do I make the payment?",
    answer: "We accept UPI, Razorpay (cards, net banking, wallets), and bank transfer. 50% advance is required to start your order. Balance is due before shipping."
  }, {
    question: "Do you offer any discounts for bulk or corporate orders?",
    answer: "Yes. We offer special pricing for bulk orders of 5 or more pieces. WhatsApp us with your requirements for a custom corporate quote."
  }]
}, {
  title: "Delivery & Shipping",
  items: [{
    question: "How long does it take to complete an artwork?",
    answer: "Standard delivery is 5 to 14 days depending on artwork type and complexity. Pencil sketches: 5 to 7 days. Colour portraits: 7 to 10 days. Paintings: 10 to 14 days. Express delivery is available in 3 to 7 days at additional cost."
  }, {
    question: "Do you ship across India?",
    answer: "Yes. We deliver to every pin code in India via premium courier with full tracking. Typical shipping time after dispatch is 2 to 4 business days."
  }, {
    question: "How is the artwork packaged?",
    answer: "Every artwork is packed in a rigid, protective tube or flat mailer to prevent bending or damage. Framing options are available on request."
  }]
}, {
  title: "Revisions & Guarantee",
  items: [{
    question: "What if I am not happy with the artwork?",
    answer: "We offer free revisions until you are satisfied, before the artwork is shipped. If you receive a damaged or incorrect artwork, we will remake it at no cost within 7 days of delivery."
  }, {
    question: "How many revisions are included?",
    answer: "Unlimited revisions are included before shipping. We work with you until you love the result."
  }, {
    question: "What is your refund policy?",
    answer: "Since every artwork is made to order, we do not offer cash refunds after work has begun. However if there is a quality issue or damage on delivery, we will remake the artwork at no cost."
  }]
}, {
  title: "Special Occasions",
  items: [{
    question: "Can I order a custom portrait as an anniversary gift?",
    answer: "Yes — anniversary portraits are one of our most popular requests. Couple sketches and colour portraits make deeply meaningful anniversary gifts. Mention your occasion when you WhatsApp us and we will suggest the best artwork type and size."
  }, {
    question: "Do you make memorial portraits of deceased loved ones?",
    answer: "Yes. We handle memorial artwork with full care and sensitivity. Please send us the clearest photo available. We understand how precious these memories are and treat every memorial commission with the respect it deserves."
  }, {
    question: "Can I order a last-minute gift?",
    answer: "Express delivery is available. WhatsApp us your deadline and we will tell you honestly whether it is achievable. We never compromise on quality to rush an order."
  }, {
    question: "Do you do corporate gifting?",
    answer: "Yes. Custom portraits, framed sketches and clay miniatures make unique corporate gifts. We offer bulk pricing and can include your company branding on packaging. WhatsApp us for a corporate quote."
  }]
}];
const $$splitComponentImporter$3 = () => import("./faq-t0PsYJWZ.mjs");
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: sections.flatMap((section) => section.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  })))
};
const Route$3 = createFileRoute("/faq")({
  head: () => ({
    meta: [{
      title: "FAQ | Artspire"
    }, {
      name: "description",
      content: "Find answers to frequently asked questions about ordering custom handmade art from Artspire."
    }, {
      property: "og:title",
      content: "FAQ | Artspire"
    }, {
      property: "og:description",
      content: "Find answers to frequently asked questions about ordering custom handmade art from Artspire."
    }, {
      property: "og:type",
      content: "website"
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify(faqJsonLd)
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./contact-EXT8M2ti.mjs");
const Route$2 = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact | Artspire"
    }, {
      name: "description",
      content: "Reach Himangi on WhatsApp within 2 hours to start your custom commission."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./about-DKjCePwE.mjs");
const Route$1 = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About | Artspire"
    }, {
      name: "description",
      content: "Meet Himangi — the artist behind Artspire and the philosophy behind every handcrafted piece."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-D1VKiCur.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Artspire | Artisanal Art Studio"
    }, {
      name: "description",
      content: "Custom handmade pencil sketches, paintings, mirror art and clay sculptures from your favorite photos."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ServicesRoute = Route$6.update({
  id: "/services",
  path: "/services",
  getParentRoute: () => Route$7
});
const PricingRoute = Route$5.update({
  id: "/pricing",
  path: "/pricing",
  getParentRoute: () => Route$7
});
const PortfolioRoute = Route$4.update({
  id: "/portfolio",
  path: "/portfolio",
  getParentRoute: () => Route$7
});
const FaqRoute = Route$3.update({
  id: "/faq",
  path: "/faq",
  getParentRoute: () => Route$7
});
const ContactRoute = Route$2.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$7
});
const AboutRoute = Route$1.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$7
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$7
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  ContactRoute,
  FaqRoute,
  PortfolioRoute,
  PricingRoute,
  ServicesRoute
};
const routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  router as r,
  sections as s
};
