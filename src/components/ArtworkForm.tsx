import { useState, useEffect, useCallback } from "react";
import {
  createArtwork,
  updateArtwork,
  uploadArtworkImage,
  setArtworkTags,
  getAllArtworkTags,
  getCategories,
  getTags,
  generateSlug,
  type ArtworkWithCategory,
  type ArtworkStatus,
  type ArtworkType,
  type Category,
  type Tag,
} from "@/lib";
import { ImageUploader } from "./ImageUploader";
import { Loader2, Save, Rocket } from "lucide-react";

interface ArtworkFormProps {
  artwork?: ArtworkWithCategory | null;
  onSuccess: () => void;
}

export function ArtworkForm({ artwork, onSuccess }: ArtworkFormProps) {
  const isEdit = !!artwork;

  const [form, setForm] = useState({
    title: artwork?.title ?? "",
    slug: artwork?.slug ?? "",
    summary: artwork?.summary ?? "",
    story_content: artwork?.story_content ?? "",
    ai_summary: artwork?.ai_summary ?? "",
    category_id: artwork?.category_id ?? "",
    artwork_type: (artwork?.artwork_type ?? "physical") as ArtworkType,
    image_alt: artwork?.image_alt ?? "",
    featured: artwork?.featured ?? false,
    show_on_homepage: artwork?.show_on_homepage ?? false,
    status: (artwork?.status ?? "draft") as ArtworkStatus,
    price: artwork?.price?.toString() ?? "",
    currency: artwork?.currency ?? "INR",
    medium: artwork?.medium ?? "",
    size: artwork?.size ?? "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manualSlug, setManualSlug] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Load categories and tags
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
    getTags().then(setAllTags).catch(console.error);
  }, []);

  // Load existing tags for edit mode
  useEffect(() => {
    if (artwork) {
      getAllArtworkTags(artwork.id)
        .then((ids) => setSelectedTags(ids))
        .catch(console.error);
    }
  }, [artwork]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!manualSlug && form.title && !isEdit) {
      setForm((prev) => ({ ...prev, slug: generateSlug(form.title) }));
    }
  }, [form.title, manualSlug, isEdit]);

  const updateField = useCallback(<K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  async function handleSubmit(action: "draft" | "publish") {
    setSaving(true);

    try {
      // Upload image if selected
      let imageUrl = artwork?.image_url ?? null;
      if (selectedFile) {
        const slug = form.slug || generateSlug(form.title);
        const result = await uploadArtworkImage(selectedFile, slug);
        imageUrl = result.publicUrl;
      }

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        summary: form.summary.trim() || null,
        story_content: form.story_content.trim() || null,
        ai_summary: form.ai_summary.trim() || null,
        category_id: form.category_id || null,
        artwork_type: form.artwork_type,
        image_url: imageUrl,
        image_alt: form.image_alt.trim() || null,
        featured: form.featured,
        show_on_homepage: form.show_on_homepage,
        status: (action === "publish" ? "published" : "draft") as ArtworkStatus,
        price: form.price ? parseFloat(form.price) : null,
        currency: form.currency || null,
        medium: form.medium.trim() || null,
        size: form.size.trim() || null,
      };

      let artworkId: string;

      if (isEdit && artwork) {
        await updateArtwork(artwork.id, payload);
        artworkId = artwork.id;
      } else {
        const created = await createArtwork(payload);
        artworkId = created.id;
      }

      // Set tags
      await setArtworkTags(artworkId, selectedTags);

      onSuccess();
    } catch (err) {
      console.error("Form submit error:", err);
      alert(err instanceof Error ? err.message : "Failed to save artwork");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full h-[44px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors";
  const textareaClass = "w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors resize-y min-h-[120px]";
  const labelClass = "block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5";

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6"
    >
      {/* Two-column layout for desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Artwork title"
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
              required
              value={form.slug}
              onChange={(e) => {
                setManualSlug(true);
                updateField("slug", e.target.value);
              }}
              placeholder="artwork-slug"
              className={inputClass}
            />
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <select
              value={form.category_id}
              onChange={(e) => updateField("category_id", e.target.value)}
              className={inputClass}
            >
              <option value="">— Select category —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Artwork Type */}
          <div>
            <label className={labelClass}>Artwork Type</label>
            <select
              value={form.artwork_type}
              onChange={(e) => updateField("artwork_type", e.target.value as ArtworkType)}
              className={inputClass}
            >
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
              <option value="commission">Commission</option>
            </select>
          </div>

          {/* Medium */}
          <div>
            <label className={labelClass}>Medium</label>
            <input
              type="text"
              value={form.medium}
              onChange={(e) => updateField("medium", e.target.value)}
              placeholder="e.g. Pencil, Acrylic, Clay"
              className={inputClass}
            />
          </div>

          {/* Size */}
          <div>
            <label className={labelClass}>Size</label>
            <input
              type="text"
              value={form.size}
              onChange={(e) => updateField("size", e.target.value)}
              placeholder="e.g. 12x16 inches"
              className={inputClass}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Image */}
          <ImageUploader
            existingUrl={artwork?.image_url}
            onFileSelect={setSelectedFile}
            alt={form.image_alt}
            onAltChange={(alt) => updateField("image_alt", alt)}
          />

          {/* Price */}
          <div>
            <label className={labelClass}>Price</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="0"
                className={`${inputClass} flex-1`}
              />
              <select
                value={form.currency}
                onChange={(e) => updateField("currency", e.target.value)}
                className={`${inputClass} w-24`}
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>Tags</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <label
                  key={tag.id}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-[11px] font-semibold cursor-pointer transition-colors ${
                    selectedTags.includes(tag.id)
                      ? "bg-forest text-white"
                      : "bg-forest/5 text-forest hover:bg-forest/10"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={(e) => {
                      setSelectedTags((prev) =>
                        e.target.checked
                          ? [...prev, tag.id]
                          : prev.filter((id) => id !== tag.id)
                      );
                    }}
                    className="hidden"
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
                className="rounded border-border w-4 h-4"
              />
              <span className="font-body text-[13px] text-forest">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.show_on_homepage}
                onChange={(e) => updateField("show_on_homepage", e.target.checked)}
                className="rounded border-border w-4 h-4"
              />
              <span className="font-body text-[13px] text-forest">Show on Homepage</span>
            </label>
          </div>
        </div>
      </div>

      {/* Full-width text fields */}
      <div className="space-y-5">
        <div>
          <label className={labelClass}>Summary</label>
          <textarea
            value={form.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            placeholder="Short description of the artwork (shown in listings)"
            rows={3}
            className={textareaClass}
          />
        </div>

        <div>
          <label className={labelClass}>Story Content</label>
          <textarea
            value={form.story_content}
            onChange={(e) => updateField("story_content", e.target.value)}
            placeholder="The full story behind this artwork. You can use plain text or HTML."
            rows={8}
            className={textareaClass}
          />
          <p className="font-body text-[11px] text-stone/60 mt-1">
            Plain text for now. Rich editor will be added in a future update.
          </p>
        </div>

        <div>
          <label className={labelClass}>AI Summary</label>
          <textarea
            value={form.ai_summary}
            onChange={(e) => updateField("ai_summary", e.target.value)}
            placeholder="Auto-generated or manually written AI summary"
            rows={3}
            className={textareaClass}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
        <button
          type="button"
          disabled={saving || !form.title.trim() || !form.slug.trim()}
          onClick={() => handleSubmit("draft")}
          className="inline-flex items-center gap-2 h-[48px] px-6 border-2 border-forest text-forest font-body font-bold text-[13px] rounded-xl btn-secondary transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Draft
        </button>
        <button
          type="button"
          disabled={saving || !form.title.trim() || !form.slug.trim()}
          onClick={() => handleSubmit("publish")}
          className="inline-flex items-center gap-2 h-[48px] px-6 bg-forest text-white font-body font-bold text-[13px] rounded-xl btn-primary transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
          Publish
        </button>
      </div>
    </form>
  );
}
