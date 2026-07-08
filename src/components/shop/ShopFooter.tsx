import { Link } from "@tanstack/react-router";

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "All Pieces", to: "/shop" },
      { label: "Collections", to: "/shop" },
      { label: "Gift Cards", to: "/shop" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Craftsmanship", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping", to: "/faq" },
      { label: "Returns", to: "/faq" },
      { label: "Care Guide", to: "/faq" },
      { label: "FAQs", to: "/faq" },
    ],
  },
];

/**
 * Shop-specific footer. Simpler than the main site footer —
 * commerce-focused columns, no WhatsApp CTA (shop uses cart/checkout,
 * not WhatsApp commissioning).
 */
export function ShopFooter() {
  return (
    <footer className="bg-forest text-cream mt-0">
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-[22px] tracking-[0.1em] uppercase">Artspire</span>
            <p className="font-body text-[13px] text-cream/60 leading-relaxed mt-3">
              Handmade objects for the home — made slowly, kept for a lifetime.
            </p>
          </div>
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-cream/50 mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="font-body text-[13px] text-cream/70 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-cream/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-[12px] text-cream/40">© 2026 Artspire. All rights reserved.</p>
          <Link to="/" className="font-body text-[12px] text-cream/50 hover:text-white transition-colors">
            ← Back to Artspire main site
          </Link>
        </div>
      </div>
    </footer>
  );
}
