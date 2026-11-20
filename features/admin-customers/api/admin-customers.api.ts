import { api } from "@/lib/api/client";
import type { ApiPaginatedResponse, ApiSuccessResponse } from "@/lib/api/types";
import type {
  AdminCustomer,
  AdminCustomerFilters,
} from "../types/admin-customer.types";
import type { AdminOrder } from "@/features/admin-orders/types/admin-order.types";

export const adminCustomersApi = {
  listCustomers(filters: AdminCustomerFilters = {}) {
    return api.get<ApiPaginatedResponse<AdminCustomer>>("/admin/customers", {
      params: {
        page: filters.page,
        per_page: filters.per_page,
        search: filters.search || undefined,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
      },
    });
  },

  getCustomer(id: number | string) {
    return api.get<ApiSuccessResponse<AdminCustomer>>(`/admin/customers/${id}`);
  },

  getCustomerOrders(id: number | string, page: number = 1, perPage: number = 10) {
    return api.get<ApiPaginatedResponse<AdminOrder>>(
      `/admin/customers/${id}/orders`,
      {
        params: { page, per_page: perPage },
      }
    );
  },
};
