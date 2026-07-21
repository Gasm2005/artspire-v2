import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "@/integrations/supabase/admin.server";
import type { OrderWithItems } from "./orders";

// ─── VERIFIED PUBLIC ORDER ACCESS ──────────────────────────────
// After the PII-exposure fix, `orders`/`order_items` have no public
// SELECT policy — the only way to read an order as a non-admin is
// through these functions, which use the service_role key but only
// return data after confirming the caller knows the phone number on
// the order. This closes the "possession of the URL = full PII
// access" gap: a leaked/guessed order UUID alone is no longer enough.

function phoneMatches(storedPhone: string, providedPhone: string): boolean {
  const normalize = (p: string) => p.replace(/\D/g, "").slice(-10);
  const stored = normalize(storedPhone);
  const provided = normalize(providedPhone);
  return stored.length === 10 && stored === provided;
}

/**
 * Used by the order-confirmation page right after checkout. The phone
 * number is read from sessionStorage (set during checkout in the same
 * browser) — if it's missing or doesn't match, the page falls back to
 * asking the visitor to type their phone number to unlock the view.
 */
export const getOrderForConfirmation = createServerFn({ method: "POST" })
  .validator((data: { orderId: string; phone: string }) => data)
  .handler(async ({ data }): Promise<OrderWithItems | null> => {
    const admin = getSupabaseAdmin();
    const { data: order, error } = await admin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", data.orderId)
      .single();

    if (error || !order) return null;
    if (!phoneMatches(order.phone, data.phone)) return null;

    return order as unknown as OrderWithItems;
  });

/**
 * Used by /track-order. Same ownership check, keyed by order number
 * instead of UUID since that's what customers are given at checkout.
 */
export const getOrderByNumberVerified = createServerFn({ method: "POST" })
  .validator((data: { orderNumber: string; phone: string }) => data)
  .handler(async ({ data }): Promise<OrderWithItems | null> => {
    const admin = getSupabaseAdmin();
    const { data: order, error } = await admin
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", data.orderNumber)
      .single();

    if (error || !order) return null;
    if (!phoneMatches(order.phone, data.phone)) return null;

    return order as unknown as OrderWithItems;
  });
