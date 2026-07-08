import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getProductById, type ProductWithCategory } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/products/edit/$id")({
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductWithCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.navigate({ to: "/admin/products" })}
          className="p-2 rounded-lg hover:bg-forest/5 text-stone hover:text-forest transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-[24px] text-forest font-medium">Edit Product</h1>
          <p className="font-body text-[13px] text-stone mt-0.5">{product?.title ?? ""}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 font-body text-stone text-[13px]">
          <Loader2 size={16} className="animate-spin" /> Loading product…
        </div>
      ) : product ? (
        <ProductForm product={product} />
      ) : (
        <p className="font-body text-red-600 text-[13px]">Product not found.</p>
      )}
    </div>
  );
}
