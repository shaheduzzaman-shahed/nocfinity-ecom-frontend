import { api } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type {
  DashboardStats,
  RecentOrder,
  SalesChartData,
} from "../types/dashboard.types";

export const dashboardApi = {
  getStats() {
    return api.get<ApiSuccessResponse<DashboardStats>>("/admin/dashboard");
  },

  getSalesChart(days: number = 30) {
    return api.get<ApiSuccessResponse<SalesChartData>>(
      `/admin/dashboard/sales?days=${days}`
    );
  },

  getRecentOrders(limit: number = 6) {
    return api.get<ApiSuccessResponse<RecentOrder[]>>(
      `/admin/dashboard/recent-orders?limit=${limit}`
    );
  },
};
