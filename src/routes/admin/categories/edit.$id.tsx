import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getCategoryById, updateCategory, getCategories, type CategoryWithVisuals } from "@/lib";
import { getVisualAssets } from "@/lib/visual-assets";
import { getMediaItems } from "@/lib/media-library";
import type { VisualAsset } from "@/lib/visual-assets";
import type { MediaItem } from "@/lib/media-library";
import { ArrowLeft, Save, Image, Layers, AlertTriangle, Loader2, Check } from "lucide-react";

export const Route = createFileRoute("/admin/categories/edit/$id")({
  loader: async ({ params }) => {
    const category = await getCategoryById(params.id);
    if (!category) throw new Error("Category not found");
    return { category };
  },
  component: CategoryEditPage,
});

function CategoryEditPage() {
  const { category: initial } = Route.useLoaderData();
  const [category, setCategory] = useState<CategoryWithVisuals>(initial as CategoryWithVisuals);
  const [saving, setSaving] = useState(false);
  const [overlays, setOverlays] = useState<VisualAsset[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);

  const [form, setForm] = useState({
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    shortSummary: category.short_summary ?? "",
    featured: category.featured ?? false,
    displayOrder: category.display_order ?? 0,
    metaTitle: category.meta_title ?? "",
    metaDescription: category.meta_description ?? "",
    cardOverlayOpacity: category.card_overlay_opacity ?? 25,
    cardGradientStyle: category.card_gradient_style ?? "bottom-dark",
    cardTextPosition: category.card_text_position ?? "bottom-left",
    cardArtworkImageId: category.card_artwork_image_id ?? "",
    cardOverlayId: category.card_overlay_id ?? "",
    bannerArtworkImageId: category.banner_artwork_image_id ?? "",
    bannerOverlayId: category.banner_overlay_id ?? "",
  });

  useEffect(() => {
    async function load() {
      try {
        const [overlaysData, mediaData] = await Promise.all([
          getVisualAssets({ assetType: "overlay", isActive: true }),
          getMediaItems({ limit: 100 }),
        ]);
        setOverlays(overlaysData);
        setMediaItems(mediaData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAssets(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateCategory(category.id, {
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        short_summary: form.shortSummary || null,
        featured: form.featured,
        display_order: form.displayOrder,
        meta_title: form.metaTitle || null,
        meta_description: form.metaDescription || null,
        card_overlay_opacity: form.cardOverlayOpacity,
        card_gradient_style: form.cardGradientStyle as "bottom-dark" | "center-vignette" | "none",
        card_text_position: form.cardTextPosition as "bottom-left" | "bottom-center" | "center",
        card_artwork_image_id: form.cardArtworkImageId || null,
        card_overlay_id: form.cardOverlayId || null,
        banner_artwork_image_id: form.bannerArtworkImageId || null,
        banner_overlay_id: form.bannerOverlayId || null,
      } as any);
      setCategory(updated as CategoryWithVisuals);
    } catch (err) {
      console.error(err);
      alert("Failed to save category.");
    } finally {
      setSaving(false);
    }
  }

  const selectedArtwork = mediaItems.find((m) => m.id === form.cardArtworkImageId);
  const selectedOverlay = overlays.find((o) => o.id === form.cardOverlayId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin/categories" className="p-2 rounded-lg hover:bg-forest/5 text-stone hover:text-forest transition-colors">
          <ArrowLeft size={18} />
        </a>
        <div>
          <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">Edit Category</h1>
          <p className="font-body text-[13px] text-stone mt-0.5">{category.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-5">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <h2 className="font-display text-[16px] text-forest font-medium mb-4">Basic Information</h2>
            <div className="space-y-4">
              <FormField label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
              <FormField label="Slug" value={form.slug} onChange={(v) => setForm((f) => ({ ...f, slug: v }))} />
              <FormField label="Short Summary" value={form.shortSummary} onChange={(v) => setForm((f) => ({ ...f, shortSummary: v }))} textarea />
              <FormField label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} textarea />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="rounded border-border w-4 h-4" />
                  <span className="font-body text-[13px] text-forest">Featured</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-body text-[11px] font-semibold text-stone uppercase tracking-wider">Display Order</span>
                  <input type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))} className="w-20 h-[36px] px-3 rounded-lg border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold" />
                </div>
              </div>
            </div>
          </div>

          {/* Visual System */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <h2 className="font-display text-[16px] text-forest font-medium mb-4">Visual System</h2>

            {!form.cardArtworkImageId && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="font-body text-[11px] text-red-700 font-medium">
                  <AlertTriangle size={12} className="inline mr-1" />
                  Category card requires a real artwork image. Select one below.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {/* Card Artwork Image */}
              <div>
                <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5">
                  Card Artwork Image *
                </label>
                <select
                  value={form.cardArtworkImageId}
                  onChange={(e) => setForm((f) => ({ ...f, cardArtworkImageId: e.target.value }))}
                  className="w-full h-[44px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold"
                >
                  <option value="">— Select artwork image —</option>
                  {mediaItems.map((m) => (
                    <option key={m.id} value={m.id}>{m.original_name}</option>
                  ))}
                </select>
              </div>

              {/* Card Overlay */}
              <div>
                <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5">
                  Card Decorative Overlay
                </label>
                <select
                  value={form.cardOverlayId}
                  onChange={(e) => setForm((f) => ({ ...f, cardOverlayId: e.target.value }))}
                  className="w-full h-[44px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold"
                >
                  <option value="">— No overlay —</option>
                  {overlays.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              {/* Overlay Opacity */}
              <div>
                <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5">
                  Overlay Opacity: {form.cardOverlayOpacity}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.cardOverlayOpacity}
                  onChange={(e) => setForm((f) => ({ ...f, cardOverlayOpacity: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between font-body text-[10px] text-stone/50 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Gradient Style */}
              <div>
                <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5">Gradient Style</label>
                <select
                  value={form.cardGradientStyle}
                  onChange={(e) => setForm((f) => ({ ...f, cardGradientStyle: e.target.value }))}
                  className="w-full h-[44px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold"
                >
                  <option value="bottom-dark">Bottom Dark (default)</option>
                  <option value="center-vignette">Center Vignette</option>
                  <option value="none">None</option>
                </select>
              </div>

              {/* Text Position */}
              <div>
                <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5">Text Position</label>
                <select
                  value={form.cardTextPosition}
                  onChange={(e) => setForm((f) => ({ ...f, cardTextPosition: e.target.value }))}
                  className="w-full h-[44px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold"
                >
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="center">Center</option>
                </select>
              </div>

              {/* Banner Artwork */}
              <div>
                <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5">Banner Artwork Image</label>
                <select
                  value={form.bannerArtworkImageId}
                  onChange={(e) => setForm((f) => ({ ...f, bannerArtworkImageId: e.target.value }))}
                  className="w-full h-[44px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold"
                >
                  <option value="">— No banner image —</option>
                  {mediaItems.map((m) => (
                    <option key={m.id} value={m.id}>{m.original_name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <h2 className="font-display text-[16px] text-forest font-medium mb-4">SEO</h2>
            <div className="space-y-4">
              <FormField label="Meta Title" value={form.metaTitle} onChange={(v) => setForm((f) => ({ ...f, metaTitle: v }))} />
              <FormField label="Meta Description" value={form.metaDescription} onChange={(v) => setForm((f) => ({ ...f, metaDescription: v }))} textarea />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 h-[48px] px-6 bg-forest text-white font-body font-bold text-[13px] rounded-xl btn-primary transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>

        {/* Right: Preview */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm sticky top-4">
            <h2 className="font-display text-[16px] text-forest font-medium mb-4">Live Preview</h2>
            <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-forest/5">
              {selectedArtwork ? (
                <div className="w-full h-full relative">
                  {/* Layer 1: Artwork */}
                  <img src={selectedArtwork.public_url} alt={category.name} className="absolute inset-0 w-full h-full object-cover" />
                  {/* Layer 2: Overlay */}
                  {selectedOverlay && selectedOverlay.preview_url && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${selectedOverlay.preview_url})`,
                        backgroundSize: "cover",
                        opacity: form.cardOverlayOpacity / 100,
                        mixBlendMode: "multiply",
                      }}
                    />
                  )}
                  {/* Layer 3: Gradient */}
                  {form.cardGradientStyle === "bottom-dark" && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  )}
                  {form.cardGradientStyle === "center-vignette" && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)]" />
                  )}
                  {/* Layer 4: Text */}
                  <div
                    className={`absolute p-5 ${
                      form.cardTextPosition === "bottom-left"
                        ? "bottom-0 left-0"
                        : form.cardTextPosition === "bottom-center"
                        ? "bottom-0 left-0 right-0 text-center"
                        : "inset-0 flex items-center justify-center text-center"
                    }`}
                  >
                    <span className="font-display text-[22px] text-white font-medium drop-shadow-lg">
                      {category.name}
                    </span>
                    {form.shortSummary && (
                      <p className="font-body text-[13px] text-gold mt-1 font-medium drop-shadow-lg">
                        {form.shortSummary}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone/40 gap-2">
                  <Image size={32} />
                  <span className="font-body text-[12px] font-medium">Select an artwork image to see preview</span>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-body text-[11px] font-bold text-stone uppercase tracking-wider w-[100px]">Artwork</span>
                <span className="font-body text-[13px] text-forest">
                  {selectedArtwork ? "✅ Set" : "❌ Missing"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body text-[11px] font-bold text-stone uppercase tracking-wider w-[100px]">Overlay</span>
                <span className="font-body text-[13px] text-forest">
                  {selectedOverlay ? `${selectedOverlay.name} (${form.cardOverlayOpacity}%)` : "None"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body text-[11px] font-bold text-stone uppercase tracking-wider w-[100px]">Gradient</span>
                <span className="font-body text-[13px] text-forest">{form.cardGradientStyle}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body text-[11px] font-bold text-stone uppercase tracking-wider w-[100px]">Text</span>
                <span className="font-body text-[13px] text-forest">{form.cardTextPosition}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  textarea?: boolean;
}) {
  const baseClass = "w-full px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors";
  return (
    <div>
      <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`${baseClass} py-2.5 resize-y min-h-[80px]`} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`${baseClass} h-[44px]`} />
      )}
    </div>
  );
}
