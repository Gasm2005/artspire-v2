import { createFileRoute, Link } from "@tanstack/react-router";
import { getPublishedPosts, type BlogPost } from "@/lib/blog";
import { SiteChrome } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    const posts = await getPublishedPosts(50).catch(() => []);
    return { posts: posts as BlogPost[] };
  },
  head: () => ({
    meta: [
      { title: "Journal | The Artspire" },
      {
        name: "description",
        content:
          "Notes from the studio — craft, care guides, gift ideas, and the stories behind handmade pieces by Himangi Pandey.",
      },
    ],
  }),
  component: BlogIndexPage,
});

function fmtDate(iso: string | null) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function BlogIndexPage() {
  const { posts } = Route.useLoaderData();
  return (
    <SiteChrome>
      <div className="wrap page-hero">
        <span className="eyebrow rv">The Studio Journal</span>
        <h1 className="reveal-words">
          Notes from the <em>studio</em>.
        </h1>
        <p className="rv d2">
          Craft, care guides, gift ideas, and the stories behind each handmade piece.
        </p>
      </div>

      <section style={{ paddingTop: 10 }}>
        <div className="wrap">
          {posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--stone)" }}>
              New journal entries are on the way.
            </div>
          ) : (
            <div className="grid">
              {posts.map((p, i) => (
                <Link
                  key={p.id}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  preload="intent"
                  className={"card rv" + (i % 3 === 1 ? " d1" : i % 3 === 2 ? " d2" : "")}
                >
                  <div className="imgwrap tilt" style={{ aspectRatio: "3 / 2" }}>
                    {p.cover_image_url ? (
                      <div className="frame">
                        <img src={p.cover_image_url} alt={p.title} loading="lazy" />
                      </div>
                    ) : (
                      <div className="frame" data-label="Cover image"></div>
                    )}
                    <div className="quick">Read article</div>
                  </div>
                  {p.category && <div className="cat">{p.category}</div>}
                  <h3>{p.title}</h3>
                  {p.excerpt && (
                    <p
                      style={{ fontSize: 14, color: "var(--stone)", marginTop: 6, lineHeight: 1.6 }}
                    >
                      {p.excerpt}
                    </p>
                  )}
                  <div className="stock" style={{ marginTop: 8 }}>
                    {fmtDate(p.published_at)}
                    {p.reading_minutes ? ` · ${p.reading_minutes} min read` : ""}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteChrome>
  );
}
