import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, Search } from "lucide-react";

const shopNavLinks = [
  { to: "/shop", label: "All Pieces" },
  { to: "/shop", label: "Collections", hash: "#collections" },
  { to: "/shop", label: "New Arrivals", hash: "#new" },
  { to: "/about", label: "Journal" },
] as const;

/**
 * Shop-specific navigation header.
 * Replaces the main site Header when the user is inside /shop/*.
 * Reference: Terrène (Framer) — serif wordmark, thin border-bottom,
 * letter-spaced minimal nav, cart icon with count badge.
 * Original Artspire execution: forest/gold palette, EB Garamond wordmark.
 */
export function ShopHeader({ cartCount = 0 }: { cartCount?: number }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm transition-shadow duration-200 h-[68px] ${
          scrolled ? "shadow-[0_1px_0_rgba(0,0,0,0.08)]" : "border-b border-border/40"
        }`}
      >
        <div className="container-main h-full flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 -ml-2 text-forest"
            aria-label="Open shop menu"
          >
            <Menu size={22} />
          </button>

          {/* Wordmark — links back to main site */}
          <Link
            to="/"
            className="font-display text-[20px] md:text-[24px] tracking-[0.12em] text-forest font-medium uppercase absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
          >
            Artspire
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Shop navigation" className="hidden md:flex items-center gap-8 font-body text-[12px] font-medium text-stone/70 uppercase tracking-[0.08em]">
            {shopNavLinks.map((l) => (
              <a
                key={l.label}
                href={l.hash ? `${l.to}${l.hash}` : l.to}
                className={`hover:text-forest transition-colors ${location.pathname === l.to && !l.hash ? "text-forest" : ""}`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right: search + cart */}
          <div className="flex items-center gap-4">
            <button aria-label="Search the shop" className="hidden md:block text-stone/60 hover:text-forest transition-colors">
              <Search size={18} />
            </button>
            <Link to="/shop" className="relative text-stone/60 hover:text-forest transition-colors" aria-label="View cart">
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-gold text-white text-[9px] font-bold rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-[280px] bg-cream shadow-xl flex flex-col">
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 text-forest">
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-6 px-8 py-4 font-display text-[22px] text-forest">
              {shopNavLinks.map((l) => (
                <a key={l.label} href={l.hash ? `${l.to}${l.hash}` : l.to} onClick={() => setMobileOpen(false)}>
                  {l.label}
                </a>
              ))}
              <Link to="/" onClick={() => setMobileOpen(false)} className="font-body text-[13px] text-stone/50 uppercase tracking-widest mt-4">
                ← Back to Artspire
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
