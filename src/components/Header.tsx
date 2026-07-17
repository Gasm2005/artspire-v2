import { Link, useLocation } from "@tanstack/react-router";
import { waLink } from "@/lib/whatsapp";
import { Menu } from "lucide-react";

const navLinks = [
  { to: "/portfolio", label: "Portfolio" },
  { to: "/shop", label: "Shop" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-outline-variant/30 h-[64px] header-shadow md:left-0 md:right-0 md:max-w-none">
      {/* Mobile */}
      <div className="h-full px-4 flex items-center justify-between md:hidden">
        <Link to="/" className="flex items-center shrink-0 active-scale" aria-label="Artspire home">
          <picture>
            <source srcSet="/artspire-logo.webp" type="image/webp" />
            <img
              src="/artspire-logo.png"
              alt="Artspire"
              width={693}
              height={160}
              className="h-14 w-auto object-contain"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </Link>
        <button
          aria-label="Open menu"
          aria-expanded="false"
          className="p-2 -mr-2 text-on-surface active-scale"
          onClick={onMenuClick}
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex container-main h-full items-center justify-between">
        <Link to="/" className="flex items-center shrink-0">
          <picture>
            <source srcSet="/artspire-logo.webp" type="image/webp" />
            <img
              src="/artspire-logo.png"
              alt="Artspire"
              width={693}
              height={160}
              className="h-14 w-auto object-contain"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-8 font-body text-[13px] font-medium text-stone/70">
          {navLinks.map((l) => {
            const isActive = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`transition-colors hover:text-forest ${isActive ? "text-forest font-semibold" : ""}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA — forest colour, no pulsing green dot */}
        <a
          href={waLink("Hi Artspire! I'd like to chat about a custom artwork.")}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 h-[38px] px-5 rounded-full border-2 border-forest text-forest font-body text-[12px] font-semibold hover:bg-forest hover:text-white transition-all duration-200 whitespace-nowrap"
        >
          Commission Art
        </a>
      </div>
    </header>
  );
}
