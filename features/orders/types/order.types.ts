export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
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
}

export interface OrderShippingAddress {
  id: number | null;
  name: string;
  email: string | null;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface OrderCoupon {
  id: number;
  code: string;
  type: "fixed" | "percentage";
  value: number;
}

export interface OrderPayment {
  id: number;
  provider: string;
  status: string;
  stripe_payment_intent_id?: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  can_cancel: boolean;
  currency: string;
  subtotal: number;
  product_discount: number;
  net_subtotal: number;
  coupon_discount: number;
  shipping_charge: number;
  final_total: number;
  client_secret?: string | null;
  payment?: OrderPayment | null;
  shipping_address: OrderShippingAddress;
  coupon?: OrderCoupon | null;
  items: OrderItem[];
  items_count: number;
  paid_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderListParams {
  page?: number;
  per_page?: number;
}
