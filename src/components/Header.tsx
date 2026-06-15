import { Link } from "@tanstack/react-router";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="fixed top-0 w-full max-w-[390px] z-50 bg-background/95 backdrop-blur-sm border-b border-outline-variant/30 flex justify-between items-center px-6 h-[56px] header-shadow mx-auto left-0 right-0">
      <Link to="/" className="font-display text-2xl font-medium tracking-tight">
        Artspire
      </Link>
      <button
        aria-label="Menu"
        className="p-2 -mr-2 text-on-surface active-scale"
        onClick={onMenuClick}
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>
    </header>
  );
}
