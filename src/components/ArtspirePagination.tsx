import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtspirePaginationProps {
  /** Total number of items */
  total: number;
  /** Items per page */
  pageSize: number;
  /** Current page (1-indexed) */
  currentPage: number;
  /** Called when page changes */
  onPageChange: (page: number) => void;
  /** Show page size info. Default true. */
  showInfo?: boolean;
  /** Loading state */
  isLoading?: boolean;
  className?: string;
}

/**
 * Artspire pagination component.
 * - SEO-friendly: renders accessible nav with aria-labels
 * - URL-ready: caller controls URL via onPageChange
 * - Responsive: collapses page numbers on mobile
 * - Ellipsis for large page counts
 * - Future-ready: Portfolio, Shop, Admin, Search results
 *
 * Usage:
 *   <ArtspirePagination
 *     total={120} pageSize={12} currentPage={3}
 *     onPageChange={(p) => setPage(p)}
 *   />
 */
export function ArtspirePagination({
  total,
  pageSize,
  currentPage,
  onPageChange,
  showInfo = true,
  isLoading = false,
  className,
}: ArtspirePaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [1];

    if (currentPage > 3) pages.push("ellipsis");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  const btnBase =
    "inline-flex items-center justify-center h-9 min-w-[36px] px-2 rounded-lg font-body text-[13px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <nav aria-label="Pagination" className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          aria-label="Previous page"
          className={cn(btnBase, "text-stone hover:text-forest hover:bg-cream border border-border bg-white")}
        >
          <ChevronLeft size={16} />
          <span className="sr-only md:not-sr-only ml-1 text-[12px]">Prev</span>
        </button>

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((page, i) =>
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${i}`}
                aria-hidden="true"
                className="w-9 text-center font-body text-[13px] text-stone/40"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={isLoading}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
                className={cn(
                  btnBase,
                  page === currentPage
                    ? "bg-forest text-white border border-forest shadow-sm"
                    : "text-stone hover:text-forest hover:bg-cream border border-border bg-white"
                )}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Mobile: current / total */}
        <span className="sm:hidden font-body text-[13px] text-stone/60 px-3">
          {currentPage} / {totalPages}
        </span>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          aria-label="Next page"
          className={cn(btnBase, "text-stone hover:text-forest hover:bg-cream border border-border bg-white")}
        >
          <span className="sr-only md:not-sr-only mr-1 text-[12px]">Next</span>
          <ChevronRight size={16} />
        </button>
      </nav>

      {/* Info text */}
      {showInfo && (
        <p className="font-body text-[11px] text-stone/50">
          Showing {Math.min((currentPage - 1) * pageSize + 1, total)}–
          {Math.min(currentPage * pageSize, total)} of {total}
        </p>
      )}
    </div>
  );
}
