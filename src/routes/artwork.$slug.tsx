import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { waLink } from "@/lib/whatsapp";
import {
  getPublishedArtworkBySlug,
  getArtworkTags,
  getRelatedArtworks,
  getArtworkFAQs,
  getSEOMetadata,
  type ArtworkWithCategory,
  type Tag,
  type FAQ,
} from "@/lib";
import {
  buildArtworkStructuredData,
  buildBreadcrumbStructuredData,
} from "@/lib/seo";
import { ChevronDown, MessageCircle, Palette, Ruler, Tag as TagIcon, IndianRupee } from "lucide-react";

interface LoaderData {
  artwork: ArtworkWithCategory;
  tags: Tag[];
  related: ArtworkWithCategory[];
  faqs: FAQ[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
  } | null;
}

export const Route = createFileRoute("/artwork/$slug")({
  loader: async ({ params }): Promise<LoaderData> => {
    const artwork = await getPublishedArtworkBySlug(params.slug);
    if (!artwork) {
      throw notFound();
    }

    const [tags, related, faqs, seoMeta] = await Promise.all([
      getArtworkTags(artwork.id),
      getRelatedArtworks(artwork.id, artwork.category_id, 4),
      getArtworkFAQs(artwork.id),
      getSEOMetadata("artwork", artwork.id),
    ]);

    const metaTitle = seoMeta?.meta_title ?? artwork.title;
    const metaDescription = seoMeta?.meta_description ?? artwork.summary ?? `View ${artwork.title} by Artspire — handcrafted custom art.`;
    const ogImage = seoMeta?.og_image_url ?? artwork.image_url ?? "";

    return {
      artwork,
      tags,
      related,
      faqs,
      seo: {
        metaTitle,
        metaDescription,
        ogImage,
      },
    };
  },

  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { artwork, seo } = loaderData;
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://artspire.in";
    const pageUrl = `${siteUrl}/artwork/${artwork.slug}`;

    const structuredData = buildArtworkStructuredData({
      title: artwork.title,
      summary: artwork.summary ?? "",
      image_url: artwork.image_url ?? "",
      price: artwork.price ?? 0,
      created_at: artwork.created_at,
      slug: artwork.slug,
      status: artwork.status,
      currency: artwork.currency ?? "INR",
      category: artwork.categories?.name ?? undefined,
    });

    const breadcrumbData = buildBreadcrumbStructuredData([
      { name: "Home", item: siteUrl },
      { name: "Portfolio", item: `${siteUrl}/portfolio` },
      { name: artwork.title, item: pageUrl },
    ]);

    return {
      meta: [
        { title: `${seo?.metaTitle ?? artwork.title} | Artspire` },
        { name: "description", content: seo?.metaDescription ?? "" },
        { property: "og:title", content: seo?.metaTitle ?? artwork.title },
        { property: "og:description", content: seo?.metaDescription ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:image", content: seo?.ogImage ?? "" },
        { property: "og:url", content: pageUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seo?.metaTitle ?? artwork.title },
        { name: "twitter:description", content: seo?.metaDescription ?? "" },
        { name: "twitter:image", content: seo?.ogImage ?? "" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(structuredData),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbData),
        },
      ],
    };
  },

  component: ArtworkPage,
  notFoundComponent: () => (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-[48px] text-forest">404</h1>
          <p className="font-body text-stone mt-2">Artwork not found</p>
        </div>
      </div>
    </Layout>
  ),
});

function ArtworkPage() {
  const { artwork, tags, related, faqs } = Route.useLoaderData() as LoaderData;
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const storyHtml = parseStoryContent(artwork.story_content);

  return (
    <Layout>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        {artwork.image_url ? (
          <>
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-forest to-deep-forest" />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container-main">
            {artwork.categories?.name && (
              <span className="inline-block px-3 py-1 bg-gold/90 text-white font-body text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
                {artwork.categories.name}
              </span>
            )}
            <h1 className="font-display text-[28px] md:text-[48px] text-white font-medium leading-tight">
              {artwork.title}
            </h1>
          </div>
        </div>
      </section>

      {/* ─── Story & Details ──────────────────────────────────── */}
      <section className="section-padding bg-cream">
        <div className="container-main grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Left column: story */}
          <div className="md:col-span-8">
            <h2 className="font-display text-[22px] md:text-[28px] text-forest font-medium mb-4">
              About this Piece
            </h2>
            <p className="font-body text-[14px] md:text-[16px] text-stone leading-relaxed mb-6">
              {artwork.summary}
            </p>
            {storyHtml && (
              <div
                className="font-body text-[14px] md:text-[16px] text-stone leading-relaxed prose prose-stone max-w-none"
                dangerouslySetInnerHTML={{ __html: storyHtml }}
              />
            )}
          </div>

          {/* Right column: details */}
          <div className="md:col-span-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
              <h3 className="font-display text-[18px] text-forest font-medium mb-4">
                Artwork Details
              </h3>
              <dl className="space-y-3">
                {artwork.medium && (
                  <div className="flex items-center gap-3">
                    <Palette size={16} className="text-gold shrink-0" />
                    <div>
                      <dt className="font-body text-[11px] text-stone/60 uppercase tracking-wider">Medium</dt>
                      <dd className="font-body text-[14px] text-forest font-medium">{artwork.medium}</dd>
                    </div>
                  </div>
                )}
                {artwork.size && (
                  <div className="flex items-center gap-3">
                    <Ruler size={16} className="text-gold shrink-0" />
                    <div>
                      <dt className="font-body text-[11px] text-stone/60 uppercase tracking-wider">Size</dt>
                      <dd className="font-body text-[14px] text-forest font-medium">{artwork.size}</dd>
                    </div>
                  </div>
                )}
                {artwork.price != null && artwork.price > 0 && (
                  <div className="flex items-center gap-3">
                    <IndianRupee size={16} className="text-gold shrink-0" />
                    <div>
                      <dt className="font-body text-[11px] text-stone/60 uppercase tracking-wider">Price</dt>
                      <dd className="font-body text-[14px] text-forest font-medium">
                        ₹{artwork.price.toLocaleString("en-IN")}
                      </dd>
                    </div>
                  </div>
                )}
                {tags.length > 0 && (
                  <div className="flex items-start gap-3">
                    <TagIcon size={16} className="text-gold shrink-0 mt-0.5" />
                    <div>
                      <dt className="font-body text-[11px] text-stone/60 uppercase tracking-wider mb-1">Tags</dt>
                      <dd className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2.5 py-1 bg-forest/5 text-forest font-body text-[11px] rounded-full"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>

              {/* Commission CTA */}
              <div className="mt-6 pt-6 border-t border-border">
                <a
                  href={waLink(`Hi Artspire, I'm interested in "${artwork.title}". Can you tell me more?`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-[48px] bg-gold text-forest font-body font-bold text-[13px] rounded-xl btn-gold transition-colors"
                >
                  <MessageCircle size={16} />
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQs ─────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-main max-w-3xl">
            <h2 className="font-display text-[22px] md:text-[28px] text-forest font-medium mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-border rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="flex items-center justify-between w-full p-4 md:p-5 text-left"
                  >
                    <span className="font-body text-[14px] md:text-[15px] text-forest font-medium pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-stone transition-transform duration-200 ${
                        openFaq === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-4 md:px-5 pb-4 md:pb-5">
                      <p className="font-body text-[13px] md:text-[14px] text-stone leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Related Artworks ───────────────────────────────── */}
      {related.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-main">
            <h2 className="font-display text-[22px] md:text-[28px] text-forest font-medium mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {related.map((item) => (
                <a
                  key={item.id}
                  href={`/artwork/${item.slug}`}
                  className="group block rounded-xl overflow-hidden shadow-sm bg-white hover-lift"
                >
                  <div className="relative h-[220px] md:h-[260px] overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-forest/10 to-gold/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="font-display text-[15px] text-white font-medium">
                        {item.title}
                      </span>
                      {item.price != null && item.price > 0 && (
                        <p className="font-body text-[12px] text-gold font-semibold mt-1">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Commission CTA ─────────────────────────────────── */}
      <section className="section-padding bg-forest text-center">
        <div className="container-main max-w-2xl">
          <h2 className="font-display text-[24px] md:text-[32px] text-white font-medium mb-3">
            Want Something Similar?
          </h2>
          <p className="font-body text-[14px] md:text-[16px] text-cream/70 mb-8 leading-relaxed">
            Every piece is custom made. Share your idea and I'll bring it to life.
          </p>
          <a
            href={waLink("Hi Artspire, I'd like to commission a custom piece similar to what I just saw.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-[52px] px-8 bg-gold text-forest font-body font-bold text-[14px] tracking-wide rounded-full btn-gold transition-colors active-scale"
          >
            <MessageCircle size={18} />
            Start a Commission
          </a>
        </div>
      </section>
    </Layout>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

function parseStoryContent(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") return parsed;
    if (parsed && typeof parsed === "object") {
      // If it's a TipTap/ProseMirror JSON doc, convert to HTML
      if (parsed.type === "doc" && Array.isArray(parsed.content)) {
        return convertTipTapToHtml(parsed);
      }
      return JSON.stringify(parsed);
    }
    return String(parsed);
  } catch {
    // Not JSON, treat as plain HTML/string
    return raw;
  }
}

function convertTipTapToHtml(node: Record<string, unknown>): string {
  if (!node || typeof node !== "object") return "";

  if (node.type === "text") {
    const text = String(node.text ?? "");
    const marks = node.marks as Array<{ type: string; attrs?: Record<string, unknown> }> | undefined;
    if (!marks) return escapeHtml(text);
    return marks.reduce((acc, mark) => {
      switch (mark.type) {
        case "bold": return `<strong>${acc}</strong>`;
        case "italic": return `<em>${acc}</em>`;
        case "link": return `<a href="${escapeHtml(String(mark.attrs?.href ?? "#"))}" target="_blank" rel="noopener noreferrer">${acc}</a>`;
        default: return acc;
      }
    }, escapeHtml(text));
  }

  if (node.type === "paragraph") {
    const content = (node.content as Array<Record<string, unknown>>) ?? [];
    return `<p>${content.map(convertTipTapToHtml).join("")}</p>`;
  }

  if (node.type === "heading") {
    const level = Math.min(Math.max(Number(node.level ?? 1), 1), 6);
    const content = (node.content as Array<Record<string, unknown>>) ?? [];
    return `<h${level}>${content.map(convertTipTapToHtml).join("")}</h${level}>`;
  }

  if (node.type === "bulletList") {
    const content = (node.content as Array<Record<string, unknown>>) ?? [];
    return `<ul>${content.map(convertTipTapToHtml).join("")}</ul>`;
  }

  if (node.type === "orderedList") {
    const content = (node.content as Array<Record<string, unknown>>) ?? [];
    return `<ol>${content.map(convertTipTapToHtml).join("")}</ol>`;
  }

  if (node.type === "listItem") {
    const content = (node.content as Array<Record<string, unknown>>) ?? [];
    return `<li>${content.map(convertTipTapToHtml).join("")}</li>`;
  }

  if (node.type === "doc" || Array.isArray(node.content)) {
    const content = (node.content as Array<Record<string, unknown>>) ?? [];
    return content.map(convertTipTapToHtml).join("");
  }

  return "";
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
