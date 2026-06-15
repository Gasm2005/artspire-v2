import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { waLink } from "../lib/whatsapp";

const filters = [
  { key: "all", label: "All" },
  { key: "sketches", label: "Sketches" },
  { key: "portraits", label: "Portraits" },
  { key: "paintings", label: "Paintings" },
  { key: "mirror", label: "Mirror Art" },
  { key: "clay", label: "Clay Art" },
] as const;

const items = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  cat: filters[(i % (filters.length - 1)) + 1].key,
}));

export const Route = createFileRoute("/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio | Artspire" }, { name: "description", content: "Handcrafted portraits, paintings, mirror art, clay sculptures and personalized gifts." }] }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [active, setActive] = useState<string>("all");
  const visible = items.filter((i) => active === "all" || i.cat === active);

  return (
    <Layout>
      <section className="px-6 pt-12 pb-6 text-center">
        <p className="font-body text-[12px] font-semibold text-gold-accent mb-4 uppercase tracking-[0.2em]">Our Work</p>
        <h1 className="font-display text-[34px] leading-[1.15] text-primary font-medium mb-4">Every Piece Tells a Story</h1>
        <p className="font-body text-[14px] leading-relaxed text-on-surface-variant">
          Handcrafted portraits, paintings, mirror art, clay sculptures and personalized gifts.
        </p>
      </section>

      <div className="px-6 pb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={`shrink-0 px-4 py-2 rounded-full font-body text-[12px] font-semibold border transition-colors ${
                active === f.key
                  ? "bg-primary text-white border-primary"
                  : "bg-transparent text-on-surface-variant border-outline-variant"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <section className="px-6 pb-10 grid grid-cols-2 gap-3">
        {visible.map((item) => (
          <div
            key={item.id}
            className="aspect-square bg-surface-variant rounded-lg flex items-center justify-center text-center px-2"
          >
            <span className="font-accent italic text-gold-accent text-[12px] leading-snug">Your artwork here</span>
          </div>
        ))}
      </section>

      <div className="px-6 pb-16 text-center">
        <button className="border border-primary text-primary font-body font-semibold text-[13px] px-8 py-3 rounded-full active-scale">
          Load More Work
        </button>
      </div>

      <section className="bg-deep-forest px-8 py-14 text-center">
        <h2 className="font-display text-[26px] text-white leading-tight mb-3">Don't See What You're Looking For?</h2>
        <p className="font-body text-[14px] text-white/70 mb-6 leading-relaxed">
          Every piece is custom made. Share your idea and I'll bring it to life.
        </p>
        <a
          href={waLink("Hi Himangi, I'd like to start a custom commission.")}
          className="inline-block bg-gold-accent text-deep-forest font-body font-bold text-[14px] tracking-wide px-8 py-3 rounded-full active-scale"
        >
          Start a Custom Commission
        </a>
      </section>
    </Layout>
  );
}
