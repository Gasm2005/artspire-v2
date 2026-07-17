import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { waLink } from "@/lib/whatsapp";
import {
  getPublishedArtworkBySlug,
  getArtworkTags,
  getRelatedArtworks,
  type ArtworkWithCategory,
} from "@/lib";
import { buildArtworkStructuredData, buildBreadcrumbStructuredData } from "@/lib/seo";
import { absoluteUrl, OG_IMAGE } from "@/lib/site";
import { MessageCircle, Tag } from "lucide-react";
import { ArtspireBreadcrumb, breadcrumbs } from "@/components/ArtspireBreadcrumb";
import { ArtworkDetailSkeleton } from "@/components/ui/skeleton";

interface LoaderData {
  artwork: ArtworkWithCategory;
  tags: { id: string; name: string }[];
  related: ArtworkWithCategory[];
}

export const Route = createFileRoute("/artwork/$slug")({
  // ─── PENDING COMPONENT ──────────────────────────────────────
  // Shows instantly when user clicks an artwork card, before loader completes.
  // Eliminates the "frozen page" feeling during Supabase round-trips.
  pendingComponent: ArtworkPendingSkeleton,
  pendingMs: 0,      // Show pending UI immediately — no delay
  pendingMinMs: 300, // Keep skeleton visible at least 300ms to avoid flash

  loader: async ({ params }): Promise<LoaderData> => {
    const artwork = await getPublishedArtworkBySlug(params.slug);
    if (!artwork) throw notFound();

    // Run tags + related in parallel after we have the artwork
    const [tags, related] = await Promise.all([
      getArtworkTags(artwork.id),
      getRelatedArtworks(artwork.id, artwork.category_id, 4),
    ]);

    return { artwork, tags, related };
  },

  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { artwork } = loaderData;

    const structuredData = buildArtworkStructuredData({
      title: artwork.title,
      summary: artwork.summary ?? "",
      image_url: artwork.image_url ?? "",
      price: artwork.price ?? 0,
      created_at: artwork.created_at,
      slug: artwork.slug,
      status: artwork.status,
      category: artwork.categories?.name,
    });

    const breadcrumbData = buildBreadcrumbStructuredData([
      { name: "Home", item: absoluteUrl("/") },
      ...(artwork.categories
        ? [{ name: artwork.categories.name, item: absoluteUrl(`/categories/${artwork.categories.slug}`) }]
        : []),
      { name: artwork.title, item: absoluteUrl(`/artwork/${artwork.slug}`) },
    ]);

    return {
      meta: [
        { title: `${artwork.title} | Artspire` },
        { name: "description", content: artwork.summary ?? `View ${artwork.title} by Artspire — handcrafted custom art.` },
        { property: "og:title", content: `${artwork.title} | Artspire` },
        { property: "og:description", content: artwork.summary ?? `View ${artwork.title} by Artspire — handcrafted custom art.` },
        { property: "og:image", content: artwork.image_url ?? OG_IMAGE },
        { property: "og:type", content: "website" },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(structuredData) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbData) },
      ],
    };
  },

  component: ArtworkPage,
  notFoundComponent: () => (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-[48px] text-forest">404</h1>
          <p className="font-body text-stone mt-2">Artwork not found</p>
        </div>
      </div>
    </Layout>
  ),
});

// ─── PENDING SKELETON ────────────────────────────────────────
// Shown instantly on click, before loader completes.
function ArtworkPendingSkeleton() {
  return (
    <Layout>
      <div className="artwork-page-enter bg-cream min-h-screen">
        <ArtworkDetailSkeleton />
      </div>
    </Layout>
  );
}

// ─── PROGRESSIVE IMAGE ───────────────────────────────────────
// Shows blur placeholder immediately, fades to real image.
// Prevents CLS — dimensions are always reserved.
interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

function ProgressiveImage({ src, alt, className }: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // If image is already cached (browser cached), mark loaded immediately
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border/30 shadow-lg bg-[#E8E0D5]">
      {/* Blur placeholder — always visible, fades out when image loads */}
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
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-auto object-contain max-h-[85vh] transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className ?? ""}`}
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
}

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────
function ArtworkPage() {
  const { artwork, tags, related } = Route.useLoaderData() as LoaderData;
  const waMessage = waLink(
    `Hi Artspire! I love "${artwork.title}" and would like to commission something similar. Can you help?`
  );

  return (
    <Layout>
      {/* Page enter transition — CSS only, no library needed */}
      <section className="artwork-page-enter bg-cream min-h-screen">
        <div className="container-main py-8 md:py-14">
          {/* Breadcrumb */}
          <ArtspireBreadcrumb
            crumbs={breadcrumbs.artwork(
              artwork.title,
              artwork.categories?.name,
              artwork.categories?.slug
            )}
            className="mb-8"
          />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
            {/* ── LEFT: Image ── */}
            <div className="w-full lg:w-1/2 lg:sticky lg:top-8">
              {artwork.image_url ? (
                <ProgressiveImage src={artwork.image_url} alt={artwork.title} />
              ) : (
                <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-forest/10 to-gold/10" />
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 artwork-content-enter" style={{ animationDelay: "80ms" }}>
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-border rounded-full font-body text-[11px] text-stone"
                    >
                      <Tag size={10} className="text-gold" />
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Story + Details + CTA ── */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              {/* Category badge */}
              {artwork.categories?.name && (
                <span className="artwork-content-enter inline-block self-start px-3 py-1 bg-gold/15 text-gold font-body text-[11px] font-bold uppercase tracking-wider rounded-full" style={{ animationDelay: "40ms" }}>
                  {artwork.categories.name}
                </span>
              )}

              {/* Title */}
              <h1
                className="artwork-content-enter font-display text-[28px] md:text-[40px] text-forest font-medium leading-tight"
                style={{ animationDelay: "60ms" }}
              >
                {artwork.title}
              </h1>

              {/* Story */}
              {(artwork.summary || artwork.story_content) && (
                <div
                  className="artwork-content-enter space-y-4"
                  style={{ animationDelay: "100ms" }}
                >
                  {artwork.summary && (
                    <p className="font-body text-[15px] md:text-[17px] text-stone leading-relaxed">
                      {artwork.summary}
                    </p>
                  )}
                  {artwork.story_content && (
                    <p className="font-body text-[14px] md:text-[15px] text-stone/80 leading-relaxed">
                      {artwork.story_content}
                    </p>
                  )}
                </div>
              )}

              {/* Artwork Details */}
              <div
                className="artwork-content-enter bg-white rounded-2xl border border-border p-5 shadow-sm space-y-3"
                style={{ animationDelay: "120ms" }}
              >
                <h3 className="font-display text-[15px] text-forest font-medium">Artwork Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  {artwork.categories?.name && (
                    <div>
                      <p className="font-body text-[10px] text-stone/50 uppercase tracking-wider mb-0.5">Category</p>
                      <p className="font-body text-[13px] text-forest font-semibold">{artwork.categories.name}</p>
                    </div>
                  )}
                  {artwork.dimensions && (
                    <div>
                      <p className="font-body text-[10px] text-stone/50 uppercase tracking-wider mb-0.5">Size</p>
                      <p className="font-body text-[13px] text-forest font-semibold">{artwork.dimensions}</p>
                    </div>
                  )}
                  {artwork.medium && (
                    <div>
                      <p className="font-body text-[10px] text-stone/50 uppercase tracking-wider mb-0.5">Medium</p>
                      <p className="font-body text-[13px] text-forest font-semibold">{artwork.medium}</p>
                    </div>
                  )}
                  {artwork.price && artwork.price > 0 && (
                    <div>
                      <p className="font-body text-[10px] text-stone/50 uppercase tracking-wider mb-0.5">Starting From</p>
                      <p className="font-body text-[13px] text-gold font-bold">₹{artwork.price.toLocaleString("en-IN")}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* CTAs */}
              <div
                className="artwork-content-enter space-y-3"
                style={{ animationDelay: "140ms" }}
              >
                <a
                  href={waMessage}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-[54px] bg-forest text-white font-body font-bold text-[14px] rounded-xl hover:bg-forest/90 transition-colors shadow-md"
                >
                  <MessageCircle size={18} />
                  Commission Something Similar
                </a>
                <a
                  href={waLink(`Hi Artspire! I want to know more about "${artwork.title}"`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-[48px] bg-white border-2 border-forest text-forest font-body font-bold text-[13px] rounded-xl hover:bg-forest/5 transition-colors"
                >
                  Ask About This Piece
                </a>
              </div>

              {/* Trust note */}
              <p
                className="artwork-content-enter font-body text-[12px] text-stone/50 text-center"
                style={{ animationDelay: "160ms" }}
              >
                🎨 100% handmade · Delivered across India · WhatsApp reply within 2 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related artworks */}
      {related.length > 0 && (
        <section
          className="artwork-content-enter section-padding bg-white border-t border-border/40"
          style={{ animationDelay: "200ms" }}
        >
          <div className="container-main">
            <h2 className="font-display text-[22px] md:text-[28px] text-forest font-medium mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {related.map((item) => (
                <PrefetchArtworkCard key={item.id} artwork={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

// ─── PREFETCH ARTWORK CARD ───────────────────────────────────
// Prefetches the artwork page on hover/focus AND on viewport entry.
// When user clicks, the loader data is already warm → instant navigation.
function PrefetchArtworkCard({ artwork }: { artwork: ArtworkWithCategory }) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // Prefetch on viewport entry (IntersectionObserver)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          // Warm the browser image cache
          if (artwork.image_url) {
            const img = new Image();
            img.src = artwork.image_url;
          }
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Start 200px before it's visible
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [artwork.image_url]);

  return (
    <a
      ref={cardRef}
      href={`/artwork/${artwork.slug}`}
      className="group block rounded-xl overflow-hidden shadow-sm bg-cream hover-lift border border-border/40"
    >
      <div className="relative aspect-square overflow-hidden">
        {artwork.image_url ? (
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-forest/10 to-gold/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="p-3">
        <p className="font-display text-[13px] text-forest font-medium leading-snug line-clamp-2">
          {artwork.title}
        </p>
        {artwork.categories?.name && (
          <p className="font-body text-[11px] text-stone/60 mt-0.5">{artwork.categories.name}</p>
        )}
      </div>
    </a>
  );
}
