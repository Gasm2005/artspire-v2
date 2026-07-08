import type { ReactNode } from "react";
import { ShopHeader } from "./ShopHeader";
import { ShopFooter } from "./ShopFooter";

/**
 * Wraps all /shop/* pages. Replaces the main site's Header/NavDrawer/
 * WhatsAppBar entirely with shop-specific navigation — this is the
 * "current nav closes, shop nav opens" behavior.
 */
export function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ShopHeader />
      <main id="main-content" className="pt-[68px]">
        {children}
      </main>
      <ShopFooter />
    </>
  );
}
