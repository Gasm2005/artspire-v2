import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/integrations/supabase/admin.server";
import type { Database } from "@/integrations/supabase/types";

type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];

// Verifies the caller is a signed-in admin using the bearer token attached by
// the global attachSupabaseAuth middleware. is_admin() is a SECURITY DEFINER
// function that checks auth.uid()'s role. Used to gate access to signed URLs
// for the private reference-images bucket (customers' family photos).
async function assertAdmin(): Promise<void> {
  const token = getRequest()?.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) throw new Error("Unauthorized");
  const url = process.env.VITE_SUPABASE_URL;
  const anon = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Supabase not configured.");
  const client = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.rpc("is_admin");
  if (error || data !== true) throw new Error("Forbidden");
}

// ─── CONTACT FORM → LEADS CRM ──────────────────────────────────
// Previously the contact form only opened a WhatsApp deep link —
// nothing was ever written to the `leads` table, even though a full
// admin Lead Center exists to manage this data. This closes that gap:
// every contact-form submission now creates a real lead record, so
// the (currently placeholder) Lead Center has real data to eventually
// build against, and nothing is lost if WhatsApp isn't opened/replied to.
//
// Uses service_role because `leads` has no public INSERT policy (only
// the admin FOR ALL policy) — rather than loosen RLS for a public
// insert, we go through a server function that can also generate the
// lead_number consistently.

export const submitContactLead = createServerFn({ method: "POST" })
  .validator(
    (data: {
      name: string;
      phone: string;
      email?: string;
      requirement?: string;
      photoUrls?: string[];
    }) => data,
  )
  .handler(async ({ data }) => {
    if (!data.name.trim() || !data.phone.trim()) {
      throw new Error("Name and phone are required.");
    }

    const admin = getSupabaseAdmin();

    const { data: leadNumberData, error: numberError } = await admin.rpc("generate_lead_number");
    if (numberError) throw numberError;

    // photo_urls (storage PATHS in the private reference-images bucket) is only
    // included when photos exist, so photo-less submits keep working even before
    // the additive migration is applied. Cast because the generated types won't
    // include the new column until they're regenerated post-migration.
    const insert = {
      lead_number: leadNumberData as string,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      requirement: data.requirement?.trim() || null,
      source: "website-form",
      status: "new",
      ...(data.photoUrls?.length ? { photo_urls: data.photoUrls } : {}),
    };

    const { error: insertError } = await admin.from("leads").insert(insert as LeadInsert);

    if (insertError) throw insertError;

    return { leadNumber: leadNumberData as string };
  });

// Admin-only. Re-signs stored reference-image PATHS into short-lived URLs on
// every call, so links never expire out from under an old lead.
export const getCommissionPhotoUrls = createServerFn({ method: "POST" })
  .validator((data: { paths: string[] }) => data)
  .handler(async ({ data }): Promise<{ urls: (string | null)[] }> => {
    await assertAdmin();
    if (!data.paths?.length) return { urls: [] };
    const admin = getSupabaseAdmin();
    const urls = await Promise.all(
      data.paths.map(async (p) => {
        const { data: signed } = await admin.storage
          .from("reference-images")
          .createSignedUrl(p, 3600);
        return signed?.signedUrl ?? null;
      }),
    );
    return { urls };
  });
