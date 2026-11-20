"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/error";
import { adminCouponsApi } from "../api/admin-coupons.api";
import type {
  AdminCouponListParams,
  CouponPayload,
} from "../types/admin-coupon.types";

export const ADMIN_COUPONS_QUERY_KEY = ["admin", "coupons"] as const;

function reportMutationError(error: ApiError | Error) {
  if (error instanceof ApiError && !error.isValidation) {
    toast.error(error.message);
  } else if (!(error instanceof ApiError)) {
    toast.error(error.message || "An unexpected error occurred.");
  }
}

export function useAdminCoupons(params: AdminCouponListParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_COUPONS_QUERY_KEY, params],
    queryFn: async () => adminCouponsApi.listCoupons(params),
  });
}

export function useAdminCoupon(couponId: number) {
  return useQuery({
    queryKey: [...ADMIN_COUPONS_QUERY_KEY, couponId],
    queryFn: async () => (await adminCouponsApi.getCoupon(couponId)).data,
    enabled: Number.isInteger(couponId) && couponId > 0,
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CouponPayload) =>
      adminCouponsApi.createCoupon(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COUPONS_QUERY_KEY });
      toast.success(response.message || "Coupon created successfully.");
    },
    onError: reportMutationError,
  });
}

export function useUpdateCoupon(couponId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<CouponPayload>) =>
      adminCouponsApi.updateCoupon(couponId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COUPONS_QUERY_KEY });
      toast.success(response.message || "Coupon updated successfully.");
    },
    onError: reportMutationError,
  });
}

export function useToggleCouponStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      adminCouponsApi.toggleCouponStatus(id, isActive),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COUPONS_QUERY_KEY });
      toast.success(response.message || "Coupon status updated.");
    },
    onError: reportMutationError,
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (couponId: number) => adminCouponsApi.deleteCoupon(couponId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COUPONS_QUERY_KEY });
      toast.success(response.message || "Coupon deleted successfully.");
    },
    onError: reportMutationError,
  });
}
