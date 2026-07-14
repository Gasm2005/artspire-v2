import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { getCartItems, getOrCreateSessionId, clearCart, type CartItem } from "@/lib/cart";
import { createPendingOrder, attachRazorpayOrderId, confirmOrderPayment, markOrderPaymentFailed } from "@/lib/orders";
import { sendOrderConfirmationEmails } from "@/lib/email.server";
import { createRazorpayOrder, verifyRazorpayPayment, getRazorpayKeyId } from "@/lib/razorpay.server";
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

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

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

      // 2. Load Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Payment gateway failed to load.", "Please check your connection and try again.");
        setSubmitting(false);
        return;
      }

      // 3. Create Razorpay order (server-side)
      const razorpayOrder = await createRazorpayOrder({ data: { amount: total, receipt: order.order_number } });
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
            const { valid } = await verifyRazorpayPayment({
              data: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            });

            if (!valid) {
              await markOrderPaymentFailed(order.id);
              toast.error("Payment verification failed.", "Please contact support if you were charged.");
              setSubmitting(false);
              return;
            }

            const confirmedOrder = await confirmOrderPayment(order.id, response.razorpay_payment_id, response.razorpay_signature);
            await clearCart(getOrCreateSessionId());
            window.dispatchEvent(new CustomEvent("artspire:cart-updated"));

            // Fire-and-forget — email failure should never block the
            // user from reaching their confirmation page.
            sendOrderConfirmationEmails({
              data: {
                order: confirmedOrder,
                items: items.map((item) => ({
                  id: item.id,
                  order_id: order.id,
                  product_id: item.product_id,
                  title_snapshot: item.product?.title ?? "Unknown Product",
                  image_snapshot: item.product?.image_url ?? null,
                  price_snapshot: item.price_at_add,
                  quantity: item.quantity,
                  line_total: item.price_at_add * item.quantity,
                  created_at: new Date().toISOString(),
                })),
              },
            }).catch((err) => console.error("Email notification failed:", err));

            router.navigate({ to: "/order-confirmation/$orderId", params: { orderId: order.id } });
          } catch (err) {
            console.error(err);
            toast.error("Something went wrong confirming your payment.", "Please contact support.");
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
                    <label className={labelClass}>Postal Code *</label>
                    <input type="text" value={form.postal_code} onChange={(e) => updateField("postal_code", e.target.value)} className={inputClass} />
                  </div>
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
