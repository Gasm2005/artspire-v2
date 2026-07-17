import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { getOrderForConfirmation } from "@/lib/orders-access.server";
import type { OrderWithItems } from "@/lib/orders";
import { CheckCircle2, ArrowRight, Loader2, Lock } from "lucide-react";

export const Route = createFileRoute("/order-confirmation/$orderId")({
  head: () => ({
    meta: [
      { title: "Order Confirmed | Artspire" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmationPage,
});

// This page used to load the order by ID alone, which meant anyone
// who obtained the URL (shared, screenshotted, browser history) could
// see the customer's full name, email, phone, and address forever. It
// now requires the phone number to match too — read automatically
// from sessionStorage if this is the same browser that just checked
// out, or typed in manually otherwise.

function OrderConfirmationPage() {
  const { orderId } = Route.useParams();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsPhone, setNeedsPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [notFoundOrMismatch, setNotFoundOrMismatch] = useState(false);

  async function attemptLoad(phone: string) {
    try {
      const result = await getOrderForConfirmation({ data: { orderId, phone } });
      if (result) {
        setOrder(result);
        setNeedsPhone(false);
        setNotFoundOrMismatch(false);
      } else {
        setNeedsPhone(true);
        setNotFoundOrMismatch(true);
      }
    } catch (err) {
      console.error(err);
      setNeedsPhone(true);
      setNotFoundOrMismatch(true);
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  }

  useEffect(() => {
    const savedPhone = sessionStorage.getItem(`artspire_order_phone_${orderId}`);
    if (savedPhone) {
      attemptLoad(savedPhone);
    } else {
      setLoading(false);
      setNeedsPhone(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  function handleVerify() {
    if (!phoneInput.trim()) return;
    setVerifying(true);
    setNotFoundOrMismatch(false);
    attemptLoad(phoneInput.trim());
  }

  if (loading) {
    return (
      <ShopLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-forest" />
        </div>
      </ShopLayout>
    );
  }

  if (needsPhone && !order) {
    return (
      <ShopLayout>
        <section className="section-padding bg-cream min-h-[70vh] flex items-center">
          <div className="container-main max-w-sm text-center">
            <Lock size={28} className="text-forest/40 mx-auto mb-4" />
            <h1 className="font-display text-[22px] text-forest font-medium mb-2">Verify it's you</h1>
            <p className="font-body text-[13px] text-stone mb-5">
              Enter the phone number you used at checkout to view this order.
            </p>
            <input
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="98765 43210"
              className="w-full h-[46px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest text-center focus:outline-none focus:border-gold mb-3"
            />
            {notFoundOrMismatch && (
              <p className="font-body text-[12px] text-red-600 mb-3">
                That doesn't match — check the number and try again, or WhatsApp us for help.
              </p>
            )}
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="flex items-center justify-center gap-2 w-full h-[46px] bg-forest text-white font-body font-bold text-[13px] rounded-xl hover:bg-forest/90 transition-colors disabled:opacity-60"
            >
              {verifying && <Loader2 size={14} className="animate-spin" />}
              View Order
            </button>
          </div>
        </section>
      </ShopLayout>
    );
  }

  if (!order) return null;

  return (
    <ShopLayout>
      <section className="section-padding bg-cream min-h-[70vh]">
        <div className="container-main max-w-2xl text-center">
          <CheckCircle2 size={52} className="text-forest mx-auto mb-5" />
          <h1 className="font-display text-[28px] md:text-[36px] text-forest font-medium mb-3">
            Thank you, {order.customer_name.split(" ")[0]}.
          </h1>
          <p className="font-body text-[14px] text-stone mb-1">
            Your order <span className="font-semibold text-forest">{order.order_number}</span> has been confirmed.
          </p>
          <p className="font-body text-[13px] text-stone/60 mb-10">
            A confirmation has been sent to {order.email}. We'll notify you as your piece is prepared and shipped.
          </p>

          <div className="bg-white rounded-2xl border border-border p-6 text-left space-y-4 mb-8">
            <h2 className="font-display text-[16px] text-forest font-medium">Order Details</h2>
            <div className="space-y-2">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex justify-between font-body text-[13px]">
                  <span className="text-stone">{item.title_snapshot} × {item.quantity}</span>
                  <span className="text-forest font-semibold">₹{item.line_total.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-body text-[15px] font-semibold">
              <span className="text-forest">Total Paid</span>
              <span className="text-forest">₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 h-[46px] px-6 bg-forest text-white font-body font-semibold text-[13px] uppercase tracking-wider rounded-sm hover:bg-forest/90 transition-colors"
            >
              Continue Shopping <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}
