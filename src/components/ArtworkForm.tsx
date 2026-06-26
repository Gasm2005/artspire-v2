import { useState, useEffect, useCallback } from "react";
import {
  createArtwork,
  updateArtwork,
  setArtworkTags,
  getAllArtworkTags,
  getCategories,
  getTags,
  getArtworkWithImages,
  setArtworkGalleryImages,
  setArtworkProcessImages,
  generateSlug,
  type ArtworkWithCategory,
  type ArtworkStatus,
  type ArtworkType,
  type Category,
  type Tag,
} from "@/lib";
import { MultiImageUploader } from "@/components/admin/MultiImageUploader";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Loader2, Save, Rocket, Image, X } from "lucide-react";

interface ArtworkFormProps {
  artwork?: ArtworkWithCategory | null;
  onSuccess: () => void;
}

interface ImageRef {
  mediaId: string;
  publicUrl: string;
}

export function ArtworkForm({ artwork, onSuccess }: ArtworkFormProps) {
  const isEdit = !!artwork;

  const [form, setForm] = useState({
    title: artwork?.title ?? "",
    slug: artwork?.slug ?? "",
    summary: artwork?.summary ?? "",
    short_description: (artwork as any)?.short_description ?? "",
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
    display_order: (artwork as any)?.display_order ?? 0,
  });

  const [manualSlug, setManualSlug] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Single image refs (media_id based)
  const [mainImage, setMainImage] = useState<ImageRef | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<ImageRef | null>(null);
  const [beforeImage, setBeforeImage] = useState<ImageRef | null>(null);
  const [afterImage, setAfterImage] = useState<ImageRef | null>(null);

  // Multi image refs
  const [galleryImages, setGalleryImages] = useState<{ mediaId: string; publicUrl: string; caption?: string; altText?: string }[]>([]);
  const [processImages, setProcessImages] = useState<{ mediaId: string; publicUrl: string; stepTitle?: string; stepDescription?: string }[]>([]);

  // Media picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"main" | "thumbnail" | "before" | "after" | null>(null);

  // Load categories, tags, and existing images
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
    getTags().then(setAllTags).catch(console.error);
  }, []);

  useEffect(() => {
    if (artwork) {
      getAllArtworkTags(artwork.id)
        .then((ids) => setSelectedTags(ids))
        .catch(console.error);

      // Load full artwork with images
      getArtworkWithImages(artwork.id)
        .then((full) => {
          if (!full) return;
          // Set single image refs from DB columns
          if (full.main_image) {
            setMainImage({ mediaId: (artwork as any).main_image_id ?? "", publicUrl: full.main_image.public_url });
          }
          if (full.thumbnail_image) {
            setThumbnailImage({ mediaId: (artwork as any).thumbnail_image_id ?? "", publicUrl: full.thumbnail_image.public_url });
          }
          if (full.before_image) {
            setBeforeImage({ mediaId: (artwork as any).before_image_id ?? "", publicUrl: full.before_image.public_url });
          }
          if (full.after_image) {
            setAfterImage({ mediaId: (artwork as any).after_image_id ?? "", publicUrl: full.after_image.public_url });
          }
          // Gallery
          setGalleryImages(
            full.gallery_images.map((g) => ({
              mediaId: g.media_id,
              publicUrl: g.media?.public_url ?? "",
              caption: g.caption ?? undefined,
              altText: g.alt_text ?? undefined,
            }))
          );
          // Process
          setProcessImages(
            full.process_images.map((p) => ({
              mediaId: p.media_id,
              publicUrl: p.media?.public_url ?? "",
              stepTitle: p.step_title ?? undefined,
              stepDescription: p.step_description ?? undefined,
            }))
          );
        })
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

  function handlePickerSelect(mediaId: string, publicUrl: string) {
    if (!pickerTarget) return;
    const ref = { mediaId, publicUrl };
    switch (pickerTarget) {
      case "main": setMainImage(ref); break;
      case "thumbnail": setThumbnailImage(ref); break;
      case "before": setBeforeImage(ref); break;
      case "after": setAfterImage(ref); break;
    }
    setPickerOpen(false);
    setPickerTarget(null);
  }

  function openPicker(target: "main" | "thumbnail" | "before" | "after") {
    setPickerTarget(target);
    setPickerOpen(true);
  }

  async function handleSubmit(action: "draft" | "publish") {
    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        summary: form.summary.trim() || null,
        short_description: form.short_description.trim() || null,
        story_content: form.story_content.trim() || null,
        ai_summary: form.ai_summary.trim() || null,
        category_id: form.category_id || null,
        artwork_type: form.artwork_type,
        image_alt: form.image_alt.trim() || null,
        featured: form.featured,
        show_on_homepage: form.show_on_homepage,
        status: (action === "publish" ? "published" : "draft") as ArtworkStatus,
        price: form.price ? parseFloat(form.price) : null,
        currency: form.currency || null,
        medium: form.medium.trim() || null,
        size: form.size.trim() || null,
        display_order: form.display_order,
        main_image_id: mainImage?.mediaId || null,
        thumbnail_image_id: thumbnailImage?.mediaId || null,
        before_image_id: beforeImage?.mediaId || null,
        after_image_id: afterImage?.mediaId || null,
      };

      let savedArtworkId: string;

      if (isEdit && artwork) {
        await updateArtwork(artwork.id, payload);
        savedArtworkId = artwork.id;
      } else {
        const created = await createArtwork(payload);
        savedArtworkId = created.id;
      }

      // Save tags
      await setArtworkTags(savedArtworkId, selectedTags);

      // Save gallery images
      await setArtworkGalleryImages(
        savedArtworkId,
        galleryImages.map((g, i) => ({
          media_id: g.mediaId,
          caption: g.caption,
          alt_text: g.altText,
          display_order: i,
        }))
      );

      // Save process images
      await setArtworkProcessImages(
        savedArtworkId,
        processImages.map((p, i) => ({
          media_id: p.mediaId,
          step_number: i + 1,
          step_title: p.stepTitle,
          step_description: p.stepDescription,
          display_order: i,
        }))
      );

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

  function SingleImageField({
    label,
    value,
    onClear,
    onSelect,
  }: {
    label: string;
    value: ImageRef | null;
    onClear: () => void;
    onSelect: () => void;
  }) {
    return (
      <div>
        <label className={labelClass}>{label}</label>
        {value ? (
          <div className="relative rounded-xl overflow-hidden border border-border bg-white">
            <img src={value.publicUrl} alt="" className="w-full h-[160px] object-cover" />
            <button
              type="button"
              onClick={onClear}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
            >
              <X size={14} className="text-stone" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onSelect}
            className="w-full h-[120px] rounded-xl border-2 border-dashed border-border bg-white hover:border-gold transition-colors flex flex-col items-center justify-center gap-1"
          >
            <Image size={20} className="text-stone/40" />
            <span className="font-body text-[12px] text-stone/60">Select from Media Library</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
      {/* Two-column layout for basic fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Title *</label>
            <input type="text" required value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Artwork title" className={inputClass} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass}>Slug *</label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={manualSlug} onChange={(e) => setManualSlug(e.target.checked)} className="rounded border-border" />
                <span className="font-body text-[11px] text-stone">Manual override</span>
              </label>
            </div>
            <input
              type="text" required value={form.slug}
              onChange={(e) => { setManualSlug(true); updateField("slug", e.target.value); }}
              placeholder="artwork-slug" className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <select value={form.category_id} onChange={(e) => updateField("category_id", e.target.value)} className={inputClass}>
              <option value="">— Select category —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Artwork Type</label>
            <select value={form.artwork_type} onChange={(e) => updateField("artwork_type", e.target.value as ArtworkType)} className={inputClass}>
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
              <option value="commission">Commission</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Medium</label>
            <input type="text" value={form.medium} onChange={(e) => updateField("medium", e.target.value)} placeholder="e.g. Pencil, Acrylic, Clay" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Size</label>
            <input type="text" value={form.size} onChange={(e) => updateField("size", e.target.value)} placeholder="e.g. 12x16 inches" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Display Order</label>
            <input type="number" value={form.display_order} onChange={(e) => updateField("display_order", parseInt(e.target.value) || 0)} placeholder="0" className={inputClass} />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Main Image */}
          <SingleImageField label="Main Image *" value={mainImage} onClear={() => setMainImage(null)} onSelect={() => openPicker("main")} />

          {/* Thumbnail Image */}
          <SingleImageField label="Thumbnail Image" value={thumbnailImage} onClear={() => setThumbnailImage(null)} onSelect={() => openPicker("thumbnail")} />

          {/* Price */}
          <div>
            <label className={labelClass}>Price</label>
            <div className="flex gap-2">
              <input type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="0" className={`${inputClass} flex-1`} />
              <select value={form.currency} onChange={(e) => updateField("currency", e.target.value)} className={`${inputClass} w-24`}>
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
                <label key={tag.id} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-[11px] font-semibold cursor-pointer transition-colors ${selectedTags.includes(tag.id) ? "bg-forest text-white" : "bg-forest/5 text-forest hover:bg-forest/10"}`}>
                  <input type="checkbox" checked={selectedTags.includes(tag.id)} onChange={(e) => { setSelectedTags((prev) => e.target.checked ? [...prev, tag.id] : prev.filter((id) => id !== tag.id)); }} className="hidden" />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} className="rounded border-border w-4 h-4" />
              <span className="font-body text-[13px] text-forest">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.show_on_homepage} onChange={(e) => updateField("show_on_homepage", e.target.checked)} className="rounded border-border w-4 h-4" />
              <span className="font-body text-[13px] text-forest">Show on Homepage</span>
            </label>
          </div>
        </div>
      </div>

      {/* Full-width text fields */}
      <div className="space-y-5">
        <div>
          <label className={labelClass}>Short Description</label>
          <textarea value={form.short_description} onChange={(e) => updateField("short_description", e.target.value)} placeholder="Short description (shown in listings and cards)" rows={2} className={textareaClass} />
        </div>

        <div>
          <label className={labelClass}>Summary</label>
          <textarea value={form.summary} onChange={(e) => updateField("summary", e.target.value)} placeholder="Summary of the artwork" rows={3} className={textareaClass} />
        </div>

        <div>
          <label className={labelClass}>Story Content</label>
          <textarea value={form.story_content} onChange={(e) => updateField("story_content", e.target.value)} placeholder="The full story behind this artwork." rows={8} className={textareaClass} />
        </div>

        <div>
          <label className={labelClass}>AI Summary</label>
          <textarea value={form.ai_summary} onChange={(e) => updateField("ai_summary", e.target.value)} placeholder="Auto-generated or manually written AI summary" rows={3} className={textareaClass} />
        </div>
      </div>

      {/* Before & After Images */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
        <h3 className="font-display text-[16px] text-forest font-medium mb-4">Before & After Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SingleImageField label="Before Image" value={beforeImage} onClear={() => setBeforeImage(null)} onSelect={() => openPicker("before")} />
          <SingleImageField label="After Image" value={afterImage} onClear={() => setAfterImage(null)} onSelect={() => openPicker("after")} />
        </div>
      </div>

      {/* Gallery Images */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
        <h3 className="font-display text-[16px] text-forest font-medium mb-4">Gallery Images</h3>
        <MultiImageUploader
          images={galleryImages}
          onChange={setGalleryImages}
          folder="artworks"
          maxImages={12}
        />
      </div>

      {/* Process Images */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
        <h3 className="font-display text-[16px] text-forest font-medium mb-4">Process Images (Step-by-Step)</h3>
        <MultiImageUploader
          images={processImages}
          onChange={setProcessImages}
          folder="artworks"
          maxImages={8}
        />
        {processImages.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="font-body text-[11px] font-semibold text-stone uppercase tracking-wider">Step Titles</p>
            {processImages.map((img, index) => (
              <div key={img.mediaId} className="flex items-center gap-3 p-3 rounded-xl bg-cream/50 border border-border/50">
                <img src={img.publicUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-body text-[10px] font-bold text-stone uppercase tracking-wider">Step {index + 1}</span>
                  <input
                    type="text"
                    value={img.stepTitle ?? ""}
                    onChange={(e) => {
                      const next = [...processImages];
                      next[index] = { ...next[index], stepTitle: e.target.value };
                      setProcessImages(next);
                    }}
                    placeholder="Step title (e.g., Initial Sketch)"
                    className="w-full h-[36px] px-3 rounded-lg border border-border bg-white font-body text-[13px] text-forest focus:outline-none focus:border-gold mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
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

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handlePickerSelect}
        folder="artworks"
      />
    </form>
  );
}
