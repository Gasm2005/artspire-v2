import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { getProducts, type ProductWithCategory } from "@/lib/products";
import { getShopCategories, type ShopCategory } from "@/lib/shop-categories";
import { getCollections, type Collection } from "@/lib/collections";
import { getPageSEO } from "@/lib/website-content";
import { ArtspireBreadcrumb } from "@/components/ArtspireBreadcrumb";
import { PortfolioGridSkeleton } from "@/components/ui/skeleton";
import { ExpandableSearch } from "@/components/ExpandableSearch";
import { ArtspirePagination } from "@/components/ArtspirePagination";
import { ArrowRight } from "lucide-react";

const PAGE_SIZE = 12;

export const Route = createFileRoute("/shop/")({
  loader: async () => {
    const [products, categories, collections, seo] = await Promise.all([
      getProducts({ status: "published", orderBy: "display_order", limit: 100 }).catch(() => []),
      getShopCategories().catch(() => []),
      getCollections({ activeOnly: true }).catch(() => []),
      getPageSEO("shop").catch(() => ({ title: null, description: null, ogImage: null })),
    ]);
    return {
      products: products as ProductWithCategory[],
      categories: categories as ShopCategory[],
      collections: collections as Collection[],
      seo,
    };
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    return {
      meta: [
        { title: seo?.title ?? "Shop | Artspire — Handmade Home Décor & Art" },
        { name: "description", content: seo?.description ?? "Ready-made handcrafted pieces — clay sculpture, mirror art, paintings, and sketches. Each one made by hand by Himangi Pandey. Ships across India." },
        ...(seo?.ogImage ? [{ property: "og:image", content: seo.ogImage }] : []),
      ],
    };
  },
  component: ShopPage,
});

function ShopPage() {
  const { products, categories, collections } = Route.useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"newest" | "price_low" | "price_high">("newest");
  const [oneOfAKindOnly, setOneOfAKindOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);

  const filtered = products
    .filter((p) => {
      const matchCategory = activeCategory === "all" || p.categories?.slug === activeCategory;
      const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchOOAK = !oneOfAKindOnly || p.is_one_of_a_kind;
      const min = priceRange.min ? Number(priceRange.min) : 0;
      const max = priceRange.max ? Number(priceRange.max) : Infinity;
      const matchPrice = p.price >= min && p.price <= max;
      return matchCategory && matchSearch && matchOOAK && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price_low") return a.price - b.price;
      if (sortBy === "price_high") return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const featured = collections.find((c) => c.is_active) ?? collections[0];
  const secondaryCollections = collections.filter((c) => c.id !== featured?.id).slice(0, 2);

  return (
    <ShopLayout>
      {/* ═══ FULL-BLEED EDITORIAL HERO ═══ */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex flex-col justify-end px-6 pb-16 md:pb-20 lg:px-12">
        <div className="absolute inset-0 bg-gradient-to-br from-forest/20 to-gold/10">
          {collections[0]?.hero_image_url && (
            <img
              src={collections[0].hero_image_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />
        </div>
        <div className="relative z-10 container-main max-w-xl">
          <div className="mb-4">
            <ArtspireBreadcrumb
              crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
              className="[&_*]:text-white/70 [&_svg]:text-white/50"
            />
          </div>
          <p className="font-body text-[11px] font-semibold text-white/70 uppercase tracking-[0.3em] mb-4">
            Handcrafted · Limited Editions · Made in India
          </p>
          <h1 className="font-display text-[34px] md:text-[52px] text-white font-medium leading-[1.08] mb-5">
            Objects made to be lived with, and left behind.
          </h1>
          <p className="font-body text-[15px] md:text-[17px] text-white/80 leading-relaxed max-w-md mb-8">
            Each piece in this collection was shaped by hand, one at a time — with no promise it will ever be made again.
          </p>
          <a
            href="#shop-grid"
            className="inline-flex items-center gap-2 h-[48px] px-8 bg-white text-forest font-body font-semibold text-[13px] uppercase tracking-wider rounded-sm hover:bg-cream transition-colors"
          >
            Explore the Collection
          </a>
        </div>
      </section>

      {/* ═══ ETHOS STRIP ═══ */}
      <section className="bg-white py-6 border-b border-border/40">
        <div className="container-main text-center">
          <p className="font-body text-[12px] md:text-[13px] text-stone/70 leading-relaxed max-w-2xl mx-auto">
            Every piece begins as raw material and passes through unhurried hands. Nothing is rushed, and no two objects leave the studio exactly alike.
          </p>
        </div>
      </section>

      {/* ═══ FEATURED COLLECTION (asymmetric, not grid) ═══ */}
      {featured && (
        <section className="section-padding bg-white">
          <div className="container-main">
            <p className="font-body text-[11px] font-semibold text-gold uppercase tracking-[0.3em] mb-6">
              Featured
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Link
                to="/shop/collections/$slug"
                params={{ slug: featured.slug }}
                className="lg:col-span-2 group relative rounded-sm overflow-hidden aspect-[16/10] block"
              >
                <img
                  src={featured.hero_image_url ?? "/placeholder-artwork.svg"}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h2 className="font-display text-[24px] md:text-[32px] text-white font-medium mb-1">{featured.title}</h2>
                  {featured.description && (
                    <p className="font-body text-[13px] text-white/70 max-w-md">{featured.description}</p>
                  )}
                </div>
              </Link>
              <div className="flex flex-col gap-4">
                {secondaryCollections.map((c) => (
                  <Link
                    key={c.id}
                    to="/shop/collections/$slug"
                    params={{ slug: c.slug }}
                    className="group relative rounded-sm overflow-hidden flex-1 min-h-[140px] block"
                  >
                    <img
                      src={c.hero_image_url ?? "/placeholder-artwork.svg"}
                      alt={c.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="font-display text-[16px] text-white font-medium">{c.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ BROWSE BY MEDIUM ═══ */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <p className="font-body text-[11px] font-semibold text-gold uppercase tracking-[0.3em] text-center mb-3">
            Browse by Medium
          </p>
          <h2 className="font-display text-[26px] md:text-[32px] text-center text-forest mb-10 leading-tight">
            Explore the Shop
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/shop/$category"
                params={{ category: cat.slug }}
                className="group relative rounded-sm overflow-hidden aspect-[4/3]"
              >
                <img
                  src={cat.image_url ?? "/placeholder-artwork.svg"}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                <div className="relative z-10 flex items-end h-full p-5">
                  <span className="font-display text-[18px] md:text-[21px] text-white font-medium">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ALL PRODUCTS (grid appears only here, after context) ═══ */}
      <section id="shop-grid" className="section-padding bg-white">
        <div className="container-main">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="font-display text-[24px] md:text-[28px] text-forest font-medium">All Pieces</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-[38px] px-3 rounded-full border border-border bg-white font-body text-[12px] font-semibold text-stone focus:outline-none focus:border-forest/40"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
              <button
                onClick={() => setShowFilters((s) => !s)}
                className={`h-[38px] px-4 rounded-full border font-body text-[12px] font-semibold transition-colors ${
                  showFilters || oneOfAKindOnly || priceRange.min || priceRange.max
                    ? "bg-forest text-white border-forest"
                    : "bg-white text-stone border-border hover:border-forest/40"
                }`}
              >
                Filters
              </button>
              <ExpandableSearch
                onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); }}
                placeholder="Search the shop…"
                debounceMs={250}
              />
            </div>
          </div>

          {showFilters && (
            <div className="bg-cream rounded-2xl border border-border p-4 mb-6 flex flex-wrap items-end gap-4">
              <div>
                <label className="block font-body text-[10px] font-bold text-stone uppercase tracking-wider mb-1.5">Min Price</label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => { setPriceRange((p) => ({ ...p, min: e.target.value })); setCurrentPage(1); }}
                  placeholder="₹0"
                  className="w-28 h-[38px] px-3 rounded-lg border border-border bg-white font-body text-[13px] text-forest focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block font-body text-[10px] font-bold text-stone uppercase tracking-wider mb-1.5">Max Price</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => { setPriceRange((p) => ({ ...p, max: e.target.value })); setCurrentPage(1); }}
                  placeholder="No limit"
                  className="w-28 h-[38px] px-3 rounded-lg border border-border bg-white font-body text-[13px] text-forest focus:outline-none focus:border-gold"
                />
              </div>
              <label className="flex items-center gap-2 h-[38px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={oneOfAKindOnly}
                  onChange={(e) => { setOneOfAKindOnly(e.target.checked); setCurrentPage(1); }}
                  className="w-4 h-4 accent-forest"
                />
                <span className="font-body text-[13px] text-forest font-medium">One of a Kind only</span>
              </label>
              {(oneOfAKindOnly || priceRange.min || priceRange.max) && (
                <button
                  onClick={() => { setOneOfAKindOnly(false); setPriceRange({ min: "", max: "" }); setCurrentPage(1); }}
                  className="font-body text-[12px] text-stone/60 hover:text-forest underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-1">
            <button
              onClick={() => { setActiveCategory("all"); setCurrentPage(1); }}
              className={`shrink-0 px-4 py-2 rounded-full font-body text-[12px] font-semibold border transition-colors ${
                activeCategory === "all" ? "bg-forest text-white border-forest" : "bg-transparent text-stone border-border hover:border-forest/40"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => { setActiveCategory(cat.slug); setCurrentPage(1); }}
                className={`shrink-0 px-4 py-2 rounded-full font-body text-[12px] font-semibold border transition-colors ${
                  activeCategory === cat.slug ? "bg-forest text-white border-forest" : "bg-transparent text-stone border-border hover:border-forest/40"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {visible.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-display text-[20px] text-forest/30 mb-2">No pieces found</p>
              <p className="font-body text-[13px] text-stone/50">
                {searchQuery ? `No results for "${searchQuery}"` : "New pieces are added regularly — check back soon."}
              </p>
            </div>
          )}

          {filtered.length > PAGE_SIZE && (
            <div className="mt-10">
              <ArtspirePagination
                total={filtered.length}
                pageSize={PAGE_SIZE}
                currentPage={currentPage}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  document.getElementById("shop-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            </div>
          )}
        </div>
      </section>
    </ShopLayout>
  );
}

function ProductCard({ product }: { product: ProductWithCategory }) {
  return (
    <Link
      to="/shop/product/$slug"
      params={{ slug: product.slug }}
      preload="intent"
      className="group block rounded-sm overflow-hidden bg-cream"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image_url ?? "/placeholder-artwork.svg"}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.status === "sold_out" && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-forest/90 text-white font-body text-[10px] font-bold uppercase tracking-wider rounded-sm">
            Sold Out
          </div>
        )}
        {product.is_one_of_a_kind && product.status === "published" && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 text-forest font-body text-[10px] font-bold uppercase tracking-wider rounded-sm">
            One of a Kind
          </div>
        )}
      </div>
      <div className="pt-3">
        <p className="font-display text-[15px] text-forest font-medium leading-snug group-hover:text-gold transition-colors">
          {product.title}
        </p>
        {product.categories?.name && (
          <p className="font-body text-[11px] text-stone/50 mt-0.5">{product.categories.name}</p>
        )}
        <p className="font-body text-[13px] text-forest font-semibold mt-1">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  );
}
