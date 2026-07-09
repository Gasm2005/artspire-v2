import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ShopLayout } from "@/components/shop/ShopLayout";
import {
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
  getOrCreateSessionId,
  type CartItem,
} from "@/lib/cart";
import { toast } from "@/lib/toast";
import { ArtspireBreadcrumb } from "@/components/ArtspireBreadcrumb";
import { PortfolioGridSkeleton } from "@/components/ui/skeleton";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Artspire" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [giftMessage, setGiftMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const sessionId = getOrCreateSessionId();
      const data = await getCartItems(sessionId);
      setItems(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleQuantityChange(item: CartItem, newQty: number) {
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

  const subtotal = items.reduce((sum, item) => sum + item.price_at_add * item.quantity, 0);

  return (
    <ShopLayout>
      <section className="section-padding bg-cream min-h-[70vh]">
        <div className="container-main max-w-4xl">
          <ArtspireBreadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Cart" }]} className="mb-6" />
          <h1 className="font-display text-[28px] md:text-[36px] text-forest font-medium mb-8">Your Cart</h1>

          {loading ? (
            <PortfolioGridSkeleton count={2} />
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-12 text-center">
              <ShoppingBag size={40} className="text-stone/20 mx-auto mb-4" />
              <p className="font-display text-[20px] text-forest/40 mb-2">Your cart is empty</p>
              <p className="font-body text-[13px] text-stone/50 mb-6">Discover handcrafted pieces made to last a lifetime.</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 h-[46px] px-6 bg-forest text-white font-body font-semibold text-[13px] uppercase tracking-wider rounded-sm hover:bg-forest/90 transition-colors"
              >
                Browse the Shop <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Line items */}
              <div className="flex-1 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-border p-4 flex gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-cream shrink-0">
                      {item.product?.image_url && (
                        <img src={item.product.image_url} alt={item.product.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link
                          to="/shop/product/$slug"
                          params={{ slug: item.product?.slug ?? "" }}
                          className="font-display text-[16px] text-forest font-medium hover:text-gold transition-colors leading-snug"
                        >
                          {item.product?.title ?? "Product"}
                        </Link>
                        <p className="font-body text-[13px] text-stone/60 mt-1">₹{item.price_at_add.toLocaleString("en-IN")} each</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={updatingId === item.id}
                            className="w-8 h-8 flex items-center justify-center text-forest hover:bg-cream transition-colors disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center font-body text-[13px] font-semibold text-forest">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            disabled={updatingId === item.id}
                            className="w-8 h-8 flex items-center justify-center text-forest hover:bg-cream transition-colors disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-body text-[14px] font-semibold text-forest">
                            ₹{(item.price_at_add * item.quantity).toLocaleString("en-IN")}
                          </span>
                          <button
                            onClick={() => handleRemove(item)}
                            disabled={updatingId === item.id}
                            aria-label="Remove item"
                            className="text-stone/40 hover:text-red-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Gift note — first-class gifting flow per architecture doc */}
                <div className="bg-white rounded-2xl border border-border p-5">
                  <label className="block font-body text-[11px] font-bold text-stone uppercase tracking-wider mb-2">
                    Gift Note (optional)
                  </label>
                  <textarea
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Add a personal note to include with your order..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white font-body text-[13px] text-forest focus:outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Order summary */}
              <div className="lg:w-[320px] shrink-0">
                <div className="bg-white rounded-2xl border border-border p-5 sticky top-24 space-y-4">
                  <h2 className="font-display text-[16px] text-forest font-medium">Order Summary</h2>
                  <div className="flex items-center justify-between font-body text-[13px]">
                    <span className="text-stone">Subtotal</span>
                    <span className="text-forest font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="font-body text-[11px] text-stone/50">Shipping calculated at checkout.</p>
                  <Link
                    to="/checkout"
                    className="flex items-center justify-center gap-2 w-full h-[50px] bg-forest text-white font-body font-bold text-[13px] uppercase tracking-wider rounded-xl hover:bg-forest/90 transition-colors"
                  >
                    Proceed to Checkout <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/shop"
                    className="flex items-center justify-center w-full h-[42px] font-body text-[12px] font-semibold text-forest/70 hover:text-forest transition-colors"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </ShopLayout>
  );
}
