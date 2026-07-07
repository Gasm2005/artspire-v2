import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "../components/Layout";
import { waLink } from "../lib/whatsapp";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { getPageSEO, getWebsiteContent, type WebsiteContent } from "@/lib/website-content";

const IMG = {
  sketch: "https://picsum.photos/seed/artspire-about1/600/400",
  studio: "https://picsum.photos/seed/artspire-studio/600/400",
  work: "https://picsum.photos/seed/artspire-work/600/400",
};

const beliefs = [
  "I believe in authenticity. Every piece is made by hand — never printed, never machine-made.",
  "I believe in personal connection. From your first message to delivery, you speak directly to me.",
  "I believe in quality over convenience. If it doesn't feel right, I start over.",
];

const trust = ["11+ Years", "1000+ Memories Created", "One Pair of Hands", "Handcrafted"];

const milestones = [
  { num: "11+", label: "Years of Experience" },
  { num: "1000+", label: "Artworks Created" },
  { num: "500+", label: "Happy Clients" },
  { num: "4.9", label: "Star Rating" },
];

export const Route = createFileRoute("/about")({
  loader: async () => {
    const [seo, content] = await Promise.all([
      getPageSEO("about").catch(() => ({ title: null, description: null, ogImage: null })),
      getWebsiteContent({ page: "about", activeOnly: true }).catch(() => []),
    ]);
    return { seo, content: content as WebsiteContent[] };
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    return {
      meta: [
        { title: seo?.title ?? "About | Artspire" },
        { name: "description", content: seo?.description ?? "Meet Himangi — the artist behind Artspire and the philosophy behind every handcrafted piece." },
        ...(seo?.ogImage ? [{ property: "og:image", content: seo.ogImage }] : []),
      ],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  const { content } = Route.useLoaderData();
  const cv = (key: string, fallback: string) =>
    content.find((c) => c.content_key === key)?.value_text ?? fallback;

  return (
    <Layout>
      {/* Hero / Intro */}
      <section className="section-padding bg-cream text-center">
        <div className="container-main">
          <p className="font-body text-[11px] md:text-[12px] font-semibold text-gold mb-4 uppercase tracking-[0.25em]">The Artist Behind Artspire</p>
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-forest font-medium mb-6">Every Artwork Begins With a Story. Yours.</h1>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-body text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-stone">
            {trust.map((t, i) => (
              <span key={t} className="flex items-center gap-3">
                {t}
                {i < trust.length - 1 && <span className="text-gold">·</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Artist Image + Story */}
      <section className="pb-12 md:pb-16">
        <div className="container-main">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-14">
            <div className="w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden mb-8 lg:mb-0 shadow-lg">
              <ImageWithFallback alt="Himangi working in her studio" className="w-full h-full object-cover img-zoom" src={cv("about.hero.image", IMG.sketch)} />
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="font-display text-[24px] md:text-[28px] text-forest font-medium mb-4">Why Artspire Exists</h2>
              <p className="font-body text-[14px] md:text-[15px] leading-relaxed text-stone mb-8">
                {cv("about.why.content", "Think about the last time you wanted to give someone something truly original. Not something pulled from a shelf. Not a name stamped on a mug. Something that captured them — the way they laugh, the memory that still makes your chest ache. That gap — between wanting something deeply personal and finding a way to create it — is exactly where Artspire was born.")}
              </p>
              <h2 className="font-display text-[24px] md:text-[28px] text-forest font-medium mb-4">What I Believe</h2>
              <div className="flex flex-col gap-4">
                {beliefs.map((b, i) => (
                  <div key={i} className="bg-cream-dark border-l-4 border-gold rounded-r-xl p-4 md:p-5">
                    <p className="font-body text-[13px] md:text-[14px] leading-relaxed text-charcoal">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-12 md:pb-16">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {milestones.map((m) => (
              <div key={m.label} className="bg-white rounded-xl border border-border/60 p-5 md:p-6 text-center hover-lift">
                <p className="font-display text-[32px] md:text-[40px] text-gold font-bold leading-none mb-2">{m.num}</p>
                <p className="font-body text-[12px] md:text-[13px] text-stone uppercase tracking-wider">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="pb-12 md:pb-16">
        <div className="container-main">
          <div className="flex flex-col lg:flex-row-reverse lg:items-center lg:gap-14">
            <div className="w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden mb-8 lg:mb-0 shadow-lg">
              <ImageWithFallback alt="Artwork in progress" className="w-full h-full object-cover img-zoom" src={cv("about.story.image", IMG.studio)} />
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="font-display text-[24px] md:text-[28px] text-forest font-medium mb-4">The Night I Started Over</h2>
              <p className="font-body text-[14px] md:text-[15px] leading-relaxed text-stone mb-8">
                {cv("about.night.content", "A client needed a portrait — a birthday gift for a local MLA. Timeline: seven days. By day six, the portrait was nearly finished. But something felt wrong. Not wrong in a way a client would notice. Wrong in a way only the artist can feel. I faced a choice: deliver what I had, or admit it wasn't good enough. I chose to start over. Entirely. When he saw the final portrait, he held it — and handed me an additional ₹1,000. Voluntarily. \"This,\" he said, \"is what I wanted.\"")}
              </p>
              <h2 className="font-display text-[24px] md:text-[28px] text-forest font-medium mb-4">Why Clients Return</h2>
              <p className="font-body text-[14px] md:text-[15px] leading-relaxed text-stone">
                {cv("about.return.content", "Trust is not built through marketing. When you describe the way your father's eyes crinkle when he laughs, I hear it from you directly. Over 1,000 completed artworks have taught me what lasts.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — cream background for visual separation before footer */}
      <section className="section-padding bg-cream text-center">
        <div className="container-main max-w-2xl">
          <h2 className="font-display text-[26px] md:text-[32px] text-forest font-medium mb-3">Tell Me Your Idea</h2>
          <p className="font-body text-[14px] md:text-[16px] text-stone mb-8 leading-relaxed">You don't need a plan. Just a memory that matters.</p>
          <a
            href={waLink("Hi Himangi, I have an idea I'd love to share with you.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-[52px] px-10 bg-forest text-white font-body font-bold text-[14px] tracking-wide rounded-full btn-primary hover:bg-forest-dark transition-colors active-scale"
          >
            Start Your Conversation
          </a>
        </div>
      </section>
    </Layout>
  );
}
