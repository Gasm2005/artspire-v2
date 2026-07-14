import { useState, useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { uploadMediaFile } from "@/lib/media-library";
import {
  createProduct,
  updateProduct,
  generateProductSlug,
  ensureUniqueProductSlug,
  getProductGalleryImages,
  setProductGalleryImages,
  type ProductWithCategory,
  type ProductStatus,
} from "@/lib/products";
import { getShopCategories, type ShopCategory } from "@/lib/shop-categories";
import { toast } from "@/lib/toast";
import { Upload, X, Loader2, Save, Rocket, Plus } from "lucide-react";


interface ProductFormProps {
  product?: ProductWithCategory; // present when editing
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [saving, setSaving] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url ?? null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);

  const [manualSlug, setManualSlug] = useState(isEdit);

  const [form, setForm] = useState({
    title: product?.title ?? "",
    slug: product?.slug ?? "",
    category_id: product?.category_id ?? "",
    medium: product?.medium ?? "",
    summary: product?.summary ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    compare_at_price: product?.compare_at_price?.toString() ?? "",
    inventory_count: product?.inventory_count?.toString() ?? "1",
    is_one_of_a_kind: product?.is_one_of_a_kind ?? true,
    materials_used: product?.materials_used ?? "",
    dimensions: product?.dimensions ?? "",
    weight: product?.weight ?? "",
    care_instructions: product?.care_instructions ?? "",
    commission_similar_enabled: product?.commission_similar_enabled ?? true,
    sku: product?.sku ?? "",
    meta_title: product?.meta_title ?? "",
    meta_description: product?.meta_description ?? "",
  });

  useEffect(() => {
    getShopCategories().then(setCategories).catch(console.error);
  }, []);

  // Load existing gallery images when editing
  useEffect(() => {
    if (product?.id) {
      getProductGalleryImages(product.id)
        .then((imgs) => setExistingGalleryUrls(imgs.map((i) => i.media?.public_url).filter(Boolean) as string[]))
        .catch(console.error);
    }
  }, [product?.id]);

  useEffect(() => {
    if (!manualSlug && form.title) {
      setForm((f) => ({ ...f, slug: generateProductSlug(form.title) }));
    }
  }, [form.title, manualSlug]);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleGalleryFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const currentTotal = existingGalleryUrls.length + galleryFiles.length;
    const room = Math.max(0, 10 - currentTotal);
    if (files.length > room) {
      toast.error(`Only ${room} more file(s) allowed — max 10 per product.`);
    }
    const accepted = files.slice(0, room);
    if (accepted.length === 0) return;
    setGalleryFiles((prev) => [...prev, ...accepted]);
    setGalleryPreviews((prev) => [...prev, ...accepted.map((f) => URL.createObjectURL(f))]);
  }

  function removeGalleryFile(index: number) {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave(status: ProductStatus) {
    if (!form.title.trim()) {
      toast.error("Please enter a product name.");
      return;
    }
    if (!isEdit && !imageFile) {
      toast.error("Please select a main product image.");
      return;
    }
    if (!form.price || parseFloat(form.price) < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    setSaving(true);
    try {
      let mainImageId = product?.main_image_id ?? null;
      let imageUrl = product?.image_url ?? null;

      if (imageFile) {
        const { mediaItem, publicUrl } = await uploadMediaFile(imageFile, {
          folder: "products",
          altText: form.title,
        });
        mainImageId = mediaItem.id;
        imageUrl = publicUrl;
      }

      const payload = {
        title: form.title.trim(),
        summary: form.summary.trim() || null,
        description: form.description.trim() || null,
        category_id: form.category_id || null,
        medium: form.medium || null,
        price: parseFloat(form.price),
        compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
        inventory_count: parseInt(form.inventory_count, 10) || 0,
        is_one_of_a_kind: form.is_one_of_a_kind,
        materials_used: form.materials_used.trim() || null,
        dimensions: form.dimensions.trim() || null,
        weight: form.weight.trim() || null,
        care_instructions: form.care_instructions.trim() || null,
        commission_similar_enabled: form.commission_similar_enabled,
        sku: form.sku.trim() || null,
        meta_title: form.meta_title.trim() || null,
        meta_description: form.meta_description.trim() || null,
        main_image_id: mainImageId,
        image_url: imageUrl,
        status,
        ...(status === "published" && !product?.published_at ? { published_at: new Date().toISOString() } : {}),
      };

      let savedId: string;

      if (isEdit && product) {
        await updateProduct(product.id, payload);
        savedId = product.id;
      } else {
        const baseSlug = form.slug.trim() || generateProductSlug(form.title);
        const slug = await ensureUniqueProductSlug(baseSlug);
        const created = await createProduct({ ...payload, slug });
        savedId = created.id;
      }

      // Upload and attach new gallery images
      if (galleryFiles.length > 0) {
        const uploaded = await Promise.all(
          galleryFiles.map((file) =>
            uploadMediaFile(file, { folder: "products", altText: form.title }).then((r) => r.mediaItem.id)
          )
        );
        // Combine with any pre-existing gallery (edit mode) — simplistic append
        await setProductGalleryImages(savedId, uploaded);
      }

      toast.success(status === "published" ? "Product published!" : "Draft saved.");
      if (onSuccess) onSuccess();
      else router.navigate({ to: "/admin/products" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product.", "Please check the fields and try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full h-[44px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block font-body text-[11px] font-bold text-stone uppercase tracking-wider mb-1.5";
  const textareaClass = "w-full px-4 py-2.5 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors resize-y min-h-[90px]";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Main image */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-2">
        <label className={labelClass}>Main Product Image *</label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border border-border w-full max-w-sm">
            <img src={imagePreview} alt="Preview" className="w-full h-[220px] object-cover" />
            <button
              onClick={() => { setImagePreview(null); setImageFile(null); }}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow hover:bg-white transition-colors"
            >
              <X size={14} className="text-stone" />
            </button>
            <label className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-lg font-body text-[11px] font-semibold text-forest cursor-pointer hover:bg-white transition-colors shadow">
              <Upload size={12} />
              Change
              <input type="file" accept="image/*" className="hidden" onChange={handleMainImageChange} />
            </label>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full max-w-sm h-[180px] rounded-xl border-2 border-dashed border-border bg-cream hover:border-gold transition-colors cursor-pointer">
            <Upload size={24} className="text-stone/40 mb-2" />
            <span className="font-body text-[13px] text-stone/60">Click to upload main image</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleMainImageChange} />
          </label>
        )}
      </div>

      {/* Gallery images */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-3">
        <label className={labelClass}>Gallery — Images & Videos (up to 10 total)</label>
        <div className="flex flex-wrap gap-3">
          {existingGalleryUrls.map((url, i) => (
            <div key={`existing-${i}`} className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-cream">
              {/\.(mp4|webm|mov)$/i.test(url) ? (
                <video src={url} className="w-full h-full object-cover" muted />
              ) : (
                <img src={url} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          ))}
          {galleryPreviews.map((url, i) => (
            <div key={`new-${i}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border bg-cream">
              {galleryFiles[i]?.type.startsWith("video/") ? (
                <video src={url} className="w-full h-full object-cover" muted />
              ) : (
                <img src={url} alt="" className="w-full h-full object-cover" />
              )}
              <button
                onClick={() => removeGalleryFile(i)}
                className="absolute top-0.5 right-0.5 p-0.5 bg-white/90 rounded-full shadow"
              >
                <X size={10} className="text-stone" />
              </button>
            </div>
          ))}
          {existingGalleryUrls.length + galleryPreviews.length < 10 && (
            <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border bg-cream hover:border-gold transition-colors cursor-pointer flex items-center justify-center">
              <Plus size={18} className="text-stone/40" />
              <input
                type="file"
                accept="image/*,video/mp4,video/webm,video/quicktime"
                multiple
                className="hidden"
                onChange={handleGalleryFilesChange}
              />
            </label>
          )}
        </div>
        <p className="font-body text-[11px] text-stone/50">
          {existingGalleryUrls.length + galleryPreviews.length}/10 uploaded · videos: mp4, webm, mov
        </p>
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-4">
        <h2 className="font-display text-[16px] text-forest font-medium">Basic Info</h2>

        <div>
          <label className={labelClass}>Product Name *</label>
          <input type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g. Hand-thrown Ceramic Vase" className={inputClass} />
        </div>

        {!isEdit && (
          <div>
            <label className={labelClass}>URL Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => { setManualSlug(true); updateField("slug", e.target.value); }}
              placeholder="auto-generated-from-title"
              className={inputClass}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category</label>
            <select value={form.category_id} onChange={(e) => updateField("category_id", e.target.value)} className={inputClass}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Material / Medium</label>
            <input
              type="text"
              value={form.medium}
              onChange={(e) => updateField("medium", e.target.value)}
              placeholder="e.g. Brass, Ceramic, Teak Wood, Cement"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Short Summary (shown on cards)</label>
          <input type="text" value={form.summary} onChange={(e) => updateField("summary", e.target.value)} placeholder="One sentence description" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Full Story / Description</label>
          <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Tell the story behind this piece..." className={textareaClass} />
        </div>
      </div>

      {/* Pricing & inventory */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-4">
        <h2 className="font-display text-[16px] text-forest font-medium">Pricing & Inventory</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price (₹) *</label>
            <input type="number" min="0" value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="2999" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Compare-at Price (optional)</label>
            <input type="number" min="0" value={form.compare_at_price} onChange={(e) => updateField("compare_at_price", e.target.value)} placeholder="3999" className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Inventory Count</label>
            <input type="number" min="0" value={form.inventory_count} onChange={(e) => updateField("inventory_count", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>SKU (optional)</label>
            <input type="text" value={form.sku} onChange={(e) => updateField("sku", e.target.value)} placeholder="ART-CLAY-001" className={inputClass} />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_one_of_a_kind} onChange={(e) => updateField("is_one_of_a_kind", e.target.checked)} className="w-4 h-4 accent-forest" />
          <span className="font-body text-[13px] text-stone">This is a one-of-a-kind piece (cannot be remade)</span>
        </label>
      </div>

      {/* Craft details */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-4">
        <h2 className="font-display text-[16px] text-forest font-medium">Craft Details</h2>
        <div>
          <label className={labelClass}>Materials Used</label>
          <input type="text" value={form.materials_used} onChange={(e) => updateField("materials_used", e.target.value)} placeholder="Stoneware clay, food-safe glaze" className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Dimensions</label>
            <input type="text" value={form.dimensions} onChange={(e) => updateField("dimensions", e.target.value)} placeholder="20cm x 15cm x 15cm" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Weight</label>
            <input type="text" value={form.weight} onChange={(e) => updateField("weight", e.target.value)} placeholder="800g" className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Care Instructions</label>
          <textarea value={form.care_instructions} onChange={(e) => updateField("care_instructions", e.target.value)} placeholder="Hand wash only. Avoid direct sunlight." className={textareaClass} />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.commission_similar_enabled} onChange={(e) => updateField("commission_similar_enabled", e.target.checked)} className="w-4 h-4 accent-forest" />
          <span className="font-body text-[13px] text-stone">Show "Commission something like this" button</span>
        </label>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-4">
        <h2 className="font-display text-[16px] text-forest font-medium">SEO (optional)</h2>
        <div>
          <label className={labelClass}>Meta Title</label>
          <input type="text" value={form.meta_title} onChange={(e) => updateField("meta_title", e.target.value)} placeholder="Defaults to product name" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Meta Description</label>
          <textarea value={form.meta_description} onChange={(e) => updateField("meta_description", e.target.value)} placeholder="Defaults to summary" className={textareaClass} />
        </div>
      </div>

      {/* Save actions */}
      <div className="flex items-center gap-3 sticky bottom-4 bg-white rounded-2xl border border-border p-4 shadow-md">
        <button
          onClick={() => handleSave("draft")}
          disabled={saving}
          className="inline-flex items-center gap-2 h-[44px] px-5 bg-white border-2 border-forest text-forest font-body font-bold text-[13px] rounded-xl hover:bg-forest/5 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Draft
        </button>
        <button
          onClick={() => handleSave("published")}
          disabled={saving}
          className="inline-flex items-center gap-2 h-[44px] px-5 bg-forest text-white font-body font-bold text-[13px] rounded-xl hover:bg-forest/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
          {isEdit ? "Update & Publish" : "Publish"}
        </button>
      </div>
    </div>
  );
}
