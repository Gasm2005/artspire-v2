import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { waLink } from "@/lib/whatsapp";
import {
  getPublishedProductBySlug,
  getProductGalleryImages,
  getRelatedProducts,
  type ProductWithCategory,
} from "@/lib/products";
import { getMediumCraftContent, type MediumCraftContent } from "@/lib/collections";
import { buildBreadcrumbStructuredData } from "@/lib/seo";
import { MessageCircle, Package, Ruler, Sparkles } from "lucide-react";
import { ArtspireBreadcrumb } from "@/components/ArtspireBreadcrumb";
import { ArtworkDetailSkeleton } from "@/components/ui/skeleton";

interface LoaderData {
  product: ProductWithCategory;
  gallery: { media?: { public_url: string } | null }[];
  related: ProductWithCategory[];
  craftContent: MediumCraftContent | null;
}

export const Route = createFileRoute("/shop/product/$slug")({
  pendingComponent: ProductPendingSkeleton,
  pendingMs: 0,
  pendingMinMs: 300,

  loader: async ({ params }): Promise<LoaderData> => {
    const product = await getPublishedProductBySlug(params.slug);
    if (!product) throw notFound();

    const [gallery, related, craftContent] = await Promise.all([
      getProductGalleryImages(product.id).catch(() => []),
      getRelatedProducts(product.id, product.category_id, 4),
      product.medium ? getMediumCraftContent(product.medium) : Promise.resolve(null),
    ]);

    return { product, gallery, related, craftContent };
  },

  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { product } = loaderData;

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.summary ?? product.description ?? "",
      image: product.image_url ?? "",
      sku: product.sku ?? product.id,
      brand: { "@type": "Brand", name: "Artspire" },
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: product.currency,
        availability:
          product.status === "sold_out"
            ? "https://schema.org/SoldOut"
            : "https://schema.org/InStock",
        url: `https://artspire.in/shop/product/${product.slug}`,
      },
    };

    const breadcrumbData = buildBreadcrumbStructuredData([
      { name: "Home", item: "https://artspire.in/" },
      { name: "Shop", item: "https://artspire.in/shop" },
      ...(product.categories
        ? [{ name: product.categories.name, item: `https://artspire.in/shop/${product.categories.slug}` }]
        : []),
      { name: product.title, item: `https://artspire.in/shop/product/${product.slug}` },
    ]);

    return {
      meta: [
        { title: product.meta_title ?? `${product.title} | Artspire Shop` },
        { name: "description", content: product.meta_description ?? product.summary ?? `${product.title} — handmade, one of a kind, by Artspire.` },
        { property: "og:title", content: product.meta_title ?? `${product.title} | Artspire Shop` },
        { property: "og:image", content: product.image_url ?? "https://artspire.in/og-image.jpg" },
        { property: "og:type", content: "product" },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(productSchema) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbData) },
      ],
    };
  },

  component: ProductPage,
  notFoundComponent: () => (
    <ShopLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-[48px] text-forest">404</h1>
          <p className="font-body text-stone mt-2">This piece is no longer available</p>
        </div>
      </div>
    </ShopLayout>
  ),
});

function ProductPendingSkeleton() {
  return (
    <ShopLayout>
      <div className="artwork-page-enter bg-cream min-h-screen">
        <ArtworkDetailSkeleton />
      </div>
    </ShopLayout>
  );
}

// ─── Progressive image gallery ───────────────────────────────
function ProductGallery({ mainImage, gallery, title }: { mainImage: string; gallery: string[]; title: string }) {
  const [active, setActive] = useState(mainImage);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setLoaded(false);
    if (imgRef.current?.complete) setLoaded(true);
  }, [active]);

  const allImages = [mainImage, ...gallery.filter((g) => g !== mainImage)];

  return (
    <div>
      <div className="relative w-full overflow-hidden rounded-2xl border border-border/30 shadow-lg bg-[#E8E0D5]">
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          style={{
            background: "linear-gradient(135deg, #E8E0D5 0%, #D4C9B8 50%, #E8E0D5 100%)",
            backgroundSize: "200% 200%",
            animation: loaded ? "none" : "shimmer 1.8s ease-in-out infinite",
          }}
        />
        <img
          ref={imgRef}
          src={active}
          alt={title}
          onLoad={() => setLoaded(true)}
          className={`w-full h-auto object-contain max-h-[75vh] transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      {allImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(img)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                active === img ? "border-gold" : "border-border/40 hover:border-forest/30"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductPage() {
  const { product, gallery, related, craftContent } = Route.useLoaderData() as LoaderData;

  const galleryUrls = gallery.map((g) => g.media?.public_url).filter(Boolean) as string[];
  const waMessage = waLink(
    `Hi Artspire! I'm interested in "${product.title}" from the shop (₹${product.price.toLocaleString("en-IN")}). Is it still available?`
  );
  const commissionMessage = waLink(
    `Hi Artspire! I saw "${product.title}" in your shop and would love something similar made for me. Can you help?`
  );

  const soldOut = product.status === "sold_out";

  return (
    <ShopLayout>
      <section className="artwork-page-enter bg-cream min-h-screen">
        <div className="container-main py-8 md:py-14">
          <ArtspireBreadcrumb
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              ...(product.categories ? [{ label: product.categories.name, href: `/shop/${product.categories.slug}` }] : []),
              { label: product.title },
            ]}
            className="mb-8"
          />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
            {/* LEFT: Gallery */}
            <div className="w-full lg:w-1/2 lg:sticky lg:top-8">
              <ProductGallery
                mainImage={product.image_url ?? "/placeholder-artwork.svg"}
                gallery={galleryUrls}
                title={product.title}
              />
            </div>

            {/* RIGHT: Story + Details + CTA */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div className="flex items-center gap-2 flex-wrap">
                {product.categories?.name && (
                  <span className="inline-block px-3 py-1 bg-gold/15 text-gold font-body text-[11px] font-bold uppercase tracking-wider rounded-full">
                    {product.categories.name}
                  </span>
                )}
                {product.is_one_of_a_kind && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-forest/10 text-forest font-body text-[11px] font-bold uppercase tracking-wider rounded-full">
                    <Sparkles size={11} /> One of a Kind
                  </span>
                )}
              </div>

              <h1 className="artwork-content-enter font-display text-[28px] md:text-[38px] text-forest font-medium leading-tight" style={{ animationDelay: "40ms" }}>
                {product.title}
              </h1>

              <p className="artwork-content-enter font-body text-[22px] text-forest font-semibold" style={{ animationDelay: "60ms" }}>
                ₹{product.price.toLocaleString("en-IN")}
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="ml-2 text-[15px] text-stone/40 line-through">
                    ₹{product.compare_at_price.toLocaleString("en-IN")}
                  </span>
                )}
              </p>

              {(product.summary || product.description) && (
                <div className="artwork-content-enter space-y-4" style={{ animationDelay: "100ms" }}>
                  {product.summary && (
                    <p className="font-body text-[15px] md:text-[17px] text-stone leading-relaxed">{product.summary}</p>
                  )}
                  {product.description && (
                    <p className="font-body text-[14px] md:text-[15px] text-stone/80 leading-relaxed">{product.description}</p>
                  )}
                </div>
              )}

              {/* Materials & Craft — Hermès pattern */}
              {(craftContent || product.materials_used) && (
                <div className="artwork-content-enter bg-white rounded-2xl border border-border p-5 shadow-sm space-y-3" style={{ animationDelay: "120ms" }}>
                  <h3 className="font-display text-[15px] text-forest font-medium flex items-center gap-2">
                    <Package size={15} className="text-gold" />
                    {craftContent?.title ?? "Materials & Craft"}
                  </h3>
                  {craftContent?.content && (
                    <p className="font-body text-[13px] text-stone leading-relaxed">{craftContent.content}</p>
                  )}
                  {product.materials_used && (
                    <p className="font-body text-[13px] text-stone">
                      <span className="font-semibold text-forest">Materials: </span>{product.materials_used}
                    </p>
                  )}
                </div>
              )}

              {/* Dimensions */}
              {(product.dimensions || product.weight) && (
                <div className="artwork-content-enter flex items-center gap-2 font-body text-[13px] text-stone" style={{ animationDelay: "130ms" }}>
                  <Ruler size={14} className="text-gold shrink-0" />
                  {[product.dimensions, product.weight].filter(Boolean).join(" · ")}
                </div>
              )}

              {/* CTAs */}
              <div className="artwork-content-enter space-y-3" style={{ animationDelay: "140ms" }}>
                {soldOut ? (
                  <div className="w-full h-[54px] flex items-center justify-center bg-stone/10 text-stone/50 font-body font-bold text-[13px] uppercase tracking-wider rounded-xl">
                    Sold Out
                  </div>
                ) : (
                  <a
                    href={waMessage}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-[54px] bg-forest text-white font-body font-bold text-[14px] rounded-xl hover:bg-forest/90 transition-colors shadow-md"
                  >
                    <MessageCircle size={18} />
                    Enquire on WhatsApp
                  </a>
                )}
                {product.commission_similar_enabled && (
                  <a
                    href={commissionMessage}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-[48px] bg-white border-2 border-forest text-forest font-body font-bold text-[13px] rounded-xl hover:bg-forest/5 transition-colors"
                  >
                    Want something like this, made for you?
                  </a>
                )}
              </div>

              <p className="artwork-content-enter font-body text-[12px] text-stone/50 text-center" style={{ animationDelay: "160ms" }}>
                🎨 100% handmade · Delivered across India · WhatsApp reply within 2 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="artwork-content-enter section-padding bg-white border-t border-border/40" style={{ animationDelay: "200ms" }}>
          <div className="container-main">
            <h2 className="font-display text-[22px] md:text-[28px] text-forest font-medium mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to="/shop/product/$slug"
                  params={{ slug: item.slug }}
                  preload="intent"
                  className="group block rounded-xl overflow-hidden shadow-sm bg-cream hover-lift border border-border/40"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.image_url ?? "/placeholder-artwork.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-display text-[13px] text-forest font-medium leading-snug line-clamp-2">{item.title}</p>
                    <p className="font-body text-[12px] text-forest font-semibold mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </ShopLayout>
  );
}
