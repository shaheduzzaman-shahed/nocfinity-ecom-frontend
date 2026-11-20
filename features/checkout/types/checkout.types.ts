import type { CartItemData } from "@/features/cart/types/cart.types";
import type { ShippingAddress } from "@/features/addresses/types/address.types";

export interface CheckoutFinancialSummary {
  subtotal: number;
  product_discount: number;
  net_subtotal: number;
  coupon_discount: number;
  shipping_charge: number;
  final_total: number;
  currency: string;
}

export interface CheckoutCouponData {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  discount_amount: number;
}

export interface CheckoutPreviewData {
  items: CartItemData[];
  items_count: number;
  total_quantity: number;
  summary: CheckoutFinancialSummary;
  coupon: CheckoutCouponData | null;
  addresses: ShippingAddress[];
  default_address_id: number | null;
  warnings: string[];
}

export interface CheckoutPayload {
  shipping_address_id?: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  coupon_code?: string;
}

export interface OrderItemData {
  id: number;
  order_id: number;
  product_variant_id: number | null;
  product_name: string;
  image_url: string | null;
  sku: string;
  color_name: string;
  size_name: string;
  unit_price: number;
  quantity: number;
  line_subtotal: number;
  created_at?: string;
  updated_at?: string;
}

export interface OrderData {
  id: number;
  order_number: string;
  user_id: number;
  order_status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  currency: string;
  subtotal: number;
  product_discount: number;
  net_subtotal: number;
  coupon_discount: number;
  shipping_charge: number;
  final_total: number;
  shipping_address: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  coupon?: {
    id: number;
    code: string;
    type: "percentage" | "fixed";
    value: number;
  } | null;
  items: OrderItemData[];
  items_count?: number;
  paid_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  updated_at: string;
}
