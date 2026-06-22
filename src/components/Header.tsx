import { waLink } from "@/lib/whatsapp";
import { Link, useLocation } from "@tanstack/react-router";

const desktopLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-md border-b border-border/40 header-shadow transition-shadow duration-300">
      <div className="container-main h-[56px] md:h-[72px] flex items-center justify-between">
        {/* Logo — left */}
        <Link to="/" className="flex items-center shrink-0">
          <img
            src="/artspire-Logo.svg"
            alt="Artspire"
            className="h-12 md:h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav — center */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 font-body text-[13px] lg:text-[14px] font-medium text-charcoal/70">
          {desktopLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-forest font-semibold"
                    : "hover:text-forest hover:bg-cream-dark/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA — right */}
        <a
          href={waLink("Hi Himangi! I'd like to chat about a custom artwork.")}
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-2 rounded-full bg-brand-whatsapp px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 max-w-[200px] whitespace-nowrap"
        >
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Chat on WhatsApp
        </a>

        {/* Mobile Hamburger */}
        <button
          aria-label="Menu"
          className="p-2 -mr-2 text-charcoal active-scale md:hidden"
          onClick={onMenuClick}
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
      </div>
    </header>
  );
}
