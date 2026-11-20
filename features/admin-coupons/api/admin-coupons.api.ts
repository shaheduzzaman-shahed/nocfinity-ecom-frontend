import { api } from "@/lib/api/client";
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from "@/lib/api/types";
import type {
  AdminCoupon,
  AdminCouponListParams,
  CouponPayload,
} from "../types/admin-coupon.types";

export const adminCouponsApi = {
  listCoupons(params: AdminCouponListParams = {}) {
    return api.get<ApiPaginatedResponse<AdminCoupon>>("/admin/coupons", {
      params: {
        page: params.page,
        per_page: params.per_page,
        search: params.search,
        type: params.type,
        is_active: params.is_active,
        sort_by: params.sort_by,
        sort_direction: params.sort_direction,
      },
    });
  },

  getCoupon(id: number) {
    return api.get<ApiSuccessResponse<AdminCoupon>>(`/admin/coupons/${id}`);
  },

  createCoupon(payload: CouponPayload) {
    return api.post<ApiSuccessResponse<AdminCoupon>>("/admin/coupons", payload);
  },

  updateCoupon(id: number, payload: Partial<CouponPayload>) {
    return api.put<ApiSuccessResponse<AdminCoupon>>(`/admin/coupons/${id}`, payload);
  },

  toggleCouponStatus(id: number, isActive: boolean) {
    return api.put<ApiSuccessResponse<AdminCoupon>>(`/admin/coupons/${id}`, {
      is_active: isActive,
    });
  },

  deleteCoupon(id: number) {
    return api.delete<ApiSuccessResponse<null>>(`/admin/coupons/${id}`);
  },
};
