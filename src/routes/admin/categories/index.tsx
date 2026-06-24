import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getCategories, type Category } from "@/lib";
import { FolderOpen, Edit, Image, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/categories/")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">Categories</h1>
        <p className="font-body text-[13px] text-stone mt-0.5">
          Manage categories with visual artwork and overlay settings
        </p>
      </div>

      {loading ? (
        <div className="font-body text-stone text-[13px]">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-8 text-center">
          <FolderOpen size={40} className="mx-auto text-stone/30 mb-3" />
          <p className="font-body text-stone text-[14px]">No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const hasArtworkImage = !!category.card_artwork_image_id;
  const hasOverlay = !!category.card_overlay_id;

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Visual preview */}
      <div className="aspect-[4/3] relative overflow-hidden bg-forest/5">
        {hasArtworkImage ? (
          <div className="w-full h-full relative">
            {/* Layer 1: Artwork image */}
            <img
              src={category.image_url ?? "/placeholder-category.jpg"}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Layer 2: Overlay */}
            {hasOverlay && (
              <div
                className="absolute inset-0"
                style={{ opacity: (category.card_overlay_opacity ?? 25) / 100 }}
              />
            )}
            {/* Layer 3: Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            {/* Layer 4: Text */}
            <div className="absolute bottom-4 left-4 z-10">
              <span className="font-display text-[18px] text-white font-medium drop-shadow-lg">
                {category.name}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone/40 gap-2">
            <AlertTriangle size={24} />
            <span className="font-body text-[12px] font-medium">No artwork image set</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-body text-[14px] font-semibold text-forest">{category.name}</h3>
            <p className="font-body text-[11px] text-stone/60 mt-0.5">{category.slug}</p>
          </div>
          <a
            href={`/admin/categories/edit/${category.id}`}
            className="p-2 rounded-lg hover:bg-forest/5 text-stone hover:text-forest transition-colors"
            title="Edit category"
          >
            <Edit size={16} />
          </a>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <StatusBadge active={hasArtworkImage} label="Artwork" />
          <StatusBadge active={hasOverlay} label="Overlay" />
          <StatusBadge active={!!category.banner_artwork_image_id} label="Banner" />
        </div>

        {!hasArtworkImage && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-200">
            <p className="font-body text-[11px] text-red-700 font-medium">
              <AlertTriangle size={12} className="inline mr-1" />
              Category requires a real artwork image. Decorative-only cards are not allowed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-body text-[10px] font-bold uppercase tracking-wider ${
        active ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone/60"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-stone/30"}`} />
      {label}
    </span>
  );
}
