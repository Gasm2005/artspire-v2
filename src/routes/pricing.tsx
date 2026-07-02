import { createFileRoute } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { Layout } from "../components/Layout";
import { waLink } from "../lib/whatsapp";
import { getPageSEO } from "@/lib/website-content";

const tiers = [
  {
    tag: "Entry",
    title: "Small Sketches & Mini Prints",
    price: "From ₹999",
    desc: "Perfect for first-time buyers. Small format, full heart.",
    features: ["A5/A4 size", "Pencil sketch", "Single subject", "Standard delivery", "Digital preview"],
    popular: false,
  },
  {
    tag: "Standard",
    title: "Standard Portraits & Gifts",
    price: "From ₹1,800",
    desc: "Our most popular tier. Full-size commissions with complete detail.",
    features: ["A4/A3 size", "Any medium", "Up to 2 subjects", "Standard delivery", "Work-in-progress updates", "Free revision"],
    popular: true,
  },
  {
    tag: "Premium",
    title: "Large Format & Paintings",
    price: "From ₹3,500",
    desc: "Statement pieces. Maximum detail, maximum impact.",
    features: ["A3/A2 size", "Oil or acrylic canvas", "Multiple subjects", "Express delivery available", "Premium packaging", "Free framing option"],
    popular: false,
  },
];

const promises = [
  "Direct artist communication",
  "Work-in-progress previews",
  "Free revisions until you're happy",
  "Premium packaging",
  "Pan India shipping",
  "7-day satisfaction guarantee",
];

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing | Artspire" }, { name: "description", content: "Transparent, honest pricing for handcrafted commissions. No hidden charges." }] }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <Layout>
      {/* Header */}
      <section className="section-padding bg-cream text-center">
        <div className="container-main">
          <p className="font-body text-[11px] md:text-[12px] font-semibold text-gold mb-4 uppercase tracking-[0.25em]">Transparent Pricing</p>
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-forest font-medium mb-4">Honest Pricing for Honest Craft</h1>
          <p className="font-body text-[14px] md:text-[16px] text-stone max-w-xl mx-auto">Every piece is priced by size, medium, and complexity. No hidden charges. No surprises.</p>
        </div>
      </section>

      {/* Pricing Cards — 3 column grid */}
      <section className="pb-12 md:pb-16">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-start">
            {tiers.map((t) => (
              <div
                key={t.tag}
                className={`relative bg-white rounded-xl p-6 md:p-8 flex flex-col ${
                  t.popular
                    ? "border-2 border-gold shadow-lg md:-mt-4 md:mb-4"
                    : "border border-border/60 shadow-sm"
                }`}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white font-body text-[10px] font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                )}
                <p className="font-body text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-3">{t.tag}</p>
                <h3 className="font-display text-[18px] md:text-[20px] text-forest font-bold leading-tight mb-2">{t.title}</h3>
                <p className="font-display text-[24px] md:text-[28px] text-forest font-medium mb-4">{t.price}</p>
                <p className="font-body text-[13px] text-stone leading-relaxed mb-6">{t.desc}</p>
                <ul className="flex flex-col gap-3 mb-8">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={16} className="text-gold shrink-0 mt-0.5" />
                      <span className="font-body text-[13px] text-charcoal">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={waLink(`Hi Artspire! I'm interested in the ${t.tag} tier. Can you share more details?`)}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-auto flex items-center justify-center gap-2 h-[48px] rounded-xl text-[12px] font-bold uppercase tracking-wide active-scale transition-colors ${
                    t.popular
                      ? "bg-forest text-white hover:bg-forest-dark btn-primary"
                      : "border-2 border-forest text-forest hover:bg-forest hover:text-white btn-secondary"
                  }`}
                >
                  Get Started <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke tier */}
      <section className="pb-12 md:pb-16">
        <div className="container-main">
          <div className="bg-cream-dark rounded-xl border border-border/40 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="font-body text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-2">Bespoke</p>
              <h3 className="font-display text-[20px] md:text-[22px] text-forest font-bold mb-2">Corporate & Custom Installations</h3>
              <p className="font-body text-[13px] text-stone">For brands and bulk orders. Contact for a custom quote.</p>
            </div>
            <a
              href="mailto:Ajju_pandey@outlook.com?subject=Corporate%20%26%20Bulk%20Order%20Enquiry&body=Hi%20Artspire%20Team%2C%20I%20am%20interested%20in%20bulk%2Fcorporate%20orders."
              className="inline-flex items-center gap-2 h-[48px] px-6 border-2 border-forest text-forest text-[12px] font-bold uppercase tracking-wide rounded-xl hover:bg-forest hover:text-white transition-colors active-scale btn-secondary shrink-0"
            >
              Request Quote <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="pb-12 md:pb-16">
        <div className="container-main">
          <h2 className="font-display text-[24px] md:text-[28px] text-forest font-medium mb-8 text-center">What's Always Included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto">
            {promises.map((p) => (
              <div key={p} className="flex items-start gap-3 bg-cream-dark rounded-xl p-4 border border-border/40">
                <Check className="text-gold shrink-0 mt-0.5" size={18} />
                <span className="font-body text-[13px] text-charcoal">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-forest text-center">
        <div className="container-main max-w-2xl">
          <h2 className="font-display text-[26px] md:text-[32px] text-white font-medium mb-6">Ready to Commission?</h2>
          <a
            href={waLink("Hi Artspire! I want to commission artwork")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-[52px] px-10 bg-gold text-forest font-body font-bold text-[14px] tracking-wide rounded-full btn-gold transition-colors active-scale"
          >
            Get Your Custom Quote
          </a>
        </div>
      </section>
    </Layout>
  );
}
