import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { getOrderById } from "@/lib/orders";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/order-confirmation/$orderId")({
  loader: async ({ params }) => {
    const order = await getOrderById(params.orderId);
    if (!order) throw notFound();
    return { order };
  },
  head: () => ({
    meta: [
      { title: "Order Confirmed | Artspire" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmationPage,
  notFoundComponent: () => (
    <ShopLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-[36px] text-forest">Order not found</h1>
          <Link to="/shop" className="font-body text-[13px] text-forest border-b border-forest/30 mt-4 inline-block">
            Return to Shop
          </Link>
        </div>
      </div>
    </ShopLayout>
  ),
});

function OrderConfirmationPage() {
  const { order } = Route.useLoaderData();

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
