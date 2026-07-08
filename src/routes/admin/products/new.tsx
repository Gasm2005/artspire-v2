import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProductPage,
});

function NewProductPage() {
  const router = useRouter();

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
          <h1 className="font-display text-[24px] text-forest font-medium">New Product</h1>
          <p className="font-body text-[13px] text-stone mt-0.5">Add a new piece to the Shop</p>
        </div>
      </div>
      <ProductForm />
    </div>
  );
}
