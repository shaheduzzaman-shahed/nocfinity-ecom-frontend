export type AdminOrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type AdminPaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface AdminOrderCustomer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export interface AdminOrderItem {
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

export interface AdminOrderShippingAddress {
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

export interface AdminOrderCoupon {
  id: number;
  code: string;
  type: "fixed" | "percentage";
  value: number;
}

export interface AdminOrderPayment {
  id: number;
  provider: string;
  status: string;
  stripe_payment_intent_id?: string | null;
}

export interface AdminOrder {
  id: number;
  order_number: string;
  user_id: number;
  customer: AdminOrderCustomer;
  order_status: AdminOrderStatus;
  payment_status: AdminPaymentStatus;
  permitted_transitions: AdminOrderStatus[];
  can_cancel: boolean;
  currency: string;
  subtotal: number;
  product_discount: number;
  net_subtotal: number;
  coupon_discount: number;
  shipping_charge: number;
  final_total: number;
  payment?: AdminOrderPayment | null;
  shipping_address: AdminOrderShippingAddress;
  coupon?: AdminOrderCoupon | null;
  items: AdminOrderItem[];
  items_count: number;
  paid_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminOrderListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  payment_status?: string;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
}

export interface UpdateOrderStatusPayload {
  status: string;
  reason?: string;
  note?: string;
}
