"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/error";
import { adminReviewsApi } from "../api/admin-reviews.api";
import type {
  AdminReviewFilters,
  AdminReviewStatus,
} from "../types/admin-review.types";

export const ADMIN_REVIEWS_QUERY_KEY = ["admin", "reviews"] as const;

function reportMutationError(error: ApiError | Error) {
  if (error instanceof ApiError && !error.isValidation) {
    toast.error(error.message);
  } else if (error instanceof ApiError && error.isValidation) {
    const firstError = error.errors ? Object.values(error.errors)[0]?.[0] : null;
    toast.error(firstError || error.message || "Failed to process review.");
  } else if (!(error instanceof ApiError)) {
    toast.error(error.message || "An unexpected error occurred.");
  }
}

export function useAdminReviews(filters: AdminReviewFilters = {}) {
  return useQuery({
    queryKey: [...ADMIN_REVIEWS_QUERY_KEY, filters],
    queryFn: async () => adminReviewsApi.listReviews(filters),
  });
}

export function useAdminReview(reviewId: string | number) {
  return useQuery({
    queryKey: [...ADMIN_REVIEWS_QUERY_KEY, "detail", String(reviewId)],
    queryFn: async () => (await adminReviewsApi.getReview(reviewId)).data,
    enabled: Boolean(reviewId),
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string | number;
      status: AdminReviewStatus;
    }) => adminReviewsApi.updateStatus(id, status),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_REVIEWS_QUERY_KEY, "detail", String(variables.id)],
      });
      toast.success(response.message || `Review marked as ${variables.status}.`);
    },
    onError: reportMutationError,
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => adminReviewsApi.deleteReview(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_QUERY_KEY });
      toast.success(response.message || "Review deleted successfully.");
    },
    onError: reportMutationError,
  });
}
