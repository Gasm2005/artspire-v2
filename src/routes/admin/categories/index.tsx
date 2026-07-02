import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getCategories, type CategoryWithVisuals } from "@/lib";
import { Edit, ImageOff } from "lucide-react";

export const Route = createFileRoute("/admin/categories/")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithVisuals[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data as CategoryWithVisuals[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">Categories</h1>
        <p className="font-body text-[13px] text-stone mt-0.5">Edit category name, tagline, and image</p>
      </div>

      {loading ? (
        <p className="font-body text-stone text-[13px]">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="aspect-[4/3] relative bg-cream overflow-hidden">
                {cat.image_url ? (
                  <>
                    <img src={cat.image_url} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-4 font-display text-[17px] text-white font-medium drop-shadow">
                      {cat.name}
                    </span>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone/30 gap-2">
                    <ImageOff size={28} />
                    <span className="font-body text-[12px]">No image — click Edit to add one</span>
                  </div>
                )}
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-body text-[13px] font-semibold text-forest">{cat.name}</p>
                  <p className="font-body text-[11px] text-stone/50">{cat.slug}</p>
                </div>
                <a
                  href={`/admin/categories/edit/${cat.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest text-white font-body text-[12px] font-semibold hover:bg-forest/90 transition-colors"
                >
                  <Edit size={13} />
                  Edit
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
