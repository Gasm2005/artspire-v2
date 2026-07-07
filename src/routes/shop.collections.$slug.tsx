import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { getCollectionBySlug, getProductsInCollection } from "@/lib/collections";
import { ArtspireBreadcrumb } from "@/components/ArtspireBreadcrumb";
import type { ProductWithCategory } from "@/lib/products";

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
        { title: `${collection.title} | Artspire Shop` },
        { name: "description", content: collection.description ?? `A curated collection from Artspire — ${collection.title}.` },
      ],
    };
  },
  component: CollectionPage,
  notFoundComponent: () => (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-[48px] text-forest">404</h1>
          <p className="font-body text-stone mt-2">Collection not found</p>
        </div>
      </div>
    </Layout>
  ),
});

function CollectionPage() {
  const { collection, products } = Route.useLoaderData();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex flex-col justify-center items-center text-center px-6 py-16">
        {collection.hero_image_url && (
          <>
            <img
              src={collection.hero_image_url}
              alt={collection.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-black/45" />
          </>
        )}
        <div className={`relative z-10 ${collection.hero_image_url ? "text-white" : "text-forest"}`}>
          <div className="flex justify-center mb-4">
            <ArtspireBreadcrumb
              crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: collection.title }]}
              className={collection.hero_image_url ? "[&_*]:text-white/80" : ""}
            />
          </div>
          <h1 className="font-display text-[30px] md:text-[44px] font-medium mb-3">{collection.title}</h1>
          {collection.description && (
            <p className="font-body text-[14px] md:text-[16px] max-w-lg mx-auto opacity-90">{collection.description}</p>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="section-padding bg-white">
        <div className="container-main">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to="/shop/product/$slug"
                  params={{ slug: product.slug }}
                  preload="intent"
                  className="group block rounded-sm overflow-hidden bg-cream"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image_url ?? "/placeholder-artwork.jpg"}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="pt-3">
                    <p className="font-display text-[15px] text-forest font-medium leading-snug group-hover:text-gold transition-colors">
                      {product.title}
                    </p>
                    <p className="font-body text-[13px] text-forest font-semibold mt-1">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-display text-[20px] text-forest/30">This collection is being prepared.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
