import { api } from "@/lib/api/client";
import type { ApiPaginatedResponse, ApiSuccessResponse } from "@/lib/api/types";
import type { Order, OrderListParams } from "../types/order.types";

export const ordersApi = {
  getOrders(params?: OrderListParams) {
    return api.get<ApiPaginatedResponse<Order>>("/orders", {
      params: {
        page: params?.page,
        per_page: params?.per_page,
      },
    });
  },

  getOrder(id: string | number) {
    return api.get<ApiSuccessResponse<Order>>(`/orders/${id}`);
  },

  cancelOrder(id: string | number, reason?: string) {
    return api.post<ApiSuccessResponse<Order>>(`/orders/${id}/cancel`, {
      reason,
    });
  },
};
