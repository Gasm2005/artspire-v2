import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getArtworks } from "@/lib";
import { Palette, FileText, Eye, MessageSquare, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    commissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const allArtworks = await getArtworks({ limit: 1000 });
        const published = allArtworks.filter((a) => a.status === "published").length;
        const draft = allArtworks.filter((a) => a.status === "draft").length;
        setStats({
          total: allArtworks.length,
          published,
          draft,
          commissions: 0,
        });
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    { label: "Total Artworks", value: stats.total, icon: Palette, color: "bg-forest/10 text-forest" },
    { label: "Published", value: stats.published, icon: Eye, color: "bg-gold/10 text-gold" },
    { label: "Drafts", value: stats.draft, icon: FileText, color: "bg-stone/10 text-stone" },
    { label: "Commissions", value: stats.commissions, icon: MessageSquare, color: "bg-forest/5 text-forest" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[24px] md:text-[28px] text-forest font-medium">Dashboard</h1>
          <p className="font-body text-[13px] text-stone mt-0.5">Overview of your Artspire content</p>
        </div>
        <a
          href="/admin/artworks/new"
          className="inline-flex items-center gap-2 h-[44px] px-5 bg-forest text-white font-body font-bold text-[13px] rounded-xl btn-primary transition-colors"
        >
          <Plus size={16} />
          New Artwork
        </a>
      </div>

      {loading ? (
        <div className="font-body text-stone text-[13px]">Loading stats…</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-border p-4 md:p-5 shadow-sm"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.color} mb-3`}>
                <card.icon size={18} />
              </div>
              <div className="font-display text-[28px] md:text-[32px] text-forest font-medium leading-none">
                {card.value}
              </div>
              <div className="font-body text-[11px] text-stone mt-1 uppercase tracking-wider font-semibold">
                {card.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-border p-5 md:p-6 shadow-sm">
        <h2 className="font-display text-[18px] text-forest font-medium mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/artworks/new"
            className="inline-flex items-center gap-2 h-[40px] px-4 bg-forest text-white font-body font-semibold text-[12px] rounded-xl btn-primary transition-colors"
          >
            <Plus size={14} />
            Create New Artwork
          </a>
          <a
            href="/admin/artworks"
            className="inline-flex items-center gap-2 h-[40px] px-4 border border-forest text-forest font-body font-semibold text-[12px] rounded-xl btn-secondary transition-colors"
          >
            <Palette size={14} />
            Manage Artworks
          </a>
        </div>
      </div>
    </div>
  );
}
