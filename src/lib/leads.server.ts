import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "@/integrations/supabase/admin.server";

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
  .validator((data: { name: string; phone: string; email?: string; requirement?: string }) => data)
  .handler(async ({ data }) => {
    if (!data.name.trim() || !data.phone.trim()) {
      throw new Error("Name and phone are required.");
    }

    const admin = getSupabaseAdmin();

    const { data: leadNumberData, error: numberError } = await admin.rpc("generate_lead_number");
    if (numberError) throw numberError;

    const { error: insertError } = await admin.from("leads").insert({
      lead_number: leadNumberData as string,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      requirement: data.requirement?.trim() || null,
      source: "website-form",
      status: "new",
    });

    if (insertError) throw insertError;

    return { leadNumber: leadNumberData as string };
  });
