import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getArtworks, type ArtworkWithCategory, type ArtworkStatus } from "@/lib/artworks";
import { getCategories, type CategoryWithVisuals } from "@/lib/categories";
import { SiteChrome } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio | The Artspire" },
      {
        name: "description",
        content:
          "Handcrafted portraits, paintings, mirror art, clay sculptures and personalised gifts by Himangi Pandey.",
      },
    ],
  }),
  loader: async () => {
    const [artworks, categories] = await Promise.all([
      getArtworks({ status: "published" as ArtworkStatus, limit: 50 }),
      getCategories().catch(() => []),
    ]);
    return { artworks, categories: categories as CategoryWithVisuals[] };
  },
  component: PortfolioPage,
});

function PortfolioPage() {
  const { artworks, categories } = Route.useLoaderData() as {
    artworks: ArtworkWithCategory[];
    categories: CategoryWithVisuals[];
  };
  const [active, setActive] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = artworks.filter((a) => {
    const matchCat = active === "all" || a.categories?.slug === active;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <SiteChrome>
      <div className="wrap page-hero">
        <span className="eyebrow rv">Commissioned work</span>
        <h1 className="reveal-words">
          A portfolio of <em>memories</em>, made by hand.
        </h1>
        <p className="rv d2">
          Every piece here began as someone's photograph, story, or occasion — then became a
          one-of-a-kind object.
        </p>
      </div>

      <div className="toolbar">
        <div className="wrap row">
          <div className="chips">
            <button
              className={active === "all" ? "chip active" : "chip"}
              onClick={() => setActive("all")}
            >
              All Work
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={active === c.slug ? "chip active" : "chip"}
                onClick={() => setActive(c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="tools-right">
            <span className="count">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </span>
            <input
              className="sort"
              style={{ minWidth: 160 }}
              placeholder="Search work…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <section>
        <div className="wrap">
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--stone)" }}>
              No work matches your filter yet.
            </div>
          ) : (
            <div className="grid g4">
              {filtered.map((a, i) => (
                <Link
                  key={a.id}
                  to="/artwork/$slug"
                  params={{ slug: a.slug }}
                  preload="intent"
                  className={
                    "card rv" +
                    (i % 4 === 1 ? " d1" : i % 4 === 2 ? " d2" : i % 4 === 3 ? " d3" : "")
                  }
                >
                  <div className="imgwrap tilt">
                    {a.image_url ? (
                      <div className="frame">
                        <img src={a.image_url} alt={a.title} loading="lazy" />
                      </div>
                    ) : (
                      <div className="frame" data-label="Commission photo"></div>
                    )}
                    <div className="quick">View piece</div>
                  </div>
                  {a.categories?.name && <div className="cat">{a.categories.name}</div>}
                  <h3>{a.title}</h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="exclusive">
        <div className="exc-border"></div>
        <div className="wrap" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <span className="eyebrow rv">Your story next</span>
          <h2 className="reveal-words" style={{ maxWidth: 760, margin: "14px auto 18px" }}>
            Have a memory you'd like made by hand?
          </h2>
          <p className="rv d2" style={{ margin: "0 auto 30px" }}>
            Tell Himangi about the person, the moment, or the occasion — she'll take it from there.
          </p>
          <Link className="btn btn-gold rv d3" to="/services">
            <span>Request a Commission</span>
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
