export type CouponType = "percentage" | "fixed";

export interface AdminCoupon {
  id: number;
  code: string;
  type: CouponType;
  value: number;
  min_order_amount: number;
  usage_limit: number | null;
  usage_count: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface CouponPayload {
  code: string;
  type: CouponType;
  value: number;
  min_order_amount?: number | null;
  usage_limit?: number | null;
  valid_from?: string | null;
  valid_until?: string | null;
  is_active?: boolean;
}

export interface AdminCouponListParams {
  page?: number;
  per_page?: number;
  search?: string;
  type?: string;
  is_active?: string;
  sort_by?: string;
  sort_direction?: string;
}
