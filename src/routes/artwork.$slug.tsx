import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { waLink } from "@/lib/whatsapp";
import { getPublishedArtworkBySlug, getArtworkTags, getRelatedArtworks, type ArtworkWithCategory } from "@/lib";
import { buildArtworkStructuredData, buildBreadcrumbStructuredData } from "@/lib/seo";
import { MessageCircle, Ruler, Tag } from "lucide-react";
import { ArtspireBreadcrumb, breadcrumbs } from "@/components/ArtspireBreadcrumb";

interface LoaderData {
  artwork: ArtworkWithCategory;
  tags: { id: string; name: string }[];
  related: ArtworkWithCategory[];
}

export const Route = createFileRoute("/artwork/$slug")({
  loader: async ({ params }): Promise<LoaderData> => {
    const artwork = await getPublishedArtworkBySlug(params.slug);
    if (!artwork) throw notFound();
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
      { name: "Home", item: "https://artspire.in/" },
      ...(artwork.categories ? [{ name: artwork.categories.name, item: `https://artspire.in/categories/${artwork.categories.slug}` }] : []),
      { name: artwork.title, item: `https://artspire.in/artwork/${artwork.slug}` },
    ]);

    return {
      meta: [
        { title: `${artwork.title} | Artspire` },
        { name: "description", content: artwork.summary ?? `View ${artwork.title} by Artspire — handcrafted custom art.` },
        { property: "og:title", content: `${artwork.title} | Artspire` },
        { property: "og:description", content: artwork.summary ?? `View ${artwork.title} by Artspire — handcrafted custom art.` },
        { property: "og:image", content: artwork.image_url ?? "https://artspire.in/og-image.jpg" },
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

function ArtworkPage() {
  const { artwork, tags, related } = Route.useLoaderData() as LoaderData;

  const waMessage = waLink(`Hi Artspire! I love "${artwork.title}" and would like to commission something similar. Can you help?`);

  return (
    <Layout>

      {/* ── MAIN SECTION: Image Left + Story Right ── */}
      <section className="bg-cream min-h-screen">
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
                <div className="rounded-2xl overflow-hidden shadow-lg border border-border/30">
                  <img
                    src={artwork.image_url}
                    alt={artwork.title}
                    className="w-full h-auto object-contain max-h-[85vh]"
                    loading="eager"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-forest/10 to-gold/10" />
              )}

              {/* Tags below image */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {tags.map((tag) => (
                    <span key={tag.id} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-border rounded-full font-body text-[11px] text-stone">
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
                <span className="inline-block self-start px-3 py-1 bg-gold/15 text-gold font-body text-[11px] font-bold uppercase tracking-wider rounded-full">
                  {artwork.categories.name}
                </span>
              )}

              {/* Title */}
              <h1 className="font-display text-[28px] md:text-[40px] text-forest font-medium leading-tight">
                {artwork.title}
              </h1>

              {/* Story */}
              {(artwork.summary || artwork.story_content) && (
                <div className="space-y-4">
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
              <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-3">
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

              {/* CTA */}
              <div className="space-y-3">
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
              <p className="font-body text-[12px] text-stone/50 text-center">
                🎨 100% handmade · Delivered across India · WhatsApp reply within 2 hours
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED ARTWORKS ── */}
      {related.length > 0 && (
        <section className="section-padding bg-white border-t border-border/40">
          <div className="container-main">
            <h2 className="font-display text-[22px] md:text-[28px] text-forest font-medium mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {related.map((item) => (
                <a
                  key={item.id}
                  href={`/artwork/${item.slug}`}
                  className="group block rounded-xl overflow-hidden shadow-sm bg-cream hover-lift border border-border/40"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-forest/10 to-gold/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-3">
                    <p className="font-display text-[13px] text-forest font-medium leading-snug line-clamp-2">{item.title}</p>
                    {item.categories?.name && (
                      <p className="font-body text-[11px] text-stone/60 mt-0.5">{item.categories.name}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

    </Layout>
  );
}
