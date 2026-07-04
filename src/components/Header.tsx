import { Link, useLocation } from "@tanstack/react-router";
import { waLink } from "@/lib/whatsapp";
import { Menu } from "lucide-react";

const navLinks = [
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-outline-variant/30 h-[56px] header-shadow md:left-0 md:right-0 md:max-w-none">
      {/* Mobile container */}
      <div className="mx-auto h-full max-w-[390px] px-4 flex items-center justify-between md:hidden">
        <Link to="/" className="flex items-center shrink-0 active-scale" aria-label="Artspire home">
          <img
            src="/artspire-Logo.svg"
            alt="Artspire"
            className="h-16 w-auto object-contain"
          />
        </Link>
        <button
          aria-label="Menu"
          className="p-2 -mr-2 text-on-surface active-scale"
          onClick={onMenuClick}
        >
          <Menu size={24} aria-hidden="true" />
        </button>
      </div>

      {/* Desktop container */}
      <div className="hidden md:flex container-main h-full items-center justify-between">
        <Link to="/" className="flex items-center shrink-0">
          <img
            src="/artspire-Logo.svg"
            alt="Artspire"
            className="h-16 w-auto object-contain"
          />
        </Link>

        <nav className="flex items-center gap-8 font-body text-[13px] font-semibold text-charcoal/70">
          {navLinks.map((l) => {
            const isActive = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`transition-colors ${isActive ? "text-gold-accent" : "hover:text-gold-accent"}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <a
          href={waLink("Hi Artspire! I'd like to chat about a custom artwork.")}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-brand-whatsapp px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 max-w-[200px] whitespace-nowrap"
        >
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Chat on WhatsApp
        </a>
      </div>
    </header>
  );
}
