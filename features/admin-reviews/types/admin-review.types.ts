export type AdminReviewStatus = "pending" | "approved" | "rejected";

export interface AdminReviewCustomer {
  id: number;
  name: string;
  email: string;
}

export interface AdminReviewProduct {
  id: number;
  name: string;
  slug: string;
  primary_image: string | null;
}

export interface AdminReview {
  id: number;
  product: AdminReviewProduct;
  customer: AdminReviewCustomer;
  order_id: number | null;
  order_number: string | null;
  rating: number;
  title: string | null;
  comment: string;
  status: AdminReviewStatus;
  is_verified_purchase: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminReviewFilters {
  status?: AdminReviewStatus | "all";
  rating?: number | "all";
  product_id?: number;
  search?: string;
  sort_by?: "created_at" | "rating" | "status";
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}
