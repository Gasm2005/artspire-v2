import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getPublishedPostBySlug, getPublishedPosts, type BlogPost } from "@/lib/blog";
import { absoluteUrl, OG_IMAGE } from "@/lib/site";
import { SiteChrome } from "@/components/site/SiteChrome";

interface LoaderData {
  post: BlogPost;
  related: BlogPost[];
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }): Promise<LoaderData> => {
    const post = await getPublishedPostBySlug(params.slug);
    if (!post) throw notFound();
    const all = await getPublishedPosts(6).catch(() => []);
    const related = all.filter((p) => p.id !== post.id).slice(0, 3);
    return { post, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { post } = loaderData;
    const url = absoluteUrl(`/blog/${post.slug}`);
    const img = post.og_image_url ?? post.cover_image_url ?? OG_IMAGE;
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.meta_description ?? post.excerpt ?? "",
      image: img,
      author: { "@type": "Person", name: post.author ?? "Himangi Pandey" },
      publisher: { "@type": "Organization", name: "The Artspire" },
      datePublished: post.published_at ?? post.created_at,
      dateModified: post.updated_at,
      mainEntityOfPage: url,
    };
    return {
      meta: [
        { title: post.meta_title ?? `${post.title} | The Artspire Journal` },
        {
          name: "description",
          content:
            post.meta_description ?? post.excerpt ?? `${post.title} — from The Artspire journal.`,
        },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.meta_description ?? post.excerpt ?? "" },
        { property: "og:image", content: img },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(articleSchema) }],
    };
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <SiteChrome>
      <section>
        <div className="wrap" style={{ textAlign: "center", padding: "80px 0" }}>
          <h1 className="serif" style={{ fontSize: 40, color: "var(--forest)", fontWeight: 500 }}>
            Article not found
          </h1>
          <Link className="btn btn-solid" to="/blog" style={{ marginTop: 20 }}>
            <span>Back to the journal</span>
          </Link>
        </div>
      </section>
    </SiteChrome>
  ),
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

function BlogPostPage() {
  const { post, related } = Route.useLoaderData() as LoaderData;
  return (
    <SiteChrome>
      <div className="wrap crumbs">
        <Link to="/">Home</Link> / <Link to="/blog">Journal</Link> / <span>{post.title}</span>
      </div>

      <article className="wrap" style={{ maxWidth: 780, paddingTop: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          {post.category && <span className="eyebrow">{post.category}</span>}
          <h1
            className="serif"
            style={{
              fontSize: 46,
              color: "var(--forest)",
              fontWeight: 500,
              lineHeight: 1.08,
              margin: "14px 0 12px",
            }}
          >
            {post.title}
          </h1>
          <div style={{ fontSize: 13, color: "var(--stone)" }}>
            By {post.author ?? "Himangi Pandey"} · {fmtDate(post.published_at)}
            {post.reading_minutes ? ` · ${post.reading_minutes} min read` : ""}
          </div>
        </div>

        <div
          className="frame tilt"
          data-label="Cover image"
          style={{ aspectRatio: "16 / 9", borderRadius: 4, marginBottom: 36 }}
        >
          {post.cover_image_url ? <img src={post.cover_image_url} alt={post.title} /> : null}
        </div>

        <div className="prose" dangerouslySetInnerHTML={{ __html: post.body ?? "" }} />

        <div
          style={{
            borderTop: "1px solid var(--line)",
            marginTop: 40,
            paddingTop: 26,
            textAlign: "center",
          }}
        >
          <Link className="btn btn-gold" to="/services">
            <span>Commission a piece</span>
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section>
          <div className="wrap">
            <div
              className="sec-head"
              style={{
                justifyContent: "center",
                textAlign: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span className="eyebrow rv">Keep reading</span>
              <h2 className="reveal-words">More from the journal</h2>
            </div>
            <div className="grid">
              {related.map((p, i) => (
                <Link
                  key={p.id}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
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
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteChrome>
  );
}
