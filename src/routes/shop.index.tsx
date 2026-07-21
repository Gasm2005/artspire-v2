import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getProducts, type ProductWithCategory } from "@/lib/products";
import { getShopCategories, type ShopCategory } from "@/lib/shop-categories";
import { getCollections, type Collection } from "@/lib/collections";
import { getPageSEO } from "@/lib/website-content";
import { SiteChrome } from "@/components/site/SiteChrome";

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
        { title: seo?.title ?? "Shop | The Artspire — Handmade Home Décor & Art" },
        {
          name: "description",
          content:
            seo?.description ??
            "Ready-made handcrafted pieces — clay sculpture, mirror art, paintings, and sketches. Each one made by hand by Himangi Pandey. Ships across India.",
        },
        ...(seo?.ogImage ? [{ property: "og:image", content: seo.ogImage }] : []),
      ],
    };
  },
  component: ShopPage,
});

function ShopPage() {
  const { products, categories } = Route.useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "price_low" | "price_high">("newest");

  const filtered = products
    .filter((p) => {
      const matchCategory = activeCategory === "all" || p.categories?.slug === activeCategory;
      const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price_low") return a.price - b.price;
      if (sortBy === "price_high") return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <SiteChrome>
      <div className="banner">
        <div className="bb"></div>
        <div className="inner">
          <span className="eyebrow">The Collection</span>
          <h1>
            Objects made to be <em>lived with</em>.
          </h1>
          <p>
            Every piece shaped by hand, one at a time — in limited numbers, with no two exactly
            alike.
          </p>
        </div>
      </div>

      <div className="toolbar">
        <div className="wrap row">
          <div className="chips">
            <button
              className={activeCategory === "all" ? "chip active" : "chip"}
              onClick={() => setActiveCategory("all")}
            >
              All Pieces
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={activeCategory === cat.slug ? "chip active" : "chip"}
                onClick={() => setActiveCategory(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="tools-right">
            <span className="count">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </span>
            <input
              className="sort"
              style={{ minWidth: 160 }}
              placeholder="Search pieces…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "price_low" | "price_high")}
            >
              <option value="newest">Sort: Featured</option>
              <option value="price_low">Price: low to high</option>
              <option value="price_high">Price: high to low</option>
            </select>
          </div>
        </div>
      </div>

      <section>
        <div className="wrap">
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <h2
                className="serif"
                style={{ fontSize: 28, color: "var(--forest)", fontWeight: 500 }}
              >
                No pieces match your filter
              </h2>
              <p style={{ color: "var(--stone)", marginTop: 8 }}>
                Try a different category or search.
              </p>
            </div>
          ) : (
            <div className="grid">
              {filtered.slice(0, PAGE_SIZE).map((product, i) => (
                <Link
                  key={product.id}
                  to="/shop/product/$slug"
                  params={{ slug: product.slug }}
                  preload="intent"
                  className={
                    "card rv" +
                    (i % 4 === 1 ? " d1" : i % 4 === 2 ? " d2" : i % 4 === 3 ? " d3" : "")
                  }
                >
                  <div className="imgwrap tilt">
                    {product.status === "sold_out" && <span className="badge sold">Sold out</span>}
                    {product.is_one_of_a_kind && product.status === "published" && (
                      <span className="badge limited">1 of 1</span>
                    )}
                    {product.image_url ? (
                      <div className="frame">
                        <img src={product.image_url} alt={product.title} loading="lazy" />
                      </div>
                    ) : (
                      <div className="frame" data-label="Product photo"></div>
                    )}
                    <div className="quick">
                      {product.status === "sold_out" ? "Notify me" : "Quick view"}
                    </div>
                  </div>
                  {product.categories?.name && <div className="cat">{product.categories.name}</div>}
                  <h3>{product.title}</h3>
                  <div className="price">₹{product.price.toLocaleString("en-IN")}</div>
                  {product.is_one_of_a_kind && <div className="stock">One of a kind</div>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteChrome>
  );
}
