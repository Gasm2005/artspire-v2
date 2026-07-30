import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { captureServerErrorAndFlush } from "./lib/sentry.server";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

// Reports errors thrown inside SERVER FUNCTIONS, then rethrows so behaviour is
// unchanged.
//
// This exists because of a real miss: TanStack serialises a throw inside a
// createServerFn handler into a 200 response carrying an `error` payload — it is
// never thrown up to src/server.ts, so the Sentry capture there never saw it.
// That is exactly how the commission form's budget_range CHECK violation stayed
// invisible server-side: every insert failed with Postgres 23514, the response
// was HTTP 200, and nothing was reported. Any server-function failure now
// reaches Sentry.
const sentryFunctionMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    await captureServerErrorAndFlush(error);
    throw error;
  }
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    // Report BEFORE converting the error into a 500 page. Returning a Response
    // here means src/server.ts's catch never runs, so without this the error was
    // only ever console.logged.
    await captureServerErrorAndFlush(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth, sentryFunctionMiddleware],
  requestMiddleware: [errorMiddleware],
}));
