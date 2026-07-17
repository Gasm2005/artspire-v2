import { createFileRoute } from "@tanstack/react-router";
import crypto from "node:crypto";
import { confirmPaymentFromWebhook } from "@/lib/razorpay.server";

// ─── RAZORPAY WEBHOOK ───────────────────────────────────────────
// Configure this URL in Razorpay Dashboard → Settings → Webhooks:
//   https://<your-domain>/api/webhooks/razorpay
// Subscribe to at least: payment.captured
// Set RAZORPAY_WEBHOOK_SECRET in Vercel env vars to the secret shown
// there (this is DIFFERENT from RAZORPAY_KEY_SECRET).
//
// Why this exists: the browser-side confirmation in checkout.tsx is
// the fast path for a responsive UI, but if the customer closes the
// tab, loses network, or the request just fails after Razorpay has
// already captured the payment, that order would be stuck "pending"
// forever with no way to reconcile it. This webhook is Razorpay's own
// server telling us independently "this payment succeeded" — so the
// order gets confirmed even if nothing in the customer's browser ever
// ran. Both paths call the same idempotent confirmation logic, so
// whichever arrives first does the work and the second is a no-op.

export const Route = createFileRoute("/api/webhooks/razorpay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
          console.error("[razorpay webhook] RAZORPAY_WEBHOOK_SECRET not configured — rejecting webhook.");
          return new Response("Webhook not configured", { status: 500 });
        }

        // Signature is computed over the RAW body — must read as text
        // before any JSON parsing, or the signature won't match.
        const rawBody = await request.text();
        const signature = request.headers.get("x-razorpay-signature");

        if (!signature) {
          return new Response("Missing signature", { status: 400 });
        }

        const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");

        // Constant-time comparison to avoid timing attacks on the signature check.
        const signatureValid =
          expectedSignature.length === signature.length &&
          crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));

        if (!signatureValid) {
          console.warn("[razorpay webhook] Invalid signature — rejecting.");
          return new Response("Invalid signature", { status: 400 });
        }

        let event: {
          event?: string;
          payload?: { payment?: { entity?: { id?: string; order_id?: string; notes?: Record<string, string> } } };
        };

        try {
          event = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        // We only act on successful captures — other events (failed,
        // refunded, etc.) are logged but not auto-processed here; refunds
        // and failures are handled through the admin panel intentionally,
        // so a webhook glitch can't silently cancel a real order.
        if (event.event !== "payment.captured") {
          return new Response("Ignored", { status: 200 });
        }

        const payment = event.payload?.payment?.entity;
        const razorpayPaymentId = payment?.id;
        const razorpayOrderId = payment?.order_id;
        // Our internal order UUID is passed as a Razorpay "note" when the
        // order is created (see createRazorpayOrder call site in checkout.tsx) —
        // this is how we map Razorpay's order back to our own orders row.
        const internalOrderId = payment?.notes?.artspire_order_id;

        if (!razorpayPaymentId || !razorpayOrderId || !internalOrderId) {
          console.error("[razorpay webhook] Missing required fields in payload:", event);
          return new Response("Missing fields", { status: 400 });
        }

        try {
          const result = await confirmPaymentFromWebhook({
            orderId: internalOrderId,
            razorpayOrderId,
            razorpayPaymentId,
          });
          console.log(
            `[razorpay webhook] Order ${internalOrderId} ${result.alreadyConfirmed ? "already confirmed (no-op)" : "confirmed via webhook"}.`
          );
          return new Response("OK", { status: 200 });
        } catch (err) {
          console.error("[razorpay webhook] Failed to confirm order:", err);
          // Return 500 so Razorpay retries this webhook automatically.
          return new Response("Internal error", { status: 500 });
        }
      },
    },
  },
});
