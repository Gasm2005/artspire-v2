import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
  getOrCreateSessionId,
  type CartItem,
} from "@/lib/cart";
import { toast } from "@/lib/toast";
import { SiteChrome } from "@/components/site/SiteChrome";

const SHIPPING_COST = 150;

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Your Cart | The Artspire" }, { name: "robots", content: "noindex" }],
  }),
  component: CartPage,
});

function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCartItems(getOrCreateSessionId());
      setItems(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleQuantityChange(item: CartItem, newQty: number) {
    if (newQty < 1) return;
    setUpdatingId(item.id);
    try {
      await updateCartItemQuantity(item.id, newQty);
      await load();
      window.dispatchEvent(new CustomEvent("artspire:cart-updated"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleRemove(item: CartItem) {
    setUpdatingId(item.id);
    try {
      await removeCartItem(item.id);
      await load();
      window.dispatchEvent(new CustomEvent("artspire:cart-updated"));
      toast.success("Removed from cart.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item.");
    } finally {
      setUpdatingId(null);
    }
  }

  const subtotal = items.reduce((sum, i) => sum + i.price_at_add * i.quantity, 0);
  const total = items.length ? subtotal + SHIPPING_COST : 0;

  return (
    <SiteChrome>
      <div className="wrap crumbs">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>Cart</span>
      </div>

      <section style={{ paddingTop: 16 }}>
        <div className="wrap">
          <h1
            className="serif reveal-words"
            style={{ fontSize: 44, color: "var(--forest)", fontWeight: 500, marginBottom: 28 }}
          >
            Your Cart
          </h1>

          {loading ? (
            <p style={{ color: "var(--stone)" }}>Loading your cart…</p>
          ) : items.length === 0 ? (
            <div style={{ padding: "60px 0", textAlign: "center" }}>
              <h2
                className="serif"
                style={{ fontSize: 26, color: "var(--forest)", fontWeight: 500 }}
              >
                Your cart is empty
              </h2>
              <p style={{ color: "var(--stone)", margin: "8px 0 22px" }}>
                Discover objects made to be lived with.
              </p>
              <Link className="btn btn-solid" to="/shop">
                <span>Explore the Collection</span>
              </Link>
            </div>
          ) : (
            <div
              className="cart-cols"
              style={{
                display: "grid",
                gridTemplateColumns: "1.6fr 1fr",
                gap: 48,
                alignItems: "start",
              }}
            >
              <div>
                {items.map((item) => (
                  <div className="cart-line" key={item.id}>
                    <div className="frame thumb" data-label="">
                      {item.product?.image_url ? (
                        <img src={item.product.image_url} alt={item.product?.title ?? ""} />
                      ) : null}
                    </div>
                    <div style={{ flex: 1 }}>
                      {item.product?.categories?.name && (
                        <div className="cat">{item.product.categories.name}</div>
                      )}
                      <h4>{item.product?.title ?? "Item"}</h4>
                      <button
                        onClick={() => handleRemove(item)}
                        disabled={updatingId === item.id}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--stone)",
                          fontSize: 12,
                          cursor: "pointer",
                          marginTop: 4,
                          padding: 0,
                        }}
                      >
                        Remove
                      </button>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 12,
                        }}
                      >
                        <div className="qty">
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={updatingId === item.id}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            disabled={updatingId === item.id}
                          >
                            +
                          </button>
                        </div>
                        <span
                          style={{
                            fontFamily: '"Cormorant Garamond",serif',
                            fontSize: 20,
                            color: "var(--forest)",
                          }}
                        >
                          ₹{(item.price_at_add * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <Link
                  className="btn-ghost"
                  to="/shop"
                  style={{ marginTop: 20, display: "inline-block" }}
                >
                  ← Continue shopping
                </Link>
              </div>

              <div className="summary">
                <h3
                  className="serif"
                  style={{
                    fontSize: 22,
                    color: "var(--forest)",
                    fontWeight: 500,
                    marginBottom: 16,
                  }}
                >
                  Order Summary
                </h3>
                <div className="row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="row">
                  <span>Shipping</span>
                  <span>₹{SHIPPING_COST.toLocaleString("en-IN")}</span>
                </div>
                <div className="row total">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <Link className="btn btn-solid btn-block" to="/checkout" style={{ marginTop: 18 }}>
                  <span>Proceed to Checkout</span>
                </Link>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--stone)",
                    textAlign: "center",
                    marginTop: 12,
                  }}
                >
                  Secured by Razorpay · UPI, Cards, Netbanking
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteChrome>
  );
}
