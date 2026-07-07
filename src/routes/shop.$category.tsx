import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { getProducts, type ProductWithCategory } from "@/lib/products";
import { getCategoryBySlug } from "@/lib/categories";
import { ArtspireBreadcrumb } from "@/components/ArtspireBreadcrumb";
import { ArtspirePagination } from "@/components/ArtspirePagination";

const PAGE_SIZE = 12;

export const Route = createFileRoute("/shop/$category")({
  loader: async ({ params }) => {
    const category = await getCategoryBySlug(params.category);
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
        { title: `${category.name} | Artspire Shop` },
        { name: "description", content: category.short_summary ?? `Handmade ${category.name.toLowerCase()} — ready to ship. Made by Himangi Pandey.` },
      ],
    };
  },
  component: ShopCategoryPage,
  notFoundComponent: () => (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-[48px] text-forest">404</h1>
          <p className="font-body text-stone mt-2">Category not found</p>
        </div>
      </div>
    </Layout>
  ),
});

function ShopCategoryPage() {
  const { category, products } = Route.useLoaderData();
  const [currentPage, setCurrentPage] = useState(1);

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const visible = products.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <Layout>
      <section className="section-padding bg-cream text-center">
        <div className="container-main">
          <div className="flex justify-center mb-4">
            <ArtspireBreadcrumb
              crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: category.name }]}
            />
          </div>
          <h1 className="font-display text-[30px] md:text-[40px] text-forest font-medium mb-3">{category.name}</h1>
          {category.short_summary && (
            <p className="font-body text-[14px] md:text-[15px] text-stone max-w-lg mx-auto">{category.short_summary}</p>
          )}
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          {visible.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {visible.map((product) => (
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
                    {product.status === "sold_out" && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-forest/90 text-white font-body text-[10px] font-bold uppercase tracking-wider rounded-sm">
                        Sold Out
                      </div>
                    )}
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
              <p className="font-display text-[20px] text-forest/30 mb-2">No pieces here yet</p>
              <p className="font-body text-[13px] text-stone/50">Check back soon, or explore other categories.</p>
              <Link to="/shop" className="inline-block mt-4 font-body text-[13px] font-semibold text-forest border-b border-forest/30 hover:border-forest transition-colors">
                Browse the full shop →
              </Link>
            </div>
          )}

          {products.length > PAGE_SIZE && (
            <div className="mt-10">
              <ArtspirePagination
                total={products.length}
                pageSize={PAGE_SIZE}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
