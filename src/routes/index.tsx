import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "../components/Layout";
import { BeforeAfterSlider } from "../components/BeforeAfterSlider";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { waLink } from "../lib/whatsapp";
import { getCategories, type CategoryWithVisuals } from "../lib/categories";
import { getWebsiteContent, getPageSEO, type WebsiteContent } from "../lib/website-content";
import { getArtworks, type ArtworkWithCategory } from "../lib/artworks";
import { ArrowRight, Palette, Pencil, Frame, Sparkles, Gift, Building2 } from "lucide-react";

// ─── Static fallback images (until real photography exists) ──
const IMG = {
  sketch:   "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
  portrait: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
  mirror:   "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80",
  clay:     "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
  painting: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
  gift:     "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
  sliderA1: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&q=80",
  sliderB1: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
  sliderA2: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
  sliderB2: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  sliderA3: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80",
  sliderB3: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  himangi:  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
};

// ─── Services data ─────────────────────────────────────────
const services = [
  { title: "Pencil Sketches",    img: IMG.sketch,   icon: Pencil,   days: "5–7 days" },
  { title: "Colour Portraits",   img: IMG.portrait, icon: Palette,  days: "7–10 days" },
  { title: "Custom Paintings",   img: IMG.painting, icon: Frame,    days: "10–14 days" },
  { title: "Mirror Art",         img: IMG.mirror,   icon: Sparkles, days: "7–12 days" },
  { title: "Clay Art",           img: IMG.clay,     icon: Gift,     days: "7–10 days" },
  { title: "Personalised Gifts", img: IMG.gift,     icon: Gift,     days: "5–10 days" },
];

// ─── Route ────────────────────────────────────────────────
export const Route = createFileRoute("/")({
  loader: async () => {
    const [categories, content, seo, homepageArtworks] = await Promise.all([
      getCategories().catch(() => []),
      getWebsiteContent({ page: "homepage", activeOnly: true }).catch(() => []),
      getPageSEO("homepage").catch(() => ({ title: null, description: null, ogImage: null })),
      getArtworks({ status: "published", limit: 6, orderBy: "display_order" }).catch(() => []),
    ]);
    return {
      categories: categories as CategoryWithVisuals[],
      content: content as WebsiteContent[],
      seo,
      homepageArtworks: homepageArtworks as ArtworkWithCategory[],
    };
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    return {
      meta: [
        { title: seo?.title ?? "Artspire | Handmade Pencil Sketches & Custom Art by Himangi Pandey" },
        { name: "description", content: seo?.description ?? "Commission handcrafted pencil sketches, portraits, paintings, clay art and personalised gifts from photo. Made by Himangi Pandey, Kanpur. Delivered across India." },
        ...(seo?.ogImage ? [{ property: "og:image", content: seo.ogImage }] : []),
      ],
    };
  },
  component: Index,
});

function Index() {
  const { categories, content, homepageArtworks } = Route.useLoaderData();

  // DB value → fallback helper
  const cv = (key: string, fallback: string) =>
    content.find((c) => c.content_key === key)?.value_text ?? fallback;

  // Only show real artworks if we have them; hide the section if empty
  const hasRealWork = homepageArtworks.length > 0;

  return (
    <Layout>

      {/* ═══════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════ */}
      <section className="min-h-[100dvh] flex flex-col justify-center px-6 pt-20 pb-12 lg:flex-row lg:items-center lg:gap-16 lg:px-8 hero-texture">
        <div className="flex-[1.5] flex flex-col items-center text-center lg:items-start lg:text-left max-w-2xl">

          {/* Provenance — who, where */}
          <p className="font-body text-[11px] md:text-[12px] font-semibold text-gold uppercase tracking-[0.3em] mb-6">
            {cv("homepage.hero.tagline", "Himangi Pandey · Kanpur, India")}
          </p>

          {/* H1 — brand identity + SEO keywords combined */}
          <h1 className="font-display text-[32px] sm:text-[38px] md:text-[52px] lg:text-[66px] leading-[1.04] text-forest mb-6 font-medium">
            {cv("homepage.hero.heading", "Handmade Pencil Sketches & Custom Art from Your Photos")}
          </h1>

          <p className="font-body text-[15px] md:text-[17px] leading-relaxed text-stone mb-8 max-w-lg">
            {cv("homepage.hero.subheading", "Each piece drawn by hand — one stroke at a time. Commission a pencil sketch, portrait, or clay sculpture that captures someone you love.")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-6">
            <a
              href={waLink("Hi Artspire! I want to commission artwork")}
              target="_blank"
              rel="noreferrer"
              className="h-[52px] md:h-[56px] px-8 bg-forest text-white font-body font-semibold text-[13px] uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 active-scale btn-primary"
            >
              {cv("homepage.hero.cta_text", "Commission a Piece")} <ArrowRight size={16} />
            </a>
            <Link
              to="/portfolio"
              className="h-[52px] md:h-[56px] px-8 bg-transparent border border-forest/50 text-forest font-body font-semibold text-[13px] uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 active-scale"
            >
              View the Portfolio
            </Link>
          </div>

          {/* Availability signal — admin-editable, high conversion impact */}
          <p className="font-body text-[12px] text-stone/60 italic">
            {cv("homepage.hero.availability", "Currently accepting commissions for July 2026")}
          </p>
        </div>

        {/* Hero image grid */}
        <div className="flex-1 w-full max-w-lg mt-10 lg:mt-0">
          <div className="grid grid-cols-2 gap-2 rounded-sm overflow-hidden shadow-lg">
            {[
              { key: "homepage.hero.image_1", fallback: IMG.sketch,   alt: "Handmade pencil sketch portrait by Artspire" },
              { key: "homepage.hero.image_2", fallback: IMG.portrait, alt: "Custom colour portrait painting by Artspire" },
              { key: "homepage.hero.image_3", fallback: IMG.mirror,   alt: "Custom mirror art by Artspire" },
              { key: "homepage.hero.image_4", fallback: IMG.clay,     alt: "Clay art sculpture by Artspire" },
            ].map((img, i) => (
              <div key={i} className="aspect-square bg-surface-variant overflow-hidden">
                <ImageWithFallback
                  alt={img.alt}
                  className="w-full h-full object-cover img-zoom"
                  src={cv(img.key, img.fallback)}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST STRIP — editorial, not metric
          ═══════════════════════════════════════════════════ */}
      <section className="bg-white py-5 w-full border-y border-border/40">
        <div className="container-main text-center font-body text-[11px] md:text-[12px] text-stone/60 leading-relaxed tracking-widest uppercase">
          {cv("homepage.trust_strip.text", "Eleven years of meticulous craft · One artist · Every piece made by hand")}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ABOUT THE ARTIST — moved up to position 3
          The human is the product. Introduce her before services.
          ═══════════════════════════════════════════════════ */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <div className="flex flex-col items-center lg:flex-row lg:items-center lg:gap-16">
            <div className="w-full lg:w-5/12 aspect-[4/3] rounded-sm overflow-hidden mb-8 lg:mb-0 shadow-md shrink-0">
              <ImageWithFallback
                alt="Himangi Pandey — artist at Artspire, Kanpur"
                className="w-full h-full object-cover img-zoom"
                src={cv("homepage.about.image", IMG.himangi)}
                loading="lazy"
              />
            </div>
            <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left">
              <p className="font-body text-[11px] font-bold text-gold mb-4 uppercase tracking-[0.3em]">
                {cv("homepage.about.tagline", "The Artist")}
              </p>
              <h2 className="font-display text-[28px] md:text-[36px] text-forest mb-5 font-medium leading-tight">
                {cv("homepage.about.heading", "Hi, I'm Himangi.")}
              </h2>

              {/* GEO entity paragraph — dense, accurate, citable by AI tools */}
              <p className="font-body text-[14px] md:text-[15px] leading-relaxed text-stone mb-3">
                {cv("homepage.about.description",
                  "I am a visual artist based in Kanpur, India, working in pencil, graphite, colour, clay, and mirror. Since 2013 I have completed over 1,000 handmade commissions — portraits of parents, newborns, couples, pets, and people no longer here but never forgotten."
                )}
              </p>
              <p className="font-body text-[14px] md:text-[15px] leading-relaxed text-stone mb-7">
                {cv("homepage.about.description_2",
                  "Every piece I make is drawn or sculpted by my hands alone. I take on a limited number of commissions each month so I can give each one the full attention it deserves."
                )}
              </p>
              <Link
                to="/about"
                className="font-body text-[13px] font-semibold text-forest border-b border-forest/30 pb-0.5 hover:border-forest transition-colors tracking-wide"
              >
                {cv("homepage.about.cta_text", "Read my story →")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          BEFORE & AFTER
          ═══════════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <p className="font-body text-[11px] font-semibold text-gold uppercase tracking-[0.3em] text-center mb-3">
            The Transformation
          </p>
          <h2 className="font-display text-[26px] md:text-[34px] text-center text-forest mb-3 leading-tight">
            {cv("homepage.before_after.heading", "Your Photo. Her Hands. One Irreplaceable Piece.")}
          </h2>
          <p className="font-body text-[13px] md:text-[14px] text-stone text-center mb-12 max-w-md mx-auto">
            {cv("homepage.before_after.subheading", "Drag the slider to see each transformation.")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            <BeforeAfterSlider
              beforeSrc={cv("homepage.before_after.before_1", IMG.sliderB1)}
              afterSrc={cv("homepage.before_after.after_1", IMG.sliderA1)}
              caption={cv("homepage.before_after.caption_1", "Pencil Sketch · 5 days")}
            />
            <BeforeAfterSlider
              beforeSrc={cv("homepage.before_after.before_2", IMG.sliderB2)}
              afterSrc={cv("homepage.before_after.after_2", IMG.sliderA2)}
              caption={cv("homepage.before_after.caption_2", "Colour Portrait · 7 days")}
            />
            <BeforeAfterSlider
              beforeSrc={cv("homepage.before_after.before_3", IMG.sliderB3)}
              afterSrc={cv("homepage.before_after.after_3", IMG.sliderA3)}
              caption={cv("homepage.before_after.caption_3", "Custom Painting · 10 days")}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SERVICES — no prices on homepage
          ═══════════════════════════════════════════════════ */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <p className="font-body text-[11px] font-semibold text-gold uppercase tracking-[0.3em] text-center mb-3">
            What Himangi Makes
          </p>
          <h2 className="font-display text-[26px] md:text-[34px] text-center text-forest mb-3 leading-tight">
            {cv("homepage.services.heading", "Six Kinds of Handmade Art")}
          </h2>
          <p className="font-body text-[13px] md:text-[14px] text-stone text-center mb-12 max-w-md mx-auto">
            {cv("homepage.services.subheading", "Each medium is a different way to hold a memory.")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {services.map((s, i) => {
              const Icon = s.icon;
              const title = cv(`homepage.services.${i}.title`, s.title);
              const days  = cv(`homepage.services.${i}.days`, s.days);
              const imgSrc = cv(`homepage.services.${i}.image`, s.img);
              return (
                <Link
                  key={s.title}
                  to="/portfolio"
                  search={{ category: title.toLowerCase().replace(/\s+/g, "-") }}
                  className="group bg-white rounded-sm overflow-hidden border border-border/60 flex flex-col hover-lift shadow-sm"
                >
                  <div className="h-[180px] md:h-[200px] overflow-hidden">
                    <ImageWithFallback
                      alt={title}
                      className="w-full h-full object-cover img-zoom"
                      src={imgSrc}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 md:p-5 flex flex-col flex-grow">
                    <h3 className="font-display text-[17px] md:text-[20px] text-forest font-medium leading-tight mb-1">
                      {title}
                    </h3>
                    <p className="font-body text-[11px] text-stone/50 mb-3">{days}</p>
                    <span className="font-body text-[11px] font-semibold uppercase tracking-widest text-forest/50 group-hover:text-gold transition-colors mt-auto flex items-center gap-1">
                      See examples <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/services"
              className="font-body text-[12px] font-semibold text-stone/60 border-b border-stone/20 pb-0.5 hover:text-forest hover:border-forest transition-colors tracking-wide uppercase"
            >
              View full pricing and details →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CATEGORIES
          ═══════════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <p className="font-body text-[11px] font-semibold text-gold uppercase tracking-[0.3em] text-center mb-3">
            Browse by Medium
          </p>
          <h2 className="font-display text-[26px] md:text-[34px] text-center text-forest mb-12 leading-tight">
            {cv("homepage.categories.heading", "Explore the Collection")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/portfolio"
                search={{ category: cat.slug }}
                className="cat-card relative rounded-sm overflow-hidden aspect-[4/3] cursor-pointer group"
              >
                <img
                  src={cat.image_url ?? IMG.sketch}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent z-10" />
                <div className="relative z-10 flex flex-col items-start justify-end h-full p-5 pb-6">
                  <span className="font-display text-[18px] md:text-[21px] text-white font-medium drop-shadow-lg">
                    {cat.name}
                  </span>
                  {cat.short_summary && (
                    <span className="font-body text-[12px] text-white/70 mt-0.5">
                      {cat.short_summary}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          RECENT WORK — only shown when real artworks exist
          Fake placeholder data actively harms credibility.
          ═══════════════════════════════════════════════════ */}
      {hasRealWork && (
        <section className="section-padding bg-cream">
          <div className="container-main">
            <p className="font-body text-[11px] font-semibold text-gold uppercase tracking-[0.3em] text-center mb-3">
              Recent Commissions
            </p>
            <h2 className="font-display text-[26px] md:text-[34px] text-center text-forest mb-12 leading-tight">
              {cv("homepage.recent_work.heading", "From the Studio")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {homepageArtworks.slice(0, 6).map((artwork) => (
                <Link
                  key={artwork.id}
                  to="/artwork/$slug"
                  params={{ slug: artwork.slug }}
                  preload="intent"
                  className="group relative rounded-sm overflow-hidden h-[280px] md:h-[320px] shadow-sm block"
                >
                  <img
                    src={artwork.image_url ?? IMG.sketch}
                    alt={artwork.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="font-display text-[16px] md:text-[18px] text-white font-medium leading-snug">
                      {artwork.title}
                    </p>
                    {artwork.categories?.name && (
                      <p className="font-body text-[11px] text-white/60 mt-0.5">
                        {artwork.categories.name}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 h-[48px] px-8 border border-forest text-forest font-body font-semibold text-[12px] uppercase tracking-wider rounded-sm active-scale hover:bg-forest hover:text-white transition-colors"
              >
                View All Work <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          TESTIMONIALS — featured + supporting
          ═══════════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <p className="font-body text-[11px] font-semibold text-gold uppercase tracking-[0.3em] text-center mb-12">
            {cv("homepage.testimonials.heading", "What clients say")}
          </p>

          {/* Featured testimonial — full width, display type */}
          <blockquote className="text-center mb-12 max-w-2xl mx-auto">
            <p className="font-accent text-[22px] md:text-[28px] italic text-forest leading-relaxed mb-5">
              "{cv("homepage.testimonials.1_quote", "She saw details I never mentioned. It's like she captured his soul, not just his face.")}"
            </p>
            <footer className="font-body text-[11px] text-stone/50 uppercase tracking-[0.2em]">
              {cv("homepage.testimonials.1_author", "— Rajiv M., Delhi · Portrait commission")}
            </footer>
          </blockquote>

          {/* Two supporting quotes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                qKey: "homepage.testimonials.2_quote",
                aKey: "homepage.testimonials.2_author",
                q: "The clay sculpture made me cry. It's the most precious thing in our home now.",
                a: "— Sneha K., Mumbai · Clay sculpture",
              },
              {
                qKey: "homepage.testimonials.3_quote",
                aKey: "homepage.testimonials.3_author",
                q: "She redid the eyes because she wasn't happy with them. That dedication is rare.",
                a: "— Anjali & Vikram S., Bengaluru · Couple portrait",
              },
            ].map((t, i) => (
              <blockquote key={i} className="border-l-2 border-gold/30 pl-5">
                <p className="font-accent text-[16px] md:text-[17px] italic text-stone leading-relaxed mb-3">
                  "{cv(t.qKey, t.q)}"
                </p>
                <footer className="font-body text-[10px] text-stone/40 uppercase tracking-[0.2em]">
                  {cv(t.aKey, t.a)}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          GIFTS — personal occasions only (no corporate)
          ═══════════════════════════════════════════════════ */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <p className="font-body text-[11px] font-semibold text-gold uppercase tracking-[0.3em] text-center mb-3">
            The Perfect Gift
          </p>
          <h2 className="font-display text-[26px] md:text-[34px] text-center text-forest mb-3 leading-tight">
            {cv("homepage.gifts.heading", "Art for Every Occasion")}
          </h2>
          <p className="font-body text-[13px] md:text-[14px] text-stone text-center mb-12 max-w-md mx-auto">
            {cv("homepage.gifts.subheading", "A handmade portrait is the only gift that cannot be bought in a store.")}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { labelKey: "homepage.gifts.card_1_label", imgKey: "homepage.gifts.card_1_image", label: "For Parents",  img: IMG.sketch },
              { labelKey: "homepage.gifts.card_2_label", imgKey: "homepage.gifts.card_2_image", label: "For Couples",  img: IMG.portrait },
              { labelKey: "homepage.gifts.card_3_label", imgKey: "homepage.gifts.card_3_image", label: "New Home",     img: IMG.mirror },
              { labelKey: "homepage.gifts.card_4_label", imgKey: "homepage.gifts.card_4_image", label: "In Memory Of", img: IMG.clay },
            ].map((g) => (
              <Link
                key={g.label}
                to="/portfolio"
                className="aspect-square relative rounded-sm overflow-hidden active-scale group"
              >
                <ImageWithFallback
                  alt={cv(g.labelKey, g.label)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={cv(g.imgKey, g.img)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300 flex items-end p-4">
                  <span className="font-display text-[16px] md:text-[19px] text-white font-medium leading-tight">
                    {cv(g.labelKey, g.label)}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Corporate — separate, lower visual weight */}
          <div className="mt-4 border border-border/50 rounded-sm px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Building2 size={18} className="text-stone/40 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-display text-[15px] text-forest font-medium">
                  {cv("homepage.gifts.corporate_label", "Corporate & Bulk Orders")}
                </p>
                <p className="font-body text-[12px] text-stone/50">Custom artwork for events, offices, and gifting programmes</p>
              </div>
            </div>
            <a
              href="mailto:Ajju_pandey@outlook.com?subject=Corporate%20%26%20Bulk%20Order%20Enquiry&body=Hi%20Artspire%20Team%2C%20I%20am%20interested%20in%20bulk%2Fcorporate%20orders."
              className="shrink-0 font-body text-[12px] font-semibold text-forest border border-forest/30 hover:border-forest rounded-sm px-4 py-2 transition-colors"
            >
              Enquire →
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CLOSING CTA — simple, confident
          ═══════════════════════════════════════════════════ */}
      <section className="section-padding bg-forest text-white text-center">
        <div className="container-main max-w-2xl">
          <h2 className="font-display text-[28px] md:text-[38px] mb-5 leading-tight font-medium">
            {cv("homepage.cta.heading", "Ready to commission something extraordinary?")}
          </h2>
          <p className="font-body text-[14px] text-white/70 mb-8 leading-relaxed">
            {cv("homepage.cta.subheading", "Tell Himangi about the person, the memory, or the occasion. She'll take care of the rest.")}
          </p>
          <a
            href={waLink("Hi Artspire! I want to commission artwork")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-[52px] px-10 bg-white text-forest font-body font-semibold text-[13px] uppercase tracking-wider rounded-sm active-scale hover:bg-cream transition-colors"
          >
            Start the Conversation <ArrowRight size={16} />
          </a>
          <p className="font-body text-[11px] text-white/40 mt-5 italic">
            {cv("homepage.hero.availability", "Currently accepting commissions for July 2026")}
          </p>
        </div>
      </section>

    </Layout>
  );
}
