import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { waLink } from "@/lib/whatsapp";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

const serviceLinks = [
  { to: "/services", label: "Pencil Sketches" },
  { to: "/services", label: "Colour Portraits" },
  { to: "/services", label: "Paintings" },
  { to: "/services", label: "Mirror Art" },
  { to: "/services", label: "Clay Art" },
  { to: "/services", label: "Personalized Gifts" },
] as const;

export function Footer() {
  return (
    <>
      {/* CTA Section above footer — visually separated */}
      <section className="section-padding bg-cream text-center border-t border-border/40">
        <div className="container-main max-w-2xl">
          <h2 className="font-display text-[28px] md:text-[36px] text-forest font-medium mb-4 leading-tight">
            Ready to Create Something Beautiful?
          </h2>
          <p className="font-body text-[14px] md:text-[16px] text-stone mb-8 leading-relaxed">
            Start your custom commission today. Every piece is handcrafted with care and precision.
          </p>
          <a
            href={waLink("Hi Artspire! I want to commission artwork")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-[56px] px-10 bg-forest text-white font-body font-bold text-[14px] uppercase tracking-wide rounded-full btn-primary shadow-lg"
          >
            Start Your Commission
          </a>
        </div>
      </section>

      <footer className="bg-forest border-t border-forest-light/30">
        <div className="container-main py-12 md:py-16">
          {/* 4-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Column 1: Brand (text logo, no image) */}
            <div className="flex flex-col gap-4">
              <span className="font-display text-[28px] text-cream font-medium tracking-tight">Artspire</span>
              <p className="font-accent text-[15px] italic text-gold/80 leading-relaxed">
                Crafting Your Vision
              </p>
              <p className="font-body text-[13px] text-cream/60 leading-relaxed">
                Handcrafted art for life's most meaningful moments. Every piece tells a story.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <a
                  href="https://www.instagram.com/himusketching_gallery?igsh=MXhzZzY1YjIzcDNxOQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-cream/50 hover:text-gold transition-colors duration-200"
                >
                  <Instagram size={22} />
                </a>
                <a
                  href="https://wa.me/917408690994"
                  aria-label="WhatsApp"
                  className="text-cream/50 hover:text-gold transition-colors duration-200"
                >
                  <MessageCircle size={22} />
                </a>
                <a
                  href="mailto:Ajju_pandey@outlook.com"
                  aria-label="Email"
                  className="text-cream/50 hover:text-gold transition-colors duration-200"
                >
                  <Mail size={22} />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-display text-[14px] text-cream font-semibold uppercase tracking-[0.15em] mb-5">
                Quick Links
              </h3>
              <nav className="flex flex-col gap-2.5">
                {quickLinks.map((link) => (
                  <Link
                    key={link.to + link.label}
                    to={link.to}
                    className="font-body text-[13px] text-cream/60 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Column 3: Services (6 correct categories) */}
            <div>
              <h3 className="font-display text-[14px] text-cream font-semibold uppercase tracking-[0.15em] mb-5">
                Services
              </h3>
              <nav className="flex flex-col gap-2.5">
                {serviceLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="font-body text-[13px] text-cream/60 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h3 className="font-display text-[14px] text-cream font-semibold uppercase tracking-[0.15em] mb-5">
                Get in Touch
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:Ajju_pandey@outlook.com"
                  className="flex items-center gap-2 font-body text-[13px] text-cream/60 hover:text-gold transition-colors duration-200"
                >
                  <Mail size={16} className="shrink-0" />
                  Ajju_pandey@outlook.com
                </a>
                <div className="flex items-center gap-2 font-body text-[13px] text-cream/60">
                  <MapPin size={16} className="shrink-0" />
                  India — Shipping Pan India
                </div>
                <div className="flex items-center gap-2 font-body text-[13px] text-cream/60">
                  <Clock size={16} className="shrink-0" />
                  Mon–Sat, 9am–9pm
                </div>
                <a
                  href={waLink("Hi Himangi! I'd love to chat about a custom artwork.")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-whatsapp px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200 mt-3 max-w-[200px] whitespace-nowrap btn-whatsapp"
                >
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/10">
          <div className="container-main py-5 text-center">
            <p className="font-body text-[12px] text-cream/40 tracking-wide">
              © 2025 Artspire Studio · All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
