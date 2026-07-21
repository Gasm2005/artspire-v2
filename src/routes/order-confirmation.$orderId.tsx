import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getOrderForConfirmation } from "@/lib/orders-access.server";
import type { OrderWithItems } from "@/lib/orders";
import { SiteChrome } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/order-confirmation/$orderId")({
  head: () => ({
    meta: [{ title: "Order Confirmed | The Artspire" }, { name: "robots", content: "noindex" }],
  }),
  component: OrderConfirmationPage,
});

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
    if (savedPhone) attemptLoad(savedPhone);
    else {
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
      <SiteChrome>
        <section>
          <div
            className="wrap"
            style={{ textAlign: "center", padding: "80px 0", color: "var(--stone)" }}
          >
            Loading…
          </div>
        </section>
      </SiteChrome>
    );
  }

  if (needsPhone && !order) {
    return (
      <SiteChrome>
        <section>
          <div className="wrap" style={{ maxWidth: 520 }}>
            <div className="card-box" style={{ textAlign: "center" }}>
              <h1
                className="serif"
                style={{ fontSize: 32, color: "var(--forest)", fontWeight: 500, marginBottom: 8 }}
              >
                Verify your order
              </h1>
              <p style={{ color: "var(--stone)", marginBottom: 20 }}>
                Enter the phone number you used at checkout to view this order.
              </p>
              <div className="field">
                <label>Phone number</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91"
                />
              </div>
              {notFoundOrMismatch && (
                <p style={{ color: "#A32D2D", fontSize: 13, marginBottom: 12 }}>
                  We couldn't find an order matching that phone number.
                </p>
              )}
              <button
                className="btn btn-solid btn-block"
                disabled={verifying}
                onClick={handleVerify}
              >
                <span>{verifying ? "Checking…" : "View my order"}</span>
              </button>
            </div>
          </div>
        </section>
      </SiteChrome>
    );
  }

  if (!order) return null;

  const addr = order.shipping_address;
  return (
    <SiteChrome>
      <section>
        <div className="wrap">
          <div className="centerbox">
            <div className="tick">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <span className="eyebrow">Thank you, {order.customer_name?.split(" ")[0]}</span>
            <h1
              className="serif"
              style={{
                fontSize: 46,
                color: "var(--forest)",
                fontWeight: 500,
                margin: "14px 0 10px",
              }}
            >
              Your order is confirmed.
            </h1>
            <p style={{ color: "var(--stone)", maxWidth: 480, margin: "0 auto 6px" }}>
              Order <b style={{ color: "var(--forest)" }}>{order.order_number}</b> — a confirmation
              has been sent to your email. We'll notify you the moment it ships.
            </p>
          </div>

          <div className="card-box" style={{ maxWidth: 640, margin: "0 auto" }}>
            <div className="summary" style={{ position: "static", border: "none", padding: 0 }}>
              {order.order_items.map((it) => (
                <div className="row" key={it.id}>
                  <span>
                    {it.title_snapshot} × {it.quantity}
                  </span>
                  <span>₹{it.line_total.toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="row">
                <span>Shipping</span>
                <span>₹{order.shipping_cost.toLocaleString("en-IN")}</span>
              </div>
              <div className="row total">
                <span>Total paid</span>
                <span>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div
              style={{
                borderTop: "1px solid var(--line)",
                marginTop: 18,
                paddingTop: 16,
                fontSize: 13,
                color: "#54514a",
              }}
            >
              <b style={{ color: "var(--forest)" }}>Shipping to</b>
              <br />
              {order.customer_name} · {addr.line1}
              {addr.line2 ? ", " + addr.line2 : ""}, {addr.city}, {addr.state} {addr.postal_code},{" "}
              {addr.country}
            </div>
          </div>

          <div className="centerbox" style={{ paddingTop: 24 }}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn-solid" to="/track-order">
                <span>Track your order</span>
              </Link>
              <Link className="btn-ghost" to="/shop">
                Continue shopping <span className="arw">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
