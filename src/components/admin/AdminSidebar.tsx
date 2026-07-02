import { useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Palette,
  FolderOpen,
  FileText,
  LogOut,
  Globe,
} from "lucide-react";
import { signOut } from "@/lib/admin";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Artworks", to: "/admin/artworks", icon: Palette },
  { label: "Categories", to: "/admin/categories", icon: FolderOpen },
  { label: "Pages", to: "/admin/website-content", icon: FileText },
  { label: "View Site", to: "/", icon: Globe, external: true },
];

export function AdminSidebar() {
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return currentPath === to;
    return currentPath.startsWith(to);
  };

  const handleSignOut = async () => {
    await signOut();
    router.navigate({ to: "/admin/login" });
  };

  return (
    <aside className="hidden md:flex flex-col w-[220px] h-screen sticky top-0 bg-white border-r border-border">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <span className="font-display text-[22px] text-forest font-medium">Artspire</span>
        <p className="font-body text-[11px] text-stone mt-0.5">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.to, item.exact);
          return item.external ? (
            <a
              key={item.to}
              href={item.to}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-[13px] font-medium text-stone hover:text-forest hover:bg-forest/5 transition-colors"
            >
              <item.icon size={17} />
              {item.label}
            </a>
          ) : (
            <a
              key={item.to}
              href={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-[13px] font-medium transition-colors ${
                active
                  ? "bg-forest/10 text-forest"
                  : "text-stone hover:text-forest hover:bg-forest/5"
              }`}
            >
              <item.icon size={17} />
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-3 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-body text-[13px] font-medium text-stone hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={17} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
