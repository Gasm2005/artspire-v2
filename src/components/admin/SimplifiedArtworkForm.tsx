import { useState, useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { uploadMediaFile } from "@/lib/media-library";
import { createArtwork, generateSlug, ensureUniqueSlug, type ArtworkStatus } from "@/lib/artworks";
import { getCategories, type Category } from "@/lib/categories";
import { Image, X, Loader2, Rocket } from "lucide-react";

const SIZE_OPTIONS = [
  { value: "A5", label: "A5 (148 × 210 mm)" },
  { value: "A4", label: "A4 (210 × 297 mm)" },
  { value: "A3", label: "A3 (297 × 420 mm)" },
  { value: "A2", label: "A2 (420 × 594 mm)" },
  { value: "A1", label: "A1 (594 × 841 mm)" },
  { value: "Custom", label: "Custom Size" },
];

interface SimplifiedArtworkFormProps {
  onSuccess?: () => void;
}

export function SimplifiedArtworkForm({ onSuccess }: SimplifiedArtworkFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category_id: "",
    size: "",
    short_description: "",
    story: "",
    meta_title: "",
    meta_description: "",
    h1: "",
    h2: "",
    h3: "",
  });

  const [manualSlug, setManualSlug] = useState(false);

  // Load categories
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (!manualSlug && form.title) {
      setForm((f) => ({ ...f, slug: generateSlug(form.title) }));
    }
  }, [form.title, manualSlug]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function handlePublish() {
    if (!imageFile) {
      alert("Please select an artwork image.");
      return;
    }
    if (!form.title.trim()) {
      alert("Please enter the artwork name.");
      return;
    }
    if (!form.category_id) {
      alert("Please select a category.");
      return;
    }
    if (!form.size) {
      alert("Please select a size.");
      return;
    }
    if (!form.short_description.trim()) {
      alert("Please enter a short description.");
      return;
    }
    if (!form.story.trim()) {
      alert("Please enter the story.");
      return;
    }

    setSaving(true);
    try {
      // 1. Upload image to media library
      const { mediaItem, publicUrl } = await uploadMediaFile(imageFile, {
        folder: "artworks",
        altText: form.title,
      });

      // 2. Save artwork — ensure slug is unique before insert
      const uniqueSlug = manualSlug
        ? form.slug.trim()
        : await ensureUniqueSlug(form.title);

      const artwork = await createArtwork({
        title: form.title.trim(),
        slug: uniqueSlug,
        status: "published" as ArtworkStatus,
        summary: form.short_description.trim() || null,
        short_description: form.short_description.trim() || null,
        story_content: form.story.trim() || null,
        image_url: publicUrl,
        alt_text: form.title.trim() || null,
        image_alt: form.title.trim() || null,
        category_id: form.category_id || null,
        dimensions: form.size || null,
        medium: null,
        artwork_type: "original",
        featured: false,
        show_on_homepage: false,
        display_order: 0,
        price: null,
        currency: "INR",
        meta_title: form.meta_title.trim() || null,
        meta_description: form.meta_description.trim() || null,
        h1_heading: form.h1.trim() || null,
        h2_heading: form.h2.trim() || null,
        h3_heading: form.h3.trim() || null,
        main_image_id: mediaItem.id,
      } as any);

      // 3. Auto-create artwork detail page (already exists as /artwork/$slug route)
      // 4. Auto-add to portfolio (published status makes it appear)
      // Already done by setting status = 'published'

      onSuccess?.();
      router.navigate({ to: "/admin/artworks" });
    } catch (err) {
      console.error("Publish error:", err);
      alert(err instanceof Error ? err.message : "Failed to publish artwork");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full h-[44px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors";
  const textareaClass = "w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors resize-y min-h-[120px]";
  const labelClass = "block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6">
      {/* Artwork Image */}
      <div>
        <label className={labelClass}>Artwork Image *</label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border border-border bg-white">
            <img src={imagePreview} alt="Preview" className="w-full h-[240px] object-cover" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
            >
              <X size={16} className="text-stone" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-[180px] rounded-xl border-2 border-dashed border-border bg-white hover:border-gold transition-colors cursor-pointer">
            <Image size={28} className="text-stone/40 mb-2" />
            <span className="font-body text-[13px] text-stone/60">Click to upload artwork image</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        )}
      </div>

      {/* Name */}
      <div>
        <label className={labelClass}>Name *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="e.g. Couple Pencil Sketch"
          className={inputClass}
        />
      </div>

      {/* Slug */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={labelClass}>Slug *</label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={manualSlug}
              onChange={(e) => setManualSlug(e.target.checked)}
              className="rounded border-border"
            />
            <span className="font-body text-[11px] text-stone">Manual override</span>
          </label>
        </div>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => { setManualSlug(true); updateField("slug", e.target.value); }}
          placeholder="couple-pencil-sketch"
          className={inputClass}
        />
      </div>

      {/* Category */}
      <div>
        <label className={labelClass}>Category *</label>
        <select
          value={form.category_id}
          onChange={(e) => updateField("category_id", e.target.value)}
          className={inputClass}
        >
          <option value="">— Select category —</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Size */}
      <div>
        <label className={labelClass}>Size *</label>
        <select
          value={form.size}
          onChange={(e) => updateField("size", e.target.value)}
          className={inputClass}
        >
          <option value="">— Select size —</option>
          {SIZE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Short Description */}
      <div>
        <label className={labelClass}>Short Description *</label>
        <textarea
          value={form.short_description}
          onChange={(e) => updateField("short_description", e.target.value)}
          placeholder="A brief description of the artwork (shown in listings and cards)"
          rows={3}
          className={textareaClass}
        />
      </div>

      {/* Story */}
      <div>
        <label className={labelClass}>Story *</label>
        <textarea
          value={form.story}
          onChange={(e) => updateField("story", e.target.value)}
          placeholder="The full story behind this artwork. What inspired it, how it was created, and what makes it special."
          rows={6}
          className={textareaClass}
        />
      </div>

      {/* SEO Section */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
        <h3 className="font-display text-[16px] text-forest font-medium mb-4">SEO & Headings</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Meta Title</label>
            <input
              type="text"
              value={form.meta_title}
              onChange={(e) => updateField("meta_title", e.target.value)}
              placeholder="SEO title for search engines"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Meta Description</label>
            <textarea
              value={form.meta_description}
              onChange={(e) => updateField("meta_description", e.target.value)}
              placeholder="SEO description for search results"
              rows={2}
              className={textareaClass}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>H1 Heading</label>
              <input
                type="text"
                value={form.h1}
                onChange={(e) => updateField("h1", e.target.value)}
                placeholder="Main page heading"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>H2 Heading</label>
              <input
                type="text"
                value={form.h2}
                onChange={(e) => updateField("h2", e.target.value)}
                placeholder="Sub heading"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>H3 Heading</label>
              <input
                type="text"
                value={form.h3}
                onChange={(e) => updateField("h3", e.target.value)}
                placeholder="Sub-sub heading"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Publish Button */}
      <div className="pt-4 border-t border-border">
        <button
          type="button"
          disabled={saving}
          onClick={handlePublish}
          className="inline-flex items-center gap-2 h-[52px] px-8 bg-forest text-white font-body font-bold text-[14px] rounded-xl btn-primary transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Rocket size={18} />}
          {saving ? "Publishing…" : "Publish Artwork"}
        </button>
      </div>
    </div>
  );
}
