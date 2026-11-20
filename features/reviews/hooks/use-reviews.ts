"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/error";
import { reviewsApi } from "../api/reviews.api";
import type { ReviewListParams, ReviewPayload } from "../types/review.types";

export const PRODUCT_REVIEWS_QUERY_KEY = ["product-reviews"] as const;

function reportMutationError(error: ApiError | Error) {
  if (error instanceof ApiError && !error.isValidation) {
    toast.error(error.message);
  } else if (error instanceof ApiError && error.isValidation) {
    const firstError = error.errors ? Object.values(error.errors)[0]?.[0] : null;
    toast.error(firstError || error.message || "Failed to submit review.");
  } else if (!(error instanceof ApiError)) {
    toast.error(error.message || "An unexpected error occurred.");
  }
}

export function useProductReviews(
  productId: number,
  params: ReviewListParams = {}
) {
  return useQuery({
    queryKey: [...PRODUCT_REVIEWS_QUERY_KEY, productId, params],
    queryFn: async () => reviewsApi.getProductReviews(productId, params),
    enabled: Number.isInteger(productId) && productId > 0,
  });
}

export function useSubmitReview(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewPayload) =>
      reviewsApi.submitReview(productId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [...PRODUCT_REVIEWS_QUERY_KEY, productId],
      });
      toast.success(
        response.message ||
          "Review submitted successfully. It will appear once approved."
      );
    },
    onError: reportMutationError,
  });
}

export function useUpdateReview(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: number;
      payload: Partial<ReviewPayload>;
    }) => reviewsApi.updateReview(reviewId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [...PRODUCT_REVIEWS_QUERY_KEY, productId],
      });
      toast.success(
        response.message ||
          "Review updated successfully. It will appear once approved."
      );
    },
    onError: reportMutationError,
  });
}

export function useDeleteReview(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number) => reviewsApi.deleteReview(reviewId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [...PRODUCT_REVIEWS_QUERY_KEY, productId],
      });
      toast.success(response.message || "Review deleted successfully.");
    },
    onError: reportMutationError,
  });
}
