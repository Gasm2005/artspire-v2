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
      <main id="main-content" className="pt-[64px] pb-20 md:pb-0 md:pt-[64px]">
        {children}
      </main>
      <Footer />
      <WhatsAppBar />
    </>
  );
}
