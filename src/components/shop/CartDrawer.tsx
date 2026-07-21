import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Loader2, ShoppingBag } from "lucide-react";
import {
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
  getOrCreateSessionId,
  type CartItem,
} from "@/lib/cart";
import { toast } from "@/lib/toast";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Slide-in cart drawer — the "quick glance" pattern.
 * For the considered/deliberate purchase moment, /cart is the full page.
 * Listens for 'artspire:cart-updated' custom event to refresh after
 * Add to Cart anywhere in the app.
 */
export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const sessionId = getOrCreateSessionId();
      const data = await getCartItems(sessionId);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  useEffect(() => {
    const handler = () => load();
    window.addEventListener("artspire:cart-updated", handler);
    return () => window.removeEventListener("artspire:cart-updated", handler);
  }, [load]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item.");
    } finally {
      setUpdatingId(null);
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price_at_add * item.quantity, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display text-[18px] text-forest font-medium">Your Cart</h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-1.5 text-stone hover:text-forest transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={22} className="animate-spin text-stone/40" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <ShoppingBag size={32} className="text-stone/20" />
              <p className="font-body text-[14px] text-stone/50">Your cart is empty</p>
              <Link
                to="/shop"
                onClick={onClose}
                className="font-body text-[12px] font-semibold text-forest border-b border-forest/30 hover:border-forest transition-colors"
              >
                Browse the Shop →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream shrink-0">
                    {item.product?.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[13px] font-semibold text-forest leading-snug line-clamp-2">
                      {item.product?.title ?? "Product"}
                    </p>
                    <p className="font-body text-[12px] text-stone/60 mt-0.5">
                      ₹{item.price_at_add.toLocaleString("en-IN")}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          disabled={updatingId === item.id}
                          className="w-7 h-7 flex items-center justify-center text-forest hover:bg-cream transition-colors disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-7 text-center font-body text-[12px] font-semibold text-forest">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          disabled={updatingId === item.id}
                          className="w-7 h-7 flex items-center justify-center text-forest hover:bg-cream transition-colors disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item)}
                        disabled={updatingId === item.id}
                        className="font-body text-[11px] text-stone/40 hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-body text-[13px] text-stone">Subtotal</span>
              <span className="font-body text-[16px] font-semibold text-forest">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <Link
              to="/cart"
              onClick={onClose}
              className="flex items-center justify-center w-full h-[46px] bg-white border-2 border-forest text-forest font-body font-bold text-[13px] rounded-xl hover:bg-forest/5 transition-colors"
            >
              View Cart
            </Link>
            <Link
              to="/checkout"
              onClick={onClose}
              className="flex items-center justify-center w-full h-[46px] bg-forest text-white font-body font-bold text-[13px] rounded-xl hover:bg-forest/90 transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
