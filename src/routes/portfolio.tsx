import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { waLink } from "../lib/whatsapp";
import { getArtworks, type ArtworkWithCategory, type ArtworkStatus } from "@/lib/artworks";
import { getCategories, type CategoryWithVisuals } from "@/lib/categories";
import { getPageSEO } from "@/lib/website-content";
import { PortfolioGridSkeleton } from "@/components/ui/skeleton";
import { ExpandableSearch } from "@/components/ExpandableSearch";
import { ArtspirePagination } from "@/components/ArtspirePagination";
import { ArtspireBreadcrumb, breadcrumbs } from "@/components/ArtspireBreadcrumb";

const PAGE_SIZE = 12;

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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    const pageParam = parseInt(params.get("page") ?? "1", 10);
    if (categoryParam) {
      setActive(categoryParam);
      setTimeout(() => {
        document.getElementById("portfolio-grid")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    if (!isNaN(pageParam) && pageParam > 0) setCurrentPage(pageParam);
    setInitialLoad(false);
  }, []);

  // Reset to page 1 on filter/search change
  const handleCategoryChange = (slug: string) => {
    setActive(slug);
    setCurrentPage(1);
  };
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("portfolio-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Update URL without navigation
    const params = new URLSearchParams(window.location.search);
    if (page === 1) params.delete("page"); else params.set("page", String(page));
    window.history.replaceState({}, "", `${window.location.pathname}${params.size ? "?" + params : ""}`);
  };

  const filtered = artworks.filter((a) => {
    const matchCat = active === "all" || a.categories?.slug === active;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Paginate
  const totalFiltered = filtered.length;
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <Layout>
      <section className="section-padding bg-cream text-center">
        <div className="container-main">
          <div className="flex justify-center mb-4">
            <ArtspireBreadcrumb crumbs={breadcrumbs.portfolio} />
          </div>
          <p className="font-body text-[11px] md:text-[12px] font-semibold text-gold mb-4 uppercase tracking-[0.25em]">Our Work</p>
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-forest font-medium mb-4">Every Piece Tells a Story</h1>
          <p className="font-body text-[14px] md:text-[16px] text-stone max-w-xl mx-auto">Handcrafted portraits, paintings, mirror art, clay sculptures and personalized gifts.</p>
        </div>
      </section>

      <section className="pb-8">
        <div className="container-main">
          <div className="flex items-center gap-3 mb-4 justify-end">
            <ExpandableSearch
              onSearch={handleSearch}
              placeholder="Search artworks…"
              debounceMs={250}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:justify-center md:flex-wrap">
            <button
              onClick={() => handleCategoryChange("all")}
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
                onClick={() => handleCategoryChange(cat.slug)}
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

            {/* Empty state */}
            {visible.length === 0 && !initialLoad && (
              <div className="col-span-full text-center py-16">
                <p className="font-display text-[22px] text-forest/30 mb-2">No artworks found</p>
                <p className="font-body text-[13px] text-stone/50">
                  {searchQuery ? `No results for "${searchQuery}"` : "No artworks in this category yet."}
                </p>
              </div>
            )}

            {/* Skeleton on initial load */}
            {initialLoad && <PortfolioGridSkeleton count={PAGE_SIZE} />}
          </div>

          {/* Pagination */}
          {totalFiltered > PAGE_SIZE && (
            <div className="mt-10 md:mt-12">
              <ArtspirePagination
                total={totalFiltered}
                pageSize={PAGE_SIZE}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </section>

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
