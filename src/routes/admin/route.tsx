import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

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
    <div className="min-h-screen bg-cream flex">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6 max-w-[390px] mx-auto md:max-w-none w-full pb-24 md:pb-6">
          <Outlet />
        </main>
        {/* Mobile bottom nav */}
        <AdminMobileNav />
      </div>
    </div>
  );
}
