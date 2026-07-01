import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { BeforeAfterSlider } from "../components/BeforeAfterSlider";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { waLink } from "../lib/whatsapp";
import { getCategories, type CategoryWithVisuals } from "../lib/categories";
import { ArrowRight, Palette, Pencil, Frame, Sparkles, Gift, Building2 } from "lucide-react";

const IMG = {
  // Hero images
  sketch: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
  portrait: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
  mirror: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80",
  clay: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
  // Before/After images
  sliderA1: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&q=80",
  sliderB1: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
  sliderA2: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
  sliderB2: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  sliderA3: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80",
  sliderB3: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  // Services
  painting: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
  gift: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
  gift2: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80",
  mirror2: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80",
  clay2: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
  portrait2: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
  sketch2: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&q=80",
};

const services = [
  { title: "Pencil Sketches", price: "From ₹999", img: IMG.sketch, icon: Pencil, days: "5–7 days" },
  { title: "Colour Portraits", price: "From ₹1,999", img: IMG.portrait, icon: Palette, days: "7–10 days" },
  { title: "Custom Paintings", price: "From ₹2,999", img: IMG.painting, icon: Frame, days: "10–14 days" },
  { title: "Mirror Art", price: "From ₹2,499", img: IMG.mirror, icon: Sparkles, days: "7–12 days" },
  { title: "Clay Art", price: "From ₹1,799", img: IMG.clay, icon: Gift, days: "7–10 days" },
  { title: "Personalized Gifts", price: "From ₹799", img: IMG.gift, icon: Gift, days: "5–10 days" },
];

const portfolioCategories = [
  { key: "pencil-sketches", label: "Pencil Sketches", subtitle: "Timeless. Precise.", img: IMG.sketch },
  { key: "colour-portraits", label: "Colour Portraits", subtitle: "Vivid. Warm.", img: IMG.portrait },
  { key: "paintings", label: "Paintings", subtitle: "Bold. Textured.", img: IMG.painting },
  { key: "mirror-art", label: "Mirror Art", subtitle: "Functional. Beautiful.", img: IMG.mirror },
  { key: "clay-art", label: "Clay Art", subtitle: "Three-dimensional. Personal.", img: IMG.clay },
  { key: "personalized-gifts", label: "Personalized Gifts", subtitle: "Made for one person.", img: IMG.gift },
];

const recentWork = [
  { id: 1, title: "Family Portrait", cat: "sketches", price: "From ₹999", img: IMG.sketch },
  { id: 2, title: "Sunset Canvas", cat: "paintings", price: "From ₹2,999", img: IMG.painting },
  { id: 3, title: "Couple Sketch", cat: "portraits", price: "From ₹1,999", img: IMG.portrait },
  { id: 4, title: "Clay Sculpture", cat: "clay", price: "From ₹1,799", img: IMG.clay },
  { id: 5, title: "Mirror Mandala", cat: "mirror", price: "From ₹2,499", img: IMG.mirror },
  { id: 6, title: "Gift Set", cat: "gifts", price: "From ₹799", img: IMG.gift },
];

const filters = [
  { key: "all", label: "All" },
  { key: "sketches", label: "Pencil Sketches" },
  { key: "portraits", label: "Colour Portraits" },
  { key: "paintings", label: "Paintings" },
  { key: "clay", label: "Clay Art" },
  { key: "mirror", label: "Mirror Art" },
  { key: "gifts", label: "Personalized Gifts" },
];

export const Route = createFileRoute("/")({
  loader: async () => {
    const categories = await getCategories().catch(() => []);
    return { categories: categories as CategoryWithVisuals[] };
  },
  head: () => ({
    meta: [
      { title: "Artspire | Artisanal Art Studio" },
      { name: "description", content: "Custom handmade pencil sketches, paintings, mirror art and clay sculptures from your favorite photos." },
    ],
  }),
  component: Index,
});

function Index() {
  const { categories } = Route.useLoaderData();
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <Layout>
      {/* ===== HERO ===== */}
      <section className="min-h-[100dvh] flex flex-col justify-center px-6 pt-16 pb-12 lg:flex-row lg:items-center lg:gap-16 lg:px-8 hero-texture">
        <div className="flex-[1.5] flex flex-col items-center text-center lg:items-start lg:text-left max-w-2xl">
          <p className="font-body text-[11px] md:text-[12px] font-semibold text-gold uppercase tracking-[0.25em] mb-5">
            Handmade. Personalized. Yours.
          </p>
          <h1 className="font-display text-[32px] sm:text-[36px] md:text-[48px] lg:text-[64px] leading-[1.05] text-forest mb-6 font-medium px-2 lg:px-0">
            Custom Handmade Art for Your Most Treasured Memories
          </h1>
          <p className="font-body text-[15px] md:text-[18px] leading-relaxed text-stone mb-10 max-w-lg">
            Transform your memories into handcrafted pencil sketches, paintings, and clay masterpieces.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-8">
            <a
              href={waLink("Hi Artspire! I want to commission artwork")}
              target="_blank"
              rel="noreferrer"
              className="h-[52px] md:h-[56px] px-8 bg-forest text-white font-body font-semibold text-[13px] md:text-[14px] uppercase rounded-xl flex items-center justify-center gap-2 active-scale btn-primary"
            >
              Commission Art <ArrowRight size={18} />
            </a>
            <Link
              to="/portfolio"
              className="h-[52px] md:h-[56px] px-8 bg-transparent border-2 border-forest text-forest font-body font-semibold text-[13px] md:text-[14px] uppercase rounded-xl flex items-center justify-center gap-2 active-scale btn-secondary"
            >
              View Portfolio
            </Link>
          </div>
          <p className="font-body text-[12px] md:text-[13px] font-medium text-stone">
            500+ Customers · 1000+ Artworks · 4.9★
          </p>
        </div>
        <div className="flex-1 w-full max-w-lg mt-10 lg:mt-0">
          <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden shadow-lg">
            {[IMG.sketch, IMG.portrait, IMG.mirror, IMG.clay].map((src, i) => {
              const alts = [
                "Handmade pencil sketch portrait by Artspire",
                "Custom colour portrait painting by Artspire",
                "Custom mirror art handcrafted by Artspire",
                "Clay art sculpture handcrafted by Artspire",
              ];
              return (
                <div key={i} className="aspect-square bg-surface-variant overflow-hidden">
                  <ImageWithFallback alt={alts[i]} className="w-full h-full object-cover img-zoom" src={src} loading={i === 0 ? "eager" : "lazy"} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="bg-white py-5 w-full border-y border-border/40">
        <div className="container-main text-center font-body text-[11px] md:text-[12px] font-semibold uppercase tracking-widest text-forest leading-relaxed">
          11+ Years <span className="text-gold mx-1 text-[16px] leading-none align-middle">•</span> 1000+ Artworks <span className="text-gold mx-1 text-[16px] leading-none align-middle">•</span> One Artist <span className="text-gold mx-1 text-[16px] leading-none align-middle">•</span> Handcrafted
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <h2 className="font-display text-[28px] md:text-[36px] text-center text-forest mb-4 leading-tight">
            What Would You Like to Create?
          </h2>
          <p className="font-body text-[14px] text-stone text-center mb-12 max-w-lg mx-auto">
            Choose from our signature handcrafted art services, each made with care and precision.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="bg-white rounded-xl overflow-hidden border border-border/60 flex flex-col hover-lift shadow-sm cursor-pointer card-stretch">
                  <div className="h-[180px] md:h-[200px] overflow-hidden">
                    <ImageWithFallback alt={s.title} className="w-full h-full object-cover img-zoom" src={s.img} loading="lazy" />
                  </div>
                  <div className="p-4 md:p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} className="text-gold" />
                      <h3 className="font-display text-[16px] md:text-[19px] text-forest font-medium leading-tight">{s.title}</h3>
                    </div>
                    <p className="font-body text-[13px] text-gold font-semibold mb-1">{s.price}</p>
                    <p className="font-body text-[11px] text-stone mb-3">{s.days}</p>
                    <Link
                      to="/portfolio"
                      className="font-body text-[12px] font-bold uppercase text-forest/70 flex items-center gap-1 hover:text-gold transition-colors mt-auto"
                    >
                      Examples <span className="material-symbols-outlined text-sm">east</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BEFORE & AFTER ===== */}
      <section className="section-padding bg-cream-dark">
        <div className="container-main">
          <h2 className="font-display text-[28px] md:text-[36px] text-center text-forest mb-4 leading-tight">
            Your Photo. Our Masterpiece.
          </h2>
          <p className="font-body text-[14px] text-stone text-center mb-12 max-w-lg mx-auto">
            See the transformation from photo to handcrafted art.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            <BeforeAfterSlider beforeSrc={IMG.sliderB1} afterSrc={IMG.sliderA1} caption="Pencil Sketch · 5 days" />
            <BeforeAfterSlider beforeSrc={IMG.sliderB2} afterSrc={IMG.sliderA2} caption="Color Portrait · 7 days" />
            <BeforeAfterSlider beforeSrc={IMG.sliderB3} afterSrc={IMG.sliderA3} caption="Custom Painting · 10 days" />
          </div>
          <div className="text-center mt-10 md:mt-12">
            <a
              href={waLink("Hi Artspire! I want to commission artwork")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[52px] bg-forest text-white font-body font-semibold text-[13px] md:text-[14px] uppercase rounded-xl active-scale btn-primary shadow-md items-center justify-center px-10"
            >
              Commission Your Artwork
            </a>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <h2 className="font-display text-[28px] md:text-[36px] text-center text-forest mb-4 leading-tight">
            Simple. Personal. Yours.
          </h2>
          <p className="font-body text-[14px] text-stone text-center mb-14 max-w-lg mx-auto">
            Four easy steps from idea to delivered artwork.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { n: "01", t: "Share Your Idea", d: "Send us your favorite photo and tell us what makes it special to you." },
              { n: "02", t: "We Discuss & Confirm", d: "We'll help you choose the best style and size, and share a final quote." },
              { n: "03", t: "Watch It Come to Life", d: "Receive updates as our artist meticulously crafts your one-of-a-kind piece." },
              { n: "04", t: "Delivered to Your Door", d: "Safely packaged and shipped right to you, ready to be displayed and cherished." },
            ].map((step, i) => (
              <div key={step.n} className="relative text-center px-4 py-8">
                <span className="process-step-num">{step.n}</span>
                {i < 3 && <div className="hidden lg:block process-divider" />}
                <div className="relative z-10">
                  <h3 className="font-display text-[18px] md:text-[20px] text-forest mb-3 font-medium mt-4">{step.t}</h3>
                  <p className="font-body text-[14px] leading-relaxed text-stone">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PORTFOLIO CATEGORIES ===== */}
      <section className="section-padding bg-cream-dark">
        <div className="container-main">
          <h2 className="font-display text-[28px] md:text-[36px] text-center text-forest mb-4 leading-tight">
            Explore by Category
          </h2>
          <p className="font-body text-[14px] text-stone text-center mb-12 max-w-lg mx-auto">
            Browse our handcrafted art collections.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/portfolio"
                search={{ category: cat.slug }}
                className="cat-card relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer group"
              >
                {/* Layer 1: Artwork image */}
                <img
                  src={cat.image_url ?? IMG.sketch}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Layer 2: Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                {/* Layer 3: Text */}
                <div className="relative z-10 flex flex-col items-center justify-end h-full p-5 pb-6">
                  <span className="font-display text-[18px] md:text-[22px] text-white font-medium drop-shadow-lg text-center">
                    {cat.name}
                  </span>
                  {cat.short_summary && (
                    <span className="font-body text-[13px] text-gold mt-1 font-medium">
                      {cat.short_summary}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECENT WORK ===== */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <h2 className="font-display text-[28px] md:text-[36px] text-center text-forest mb-4 leading-tight">
            Recent Work
          </h2>
          <p className="font-body text-[14px] text-stone text-center mb-10 max-w-lg mx-auto">
            A selection of our latest handcrafted commissions.
          </p>
          {/* Filter pills */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 mb-10 pb-2 justify-start md:justify-center">
            {filters.map((f) => {
              const active = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-5 py-2.5 rounded-full font-body text-[12px] md:text-[13px] font-bold whitespace-nowrap active-scale transition-all duration-200 ${
                    active
                      ? "bg-forest text-white shadow-md"
                      : "border border-border text-stone hover:border-forest/40 hover:text-forest"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          {/* 6 work cards matching categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {recentWork.map((w) => {
              const visible = activeFilter === "all" || w.cat === activeFilter;
              return (
                <div
                  key={w.id}
                  className="work-card portfolio-item rounded-xl overflow-hidden shadow-sm cursor-pointer h-[280px] md:h-[320px] flex flex-col group relative"
                  style={{ display: visible ? undefined : "none" }}
                >
                  {/* Layer 1: Artwork image (primary visual - 80%) */}
                  <img
                    src={w.img}
                    alt={w.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-block px-3 py-1 bg-gold/90 text-white font-body text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {w.cat}
                    </span>
                  </div>
                  {/* Layer 2: Gradient overlay for text readability (5%) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                  {/* Layer 3: Text content (5%) */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                    <span className="font-display text-[16px] md:text-[18px] text-white font-medium">{w.title}</span>
                    <p className="font-body text-[13px] text-gold font-semibold mt-1">{w.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/portfolio"
              className="inline-flex h-[48px] px-8 border-2 border-forest text-forest font-body font-semibold text-[13px] uppercase rounded-xl items-center justify-center gap-2 active-scale btn-secondary"
            >
              View All Work <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-padding bg-cream-dark">
        <div className="container-main">
          <h2 className="font-display text-[28px] md:text-[36px] text-center text-forest mb-12 leading-tight">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[
              { q: "She saw details I never mentioned. It's like she captured his soul, not just his face.", a: "— Rajiv M." },
              { q: "The clay sculpture made me cry. It's the most precious thing in our home now.", a: "— Sneha K." },
              { q: "She redid the eyes because she wasn't happy with them. That dedication to perfection is rare.", a: "— Anjali & Vikram S." },
            ].map((t, i) => (
              <div key={i} className="bg-white p-6 md:p-7 rounded-xl border-l-4 border-gold shadow-sm flex flex-col gap-3 hover-lift">
                <p className="font-accent text-[17px] md:text-[19px] italic text-forest leading-relaxed">"{t.q}"</p>
                <p className="font-body text-[13px] md:text-[14px] font-bold text-stone uppercase tracking-wider mt-auto">{t.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GIFTS ===== */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <h2 className="font-display text-[28px] md:text-[36px] text-center text-forest mb-4 leading-tight">
            Find the Perfect Gift
          </h2>
          <p className="font-body text-[14px] text-stone text-center mb-10 max-w-lg mx-auto">
            Handcrafted art for every special occasion.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
            {[
              { label: "For Parents", img: IMG.sketch2 },
              { label: "For Couples", img: IMG.portrait2 },
              { label: "New Home", img: IMG.mirror2 },
              { label: "Memorials", img: IMG.clay2 },
            ].map((g) => (
              <Link
                key={g.label}
                to="/portfolio"
                className="aspect-square relative rounded-xl overflow-hidden active-scale shadow-sm cursor-pointer group"
              >
                <ImageWithFallback alt={g.label} className="w-full h-full object-cover img-zoom" src={g.img} loading="lazy" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-2 text-center group-hover:bg-black/40 transition-colors duration-300">
                  <span className="font-display text-[18px] md:text-[22px] text-white font-medium drop-shadow-md">{g.label}</span>
                </div>
              </Link>
            ))}
          </div>
          <a
            href="mailto:Ajju_pandey@outlook.com?subject=Corporate%20%26%20Bulk%20Order%20Enquiry&body=Hi%20Artspire%20Team%2C%20I%20am%20interested%20in%20bulk%2Fcorporate%20orders."
            className="aspect-[21/9] relative rounded-xl overflow-hidden active-scale shadow-sm cursor-pointer group block"
          >
            <ImageWithFallback alt="Corporate & Bulk" className="w-full h-full object-cover img-zoom" src={IMG.painting} loading="lazy" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4 group-hover:bg-black/40 transition-colors duration-300">
              <div className="flex items-center gap-2">
                <Building2 size={20} className="text-white" />
                <span className="font-display text-[20px] md:text-[24px] text-white font-medium drop-shadow-md">Corporate & Bulk Orders</span>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ===== ABOUT HIMANGI ===== */}
      <section className="section-padding bg-cream-dark">
        <div className="container-main">
          <div className="flex flex-col items-center lg:flex-row lg:items-center lg:gap-14">
            <div className="w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden mb-8 lg:mb-0 shadow-md">
              <ImageWithFallback alt="Himangi — Artist at Artspire" className="w-full h-full object-cover img-zoom" src={IMG.sketch} loading="lazy" />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
              <p className="font-body text-[11px] font-bold text-gold mb-5 uppercase tracking-[0.25em]">
                The Artist Behind Artspire
              </p>
              <h2 className="font-display text-[32px] md:text-[36px] text-forest mb-5 font-medium">Hi, I'm Himangi.</h2>
              <p className="font-body text-[15px] leading-relaxed text-stone mb-6">
                For over 11 years, I've been helping people capture their most precious moments through art. Every stroke and detail is infused with passion and precision.
              </p>
              <Link
                to="/about"
                className="font-body text-[14px] font-bold text-gold border-b-2 border-gold/30 pb-1 active-scale hover:border-gold transition-colors"
              >
                Read My Story →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
