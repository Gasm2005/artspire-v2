import { supabase } from "@/integrations/supabase/client";

export interface NewsletterSubscriber {
  id: string;
  email: string | null;
  phone: string | null;
  source: string;
  created_at: string;
}

export async function subscribeToNewsletter(params: {
  email?: string;
  phone?: string;
  source?: string;
}): Promise<void> {
  const { error } = await supabase.from("newsletter_subscribers").insert({
    email: params.email || null,
    phone: params.phone || null,
    source: params.source || "footer",
  });
  // Silently ignore duplicate-email conflicts — the person is already subscribed.
  if (error && error.code !== "23505") throw error;
}

export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as NewsletterSubscriber[];
}
