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
    <footer className="bg-deep-forest border-t border-white/5">
      {/* Mobile Footer — Loveable style */}
      <div className="md:hidden px-8 pt-16 pb-28 text-center">
        <div className="font-display text-[32px] text-white mb-2 tracking-tight">Artspire</div>
        <p className="font-accent text-[18px] italic text-gold-accent/80 mb-10">Crafting Your Vision</p>
        <div className="flex justify-center gap-8 mb-10">
          <a className="text-white/60 active:text-gold-accent" href="https://www.instagram.com/himusketching_gallery?igsh=MXhzZzY1YjIzcDNxOQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram size={26} />
          </a>
          <a className="text-white/60 active:text-gold-accent" href="https://wa.me/917408690994" aria-label="WhatsApp">
            <MessageCircle size={26} />
          </a>
          <a className="text-white/60 active:text-gold-accent" href="mailto:Ajju_pandey@outlook.com" aria-label="Email">
            <Mail size={26} />
          </a>
        </div>
        <div className="w-20 h-px bg-gold-accent/30 mx-auto mb-10" />
        <p className="font-body text-[11px] text-white/40 uppercase tracking-[0.2em]">
          © 2026 Artspire Studio · All Rights Reserved
        </p>
      </div>

      {/* Desktop Footer — Artspire V2 style */}
      <div className="hidden md:block container-main py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <span className="font-display text-[28px] text-cream font-medium tracking-tight">Artspire</span>
            <p className="font-accent text-[15px] italic text-gold/80 leading-relaxed">Crafting Your Vision</p>
            <p className="font-body text-[13px] text-cream/60 leading-relaxed">Handcrafted art for life's most meaningful moments. Every piece tells a story.</p>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://www.instagram.com/himusketching_gallery?igsh=MXhzZzY1YjIzcDNxOQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-cream/50 hover:text-gold transition-colors">
                <Instagram size={22} />
              </a>
              <a href="https://wa.me/917408690994" aria-label="WhatsApp" className="text-cream/50 hover:text-gold transition-colors">
                <MessageCircle size={22} />
              </a>
              <a href="mailto:Ajju_pandey@outlook.com" aria-label="Email" className="text-cream/50 hover:text-gold transition-colors">
                <Mail size={22} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-display text-[14px] text-cream font-semibold uppercase tracking-[0.15em] mb-5">Quick Links</h3>
            <nav className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <Link key={link.to + link.label} to={link.to} className="font-body text-[13px] text-cream/60 hover:text-gold transition-colors">{link.label}</Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="font-display text-[14px] text-cream font-semibold uppercase tracking-[0.15em] mb-5">Services</h3>
            <nav className="flex flex-col gap-2.5">
              {serviceLinks.map((link) => (
                <Link key={link.label} to={link.to} className="font-body text-[13px] text-cream/60 hover:text-gold transition-colors">{link.label}</Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-display text-[14px] text-cream font-semibold uppercase tracking-[0.15em] mb-5">Get in Touch</h3>
            <div className="flex flex-col gap-3">
              <a href="mailto:Ajju_pandey@outlook.com" className="flex items-center gap-2 font-body text-[13px] text-cream/60 hover:text-gold transition-colors">
                <Mail size={16} className="shrink-0" /> Ajju_pandey@outlook.com
              </a>
              <div className="flex items-center gap-2 font-body text-[13px] text-cream/60">
                <MapPin size={16} className="shrink-0" /> India — Shipping Pan India
              </div>
              <div className="flex items-center gap-2 font-body text-[13px] text-cream/60">
                <Clock size={16} className="shrink-0" /> Mon–Sat, 9am–9pm
              </div>
              <a href={waLink("Hi Himangi! I'd love to chat about a custom artwork.")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 h-[38px] px-5 rounded-sm border border-cream/30 text-cream font-body text-[12px] font-semibold hover:bg-cream/10 transition-colors mt-3 whitespace-nowrap">
                Commission Art
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop bottom bar */}
      <div className="hidden md:block border-t border-cream/10">
        <div className="container-main py-5 text-center">
          <p className="font-body text-[12px] text-cream/40 tracking-wide">© 2026 Artspire Studio · All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
