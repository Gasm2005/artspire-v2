import { LayoutDashboard, Palette, FolderOpen, FileText, Search } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

const mobileTabs = [
  { label: "Home", to: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Artworks", to: "/admin/artworks", icon: Palette },
  { label: "Categories", to: "/admin/categories", icon: FolderOpen },
  { label: "Pages", to: "/admin/website-content", icon: FileText },
  { label: "SEO", to: "/admin/seo", icon: Search },
];

export function AdminMobileNav() {
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return currentPath === to;
    return currentPath.startsWith(to);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
      <div className="flex items-center justify-around h-[56px] max-w-[390px] mx-auto">
        {mobileTabs.map((tab) => {
          const active = isActive(tab.to, tab.exact);
          return (
            <a
              key={tab.to}
              href={tab.to}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                active ? "text-forest" : "text-stone/50"
              }`}
            >
              <tab.icon size={19} />
              <span className="font-body text-[10px] font-medium">{tab.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
