import { createFileRoute } from "@tanstack/react-router";
import { useVisualAssets } from "@/hooks/useVisualAssets";
import { uploadVisualAsset, deleteVisualAsset, type VisualAsset } from "@/lib/visual-assets";
import { Layers, Upload, Trash2, Search, Loader2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/visual-assets/")({
  component: VisualAssetsPage,
});

const ASSET_TYPE_FILTERS = [
  { value: "all", label: "All Types" },
  { value: "overlay", label: "Overlays" },
  { value: "texture", label: "Textures" },
  { value: "pattern", label: "Patterns" },
  { value: "background", label: "Backgrounds" },
  { value: "decorative", label: "Decorative" },
  { value: "icon", label: "Icons" },
];

function VisualAssetsPage() {
  const { items, loading, refresh, assetTypes } = useVisualAssets();
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = items.filter((item) => {
    if (typeFilter !== "all" && item.asset_type !== typeFilter) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  async function handleFileUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const name = file.name.replace(/\.[^/.]+$/, "");
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        await uploadVisualAsset(file, {
          name,
          slug,
          assetType: "overlay",
        });
      }
      await refresh();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    const item = items.find((i) => i.id === id);
    if (item?.is_predefined) {
      alert("Predefined assets cannot be deleted.");
      return;
    }
    if (!confirm("Delete this visual asset?")) return;
    setDeleteId(id);
    try {
      await deleteVisualAsset(id);
      await refresh();
    } catch (err) {
      console.error(err);
      alert("Delete failed. Asset may be in use.");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">Visual Assets</h1>
          <p className="font-body text-[13px] text-stone mt-0.5">Overlays, textures, patterns, and decorative graphics</p>
        </div>
        <label className="inline-flex items-center gap-2 h-[44px] px-5 bg-forest text-white font-body font-bold text-[13px] rounded-xl btn-primary cursor-pointer transition-colors">
          <Upload size={16} />
          Upload
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
        </label>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone/50" />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[44px] pl-9 pr-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-[44px] px-3 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold"
        >
          {ASSET_TYPE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 font-body text-[13px] text-stone">
          <Loader2 size={16} className="animate-spin" />
          Uploading assets...
        </div>
      )}

      {loading ? (
        <div className="font-body text-stone text-[13px]">Loading visual assets...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-8 text-center">
          <Layers size={40} className="mx-auto text-stone/30 mb-3" />
          <p className="font-body text-stone text-[14px]">No visual assets found.</p>
          <p className="font-body text-stone/60 text-[12px] mt-1">Upload overlays, textures, and decorative graphics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((item) => (
            <AssetCard key={item.id} item={item} onDelete={handleDelete} isDeleting={deleteId === item.id} />
          ))}
        </div>
      )}
    </div>
  );
}

function AssetCard({
  item,
  onDelete,
  isDeleting,
}: {
  item: VisualAsset;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const typeLabel = item.asset_type.charAt(0).toUpperCase() + item.asset_type.slice(1);

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm group">
      <div className="aspect-square bg-forest/5 relative overflow-hidden">
        {!imageError && item.preview_url ? (
          <img
            src={item.preview_url}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone/30">
            <Layers size={24} />
          </div>
        )}
        {item.is_predefined && (
          <div className="absolute top-2 left-2">
            <span className="inline-block px-2 py-0.5 bg-gold/90 text-white font-body text-[9px] font-bold uppercase tracking-wider rounded-full">
              Built-in
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <a
            href={`/admin/visual-assets/edit/${item.id}`}
            className="p-2 rounded-lg bg-white/90 text-forest hover:bg-white transition-colors"
            title="Edit"
          >
            <Search size={14} />
          </a>
          <button
            onClick={() => onDelete(item.id)}
            disabled={isDeleting || item.is_predefined}
            className="p-2 rounded-lg bg-white/90 text-red-600 hover:bg-white transition-colors disabled:opacity-50"
            title="Delete"
          >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="font-body text-[11px] text-forest font-medium truncate" title={item.name}>
          {item.name}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="font-body text-[10px] text-stone/60 uppercase">{typeLabel}</span>
          <span className="font-body text-[10px] text-stone/60">
            {item.usage_count ?? 0} uses
          </span>
        </div>
      </div>
    </div>
  );
}
