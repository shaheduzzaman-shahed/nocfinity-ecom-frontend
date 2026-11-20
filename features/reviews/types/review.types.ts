import type { PaginationMeta } from "@/lib/api/types";

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface ReviewAuthor {
  id: number;
  name: string;
}

export interface ProductReview {
  id: number;
  product_id: number;
  user: ReviewAuthor;
  rating: number;
  title: string | null;
  comment: string;
  status: ReviewStatus;
  is_verified_purchase: boolean;
  order_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewAggregate {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<string, number>;
  rating_percentages: Record<string, number>;
}

export interface ReviewListParams {
  page?: number;
  per_page?: number;
  sort?: "newest" | "highest_rating" | "lowest_rating";
}

export interface ReviewPayload {
  rating: number;
  title?: string;
  comment: string;
}

export interface ProductReviewsResponse {
  success: true;
  message: string;
  data: ProductReview[];
  meta: PaginationMeta;
  aggregate: ReviewAggregate;
  user_review: ProductReview | null;
}
