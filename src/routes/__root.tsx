import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const siteUrl = "https://artspire.in";

    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "ArtGallery"],
      "@id": `${siteUrl}/#business`,
      name: "Artspire",
      alternateName: "Artspire by Himangi Pandey",
      description: "Custom handmade pencil sketches, portraits, paintings, clay art, and mirror art made by Himangi Pandey. Delivered across India.",
      url: siteUrl,
      logo: `${siteUrl}/artspire-Logo.svg`,
      image: `${siteUrl}/og-image.jpg`,
      email: "Ajju_pandey@outlook.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kanpur",
        addressRegion: "Uttar Pradesh",
        addressCountry: "IN",
      },
      areaServed: { "@type": "Country", name: "India" },
      priceRange: "₹999 - ₹9999",
      currenciesAccepted: "INR",
      paymentAccepted: "UPI, Credit Card, Debit Card, Net Banking",
      openingHours: "Mo-Su 09:00-21:00",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Custom Handmade Art Services",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Pencil Sketch", description: "Handmade pencil sketch portrait from your photo" }, price: "999", priceCurrency: "INR" },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Colour Portrait", description: "Custom colour portrait painting from your photo" }, price: "1999", priceCurrency: "INR" },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Painting", description: "Handmade painting on canvas from your photo" }, price: "2999", priceCurrency: "INR" },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Clay Art Sculpture", description: "Custom clay sculpture from your photo" }, price: "1799", priceCurrency: "INR" },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mirror Art", description: "Custom handmade mirror art from your photo" }, price: "2499", priceCurrency: "INR" },
        ],
      },
      sameAs: ["https://instagram.com/artspire_in"],
    };

    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${siteUrl}/#artist`,
      name: "Himangi Pandey",
      givenName: "Himangi",
      familyName: "Pandey",
      jobTitle: "Visual Artist",
      description: "Professional visual artist with 11+ years of experience specializing in handmade pencil sketches, portraits, clay art, and mirror art. Based in Kanpur, India.",
      url: `${siteUrl}/about`,
      image: `${siteUrl}/og-image.jpg`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kanpur",
        addressRegion: "Uttar Pradesh",
        addressCountry: "IN",
      },
      knowsAbout: ["Pencil Sketching", "Portrait Art", "Clay Sculpture", "Mirror Art", "Custom Portraiture", "Handmade Art", "Colour Portraits", "Personalized Gifts"],
      worksFor: { "@type": "Organization", "@id": `${siteUrl}/#business`, name: "Artspire" },
      sameAs: ["https://instagram.com/artspire_in"],
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Artspire",
      url: siteUrl,
      description: "Custom handmade art by Himangi Pandey — pencil sketches, portraits, paintings, clay art. Delivered across India.",
      publisher: { "@id": `${siteUrl}/#business` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/portfolio?search={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    };

    return {
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
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@artspire_in" },
        { name: "twitter:title", content: "Artspire | Handcrafted Custom Art by Himangi Pandey" },
        { name: "twitter:description", content: "Custom handmade pencil sketches, portraits, clay art. Made by Himangi Pandey. Ships across India." },
        { name: "twitter:image", content: "https://artspire.in/og-image.jpg" },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(localBusinessSchema) },
        { type: "application/ld+json", children: JSON.stringify(personSchema) },
        { type: "application/ld+json", children: JSON.stringify(websiteSchema) },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=EB+Garamond:wght@400;500;600&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;1,7..72,400&family=Montserrat:wght@400;500;600;700&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
