import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getProducts,
  publishProduct,
  unpublishProduct,
  markSoldOut,
  softDeleteProduct,
  type ProductWithCategory,
  type ProductStatus,
} from "@/lib/products";
import { Plus, Edit, Trash2, Eye, EyeOff, PackageX, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

export const Route = createFileRoute("/admin/products/")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | ProductStatus>("all");

  async function load() {
    setLoading(true);
    try {
      const data = await getProducts({ limit: 500, orderBy: "created_at", ascending: false });
      setProducts(data);
    } catch (err) {
      console.error("Load products error:", err);
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = products.filter((p) => filter === "all" || p.status === filter);

  async function handlePublish(id: string) {
    setActionId(id);
    try {
      await publishProduct(id);
      toast.success("Product published!");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish.");
    } finally {
      setActionId(null);
    }
  }

  async function handleUnpublish(id: string) {
    setActionId(id);
    try {
      await unpublishProduct(id);
      toast.success("Moved back to draft.");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update.");
    } finally {
      setActionId(null);
    }
  }

  async function handleSoldOut(id: string) {
    setActionId(id);
    try {
      await markSoldOut(id);
      toast.success("Marked as sold out.");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update.");
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product permanently? This cannot be undone.")) return;
    setActionId(id);
    try {
      await softDeleteProduct(id);
      toast.success("Product deleted.");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete.");
    } finally {
      setActionId(null);
    }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      published: "bg-green-50 text-green-700",
      draft: "bg-amber-50 text-amber-700",
      sold_out: "bg-red-50 text-red-600",
      archived: "bg-stone-100 text-stone-500",
    };
    return map[status] || "bg-gray-50 text-gray-600";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">
            Shop Products
          </h1>
          <p className="font-body text-[13px] text-stone mt-0.5">
            Manage ready-made pieces available in the Shop
          </p>
        </div>
        <a
          href="/admin/products/new"
          className="inline-flex items-center gap-2 h-[44px] px-5 bg-forest text-white font-body font-bold text-[13px] rounded-xl btn-primary transition-colors"
        >
          <Plus size={16} />
          New Product
        </a>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {(["all", "published", "draft", "sold_out", "archived"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-3 py-1.5 rounded-lg font-body text-[12px] font-semibold transition-colors ${
              filter === f
                ? "bg-forest text-white"
                : "bg-white border border-border text-stone hover:border-forest/40"
            }`}
          >
            {f === "all"
              ? "All"
              : f === "sold_out"
                ? "Sold Out"
                : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="font-body text-stone text-[13px]">Loading products…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-8 text-center">
          <p className="font-body text-stone text-[14px]">No products found.</p>
          <a
            href="/admin/products/new"
            className="inline-flex items-center gap-2 h-[40px] px-4 mt-4 bg-forest text-white font-body font-semibold text-[12px] rounded-xl btn-primary"
          >
            <Plus size={14} />
            Add your first product
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 font-body text-[10px] font-bold text-stone uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 font-body text-[10px] font-bold text-stone uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 font-body text-[10px] font-bold text-stone uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 font-body text-[10px] font-bold text-stone uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 font-body text-[10px] font-bold text-stone uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border last:border-b-0 hover:bg-cream/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-forest/5 overflow-hidden shrink-0">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone/30 text-[10px]">
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-body text-[13px] font-semibold text-forest">
                            {product.title}
                          </div>
                          <div className="font-body text-[11px] text-stone/60">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-body text-[12px] text-stone">
                        {product.categories?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-body text-[12px] font-semibold text-forest">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-body text-[10px] font-bold uppercase tracking-wider ${statusBadge(product.status)}`}
                      >
                        {product.status === "sold_out" ? "Sold Out" : product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {actionId === product.id ? (
                          <Loader2 size={16} className="animate-spin text-stone" />
                        ) : (
                          <>
                            {product.status === "draft" && (
                              <button
                                onClick={() => handlePublish(product.id)}
                                title="Publish"
                                className="p-2 rounded-lg hover:bg-green-50 text-stone hover:text-green-600 transition-colors"
                              >
                                <Eye size={14} />
                              </button>
                            )}
                            {product.status === "published" && (
                              <>
                                <button
                                  onClick={() => handleUnpublish(product.id)}
                                  title="Unpublish"
                                  className="p-2 rounded-lg hover:bg-amber-50 text-stone hover:text-amber-600 transition-colors"
                                >
                                  <EyeOff size={14} />
                                </button>
                                <button
                                  onClick={() => handleSoldOut(product.id)}
                                  title="Mark sold out"
                                  className="p-2 rounded-lg hover:bg-red-50 text-stone hover:text-red-600 transition-colors"
                                >
                                  <PackageX size={14} />
                                </button>
                              </>
                            )}
                            <a
                              href={`/admin/products/edit/${product.id}`}
                              title="Edit"
                              className="p-2 rounded-lg hover:bg-forest/5 text-stone hover:text-forest transition-colors"
                            >
                              <Edit size={14} />
                            </a>
                            <button
                              onClick={() => handleDelete(product.id)}
                              title="Delete"
                              className="p-2 rounded-lg hover:bg-red-50 text-stone hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
