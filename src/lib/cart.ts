import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductWithCategory } from "./products";

const CART_SESSION_KEY = "artspire_cart_session_id";

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  price_at_add: number;
  created_at: string;
  product?: ProductWithCategory | null;
}

export interface Cart {
  id: string;
  session_id: string;
  created_at: string;
  updated_at: string;
}

// ─── SESSION MANAGEMENT ───────────────────────────────────────
// Guest cart identity lives in localStorage — a random UUID that acts
// as a bearer token. No login required. Matches the architecture
// decision to skip customer accounts for MVP.

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem(CART_SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(CART_SESSION_KEY, sessionId);
  }
  return sessionId;
}

async function getOrCreateCart(sessionId: string): Promise<Cart> {
  const { data: existing } = await supabase
    .from("carts")
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (existing) return existing as Cart;

  const { data, error } = await supabase
    .from("carts")
    .insert({ session_id: sessionId })
    .select()
    .single();

  if (error) throw error;
  return data as Cart;
}

// ─── READ ───────────────────────────────────────────────────

export async function getCartItems(sessionId: string): Promise<CartItem[]> {
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (!cart) return [];

  const { data, error } = await supabase
    .from("cart_items")
    .select("*, product:products(*, categories:shop_categories(*))")
    .eq("cart_id", cart.id)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as CartItem[];
}

export async function getCartCount(sessionId: string): Promise<number> {
  const items = await getCartItems(sessionId);
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export async function getCartTotal(sessionId: string): Promise<number> {
  const items = await getCartItems(sessionId);
  return items.reduce((sum, item) => sum + item.price_at_add * item.quantity, 0);
}

// ─── WRITE ──────────────────────────────────────────────────

export async function addToCart(sessionId: string, product: Product, quantity = 1): Promise<void> {
  const cart = await getOrCreateCart(sessionId);

  // Check if item already in cart — if so, bump quantity instead of duplicate row
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart.id)
    .eq("product_id", product.id)
    .maybeSingle();

  if (existingItem) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + quantity })
      .eq("id", existingItem.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert({
        cart_id: cart.id,
        product_id: product.id,
        quantity,
        price_at_add: product.price,
      });
    if (error) throw error;
  }

  await supabase.from("carts").update({ updated_at: new Date().toISOString() }).eq("id", cart.id);
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<void> {
  if (quantity <= 0) {
    await removeCartItem(itemId);
    return;
  }
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId);
  if (error) throw error;
}

export async function removeCartItem(itemId: string): Promise<void> {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", itemId);
  if (error) throw error;
}

export async function clearCart(sessionId: string): Promise<void> {
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (!cart) return;

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id);
  if (error) throw error;
}
