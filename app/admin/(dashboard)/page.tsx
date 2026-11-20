"use client";

import {
  AlertTriangle,
  Calendar,
  CreditCard,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAdminPermissions } from "@/features/admin-auth/hooks/use-admin-auth";
import { hasAnyPermission } from "@/features/admin-rbac/lib/permissions";
import { NoAccess } from "@/features/admin-rbac/components/no-access";
import {
  useDashboardStats,
  useRecentOrders,
  useSalesChart,
} from "@/features/admin-dashboard/hooks/use-dashboard";
import { DashboardStatCard } from "@/features/admin-dashboard/components/dashboard-stat-card";
import { DashboardSalesChart } from "@/features/admin-dashboard/components/dashboard-sales-chart";
import { DashboardRecentOrders } from "@/features/admin-dashboard/components/dashboard-recent-orders";
import { DashboardQuickActions } from "@/features/admin-dashboard/components/dashboard-quick-actions";

export default function AdminDashboardPage() {
  const { permissions, isLoading: permissionsLoading } = useAdminPermissions();

  if (permissionsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!hasAnyPermission(permissions, ["dashboard.view", "reports.view"])) {
    return <NoAccess />;
  }

  return <DashboardContent />;
}

function DashboardContent() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: salesData, isLoading: salesLoading } = useSalesChart(30);
  const { data: recentOrders, isLoading: ordersLoading } = useRecentOrders(6);

  const todayDateString = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Store Overview
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Live business performance, orders fulfillment, and inventory health.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-2xs self-start sm:self-auto">
          <Calendar className="size-3.5 text-primary" />
          <span>{todayDateString}</span>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Revenue */}
        <DashboardStatCard
          title="Today's Revenue"
          value={
            statsLoading
              ? "..."
              : `$${(stats?.today_revenue ?? 0).toFixed(2)}`
          }
          subtext="Confirmed paid orders today"
          icon={CreditCard}
          badge="Live Today"
          badgeVariant="success"
        />

        {/* Today's Orders */}
        <DashboardStatCard
          title="Today's Orders"
          value={statsLoading ? "..." : (stats?.today_orders ?? 0)}
          subtext="Successful checkouts today"
          icon={ShoppingBag}
          badge="Paid"
          badgeVariant="default"
        />

        {/* Total Customers */}
        <DashboardStatCard
          title="Total Customers"
          value={statsLoading ? "..." : (stats?.total_customers ?? 0)}
          subtext="Registered customer accounts"
          icon={Users}
          badge="Shoppers"
          badgeVariant="default"
        />

        {/* Low-Stock Count */}
        <DashboardStatCard
          title="Low-Stock Alerts"
          value={statsLoading ? "..." : (stats?.low_stock_count ?? 0)}
          subtext="Garment variants with <= 5 stock"
          icon={AlertTriangle}
          badge={
            (stats?.low_stock_count ?? 0) > 0 ? "Needs Restock" : "Optimal"
          }
          badgeVariant={
            (stats?.low_stock_count ?? 0) > 0 ? "warning" : "success"
          }
        />
      </div>

      {/* 30-Day Sales Chart & Quick Operations */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <DashboardSalesChart data={salesData} isLoading={salesLoading} />
        <DashboardQuickActions />
      </div>

      {/* Recent Orders Table */}
      <DashboardRecentOrders
        orders={recentOrders}
        isLoading={ordersLoading}
      />
    </div>
  );
}
