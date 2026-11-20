import { api } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type {
  ProductReview,
  ProductReviewsResponse,
  ReviewListParams,
  ReviewPayload,
} from "../types/review.types";

export const reviewsApi = {
  getProductReviews(productId: number, params: ReviewListParams = {}) {
    return api.get<ProductReviewsResponse>(`/products/${productId}/reviews`, {
      params: {
        page: params.page,
        per_page: params.per_page,
        sort: params.sort,
      },
    });
  },

  submitReview(productId: number, payload: ReviewPayload) {
    return api.post<ApiSuccessResponse<ProductReview>>(
      `/products/${productId}/reviews`,
      payload
    );
  },

  updateReview(reviewId: number, payload: Partial<ReviewPayload>) {
    return api.put<ApiSuccessResponse<ProductReview>>(
      `/reviews/${reviewId}`,
      payload
    );
  },

  deleteReview(reviewId: number) {
    return api.delete<ApiSuccessResponse<null>>(`/reviews/${reviewId}`);
  },
};
