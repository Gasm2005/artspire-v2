import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getOrderByNumberVerified } from "@/lib/orders-access.server";
import type { OrderWithItems, OrderStatus } from "@/lib/orders";
import { toast } from "@/lib/toast";
import { SiteChrome } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Order | The Artspire" },
      {
        name: "description",
        content:
          "Track the status of your The Artspire order using your order number and phone number.",
      },
    ],
  }),
  component: TrackOrderPage,
});

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "confirmed", label: "Confirmed" },
  { status: "processing", label: "Being Prepared" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
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

  const isCancelledOrFailed =
    order && ["cancelled", "payment_failed", "refunded"].includes(order.status);
  const currentStep = order ? stepIndex(order.status) : -1;

  return (
    <SiteChrome>
      <div className="wrap page-hero">
        <span className="eyebrow rv">Order status</span>
        <h1 className="reveal-words">
          Track your <em>order</em>.
        </h1>
        <p className="rv d2">Enter your order number and the phone number you used at checkout.</p>
      </div>

      <section style={{ paddingTop: 6 }}>
        <div className="wrap" style={{ maxWidth: 640 }}>
          <div className="card-box rv">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Order number</label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="ART-20260714-0001"
                />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                />
              </div>
            </div>
            <button
              className="btn btn-solid btn-block"
              style={{ marginTop: 18 }}
              disabled={loading}
              onClick={handleSearch}
            >
              <span>{loading ? "Searching…" : "Track Order"}</span>
            </button>
          </div>

          {searched && !loading && !order && (
            <div className="card-box" style={{ marginTop: 28, textAlign: "center" }}>
              <p style={{ color: "var(--stone)" }}>
                No order found. Double-check your order number and phone number.
              </p>
            </div>
          )}

          {order && (
            <div className="card-box" style={{ marginTop: 28 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div>
                  <div
                    className="cat"
                    style={{
                      fontSize: 10,
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      fontWeight: 600,
                    }}
                  >
                    Order
                  </div>
                  <h3
                    className="serif"
                    style={{ fontSize: 22, color: "var(--forest)", fontWeight: 500 }}
                  >
                    {order.order_number}
                  </h3>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    background: "#F3EAD8",
                    border: "1px solid #E4D5B4",
                    color: "#8A6D2A",
                    fontWeight: 600,
                    padding: "6px 12px",
                    borderRadius: 2,
                    textTransform: "capitalize",
                  }}
                >
                  {order.status.replace("_", " ")}
                </span>
              </div>
              {isCancelledOrFailed ? (
                <p
                  style={{
                    fontSize: 13,
                    color: "#54514a",
                    marginTop: 16,
                    borderTop: "1px solid var(--line)",
                    paddingTop: 16,
                  }}
                >
                  This order was {order.status.replace("_", " ")}. If you have questions, please
                  contact us on WhatsApp.
                </p>
              ) : (
                <>
                  <div className="timeline">
                    {STEPS.map((s, i) => (
                      <div key={s.status} className={"tl-step" + (i <= currentStep ? " done" : "")}>
                        <div className="d"></div>
                        <div className="lab">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#54514a",
                      textAlign: "center",
                      borderTop: "1px solid var(--line)",
                      paddingTop: 16,
                    }}
                  >
                    We'll email you a tracking link once your piece ships.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </SiteChrome>
  );
}
