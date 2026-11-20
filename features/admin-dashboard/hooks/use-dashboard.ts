"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export const DASHBOARD_QUERY_KEY = ["admin", "dashboard"] as const;

export function useDashboardStats() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "stats"],
    queryFn: async () => (await dashboardApi.getStats()).data,
    refetchInterval: 1000 * 60, // Refresh every minute
  });
}

export function useSalesChart(days: number = 30) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "sales", days],
    queryFn: async () => (await dashboardApi.getSalesChart(days)).data,
  });
}

export function useRecentOrders(limit: number = 6) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "recent-orders", limit],
    queryFn: async () => (await dashboardApi.getRecentOrders(limit)).data,
  });
}
