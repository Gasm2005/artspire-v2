import { c as createMiddleware } from "./server-BkmoZvPn.mjs";
import { r as renderErrorPage } from "./index.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
function dedupeSerializationAdapters(deduped, serializationAdapters) {
  for (let i = 0, len = serializationAdapters.length; i < len; i++) {
    const current = serializationAdapters[i];
    if (!deduped.has(current)) {
      deduped.add(current);
      if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
    }
  }
}
var createStart = (getOptions) => {
  return {
    getOptions: async () => {
      const options = await getOptions();
      if (options.serializationAdapters) {
        const deduped = /* @__PURE__ */ new Set();
        dedupeSerializationAdapters(deduped, options.serializationAdapters);
        options.serializationAdapters = Array.from(deduped);
      }
      return options;
    },
    createMiddleware
  };
};
function createClient(_url, _key, _options) {
  console.warn("[Supabase Stub] Using stub client. Run `npm install @supabase/supabase-js` to connect to real Supabase.");
  const stubAuth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({}),
    signOut: async () => ({}),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {
    } } } })
  };
  const stubStorage = {
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      download: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: "" } }),
      remove: async () => ({ data: null, error: null }),
      list: async () => ({ data: null, error: null })
    })
  };
  const builder = (table) => {
    const chain = {
      select: () => chain,
      insert: () => chain,
      update: () => chain,
      upsert: () => chain,
      delete: () => chain,
      eq: () => chain,
      neq: () => chain,
      gt: () => chain,
      gte: () => chain,
      lt: () => chain,
      lte: () => chain,
      is: () => chain,
      in: () => chain,
      contains: () => chain,
      order: () => chain,
      limit: () => chain,
      range: () => chain,
      single: async () => ({ data: null, error: null }),
      maybeSingle: async () => ({ data: null, error: null }),
      csv: async () => ({ data: null, error: null }),
      then: async (onfulfilled) => onfulfilled?.({ data: null, error: null })
    };
    return chain;
  };
  return {
    auth: stubAuth,
    from: builder,
    storage: stubStorage,
    rpc: async () => ({ data: null, error: null })
  };
}
function createSupabaseClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || void 0 || process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    const missing = [
      ...!SUPABASE_URL ? ["VITE_SUPABASE_URL"] : [],
      ...!SUPABASE_ANON_KEY ? ["VITE_SUPABASE_ANON_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Add them to your .env file.`;
    console.error(`[Supabase] ${message}`);
    return createClient();
  }
  return createClient();
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }
);
const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }
});
const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware]
}));
export {
  startInstance
};
