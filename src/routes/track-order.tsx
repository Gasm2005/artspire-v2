import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { getOrderByNumberVerified } from "@/lib/orders-access.server";
import type { OrderWithItems, OrderStatus } from "@/lib/orders";
import { ArtspireBreadcrumb } from "@/components/ArtspireBreadcrumb";
import { Search, Loader2, PackageCheck, Package, Truck, Clock, XCircle } from "lucide-react";
import { toast } from "@/lib/toast";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order | Artspire" },
      { name: "description", content: "Track the status of your Artspire order using your order number and phone number." },
    ],
  }),
  component: TrackOrderPage,
});

const STEPS: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: "confirmed", label: "Confirmed", icon: PackageCheck },
  { status: "processing", label: "Being Prepared", icon: Package },
  { status: "shipped", label: "Shipped", icon: Truck },
  { status: "delivered", label: "Delivered", icon: PackageCheck },
];

function stepIndex(status: OrderStatus): number {
  const idx = STEPS.findIndex((s) => s.status === status);
  return idx;
}

function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!orderNumber.trim() || !phone.trim()) {
      toast.error("Please enter both your order number and phone number.");
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const result = await getOrderByNumberVerified({
        data: { orderNumber: orderNumber.trim().toUpperCase(), phone: phone.trim() },
      });
      setOrder(result);
    } catch (err) {
      console.error(err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  const isCancelledOrFailed = order && ["cancelled", "payment_failed", "refunded"].includes(order.status);
  const currentStep = order ? stepIndex(order.status) : -1;

  return (
    <ShopLayout>
      <section className="section-padding bg-cream min-h-[70vh]">
        <div className="container-main max-w-2xl">
          <ArtspireBreadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Track Order" }]} className="mb-6" />
          <h1 className="font-display text-[28px] md:text-[36px] text-forest font-medium mb-2">Track Your Order</h1>
          <p className="font-body text-[13px] text-stone mb-8">
            Enter your order number and the phone number you used at checkout.
          </p>

          <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-body text-[11px] font-bold text-stone uppercase tracking-wider mb-1.5">
                  Order Number
                </label>
                <input
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="ART-20260714-0001"
                  className="w-full h-[46px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="block font-body text-[11px] font-bold text-stone uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full h-[46px] px-4 rounded-xl border border-border bg-white font-body text-[14px] text-forest focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full h-[48px] bg-forest text-white font-body font-bold text-[13px] rounded-xl hover:bg-forest/90 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              {loading ? "Searching…" : "Track Order"}
            </button>
          </div>

          {searched && !loading && !order && (
            <div className="mt-6 bg-white rounded-2xl border border-border p-6 text-center">
              <XCircle size={26} className="mx-auto text-stone/30 mb-2" />
              <p className="font-body text-[13px] text-stone">
                We couldn't find a matching order. Double-check your order number and phone, or{" "}
                <a href="https://wa.me/917408690994" target="_blank" rel="noreferrer" className="text-forest font-semibold underline">
                  message us on WhatsApp
                </a>
                .
              </p>
            </div>
          )}

          {order && (
            <div className="mt-6 bg-white rounded-2xl border border-border p-6 space-y-6">
              <div>
                <p className="font-body text-[12px] text-stone">Order</p>
                <p className="font-display text-[20px] text-forest font-medium">{order.order_number}</p>
              </div>

              {isCancelledOrFailed ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700">
                  <XCircle size={16} />
                  <span className="font-body text-[13px] font-semibold capitalize">
                    {order.status.replace("_", " ")}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  {STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const reached = currentStep >= i;
                    return (
                      <div key={step.status} className="flex-1 flex flex-col items-center text-center relative">
                        {i > 0 && (
                          <div
                            className={`absolute top-4 right-1/2 w-full h-0.5 -z-10 ${reached ? "bg-forest" : "bg-border"}`}
                          />
                        )}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            reached ? "bg-forest text-white" : "bg-cream border border-border text-stone/40"
                          }`}
                        >
                          <Icon size={14} />
                        </div>
                        <span className={`font-body text-[10px] mt-1.5 ${reached ? "text-forest font-semibold" : "text-stone/50"}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="border-t border-border pt-4 space-y-2">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between font-body text-[13px]">
                    <span className="text-stone">{item.title_snapshot} × {item.quantity}</span>
                    <span className="text-forest font-semibold">₹{item.line_total.toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <div className="flex justify-between font-body text-[14px] font-bold pt-2 border-t border-border">
                  <span className="text-forest">Total</span>
                  <span className="text-forest">₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <a
                href="https://wa.me/917408690994"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full h-[44px] bg-forest/5 text-forest font-body font-semibold text-[12px] rounded-xl hover:bg-forest/10 transition-colors"
              >
                Need help with this order? Message us on WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>
    </ShopLayout>
  );
}
