import { supabase } from "@/integrations/supabase/client";
import type { CartItem } from "./cart";

export type OrderStatus = "pending" | "payment_failed" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partially_refunded";

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: ShippingAddress;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  currency: string;
  gift_message: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  coupon_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  title_snapshot: string;
  image_snapshot: string | null;
  price_snapshot: number;
  quantity: number;
  line_total: number;
  created_at: string;
}

export type OrderWithItems = Order & { order_items: OrderItem[] };

// ─── CREATE ORDER (before payment) ────────────────────────────
// Creates the order in 'pending' status with a Razorpay order_id
// attached. Payment confirmation happens in a separate step after
// Razorpay's checkout succeeds (see confirmOrderPayment below).

export async function createPendingOrder(params: {
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: ShippingAddress;
  giftMessage?: string;
  cartItems: CartItem[];
  shippingCost?: number;
  discountAmount?: number;
  couponCode?: string;
}): Promise<Order> {
  const subtotal = params.cartItems.reduce((sum, item) => sum + item.price_at_add * item.quantity, 0);
  const shippingCost = params.shippingCost ?? 0;
  const discountAmount = params.discountAmount ?? 0;
  const total = subtotal + shippingCost - discountAmount;

  // Generate order number via DB function
  const { data: orderNumberData, error: orderNumberError } = await supabase
    .rpc("generate_order_number");
  if (orderNumberError) throw orderNumberError;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumberData as string,
      customer_name: params.customerName,
      email: params.email,
      phone: params.phone,
      shipping_address: params.shippingAddress,
      subtotal,
      shipping_cost: shippingCost,
      discount_amount: discountAmount,
      total,
      gift_message: params.giftMessage || null,
      coupon_code: params.couponCode || null,
      status: "pending",
      payment_status: "pending",
    })
    .select()
    .single();

  if (error) throw error;

  // Create order_items snapshot from cart
  const itemRows = params.cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    title_snapshot: item.product?.title ?? "Unknown Product",
    image_snapshot: item.product?.image_url ?? null,
    price_snapshot: item.price_at_add,
    quantity: item.quantity,
    line_total: item.price_at_add * item.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
  if (itemsError) throw itemsError;

  return order as Order;
}

// ─── ATTACH RAZORPAY ORDER ID ─────────────────────────────────

export async function attachRazorpayOrderId(orderId: string, razorpayOrderId: string): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ razorpay_order_id: razorpayOrderId })
    .eq("id", orderId);
  if (error) throw error;
}

// ─── CONFIRM PAYMENT (after Razorpay success) ─────────────────
// Payment confirmation moved to src/lib/razorpay.server.ts
// (confirmPaymentServerSide / confirmPaymentAfterCheckout) so it runs
// with the service_role key AFTER the Razorpay signature has been
// verified server-side. The old version of this function ran from the
// browser with the anon key, which either silently failed (no public
// UPDATE policy exists on `orders`) or — if RLS were ever loosened —
// would have let anyone mark any order as paid from the console.
// Do not add a client-callable version of this back without routing
// it through signature verification first.

export async function markOrderPaymentFailed(orderId: string): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ status: "payment_failed", payment_status: "failed" })
    .eq("id", orderId);
  if (error) throw error;
}

// ─── READ ───────────────────────────────────────────────────

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as OrderWithItems;
}

// NOTE: unauthenticated callers get nothing from this now — orders has
// no public SELECT policy anymore (see the PII-exposure fix migration).
// This only returns data for a logged-in admin session. Public lookups
// (track-order page) use getOrderByNumberVerified in
// orders-access.server.ts instead, which checks phone ownership.
export async function getOrderByNumber(orderNumber: string): Promise<OrderWithItems | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_number", orderNumber)
    .single();

  if (error) return null;
  return data as OrderWithItems;
}

// ─── ADMIN ──────────────────────────────────────────────────

export async function getAllOrders(opts?: { status?: OrderStatus; limit?: number }) {
  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (opts?.status) query = query.eq("status", opts.status);
  if (opts?.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as OrderWithItems[];
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  const timestampField: Partial<Record<OrderStatus, string>> = {
    shipped: "shipped_at",
    delivered: "delivered_at",
    cancelled: "cancelled_at",
  };

  const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
  const field = timestampField[status];
  if (field) updates[field] = new Date().toISOString();

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}
