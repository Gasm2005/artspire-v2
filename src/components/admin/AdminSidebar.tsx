import { useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Palette,
  FolderOpen,
  Image,
  Layers,
  FileText,
  Search,
  Users,
  MessageCircle,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "@/lib/admin";

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Artworks", to: "/admin/artworks", icon: Palette },
      { label: "Categories", to: "/admin/categories", icon: FolderOpen },
      { label: "FAQs", to: "/admin/faqs", icon: FileText },
      { label: "Media Library", to: "/admin/media", icon: Image },
    ],
  },
  {
    label: "Visual Assets",
    items: [
      { label: "Visual Assets", to: "/admin/visual-assets", icon: Layers },
    ],
  },
  {
    label: "Website",
    items: [
      { label: "Website Content", to: "/admin/website-content", icon: FileText },
      { label: "SEO Center", to: "/admin/seo", icon: Search },
    ],
  },
  {
    label: "Business",
    items: [
      { label: "Leads", to: "/admin/leads", icon: Users },
      { label: "WhatsApp", to: "/admin/whatsapp", icon: MessageCircle },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", to: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const router = useRouter();
  const currentPath = router.state.location.pathname;
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(navGroups.map((g) => g.label))
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const isActive = (to: string) => {
    if (to === "/admin") return currentPath === "/admin";
    return currentPath.startsWith(to);
  };

  const handleSignOut = async () => {
    await signOut();
    router.navigate({ to: "/admin/login" });
  };

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-screen sticky top-0 bg-white border-r border-border overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-border">
        <a href="/admin" className="flex items-center gap-2">
          <span className="font-display text-[20px] text-forest font-medium">Artspire</span>
        </a>
        <p className="font-body text-[11px] text-stone mt-0.5">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.label);
          const hasActiveChild = group.items.some((item) => isActive(item.to));

          return (
            <div key={group.label} className="mb-2">
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center gap-1.5 w-full px-2 py-1.5 text-[10px] font-body font-bold uppercase tracking-wider text-stone/70 hover:text-forest transition-colors"
              >
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                {group.label}
              </button>

              {isExpanded && (
                <div className="space-y-0.5 mt-1">
                  {group.items.map((item) => {
                    const active = isActive(item.to);
                    return (
                      <a
                        key={item.to}
                        href={item.to}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-body text-[13px] font-medium transition-colors ${
                          active
                            ? "bg-forest/10 text-forest"
                            : "text-stone hover:text-forest hover:bg-forest/5"
                        }`}
                      >
                        <item.icon size={16} />
                        {item.label}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl font-body text-[13px] font-medium text-stone hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
