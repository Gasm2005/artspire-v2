import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute — avoid refetch on every navigation
        gcTime: 5 * 60 * 1000, // 5 minutes in cache
        retry: 1,
        refetchOnWindowFocus: false, // Don't refetch on tab switch
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent", // Preload on hover/touch — makes nav feel instant
    defaultPreloadStaleTime: 30_000, // 30s — reuse preloaded data
    defaultPendingMinMs: 0, // Show content immediately, no minimum pending
    defaultPendingMs: 1000, // Only show pending UI if load > 1s
  });

  return router;
};
