import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getArtworks,
  publishArtwork,
  unpublishArtwork,
  archiveArtwork,
  softDeleteArtwork,
  type ArtworkWithCategory,
} from "@/lib";
import { Plus, Edit, Trash2, Eye, EyeOff, Archive, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/artworks/")({
  component: AdminArtworksPage,
});

function AdminArtworksPage() {
  const [artworks, setArtworks] = useState<ArtworkWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "archived">("all");

  async function load() {
    setLoading(true);
    try {
      const data = await getArtworks({ limit: 500, orderBy: "created_at", ascending: false });
      setArtworks(data);
    } catch (err) {
      console.error("Load artworks error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = artworks.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  async function handlePublish(id: string) {
    setActionId(id);
    try {
      await publishArtwork(id);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  }

  async function handleUnpublish(id: string) {
    setActionId(id);
    try {
      await unpublishArtwork(id);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  }

  async function handleArchive(id: string) {
    if (!confirm("Archive this artwork? It will be hidden from the public.")) return;
    setActionId(id);
    try {
      await archiveArtwork(id);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this artwork permanently? This cannot be undone.")) return;
    setActionId(id);
    try {
      await softDeleteArtwork(id);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      published: "bg-green-50 text-green-700",
      draft: "bg-amber-50 text-amber-700",
      archived: "bg-stone-100 text-stone-500",
    };
    return map[status] || "bg-gray-50 text-gray-600";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">
            Artworks
          </h1>
          <p className="font-body text-[13px] text-stone mt-0.5">
            Manage and publish your artworks
          </p>
        </div>
        <a
          href="/admin/artworks/new"
          className="inline-flex items-center gap-2 h-[44px] px-5 bg-forest text-white font-body font-bold text-[13px] rounded-xl btn-primary transition-colors"
        >
          <Plus size={16} />
          New Artwork
        </a>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {(["all", "published", "draft", "archived"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-3 py-1.5 rounded-lg font-body text-[12px] font-semibold transition-colors ${
              filter === f
                ? "bg-forest text-white"
                : "bg-white border border-border text-stone hover:border-forest/40"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="font-body text-stone text-[13px]">Loading artworks…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-8 text-center">
          <p className="font-body text-stone text-[14px]">No artworks found.</p>
          <a
            href="/admin/artworks/new"
            className="inline-flex items-center gap-2 h-[40px] px-4 mt-4 bg-forest text-white font-body font-semibold text-[12px] rounded-xl btn-primary"
          >
            <Plus size={14} />
            Create your first artwork
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 font-body text-[10px] font-bold text-stone uppercase tracking-wider">
                    Artwork
                  </th>
                  <th className="px-4 py-3 font-body text-[10px] font-bold text-stone uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 font-body text-[10px] font-bold text-stone uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 font-body text-[10px] font-bold text-stone uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((artwork) => (
                  <tr
                    key={artwork.id}
                    className="border-b border-border last:border-b-0 hover:bg-cream/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-forest/5 overflow-hidden shrink-0">
                          {artwork.image_url ? (
                            <img
                              src={artwork.image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone/30 text-[10px]">
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-body text-[13px] font-semibold text-forest">
                            {artwork.title}
                          </div>
                          <div className="font-body text-[11px] text-stone/60">{artwork.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-body text-[12px] text-stone">
                        {artwork.categories?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-body text-[10px] font-bold uppercase tracking-wider ${statusBadge(artwork.status)}`}
                      >
                        {artwork.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {actionId === artwork.id ? (
                          <Loader2 size={16} className="animate-spin text-stone" />
                        ) : (
                          <>
                            {artwork.status === "draft" && (
                              <button
                                onClick={() => handlePublish(artwork.id)}
                                title="Publish"
                                className="p-2 rounded-lg hover:bg-green-50 text-stone hover:text-green-600 transition-colors"
                              >
                                <Eye size={14} />
                              </button>
                            )}
                            {artwork.status === "published" && (
                              <button
                                onClick={() => handleUnpublish(artwork.id)}
                                title="Unpublish"
                                className="p-2 rounded-lg hover:bg-amber-50 text-stone hover:text-amber-600 transition-colors"
                              >
                                <EyeOff size={14} />
                              </button>
                            )}
                            <a
                              href={`/admin/artworks/edit/${artwork.id}`}
                              title="Edit"
                              className="p-2 rounded-lg hover:bg-forest/5 text-stone hover:text-forest transition-colors"
                            >
                              <Edit size={14} />
                            </a>
                            <button
                              onClick={() => handleArchive(artwork.id)}
                              title="Archive"
                              className="p-2 rounded-lg hover:bg-stone/10 text-stone hover:text-stone-700 transition-colors"
                            >
                              <Archive size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(artwork.id)}
                              title="Delete"
                              className="p-2 rounded-lg hover:bg-red-50 text-stone hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
