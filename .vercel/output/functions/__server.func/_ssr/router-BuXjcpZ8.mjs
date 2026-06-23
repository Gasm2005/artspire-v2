import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { Q as notFound } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-e7dr843k.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-Dt5Gsq6U.css";
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
const Route$8 = createRootRouteWithContext()({
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
  const { queryClient } = Route$8.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const $$splitComponentImporter$7 = () => import("./services-CMeUIQR7.mjs");
const Route$7 = createFileRoute("/services")({
  head: () => ({
    meta: [{
      title: "Custom Handmade Art Services India | Pencil Sketches, Portraits & More | Artspire"
    }, {
      name: "description",
      content: "Commission handmade pencil sketches, colour portraits, paintings, mirror art, clay art and personalized gifts from Artspire India. Every artwork made by hand. Starting from ₹799. WhatsApp to order."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./pricing-DdJNm3Yz.mjs");
const Route$6 = createFileRoute("/pricing")({
  head: () => ({
    meta: [{
      title: "Pricing | Artspire"
    }, {
      name: "description",
      content: "Transparent, honest pricing for handcrafted commissions. No hidden charges."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./portfolio-DyAW1M47.mjs");
const Route$5 = createFileRoute("/portfolio")({
  head: () => ({
    meta: [{
      title: "Portfolio | Artspire"
    }, {
      name: "description",
      content: "Handcrafted portraits, paintings, mirror art, clay sculptures and personalized gifts."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
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
const $$splitComponentImporter$4 = () => import("./faq-sE9blug3.mjs");
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
const Route$4 = createFileRoute("/faq")({
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
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./contact-CX7_JHA6.mjs");
const Route$3 = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact | Artspire"
    }, {
      name: "description",
      content: "Reach Himangi on WhatsApp within 2 hours to start your custom commission."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./about-C-kGB1ih.mjs");
const Route$2 = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About | Artspire"
    }, {
      name: "description",
      content: "Meet Himangi — the artist behind Artspire and the philosophy behind every handcrafted piece."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./index-XDkn1T4j.mjs");
const Route$1 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Artspire | Artisanal Art Studio"
    }, {
      name: "description",
      content: "Custom handmade pencil sketches, paintings, mirror art and clay sculptures from your favorite photos."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
async function getPublishedArtworkBySlug(slug) {
  const { data, error } = await supabase.from("artworks").select("*, categories(*)").eq("slug", slug).eq("status", "published").is("deleted_at", null).single();
  if (error) throw error;
  return data;
}
async function getRelatedArtworks(artworkId, categoryId, limit = 4) {
  let query = supabase.from("artworks").select("*, categories(*)").eq("status", "published").is("deleted_at", null).neq("id", artworkId).limit(limit);
  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
async function getArtworkTags(artworkId) {
  const { data, error } = await supabase.from("artwork_tags").select("tags(*)").eq("artwork_id", artworkId);
  if (error) throw error;
  return (data ?? []).map((d) => d.tags);
}
async function getFAQs(entityType, entityId) {
  let query = supabase.from("faqs").select("*").order("display_order", { ascending: true });
  query = query.eq("entity_type", entityType);
  if (entityId) query = query.eq("entity_id", entityId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
async function getArtworkFAQs(artworkId) {
  return getFAQs("artwork", artworkId);
}
async function getSEOMetadata(entityType, entityId) {
  const { data, error } = await supabase.from("seo_metadata").select("*").eq("entity_type", entityType).eq("entity_id", entityId).single();
  if (error) throw error;
  return data;
}
function buildArtworkStructuredData(artwork) {
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.title,
    description: artwork.summary,
    image: artwork.image_url,
    url: `${getSiteUrl()}/artwork/${artwork.slug}`,
    dateCreated: artwork.created_at,
    artform: artwork.category || "Mixed Media",
    offers: artwork.price > 0 && artwork.status === "published" ? {
      "@type": "Offer",
      price: artwork.price.toString(),
      priceCurrency: artwork.currency || "INR",
      availability: "https://schema.org/InStock",
      url: `${getSiteUrl()}/artwork/${artwork.slug}`
    } : void 0
  };
}
function buildBreadcrumbStructuredData(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item
    }))
  };
}
function getSiteUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  return "https://artspire.in";
}
const $$splitNotFoundComponentImporter = () => import("./artwork._slug-RG6xkl8s.mjs");
const $$splitComponentImporter = () => import("./artwork._slug-DuviXlEO.mjs");
const Route = createFileRoute("/artwork/$slug")({
  loader: async ({
    params
  }) => {
    const artwork = await getPublishedArtworkBySlug(params.slug);
    if (!artwork) {
      throw notFound();
    }
    const [tags, related, faqs, seoMeta] = await Promise.all([getArtworkTags(artwork.id), getRelatedArtworks(artwork.id, artwork.category_id, 4), getArtworkFAQs(artwork.id), getSEOMetadata("artwork", artwork.id)]);
    const metaTitle = seoMeta?.meta_title ?? artwork.title;
    const metaDescription = seoMeta?.meta_description ?? artwork.summary ?? `View ${artwork.title} by Artspire — handcrafted custom art.`;
    const ogImage = seoMeta?.og_image_url ?? artwork.image_url ?? "";
    return {
      artwork,
      tags,
      related,
      faqs,
      seo: {
        metaTitle,
        metaDescription,
        ogImage
      }
    };
  },
  head: ({
    loaderData
  }) => {
    if (!loaderData) return {};
    const {
      artwork,
      seo
    } = loaderData;
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://artspire.in";
    const pageUrl = `${siteUrl}/artwork/${artwork.slug}`;
    const structuredData = buildArtworkStructuredData({
      title: artwork.title,
      summary: artwork.summary ?? "",
      image_url: artwork.image_url ?? "",
      price: artwork.price ?? 0,
      created_at: artwork.created_at,
      slug: artwork.slug,
      status: artwork.status,
      currency: artwork.currency ?? "INR",
      category: artwork.categories?.name ?? void 0
    });
    const breadcrumbData = buildBreadcrumbStructuredData([{
      name: "Home",
      item: siteUrl
    }, {
      name: "Portfolio",
      item: `${siteUrl}/portfolio`
    }, {
      name: artwork.title,
      item: pageUrl
    }]);
    return {
      meta: [{
        title: `${seo?.metaTitle ?? artwork.title} | Artspire`
      }, {
        name: "description",
        content: seo?.metaDescription ?? ""
      }, {
        property: "og:title",
        content: seo?.metaTitle ?? artwork.title
      }, {
        property: "og:description",
        content: seo?.metaDescription ?? ""
      }, {
        property: "og:type",
        content: "article"
      }, {
        property: "og:image",
        content: seo?.ogImage ?? ""
      }, {
        property: "og:url",
        content: pageUrl
      }, {
        name: "twitter:card",
        content: "summary_large_image"
      }, {
        name: "twitter:title",
        content: seo?.metaTitle ?? artwork.title
      }, {
        name: "twitter:description",
        content: seo?.metaDescription ?? ""
      }, {
        name: "twitter:image",
        content: seo?.ogImage ?? ""
      }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify(structuredData)
      }, {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbData)
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const ServicesRoute = Route$7.update({
  id: "/services",
  path: "/services",
  getParentRoute: () => Route$8
});
const PricingRoute = Route$6.update({
  id: "/pricing",
  path: "/pricing",
  getParentRoute: () => Route$8
});
const PortfolioRoute = Route$5.update({
  id: "/portfolio",
  path: "/portfolio",
  getParentRoute: () => Route$8
});
const FaqRoute = Route$4.update({
  id: "/faq",
  path: "/faq",
  getParentRoute: () => Route$8
});
const ContactRoute = Route$3.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$8
});
const AboutRoute = Route$2.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$8
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$8
});
const ArtworkSlugRoute = Route.update({
  id: "/artwork/$slug",
  path: "/artwork/$slug",
  getParentRoute: () => Route$8
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  ContactRoute,
  FaqRoute,
  PortfolioRoute,
  PricingRoute,
  ServicesRoute,
  ArtworkSlugRoute
};
const routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
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
  Route as R,
  router as r,
  sections as s
};
