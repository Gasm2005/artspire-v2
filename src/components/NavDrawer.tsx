import { Link, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function NavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const location = useLocation();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <nav
        className={`fixed top-0 right-0 h-full w-[300px] bg-cream z-[70] transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border/60">
          <span className="font-display text-[20px] text-forest font-medium">Menu</span>
          <button
            aria-label="Close Menu"
            className="p-2 text-charcoal hover:text-forest transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
        <div className="flex flex-col p-6 gap-1">
          {links.map((l) => {
            const isActive = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`font-body text-[15px] px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "text-forest font-semibold bg-forest/5"
                    : "text-charcoal hover:text-forest hover:bg-cream-dark/30"
                }`}
                onClick={onClose}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
