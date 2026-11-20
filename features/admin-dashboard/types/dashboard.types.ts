import type { AdminOrder } from "@/features/admin-orders/types/admin-order.types";

export interface DashboardStats {
  today_orders: number;
  today_revenue: number;
  total_customers: number;
  low_stock_count: number;
  store_currency: string;
}

export interface SalesChartPoint {
  date: string;
  label: string;
  orders_count: number;
  revenue: number;
}

export interface SalesChartSummary {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
}

export interface SalesChartData {
  period_days: number;
  store_currency: string;
  summary: SalesChartSummary;
  points: SalesChartPoint[];
}

export type RecentOrder = AdminOrder;
