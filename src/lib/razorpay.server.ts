import { createServerFn } from "@tanstack/react-start";
import Razorpay from "razorpay";
import crypto from "node:crypto";
import { getSupabaseAdmin } from "@/integrations/supabase/admin.server";
import { sendOrderConfirmationEmails } from "./email.server";
import type { Order, OrderItem } from "./orders";
import { ACTIVE_CURRENCY, toSubunits, type CurrencyCode } from "./currency";

// Server-only Razorpay config. Never import this file's Razorpay
// instance or key_secret into client code — the .server.ts suffix
// (via createServerFn boundary) keeps this out of the client bundle.

function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel environment variables.",
    );
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// Flat shipping rate — server-authoritative. Must match the value shown on
// the checkout page (src/routes/checkout.tsx SHIPPING_COST). Kept here so a
// tampered client cannot alter what is actually charged.
const SHIPPING_COST = 150;

/**
 * Creates a Razorpay Order for the given internal order.
 *
 * SECURITY: the amount is recomputed here from the *current* product prices
 * using the service_role client — the client-sent total, the order row's
 * stored total, and the order_items price snapshots are all
 * public-writable (cart_items / orders INSERT have permissive RLS) and must
 * never be trusted. The authoritative figures are written back onto the
 * order + items before the Razorpay order is created, and the Razorpay
 * order id is bound to our order server-side.
 * Called from the checkout page before opening the Razorpay Checkout modal.
 */
export const createRazorpayOrder = createServerFn({ method: "POST" })
  .validator((data: { receipt: string; internalOrderId: string; currency?: CurrencyCode }) => data)
  .handler(async ({ data }) => {
    const razorpay = getRazorpayInstance();
    const currency = data.currency ?? ACTIVE_CURRENCY;
    const admin = getSupabaseAdmin();

    const { data: order, error: orderErr } = await admin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", data.internalOrderId)
      .single();
    if (orderErr || !order) throw new Error("Order not found.");
    if (order.payment_status === "paid") throw new Error("Order already paid.");

    const items = ((order as unknown as { order_items?: OrderItem[] }).order_items ??
      []) as OrderItem[];
    if (items.length === 0) throw new Error("Order has no items.");

    // Recompute the amount authoritatively from live product prices.
    let subtotal = 0;
    for (const item of items) {
      if (!item.product_id) throw new Error("Order item is missing a product reference.");
      const { data: product, error: prodErr } = await admin
        .from("products")
        .select("price, status")
        .eq("id", item.product_id)
        .single();
      if (prodErr || !product) throw new Error("A product in this order no longer exists.");
      if (product.status !== "published")
        throw new Error("A product in this order is not purchasable.");

      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      // Correct the stored snapshot so the DB order reflects the true price.
      await admin
        .from("order_items")
        .update({ price_snapshot: product.price, line_total: lineTotal })
        .eq("id", item.id);
    }

    // Discounts are forced to 0 until a validated coupon system exists — a
    // client-supplied discount_amount could otherwise zero out the total.
    const total = subtotal + SHIPPING_COST;

    await admin
      .from("orders")
      .update({ subtotal, shipping_cost: SHIPPING_COST, discount_amount: 0, total })
      .eq("id", order.id);

    const rzpOrder = await razorpay.orders.create({
      amount: toSubunits(total, currency), // major units → minor units
      currency,
      receipt: data.receipt,
      payment_capture: true,
      // Lets the webhook map Razorpay's payment event back to our own
      // orders row without guessing — see /api/webhooks/razorpay.
      notes: { artspire_order_id: data.internalOrderId },
    });

    // Bind the Razorpay order id to our order server-side (do NOT rely on the
    // client calling attachRazorpayOrderId — anon has no UPDATE on orders).
    await admin.from("orders").update({ razorpay_order_id: rzpOrder.id }).eq("id", order.id);

    return {
      id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    };
  });

/**
 * Applies a confirmed payment to an order — updates status, deducts
 * inventory, sends confirmation email. Does NOT verify any signature
 * itself; callers must have already established trust (either by
 * verifying the checkout-callback signature, or the webhook's
 * X-Razorpay-Signature header) before calling this.
 *
 * Idempotent — safe to call twice for the same order (browser callback
 * + webhook both calling this for the same payment is the expected,
 * normal case, not an error).
 */
async function applyConfirmedPayment(params: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<{ order: Order; alreadyConfirmed: boolean }> {
  const admin = getSupabaseAdmin();

  const { data: existingOrder, error: fetchError } = await admin
    .from("orders")
    .select("*")
    .eq("id", params.orderId)
    .single();

  if (fetchError || !existingOrder) throw new Error(`Order ${params.orderId} not found.`);

  if (existingOrder.payment_status === "paid") {
    return { order: existingOrder as unknown as Order, alreadyConfirmed: true };
  }

  // ─── AUTHORITATIVE PAYMENT VERIFICATION ───────────────────────
  // Defends against (a) amount tampering and (b) reusing one order's valid
  // signature to confirm a different order. A valid HMAC signature only
  // proves "a real payment happened" — not that it was for THIS order or
  // the right amount. So we verify the payment directly against Razorpay.
  if (
    !existingOrder.razorpay_order_id ||
    existingOrder.razorpay_order_id !== params.razorpayOrderId
  ) {
    throw new Error("Payment does not belong to this order — refusing to confirm.");
  }

  const razorpay = getRazorpayInstance();
  const payment = await razorpay.payments.fetch(params.razorpayPaymentId);

  if (payment.order_id !== params.razorpayOrderId) {
    throw new Error("Payment/order mismatch — refusing to confirm.");
  }
  if (payment.status !== "captured") {
    throw new Error(`Payment not captured (status: ${payment.status}) — refusing to confirm.`);
  }
  const currency = ((existingOrder.currency as CurrencyCode) ?? ACTIVE_CURRENCY) as CurrencyCode;
  const expectedSubunits = toSubunits(Number(existingOrder.total), currency);
  if (Number(payment.amount) !== expectedSubunits) {
    throw new Error("Paid amount does not match the order total — refusing to confirm.");
  }

  const { data: updatedOrder, error: updateError } = await admin
    .from("orders")
    .update({
      status: "confirmed",
      payment_status: "paid",
      razorpay_payment_id: params.razorpayPaymentId,
      razorpay_signature: params.razorpaySignature,
      confirmed_at: new Date().toISOString(),
    })
    .eq("id", params.orderId)
    .select()
    .single();

  if (updateError || !updatedOrder)
    throw new Error(`Failed to confirm order ${params.orderId}: ${updateError?.message}`);

  const { data: items } = await admin
    .from("order_items")
    .select("*")
    .eq("order_id", params.orderId);

  if (items) {
    await Promise.all(
      items
        .filter((i) => i.product_id)
        .map((i) =>
          admin.rpc("deduct_product_inventory", {
            p_product_id: i.product_id!,
            p_quantity: i.quantity,
          }),
        ),
    );

    sendOrderConfirmationEmails({
      data: { order: updatedOrder as unknown as Order, items: items as OrderItem[] },
    }).catch((err) =>
      console.error("[razorpay] Order confirmed but confirmation email failed:", err),
    );
  }

  return { order: updatedOrder as unknown as Order, alreadyConfirmed: false };
}

/**
 * Verifies the checkout-callback signature (order_id|payment_id signed
 * with key_secret) then applies the confirmation. This is the path
 * used by `confirmPaymentAfterCheckout` (browser fast path).
 */
export async function confirmPaymentServerSide(params: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<{ order: Order; alreadyConfirmed: boolean }> {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) throw new Error("RAZORPAY_KEY_SECRET not configured.");

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== params.razorpaySignature) {
    throw new Error(
      "Invalid Razorpay payment signature — possible tampering, refusing to confirm order.",
    );
  }

  return applyConfirmedPayment({
    orderId: params.orderId,
    razorpayOrderId: params.razorpayOrderId,
    razorpayPaymentId: params.razorpayPaymentId,
    razorpaySignature: params.razorpaySignature,
  });
}

/**
 * Reconciliation path for the Razorpay webhook — the caller
 * (`/api/webhooks/razorpay`) has already verified the
 * X-Razorpay-Signature header over the raw request body, so trust is
 * established differently here; we still compute the deterministic
 * order_id|payment_id signature ourselves (for consistent storage) but
 * don't need it handed to us by an untrusted client.
 */
export async function confirmPaymentFromWebhook(params: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
}): Promise<{ order: Order; alreadyConfirmed: boolean }> {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) throw new Error("RAZORPAY_KEY_SECRET not configured.");

  const signature = crypto
    .createHmac("sha256", keySecret)
    .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
    .digest("hex");

  return applyConfirmedPayment({
    orderId: params.orderId,
    razorpayOrderId: params.razorpayOrderId,
    razorpayPaymentId: params.razorpayPaymentId,
    razorpaySignature: signature,
  });
}

/**
 * Called by the browser right after Razorpay Checkout's `handler`
 * callback fires. This is the fast path for a responsive UI — the
 * webhook (below) is the reliable backstop in case this call never
 * happens (tab closed, network drop, etc).
 */
export const confirmPaymentAfterCheckout = createServerFn({ method: "POST" })
  .validator(
    (data: {
      orderId: string;
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const result = await confirmPaymentServerSide(data);
    return { order: result.order };
  });

/**
 * Returns the public Razorpay Key ID for client-side checkout.js
 * initialization. Safe to expose — the key_id is meant to be public,
 * only key_secret must stay server-side.
 */
export const getRazorpayKeyId = createServerFn({ method: "GET" }).handler(async () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) {
    throw new Error("RAZORPAY_KEY_ID not configured.");
  }
  return { keyId };
});
