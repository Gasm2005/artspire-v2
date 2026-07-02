import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { waLink } from "../lib/whatsapp";
import { ArrowRight } from "lucide-react";
import { getArtworks, type ArtworkWithCategory, type ArtworkStatus } from "@/lib/artworks";
import { getCategories, type CategoryWithVisuals } from "@/lib/categories";
import { getPageSEO } from "@/lib/website-content";

// Map URL category slugs to filter keys (kept for backwards compat but no longer primary)
const slugToKey: Record<string, string> = {
  "pencil-sketches": "sketches",
  "colour-portraits": "portraits",
  "paintings": "paintings",
  "mirror-art": "mirror",
  "clay-art": "clay",
  "personalized-gifts": "gifts",
};

export const Route = createFileRoute("/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio | Artspire" }, { name: "description", content: "Handcrafted portraits, paintings, mirror art, clay sculptures and personalized gifts." }] }),
  loader: async () => {
    const [artworks, categories] = await Promise.all([
      getArtworks({ status: "published" as ArtworkStatus, limit: 50 }),
      getCategories().catch(() => []),
    ]);
    return { artworks, categories: categories as CategoryWithVisuals[] };
  },
  component: PortfolioPage,
});

function PortfolioPage() {
  const { artworks, categories } = Route.useLoaderData() as { artworks: ArtworkWithCategory[], categories: CategoryWithVisuals[] };
  const [initialLoad, setInitialLoad] = useState(true);
  const [active, setActive] = useState<string>("all");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setActive(categoryParam);
      setTimeout(() => {
        document.getElementById("portfolio-grid")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    setInitialLoad(false);
  }, []);

  const visible = artworks.filter((a) => {
    if (active === "all") return true;
    return a.categories?.slug === active;
  });

  return (
    <Layout>
      <section className="section-padding bg-cream text-center">
        <div className="container-main">
          <p className="font-body text-[11px] md:text-[12px] font-semibold text-gold mb-4 uppercase tracking-[0.25em]">Our Work</p>
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-forest font-medium mb-4">Every Piece Tells a Story</h1>
          <p className="font-body text-[14px] md:text-[16px] text-stone max-w-xl mx-auto">Handcrafted portraits, paintings, mirror art, clay sculptures and personalized gifts.</p>
        </div>
      </section>

      <section className="pb-8">
        <div className="container-main">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:justify-center md:flex-wrap">
            <button
              onClick={() => setActive("all")}
              className={`shrink-0 px-4 py-2.5 rounded-full font-body text-[12px] font-semibold border transition-all duration-200 ${
                active === "all"
                  ? "bg-forest text-white border-forest shadow-sm"
                  : "bg-transparent text-stone border-border hover:border-forest/40 hover:text-forest"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActive(cat.slug)}
                className={`shrink-0 px-4 py-2.5 rounded-full font-body text-[12px] font-semibold border transition-all duration-200 ${
                  active === cat.slug
                    ? "bg-forest text-white border-forest shadow-sm"
                    : "bg-transparent text-stone border-border hover:border-forest/40 hover:text-forest"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <div className="container-main">
          <div id="portfolio-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {visible.map((artwork) => (
              <a
                key={artwork.id}
                href={`/artwork/${artwork.slug}`}
                className="work-card portfolio-item relative rounded-xl overflow-hidden flex flex-col h-[300px] md:h-[340px] shadow-sm group cursor-pointer"
              >
                {/* Artwork image */}
                <img
                  src={artwork.image_url ?? "/placeholder-artwork.jpg"}
                  alt={artwork.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <span className="font-display text-[16px] md:text-[18px] text-white font-medium">{artwork.title}</span>
                </div>
              </a>
            ))}

            {visible.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="font-body text-[14px] text-stone">No artworks found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="pb-12 md:pb-16 text-center">
        <div className="container-main">
          <button className="inline-flex items-center gap-2 h-[48px] px-8 border-2 border-forest text-forest font-body font-semibold text-[13px] uppercase rounded-xl active-scale btn-secondary">
            Load More Work <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <section className="section-padding bg-forest text-center">
        <div className="container-main max-w-2xl">
          <h2 className="font-display text-[24px] md:text-[32px] text-white font-medium mb-3">Don't See What You're Looking For?</h2>
          <p className="font-body text-[14px] md:text-[16px] text-cream/70 mb-8 leading-relaxed">Every piece is custom made. Share your idea and I'll bring it to life.</p>
          <a
            href={waLink("Hi Artspire, I'd like to start a custom commission.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-[52px] px-8 bg-gold text-forest font-body font-bold text-[14px] tracking-wide rounded-full btn-gold transition-colors active-scale"
          >
            Start a Custom Commission
          </a>
        </div>
      </section>
    </Layout>
  );
}
