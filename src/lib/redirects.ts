import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Redirect = Database["public"]["Tables"]["redirects"]["Row"];
export type RedirectInsert = Database["public"]["Tables"]["redirects"]["Insert"];
export type RedirectUpdate = Database["public"]["Tables"]["redirects"]["Update"];
export type RedirectType = Database["public"]["Enums"]["redirect_type"];

export async function getRedirects() {
  const { data, error } = await supabase
    .from("redirects")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Redirect[];
}

export async function getRedirectByOldSlug(oldSlug: string) {
  const { data, error } = await supabase
    .from("redirects")
    .select("*")
    .eq("old_slug", oldSlug)
    .eq("is_active", true)
    .single();

  if (error) throw error;
  return data as Redirect | null;
}

export async function createRedirect(values: RedirectInsert): Promise<Redirect> {
  const { data, error } = await supabase
    .from("redirects")
    .insert(values)
    .select()
    .single();

  if (error) throw error;
  return data as Redirect;
}

export async function updateRedirect(id: string, values: RedirectUpdate): Promise<Redirect> {
  const { data, error } = await supabase
    .from("redirects")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Redirect;
}

export async function deleteRedirect(id: string): Promise<void> {
  const { error } = await supabase
    .from("redirects")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Client-side redirect check for React Router
export function checkForRedirect(slug: string, redirects: Redirect[]): string | null {
  const redirect = redirects.find((r) => r.old_slug === slug && r.is_active);
  if (redirect && redirect.new_slug) return redirect.new_slug;
  return null;
}
