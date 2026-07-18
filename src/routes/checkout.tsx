import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { getCartItems, getOrCreateSessionId, clearCart, type CartItem } from "@/lib/cart";
import { createPendingOrder, attachRazorpayOrderId, markOrderPaymentFailed } from "@/lib/orders";
import { createRazorpayOrder, confirmPaymentAfterCheckout, getRazorpayKeyId } from "@/lib/razorpay.server";
import { toast } from "@/lib/toast";
import { SiteChrome } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | The Artspire" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const SHIPPING_COST = 150; // flat rate; can be made dynamic later

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    giftMessage: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const sessionId = getOrCreateSessionId();
      const data = await getCartItems(sessionId);
      setItems(data);
      if (data.length === 0) {
        router.navigate({ to: "/cart" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const saved = sessionStorage.getItem("artspire_gift_message");
    if (saved) setForm((prev) => ({ ...prev, giftMessage: saved }));
  }, []);

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const [pincodeLookupState, setPincodeLookupState] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    const pincode = form.postal_code.trim();
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeLookupState("idle");
      return;
    }

    let cancelled = false;
    setPincodeLookupState("loading");

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        const office = data?.[0]?.PostOffice?.[0];
        if (!cancelled && office) {
          setForm((prev) => ({
            ...prev,
            city: prev.city.trim() ? prev.city : office.District,
            state: office.State,
          }));
          setPincodeLookupState("done");
        } else if (!cancelled) {
          setPincodeLookupState("error");
        }
      } catch {
        if (!cancelled) setPincodeLookupState("error");
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [form.postal_code]);

  const subtotal = items.reduce((sum, item) => sum + item.price_at_add * item.quantity, 0);
  const total = subtotal + SHIPPING_COST;

  function validateForm(): boolean {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Please fill in your contact details.");
      return false;
    }
    if (!form.line1.trim() || !form.city.trim() || !form.state.trim() || !form.postal_code.trim()) {
      toast.error("Please fill in your complete shipping address.");
      return false;
    }
    return true;
  }

  async function handlePayment() {
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      const order = await createPendingOrder({
        customerName: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        shippingAddress: {
          line1: form.line1.trim(),
          line2: form.line2.trim() || undefined,
          city: form.city.trim(),
          state: form.state.trim(),
          postal_code: form.postal_code.trim(),
          country: form.country,
        },
        giftMessage: form.giftMessage.trim() || undefined,
        cartItems: items,
        shippingCost: SHIPPING_COST,
      });

      sessionStorage.setItem(`artspire_order_phone_${order.id}`, form.phone.trim());

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Payment gateway failed to load.", "Please check your connection and try again.");
        setSubmitting(false);
        return;
      }

      const razorpayOrder = await createRazorpayOrder({
        data: { amount: total, receipt: order.order_number, internalOrderId: order.id },
      });
      await attachRazorpayOrderId(order.id, razorpayOrder.id);

      const { keyId } = await getRazorpayKeyId();

      const rzp = new window.Razorpay({
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "The Artspire",
        description: `Order ${order.order_number}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: form.name.trim(),
          email: form.email.trim(),
          contact: form.phone.trim(),
        },
        theme: { color: "#20201C" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await confirmPaymentAfterCheckout({
              data: {
                orderId: order.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
            });

            await clearCart(getOrCreateSessionId());
            window.dispatchEvent(new CustomEvent("artspire:cart-updated"));
            sessionStorage.removeItem("artspire_gift_message");

            router.navigate({ to: "/order-confirmation/$orderId", params: { orderId: order.id } });
          } catch (err) {
            console.error(err);
            toast.error(
              "We couldn't confirm your payment automatically.",
              "If you were charged, your order will be confirmed shortly — check Track Order or contact us on WhatsApp."
            );
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: async () => {
            await markOrderPaymentFailed(order.id);
            setSubmitting(false);
          },
        },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Failed to start checkout.", "Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <SiteChrome>
      <div className="wrap crumbs">Home / Shop / Cart / <span>Checkout</span></div>
      <section style={{ paddingTop: 16 }}>
        <div className="wrap">
          <h1 className="serif" style={{ fontSize: 44, color: "var(--forest)", fontWeight: 500, marginBottom: 28 }}>Checkout</h1>

          {loading ? (
            <p style={{ color: "var(--stone)" }}>Loading…</p>
          ) : (
            <div className="cart-cols" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 48, alignItems: "start" }}>
              <div>
                <div className="card-box" style={{ marginBottom: 20 }}>
                  <h3 className="serif" style={{ fontSize: 20, color: "var(--forest)", fontWeight: 500, marginBottom: 16 }}>Contact details</h3>
                  <div className="field"><label>Full name *</label><input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div className="field"><label>Email *</label><input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} /></div>
                    <div className="field"><label>Phone *</label><input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} /></div>
                  </div>
                </div>

                <div className="card-box">
                  <h3 className="serif" style={{ fontSize: 20, color: "var(--forest)", fontWeight: 500, marginBottom: 16 }}>Shipping address</h3>
                  <div className="field"><label>Address line 1 *</label><input type="text" value={form.line1} onChange={(e) => updateField("line1", e.target.value)} /></div>
                  <div className="field"><label>Address line 2</label><input type="text" value={form.line2} onChange={(e) => updateField("line2", e.target.value)} /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div className="field">
                      <label>Postal code *</label>
                      <input type="text" inputMode="numeric" maxLength={6} value={form.postal_code} onChange={(e) => updateField("postal_code", e.target.value.replace(/\D/g, ""))} placeholder="e.g. 226001" />
                      {pincodeLookupState === "loading" && <p style={{ fontSize: 11, color: "var(--stone)", marginTop: 4 }}>Looking up city/state…</p>}
                      {pincodeLookupState === "error" && <p style={{ fontSize: 11, color: "var(--stone)", marginTop: 4 }}>Couldn't auto-fill — please enter manually.</p>}
                    </div>
                    <div className="field"><label>City *</label><input type="text" value={form.city} onChange={(e) => updateField("city", e.target.value)} /></div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div className="field"><label>State *</label><input type="text" value={form.state} onChange={(e) => updateField("state", e.target.value)} /></div>
                    <div className="field"><label>Country</label><input type="text" value={form.country} onChange={(e) => updateField("country", e.target.value)} /></div>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}><label>Gift note (optional)</label><textarea rows={2} value={form.giftMessage} onChange={(e) => updateField("giftMessage", e.target.value)} placeholder="Add a personal message…" /></div>
                </div>
              </div>

              <div className="summary">
                <h3 className="serif" style={{ fontSize: 22, color: "var(--forest)", fontWeight: 500, marginBottom: 16 }}>Order Summary</h3>
                {items.map((item) => (
                  <div className="row" key={item.id}><span>{item.product?.title} × {item.quantity}</span><span>₹{(item.price_at_add * item.quantity).toLocaleString("en-IN")}</span></div>
                ))}
                <div className="row"><span>Shipping</span><span>₹{SHIPPING_COST.toLocaleString("en-IN")}</span></div>
                <div className="row total"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
                <button className="btn btn-solid btn-block" style={{ marginTop: 18 }} disabled={submitting} onClick={handlePayment}><span>{submitting ? "Processing…" : "Pay Securely"}</span></button>
                <p style={{ fontSize: 11, color: "var(--stone)", textAlign: "center", marginTop: 12 }}>Secured by Razorpay · UPI, Cards, Netbanking</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteChrome>
  );
}
