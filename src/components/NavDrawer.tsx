import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { X } from "lucide-react";

const links = [
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function NavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <nav
        className={`fixed top-0 right-0 h-full w-[280px] bg-background z-[70] transform transition-transform duration-300 shadow-xl flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ maxWidth: "280px" }}
      >
        <div className="flex justify-end p-4">
          <button
            aria-label="Close Menu"
            className="p-2 text-on-surface active-scale"
            onClick={onClose}
          >
            <X size={28} aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-col px-8 py-4 gap-8 font-display text-3xl text-on-surface mt-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="active:text-gold-accent"
              onClick={onClose}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
