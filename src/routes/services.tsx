import type React from "react";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "../components/Layout";
import { waLink } from "../lib/whatsapp";

type Service = {
  image: string;
  label: string;
  headline: string;
  tagline: string;
  tags: string[];
  description: string;
  price: string;
  timeline: string;
  button: string;
  message: string;
};

const services: Service[] = [
  {
    image: "https://picsum.photos/seed/sketch1/600/400",
    label: "PENCIL SKETCHES",
    headline: "Pencil Sketch Portraits",
    tagline: "Timeless. Precise. Deeply personal.",
    tags: ["Anniversary", "Memorial", "Parent Portraits"],
    description:
      "A pencil sketch captures what a photograph cannot — the quiet emotion behind a face, the weight of a memory, the details only someone who truly looks would notice. Every line drawn by hand. Nothing printed. Nothing AI-generated.",
    price: "From ₹999",
    timeline: "⏱ 5–7 days",
    button: "Commission a Sketch",
    message:
      "Hi Artspire! I'm interested in a custom pencil sketch portrait. Can you share sizes and pricing?",
  },
  {
    image: "https://picsum.photos/seed/portrait1/600/400",
    label: "COLOUR PORTRAITS",
    headline: "Custom Colour Portraits",
    tagline: "Vivid. Warm. Painted just for you.",
    tags: ["Couples", "Birthdays", "Home Decor"],
    description:
      "Colour brings a face to life in a way black and white cannot. Watercolour and acrylic portraits painted by hand — layer by layer — until the person looking back from the canvas feels real enough to speak.",
    price: "From ₹1,999",
    timeline: "⏱ 7–10 days",
    button: "Commission a Portrait",
    message:
      "Hi Artspire! I'd love a custom colour portrait. What styles and sizes do you offer?",
  },
  {
    image: "https://picsum.photos/seed/painting1/600/400",
    label: "PAINTINGS",
    headline: "Custom Paintings on Canvas",
    tagline: "Bold. Textured. Made to last a lifetime.",
    tags: ["Home Decor", "Corporate", "Large Commissions"],
    description:
      "A painting on canvas carries a physical presence no photograph can replicate. Oil, acrylic, or watercolour — each medium chosen for what the subject deserves. Pieces that define a room and start conversations for decades.",
    price: "From ₹2,999",
    timeline: "⏱ 10–14 days",
    button: "Commission a Painting",
    message:
      "Hi Artspire! I'm interested in a custom painting on canvas. Can we discuss size and medium options?",
  },
  {
    image: "https://picsum.photos/seed/mirror1/600/400",
    label: "MIRROR ART",
    headline: "Custom Mirror Art — Handmade Wall Art",
    tagline: "Functional. Beautiful. Unlike anything else on your wall.",
    tags: ["Weddings", "Anniversary", "New Home"],
    description:
      "Hand-engraved and hand-painted mirror art catches light differently at every hour — a piece that is both art and object, both gift and heirloom. Cannot be mass-produced. Cannot be printed. Only made, by hand, for you.",
    price: "From ₹2,499",
    timeline: "⏱ 7–12 days",
    button: "Commission Mirror Art",
    message:
      "Hi Artspire! I'd love to know more about your custom mirror art. What designs and sizes are available?",
  },
  {
    image: "https://picsum.photos/seed/clay1/600/400",
    label: "CLAY ART",
    headline: "Custom Clay Art Portraits",
    tagline: "Three-dimensional. Personal. Impossible to forget.",
    tags: ["Birthdays", "Couples", "Pets", "Baby Gifts"],
    description:
      "Nothing surprises someone like seeing a person they love sculpted in three dimensions by a human hand. Clay miniatures capture the tilt of a head, the curve of a smile, the exact way a pet sits when it thinks no one is watching. Handcrafted. One of a kind. Yours.",
    price: "From ₹1,799",
    timeline: "⏱ 7–10 days",
    button: "Commission Clay Art",
    message:
      "Hi Artspire! I'm interested in a custom clay art piece. Can you share examples and pricing?",
  },
  {
    image: "https://picsum.photos/seed/gifts1/600/400",
    label: "PERSONALIZED GIFTS",
    headline: "Personalized Art Gifts — Custom Handmade",
    tagline: "Made for one person. Impossible to replicate.",
    tags: ["Festivals", "Farewell", "Corporate", "Birthdays"],
    description:
      "Some occasions deserve more than a single artwork. Personalised gift sets combine mediums and care into one package that feels complete the moment it is unwrapped. Not assembled. Not printed. Made — specifically for the person whose name is on it.",
    price: "From ₹799",
    timeline: "⏱ 5–10 days",
    button: "Explore Gift Options",
    message:
      "Hi Artspire! I'm looking for a personalized handmade gift. Can you help me decide what would work best?",
  },
];

const promises = [
  { icon: "🕐", title: "Standard Delivery", body: "5–14 days from confirmation. Timeline confirmed at order.", highlight: false },
  { icon: "⚡", title: "Express Option", body: "Need it sooner? 3–7 day delivery available. Ask us on WhatsApp.", highlight: true },
  { icon: "🚚", title: "Pan India Shipping", body: "Every pin code. Premium courier. Full tracking provided.", highlight: false },
  { icon: "🔄", title: "Free Revisions", body: "Not happy with the proof? We redo it. No arguments.", highlight: false },
  { icon: "📦", title: "Premium Packaging", body: "Rigid tube or flat mailer. No bends. Gift-ready on arrival.", highlight: false },
  { icon: "🛡️", title: "7-Day Guarantee", body: "Damaged or wrong artwork? We remake it. Free. No questions.", highlight: false },
];

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Custom Handmade Art Services India | Pencil Sketches, Portraits & More | Artspire" },
      {
        name: "description",
        content:
          "Commission handmade pencil sketches, colour portraits, paintings, mirror art, clay art and personalized gifts from Artspire India. Every artwork made by hand. Starting from ₹799. WhatsApp to order.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServiceCard({ s }: { s: Service }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article
      className="bg-white rounded-xl overflow-hidden"
      style={{ display: "flex", flexDirection: "column", height: "100%", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <img
        src={s.image}
        alt={s.headline}
        loading="lazy"
        className="w-full object-cover"
        style={{ height: "160px" }}
      />
      <div
        className="flex flex-col gap-2"
        style={{ display: "flex", flexDirection: "column", flex: "1", padding: "12px" }}
      >
        <div className="flex flex-col gap-2 flex-1">
          <p
            className="font-semibold uppercase"
            style={{ color: "#C9A227", fontSize: "11px", letterSpacing: "2px" }}
          >
            {s.label}
          </p>
          <h3
            className="font-display font-bold leading-tight"
            style={{ color: "#3E4D3A", fontSize: "18px", fontFamily: "'Cormorant Garamond', serif" }}
          >
            {s.headline}
          </h3>
          <p
            className="font-display italic leading-snug"
            style={{ color: "#6D7D68", fontSize: "13px", fontFamily: "'Cormorant Garamond', serif" }}
          >
            {s.tagline}
          </p>
          <div className="flex flex-wrap gap-1">
            {s.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border"
                style={{
                  fontSize: "10px",
                  color: "#6D7D68",
                  borderColor: "#6D7D68",
                  padding: "2px 8px",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <p
            style={{
              color: "#2F2F2F",
              fontSize: "13px",
              lineHeight: 1.5,
              display: expanded ? "block" : "-webkit-box",
              WebkitLineClamp: expanded ? "unset" : 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {s.description}
          </p>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-left"
            style={{ color: "#C9A227", fontSize: "12px", fontWeight: 600 }}
          >
            {expanded ? "Read less ↑" : "Read more →"}
          </button>
          <div className="flex items-center justify-between pt-1">
            <span style={{ color: "#C9A227", fontWeight: 700, fontSize: "14px" }}>{s.price}</span>
            <span style={{ color: "#6D7D68", fontSize: "12px" }}>{s.timeline}</span>
          </div>
        </div>
        <a
          href={waLink(s.message)}
          className="flex items-center justify-center w-full text-white uppercase active-scale"
          style={{
            backgroundColor: "#6D7D68",
            height: "auto",
            borderRadius: "8px",
            fontSize: "11px",
            fontWeight: 600,
            marginTop: "4px",
            letterSpacing: "0.3px",
            paddingTop: "10px",
            paddingBottom: "10px",
            textAlign: "center",
            lineHeight: "1.3",
          }}
        >
          {s.button}
        </a>
      </div>
    </article>
  );
}

function ServicesPage() {
  return (
    <Layout>
      <div
        style={{
          backgroundColor: "#F7F2EB",
          fontFamily: "Montserrat, sans-serif",
        } as React.CSSProperties}
      >
        {/* 1. Page Header */}
        <section className="px-6 pt-12 pb-8 text-center">
          <p
            className="font-semibold uppercase mb-4"
            style={{ color: "#C9A227", fontSize: "12px", letterSpacing: "3px" }}
          >
            What I Create
          </p>
          <h1
            className="font-bold mb-4"
            style={{
              color: "#3E4D3A",
              fontSize: "32px",
              lineHeight: 1.15,
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Handcrafted Art for Every Occasion
          </h1>
          <p style={{ color: "#2F2F2F", fontSize: "14px", lineHeight: 1.6 }}>
            Every piece is made by hand. Every commission begins with your story.
          </p>
        </section>

        {/* 2. Service Cards — 2 column grid */}
        <section
          className="grid grid-cols-2"
          style={{ gap: "12px", padding: "0 16px 32px", alignItems: "stretch" }}
        >
          {services.map((s) => (
            <ServiceCard key={s.label} s={s} />
          ))}
        </section>

        {/* 3. Our Promise to You */}
        <section
          className="mx-4 mb-10"
          style={{
            backgroundColor: "rgba(109,125,104,0.08)",
            borderLeft: "4px solid #C9A227",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <h2
            className="font-bold"
            style={{
              color: "#3E4D3A",
              fontSize: "28px",
              fontFamily: "'Cormorant Garamond', serif",
              marginBottom: "8px",
            }}
          >
            Our Promise to You
          </h2>
          <p style={{ color: "#2F2F2F", fontSize: "14px", marginBottom: "16px" }}>
            Every order comes with complete clarity on timing, revisions and delivery.
          </p>
          <div className="grid grid-cols-2" style={{ gap: "12px" }}>
            {promises.map((p) => (
              <div
                key={p.title}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                  padding: "12px",
                  border: p.highlight ? "1px solid #C9A227" : "1px solid transparent",
                }}
              >
                <div style={{ fontSize: "20px", marginBottom: "4px" }}>{p.icon}</div>
                <p
                  className="font-display font-semibold"
                  style={{
                    color: "#3E4D3A",
                    fontSize: "15px",
                    fontFamily: "'Cormorant Garamond', serif",
                    marginBottom: "4px",
                  }}
                >
                  {p.title}
                </p>
                <p style={{ color: "#2F2F2F", fontSize: "12px", lineHeight: 1.4 }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
          <p
            className="text-center"
            style={{ color: "#2F2F2F", fontSize: "13px", margin: "16px 0 12px" }}
          >
            Questions about delivery or revisions? Ask us on WhatsApp — we reply within 2 hours.
          </p>
          <a
            href={waLink("Hi Artspire! I have a question about delivery and revisions.")}
            className="flex items-center justify-center w-full text-white active-scale"
            style={{
              backgroundColor: "#6D7D68",
              height: "48px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Ask on WhatsApp
          </a>
        </section>

        {/* 4. Bottom CTA */}
        <section
          className="text-center"
          style={{ backgroundColor: "#3E4D3A", padding: "40px 20px" }}
        >
          <h2
            className="font-bold"
            style={{
              color: "#FFFFFF",
              fontSize: "32px",
              lineHeight: 1.2,
              fontFamily: "'Cormorant Garamond', serif",
              marginBottom: "16px",
            }}
          >
            Not Sure Which Art Is Right for Your Occasion?
          </h2>
          <p
            className="mx-auto"
            style={{
              color: "#F7F2EB",
              fontSize: "15px",
              lineHeight: 1.6,
              maxWidth: "320px",
              marginBottom: "24px",
            }}
          >
            Tell me who it is for, what the occasion is, and your budget. I will tell you exactly what will make them remember this gift for the rest of their life.
          </p>
          <a
            href={waLink("Hi Artspire! I'm not sure which artwork type would work best for my occasion. Can you help me decide?")}
            className="flex items-center justify-center w-full active-scale uppercase"
            style={{
              backgroundColor: "#C9A227",
              color: "#3E4D3A",
              height: "52px",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "8px",
              letterSpacing: "1px",
            }}
          >
            Let's Talk — WhatsApp Me
          </a>
        </section>
      </div>
    </Layout>
  );
}
