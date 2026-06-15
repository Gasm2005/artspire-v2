import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, Mail } from "lucide-react";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="bg-deep-forest px-8 pt-16 pb-28 text-center border-t border-white/5">
      <div className="md:grid md:grid-cols-3 md:gap-8 md:max-w-screen-xl md:mx-auto md:text-left">
        <div>
          <div className="font-display text-[32px] text-white mb-2 tracking-tight">Artspire</div>
          <p className="font-accent text-[18px] italic text-gold-accent/80 mb-10">
            Crafting Your Vision
          </p>
        </div>

        <nav className="hidden md:flex flex-col gap-3 font-body text-[13px] font-semibold text-white/60">
          <p className="text-white uppercase tracking-[0.2em] text-[11px] mb-1">Quick Links</p>
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-gold-accent">
              {link.label}
            </Link>
          ))}
        </nav>

        <div>
          <div className="flex justify-center gap-8 mb-10 md:justify-start md:mb-6">
            <a
              className="text-white/60 active:text-gold-accent"
              href="https://www.instagram.com/himusketching_gallery?igsh=MXhzZzY1YjIzcDNxOQ=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={26} />
            </a>
            <a
              className="text-white/60 active:text-gold-accent"
              href="https://wa.me/917408690994"
              aria-label="WhatsApp"
            >
              <MessageCircle size={26} />
            </a>
            <a
              className="text-white/60 active:text-gold-accent"
              href="mailto:Ajju_pandey@outlook.com"
              aria-label="Email"
            >
              <Mail size={26} />
            </a>
          </div>
          <a
            href="https://wa.me/917408690994"
            className="hidden md:inline-flex items-center justify-center rounded-full bg-brand-whatsapp px-6 py-3 font-body text-[13px] font-bold uppercase tracking-wide text-white"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className="w-20 h-px bg-gold-accent/30 mx-auto mb-10 md:col-span-3 md:mt-10" />
        <p className="font-body text-[11px] text-white/40 uppercase tracking-[0.2em] md:col-span-3 md:text-center">
          © 2025 Artspire Studio · All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
