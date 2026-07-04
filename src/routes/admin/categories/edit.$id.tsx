import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getCategoryById, updateCategory } from "@/lib/categories";
import { uploadMediaFile } from "@/lib/media-library";
import { ArrowLeft, Upload, Loader2, Save, X } from "lucide-react";
import { toast } from "@/lib/toast";

export const Route = createFileRoute("/admin/categories/edit/$id")({
  component: EditCategoryPage,
});

function EditCategoryPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    image_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categoryImageId, setCategoryImageId] = useState<string | null>(null);

  useEffect(() => {
    getCategoryById(id)
      .then((cat) => {
        if (!cat) return;
        setForm({
          name: cat.name ?? "",
          tagline: (cat as any).short_summary ?? "",
          image_url: (cat as any).image_url ?? "",
        });
        setImagePreview((cat as any).image_url ?? null);
        setCategoryImageId((cat as any).card_artwork_image_id ?? null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setSaving(true);
    try {
      let newImageId = categoryImageId;
      let newImageUrl = form.image_url;

      // Upload new image if selected
      if (imageFile) {
        const { mediaItem, publicUrl } = await uploadMediaFile(imageFile, {
          folder: "categories",
          altText: form.name,
        });
        newImageId = mediaItem.id;
        newImageUrl = publicUrl;
      }

      await updateCategory(id, {
        name: form.name.trim(),
        short_summary: form.tagline.trim() || null,
        card_artwork_image_id: newImageId,
      } as any);

      toast.success("Category saved!", "Changes are now live on the website.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save.", "Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full h-[44px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block font-body text-[11px] font-bold text-stone uppercase tracking-wider mb-1.5";

  if (loading) {
    return <p className="font-body text-stone text-[13px] p-6">Loading…</p>;
  }

  return (
    <div className="max-w-lg space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.navigate({ to: "/admin/categories" })}
          className="p-2 rounded-lg hover:bg-forest/5 text-stone hover:text-forest transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-[22px] text-forest font-medium">Edit Category</h1>
          <p className="font-body text-[12px] text-stone">{form.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-5 space-y-5 shadow-sm">
        {/* Image */}
        <div>
          <label className={labelClass}>Category Image</label>
          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-border">
              <img src={imagePreview} alt="Preview" className="w-full h-[200px] object-cover" />
              <button
                onClick={() => { setImagePreview(null); setImageFile(null); }}
                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow hover:bg-white transition-colors"
              >
                <X size={14} className="text-stone" />
              </button>
              <label className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-lg font-body text-[11px] font-semibold text-forest cursor-pointer hover:bg-white transition-colors shadow">
                <Upload size={12} />
                Change
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-[160px] rounded-xl border-2 border-dashed border-border bg-cream hover:border-gold transition-colors cursor-pointer">
              <Upload size={24} className="text-stone/40 mb-2" />
              <span className="font-body text-[13px] text-stone/60">Click to upload image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
          <p className="font-body text-[11px] text-stone/50 mt-1.5">
            This image shows on the homepage category card. Use a clear photo of actual artwork.
          </p>
        </div>

        {/* Name */}
        <div>
          <label className={labelClass}>Category Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Pencil Sketches"
            className={inputClass}
          />
        </div>

        {/* Tagline */}
        <div>
          <label className={labelClass}>Tagline <span className="normal-case font-normal">(shown under name on homepage)</span></label>
          <input
            type="text"
            value={form.tagline}
            onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
            placeholder="e.g. Timeless. Precise."
            className={inputClass}
          />
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 h-[44px] px-6 bg-forest text-white font-body font-bold text-[13px] rounded-xl hover:bg-forest/90 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving…" : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
}
