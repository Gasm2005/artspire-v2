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
import { absoluteUrl, OG_IMAGE } from "@/lib/site";
import { MessageCircle, Package, Sparkles, ShoppingBag, Minus, Plus, Loader2, ChevronLeft, ChevronRight, Play, Flame, ShieldCheck, Truck, Star } from "lucide-react";
import { ArtspireBreadcrumb } from "@/components/ArtspireBreadcrumb";
import { ArtworkDetailSkeleton } from "@/components/ui/skeleton";
import { addToCart, getOrCreateSessionId } from "@/lib/cart";
import { getApprovedReviews, getReviewSummary, submitReview, type ProductReview } from "@/lib/reviews";
import { toast } from "@/lib/toast";

interface LoaderData {
  product: ProductWithCategory;
  gallery: { media?: { public_url: string; mime_type?: string | null } | null }[];
  related: ProductWithCategory[];
  craftContent: MediumCraftContent | null;
  reviews: ProductReview[];
}

export const Route = createFileRoute("/shop/product/$slug")({
  pendingComponent: ProductPendingSkeleton,
  pendingMs: 0,
  pendingMinMs: 300,

  loader: async ({ params }): Promise<LoaderData> => {
    const product = await getPublishedProductBySlug(params.slug);
    if (!product) throw notFound();

    const [gallery, related, craftContent, reviews] = await Promise.all([
      getProductGalleryImages(product.id).catch(() => []),
      getRelatedProducts(product.id, product.category_id, 4).catch((err) => {
        console.error("getRelatedProducts failed:", err);
        return [];
      }),
      product.medium ? getMediumCraftContent(product.medium) : Promise.resolve(null),
      getApprovedReviews(product.id).catch(() => []),
    ]);

    return { product, gallery, related, craftContent, reviews };
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
        url: absoluteUrl(`/shop/product/${product.slug}`),
      },
    };

    const breadcrumbData = buildBreadcrumbStructuredData([
      { name: "Home", item: absoluteUrl("/") },
      { name: "Shop", item: absoluteUrl("/shop") },
      ...(product.categories
        ? [{ name: product.categories.name, item: absoluteUrl(`/shop/${product.categories.slug}`) }]
        : []),
      { name: product.title, item: absoluteUrl(`/shop/product/${product.slug}`) },
    ]);

    return {
      meta: [
        { title: product.meta_title ?? `${product.title} | Artspire Shop` },
        { name: "description", content: product.meta_description ?? product.summary ?? `${product.title} — handmade, one of a kind, by Artspire.` },
        { property: "og:title", content: product.meta_title ?? `${product.title} | Artspire Shop` },
        { property: "og:image", content: product.image_url ?? OG_IMAGE },
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
  const { product, gallery, related, craftContent, reviews: initialReviews } = Route.useLoaderData() as LoaderData;

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const reviewSummary = getReviewSummary(reviews);

  async function handleSubmitReview() {
    if (!reviewForm.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    setSubmittingReview(true);
    try {
      await submitReview({
        productId: product.id,
        customerName: reviewForm.name.trim(),
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim() || undefined,
      });
      setReviewSubmitted(true);
      setShowReviewForm(false);
      setReviewForm({ name: "", rating: 5, comment: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review.", "Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  }

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
  const lowStock = !soldOut && product.inventory_count > 0 && product.inventory_count <= 3;

  return (
    <ShopLayout>
      <section className="artwork-page-enter hero-texture bg-cream min-h-screen">
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

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            {/* LEFT: Gallery */}
            <div className="w-full lg:w-1/2 lg:sticky lg:top-8 relative">
              <ProductGallery
                mainImage={product.image_url ?? "/placeholder-artwork.svg"}
                gallery={galleryItems}
                title={product.title}
              />
              {product.is_one_of_a_kind && (
                <div
                  className="absolute -top-3 -left-3 w-[86px] h-[86px] rounded-full bg-forest text-cream flex flex-col items-center justify-center text-center shadow-lg z-10 -rotate-12 border-2 border-gold/70"
                  aria-hidden="true"
                >
                  <span className="font-display text-[10px] tracking-[0.15em] leading-tight px-1">ONE OF A</span>
                  <span className="font-display text-[15px] tracking-[0.05em] leading-tight -mt-0.5">KIND</span>
                  <span className="font-body text-[7px] tracking-[0.2em] text-gold mt-0.5">HAND · FINISHED</span>
                </div>
              )}
            </div>

            {/* RIGHT: Story + Details + CTA */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                {product.categories?.name && (
                  <Link
                    to="/shop/$category"
                    params={{ category: product.categories.slug }}
                    className="font-body text-[11px] font-bold uppercase tracking-[0.18em] text-gold hover:text-forest transition-colors pb-1 border-b-2 border-gold/40"
                  >
                    {product.categories.name}
                  </Link>
                )}
              </div>

              <h1 className="artwork-content-enter font-display text-[32px] md:text-[44px] text-forest font-medium leading-[1.08] -mt-1" style={{ animationDelay: "40ms" }}>
                {product.title}
              </h1>

              {reviewSummary.count > 0 && (
                <button
                  onClick={() => document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="artwork-content-enter flex items-center gap-1.5 -mt-3 w-fit"
                  style={{ animationDelay: "50ms" }}
                >
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i <= Math.round(reviewSummary.average) ? "fill-gold text-gold" : "text-border"}
                      />
                    ))}
                  </div>
                  <span className="font-body text-[12px] text-stone">
                    {reviewSummary.average} ({reviewSummary.count} review{reviewSummary.count === 1 ? "" : "s"})
                  </span>
                </button>
              )}

              <div className="artwork-content-enter flex items-baseline gap-3 pt-1" style={{ animationDelay: "60ms" }}>
                <p className="font-display text-[30px] text-forest font-semibold">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <>
                    <span className="text-[16px] text-stone/40 line-through font-body">
                      ₹{product.compare_at_price.toLocaleString("en-IN")}
                    </span>
                    <span className="font-body text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      {Math.round((1 - product.price / product.compare_at_price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="artwork-content-enter -mt-4 font-body text-[11px] text-stone/50" style={{ animationDelay: "65ms" }}>
                Inclusive of all taxes
              </p>

              {lowStock && (
                <p className="artwork-content-enter flex items-center gap-1.5 font-body text-[12px] font-semibold text-red-600" style={{ animationDelay: "70ms" }}>
                  <Flame size={13} />
                  Only {product.inventory_count} left — this one won't be remade
                </p>
              )}

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

              {/* The Piece — museum-placard style spec sheet */}
              {(craftContent || product.materials_used || product.dimensions || product.weight) && (
                <div className="artwork-content-enter bg-white rounded-2xl border border-border shadow-sm overflow-hidden" style={{ animationDelay: "120ms" }}>
                  <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-border/60">
                    <Package size={14} className="text-gold" />
                    <h3 className="font-display text-[14px] text-forest font-medium tracking-wide">
                      {craftContent?.title ?? "The Piece"}
                    </h3>
                  </div>
                  <div className="px-5 py-3 divide-y divide-border/50">
                    {craftContent?.content && (
                      <p className="font-body text-[13px] text-stone leading-relaxed py-3 first:pt-0">
                        {craftContent.content}
                      </p>
                    )}
                    {product.materials_used && (
                      <div className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0">
                        <span className="font-body text-[11px] uppercase tracking-wider text-stone/50 shrink-0">Materials</span>
                        <span className="font-body text-[13px] text-forest text-right">{product.materials_used}</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex items-baseline justify-between gap-4 py-2.5">
                        <span className="font-body text-[11px] uppercase tracking-wider text-stone/50 shrink-0">Dimensions</span>
                        <span className="font-body text-[13px] text-forest text-right">{product.dimensions}</span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex items-baseline justify-between gap-4 py-2.5">
                        <span className="font-body text-[11px] uppercase tracking-wider text-stone/50 shrink-0">Weight</span>
                        <span className="font-body text-[13px] text-forest text-right">{product.weight}</span>
                      </div>
                    )}
                  </div>
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

              <div className="artwork-content-enter grid grid-cols-3 gap-2 pt-1" style={{ animationDelay: "160ms" }}>
                <div className="flex flex-col items-center gap-1 text-center p-2.5 bg-white rounded-xl border border-border/40">
                  <ShieldCheck size={16} className="text-gold" />
                  <span className="font-body text-[10px] text-stone leading-tight">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center p-2.5 bg-white rounded-xl border border-border/40">
                  <Truck size={16} className="text-gold" />
                  <span className="font-body text-[10px] text-stone leading-tight">Ships in 3–5 Days</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center p-2.5 bg-white rounded-xl border border-border/40">
                  <Sparkles size={16} className="text-gold" />
                  <span className="font-body text-[10px] text-stone leading-tight">Handmade by Himangi</span>
                </div>
              </div>

              <p className="artwork-content-enter font-body text-[12px] text-stone/50 text-center" style={{ animationDelay: "170ms" }}>
                🎨 100% handmade · Delivered across India · WhatsApp reply within 2 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews-section" className="section-padding bg-cream border-t border-border/40">
        <div className="container-main max-w-3xl">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <h2 className="font-display text-[22px] md:text-[26px] text-forest font-medium">
              Reviews {reviewSummary.count > 0 && `(${reviewSummary.count})`}
            </h2>
            {!showReviewForm && !reviewSubmitted && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-4 py-2 rounded-full border border-forest/30 font-body text-[12px] font-semibold text-forest hover:bg-forest/5 transition-colors"
              >
                Write a Review
              </button>
            )}
          </div>

          {reviewSubmitted && (
            <div className="bg-white rounded-xl border border-gold/30 p-4 mb-6 text-center">
              <p className="font-body text-[13px] text-forest font-medium">
                Thank you! Your review has been submitted and will appear here once approved.
              </p>
            </div>
          )}

          {showReviewForm && (
            <div className="bg-white rounded-2xl border border-border p-5 mb-6 space-y-3">
              <div>
                <label className="block font-body text-[11px] font-bold text-stone uppercase tracking-wider mb-1.5">
                  Your Name
                </label>
                <input
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Priya Sharma"
                  className="w-full h-[42px] px-3 rounded-lg border border-border font-body text-[13px] focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block font-body text-[11px] font-bold text-stone uppercase tracking-wider mb-1.5">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button key={i} onClick={() => setReviewForm((f) => ({ ...f, rating: i }))} type="button">
                      <Star size={22} className={i <= reviewForm.rating ? "fill-gold text-gold" : "text-border"} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-body text-[11px] font-bold text-stone uppercase tracking-wider mb-1.5">
                  Your Review (optional)
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                  rows={3}
                  placeholder="What did you like about this piece?"
                  className="w-full px-3 py-2 rounded-lg border border-border font-body text-[13px] focus:outline-none focus:border-gold resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="flex-1 h-[42px] bg-forest text-white font-body font-semibold text-[13px] rounded-lg hover:bg-forest/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submittingReview && <Loader2 size={14} className="animate-spin" />}
                  Submit Review
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 h-[42px] font-body text-[13px] text-stone hover:text-forest transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {reviews.length === 0 ? (
            <p className="font-body text-[13px] text-stone/60 text-center py-6">
              No reviews yet — be the first to share your experience with this piece.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-body text-[13px] font-semibold text-forest">{r.customer_name}</span>
                    <span className="font-body text-[11px] text-stone/50">
                      {new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={12} className={i <= r.rating ? "fill-gold text-gold" : "text-border"} />
                    ))}
                  </div>
                  {r.comment && <p className="font-body text-[13px] text-stone leading-relaxed">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
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
