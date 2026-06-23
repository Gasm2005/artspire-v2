import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { signOut } from "@/lib/admin";
import { LogOut, LayoutDashboard, Palette } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isAdmin, isLoading } = useAdmin();
  const router = useRouter();
  const pathname = router.state.location.pathname;

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoading && !isAdmin && !isLoginPage) {
      router.navigate({ to: "/admin/login" });
    }
  }, [isLoading, isAdmin, isLoginPage, router]);

  // Login page is always accessible
  if (isLoginPage) {
    return <Outlet />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <div className="font-body text-stone">Loading admin panel…</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="flex items-center justify-between h-[56px] px-4 md:px-6 max-w-[390px] mx-auto md:max-w-none">
          <div className="flex items-center gap-4">
            <span className="font-display text-[18px] text-forest font-medium">Artspire Admin</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <AdminNavLink to="/admin" label="Dashboard" />
            <AdminNavLink to="/admin/artworks" label="Artworks" />
          </nav>
          <button
            onClick={async () => {
              await signOut();
              router.navigate({ to: "/admin/login" });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-body font-semibold text-stone hover:text-forest transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto no-scrollbar">
          <AdminNavLink to="/admin" label="Dashboard" />
          <AdminNavLink to="/admin/artworks" label="Artworks" />
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-[390px] mx-auto md:max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}

function AdminNavLink({ to, label }: { to: string; label: string }) {
  const router = useRouter();
  const active = router.state.location.pathname === to;

  return (
    <a
      href={to}
      className={`px-3 py-1.5 rounded-lg font-body text-[12px] font-semibold transition-colors ${
        active ? "bg-forest/10 text-forest" : "text-stone hover:text-forest"
      }`}
    >
      {label}
    </a>
  );
}
