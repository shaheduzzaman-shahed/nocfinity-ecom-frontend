export interface CartItemData {
  id: number;
  product_variant_id: number;
  quantity: number;
  product_id: number | null;
  product_name: string;
  product_slug: string | null;
  primary_image: string | null;
  sku: string;
  color: {
    id: number;
    name: string;
    hex_code: string | null;
  } | null;
  size: {
    id: number;
    name: string;
    sort_order: number;
  } | null;
  unit_price: number;
  regular_price: number;
  has_discount: boolean;
  line_subtotal: number;
  stock: number;
  in_stock: boolean;
  is_available: boolean;
  is_sufficient_stock: boolean;
}

export interface AppliedCouponData {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  discount_amount: number;
}

export interface CartSummaryData {
  subtotal: number;
  product_discount: number;
  coupon_discount: number;
  shipping_estimate: number;
  final_total: number;
  currency: string;
}

export interface CartData {
  id: number;
  items: CartItemData[];
  items_count: number;
  total_quantity: number;
  coupon?: AppliedCouponData | null;
  summary: CartSummaryData;
  warnings: string[];
}

export interface AddToCartPayload {
  product_variant_id: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface MergeCartPayload {
  items: Array<{
    product_variant_id: number;
    quantity: number;
  }>;
}

export interface GuestCartItem {
  product_variant_id: number;
  quantity: number;
  product_id?: number;
  product_name?: string;
  product_slug?: string;
  primary_image?: string | null;
  sku?: string;
  color_name?: string;
  color_hex?: string | null;
  size_name?: string;
  unit_price?: number;
  regular_price?: number;
  stock?: number;
}
