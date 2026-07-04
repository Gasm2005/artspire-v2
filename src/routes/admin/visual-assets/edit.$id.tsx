import { createFileRoute } from "@tanstack/react-router";
import { useVisualAssets } from "@/hooks/useVisualAssets";
import { useVisualAssetUsage } from "@/hooks/useVisualAssets";
import { getVisualAsset, updateVisualAsset, type VisualAsset } from "@/lib/visual-assets";
import { ArrowLeft, Save, Layers, AlertTriangle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/admin/visual-assets/edit/$id")({
  loader: async ({ params }) => {
    const asset = await getVisualAsset(params.id);
    if (!asset) throw new Error("Visual asset not found");
    return { asset };
  },
  component: VisualAssetEditPage,
});

function VisualAssetEditPage() {
  const { asset: initialAsset } = Route.useLoaderData();
  const [asset, setAsset] = useState<VisualAsset>(initialAsset);
  const { usages, count } = useVisualAssetUsage(asset.id);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: asset.name,
    description: asset.description ?? "",
    defaultOpacity: asset.default_opacity ?? 25,
    isActive: asset.is_active ?? true,
  });

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateVisualAsset(asset.id, {
        name: form.name,
        description: form.description || null,
        default_opacity: form.defaultOpacity,
        is_active: form.isActive,
      });
      setAsset(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  const typeLabel = asset.asset_type.charAt(0).toUpperCase() + asset.asset_type.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin/visual-assets" className="p-2 rounded-lg hover:bg-forest/5 text-stone hover:text-forest transition-colors">
          <ArrowLeft size={18} />
        </a>
        <div>
          <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">Edit Visual Asset</h1>
          <p className="font-body text-[13px] text-stone mt-0.5">{asset.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preview */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h2 className="font-display text-[16px] text-forest font-medium mb-4">Preview</h2>
          <div className="aspect-square bg-forest/5 rounded-xl overflow-hidden">
            {asset.preview_url ? (
              <img src={asset.preview_url} alt={asset.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone/30">
                <Layers size={48} />
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-body text-[11px] font-bold text-stone uppercase tracking-wider w-[100px]">Type</span>
              <span className="font-body text-[13px] text-forest">{typeLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-body text-[11px] font-bold text-stone uppercase tracking-wider w-[100px]">Slug</span>
              <span className="font-body text-[13px] text-forest">{asset.slug}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-body text-[11px] font-bold text-stone uppercase tracking-wider w-[100px]">Usage</span>
              <span className="font-body text-[13px] text-forest">{count} location{count !== 1 ? "s" : ""}</span>
            </div>
            {asset.is_predefined && (
              <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
                <p className="font-body text-[11px] text-amber-700 font-medium">
                  <AlertTriangle size={12} className="inline mr-1" />
                  This is a predefined asset. It cannot be deleted.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Edit form */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h2 className="font-display text-[16px] text-forest font-medium mb-4">Asset Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full h-[44px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold resize-y min-h-[80px]"
              />
            </div>

            <div>
              <label className="block font-body text-[11px] font-semibold text-stone uppercase tracking-wider mb-1.5">
                Default Opacity: {form.defaultOpacity}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={form.defaultOpacity}
                onChange={(e) => setForm((f) => ({ ...f, defaultOpacity: parseInt(e.target.value) }))}
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

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="rounded border-border w-4 h-4"
              />
              <span className="font-body text-[13px] text-forest">Active</span>
            </label>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 h-[48px] px-6 bg-forest text-white font-body font-bold text-[13px] rounded-xl btn-primary transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Usage tracking */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
        <h2 className="font-display text-[16px] text-forest font-medium mb-3">Where This Asset Is Used</h2>
        {usages.length === 0 ? (
          <p className="font-body text-[13px] text-stone/60">This asset is not used anywhere yet.</p>
        ) : (
          <div className="space-y-2">
            {usages.map((usage, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-cream/50 border border-border/50">
                <span className="font-body text-[11px] font-bold text-forest uppercase">{usage.entityType}</span>
                <span className="font-body text-[12px] text-stone">{usage.entityName}</span>
                <span className="font-body text-[10px] text-stone/50 ml-auto">{usage.usageType}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
