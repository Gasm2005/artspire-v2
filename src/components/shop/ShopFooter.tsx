import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { Loader2, Check } from "lucide-react";

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
      { label: "Track Order", to: "/track-order" },
    ],
  },
];

/**
 * Shop-specific footer. Simpler than the main site footer —
 * commerce-focused columns, no WhatsApp CTA (shop uses cart/checkout,
 * not WhatsApp commissioning).
 */
export function ShopFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubscribe() {
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      await subscribeToNewsletter({ email: email.trim(), source: "footer" });
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="bg-forest text-cream mt-0">
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-[22px] tracking-[0.1em] uppercase">Artspire</span>
            <p className="font-body text-[13px] text-cream/60 leading-relaxed mt-3">
              Handmade objects for the home — made slowly, kept for a lifetime.
            </p>
            <div className="mt-5">
              <h3 className="font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-cream/50 mb-2.5">
                Get 10% off your first piece
              </h3>
              {status === "done" ? (
                <p className="flex items-center gap-1.5 font-body text-[13px] text-gold">
                  <Check size={14} /> You're on the list!
                </p>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                    placeholder="you@example.com"
                    className="flex-1 h-[38px] px-3 rounded-lg bg-white/10 border border-cream/20 font-body text-[13px] text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold"
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={status === "loading"}
                    className="h-[38px] px-4 rounded-lg bg-gold text-forest font-body text-[12px] font-bold hover:bg-gold/90 transition-colors disabled:opacity-60 flex items-center gap-1.5 shrink-0"
                  >
                    {status === "loading" && <Loader2 size={13} className="animate-spin" />}
                    Join
                  </button>
                </div>
              )}
              {status === "error" && (
                <p className="font-body text-[11px] text-red-300 mt-1.5">Please enter a valid email.</p>
              )}
            </div>
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
