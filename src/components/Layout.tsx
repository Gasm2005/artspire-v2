import { useState, type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { NavDrawer } from "./NavDrawer";
import { WhatsAppBar } from "./WhatsAppBar";

export function Layout({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <>
      <Header onMenuClick={() => setNavOpen(true)} />
      <NavDrawer open={navOpen} onClose={() => setNavOpen(false)} />
      <main className="pt-[56px] pb-20">{children}</main>
      <Footer />
      <WhatsAppBar />
    </>
  );
}
