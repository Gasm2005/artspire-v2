import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import type { Order, OrderItem } from "./orders";

// ─── Server-only email sending ───────────────────────────────
// Uses Resend (https://resend.com) — free tier covers 100 emails/day,
// which is plenty for early order volume. Requires RESEND_API_KEY in
// Vercel env vars. If not configured, we log a warning and skip sending
// rather than blocking checkout — a missing email should never fail
// an already-paid order.

const OWNER_EMAIL = "Ajju_pandey@outlook.com";
const FROM_EMAIL = "Artspire <orders@artspire.in>"; // update once domain is verified in Resend

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping order confirmation email.");
    return null;
  }
  return new Resend(apiKey);
}

function itemsToHtml(items: OrderItem[]): string {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #E5E0D8;font-family:sans-serif;font-size:13px;color:#1D1C17;">
          ${item.title_snapshot} × ${item.quantity}
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #E5E0D8;font-family:sans-serif;font-size:13px;color:#1D1C17;text-align:right;">
          ₹${item.line_total.toLocaleString("en-IN")}
        </td>
      </tr>`,
    )
    .join("");
}

function customerEmailHtml(order: Order, items: OrderItem[]): string {
  return `
  <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#FAF8F5;padding:32px 24px;">
    <h1 style="color:#2D4A35;font-size:22px;margin:0 0 4px;">Thank you, ${order.customer_name.split(" ")[0]}!</h1>
    <p style="color:#8C8579;font-size:13px;margin:0 0 24px;">Your order <strong>${order.order_number}</strong> has been confirmed.</p>
    <table style="width:100%;border-collapse:collapse;">
      ${itemsToHtml(items)}
      <tr>
        <td style="padding:10px 0;font-family:sans-serif;font-size:14px;font-weight:bold;color:#2D4A35;">Total</td>
        <td style="padding:10px 0;font-family:sans-serif;font-size:14px;font-weight:bold;color:#2D4A35;text-align:right;">₹${order.total.toLocaleString("en-IN")}</td>
      </tr>
    </table>
    <p style="color:#8C8579;font-size:12px;margin-top:24px;">
      We'll notify you again once your piece is shipped. Questions? Reply to this email or WhatsApp us at
      <a href="https://wa.me/917408690994" style="color:#2D4A35;">+91 74086 90994</a>.
    </p>
    <p style="color:#C9A84C;font-size:12px;font-weight:bold;margin-top:16px;">— Artspire · Crafting Your Vision</p>
  </div>`;
}

function ownerEmailHtml(order: Order, items: OrderItem[]): string {
  const addr = order.shipping_address;
  return `
  <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
    <h2 style="color:#2D4A35;">New order: ${order.order_number}</h2>
    <p style="font-size:13px;color:#1D1C17;"><strong>${order.customer_name}</strong> · ${order.phone} · ${order.email}</p>
    <p style="font-size:13px;color:#1D1C17;">${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}, ${addr.city}, ${addr.state} ${addr.postal_code}</p>
    <table style="width:100%;border-collapse:collapse;margin-top:12px;">
      ${itemsToHtml(items)}
      <tr>
        <td style="padding:10px 0;font-family:sans-serif;font-size:14px;font-weight:bold;">Total</td>
        <td style="padding:10px 0;font-family:sans-serif;font-size:14px;font-weight:bold;text-align:right;">₹${order.total.toLocaleString("en-IN")}</td>
      </tr>
    </table>
    <p style="font-size:12px;color:#8C8579;margin-top:16px;">View and manage in Admin → Orders.</p>
  </div>`;
}

export const sendOrderConfirmationEmails = createServerFn({ method: "POST" })
  .validator((data: { order: Order; items: OrderItem[] }) => data)
  .handler(async ({ data }) => {
    const resend = getResendClient();
    if (!resend) return { sent: false, reason: "not_configured" };

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: data.order.email,
        subject: `Order confirmed — ${data.order.order_number}`,
        html: customerEmailHtml(data.order, data.items),
      });

      await resend.emails.send({
        from: FROM_EMAIL,
        to: OWNER_EMAIL,
        subject: `🎨 New order — ${data.order.order_number} (₹${data.order.total.toLocaleString("en-IN")})`,
        html: ownerEmailHtml(data.order, data.items),
      });

      return { sent: true };
    } catch (err) {
      // Never let email failure break the checkout flow — the order is
      // already paid and saved; email is a nice-to-have notification.
      console.error("[email] Failed to send order confirmation:", err);
      return { sent: false, reason: "send_failed" };
    }
  });
