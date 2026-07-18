import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProducts, type ProductWithCategory } from "@/lib/products";
import { getShopCategoryBySlug } from "@/lib/shop-categories";
import { SiteChrome } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/shop/$category")({
  loader: async ({ params }) => {
    const category = await getShopCategoryBySlug(params.category);
    if (!category) throw notFound();
    const products = await getProducts({
      status: "published",
      categoryId: category.id,
      orderBy: "display_order",
      limit: 100,
    }).catch(() => []);
    return { category, products: products as ProductWithCategory[] };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { category } = loaderData;
    return {
      meta: [
        { title: `${category.name} | The Artspire Shop` },
        { name: "description", content: category.short_summary ?? `Handmade ${category.name.toLowerCase()} — ready to ship. Made by Himangi Pandey.` },
      ],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <SiteChrome><section><div className="wrap" style={{ textAlign: "center", padding: "80px 0" }}>
      <h1 className="serif" style={{ fontSize: 40, color: "var(--forest)", fontWeight: 500 }}>Category not found</h1>
      <Link className="btn btn-solid" to="/shop" style={{ marginTop: 20 }}><span>Back to shop</span></Link>
    </div></section></SiteChrome>
  ),
});

function CategoryPage() {
  const { category, products } = Route.useLoaderData();
  return (
    <SiteChrome>
      <div className="banner">
        <div className="bb"></div>
        <div className="inner">
          <span className="eyebrow">The Collection</span>
          <h1>{category.name}</h1>
          {category.short_summary && <p>{category.short_summary}</p>}
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="wrap crumbs" style={{ paddingLeft: 0 }}><Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{category.name}</span></div>
          {products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--stone)" }}>No pieces in this category yet.</div>
          ) : (
            <div className="grid">
              {products.map((p, i) => (
                <Link key={p.id} to="/shop/product/$slug" params={{ slug: p.slug }} preload="intent" className={"card rv" + (i % 4 === 1 ? " d1" : i % 4 === 2 ? " d2" : i % 4 === 3 ? " d3" : "")}>
                  <div className="imgwrap tilt">
                    {p.status === "sold_out" && <span className="badge sold">Sold out</span>}
                    {p.is_one_of_a_kind && p.status === "published" && <span className="badge limited">1 of 1</span>}
                    {p.image_url ? <div className="frame"><img src={p.image_url} alt={p.title} loading="lazy" /></div> : <div className="frame" data-label="Product photo"></div>}
                    <div className="quick">{p.status === "sold_out" ? "Notify me" : "Quick view"}</div>
                  </div>
                  <h3>{p.title}</h3>
                  <div className="price">₹{p.price.toLocaleString("en-IN")}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteChrome>
  );
}
