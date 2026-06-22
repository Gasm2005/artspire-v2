/**
 * STUB: @supabase/supabase-js
 *
 * This is a compile-time stub. The real @supabase/supabase-js package
 * must be installed via `npm install` before deployment.
 *
 * To connect the real client after installing:
 * 1. Run: npm install @supabase/supabase-js
 * 2. In client.ts, change: import { createClient } from '@/lib/supabase-stub'
 *    to: import { createClient } from '@supabase/supabase-js'
 */

export interface SupabaseClient<T = unknown> {
  auth: AuthClient;
  from: (table: string) => PostgrestQueryBuilder<T>;
  storage: StorageClient;
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<unknown>;
}

export interface AuthClient {
  getSession: () => Promise<{ data: { session: { access_token: string } | null }; error: Error | null }>;
  getUser: () => Promise<{ data: { user: unknown | null }; error: Error | null }>;
  signInWithPassword: (credentials: { email: string; password: string }) => Promise<unknown>;
  signOut: () => Promise<unknown>;
  onAuthStateChange: (callback: (event: string, session: unknown) => void) => { data: { subscription: { unsubscribe: () => void } } };
}

export interface PostgrestQueryBuilder<T> {
  select: (columns?: string) => PostgrestFilterBuilder<T>;
  insert: (values: unknown) => PostgrestFilterBuilder<T>;
  update: (values: unknown) => PostgrestFilterBuilder<T>;
  upsert: (values: unknown) => PostgrestFilterBuilder<T>;
  delete: () => PostgrestFilterBuilder<T>;
  eq: (column: string, value: unknown) => PostgrestFilterBuilder<T>;
  neq: (column: string, value: unknown) => PostgrestFilterBuilder<T>;
  gt: (column: string, value: unknown) => PostgrestFilterBuilder<T>;
  gte: (column: string, value: unknown) => PostgrestFilterBuilder<T>;
  lt: (column: string, value: unknown) => PostgrestFilterBuilder<T>;
  lte: (column: string, value: unknown) => PostgrestFilterBuilder<T>;
  is: (column: string, value: unknown) => PostgrestFilterBuilder<T>;
  in: (column: string, values: unknown[]) => PostgrestFilterBuilder<T>;
  contains: (column: string, value: unknown) => PostgrestFilterBuilder<T>;
  order: (column: string, opts?: { ascending?: boolean }) => PostgrestFilterBuilder<T>;
  limit: (count: number) => PostgrestFilterBuilder<T>;
  range: (from: number, to: number) => PostgrestFilterBuilder<T>;
  single: () => Promise<{ data: T | null; error: Error | null }>;
  then: (onfulfilled?: (value: { data: T[] | null; error: Error | null }) => unknown) => Promise<unknown>;
}

export interface PostgrestFilterBuilder<T> extends PostgrestQueryBuilder<T> {
  single: () => Promise<{ data: T | null; error: Error | null }>;
  maybeSingle: () => Promise<{ data: T | null; error: Error | null }>;
  csv: () => Promise<{ data: string | null; error: Error | null }>;
}

export interface StorageClient {
  from: (bucket: string) => StorageBucket;
}

export interface StorageBucket {
  upload: (path: string, file: File | Blob, options?: { contentType?: string; upsert?: boolean }) => Promise<{ data: { path: string } | null; error: Error | null }>;
  download: (path: string) => Promise<{ data: Blob | null; error: Error | null }>;
  getPublicUrl: (path: string) => { data: { publicUrl: string } };
  remove: (paths: string[]) => Promise<{ data: unknown | null; error: Error | null }>;
  list: (path?: string) => Promise<{ data: unknown[] | null; error: Error | null }>;
}

export function createClient<T = unknown>(
  _url: string,
  _key: string,
  _options?: { auth?: { storage?: Storage | undefined; persistSession?: boolean; autoRefreshToken?: boolean } }
): SupabaseClient<T> {
  console.warn('[Supabase Stub] Using stub client. Run `npm install @supabase/supabase-js` to connect to real Supabase.');

  const stubAuth: AuthClient = {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({}),
    signOut: async () => ({}),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  };

  const stubStorage: StorageClient = {
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      download: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      remove: async () => ({ data: null, error: null }),
      list: async () => ({ data: null, error: null }),
    }),
  };

  const builder = (table: string): PostgrestQueryBuilder<T> => {
    const chain: PostgrestFilterBuilder<T> = {
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
      then: async (onfulfilled) => onfulfilled?.({ data: null, error: null }),
    };
    return chain;
  };

  return {
    auth: stubAuth,
    from: builder,
    storage: stubStorage,
    rpc: async () => ({ data: null, error: null }),
  } as SupabaseClient<T>;
}
