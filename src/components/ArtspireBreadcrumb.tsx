import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
}

interface ArtspireBreadcrumbProps {
  crumbs: BreadcrumbCrumb[];
  className?: string;
  /** Show home icon on first crumb */
  showHomeIcon?: boolean;
}

/**
 * Artspire-styled breadcrumb component.
 * - Accessible: uses nav + aria-label + aria-current
 * - SEO-friendly: works alongside BreadcrumbList JSON-LD
 * - Responsive: collapses on mobile (shows only last 2 crumbs)
 * - Reusable: pass any crumb array
 * - Future-ready: works for Portfolio, Shop, Admin, Categories
 *
 * Usage:
 *   <ArtspireBreadcrumb crumbs={[
 *     { label: "Home", href: "/" },
 *     { label: "Portfolio", href: "/portfolio" },
 *     { label: "Pencil Sketches", href: "/portfolio?category=pencil-sketches" },
 *     { label: "The First Time She Became 'Maa'" },
 *   ]} />
 */
export function ArtspireBreadcrumb({
  crumbs,
  className,
  showHomeIcon = true,
}: ArtspireBreadcrumbProps) {
  if (!crumbs || crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("w-full", className)}>
      <ol className="flex flex-wrap items-center gap-1 font-body text-[11px] md:text-[12px] text-stone/60">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          const isFirst = index === 0;

          return (
            <li
              key={index}
              className={cn(
                "flex items-center gap-1",
                // On mobile: hide middle crumbs when there are 3+ crumbs
                !isFirst && !isLast && crumbs.length > 3 ? "hidden sm:flex" : "flex"
              )}
            >
              {/* Separator — not on first item */}
              {index > 0 && (
                <ChevronRight
                  size={12}
                  className="text-stone/30 shrink-0"
                  aria-hidden="true"
                />
              )}

              {isLast ? (
                // Current page — not a link
                <span
                  aria-current="page"
                  className="text-forest font-medium truncate max-w-[200px] md:max-w-none"
                >
                  {crumb.label}
                </span>
              ) : crumb.href ? (
                // Ancestor — clickable link
                <Link
                  to={crumb.href as any}
                  className="flex items-center gap-1 hover:text-forest transition-colors"
                >
                  {isFirst && showHomeIcon && (
                    <Home size={11} aria-hidden="true" className="shrink-0" />
                  )}
                  <span>{crumb.label}</span>
                </Link>
              ) : (
                <span className="flex items-center gap-1">
                  {isFirst && showHomeIcon && (
                    <Home size={11} aria-hidden="true" className="shrink-0" />
                  )}
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ─── Preset breadcrumbs for common pages ──────────────────────
export const breadcrumbs = {
  portfolio: [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
  ],
  shop: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
  ],
  artwork: (title: string, categoryName?: string, categorySlug?: string) => [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    ...(categoryName && categorySlug
      ? [{ label: categoryName, href: `/portfolio?category=${categorySlug}` }]
      : []),
    { label: title },
  ],
  faq: [
    { label: "Home", href: "/" },
    { label: "FAQ" },
  ],
  about: [
    { label: "Home", href: "/" },
    { label: "About" },
  ],
  services: [
    { label: "Home", href: "/" },
    { label: "Services" },
  ],
  pricing: [
    { label: "Home", href: "/" },
    { label: "Pricing" },
  ],
  contact: [
    { label: "Home", href: "/" },
    { label: "Contact" },
  ],
};
