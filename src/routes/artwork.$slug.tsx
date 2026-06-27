import { createFileRoute, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { waLink } from "@/lib/whatsapp";
import { getPublishedArtworkBySlug, getArtworkTags, getRelatedArtworks, type ArtworkWithCategory } from "@/lib";
import { MessageCircle, Ruler } from "lucide-react";

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
    return {
      meta: [
        { title: `${artwork.title} | Artspire` },
        { name: "description", content: artwork.summary ?? `View ${artwork.title} by Artspire — handcrafted custom art.` },
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
  const { artwork, related } = Route.useLoaderData() as LoaderData;

  return (
    <Layout>
      {/* Hero Image */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        {artwork.image_url ? (
          <>
            <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-forest to-deep-forest" />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container-main">
            {artwork.categories?.name && (
              <span className="inline-block px-3 py-1 bg-gold/90 text-white font-body text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
                {artwork.categories.name}
              </span>
            )}
            <h1 className="font-display text-[28px] md:text-[48px] text-white font-medium leading-tight">
              {artwork.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="section-padding bg-cream">
        <div className="container-main grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Left: Story */}
          <div className="md:col-span-8">
            <h2 className="font-display text-[22px] md:text-[28px] text-forest font-medium mb-4">
              About this Piece
            </h2>
            <p className="font-body text-[14px] md:text-[16px] text-stone leading-relaxed mb-6">
              {artwork.summary}
            </p>
            {artwork.story_content && (
              <div className="font-body text-[14px] md:text-[16px] text-stone leading-relaxed prose prose-stone max-w-none">
                {artwork.story_content}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="md:col-span-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
              <h3 className="font-display text-[18px] text-forest font-medium mb-4">
                Artwork Details
              </h3>
              <dl className="space-y-3">
                {artwork.categories?.name && (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                      <span className="font-body text-[10px] font-bold text-forest">C</span>
                    </div>
                    <div>
                      <dt className="font-body text-[11px] text-stone/60 uppercase tracking-wider">Category</dt>
                      <dd className="font-body text-[14px] text-forest font-medium">{artwork.categories.name}</dd>
                    </div>
                  </div>
                )}
                {artwork.dimensions && (
                  <div className="flex items-center gap-3">
                    <Ruler size={16} className="text-gold shrink-0" />
                    <div>
                      <dt className="font-body text-[11px] text-stone/60 uppercase tracking-wider">Size</dt>
                      <dd className="font-body text-[14px] text-forest font-medium">{artwork.dimensions}</dd>
                    </div>
                  </div>
                )}
              </dl>

              {/* Commission CTA */}
              <div className="mt-6 pt-6 border-t border-border">
                <a
                  href={waLink(`Hi Artspire, I'm interested in "${artwork.title}". Can you tell me more?`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-[48px] bg-gold text-forest font-body font-bold text-[13px] rounded-xl btn-gold transition-colors"
                >
                  <MessageCircle size={16} />
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Artworks */}
      {related.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-main">
            <h2 className="font-display text-[22px] md:text-[28px] text-forest font-medium mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {related.map((item) => (
                <a
                  key={item.id}
                  href={`/artwork/${item.slug}`}
                  className="group block rounded-xl overflow-hidden shadow-sm bg-white hover-lift"
                >
                  <div className="relative h-[220px] md:h-[260px] overflow-hidden">
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
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="font-display text-[15px] text-white font-medium">{item.title}</span>
                    </div>
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
