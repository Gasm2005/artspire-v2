import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Layout } from "../components/Layout";
import { waLink } from "../lib/whatsapp";

const tiers = [
  { tag: "Entry", title: "Small Sketches & Mini Prints", price: "From ₹999", desc: "Perfect for first-time buyers. Small format, full heart." },
  { tag: "Core", title: "Standard Portraits & Gifts", price: "From ₹1,800", desc: "Our most popular tier. Full-size commissions with complete detail.", popular: true },
  { tag: "Premium", title: "Large Format & Paintings", price: "From ₹3,500", desc: "Statement pieces. Maximum detail, maximum impact." },
  { tag: "Bespoke", title: "Corporate & Custom Installations", price: "From ₹8,000", desc: "For brands and bulk orders. Contact for quote." },
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
      <section className="px-6 pt-12 pb-8 text-center">
        <p className="font-body text-[12px] font-semibold text-gold-accent mb-4 uppercase tracking-[0.2em]">Transparent Pricing</p>
        <h1 className="font-display text-[32px] leading-[1.15] text-primary font-medium mb-4">Honest Pricing for Honest Craft</h1>
        <p className="font-body text-[14px] leading-relaxed text-on-surface-variant">
          Every piece is priced by size, medium, and complexity. No hidden charges. No surprises.
        </p>
      </section>

      <section className="px-6 pb-12 flex flex-col gap-4">
        {tiers.map((t) => (
          <div
            key={t.tag}
            className={`relative bg-surface-container rounded-xl p-5 ${t.popular ? "border-2 border-gold-accent" : "border border-outline-variant/40"}`}
          >
            {t.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-accent text-deep-forest font-body text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <p className="font-body text-[10px] font-bold text-gold-accent uppercase tracking-[0.2em] mb-2">{t.tag}</p>
            <h3 className="font-display text-[20px] text-primary leading-tight mb-1">{t.title}</h3>
            <p className="font-display text-[22px] text-on-surface font-medium mb-3">{t.price}</p>
            <p className="font-body text-[13px] leading-relaxed text-on-surface-variant">{t.desc}</p>
          </div>
        ))}
      </section>

      <section className="px-6 pb-12">
        <h2 className="font-display text-[24px] text-primary font-medium mb-5 text-center">What's Always Included</h2>
        <div className="grid grid-cols-2 gap-3">
          {promises.map((p) => (
            <div key={p} className="flex items-start gap-2 bg-surface-container rounded-md p-3">
              <Check className="text-gold-accent shrink-0 mt-0.5" size={18} />
              <span className="font-body text-[12px] leading-snug text-on-surface">{p}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-deep-forest px-8 py-14 text-center">
        <h2 className="font-display text-[26px] text-white leading-tight mb-6">Ready to Commission?</h2>
        <a
          href={waLink("Hi Himangi, I'd like a custom quote.")}
          className="inline-block bg-gold-accent text-deep-forest font-body font-bold text-[14px] tracking-wide px-8 py-3 rounded-full active-scale"
        >
          Get Your Custom Quote
        </a>
      </section>
    </Layout>
  );
}
