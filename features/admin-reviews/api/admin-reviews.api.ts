import { api } from "@/lib/api/client";
import type { ApiPaginatedResponse, ApiSuccessResponse } from "@/lib/api/types";
import type {
  AdminReview,
  AdminReviewFilters,
  AdminReviewStatus,
} from "../types/admin-review.types";

export const adminReviewsApi = {
  listReviews(filters: AdminReviewFilters = {}) {
    return api.get<ApiPaginatedResponse<AdminReview>>("/admin/reviews", {
      params: {
        page: filters.page,
        per_page: filters.per_page,
        search: filters.search || undefined,
        status: filters.status !== "all" ? filters.status : undefined,
        rating: filters.rating !== "all" ? filters.rating : undefined,
        product_id: filters.product_id,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
      },
    });
  },

  getReview(id: number | string) {
    return api.get<ApiSuccessResponse<AdminReview>>(`/admin/reviews/${id}`);
  },

  updateStatus(id: number | string, status: AdminReviewStatus) {
    return api.patch<ApiSuccessResponse<AdminReview>>(
      `/admin/reviews/${id}/status`,
      { status }
    );
  },

  deleteReview(id: number | string) {
    return api.delete<ApiSuccessResponse<null>>(`/admin/reviews/${id}`);
  },
};
