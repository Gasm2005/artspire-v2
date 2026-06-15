import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { BeforeAfterSlider } from "../components/BeforeAfterSlider";
import { waLink } from "../lib/whatsapp";

const IMG = {
  sketch: "https://picsum.photos/seed/artspire-sketch/600/400",
  oil: "https://picsum.photos/seed/artspire-oil/600/400",
  mirror: "https://picsum.photos/seed/artspire-mirror/600/400",
  clay: "https://picsum.photos/seed/artspire-clay/600/400",
  painting: "https://picsum.photos/seed/artspire-painting/600/400",
  sliderA1: "https://picsum.photos/seed/artspire-after1/600/400",
  sliderB1: "https://picsum.photos/seed/artspire-before1/600/400",
  sliderA2: "https://picsum.photos/seed/artspire-after2/600/400",
  sliderB2: "https://picsum.photos/seed/artspire-before2/600/400",
  sliderA3: "https://picsum.photos/seed/artspire-after3/600/400",
  sliderB3: "https://picsum.photos/seed/artspire-before3/600/400",
  port1: "https://picsum.photos/seed/artspire-port1/600/400",
  port2: "https://picsum.photos/seed/artspire-port2/600/400",
  port3: "https://picsum.photos/seed/artspire-port3/600/400",
};

const services = [
  { title: "Pencil Sketches", price: "From ₹1,200", img: IMG.sketch },
  { title: "Color Portraits", price: "From ₹2,500", img: IMG.oil },
  { title: "Custom Paintings", price: "From ₹3,500", img: IMG.painting },
  { title: "Mirror Art", price: "From ₹2,500", img: IMG.mirror },
  { title: "Clay Art", price: "From ₹1,800", img: IMG.clay },
  { title: "Personalized Gifts", price: "From ₹999", img: IMG.sketch },
];

const portfolio = [
  { cat: "sketches", img: IMG.port1, alt: "Sketch 1" },
  { cat: "paintings", img: IMG.port2, alt: "Painting 1" },
  { cat: "clay", img: IMG.port3, alt: "Clay 1" },
  { cat: "mirror", img: IMG.mirror, alt: "Mirror 1" },
];

const filters = [
  { key: "all", label: "All" },
  { key: "sketches", label: "Sketches" },
  { key: "paintings", label: "Paintings" },
  { key: "clay", label: "Clay Art" },
  { key: "mirror", label: "Mirror" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Artspire | Artisanal Art Studio" },
      { name: "description", content: "Custom handmade pencil sketches, paintings, mirror art and clay sculptures from your favorite photos." },
    ],
  }),
  component: Index,
});

function Index() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <Layout>
      {/* Hero */}
      <section className="px-6 pt-12 pb-16 flex flex-col items-center text-center">
        <p className="font-body text-[12px] font-semibold text-gold-accent mb-4 uppercase tracking-[0.2em]">
          Handmade. Personalized. Yours.
        </p>
        <h1 className="font-display text-[36px] leading-[1.1] text-primary mb-5 font-medium px-2">
          Custom Handmade Art for Your Most Treasured Memories
        </h1>
        <p className="font-body text-[15px] leading-relaxed text-on-surface-variant mb-8">
          Transform your memories into handcrafted pencil sketches, paintings, and clay masterpieces.
        </p>
        <a href={waLink("Hi Himangi! I'd love to commission a custom artwork.")} className="w-full h-[54px] bg-primary text-white font-body font-semibold text-sm uppercase rounded-lg flex items-center justify-center gap-3 mb-10 active-scale">
          Chat on WhatsApp <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </a>
        <div className="grid grid-cols-2 gap-1.5 mb-6 w-full rounded-xl overflow-hidden shadow-sm">
          {[IMG.sketch, IMG.oil, IMG.mirror, IMG.clay].map((src, i) => {
            const alts = [
              "Handmade pencil sketch portrait by Artspire",
              "Custom colour portrait painting by Artspire",
              "Custom mirror art handcrafted by Artspire",
              "Clay art sculpture handcrafted by Artspire",
            ];
            return (
              <div key={i} className="aspect-square bg-surface-variant">
                <img alt={alts[i]} className="w-full h-full object-cover" src={src} />
              </div>
            );
          })}
        </div>
        <p className="font-body text-[13px] font-medium text-deep-forest/70">
          500+ Customers · 1000+ Artworks · 4.9★
        </p>
      </section>

      {/* Trust Strip */}
      <section className="bg-white py-5 w-full border-y border-outline-variant/20">
        <div className="text-center font-body text-[12px] font-semibold uppercase tracking-widest text-deep-forest px-4 leading-relaxed">
          11+ Years <span className="text-gold-accent mx-1 text-[16px] leading-none align-middle">•</span> 1000+ Artworks <span className="text-gold-accent mx-1 text-[16px] leading-none align-middle">•</span> One Artist <span className="text-gold-accent mx-1 text-[16px] leading-none align-middle">•</span> Handcrafted
        </div>
      </section>

      {/* Services */}
      <section className="px-6 py-16 bg-background">
        <h2 className="font-display text-[32px] text-center text-primary mb-10 leading-tight">
          What Would You Like to Create?
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {services.map((s) => (
            <div key={s.title} className="bg-white rounded-xl overflow-hidden border border-outline-variant/30 flex flex-col active-scale shadow-sm">
              <div className="aspect-[4/3] overflow-hidden">
                <img alt={s.title} className="w-full h-full object-cover" src={s.img} />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-display text-[19px] text-primary mb-1 leading-tight font-medium">{s.title}</h3>
                <p className="font-body text-[13px] text-gold-accent font-semibold mb-3 mt-auto">{s.price}</p>
                <div className="font-body text-[12px] font-bold uppercase text-primary/80 flex items-center gap-1">
                  Examples <span className="material-symbols-outlined text-sm">east</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Before & After */}
      <section className="px-6 py-16 bg-[#F7F2EB]">
        <h2 className="font-display text-[32px] text-center text-primary mb-10 leading-tight">
          Your Photo. Our Masterpiece.
        </h2>
        <div className="flex flex-col gap-10">
          <BeforeAfterSlider beforeSrc={IMG.sliderB1} afterSrc={IMG.sliderA1} caption="Pencil Sketch · 5 days" />
          <BeforeAfterSlider beforeSrc={IMG.sliderB2} afterSrc={IMG.sliderA2} caption="Color Portrait · 7 days" />
          <BeforeAfterSlider beforeSrc={IMG.sliderB3} afterSrc={IMG.sliderA3} caption="Custom Painting · 10 days" />
        </div>
        <a href={waLink("Hi Himangi! I'd like to commission a custom artwork.")} className="w-full h-[52px] bg-primary text-white font-body font-semibold text-sm uppercase rounded-lg mt-10 active-scale shadow-md flex items-center justify-center">
          Commission Your Artwork
        </a>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-white">
        <h2 className="font-display text-[32px] text-center text-primary mb-12 leading-tight">
          Simple. Personal. Yours.
        </h2>
        <div className="relative pl-6">
          <div className="absolute left-[38px] top-6 bottom-10 w-0 border-l-2 border-dashed border-gold-accent opacity-40" />
          <div className="flex flex-col gap-12">
            {[
              { n: 1, t: "Share Your Idea", d: "Send us your favorite photo and tell us what makes it special to you." },
              { n: 2, t: "We Discuss & Confirm", d: "We'll help you choose the best style and size, and share a final quote." },
              { n: 3, t: "Watch It Come to Life", d: "Receive updates as our artist meticulously crafts your one-of-a-kind piece." },
              { n: 4, t: "Delivered to Your Door", d: "Safely packaged and shipped right to you, ready to be displayed and cherished." },
            ].map((step) => (
              <div key={step.n} className="flex gap-8 items-start relative z-10">
                <div className="font-display text-[52px] text-gold-accent/20 leading-none bg-white py-1 w-12 text-center shrink-0 font-medium">
                  {step.n}
                </div>
                <div className="pt-2">
                  <h3 className="font-display text-[20px] text-primary mb-2 font-medium">{step.t}</h3>
                  <p className="font-body text-[15px] leading-relaxed text-on-surface-variant">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-16 bg-[#F7F2EB]">
        <div className="px-6">
          <h2 className="font-display text-[32px] text-center text-primary mb-8 leading-tight">Recent Work</h2>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-3 px-6 mb-8 pb-2">
          {filters.map((f) => {
            const active = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-6 py-2.5 rounded-full font-body text-[13px] font-bold whitespace-nowrap active-scale ${
                  active
                    ? "bg-primary text-white"
                    : "border border-outline-variant text-on-surface-variant"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-1.5 px-6">
          {portfolio.map((p, i) => {
            const visible = activeFilter === "all" || p.cat === activeFilter;
            return (
              <div
                key={i}
                className="portfolio-item aspect-square bg-surface-variant rounded-lg overflow-hidden"
                style={{ display: visible ? undefined : "none" }}
              >
                <img alt={p.alt} className="w-full h-full object-cover" src={p.img} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 bg-background">
        <h2 className="font-display text-[32px] text-center text-primary mb-12 leading-tight">
          What Our Clients Say
        </h2>
        <div className="flex flex-col gap-5">
          {[
            { q: "She saw details I never mentioned. It's like she captured his soul, not just his face.", a: "— Rajiv M." },
            { q: "The clay sculpture made me cry. It's the most precious thing in our home now.", a: "— Sneha K." },
            { q: "She redid the eyes because she wasn't happy with them. That dedication to perfection is rare.", a: "— Anjali & Vikram S." },
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border-l-4 border-gold-accent shadow-sm flex flex-col gap-3">
              <p className="font-accent text-[19px] italic text-deep-forest leading-relaxed">"{t.q}"</p>
              <p className="font-body text-[14px] font-bold text-on-surface-variant uppercase tracking-wider">{t.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gifts */}
      <section className="px-6 py-20 bg-white">
        <h2 className="font-display text-[32px] text-center text-primary mb-10 leading-tight">Find the Perfect Gift</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { label: "For Parents", img: IMG.sketch },
            { label: "For Couples", img: IMG.oil },
            { label: "New Home", img: IMG.mirror },
            { label: "Memorials", img: IMG.clay },
          ].map((g) => (
            <div key={g.label} className="aspect-square relative rounded-xl overflow-hidden active-scale shadow-sm">
              <img alt={g.label} className="w-full h-full object-cover" src={g.img} />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-2 text-center">
                <span className="font-display text-[22px] text-white font-medium drop-shadow-md">{g.label}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="aspect-[21/9] relative rounded-xl overflow-hidden active-scale shadow-sm">
          <img alt="Corporate & Bulk" className="w-full h-full object-cover" src={IMG.painting} />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
            <span className="font-display text-[24px] text-white font-medium drop-shadow-md">Corporate & Bulk</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-20 bg-deep-forest text-center">
        <h2 className="font-display text-[32px] text-white mb-4 leading-tight">
          Ready to bring your memories to life?
        </h2>
        <p className="font-body text-white/80 mb-10 leading-relaxed text-[15px]">
          Let's collaborate on a piece of art that you'll cherish forever.
        </p>
        <a href={waLink("Hi Himangi! I'd like to start an order.")} className="w-full h-[56px] bg-gold-accent text-white font-body font-bold text-sm uppercase rounded-full shadow-lg active-scale flex items-center justify-center">
          Start Your Order
        </a>
      </section>

      {/* About Himangi */}
      <section className="px-6 py-20 bg-surface-container">
        <div className="flex flex-col items-center">
          <p className="font-body text-[11px] font-bold text-gold-accent mb-6 uppercase tracking-[0.25em]">
            The Artist Behind Artspire
          </p>
          <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8 shadow-md">
            <img alt="Himangi" className="w-full h-full object-cover" src={IMG.sketch} />
          </div>
          <h2 className="font-display text-[36px] text-primary mb-5 font-medium">Hi, I'm Himangi.</h2>
          <p className="font-body text-[15px] leading-relaxed text-on-surface-variant mb-6 text-center">
            For over 11 years, I've been helping people capture their most precious moments through art. Every stroke and detail is infused with passion and precision.
          </p>
          <Link to="/about" className="font-body text-[14px] font-bold text-gold-accent border-b-2 border-gold-accent/30 pb-1 active-scale">
            Read My Story →
          </Link>
        </div>
      </section>
    </Layout>
  );
}
