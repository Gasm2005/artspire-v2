import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
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
    return createClient("https://placeholder.supabase.co", "placeholder", {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
export {
  supabase as s
};
