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
import { MessageCircle, Package, Ruler, Sparkles, ShoppingBag, Minus, Plus, Loader2, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { ArtspireBreadcrumb } from "@/components/ArtspireBreadcrumb";
import { ArtworkDetailSkeleton } from "@/components/ui/skeleton";
import { addToCart, getOrCreateSessionId } from "@/lib/cart";
import { toast } from "@/lib/toast";

interface LoaderData {
  product: ProductWithCategory;
  gallery: { media?: { public_url: string; mime_type?: string | null } | null }[];
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
      getRelatedProducts(product.id, product.category_id, 4).catch((err) => {
        console.error("getRelatedProducts failed:", err);
        return [];
      }),
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

// ─── Product gallery carousel (images + videos, up to 10) ────
interface GalleryItem {
  url: string;
  isVideo: boolean;
}

function ProductGallery({ mainImage, gallery, title }: { mainImage: string; gallery: GalleryItem[]; title: string }) {
  const items: GalleryItem[] = [
    { url: mainImage, isVideo: false },
    ...gallery.filter((g) => g.url !== mainImage),
  ].slice(0, 10);

  const [index, setIndex] = useState(0);
  const [loadedMap, setLoadedMap] = useState<Record<number, boolean>>({});
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const isHorizontalDrag = useRef<boolean | null>(null);

  const markLoaded = (i: number) => setLoadedMap((prev) => ({ ...prev, [i]: true }));

  function goTo(i: number) {
    setIndex(((i % items.length) + items.length) % items.length);
  }

  function handlePointerDown(clientX: number, clientY: number) {
    dragStartX.current = clientX;
    dragStartY.current = clientY;
    isHorizontalDrag.current = null;
    setDragging(true);
  }

  function handlePointerMove(clientX: number, clientY: number, e?: React.TouchEvent) {
    if (dragStartX.current === null || dragStartY.current === null) return;
    const dx = clientX - dragStartX.current;
    const dy = clientY - dragStartY.current;

    if (isHorizontalDrag.current === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      isHorizontalDrag.current = Math.abs(dx) > Math.abs(dy);
    }
    if (isHorizontalDrag.current) {
      e?.preventDefault();
      setDragOffset(dx);
    }
  }

  function handlePointerUp() {
    const width = containerRef.current?.offsetWidth || 1;
    const threshold = width * 0.18;
    if (isHorizontalDrag.current) {
      if (dragOffset < -threshold) goTo(index + 1);
      else if (dragOffset > threshold) goTo(index - 1);
    }
    setDragOffset(0);
    setDragging(false);
    dragStartX.current = null;
    dragStartY.current = null;
    isHorizontalDrag.current = null;
  }

  const width = containerRef.current?.offsetWidth || 1;
  const dragPercent = (dragOffset / width) * 100;
  const trackTransform = `translateX(calc(${-index * 100}% + ${dragPercent}%))`;

  return (
    <div>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl border border-border/30 shadow-lg bg-[#E8E0D5] group select-none"
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY, e)}
        onTouchEnd={handlePointerUp}
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => {
          if (dragStartX.current !== null) handlePointerMove(e.clientX, e.clientY);
        }}
        onMouseUp={handlePointerUp}
        onMouseLeave={() => {
          if (dragStartX.current !== null) handlePointerUp();
        }}
      >
        <div
          className="flex"
          style={{
            transform: trackTransform,
            transition: dragging ? "none" : "transform 350ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {items.map((item, i) => (
            <div key={item.url + i} className="w-full shrink-0 relative">
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${loadedMap[i] ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                style={{
                  background: "linear-gradient(135deg, #E8E0D5 0%, #D4C9B8 50%, #E8E0D5 100%)",
                  backgroundSize: "200% 200%",
                  animation: loadedMap[i] ? "none" : "shimmer 1.8s ease-in-out infinite",
                }}
              />
              {item.isVideo ? (
                <video
                  src={item.url}
                  controls
                  playsInline
                  onLoadedData={() => markLoaded(i)}
                  draggable={false}
                  className={`w-full h-auto max-h-[75vh] transition-opacity duration-500 ${loadedMap[i] ? "opacity-100" : "opacity-0"}`}
                />
              ) : (
                <img
                  src={item.url}
                  alt={title}
                  onLoad={() => markLoaded(i)}
                  draggable={false}
                  className={`w-full h-auto object-contain max-h-[75vh] transition-opacity duration-500 ${loadedMap[i] ? "opacity-100" : "opacity-0"}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                />
              )}
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <>
            <button
              onClick={() => goTo(index - 1)}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center text-forest opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => goTo(index + 1)}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center text-forest opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={18} />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-gold" : "w-1.5 bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === index ? "border-gold" : "border-border/40 hover:border-forest/30"
              }`}
              aria-label={`View item ${i + 1}`}
            >
              {item.isVideo ? (
                <>
                  <video src={item.url} className="w-full h-full object-cover" muted />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <Play size={16} className="text-white fill-white" />
                  </div>
                </>
              ) : (
                <img src={item.url} alt="" className="w-full h-full object-cover" loading="lazy" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductPage() {
  const { product, gallery, related, craftContent } = Route.useLoaderData() as LoaderData;

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const galleryItems = gallery
    .filter((g) => g.media?.public_url)
    .map((g) => ({
      url: g.media!.public_url,
      isVideo: !!g.media?.mime_type?.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(g.media!.public_url),
    }));
  const waMessage = waLink(
    `Hi Artspire! I'm interested in "${product.title}" from the shop (₹${product.price.toLocaleString("en-IN")}). Is it still available?`
  );
  const commissionMessage = waLink(
    `Hi Artspire! I saw "${product.title}" in your shop and would love something similar made for me. Can you help?`
  );

  async function handleAddToCart() {
    setAddingToCart(true);
    try {
      const sessionId = getOrCreateSessionId();
      await addToCart(sessionId, product, quantity);
      toast.success("Added to cart!", `${product.title} × ${quantity}`);
      window.dispatchEvent(new CustomEvent("artspire:cart-updated"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart.", "Please try again.");
    } finally {
      setAddingToCart(false);
    }
  }

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
                gallery={galleryItems}
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

              {/* Quantity + Add to Cart */}
              <div className="artwork-content-enter space-y-3" style={{ animationDelay: "140ms" }}>
                {soldOut ? (
                  <div className="w-full h-[54px] flex items-center justify-center bg-stone/10 text-stone/50 font-body font-bold text-[13px] uppercase tracking-wider rounded-xl">
                    Sold Out
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-xl overflow-hidden">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          aria-label="Decrease quantity"
                          className="w-10 h-[48px] flex items-center justify-center text-forest hover:bg-cream transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-body text-[14px] font-semibold text-forest">{quantity}</span>
                        <button
                          onClick={() => setQuantity((q) => Math.min(product.inventory_count || 99, q + 1))}
                          aria-label="Increase quantity"
                          className="w-10 h-[48px] flex items-center justify-center text-forest hover:bg-cream transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        className="flex-1 flex items-center justify-center gap-2 h-[48px] bg-forest text-white font-body font-bold text-[14px] rounded-xl hover:bg-forest/90 transition-colors shadow-md disabled:opacity-60"
                      >
                        {addingToCart ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
                        {addingToCart ? "Adding…" : "Add to Cart"}
                      </button>
                    </div>
                    <a
                      href={waMessage}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-[46px] bg-white border border-forest/30 text-forest font-body font-semibold text-[13px] rounded-xl hover:bg-forest/5 transition-colors"
                    >
                      <MessageCircle size={16} />
                      Enquire on WhatsApp
                    </a>
                  </>
                )}
                {product.commission_similar_enabled && (
                  <a
                    href={commissionMessage}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-[44px] text-forest/70 font-body font-semibold text-[12px] hover:text-forest transition-colors"
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
