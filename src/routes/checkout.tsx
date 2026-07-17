import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { getCartItems, getOrCreateSessionId, clearCart, type CartItem } from "@/lib/cart";
import { createPendingOrder, attachRazorpayOrderId, markOrderPaymentFailed } from "@/lib/orders";
import { createRazorpayOrder, confirmPaymentAfterCheckout, getRazorpayKeyId } from "@/lib/razorpay.server";
import { toast } from "@/lib/toast";
import { ArtspireBreadcrumb } from "@/components/ArtspireBreadcrumb";
import { Loader2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Artspire" },
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
      // 1. Create pending order in Supabase
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

      // Lets the order-confirmation page verify ownership without an
      // extra prompt when it's the same browser session that just
      // checked out (see src/lib/orders-access.server.ts).
      sessionStorage.setItem(`artspire_order_phone_${order.id}`, form.phone.trim());

      // 2. Load Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Payment gateway failed to load.", "Please check your connection and try again.");
        setSubmitting(false);
        return;
      }

      // 3. Create Razorpay order (server-side)
      const razorpayOrder = await createRazorpayOrder({
        data: { amount: total, receipt: order.order_number, internalOrderId: order.id },
      });
      await attachRazorpayOrderId(order.id, razorpayOrder.id);

      // 4. Get public key for checkout init
      const { keyId } = await getRazorpayKeyId();

      // 5. Open Razorpay Checkout
      const rzp = new window.Razorpay({
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Artspire",
        description: `Order ${order.order_number}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: form.name.trim(),
          email: form.email.trim(),
          contact: form.phone.trim(),
        },
        theme: { color: "#3E4D3A" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // Single server-side call: verifies the signature AND
            // confirms the order AND deducts inventory AND sends the
            // confirmation email, all atomically with the service_role
            // key. The browser never touches the order's payment_status
            // directly anymore — this closes the RLS gap where that
            // update used to silently fail (or worse, be forgeable).
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
            // Don't call markOrderPaymentFailed here — the payment may
            // have actually succeeded and this could be a transient
            // network/verification error. A wrongly-failed order is worse
            // than a pending one; the Razorpay webhook will reconcile the
            // true state shortly regardless of what happens in this tab.
            toast.error(
              "We couldn't confirm your payment automatically.",
              "If you were charged, your order will be confirmed shortly — check Track Order or contact us on WhatsApp."
            );
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: async () => {
            // The user closed the modal without paying — safe to mark
            // failed since no payment_id exists yet to reconcile against.
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

  const inputClass = "w-full h-[46px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block font-body text-[11px] font-bold text-stone uppercase tracking-wider mb-1.5";

  if (loading) {
    return (
      <ShopLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-stone/40" />
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <section className="section-padding bg-cream min-h-[70vh]">
        <div className="container-main max-w-4xl">
          <ArtspireBreadcrumb
            crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]}
            className="mb-6"
          />
          <h1 className="font-display text-[28px] md:text-[36px] text-forest font-medium mb-8">Checkout</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form */}
            <div className="flex-1 space-y-6">
              <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
                <h2 className="font-display text-[16px] text-forest font-medium">Contact Details</h2>
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
                <h2 className="font-display text-[16px] text-forest font-medium">Shipping Address</h2>
                <div>
                  <label className={labelClass}>Address Line 1 *</label>
                  <input type="text" value={form.line1} onChange={(e) => updateField("line1", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Address Line 2</label>
                  <input type="text" value={form.line2} onChange={(e) => updateField("line2", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Postal Code *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={form.postal_code}
                    onChange={(e) => updateField("postal_code", e.target.value.replace(/\D/g, ""))}
                    className={inputClass}
                    placeholder="e.g. 208001"
                  />
                  {pincodeLookupState === "loading" && (
                    <p className="font-body text-[11px] text-stone/50 mt-1">Looking up city/state…</p>
                  )}
                  {pincodeLookupState === "error" && (
                    <p className="font-body text-[11px] text-stone/50 mt-1">Couldn't auto-fill — please enter manually.</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>City *</label>
                    <input type="text" value={form.city} onChange={(e) => updateField("city", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>State *</label>
                    <input type="text" value={form.state} onChange={(e) => updateField("state", e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Country</label>
                    <input type="text" value={form.country} onChange={(e) => updateField("country", e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border p-5">
                <label className={labelClass}>Gift Note (optional)</label>
                <textarea
                  value={form.giftMessage}
                  onChange={(e) => updateField("giftMessage", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white font-body text-[13px] text-forest focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>
            </div>

            {/* Order summary + pay */}
            <div className="lg:w-[320px] shrink-0">
              <div className="bg-white rounded-2xl border border-border p-5 sticky top-24 space-y-4">
                <h2 className="font-display text-[16px] text-forest font-medium">Order Summary</h2>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between font-body text-[12px]">
                      <span className="text-stone truncate pr-2">{item.product?.title} × {item.quantity}</span>
                      <span className="text-forest font-semibold shrink-0">₹{(item.price_at_add * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 space-y-1.5">
                  <div className="flex justify-between font-body text-[13px]">
                    <span className="text-stone">Subtotal</span>
                    <span className="text-forest">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-body text-[13px]">
                    <span className="text-stone">Shipping</span>
                    <span className="text-forest">₹{SHIPPING_COST.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-body text-[15px] font-semibold pt-1.5 border-t border-border">
                    <span className="text-forest">Total</span>
                    <span className="text-forest">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 w-full h-[50px] bg-forest text-white font-body font-bold text-[13px] uppercase tracking-wider rounded-xl hover:bg-forest/90 transition-colors disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  {submitting ? "Processing…" : "Pay Securely"}
                </button>
                <p className="font-body text-[10px] text-stone/40 text-center">Secured by Razorpay · UPI, Cards, Netbanking</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}
