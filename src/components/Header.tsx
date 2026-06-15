import { Link } from "@tanstack/react-router";

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
  return (
    <header className="fixed top-0 w-full max-w-screen-xl z-50 bg-background/95 backdrop-blur-sm border-b border-outline-variant/30 flex justify-between items-center px-6 h-[56px] header-shadow mx-auto left-0 right-0">
      <Link to="/" className="font-display text-2xl font-medium tracking-tight">
        Artspire
      </Link>
      <nav className="hidden md:flex items-center gap-6 font-body text-[13px] font-semibold text-on-surface-variant">
        {desktopLinks.map((link) => (
          <Link key={link.to} to={link.to} className="hover:text-primary">
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        aria-label="Menu"
        className="p-2 -mr-2 text-on-surface active-scale md:hidden"
        onClick={onMenuClick}
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>
    </header>
  );
}
