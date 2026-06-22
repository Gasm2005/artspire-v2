import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { waLink } from "../lib/whatsapp";
import { ArrowRight } from "lucide-react";

const filters = [
  { key: "all", label: "All" },
  { key: "sketches", label: "Pencil Sketches" },
  { key: "portraits", label: "Colour Portraits" },
  { key: "paintings", label: "Paintings" },
  { key: "mirror", label: "Mirror Art" },
  { key: "clay", label: "Clay Art" },
  { key: "gifts", label: "Personalized Gifts" },
] as const;

const items = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  cat: filters[(i % (filters.length - 1)) + 1].key,
}));

const workPatterns = [
  "art-cat-sketches", "art-cat-paintings", "art-cat-portraits", "art-cat-clay",
  "art-cat-mirror", "art-cat-gifts",
  "art-cat-sketches", "art-cat-paintings", "art-cat-portraits", "art-cat-clay",
  "art-cat-mirror", "art-cat-gifts",
];

const workTitles = [
  "Family Portrait", "Sunset Canvas", "Couple Sketch", "Clay Sculpture",
  "Mirror Mandala", "Gift Set", "Pet Portrait", "Watercolor Landscape",
  "Anniversary Gift", "Memorial Portrait", "Baby Portrait", "Home Decor Piece",
];

const workPrices = [
  "From ₹999", "From ₹2,999", "From ₹1,999", "From ₹1,799",
  "From ₹2,499", "From ₹799", "From ₹999", "From ₹2,999",
  "From ₹1,999", "From ₹999", "From ₹799", "From ₹2,499",
];

export const Route = createFileRoute("/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio | Artspire" }, { name: "description", content: "Handcrafted portraits, paintings, mirror art, clay sculptures and personalized gifts." }] }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [active, setActive] = useState<string>("all");
  const visible = items.filter((i) => active === "all" || i.cat === active);

  return (
    <Layout>
      <section className="section-padding bg-cream text-center">
        <div className="container-main">
          <p className="font-body text-[11px] md:text-[12px] font-semibold text-gold mb-4 uppercase tracking-[0.25em]">Our Work</p>
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-forest font-medium mb-4">Every Piece Tells a Story</h1>
          <p className="font-body text-[14px] md:text-[16px] text-stone max-w-xl mx-auto">Handcrafted portraits, paintings, mirror art, clay sculptures and personalized gifts.</p>
        </div>
      </section>

      <section className="pb-8">
        <div className="container-main">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:justify-center md:flex-wrap">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={`shrink-0 px-4 py-2.5 rounded-full font-body text-[12px] font-semibold border transition-all duration-200 ${
                  active === f.key
                    ? "bg-forest text-white border-forest shadow-sm"
                    : "bg-transparent text-stone border-border hover:border-forest/40 hover:text-forest"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {visible.map((item) => (
              <div
                key={item.id}
                className={`${workPatterns[item.id]} work-card portfolio-item relative rounded-xl overflow-hidden flex flex-col h-[300px] md:h-[340px] shadow-sm group cursor-pointer`}
              >
                {/* Category badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-block px-3 py-1 bg-gold/90 text-white font-body text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {item.cat}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <span className="font-display text-[16px] md:text-[18px] text-white font-medium">{workTitles[item.id]}</span>
                  <p className="font-body text-[13px] text-gold font-semibold mt-1">{workPrices[item.id]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="pb-12 md:pb-16 text-center">
        <div className="container-main">
          <button className="inline-flex items-center gap-2 h-[48px] px-8 border-2 border-forest text-forest font-body font-semibold text-[13px] uppercase rounded-xl active-scale btn-secondary">
            Load More Work <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <section className="section-padding bg-forest text-center">
        <div className="container-main max-w-2xl">
          <h2 className="font-display text-[24px] md:text-[32px] text-white font-medium mb-3">Don't See What You're Looking For?</h2>
          <p className="font-body text-[14px] md:text-[16px] text-cream/70 mb-8 leading-relaxed">Every piece is custom made. Share your idea and I'll bring it to life.</p>
          <a
            href={waLink("Hi Artspire, I'd like to start a custom commission.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-[52px] px-8 bg-gold text-forest font-body font-bold text-[14px] tracking-wide rounded-full btn-gold transition-colors active-scale"
          >
            Start a Custom Commission
          </a>
        </div>
      </section>
    </Layout>
  );
}
