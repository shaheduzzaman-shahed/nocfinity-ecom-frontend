import { api } from "@/lib/api/client";
import type { ApiPaginatedResponse, ApiSuccessResponse } from "@/lib/api/types";
import type {
  AdminOrder,
  AdminOrderListParams,
  UpdateOrderStatusPayload,
} from "../types/admin-order.types";

export const adminOrdersApi = {
  listOrders(params: AdminOrderListParams = {}) {
    return api.get<ApiPaginatedResponse<AdminOrder>>("/admin/orders", {
      params: {
        page: params.page,
        per_page: params.per_page,
        search: params.search,
        status: params.status,
        payment_status: params.payment_status,
        sort_by: params.sort_by,
        sort_direction: params.sort_direction,
      },
    });
  },

  getOrder(id: string | number) {
    return api.get<ApiSuccessResponse<AdminOrder>>(`/admin/orders/${id}`);
  },

  updateStatus(id: string | number, payload: UpdateOrderStatusPayload) {
    return api.patch<ApiSuccessResponse<AdminOrder>>(
      `/admin/orders/${id}/status`,
      payload
    );
  },
};
