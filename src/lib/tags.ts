import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type TagInsert = Database["public"]["Tables"]["tags"]["Insert"];

export async function getTags() {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Tag[];
}

export async function getTagBySlug(slug: string) {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as Tag | null;
}

export function generateTagSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function ensureUniqueTagSlug(name: string): Promise<string> {
  let slug = generateTagSlug(name);
  let counter = 2;
  let isUnique = false;

  while (!isUnique) {
    const { data, error } = await supabase
      .from("tags")
      .select("id")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      isUnique = true;
    } else {
      slug = `${generateTagSlug(name)}-${counter}`;
      counter++;
    }
  }

  return slug;
}

export async function createTag(values: TagInsert): Promise<Tag> {
  const { data, error } = await supabase
    .from("tags")
    .insert(values)
    .select()
    .single();

  if (error) throw error;
  return data as Tag;
}

export async function deleteTag(id: string): Promise<void> {
  const { error } = await supabase
    .from("tags")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
