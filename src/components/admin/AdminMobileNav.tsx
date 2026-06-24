import {
  LayoutDashboard,
  Palette,
  Layers,
  Users,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "@tanstack/react-router";

const mobileTabs = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Content", to: "/admin/artworks", icon: Palette },
  { label: "Visual", to: "/admin/visual-assets", icon: Layers },
  { label: "Leads", to: "/admin/leads", icon: Users },
  { label: "WhatsApp", to: "/admin/whatsapp", icon: MessageCircle },
];

export function AdminMobileNav() {
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  const isActive = (to: string) => {
    if (to === "/admin") return currentPath === "/admin";
    return currentPath.startsWith(to);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
      <div className="flex items-center justify-around h-[56px] max-w-[390px] mx-auto">
        {mobileTabs.map((tab) => {
          const active = isActive(tab.to);
          return (
            <a
              key={tab.to}
              href={tab.to}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full ${
                active ? "text-forest" : "text-stone/60"
              }`}
            >
              <tab.icon size={18} />
              <span className="font-body text-[10px] font-medium">{tab.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
