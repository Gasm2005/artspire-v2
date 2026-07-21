import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCollectionBySlug, getProductsInCollection } from "@/lib/collections";
import type { ProductWithCategory } from "@/lib/products";
import { SiteChrome } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/shop/collections/$slug")({
  loader: async ({ params }) => {
    const collection = await getCollectionBySlug(params.slug);
    if (!collection) throw notFound();
    const products = await getProductsInCollection(collection.id).catch(() => []);
    return { collection, products: products as ProductWithCategory[] };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { collection } = loaderData;
    return {
      meta: [
        { title: `${collection.title} | The Artspire` },
        {
          name: "description",
          content:
            collection.description ??
            `A curated collection from The Artspire — ${collection.title}.`,
        },
      ],
    };
  },
  component: CollectionPage,
  notFoundComponent: () => (
    <SiteChrome>
      <section>
        <div className="wrap" style={{ textAlign: "center", padding: "80px 0" }}>
          <h1 className="serif" style={{ fontSize: 40, color: "var(--forest)", fontWeight: 500 }}>
            Collection not found
          </h1>
          <Link className="btn btn-solid" to="/shop" style={{ marginTop: 20 }}>
            <span>Back to shop</span>
          </Link>
        </div>
      </section>
    </SiteChrome>
  ),
});

function CollectionPage() {
  const { collection, products } = Route.useLoaderData();
  return (
    <SiteChrome>
      <div className="banner">
        <div className="bb"></div>
        <div className="inner">
          <span className="eyebrow">Collection</span>
          <h1>{collection.title}</h1>
          {collection.description && <p>{collection.description}</p>}
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="wrap crumbs" style={{ paddingLeft: 0 }}>
            <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> /{" "}
            <span>{collection.title}</span>
          </div>
          {products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--stone)" }}>
              No pieces in this collection yet.
            </div>
          ) : (
            <div className="grid">
              {products.map((p, i) => (
                <Link
                  key={p.id}
                  to="/shop/product/$slug"
                  params={{ slug: p.slug }}
                  preload="intent"
                  className={
                    "card rv" +
                    (i % 4 === 1 ? " d1" : i % 4 === 2 ? " d2" : i % 4 === 3 ? " d3" : "")
                  }
                >
                  <div className="imgwrap tilt">
                    {p.is_one_of_a_kind && p.status === "published" && (
                      <span className="badge limited">1 of 1</span>
                    )}
                    {p.image_url ? (
                      <div className="frame">
                        <img src={p.image_url} alt={p.title} loading="lazy" />
                      </div>
                    ) : (
                      <div className="frame" data-label="Product photo"></div>
                    )}
                    <div className="quick">Quick view</div>
                  </div>
                  {p.categories?.name && <div className="cat">{p.categories.name}</div>}
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
