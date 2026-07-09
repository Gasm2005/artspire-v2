import { createServerFn } from "@tanstack/react-start";
import Razorpay from "razorpay";
import crypto from "node:crypto";

// Server-only Razorpay config. Never import this file's Razorpay
// instance or key_secret into client code — the .server.ts suffix
// (via createServerFn boundary) keeps this out of the client bundle.

function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel environment variables."
    );
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

/**
 * Creates a Razorpay Order for the given amount (in INR rupees — this
 * function handles the paise conversion internally).
 * Called from the checkout page before opening the Razorpay Checkout modal.
 */
export const createRazorpayOrder = createServerFn({ method: "POST" })
  .validator((data: { amount: number; receipt: string }) => data)
  .handler(async ({ data }) => {
    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: Math.round(data.amount * 100), // rupees → paise
      currency: "INR",
      receipt: data.receipt,
      payment_capture: true,
    });

    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  });

/**
 * Verifies the payment signature returned by Razorpay Checkout after
 * a successful payment. This MUST happen server-side — the key_secret
 * used for HMAC verification never touches the client.
 *
 * Per Razorpay docs: signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
 */
export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .validator((data: { orderId: string; paymentId: string; signature: string }) => data)
  .handler(async ({ data }) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      throw new Error("RAZORPAY_KEY_SECRET not configured.");
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${data.orderId}|${data.paymentId}`)
      .digest("hex");

    const isValid = expectedSignature === data.signature;

    return { valid: isValid };
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
